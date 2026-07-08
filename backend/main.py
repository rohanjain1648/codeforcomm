"""KisanAlert API — crop recommendation, dry-spell advisory, health logging, SMS.

Run:  uvicorn main:app --reload --port 8000
Prod: same container on Cloud Run.
"""
import os
import time
import uuid
import logging
from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

import data
import services
import gcp

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="KisanAlert API", version="1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], allow_methods=["*"], allow_headers=["*"],
)

# In-memory stores (prod path: Firestore / BigQuery)
HEALTH_LOGS: list[dict] = []
SMS_SUBSCRIPTIONS: list[dict] = []


# ── Models ────────────────────────────────────────────────────────────────────

class RecommendReq(BaseModel):
    district: str
    season: str = "kharif"
    irrigation: str = "borewell"
    groundwater: str = ""          # shallow|medium|deep — blank = use district default
    acres: float = 2.0
    lang: str = "en"


class HealthLogReq(BaseModel):
    farmer: str = "Farmer"
    village: str = ""
    crop: str = ""
    description: str = ""
    image_b64: str | None = None
    lang: str = "en"


class SmsSubscribeReq(BaseModel):
    phone: str
    location: str
    lang: str = "en"


class RskUpdateReq(BaseModel):
    log_id: str
    status: str                    # resolved | callback | pending


class TranslateReq(BaseModel):
    text: str
    target_lang: str
    source_lang: str = "en"


class TtsReq(BaseModel):
    text: str
    lang: str = "en"


class SttReq(BaseModel):
    audio_b64: str
    lang: str = "en"
    sample_rate: int = 48000


class IvrReq(BaseModel):
    session_id: str
    text: str
    lang: str = "en"


# ── 1. Crop recommendation engine ────────────────────────────────────────────

@app.post("/api/recommend")
def recommend(req: RecommendReq):
    district = data.get_district(req.district)
    gw = req.groundwater or district["gw"]
    supply = district["rain_mm"] * data.IRRIGATION_FACTOR.get(req.irrigation, 1.0)

    # Earth Engine overlay: live NDVI (vegetation/moisture proxy) nudges the
    # water score when configured; falls back to the static district table.
    satellite = gcp.get_satellite_context(district["lat"], district["lon"])
    ndvi_factor = 1.0
    if satellite and satellite.get("ndvi") is not None:
        ndvi_factor = max(0.7, min(1.3, 0.85 + satellite["ndvi"] * 0.6))

    results = []
    for key, crop in data.CROPS.items():
        soil_score = crop["soil"].get(district["soil"], 0.3) * 35

        ratio = min(supply / crop["water_mm"], 1.3)
        water_score = min(min(ratio, 1.0) * 30 * ndvi_factor, 30)
        # Deep groundwater + borewell punishes thirsty crops
        if req.irrigation == "borewell" and crop["water_mm"] > 800:
            water_score *= (1 - data.GW_PENALTY[gw])

        season_score = 15 if req.season in crop["seasons"] else 3

        revenue = data.revenue_per_acre(crop)
        roi = (revenue - crop["cost"]) / crop["cost"]
        econ_score = max(0.0, min(roi / 2.0, 1.0)) * 20

        total = round(soil_score + water_score + season_score + econ_score)
        deficit_pct = round((1 - min(supply / crop["water_mm"], 1.0)) * 100)
        results.append({
            "key": key, "label": crop["label"], "icon": crop["icon"],
            "score": total,
            "breakdown": {
                "soil": round(soil_score), "water": round(water_score),
                "season": season_score, "economics": round(econ_score),
            },
            "water_deficit_pct": deficit_pct,
            "duration_days": crop["duration_days"],
            "cost_per_acre": crop["cost"],
            "revenue_per_acre": revenue,
            "profit_total": int((revenue - crop["cost"]) * req.acres),
            "note": crop["note"],
        })

    results.sort(key=lambda r: r["score"], reverse=True)
    top = results[0]

    gemini_reason = services.gemini(
        f"You are an agronomist. District {district['district']} ({district['zone']}), "
        f"{district['soil']} soil, {district['rain_mm']}mm annual rain, {gw} groundwater, "
        f"{req.irrigation} irrigation, {req.season} season, {req.acres} acres. "
        f"Our engine recommends {top['label']} (score {top['score']}/100). "
        f"Explain to the farmer in simple words why this beats habit crops like paddy, "
        f"and give 3 first steps.",
        lang=req.lang,
    )
    ai_reason = gemini_reason or (
        f"{top['icon']} {top['label']} suits your {district['soil']} soil and "
        f"{district['rain_mm']}mm rainfall best (score {top['score']}/100). "
        f"{top['note']} Expected profit on {req.acres} acres: ₹{top['profit_total']:,}. "
        "Steps: 1) Get certified seed from your RSK. 2) Soil-test before sowing. "
        "3) Follow the dry-spell alerts on this app for irrigation timing."
    )

    return {
        "district": district, "groundwater": gw,
        "effective_water_mm": int(supply),
        "recommendations": results,
        "ai_advice": ai_reason,
        "ai_live": gemini_reason is not None,
        "satellite": satellite,
        "satellite_live": satellite is not None,
    }


# ── 2. Advisory + dry-spell alerts ───────────────────────────────────────────

@app.get("/api/advisory")
def advisory(location: str, lang: str = "en"):
    geo = services.geocode(location)
    if not geo:
        return {"error": f"Could not find '{location}'. Try a district or town name."}
    fc = services.get_forecast(geo["lat"], geo["lon"])
    if not fc:
        return {"error": "Weather service unavailable. Try again."}

    analysis = services.analyze_dry_spell(fc)
    cur = fc.get("current", {})

    return {
        "location": {**geo},
        "current": {
            "temp": cur.get("temperature_2m"),
            "humidity": cur.get("relative_humidity_2m"),
            "wind": cur.get("wind_speed_10m"),
            "rain": cur.get("precipitation"),
        },
        **analysis,
    }


# ── 3. Crop health logging → Gemini diagnosis → RSK escalation ──────────────

DEMO_DIAGNOSES = {
    "default": {
        "disease": "Leaf Spot (suspected fungal)", "confidence": 55, "severity": "medium",
        "treatment": "1) Remove infected leaves and burn away from field. "
                     "2) Spray neem oil 3% (3ml/L + 2ml soap) at dusk, repeat in 5 days. "
                     "3) Avoid overhead watering; irrigate at the root zone.",
    },
}


@app.post("/api/health/log")
def health_log(req: HealthLogReq):
    prompt = (
        f"A farmer grows {req.crop or 'a crop'} and reports: '{req.description}'. "
        "Diagnose the most likely disease/pest from the description"
        + (" and the attached photo" if req.image_b64 else "")
        + ". Reply in exactly this format:\n"
          "DISEASE: <name>\nCONFIDENCE: <0-100>\nSEVERITY: <low|medium|high>\n"
          "TREATMENT: <3 numbered organic-first steps>"
    )
    raw = services.gemini(prompt, image_b64=req.image_b64, lang=req.lang)

    if raw:
        diag = _parse_diagnosis(raw)
    else:
        diag = dict(DEMO_DIAGNOSES["default"])

    escalate = diag["severity"] == "high" or diag["confidence"] < 60
    log = {
        "id": uuid.uuid4().hex[:8],
        "ts": int(time.time()),
        "farmer": req.farmer, "village": req.village, "crop": req.crop,
        "description": req.description,
        "has_photo": bool(req.image_b64),
        **diag,
        "escalated": escalate,
        "status": "pending" if escalate else "self_treat",
        "ai_live": raw is not None,
    }
    HEALTH_LOGS.append(log)
    return log


def _parse_diagnosis(raw: str) -> dict:
    diag = {"disease": "Unidentified", "confidence": 50, "severity": "medium",
            "treatment": raw}
    for line in raw.splitlines():
        up = line.upper()
        if up.startswith("DISEASE:"):
            diag["disease"] = line.split(":", 1)[1].strip()
        elif up.startswith("CONFIDENCE:"):
            try:
                diag["confidence"] = int("".join(c for c in line.split(":", 1)[1] if c.isdigit()) or 50)
            except ValueError:
                pass
        elif up.startswith("SEVERITY:"):
            sev = line.split(":", 1)[1].strip().lower()
            if sev in ("low", "medium", "high"):
                diag["severity"] = sev
        elif up.startswith("TREATMENT:"):
            idx = raw.upper().find("TREATMENT:")
            diag["treatment"] = raw[idx + len("TREATMENT:"):].strip()
            break
    return diag


@app.get("/api/rsk/queue")
def rsk_queue():
    escalated = [l for l in HEALTH_LOGS if l["escalated"]]
    return {
        "queue": sorted(escalated, key=lambda l: l["ts"], reverse=True),
        "stats": {
            "total_logs": len(HEALTH_LOGS),
            "escalated": len(escalated),
            "pending": sum(1 for l in escalated if l["status"] == "pending"),
            "resolved": sum(1 for l in escalated if l["status"] == "resolved"),
        },
    }


@app.post("/api/rsk/update")
def rsk_update(req: RskUpdateReq):
    for log in HEALTH_LOGS:
        if log["id"] == req.log_id:
            log["status"] = req.status
            return {"ok": True, "log": log}
    return {"ok": False, "error": "log not found"}


# ── 4. SMS gateway (simulated; prod: MSG91/Twilio/WhatsApp Business) ─────────

SMS_TEMPLATES = {
    "en": "KisanAlert {loc}: {msg} Next rain: {rain}. Helpline 1800-180-1551",
    "hi": "किसान अलर्ट {loc}: {msg} अगली बारिश: {rain}. हेल्पलाइन 1800-180-1551",
    "te": "కిసాన్ అలర్ట్ {loc}: {msg} తదుపరి వర్షం: {rain}. హెల్ప్‌లైన్ 1800-180-1551",
}

SMS_MSG = {
    "red":   {"en": "SEVERE {days}-day dry spell from {start}. Irrigate now, mulch fields.",
              "hi": "गंभीर {days}-दिन सूखा {start} से। अभी सिंचाई करें, मल्चिंग करें।",
              "te": "తీవ్రమైన {days}-రోజుల పొడి వాతావరణం {start} నుండి. వెంటనే నీరు పెట్టండి."},
    "amber": {"en": "{days}-day dry spell from {start}. Plan irrigation this week.",
              "hi": "{days}-दिन सूखा {start} से। इस सप्ताह सिंचाई की योजना बनाएं।",
              "te": "{days}-రోజుల పొడి వాతావరణం {start} నుండి. ఈ వారం నీటి ప్రణాళిక చేయండి."},
    "green": {"en": "Weather normal. Good week for field work.",
              "hi": "मौसम सामान्य। खेत के काम के लिए अच्छा सप्ताह।",
              "te": "వాతావరణం సాధారణం. పొల పనులకు మంచి వారం."},
}


@app.get("/api/sms/preview")
def sms_preview(location: str, lang: str = "en"):
    adv = advisory(location, lang)
    if "error" in adv:
        return adv
    level = adv["level"]
    ds = adv["dry_spell"]

    # Hand-authored templates exist for en/hi/te. For the other 7 supported
    # languages, translate the fully-composed English SMS via Cloud
    # Translation when configured; otherwise ship the English fallback.
    msg_en = SMS_MSG[level]["en"].format(days=ds["days"], start=ds["start"] or "-")
    sms_en = SMS_TEMPLATES["en"].format(
        loc=adv["location"]["name"], msg=msg_en, rain=adv["next_rain"] or "none in 16d",
    )

    if lang in ("en", "hi", "te"):
        msg = SMS_MSG[level][lang].format(days=ds["days"], start=ds["start"] or "-")
        sms = SMS_TEMPLATES[lang].format(
            loc=adv["location"]["name"], msg=msg, rain=adv["next_rain"] or "none in 16d",
        )
        translate_live = False
    else:
        translated = gcp.translate(sms_en, lang)
        sms = translated or sms_en
        translate_live = translated is not None

    return {"sms": sms[:320], "level": level, "chars": len(sms), "translate_live": translate_live}


@app.post("/api/sms/subscribe")
def sms_subscribe(req: SmsSubscribeReq):
    SMS_SUBSCRIPTIONS.append({**req.model_dump(), "ts": int(time.time())})
    return {"ok": True, "subscribers": len(SMS_SUBSCRIPTIONS)}


# ── 5. Cloud Translation / Text-to-Speech / Speech-to-Text ──────────────────

@app.post("/api/translate")
def translate(req: TranslateReq):
    result = gcp.translate(req.text, req.target_lang, req.source_lang)
    return {"translated": result or req.text, "live": result is not None}


@app.post("/api/tts")
def tts(req: TtsReq):
    audio = gcp.synthesize_speech(req.text, req.lang)
    return {"audio_b64": audio, "live": audio is not None}


@app.post("/api/stt")
def stt(req: SttReq):
    text = gcp.transcribe_speech(req.audio_b64, req.lang, req.sample_rate)
    return {"text": text or "", "live": text is not None}


# ── 6. Earth Engine satellite lookup (standalone, for map/debug use) ────────

@app.get("/api/satellite")
def satellite(lat: float, lon: float):
    result = gcp.get_satellite_context(lat, lon)
    return {**(result or {"ndvi": None, "soil_moisture_mm": None}), "live": result is not None}


# ── 7. District hotspot map data (Google Maps Platform overlay) ─────────────

_DISTRICT_CACHE: dict[str, dict] = {}
_DISTRICT_CACHE_TTL = 1800  # 30 min — Open-Meteo forecast doesn't need to be re-pulled every page load


@app.get("/api/districts")
def districts_hotspot():
    now = time.time()
    out = []
    for key, d in data.DISTRICTS.items():
        if key == "default":
            continue
        cached = _DISTRICT_CACHE.get(key)
        if cached and now - cached["ts"] < _DISTRICT_CACHE_TTL:
            out.append(cached["data"])
            continue
        level = "green"
        try:
            fc = services.get_forecast(d["lat"], d["lon"])
            if fc:
                level = services.analyze_dry_spell(fc)["level"]
        except Exception as e:
            logger.error(f"districts_hotspot forecast failed for {key}: {e}")
        entry = {
            "key": key, "district": key.title(), "lat": d["lat"], "lon": d["lon"],
            "level": level, "zone": d["zone"],
        }
        _DISTRICT_CACHE[key] = {"ts": now, "data": entry}
        out.append(entry)
    return {"districts": out}


# ── 8. Dialogflow-backed conversational endpoint (SMS/IVR flows) ────────────
# Uses Dialogflow ES detectIntent when a service account + agent are
# configured; otherwise a keyword-based classifier routes to the same
# downstream services (recommend / advisory / health) so the flow still works.

@app.post("/api/ivr")
def ivr(req: IvrReq):
    df = gcp.detect_intent(req.session_id, req.text, req.lang)
    intent = df["intent"] if df else gcp.classify_intent_fallback(req.text)["intent"]
    live = df is not None

    if intent == "crop_recommendation":
        district_guess = req.text.split()[-1] if req.text.split() else ""
        res = recommend(RecommendReq(district=district_guess or "default", lang=req.lang))
        response_text = res["ai_advice"]
    elif intent == "weather_alert":
        adv = advisory(req.text, req.lang)
        response_text = (
            "; ".join(a["msg"] for a in adv["alerts"]) if "alerts" in adv else adv.get("error", "")
        )
    elif intent == "health_report":
        response_text = (
            "Please send a photo of the affected crop, or describe the symptoms — "
            "I'll diagnose it and connect you to your Rythu Seva Kendra if needed."
        )
    elif intent == "subscribe":
        response_text = "To subscribe for daily SMS alerts, share your mobile number and village name."
    else:
        response_text = (
            "I can help with: crop recommendations, weather/dry-spell alerts, or crop disease diagnosis. "
            "What would you like?"
        )

    if req.lang != "en":
        response_text = gcp.translate(response_text, req.lang) or response_text

    return {"intent": intent, "response_text": response_text, "live": live}


@app.get("/api/status")
def status():
    return {
        "ok": True,
        "gemini": services.gemini_ready(),
        "translate": gcp.translate_ready(),
        "tts": gcp.tts_ready(),
        "stt": gcp.stt_ready(),
        "earthengine": gcp.earthengine_ready(),
        "dialogflow": gcp.dialogflow_ready(),
        "logs": len(HEALTH_LOGS),
        "subscribers": len(SMS_SUBSCRIPTIONS),
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.environ.get("PORT", 8000)))

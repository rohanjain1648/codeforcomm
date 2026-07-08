"""External services: Open-Meteo weather, dry-spell detector, Gemini client."""
import os
import logging
import requests

logger = logging.getLogger(__name__)

GEMINI_MODEL = "gemini-2.5-flash"
GEMINI_URL = (
    "https://generativelanguage.googleapis.com/v1beta/models/"
    f"{GEMINI_MODEL}:generateContent"
)

LANG_NAME = {
    "en": "English", "hi": "Hindi", "ta": "Tamil", "te": "Telugu", "mr": "Marathi",
    "pa": "Punjabi", "bn": "Bengali", "kn": "Kannada", "ml": "Malayalam", "gu": "Gujarati",
}


# ── Weather (Open-Meteo — prod path: IMD feeds + Earth Engine soil moisture) ──

def geocode(location: str) -> dict | None:
    try:
        r = requests.get(
            "https://geocoding-api.open-meteo.com/v1/search",
            params={"name": location, "count": 1, "country_code": "IN"},
            timeout=10,
        )
        results = r.json().get("results") or []
        if not results:
            return None
        g = results[0]
        return {"lat": g["latitude"], "lon": g["longitude"],
                "name": g["name"], "admin": g.get("admin1", "")}
    except Exception as e:
        logger.error(f"geocode failed: {e}")
        return None


def get_forecast(lat: float, lon: float) -> dict | None:
    try:
        r = requests.get(
            "https://api.open-meteo.com/v1/forecast",
            params={
                "latitude": lat, "longitude": lon,
                "daily": "precipitation_sum,temperature_2m_max,temperature_2m_min,"
                         "wind_speed_10m_max,et0_fao_evapotranspiration",
                "current": "temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m",
                "past_days": 7, "forecast_days": 16, "timezone": "Asia/Kolkata",
            },
            timeout=12,
        )
        return r.json()
    except Exception as e:
        logger.error(f"forecast failed: {e}")
        return None


# ── Dry-spell detection + day-action advisories ──────────────────────────────

def analyze_dry_spell(forecast: dict) -> dict:
    daily = forecast.get("daily", {})
    dates = daily.get("time", [])
    precip = daily.get("precipitation_sum", [])
    tmax = daily.get("temperature_2m_max", [])
    wind = daily.get("wind_speed_10m_max", [])

    past = [(p or 0) for p in precip[:7]]
    future = [(p or 0) for p in precip[7:]]
    future_dates = dates[7:]

    # Longest dry run in the 16-day outlook, and the run starting from today
    runs, run_start, cur = [], 0, 0
    for i, p in enumerate(future):
        if p < 2.0:
            if cur == 0:
                run_start = i
            cur += 1
        else:
            if cur:
                runs.append({"start": future_dates[run_start], "days": cur})
            cur = 0
    if cur:
        runs.append({"start": future_dates[run_start], "days": cur})
    longest = max(runs, key=lambda r: r["days"]) if runs else {"start": None, "days": 0}

    level = "green"
    if longest["days"] >= 7:
        level = "red"
    elif longest["days"] >= 4:
        level = "amber"

    # Next rain day
    next_rain = next(
        (future_dates[i] for i, p in enumerate(future) if p >= 5.0), None
    )

    alerts: list[dict] = []
    if level != "green":
        alerts.append({
            "type": "dry_spell", "level": level,
            "msg": f"{longest['days']}-day dry spell from {longest['start']}. "
                   "Schedule irrigation now; mulch to cut evaporation 40%.",
        })
    rain_48h = sum(future[:2]) >= 10
    if rain_48h:
        alerts.append({
            "type": "rain", "level": "amber",
            "msg": "Rain >10mm expected within 48h — hold fertilizer top-dressing and sprays.",
        })
    if future and len(wind) > 7 and (wind[7] or 0) > 25:
        alerts.append({
            "type": "wind", "level": "amber",
            "msg": "Wind above 25 km/h today — postpone all foliar sprays (drift risk).",
        })
    if len(tmax) > 7 and (tmax[7] or 0) >= 38:
        alerts.append({
            "type": "heat", "level": "red",
            "msg": "Heat above 38°C — irrigate evenings only; apply straw mulch to protect roots.",
        })
    if not alerts:
        alerts.append({
            "type": "ok", "level": "green",
            "msg": "No adverse weather in the outlook. Good window for field operations.",
        })

    return {
        "level": level,
        "dry_spell": longest,
        "next_rain": next_rain,
        "past_week_rain_mm": round(sum(past), 1),
        "outlook_rain_mm": round(sum(future), 1),
        "alerts": alerts,
        "daily": [
            {"date": d, "rain": r, "tmax": t}
            for d, r, t in zip(future_dates[:10], future[:10],
                               (tmax[7:17] if len(tmax) > 7 else []))
        ],
    }


# ── Gemini (Google AI Studio key; prod path: Vertex AI) ──────────────────────

def gemini_ready() -> bool:
    return bool(os.environ.get("GEMINI_API_KEY", "").strip() or os.environ.get("GROQ_API_KEY", "").strip())


def groq_call(prompt: str, image_b64: str | None = None, lang: str = "en") -> str | None:
    key = os.environ.get("GROQ_API_KEY", "").strip()
    if not key:
        return None
    
    url = "https://api.groq.com/openai/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {key}",
        "Content-Type": "application/json"
    }
    
    lang_note = f"\nRespond in {LANG_NAME.get(lang, 'English')}. Keep under 150 words, numbered steps."
    full_prompt = prompt + lang_note
    
    if image_b64:
        model = "llama-3.2-11b-vision-preview"
        messages = [
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": full_prompt},
                    {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{image_b64}"}}
                ]
            }
        ]
    else:
        model = "llama-3.3-70b-versatile"
        messages = [{"role": "user", "content": full_prompt}]
        
    try:
        r = requests.post(
            url,
            headers=headers,
            json={
                "model": model,
                "messages": messages,
                "temperature": 0.4,
                "max_tokens": 500
            },
            timeout=30,
        )
        data = r.json()
        if "error" in data:
            logger.error(f"Groq API error: {data['error']}")
            return None
        return data["choices"][0]["message"]["content"].strip()
    except Exception as e:
        logger.error(f"Groq call failed: {e}")
        return None


def gemini(prompt: str, image_b64: str | None = None, lang: str = "en") -> str | None:
    """Call Gemini or Groq fallback; returns None when no key / on error so callers can fall back."""
    # Try Gemini first
    key = os.environ.get("GEMINI_API_KEY", "").strip()
    if key:
        parts: list[dict] = []
        if image_b64:
            parts.append({"inline_data": {"mime_type": "image/jpeg", "data": image_b64}})
        lang_note = f"\nRespond in {LANG_NAME.get(lang, 'English')}. Keep under 150 words, numbered steps."
        parts.append({"text": prompt + lang_note})

        try:
            r = requests.post(
                GEMINI_URL,
                params={"key": key},
                json={"contents": [{"parts": parts}],
                      "generationConfig": {"maxOutputTokens": 500, "temperature": 0.4}},
                timeout=30,
            )
            data = r.json()
            if "error" not in data and "candidates" in data:
                return data["candidates"][0]["content"]["parts"][0]["text"].strip()
            logger.error(f"Gemini API error: {data.get('error')}")
        except Exception as e:
            logger.error(f"Gemini call failed: {e}")

    # Fallback to Groq
    return groq_call(prompt, image_b64, lang)

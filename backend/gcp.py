"""Google Cloud integrations: Translation, Text-to-Speech, Speech-to-Text
(REST + API key — same pattern as services.gemini), Earth Engine and
Dialogflow (service-account auth — required by those two products).

Every function degrades gracefully: with no credentials configured it
returns None so callers fall back to browser-native or static behavior,
exactly like services.gemini() already does.
"""
import os
import base64
import logging
from datetime import datetime, timedelta, timezone

import requests

logger = logging.getLogger(__name__)

# BCP-47 locale codes (voice APIs) and ISO-639-1 codes (Translation API) for
# the 10 languages KisanAlert supports — the same set as the sibling
# KisanVoice project, chosen for broad native coverage across India.
LANG_BCP47 = {
    "en": "en-IN", "hi": "hi-IN", "ta": "ta-IN", "te": "te-IN", "mr": "mr-IN",
    "pa": "pa-IN", "bn": "bn-IN", "kn": "kn-IN", "ml": "ml-IN", "gu": "gu-IN",
}
LANG_ISO = {k: k for k in LANG_BCP47}  # Translation API wants bare ISO codes


# ── Cloud Translation v2 (REST + API key) ────────────────────────────────────

def translate_ready() -> bool:
    return bool(os.environ.get("GOOGLE_CLOUD_API_KEY", "").strip())


def translate(text: str, target_lang: str, source_lang: str = "en") -> str | None:
    key = os.environ.get("GOOGLE_CLOUD_API_KEY", "").strip()
    if not key or not text.strip():
        return None
    target = LANG_ISO.get(target_lang, target_lang)
    if target == source_lang:
        return text
    try:
        r = requests.post(
            "https://translation.googleapis.com/language/translate/v2",
            params={"key": key},
            json={"q": text, "target": target, "source": source_lang, "format": "text"},
            timeout=15,
        )
        data = r.json()
        return data["data"]["translations"][0]["translatedText"]
    except Exception as e:
        logger.error(f"Translate API failed: {e}")
        return None


# ── Cloud Text-to-Speech v1 (REST + API key) ─────────────────────────────────

def tts_ready() -> bool:
    return bool(os.environ.get("GOOGLE_CLOUD_API_KEY", "").strip())


def synthesize_speech(text: str, lang: str) -> str | None:
    """Returns base64-encoded MP3, or None on failure/no key."""
    key = os.environ.get("GOOGLE_CLOUD_API_KEY", "").strip()
    if not key or not text.strip():
        return None
    locale = LANG_BCP47.get(lang, "en-IN")
    try:
        r = requests.post(
            "https://texttospeech.googleapis.com/v1/text:synthesize",
            params={"key": key},
            json={
                "input": {"text": text[:900]},
                "voice": {"languageCode": locale, "ssmlGender": "FEMALE"},
                "audioConfig": {"audioEncoding": "MP3", "speakingRate": 0.95},
            },
            timeout=20,
        )
        data = r.json()
        return data.get("audioContent")
    except Exception as e:
        logger.error(f"TTS API failed: {e}")
        return None


# ── Cloud Speech-to-Text v1 (REST + API key) ─────────────────────────────────

def stt_ready() -> bool:
    return bool(os.environ.get("GOOGLE_CLOUD_API_KEY", "").strip())


def transcribe_speech(audio_b64: str, lang: str, sample_rate: int = 48000) -> str | None:
    """Expects WEBM_OPUS audio (browser MediaRecorder default). Returns transcript or None."""
    key = os.environ.get("GOOGLE_CLOUD_API_KEY", "").strip()
    if not key or not audio_b64:
        return None
    locale = LANG_BCP47.get(lang, "en-IN")
    try:
        r = requests.post(
            "https://speech.googleapis.com/v1/speech:recognize",
            params={"key": key},
            json={
                "config": {
                    "encoding": "WEBM_OPUS",
                    "sampleRateHertz": sample_rate,
                    "languageCode": locale,
                    "alternativeLanguageCodes": ["en-IN", "hi-IN"],
                },
                "audio": {"content": audio_b64},
            },
            timeout=25,
        )
        data = r.json()
        results = data.get("results") or []
        if not results:
            return ""
        return " ".join(res["alternatives"][0]["transcript"] for res in results).strip()
    except Exception as e:
        logger.error(f"Speech-to-Text API failed: {e}")
        return None


# ── Earth Engine (service account — satellite NDVI + soil moisture) ─────────
# Dataset IDs: MODIS/061/MOD13Q1 (16-day NDVI composite, 250m, scale x10000)
# and NASA_USDA/HSL/SMAP10KM_soil_moisture (surface soil moisture, mm).
# Replaces the static district soil/rainfall table with a live read when
# configured — see data.py for the fallback table this overlays.

_ee_initialized = False
_ee_available = False


def _ee_init() -> bool:
    global _ee_initialized, _ee_available
    if _ee_initialized:
        return _ee_available
    _ee_initialized = True
    key_path = os.environ.get("EE_SERVICE_ACCOUNT_KEY", "").strip()
    sa_email = os.environ.get("EE_SERVICE_ACCOUNT_EMAIL", "").strip()
    if not key_path or not sa_email:
        return False
    try:
        import ee
        credentials = ee.ServiceAccountCredentials(sa_email, key_path)
        ee.Initialize(credentials)
        _ee_available = True
        logger.info("Earth Engine initialized")
    except ImportError:
        logger.error("earthengine-api not installed. Run: pip install earthengine-api")
    except Exception as e:
        logger.error(f"Earth Engine init failed: {e}")
    return _ee_available


def earthengine_ready() -> bool:
    return _ee_init()


def get_satellite_context(lat: float, lon: float) -> dict | None:
    if not _ee_init():
        return None
    try:
        import ee
        point = ee.Geometry.Point([lon, lat])
        end = datetime.now(timezone.utc)
        start = end - timedelta(days=32)

        ndvi_img = (
            ee.ImageCollection("MODIS/061/MOD13Q1")
            .filterDate(start.isoformat(), end.isoformat())
            .select("NDVI")
            .mean()
        )
        ndvi_raw = ndvi_img.reduceRegion(ee.Reducer.mean(), point, 250).get("NDVI").getInfo()
        ndvi = round(ndvi_raw / 10000, 3) if ndvi_raw is not None else None

        sm_img = (
            ee.ImageCollection("NASA_USDA/HSL/SMAP10KM_soil_moisture")
            .filterDate(start.isoformat(), end.isoformat())
            .select("ssm")
            .mean()
        )
        sm_raw = sm_img.reduceRegion(ee.Reducer.mean(), point, 10000).get("ssm").getInfo()
        soil_moisture = round(sm_raw, 2) if sm_raw is not None else None

        return {
            "ndvi": ndvi,
            "soil_moisture_mm": soil_moisture,
            "source": "MODIS/061/MOD13Q1 + NASA_USDA/HSL/SMAP10KM_soil_moisture",
        }
    except Exception as e:
        logger.error(f"Earth Engine query failed: {e}")
        return None


# ── Dialogflow ES (service account) + rule-based fallback ───────────────────

DIALOGFLOW_LOCALE = LANG_BCP47

INTENT_KEYWORDS: dict[str, list[str]] = {
    "crop_recommendation": [
        "which crop", "what to grow", "recommend", "suggest crop", "best crop", "plant what",
        "फसल", "सुझाव", "उगाऊं", "పంట", "సూచించండి", "పైరு", "பயிர்", "பரிந்துரை", "ಬೆಳೆ", "ಶಿಫಾರಸು",
    ],
    "weather_alert": [
        "weather", "rain", "dry spell", "irrigation", "बारिश", "मौसम", "సిंचाई", "వర్షం", "వాతావరణం",
        "மழை", "வானிலை", "ಮಳೆ", "ಹವಾಮಾನ",
    ],
    "health_report": [
        "disease", "pest", "leaf", "spot", "yellow", "insect", "बीमारी", "कीट", "पत्ती",
        "వ్యాధి", "పురుగు", "ఆకు", "நோய்", "பூச்சி", "ரோಗ", "ಕೀಟ",
    ],
    "subscribe": ["subscribe", "sms alert", "सब्सक्राइब", "సబ్‌స్క్రైబ్", "குழுசேர"],
}


def classify_intent_fallback(text: str) -> dict:
    low = text.lower()
    for intent, keywords in INTENT_KEYWORDS.items():
        if any(kw.lower() in low for kw in keywords):
            return {"intent": intent, "confidence": 0.6, "parameters": {}, "live": False}
    return {"intent": "unknown", "confidence": 0.0, "parameters": {}, "live": False}


def dialogflow_ready() -> bool:
    return bool(
        os.environ.get("GOOGLE_APPLICATION_CREDENTIALS", "").strip()
        and os.environ.get("DIALOGFLOW_PROJECT_ID", "").strip()
    )


def detect_intent(session_id: str, text: str, lang: str = "en") -> dict | None:
    if not dialogflow_ready():
        return None
    try:
        from google.cloud import dialogflow_v2 as dialogflow

        project_id = os.environ["DIALOGFLOW_PROJECT_ID"]
        client = dialogflow.SessionsClient()
        session = client.session_path(project_id, session_id)
        text_input = dialogflow.TextInput(text=text, language_code=DIALOGFLOW_LOCALE.get(lang, "en-IN"))
        query_input = dialogflow.QueryInput(text=text_input)
        response = client.detect_intent(request={"session": session, "query_input": query_input})
        qr = response.query_result
        return {
            "intent": qr.intent.display_name or "unknown",
            "confidence": qr.intent_detection_confidence,
            "fulfillment_text": qr.fulfillment_text,
            "parameters": dict(qr.parameters) if qr.parameters else {},
            "live": True,
        }
    except ImportError:
        logger.error("google-cloud-dialogflow not installed. Run: pip install google-cloud-dialogflow")
        return None
    except Exception as e:
        logger.error(f"Dialogflow detectIntent failed: {e}")
        return None


def audio_b64_to_bytes(audio_b64: str) -> bytes:
    return base64.b64decode(audio_b64)

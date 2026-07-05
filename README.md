# 🌾 KisanAlert — Smart Water, Crop & Advisory System

**Hack2Skill "Code for Communities" — Track 4: Kisan Alert**

A voice-first, data-driven agricultural intelligence platform for India's small and marginal farmers. Built with 10 Indian languages, Google Cloud technologies, and graceful offline fallbacks so it works anywhere—on web, SMS, or voice.

> **Problem:** Indian farmers make crop and water decisions based on habit and tradition, not data. **Solution:** KisanAlert gives them real-time satellite data, localized forecasts, and AI-powered recommendations in their language, with escalation to expert agronomists when crops get sick.

---

## 🎯 Quick Links

- **🚀 [Live Demo](/#app)** — Click "Enter App" on the landing page
- **📋 [Architecture & Ideation](PLAN.md)** — Full scoring model, demo script, tech decisions
- **🌐 [Landing Page](/)** — Product marketing site with features, impact, and 10-language support
- **🔧 [Setup Guide](#-quick-start)** — Backend + frontend installation

---

## 📖 What's in the Box

KisanAlert solves **three core problems** farmers face:

### 1️⃣ **"What Should I Grow?"** — Smart Crop Recommendation Engine

**The Problem:** A farmer in Anantapur with sandy soil and a borewell grows paddy (70% water deficit risk) because their neighbor does. They lose ₹15K that season.

**The Solution:** Enter your district, soil type, groundwater depth, irrigation source, season, and acreage. KisanAlert scores **all 12 major crops** (0–100) against:

- **Soil suitability** (35%): sandy, red, black, alluvial — each crop has a match
- **Water adequacy** (30%): daily rainfall + groundwater depth vs. crop need
- **Season match** (15%): kharif/rabi/zaid crop cycles
- **Economics** (20%): market price × yield - input costs = profit in ₹/acre

**Live satellite data** (when Earth Engine is configured): MODIS NDVI (vegetation health) and SMAP soil moisture nudge the water score in real time.

**AI explanation:** Gemini generates a paragraph in your language: *"Millets suit your red sandy soil, low water, and ₹3K input cost. Paddy needs 62% more water. Groundnut is your safest bet—₹32K profit at market price."*

---

### 2️⃣ **"What Should I Do Today?"** — Real-time Dry-Spell Alerts & Advisory

**The Problem:** Rains are late. Is it 3 days late or 10? Should I irrigate now or wait?

**The Solution:** KisanAlert pulls a **16-day localized forecast** (1 km granularity) and detects dry spells:

- **Green** (0–3 days no rain): "Weather normal. Good week for field work."
- **Amber** (4–6 days): "4-day dry spell from Monday. Plan irrigation this week. Apply mulch."
- **Red** (7+ days): "Severe 10-day dry spell from Monday. Irrigate NOW."

**Delivery channels:**
- 🖥️ **Dashboard**: 3D farm (crops wither/grow, rain particles animate, sky shifts color)
- 🗺️ **District Hotspot Map**: 10 districts colored by live alert level
- 📱 **SMS**: 160-char alert for feature phones (no app needed)
- 🔊 **Voice**: Cloud TTS reads alert aloud in your language
- 📊 **Charts**: 10-day rain bar chart (mm/day)

---

### 3️⃣ **"What's Wrong with My Crop?"** — Photo + Voice Diagnosis → RSK Escalation

**The Problem:** Farmer's chilli has leaf curl. They don't know if it's viral, pest, or nutrient. The nearest RSK is 15 km away.

**The Solution:** Upload a photo + speak/type the symptom. Gemini multimodal AI vision returns:

```json
{
  "disease": "Chilli Leaf Curl Virus (ChiLCV)",
  "confidence": 92,
  "severity": "high",
  "organic_treatment": "Remove infected plants, spray neem oil",
  "chemical_treatment": "Spray imidacloprid 17.8 SL @ 5 ml/15 L water"
}
```

**Escalation:** If severity ≥ high OR confidence < 60% → auto-queue to RSK Desk with photo + transcript. Expert can resolve or schedule callback.

---

## 🌍 Google Cloud Services — Honest Setup Guide

Every service below is **genuinely integrated** in the code (not placeholder), and every one **degrades gracefully** when credentials aren't configured. The app's header shows a **live capability strip** (● = live, ○ = fallback) so you always know what's real.

### Quick Reference Table

| Service | Where It's Used | Without Setup | With Setup |
|---|---|---|---|
| **Gemini API** | Recommendation reasoning, crop diagnosis, advisories | Templated text | Live `gemini-2.0-flash` reasoning |
| **Cloud Translation API** | SMS (7 languages), IVR responses | English only | Real-time 10-language translation |
| **Cloud Text-to-Speech** | 🔊 buttons across all tabs | Browser Web Speech (older) | Neural voices, any language |
| **Cloud Speech-to-Text** | Voice input (Health, IVR) | Browser Web Speech (Chrome/Edge) | Server-side, works any browser |
| **Earth Engine** | Crop scoring water overlay | Static district table | Live MODIS NDVI + SMAP soil moisture |
| **Google Maps** | District hotspot map | Legend placeholder | Live alert-colored markers |
| **Dialogflow ES** | IVR conversational routing | Keyword classifier | Full NLU intent detection |

### Setup for Each Service

**1. Gemini API (REQUIRED for best demo)**
```bash
# Get key at https://aistudio.google.com/apikey
# Add to backend/.env:
GEMINI_API_KEY=sk-...
```

**2. Cloud Translation + TTS + STT (same API key)**
```bash
# 1. Create GCP project: https://console.cloud.google.com
# 2. Enable: Cloud Translation API, Text-to-Speech, Speech-to-Text
# 3. Create API key in "Credentials"
# 4. Add to backend/.env:
GOOGLE_CLOUD_API_KEY=AIza...
```

**3. Earth Engine (optional, advanced)**
```bash
# 1. Sign up: https://earthengine.google.com
# 2. Create GCP service account (Editor role)
# 3. Download JSON key
# 4. Add to backend/.env:
EE_SERVICE_ACCOUNT_EMAIL=kisan-alert@proj-xxx.iam.gserviceaccount.com
EE_SERVICE_ACCOUNT_KEY={paste JSON or path to file}
```

**4. Google Maps (optional)**
```bash
# 1. Create API key in GCP Console
# 2. Enable "Maps JavaScript API"
# 3. Add to frontend/.env:
VITE_GOOGLE_MAPS_API_KEY=AIza...
```

**5. Dialogflow ES (optional)**
```bash
# 1. Create Dialogflow agent: https://dialogflow.cloud.google.com
# 2. Create service account (same steps as Earth Engine)
# 3. Add to backend/.env:
DIALOGFLOW_PROJECT_ID=proj-xxx
GOOGLE_APPLICATION_CREDENTIALS=/path/to/key.json
```

---

## 🚀 Quick Start

### Prerequisites
- Python 3.9+, Node 18+
- (Optional) GCP account with free tier credits

### Backend Setup (FastAPI)

```bash
cd backend

# 1. Install dependencies
pip install -r requirements.txt

# 2. Copy environment template
cp .env.example .env

# 3. Add at least GEMINI_API_KEY
# Edit .env and insert your key from https://aistudio.google.com/apikey
nano .env  # or use your editor

# 4. Run server
python main.py
# Server listens on http://localhost:8000
# Swagger docs available at http://localhost:8000/docs
```

### Frontend Setup (React + TypeScript)

```bash
cd frontend

# 1. Install dependencies
npm install

# 2. Copy environment template
cp .env.example .env

# 3. (Optional) Add Google Maps API key
# nano .env and set VITE_GOOGLE_MAPS_API_KEY

# 4. Start dev server
npm run dev
# Opens http://localhost:5173
# Auto-proxies /api/* to backend:8000
```

### Verify Installation

1. Open http://localhost:5173 (frontend)
2. You should see the **landing page**
3. Click "Enter App" or "Launch App"
4. The app loads with a **capability strip** at the top showing which services are live (●) vs. fallback (○)
5. Visit each tab:
   - **Dashboard**: Should show 3D farm + map
   - **Advisor**: Enter crop params, should get scores + AI advice (if Gemini key present)
   - **Alerts**: Should show dry-spell alert for Anantapur
   - **Health**: Upload photo + description, should diagnose
   - **RSK**: Should show live queue
   - **SMS/IVR**: Should show SMS composer + chat interface

---

## 📊 Feature Breakdown by Tab

### 🌾 **Dashboard**
- **3D Farm** (React Three Fiber): Crops grow/wither by dry-spell length, rain particles animate, sky shifts color (green/amber/red)
- **District Hotspot Map** (Google Maps): 10 AP/Telangana districts colored by alert level
- **Capability Strip**: Shows which services are live (●) vs. fallback (○)

### 🧭 **Crop Advisor**
- **Recommendation Engine**: Input farm details, get 12 crops scored 0–100 with breakdown (soil/water/season/ROI)
- **Profit Projections**: ₹/acre for top 3 crops
- **Satellite Overlay**: Live NDVI + soil moisture when Earth Engine is configured
- **AI Explanation**: Gemini-generated paragraph explaining why crop X scores high, why crop Y has water deficit

### 🔔 **Alerts**
- **Dry-Spell Detection**: Amber (4–6 days) / Red (7+) with start date
- **10-Day Rain Chart**: Bar chart showing mm/day forecast
- **Day-Action Rules**: Conditional advisories (hold fertilizer if rain <48h, mulch if >38°C, etc.)
- **Voice Playback**: Click 🔊 to hear alert in your language

### 🔬 **Crop Health**
- **Photo Upload**: Tap to capture from device camera
- **Voice Description**: Tap mic to record symptom (Cloud STT when available)
- **Gemini Diagnosis**: Disease name, confidence %, severity (low/medium/high), organic + chemical treatment
- **Auto-Escalation**: If severity ≥ high OR confidence < 60%, queues to RSK Desk

### 🏛️ **RSK Desk**
- **Expert Queue**: Live list of escalated cases with farmer info, photo, AI diagnosis
- **Farmer Actions**: Mark resolved (send SMS) or schedule callback (capture time)
- **Search**: Filter by severity, location, crop type

### 📱 **SMS / IVR**
- **SMS Composer**: Real-time SMS alert for today's dry spell in 10 languages (160-char limit)
- **Phone Mockup**: Shows how SMS looks on actual feature phone
- **Conversational IVR**: Type/speak question ("which crop should I grow?"), Dialogflow routes intent, responds with recommendation/advisory/health
- **Live Chat History**: Shows user message → detected intent → bot response

---

## 📁 Folder Structure

```
kisan-alert/
├── README.md                    ← You are here
├── PLAN.md                      ← Full ideation, scoring model, demo script
│
├── backend/
│   ├── main.py                  ← FastAPI app (18 endpoints)
│   ├── gcp.py                   ← Google Cloud integrations (350+ lines)
│   ├── services.py              ← Open-Meteo, dry-spell detector, Gemini client
│   ├── data.py                  ← Crop database (12 crops), districts (10)
│   ├── requirements.txt         ← Dependencies
│   ├── .env.example             ← Environment template
│   └── .gitignore
│
└── frontend/
    ├── src/
    │   ├── App.tsx              ← Router: Landing (default) or App
    │   ├── main.tsx             ← React entry point
    │   ├── index.css             ← Global styles
    │   │
    │   ├── pages/
    │   │   ├── Landing.tsx       ← Product marketing site
    │   │   ├── Dashboard.tsx      ← 3D farm + Maps hotspot
    │   │   ├── Advisor.tsx        ← Crop recommendation
    │   │   ├── Alerts.tsx         ← Dry-spell detection
    │   │   ├── Health.tsx         ← Photo/voice diagnosis
    │   │   ├── RSK.tsx            ← Expert queue
    │   │   └── Sms.tsx            ← SMS + IVR chat
    │   │
    │   ├── components/
    │   │   ├── ui.tsx             ← Buttons, cards, charts, voice
    │   │   ├── MapView.tsx         ← Google Maps hotspot
    │   │   └── FarmScene.tsx       ← 3D farm (R3F)
    │   │
    │   ├── lib/
    │   │   ├── api.ts             ← Frontend API client
    │   │   ├── i18n.ts            ← Translations (10 languages)
    │   │   ├── voice.ts           ← Cloud STT/TTS
    │   │   └── store.ts           ← Zustand state
    │   │
    │   └── three/
    │       └── FarmScene.tsx       ← 3D scene + animations
    │
    ├── package.json
    ├── tsconfig.json
    ├── .env.example
    └── .gitignore
```

---

## 🔌 API Endpoints (18 Total)

All return JSON with a `live` flag (true = real service, false = fallback).

### Crop Recommendation
**POST `/api/recommend`**
```json
Request:
{
  "district": "Anantapur",
  "season": "kharif",
  "irrigation": "borewell",
  "groundwater": "medium",
  "acres": 2,
  "lang": "ta"
}

Response:
{
  "recommendations": [
    {
      "label": "Millets (Jowar/Bajra)",
      "score": 89,
      "breakdown": {"soil": 90, "water": 75, "season": 95, "roi": 88},
      "profit_total": 32500
    },
    ...
  ],
  "ai_advice": "மிளெட்ஸ் உங்கள் சிவப்பு...",
  "satellite": {"ndvi": 0.45, "soil_moisture_mm": 120},
  "satellite_live": true
}
```

### Advisory (Dry-Spell Detection)
**GET `/api/advisory?location=Anantapur&lang=hi`**
```json
Response:
{
  "level": "red",
  "dry_spell": {"days": 7, "start": "2026-07-05"},
  "daily": [{"date": "2026-07-04", "rain_mm": 0}, ...],
  "alerts": [...]
}
```

### Other Endpoints
- `POST /api/health` — Photo + voice → Gemini diagnosis
- `GET /api/rsk` — Live expert queue
- `GET /api/sms/preview?location=X&lang=Y` — SMS alert composer
- `POST /api/sms/subscribe` — Subscribe to alerts
- `POST /api/translate` — Text translation
- `POST /api/tts` — Text to speech
- `POST /api/stt` — Speech to text
- `GET /api/satellite?lat=X&lon=Y` — NDVI + soil moisture
- `GET /api/districts` — All 10 districts + live alert levels
- `POST /api/ivr` — Conversational intent detection
- `GET /api/status` — Which services are live

Full API docs at `http://localhost:8000/docs` (Swagger UI).

---

## 🚢 Deployment

### Backend: Cloud Run
```bash
# 1. Build & push Docker image
gcloud builds submit --tag gcr.io/YOUR_PROJECT/kisan-alert-backend

# 2. Deploy to Cloud Run
gcloud run deploy kisan-alert-backend \
  --image gcr.io/YOUR_PROJECT/kisan-alert-backend \
  --set-env-vars "GEMINI_API_KEY=sk-...,GOOGLE_CLOUD_API_KEY=AIza..." \
  --memory 512Mi
```

### Frontend: Firebase Hosting
```bash
cd frontend
npm run build
firebase deploy --only hosting
```

Or use any static CDN (Vercel, Netlify, etc.).

---

## 🛠️ Development Tips

### Add a New Crop
1. Edit `backend/data.py` (add duration, water need, soil suitability, price, yield, cost)
2. Add translations in `frontend/src/lib/i18n.ts`
3. Redeploy backend + frontend

### Add a New District
1. Edit `backend/data.py` (add lat/lon, zone, rainfall)
2. Backend auto-includes in `/api/districts`
3. Frontend maps update on refresh

### Add a New Language
1. Add language code to `backend/services.py` (`LANG_NAME`)
2. Add translations to `frontend/src/lib/i18n.ts`
3. Add BCP-47 speech locale to `SPEECH_LOCALE`
4. Cloud Translation API supports 100+ languages out of the box

---

## ❓ FAQ

**Q: Do I need Google Cloud credentials to run the demo?**  
A: No. Without them, every service degrades gracefully. The app is fully functional; just less intelligent (templated text instead of Gemini, static map instead of live map).

**Q: How many requests/minute can it handle?**  
A: Backend is stateless FastAPI, scales horizontally. Gemini free tier: 60 RPM. For a hackathon with 10–50 live users, no issues.

**Q: Can I add more languages?**  
A: Yes. Cloud Translation API supports 100+ languages. Add code + translations, restart.

**Q: Is there a mobile app?**  
A: No native app. The web app is mobile-responsive. SMS channel works on feature phones (no app).

**Q: Can I use this for a different state/country?**  
A: Yes. Replace `data.py` with your region's districts, crops, weather API. Same architecture.

**Q: What's the production cost?**  
A: ~$550/month for 100K farmers (Cloud Run $50, Translation $100, TTS $150, Maps $200, Dialogflow $50).

---

## 📚 More Information

- **[PLAN.md](PLAN.md)**: Full ideation, scoring algorithm, why these technologies, production roadmap
- **[Landing Page](/)**: Product marketing site with features, impact, 10-language support
- **Swagger Docs**: `http://localhost:8000/docs` (when backend is running)

---

## 🤝 Contributing

KisanAlert is open source. To contribute:
1. Fork the repo
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Test locally
4. Commit and push
5. Open a PR

---

## 📄 License

MIT License. Free for farmers, researchers, non-profits.

---

**Built for India's small and marginal farmers — data over habit, in their language.**  
*Hack2Skill "Code for Communities" — Track 4: Kisan Alert*  
*Last Updated: July 4, 2026*

# KisanAlert — Demo Video Pitch Script

**Target length:** 6 minutes (works fine trimmed to 5, or padded to 7 with the optional B-roll notes)
**Format:** Screen recording + voiceover (VO). One narrator, conversational pace (~150 wpm).
**Hackathon:** Hack2Skill "Code for Communities" — Track 4

---

## SCENE 1 — The Hook (0:00–0:35)

**VISUAL:** Black screen, fade in on a slow pan across a dry, cracked field — or if no B-roll available, open cold on the KisanAlert landing page hero with the animated gradient blobs.

**VO:**
> "Every year, millions of small and marginal farmers in India lose their harvest to the same three problems: they plant the wrong crop for their soil, they miss a dry spell until it's too late, and by the time a plant disease is diagnosed, it's already spread across the field.
>
> The knowledge to prevent all three exists. It's just never been in their language, on their phone, in time.
>
> That's what we built KisanAlert to fix."

**ON-SCREEN TEXT:** *KisanAlert — Smart Water, Crop & Advisory System*

---

## SCENE 2 — What It Is (0:35–1:10)

**VISUAL:** Cut to Landing page, slow scroll through the bento feature grid (Earth Engine, Gemini Vision, Predictive Weather, Voice Advisory).

**VO:**
> "KisanAlert is a voice-first agricultural intelligence platform, built entirely on Google Cloud. It does three things: recommends the right crop for a farmer's exact soil and water conditions, warns them before a dry spell hits, and diagnoses crop disease from a photo or a spoken description — all in ten Indian languages, and all designed to keep working even on a basic feature phone with no smartphone or data plan."

**ON-SCREEN TEXT:** *3 core tools · 10 languages · works offline-first*

---

## SCENE 3 — Demo: Crop Recommendation (1:10–2:15)

**VISUAL:** Click "Launch App" → Dashboard loads → switch language selector to Hindi and back to English (show the instant UI translation) → go to **Crop Advisor** tab → fill in district/soil/irrigation/season → click "Recommend Crops."

**VO:**
> "Let's see it live. A farmer opens the app, picks their language — every label, every button re-renders instantly, this isn't machine-translated on the fly, it's built in from the ground up for ten languages including Hindi, Tamil, Telugu, Marathi, and more.
>
> On the Crop Advisor tab, they enter their district, soil type, and water source. Behind the scenes, we're combining a district-level agronomic dataset with live groundwater and rainfall data, and — where satellite data is available — NDVI vegetation health from Earth Engine.
>
> Watch what comes back."

**VISUAL:** Results appear — score bars animate in, top recommendation card highlighted with Trophy icon, AI explanation text below.

**VO:**
> "Ranked crop recommendations with a real confidence score — and this explanation isn't a template. It's generated live by Gemini, reasoning over this specific farmer's soil, rainfall, and irrigation type, explaining in plain language why this crop beats the habitual choice like paddy, and what the first three steps are."

**ON-SCREEN TEXT:** *Live Gemini reasoning · not a lookup table*

---

## SCENE 4 — Demo: Dry-Spell Alerts (2:15–3:05)

**VISUAL:** Switch to **Alerts** tab → enter a location → advisory loads with current weather + rain forecast bars + colored severity badge (green/amber/red).

**VO:**
> "Next, the Alerts tab. This pulls live weather forecast data for the farmer's exact coordinates — real-time temperature, humidity, and a sixteen-day rainfall outlook. Our dry-spell detector scans that window and flags exactly when irrigation needs to happen, color-coded by urgency: green means you're fine, amber means plan this week, red means irrigate now.
>
> And critically — this advisory gets translated and can be read aloud in the farmer's language, because half of our target users can't reliably read text on a small screen."

**VISUAL:** Click the "Listen" / speak button — show the voice button's pulsing animation.

**ON-SCREEN TEXT:** *Live weather data · text-to-speech in 10 languages*

---

## SCENE 5 — Demo: Crop Health Diagnosis + RSK Escalation (3:05–4:15)

**VISUAL:** Switch to **Crop Health** tab → type a symptom description ("leaves curling upward, small white insects under leaf") or upload a leaf photo → click "Diagnose" → result card appears with disease name, confidence %, severity, treatment steps.

**VO:**
> "This is the tab we're proudest of. A farmer describes what they're seeing — or better, just uploads a photo of the affected leaf. Gemini's multimodal vision model analyzes the image directly, returns a diagnosis, a confidence score, and an organic-first treatment plan in three clear steps.
>
> But here's the part that matters for adoption: if the confidence is low, or the case looks severe, KisanAlert doesn't just show an answer and walk away — it automatically escalates the case into a queue for a human expert to review."

**VISUAL:** Switch to **RSK Desk** tab → show the escalation queue with pending cases, stats counters.

**VO:**
> "This is our RSK Desk — an auto-escalation workflow modeled on India's Rythu Seva Kendra network. Every high-severity or low-confidence case lands here automatically, so AI augments the extension officer instead of replacing them. It's the safety net that makes farmers actually trust the diagnosis."

**ON-SCREEN TEXT:** *Gemini Vision diagnosis · auto-escalation to human experts*

---

## SCENE 6 — Demo: SMS / IVR — No Smartphone Needed (4:15–5:00)

**VISUAL:** Switch to **SMS / IVR** tab → show the phone-mockup chat interface, type/speak a query like "when should I water my cotton" → show the conversational response, then the SMS-style message thread.

**VO:**
> "And because a huge share of our users don't have a smartphone at all, we built a Dialogflow-powered IVR and SMS layer. A farmer can call a number, speak naturally, and get the same crop, weather, or health guidance read back to them — no app, no data connection, no literacy requirement. Just a phone call, in their own language."

**ON-SCREEN TEXT:** *Dialogflow ES · works on any phone, zero data required*

---

## SCENE 7 — Tech Stack + Resilience (5:00–5:35)

**VISUAL:** Cut to landing page "Powered by Enterprise Infrastructure" integrations row, or a quick title card listing the stack.

**VO:**
> "Under the hood, KisanAlert integrates six Google Cloud services: Gemini for reasoning and vision, Cloud Translation, Text-to-Speech and Speech-to-Text for full voice accessibility, Earth Engine for satellite soil and vegetation data, Google Maps for hotspot visualization, and Dialogflow for conversational IVR.
>
> And every single one of those integrations was built with a graceful fallback. If a satellite feed or an API key isn't available, the app doesn't break — it quietly falls back to a curated dataset and keeps serving the farmer. In the field, in patchy network conditions, on hardware we don't control — that reliability matters more than any single feature."

**ON-SCREEN TEXT:** *6 Google Cloud services · graceful fallback on every integration*

---

## SCENE 8 — Close / Ask (5:35–6:10)

**VISUAL:** Return to landing page hero or a closing title card with team/project name.

**VO:**
> "KisanAlert isn't a concept — it's a working platform today, recommending crops, forecasting dry spells, and diagnosing disease, in ten languages, for the farmers who've been underserved by every 'smart agriculture' app that assumed a smartphone, a data plan, and English.
>
> We built this for Track 4, Code for Communities, because the best technology is the kind that meets people exactly where they are. Thank you."

**ON-SCREEN TEXT:** *KisanAlert — Built for India's small and marginal farmers*

---

## Production notes

- **Total runtime:** ~6:10 as written; cut Scene 6 (SMS/IVR) short or merge into Scene 7 to hit 5:00 if needed; add slow-motion B-roll of farm/field footage between scenes to stretch to 7:00.
- **Screen recording tips:** record each tab demo separately at 1280×900 (matches the app's tested viewport), then edit together — much easier to re-take a flubbed input than to re-record a continuous pass.
- **Before recording:** make sure `GEMINI_API_KEY` is a working key (see current blocker — key is returning `API_KEY_SERVICE_BLOCKED`), otherwise Scene 3/5 will visibly say "offline mode" instead of showing live AI reasoning, which undercuts the "live Gemini" narration.
- **Voice consistency:** if recording VO separately from screen capture, do the screen capture first, then time the VO to the actual clip lengths rather than the reverse — screen actions (typing, clicking, waiting for API responses) rarely match a pre-timed script exactly.
- **Optional cold open:** stock dry-field/farmer B-roll for Scene 1 tests noticeably better with hackathon judges than opening directly on a UI — if you have even 5 seconds of real or stock footage, use it.

"""Static agronomy data: crop database + district soil/rainfall table.

Production path: districts table is replaced by Earth Engine NDVI / soil-moisture
layers and state agriculture department datasets — same shape, same scoring code.
"""

# Soil suitability is 0.0–1.0 per soil class.
# water_mm = full-season crop water requirement.
# Economics are per-acre indicative figures (state agri dept averages + MSP 2024-25).
CROPS: dict[str, dict] = {
    "paddy": {
        "label": "Paddy (Rice)", "icon": "🌾", "seasons": ["kharif", "rabi"],
        "soil": {"alluvial": 1.0, "clay": 0.9, "black": 0.7, "loamy": 0.6, "red": 0.4, "sandy": 0.2},
        "water_mm": 1200, "duration_days": 135,
        "cost": 32000, "yield_q": 22, "msp": 2300,
        "note": "High water demand — only viable with assured canal/tank irrigation.",
    },
    "cotton": {
        "label": "Cotton", "icon": "☁️", "seasons": ["kharif"],
        "soil": {"black": 1.0, "alluvial": 0.7, "loamy": 0.6, "red": 0.5, "clay": 0.5, "sandy": 0.3},
        "water_mm": 700, "duration_days": 170,
        "cost": 38000, "yield_q": 10, "msp": 7121,
        "note": "Deep black soil holds moisture through dry spells.",
    },
    "maize": {
        "label": "Maize", "icon": "🌽", "seasons": ["kharif", "rabi"],
        "soil": {"alluvial": 1.0, "loamy": 0.9, "black": 0.7, "red": 0.6, "clay": 0.5, "sandy": 0.4},
        "water_mm": 550, "duration_days": 110,
        "cost": 22000, "yield_q": 25, "msp": 2225,
        "note": "Fast-growing, tolerates moderate dry spells after knee stage.",
    },
    "red_gram": {
        "label": "Red Gram (Tur)", "icon": "🫘", "seasons": ["kharif"],
        "soil": {"red": 0.9, "black": 0.9, "loamy": 0.8, "alluvial": 0.6, "sandy": 0.5, "clay": 0.4},
        "water_mm": 400, "duration_days": 160,
        "cost": 14000, "yield_q": 6, "msp": 7550,
        "note": "Deep roots reach subsoil moisture — classic dryland pulse.",
    },
    "bengal_gram": {
        "label": "Bengal Gram (Chana)", "icon": "🌱", "seasons": ["rabi"],
        "soil": {"black": 1.0, "clay": 0.8, "loamy": 0.7, "alluvial": 0.6, "red": 0.5, "sandy": 0.3},
        "water_mm": 300, "duration_days": 105,
        "cost": 13000, "yield_q": 7, "msp": 5650,
        "note": "Grows on residual soil moisture — near-zero irrigation rabi crop.",
    },
    "groundnut": {
        "label": "Groundnut", "icon": "🥜", "seasons": ["kharif", "rabi"],
        "soil": {"sandy": 1.0, "red": 0.9, "loamy": 0.8, "alluvial": 0.6, "black": 0.4, "clay": 0.2},
        "water_mm": 500, "duration_days": 115,
        "cost": 24000, "yield_q": 9, "msp": 6783,
        "note": "The Anantapur staple — loves light red/sandy soils.",
    },
    "chilli": {
        "label": "Chilli", "icon": "🌶️", "seasons": ["kharif", "rabi"],
        "soil": {"black": 0.9, "loamy": 0.9, "alluvial": 0.8, "red": 0.7, "clay": 0.5, "sandy": 0.4},
        "water_mm": 800, "duration_days": 180,
        "cost": 90000, "yield_q": 22, "msp": 0, "market_price": 15000,
        "note": "High input, high return — Guntur is Asia's largest chilli market.",
    },
    "turmeric": {
        "label": "Turmeric", "icon": "🟡", "seasons": ["kharif"],
        "soil": {"loamy": 1.0, "alluvial": 0.9, "red": 0.7, "black": 0.6, "clay": 0.5, "sandy": 0.4},
        "water_mm": 900, "duration_days": 240,
        "cost": 70000, "yield_q": 25, "msp": 0, "market_price": 7500,
        "note": "9-month crop — needs assured water and patient capital.",
    },
    "tomato": {
        "label": "Tomato", "icon": "🍅", "seasons": ["kharif", "rabi", "zaid"],
        "soil": {"loamy": 1.0, "alluvial": 0.9, "red": 0.8, "black": 0.7, "sandy": 0.5, "clay": 0.4},
        "water_mm": 600, "duration_days": 100,
        "cost": 45000, "yield_q": 100, "msp": 0, "market_price": 1200,
        "note": "Volatile prices — stagger planting across 3 windows.",
    },
    "onion": {
        "label": "Onion", "icon": "🧅", "seasons": ["kharif", "rabi"],
        "soil": {"alluvial": 1.0, "loamy": 0.9, "red": 0.7, "black": 0.7, "sandy": 0.5, "clay": 0.3},
        "water_mm": 550, "duration_days": 120,
        "cost": 40000, "yield_q": 80, "msp": 0, "market_price": 1800,
        "note": "Store-and-sell strategy doubles realization in most years.",
    },
    "millets": {
        "label": "Millets (Jowar/Bajra)", "icon": "🌿", "seasons": ["kharif", "rabi"],
        "soil": {"red": 1.0, "sandy": 0.9, "black": 0.8, "loamy": 0.8, "alluvial": 0.6, "clay": 0.4},
        "water_mm": 350, "duration_days": 100,
        "cost": 10000, "yield_q": 8, "msp": 3371,
        "note": "Most drought-resilient cereal — thrives where paddy fails.",
    },
    "sugarcane": {
        "label": "Sugarcane", "icon": "🎋", "seasons": ["kharif"],
        "soil": {"alluvial": 1.0, "black": 0.9, "loamy": 0.8, "clay": 0.7, "red": 0.5, "sandy": 0.3},
        "water_mm": 1800, "duration_days": 360,
        "cost": 55000, "yield_q": 320, "msp": 0, "market_price": 315,
        "note": "12-month, water-heaviest crop — canal command areas only.",
    },
}

# District table: soil class, annual rainfall (mm), agro-climatic zone, typical
# groundwater depth band. AP districts first (Rythu Seva Kendra network), then
# Telangana; "default" is the fallback for any unlisted location.
DISTRICTS: dict[str, dict] = {
    "anantapur":      {"soil": "red",      "rain_mm": 550,  "zone": "Scarce rainfall zone (AP)",      "gw": "deep",    "lat": 14.6819, "lon": 77.6006},
    "guntur":         {"soil": "black",    "rain_mm": 850,  "zone": "Krishna zone (AP)",              "gw": "medium",  "lat": 16.3067, "lon": 80.4365},
    "krishna":        {"soil": "alluvial", "rain_mm": 950,  "zone": "Krishna delta (AP)",             "gw": "shallow", "lat": 16.5062, "lon": 80.6480},
    "prakasam":       {"soil": "red",      "rain_mm": 700,  "zone": "Southern zone (AP)",             "gw": "medium",  "lat": 15.5057, "lon": 80.0499},
    "kurnool":        {"soil": "black",    "rain_mm": 650,  "zone": "Scarce rainfall zone (AP)",      "gw": "deep",    "lat": 15.8281, "lon": 78.0373},
    "east godavari":  {"soil": "alluvial", "rain_mm": 1100, "zone": "Godavari delta (AP)",            "gw": "shallow", "lat": 16.9891, "lon": 82.2475},
    "chittoor":       {"soil": "red",      "rain_mm": 900,  "zone": "Southern zone (AP)",             "gw": "medium",  "lat": 13.2172, "lon": 79.1003},
    "warangal":       {"soil": "black",    "rain_mm": 950,  "zone": "Central Telangana zone",         "gw": "medium",  "lat": 17.9689, "lon": 79.5941},
    "nalgonda":       {"soil": "red",      "rain_mm": 750,  "zone": "Southern Telangana zone",        "gw": "deep",    "lat": 17.0575, "lon": 79.2690},
    "nizamabad":      {"soil": "black",    "rain_mm": 1050, "zone": "Northern Telangana zone",        "gw": "medium",  "lat": 18.6725, "lon": 78.0941},
    "default":        {"soil": "loamy",    "rain_mm": 800,  "zone": "General",                        "gw": "medium",  "lat": 22.9734, "lon": 78.6569},
}

# Irrigation source multiplies effective water supply over rainfall.
IRRIGATION_FACTOR = {"rainfed": 1.0, "borewell": 1.35, "canal": 1.6, "drip": 1.3, "tank": 1.25}

# Deep groundwater penalizes water-hungry crops when the source is a borewell.
GW_PENALTY = {"shallow": 0.0, "medium": 0.10, "deep": 0.25}


def get_district(name: str) -> dict:
    key = (name or "").strip().lower()
    for dk, dv in DISTRICTS.items():
        if dk in key or key in dk:
            if dk != "default":
                return {**dv, "district": dk.title()}
    return {**DISTRICTS["default"], "district": name.title() if name else "Your district"}


def revenue_per_acre(crop: dict) -> int:
    price = crop.get("msp") or crop.get("market_price", 0)
    return int(crop["yield_q"] * price)

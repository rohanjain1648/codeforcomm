// API client + response types for the KisanAlert backend.

export interface Breakdown {
  soil: number;
  water: number;
  season: number;
  economics: number;
}

export interface CropRec {
  key: string;
  label: string;
  icon: string;
  score: number;
  breakdown: Breakdown;
  water_deficit_pct: number;
  duration_days: number;
  cost_per_acre: number;
  revenue_per_acre: number;
  profit_total: number;
  note: string;
}

export interface SatelliteData {
  ndvi: number | null;
  soil_moisture_mm: number | null;
  source?: string;
}

export interface RecommendRes {
  district: { district: string; soil: string; rain_mm: number; zone: string; gw: string };
  groundwater: string;
  effective_water_mm: number;
  recommendations: CropRec[];
  ai_advice: string;
  ai_live: boolean;
  satellite: SatelliteData | null;
  satellite_live: boolean;
}

export type AlertLevel = "green" | "amber" | "red";

export interface Alert {
  type: string;
  level: AlertLevel;
  msg: string;
}

export interface AdvisoryRes {
  error?: string;
  location: { lat: number; lon: number; name: string; admin: string };
  current: { temp: number; humidity: number; wind: number; rain: number };
  level: AlertLevel;
  dry_spell: { start: string | null; days: number };
  next_rain: string | null;
  past_week_rain_mm: number;
  outlook_rain_mm: number;
  alerts: Alert[];
  daily: { date: string; rain: number; tmax: number }[];
}

export interface HealthLog {
  id: string;
  ts: number;
  farmer: string;
  village: string;
  crop: string;
  description: string;
  has_photo: boolean;
  disease: string;
  confidence: number;
  severity: "low" | "medium" | "high";
  treatment: string;
  escalated: boolean;
  status: string;
  ai_live: boolean;
}

export interface RskQueueRes {
  queue: HealthLog[];
  stats: { total_logs: number; escalated: number; pending: number; resolved: number };
}

export interface DistrictPoint {
  key: string;
  district: string;
  lat: number;
  lon: number;
  level: AlertLevel;
  zone: string;
}

export interface Capabilities {
  ok: boolean;
  gemini: boolean;
  translate: boolean;
  tts: boolean;
  stt: boolean;
  earthengine: boolean;
  dialogflow: boolean;
  logs: number;
  subscribers: number;
}

async function post<T>(url: string, body: unknown): Promise<T> {
  const r = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!r.ok) throw new Error(`${url} → ${r.status}`);
  return r.json();
}

async function get<T>(url: string): Promise<T> {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`${url} → ${r.status}`);
  return r.json();
}

export const api = {
  recommend: (body: {
    district: string; season: string; irrigation: string;
    groundwater: string; acres: number; lang: string;
  }) => post<RecommendRes>("/api/recommend", body),

  advisory: (location: string, lang: string) =>
    get<AdvisoryRes>(`/api/advisory?location=${encodeURIComponent(location)}&lang=${lang}`),

  healthLog: (body: {
    farmer: string; village: string; crop: string;
    description: string; image_b64: string | null; lang: string;
  }) => post<HealthLog>("/api/health/log", body),

  rskQueue: () => get<RskQueueRes>("/api/rsk/queue"),
  rskUpdate: (log_id: string, status: string) =>
    post<{ ok: boolean }>("/api/rsk/update", { log_id, status }),

  smsPreview: (location: string, lang: string) =>
    get<{ sms: string; level: AlertLevel; chars: number; translate_live: boolean; error?: string }>(
      `/api/sms/preview?location=${encodeURIComponent(location)}&lang=${lang}`),
  smsSubscribe: (phone: string, location: string, lang: string) =>
    post<{ ok: boolean; subscribers: number }>("/api/sms/subscribe", { phone, location, lang }),

  translate: (text: string, target_lang: string, source_lang = "en") =>
    post<{ translated: string; live: boolean }>("/api/translate", { text, target_lang, source_lang }),

  tts: (text: string, lang: string) =>
    post<{ audio_b64: string | null; live: boolean }>("/api/tts", { text, lang }),

  stt: (audio_b64: string, lang: string, sample_rate = 48000) =>
    post<{ text: string; live: boolean }>("/api/stt", { audio_b64, lang, sample_rate }),

  satellite: (lat: number, lon: number) =>
    get<SatelliteData & { live: boolean }>(`/api/satellite?lat=${lat}&lon=${lon}`),

  districts: () => get<{ districts: DistrictPoint[] }>("/api/districts"),

  ivr: (session_id: string, text: string, lang: string) =>
    post<{ intent: string; response_text: string; live: boolean }>("/api/ivr", { session_id, text, lang }),

  status: () => get<Capabilities>("/api/status"),
};

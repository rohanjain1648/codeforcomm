// Crop Advisor — the recommendation engine UI with score breakdowns.
import { useState } from "react";
import { api, type RecommendRes } from "../lib/api";
import { useApp } from "../lib/store";
import { t } from "../lib/i18n";
import { speakAuto } from "../lib/voice";
import { ScoreBar, ScoreLegend, Spinner } from "../components/ui";

const SEASONS = ["kharif", "rabi", "zaid"];
const IRRIGATION = ["rainfed", "borewell", "canal", "tank", "drip"];
const GW = ["", "shallow", "medium", "deep"];

export default function Advisor() {
  const { lang, location, caps } = useApp();
  const [form, setForm] = useState({
    district: location,
    season: "kharif",
    irrigation: "borewell",
    groundwater: "",
    acres: 2,
  });
  const [res, setRes] = useState<RecommendRes | null>(null);
  const [loading, setLoading] = useState(false);

  const run = async () => {
    setLoading(true);
    try {
      setRes(await api.recommend({ ...form, lang }));
    } catch {
      setRes(null);
    } finally {
      setLoading(false);
    }
  };

  const set = (k: string, v: string | number) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="flex flex-col gap-4">
      <div className="card grid gap-3 md:grid-cols-5">
        <label className="flex flex-col gap-1 text-xs" style={{ color: "var(--text-muted)" }}>
          {t("district", lang)}
          <input className="input" value={form.district} onChange={(e) => set("district", e.target.value)} />
        </label>
        <label className="flex flex-col gap-1 text-xs" style={{ color: "var(--text-muted)" }}>
          {t("season", lang)}
          <select className="input" value={form.season} onChange={(e) => set("season", e.target.value)}>
            {SEASONS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-xs" style={{ color: "var(--text-muted)" }}>
          {t("irrigation", lang)}
          <select className="input" value={form.irrigation} onChange={(e) => set("irrigation", e.target.value)}>
            {IRRIGATION.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-xs" style={{ color: "var(--text-muted)" }}>
          {t("groundwater", lang)}
          <select className="input" value={form.groundwater} onChange={(e) => set("groundwater", e.target.value)}>
            {GW.map((s) => <option key={s} value={s}>{s || "auto (district)"}</option>)}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-xs" style={{ color: "var(--text-muted)" }}>
          {t("acres", lang)}
          <input
            className="input" type="number" min={0.5} step={0.5} value={form.acres}
            onChange={(e) => set("acres", parseFloat(e.target.value) || 1)}
          />
        </label>
      </div>

      <div className="flex items-center gap-3">
        <button className="btn" onClick={run} disabled={loading}>
          {t("get_recommendation", lang)}
        </button>
        {loading && <Spinner label={t("loading", lang)} />}
      </div>

      {res && (
        <>
          <div className="card" style={{ borderLeft: "4px solid var(--accent)" }}>
            <div className="mb-1 flex items-center justify-between">
              <span className="text-xs uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
                {t("ai_advice", lang)} · {res.district.district} · {res.district.zone}
                {res.ai_live ? " · Gemini" : " · offline mode"}
              </span>
              <button className="btn-ghost" onClick={() => speakAuto(res.ai_advice, lang, caps.tts)}>
                🔊 {t("speak", lang)}
              </button>
            </div>
            <p className="whitespace-pre-wrap text-sm" style={{ color: "var(--text-secondary)" }}>
              {res.ai_advice}
            </p>
          </div>

          {res.satellite && (
            <div className="card flex flex-wrap items-center gap-4 text-sm" style={{ color: "var(--text-secondary)" }}>
              <span className="text-xs uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
                🛰️ Earth Engine {res.satellite_live ? "· live" : "· offline"}
              </span>
              {res.satellite.ndvi !== null && <span>NDVI: {res.satellite.ndvi}</span>}
              {res.satellite.soil_moisture_mm !== null && (
                <span>Soil moisture: {res.satellite.soil_moisture_mm} mm</span>
              )}
            </div>
          )}

          <ScoreLegend />

          <div className="flex flex-col gap-2">
            {res.recommendations.map((r, idx) => (
              <div key={r.key} className="card">
                <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
                  <span className="font-semibold">
                    {idx === 0 && "🏆 "}
                    {r.icon} {r.label}
                    <span className="ml-2 text-sm" style={{ color: "var(--text-muted)" }}>
                      {r.duration_days}d
                    </span>
                  </span>
                  <span className="flex items-baseline gap-3 text-sm">
                    <span style={{ color: r.profit_total >= 0 ? "var(--status-good)" : "var(--status-critical)" }}>
                      ₹{r.profit_total.toLocaleString("en-IN")}
                    </span>
                    <span className="text-lg font-bold">{r.score}</span>
                  </span>
                </div>
                <ScoreBar breakdown={r.breakdown} />
                <p className="mt-2 text-xs" style={{ color: "var(--text-muted)" }}>
                  {r.note}
                  {r.water_deficit_pct > 0 && (
                    <span style={{ color: "var(--status-serious)" }}>
                      {" "}· water deficit −{r.water_deficit_pct}%
                    </span>
                  )}
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

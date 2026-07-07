// Dashboard — 3D farm driven by live advisory data + headline stats +
// Google Maps district hotspot overlay.
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Volume2, Map as MapIcon } from "lucide-react";
import FarmScene from "../three/FarmScene";
import MapView from "../components/MapView";
import { api, type DistrictPoint } from "../lib/api";
import { useApp } from "../lib/store";
import { t } from "../lib/i18n";
import { speakAuto } from "../lib/voice";
import { AlertCard, StatTile, Spinner } from "../components/ui";

export default function Dashboard() {
  const { lang, location, setLocation, advisory, setAdvisory, caps } = useApp();
  const [input, setInput] = useState(location);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [districts, setDistricts] = useState<DistrictPoint[]>([]);

  const fetchAdvisory = async (loc: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await api.advisory(loc, lang);
      if (res.error) {
        setError(res.error);
        setAdvisory(null);
      } else {
        setAdvisory(res);
        setLocation(loc);
      }
    } catch {
      setError("Backend not reachable — is uvicorn running on :8000?");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!advisory) void fetchAdvisory(location);
    api.districts().then((r) => setDistricts(r.districts)).catch(() => setDistricts([]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Map live data onto the 3D farm
  const rainLevel = advisory ? Math.min(advisory.outlook_rain_mm / 120, 1) : 0.1;
  const growth = advisory
    ? Math.max(0.25, 1 - advisory.dry_spell.days / 12)
    : 0.7;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        <input
          className="input max-w-sm"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && fetchAdvisory(input)}
          placeholder={t("location_ph", lang)}
        />
        <button className="btn" onClick={() => fetchAdvisory(input)} disabled={loading}>
          {t("fetch", lang)}
        </button>
        {loading && <Spinner label={t("loading", lang)} />}
      </div>
      {error && (
        <div className="card" style={{ borderLeft: "4px solid var(--status-critical)" }}>
          {error}
        </div>
      )}

      <motion.div
        className="h-80 overflow-hidden rounded-2xl"
        style={{ border: "1px solid var(--border)", boxShadow: "var(--shadow-md)" }}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <FarmScene
          growth={growth}
          rainLevel={rainLevel}
          alertLevel={advisory?.level ?? "green"}
        />
      </motion.div>

      {advisory && (
        <>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <StatTile
              label={t("temp", lang)}
              value={`${Math.round(advisory.current.temp)}°C`}
              sub={`${advisory.location.name}, ${advisory.location.admin}`}
            />
            <StatTile
              label={t("past_rain", lang)}
              value={`${advisory.past_week_rain_mm} mm`}
            />
            <StatTile
              label={t("outlook_rain", lang)}
              value={`${advisory.outlook_rain_mm} mm`}
              sub={`${t("next_rain", lang)}: ${advisory.next_rain ?? "—"}`}
            />
            <StatTile
              label={t("dry_spell", lang)}
              value={`${advisory.dry_spell.days} ${t("days", lang)}`}
              sub={advisory.dry_spell.start ?? undefined}
            />
          </div>

          <div className="flex flex-col gap-2">
            {advisory.alerts.map((a, i) => (
              <AlertCard key={i} alert={a} />
            ))}
          </div>

          <button
            className="btn-ghost inline-flex w-fit items-center gap-1.5"
            onClick={() => speakAuto(advisory.alerts.map((a) => a.msg).join(". "), lang, caps.tts)}
          >
            <Volume2 size={15} /> {t("speak", lang)}
          </button>
        </>
      )}

      <div className="flex flex-col gap-2">
        <span className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
          <MapIcon size={13} /> {t("hotspot_map", lang)} — Google Maps Platform
        </span>
        <MapView
          points={districts}
          center={advisory ? { lat: advisory.location.lat, lng: advisory.location.lon } : undefined}
        />
      </div>
    </div>
  );
}

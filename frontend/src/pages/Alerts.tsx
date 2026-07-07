// Alerts — dry-spell detail, 10-day rain outlook, voice playback.
import { useState } from "react";
import { motion } from "framer-motion";
import { Volume2 } from "lucide-react";
import { api } from "../lib/api";
import { useApp } from "../lib/store";
import { t } from "../lib/i18n";
import { speakAuto } from "../lib/voice";
import { AlertCard, RainBars, Spinner, STATUS_COLOR } from "../components/ui";

export default function Alerts() {
  const { lang, location, setLocation, advisory, setAdvisory, caps } = useApp();
  const [input, setInput] = useState(location);
  const [loading, setLoading] = useState(false);

  const refresh = async () => {
    setLoading(true);
    try {
      const res = await api.advisory(input, lang);
      if (!res.error) {
        setAdvisory(res);
        setLocation(input);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        <input
          className="input max-w-sm"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && refresh()}
          placeholder={t("location_ph", lang)}
        />
        <button className="btn" onClick={refresh} disabled={loading}>
          {t("fetch", lang)}
        </button>
        {loading && <Spinner label={t("loading", lang)} />}
      </div>

      {advisory && (
        <motion.div
          className="flex flex-col gap-4"
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
        >
          <motion.div
            className="card flex items-center justify-between"
            style={{ borderLeft: `4px solid ${STATUS_COLOR[advisory.level]}` }}
            variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
          >
            <div>
              <div className="text-xs uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
                {advisory.location.name} · {t("dry_spell", lang)}
              </div>
              <div className="text-2xl font-bold">
                {advisory.dry_spell.days} {t("days", lang)}
                {advisory.dry_spell.start && (
                  <span className="ml-2 text-sm font-normal" style={{ color: "var(--text-secondary)" }}>
                    from {advisory.dry_spell.start}
                  </span>
                )}
              </div>
            </div>
            <button
              className="btn-ghost inline-flex items-center gap-1.5"
              onClick={() => speakAuto(advisory.alerts.map((a) => a.msg).join(". "), lang, caps.tts)}
            >
              <Volume2 size={15} /> {t("speak", lang)}
            </button>
          </motion.div>

          <motion.div className="card" variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}>
            <div className="mb-3 text-xs uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
              {t("outlook_rain", lang)} (mm/day)
            </div>
            <RainBars daily={advisory.daily} />
          </motion.div>

          <div className="flex flex-col gap-2">
            {advisory.alerts.map((a, i) => (
              <AlertCard key={i} alert={a} />
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}

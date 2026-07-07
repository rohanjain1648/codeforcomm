// RSK Desk — Rythu Seva Kendra expert queue for escalated crop-health cases.
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, PhoneCall, Check } from "lucide-react";
import { api, type RskQueueRes } from "../lib/api";
import { StatTile } from "../components/ui";

const SEV_COLOR: Record<string, string> = {
  low: "var(--status-good)",
  medium: "var(--status-warning)",
  high: "var(--status-critical)",
};

export default function Rsk() {
  const [data, setData] = useState<RskQueueRes | null>(null);

  const refresh = async () => {
    try {
      setData(await api.rskQueue());
    } catch {
      setData(null);
    }
  };

  useEffect(() => {
    void refresh();
    const id = setInterval(refresh, 8000);
    return () => clearInterval(id);
  }, []);

  const update = async (id: string, status: string) => {
    await api.rskUpdate(id, status);
    await refresh();
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
        Expert view — escalated cases from farmers arrive here in real time.
        In production this desk runs inside each of AP's 10,778 Rythu Seva Kendras.
      </p>

      {data && (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <StatTile label="Total logs" value={String(data.stats.total_logs)} />
          <StatTile label="Escalated" value={String(data.stats.escalated)} />
          <StatTile label="Pending" value={String(data.stats.pending)} />
          <StatTile label="Resolved" value={String(data.stats.resolved)} />
        </div>
      )}

      <div className="flex flex-col gap-2">
        {data?.queue.length === 0 && (
          <div className="card text-sm" style={{ color: "var(--text-muted)" }}>
            Queue empty — log a high-severity case in the Crop Health tab to see it appear here.
          </div>
        )}
        <AnimatePresence initial={false}>
          {data?.queue.map((log) => (
            <motion.div
              key={log.id}
              layout
              className="card"
              initial={{ opacity: 0, y: 14, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="inline-flex items-center gap-2 font-semibold">
                  {log.disease}
                  <span className="inline-flex items-center gap-1.5 text-sm" style={{ color: SEV_COLOR[log.severity] }}>
                    <span className="inline-block h-2 w-2 rounded-full" style={{ background: SEV_COLOR[log.severity] }} />
                    {log.severity} · {log.confidence}%
                  </span>
                </span>
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                  #{log.id} · {new Date(log.ts * 1000).toLocaleString("en-IN")}
                </span>
              </div>
              <p className="mt-1 inline-flex flex-wrap items-center gap-1 text-sm" style={{ color: "var(--text-secondary)" }}>
                {log.farmer || "Farmer"}{log.village && `, ${log.village}`}
                {log.crop && ` · ${log.crop}`}
                {log.has_photo && (
                  <span className="inline-flex items-center gap-1">
                    · <Camera size={13} /> photo attached
                  </span>
                )}
              </p>
              {log.description && (
                <p className="mt-1 text-sm italic" style={{ color: "var(--text-muted)" }}>
                  “{log.description}”
                </p>
              )}
              <div className="mt-3 flex gap-2">
                {log.status === "pending" ? (
                  <>
                    <button className="btn-ghost inline-flex items-center gap-1.5" onClick={() => update(log.id, "resolved")}>
                      <Check size={14} /> Mark resolved
                    </button>
                    <button className="btn-ghost inline-flex items-center gap-1.5" onClick={() => update(log.id, "callback")}>
                      <PhoneCall size={14} /> Schedule callback
                    </button>
                  </>
                ) : (
                  <span className="text-sm" style={{ color: "var(--status-good)" }}>
                    status: {log.status}
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

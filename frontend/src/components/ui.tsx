// Shared UI: stat tiles, alert cards, score bars, voice input button.
// Viz styling follows the reference dataviz palette: status colors reserved
// for alert levels, categorical slots in fixed order, text in text tokens.
import { useRef, useState } from "react";
import type { Alert, AlertLevel, Breakdown, Capabilities } from "../lib/api";
import { SPEECH_LOCALE, type Lang } from "../lib/i18n";
import { transcribeCloudBlob } from "../lib/voice";

export const STATUS_COLOR: Record<AlertLevel, string> = {
  green: "var(--status-good)",
  amber: "var(--status-warning)",
  red: "var(--status-critical)",
};

export const STATUS_ICON: Record<AlertLevel, string> = {
  green: "✓",
  amber: "⚠",
  red: "‼",
};

export function StatTile({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="card flex flex-col gap-1">
      <span className="text-xs uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
        {label}
      </span>
      <span className="text-2xl font-semibold">{value}</span>
      {sub && <span className="text-xs" style={{ color: "var(--text-secondary)" }}>{sub}</span>}
    </div>
  );
}

export function AlertCard({ alert }: { alert: Alert }) {
  return (
    <div
      className="card flex items-start gap-3"
      style={{ borderLeft: `4px solid ${STATUS_COLOR[alert.level]}` }}
    >
      <span aria-hidden style={{ color: STATUS_COLOR[alert.level], fontWeight: 700 }}>
        {STATUS_ICON[alert.level]}
      </span>
      <div>
        <div className="text-xs uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
          {alert.type.replace("_", " ")} · {alert.level}
        </div>
        <p className="text-sm mt-0.5" style={{ color: "var(--text-secondary)" }}>{alert.msg}</p>
      </div>
    </div>
  );
}

// Stacked score bar — 4 categorical segments in fixed order with 2px gaps.
const SEGMENTS: { key: keyof Breakdown; label: string; color: string }[] = [
  { key: "soil", label: "Soil", color: "var(--series-1)" },
  { key: "water", label: "Water", color: "var(--series-2)" },
  { key: "season", label: "Season", color: "var(--series-3)" },
  { key: "economics", label: "Economics", color: "var(--series-4)" },
];

export function ScoreBar({ breakdown }: { breakdown: Breakdown }) {
  return (
    <div className="flex h-2.5 w-full overflow-hidden rounded" style={{ gap: 2 }}>
      {SEGMENTS.map((s) => (
        <div
          key={s.key}
          title={`${s.label}: ${breakdown[s.key]}`}
          style={{
            width: `${breakdown[s.key]}%`,
            background: s.color,
            borderRadius: 2,
          }}
        />
      ))}
    </div>
  );
}

export function ScoreLegend() {
  return (
    <div className="flex flex-wrap gap-4 text-xs" style={{ color: "var(--text-secondary)" }}>
      {SEGMENTS.map((s) => (
        <span key={s.key} className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ background: s.color }} />
          {s.label}
        </span>
      ))}
    </div>
  );
}

// Rain outlook — sequential single-hue bars (magnitude), direct-labeled peaks.
export function RainBars({ daily }: { daily: { date: string; rain: number }[] }) {
  const max = Math.max(...daily.map((d) => d.rain), 1);
  return (
    <div className="flex items-end gap-1.5 h-28">
      {daily.map((d) => {
        const h = Math.max((d.rain / max) * 100, 3);
        const heavy = d.rain >= max * 0.7 && d.rain > 2;
        return (
          <div key={d.date} className="flex flex-col items-center gap-1 flex-1 min-w-0">
            {heavy && (
              <span className="text-[10px]" style={{ color: "var(--text-secondary)" }}>
                {Math.round(d.rain)}
              </span>
            )}
            <div
              title={`${d.date}: ${d.rain.toFixed(1)} mm`}
              className="w-full rounded-t"
              style={{
                height: `${h}%`,
                background: d.rain > 10 ? "var(--seq-600)" : d.rain > 2 ? "var(--seq-400)" : "var(--seq-200)",
                minHeight: 3,
              }}
            />
            <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>
              {d.date.slice(8)}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// Voice input — uses Cloud Speech-to-Text (MediaRecorder → /api/stt) when
// configured on the backend; otherwise falls back to the browser's Web
// Speech API (Chrome/Edge only, no server round-trip).
interface SR {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
  start: () => void;
  stop: () => void;
}

export function VoiceButton({
  lang, onText, sttReady = false,
}: { lang: Lang; onText: (text: string) => void; sttReady?: boolean }) {
  const [listening, setListening] = useState(false);
  const [busy, setBusy] = useState(false);
  const recRef = useRef<SR | null>(null);
  const mediaRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const browserSupported =
    typeof window !== "undefined" &&
    ("webkitSpeechRecognition" in window || "SpeechRecognition" in window);
  const cloudSupported = typeof navigator !== "undefined" && !!navigator.mediaDevices;
  const supported = sttReady ? cloudSupported : browserSupported;

  const startCloud = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mr = new MediaRecorder(stream, { mimeType: "audio/webm;codecs=opus" });
    chunksRef.current = [];
    mr.ondataavailable = (e) => chunksRef.current.push(e.data);
    mr.onstop = async () => {
      stream.getTracks().forEach((tr) => tr.stop());
      setListening(false);
      setBusy(true);
      const blob = new Blob(chunksRef.current, { type: "audio/webm" });
      const text = await transcribeCloudBlob(blob, lang).catch(() => "");
      setBusy(false);
      if (text) onText(text);
    };
    mediaRef.current = mr;
    mr.start();
    setListening(true);
  };

  const startBrowser = () => {
    const Ctor =
      (window as unknown as Record<string, new () => SR>).SpeechRecognition ??
      (window as unknown as Record<string, new () => SR>).webkitSpeechRecognition;
    const rec = new Ctor();
    rec.lang = SPEECH_LOCALE[lang];
    rec.continuous = false;
    rec.interimResults = false;
    rec.onresult = (e) => {
      const txt = Array.from({ length: e.results.length }, (_, i) => e.results[i][0].transcript).join(" ");
      onText(txt);
    };
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    recRef.current = rec;
    setListening(true);
    rec.start();
  };

  const toggle = () => {
    if (!supported) return;
    if (listening) {
      if (sttReady) mediaRef.current?.stop();
      else recRef.current?.stop();
      return;
    }
    if (sttReady) void startCloud();
    else startBrowser();
  };

  if (!supported) return null;
  return (
    <button
      type="button"
      onClick={toggle}
      disabled={busy}
      className="btn-ghost"
      style={listening ? { borderColor: "var(--status-critical)", color: "var(--status-critical)" } : undefined}
      aria-label="Voice input"
      title={sttReady ? "Cloud Speech-to-Text" : "Browser voice (offline mode)"}
    >
      {busy ? "…transcribing" : listening ? "◉ Listening…" : sttReady ? "🎤 Speak (Cloud)" : "🎤 Speak"}
    </button>
  );
}

// Small strip showing which Google Cloud services are live vs. offline
// fallback — useful for judges/mentors to see at a glance.
const CAP_LABELS: { key: keyof Capabilities; label: string }[] = [
  { key: "gemini", label: "Gemini" },
  { key: "translate", label: "Translate" },
  { key: "tts", label: "TTS" },
  { key: "stt", label: "STT" },
  { key: "earthengine", label: "Earth Engine" },
  { key: "dialogflow", label: "Dialogflow" },
];

export function CapabilityStrip({ caps }: { caps: Capabilities }) {
  return (
    <div className="flex flex-wrap gap-1.5 text-[11px]">
      {CAP_LABELS.map((c) => (
        <span
          key={c.key}
          className="rounded-full px-2 py-0.5"
          style={
            caps[c.key]
              ? { background: "rgba(12,163,12,0.15)", color: "var(--status-good)" }
              : { background: "var(--surface-2)", color: "var(--text-muted)" }
          }
          title={caps[c.key] ? `${c.label}: live` : `${c.label}: offline fallback (no credentials configured)`}
        >
          {caps[c.key] ? "●" : "○"} {c.label}
        </span>
      ))}
    </div>
  );
}

export function Spinner({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 text-sm" style={{ color: "var(--text-secondary)" }}>
      <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
      {label}
    </div>
  );
}

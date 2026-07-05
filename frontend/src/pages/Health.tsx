// Crop Health — photo/voice logging → Gemini diagnosis → RSK escalation.
import { useState } from "react";
import { api, type HealthLog } from "../lib/api";
import { useApp } from "../lib/store";
import { t } from "../lib/i18n";
import { speakAuto } from "../lib/voice";
import { Spinner, VoiceButton } from "../components/ui";

const SEV_COLOR: Record<string, string> = {
  low: "var(--status-good)",
  medium: "var(--status-warning)",
  high: "var(--status-critical)",
};

export default function Health() {
  const { lang, caps } = useApp();
  const [form, setForm] = useState({ farmer: "", village: "", crop: "", description: "" });
  const [imageB64, setImageB64] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<HealthLog | null>(null);
  const [loading, setLoading] = useState(false);

  const onFile = (f: File | null) => {
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      const url = reader.result as string;
      setPreview(url);
      setImageB64(url.split(",")[1] ?? null);
    };
    reader.readAsDataURL(f);
  };

  const submit = async () => {
    if (!form.description && !imageB64) return;
    setLoading(true);
    try {
      setResult(await api.healthLog({ ...form, image_b64: imageB64, lang }));
    } finally {
      setLoading(false);
    }
  };

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="flex flex-col gap-3">
        <div className="card grid grid-cols-3 gap-2">
          <input className="input" placeholder={t("farmer_name", lang)} value={form.farmer}
            onChange={(e) => set("farmer", e.target.value)} />
          <input className="input" placeholder={t("village", lang)} value={form.village}
            onChange={(e) => set("village", e.target.value)} />
          <input className="input" placeholder={t("crop", lang)} value={form.crop}
            onChange={(e) => set("crop", e.target.value)} />
        </div>

        <div className="card flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
              {t("describe", lang)}
            </span>
            <VoiceButton
              lang={lang}
              sttReady={caps.stt}
              onText={(txt) => set("description", form.description ? `${form.description} ${txt}` : txt)}
            />
          </div>
          <textarea
            className="input min-h-24"
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            placeholder="e.g. leaves curling upward, small white insects under leaf"
          />
        </div>

        <div className="card flex flex-col gap-2">
          <span className="text-xs uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
            {t("upload_photo", lang)}
          </span>
          <input
            type="file" accept="image/*" capture="environment"
            onChange={(e) => onFile(e.target.files?.[0] ?? null)}
            className="text-sm" style={{ color: "var(--text-secondary)" }}
          />
          {preview && (
            <img src={preview} alt="crop" className="max-h-48 rounded-lg object-cover" />
          )}
        </div>

        <div className="flex items-center gap-3">
          <button className="btn" onClick={submit} disabled={loading}>
            🔬 {t("diagnose", lang)}
          </button>
          {loading && <Spinner label={t("loading", lang)} />}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {result && (
          <>
            <div
              className="card"
              style={{ borderLeft: `4px solid ${result.escalated ? "var(--status-critical)" : "var(--status-good)"}` }}
            >
              <span className="text-sm font-semibold">
                {result.escalated ? `🏛️ ${t("escalated", lang)}` : `✓ ${t("self_treat", lang)}`}
              </span>
            </div>

            <div className="card flex flex-col gap-2">
              <div className="flex items-baseline justify-between">
                <span className="text-lg font-bold">{result.disease}</span>
                <span className="text-sm" style={{ color: SEV_COLOR[result.severity] }}>
                  ● {result.severity} · {result.confidence}%
                </span>
              </div>
              <p className="whitespace-pre-wrap text-sm" style={{ color: "var(--text-secondary)" }}>
                {result.treatment}
              </p>
              <div className="flex gap-2">
                <button className="btn-ghost" onClick={() => speakAuto(`${result.disease}. ${result.treatment}`, lang, caps.tts)}>
                  🔊 {t("speak", lang)}
                </button>
                {!result.ai_live && (
                  <span className="self-center text-xs" style={{ color: "var(--text-muted)" }}>
                    offline mode — add GEMINI_API_KEY for live vision diagnosis
                  </span>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

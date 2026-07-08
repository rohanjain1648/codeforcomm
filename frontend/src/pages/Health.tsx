// Crop Health — photo/voice logging → Gemini diagnosis → RSK escalation.
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Microscope, Landmark, CheckCircle2, Volume2, ImageUp } from "lucide-react";
import { api, type HealthLog } from "../lib/api";
import { useApp } from "../lib/store";
import { t } from "../lib/i18n";
import { speakAuto } from "../lib/voice";
import { Spinner, VoiceButton } from "../components/ui";
import { GlassCard } from "../components/ui/GlassCard";
import { HoverBorderGradient } from "../components/aceternity/hover-border-gradient";

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
    <div className="grid gap-6 md:grid-cols-2">
      <div className="flex flex-col gap-4">
        <GlassCard className="grid grid-cols-3 gap-3 p-1">
          <input className="input" placeholder={t("farmer_name", lang)} value={form.farmer}
            onChange={(e) => set("farmer", e.target.value)} />
          <input className="input" placeholder={t("village", lang)} value={form.village}
            onChange={(e) => set("village", e.target.value)} />
          <input className="input" placeholder={t("crop", lang)} value={form.crop}
            onChange={(e) => set("crop", e.target.value)} />
        </GlassCard>

        <GlassCard className="flex flex-col gap-2 p-1">
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
        </GlassCard>

        <GlassCard className="flex flex-col gap-3 p-1">
          <span className="inline-flex items-center gap-2 text-sm uppercase tracking-wider font-bold" style={{ color: "var(--accent)" }}>
            <ImageUp size={16} /> {t("upload_photo", lang)}
          </span>
          <label className="relative flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-[var(--border)] hover:border-[var(--accent)] rounded-2xl cursor-pointer transition-colors glass-panel group interactive">
            <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
              <ImageUp size={32} className="mb-3 text-[var(--text-muted)] group-hover:text-[var(--accent)] transition-colors" />
              <p className="mb-2 text-sm font-semibold text-[var(--text-secondary)]">Click or Drag & Drop</p>
              <p className="text-xs text-[var(--text-muted)]">PNG, JPG up to 10MB</p>
            </div>
            <input
              type="file" accept="image/*" capture="environment"
              onChange={(e) => onFile(e.target.files?.[0] ?? null)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </label>
          
          <AnimatePresence>
            {preview && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: "auto", marginTop: 12 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                className="overflow-hidden"
              >
                <img
                  src={preview} alt="crop preview" className="w-full h-48 rounded-xl object-cover shadow-lg border border-[var(--border)]"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </GlassCard>

        <div className="flex items-center gap-3 mt-2">
          <HoverBorderGradient
            containerClassName="rounded-full"
            as="button"
            className="bg-[var(--surface-0)] text-[var(--text-primary)] flex items-center space-x-2 font-bold px-8 py-3"
            onClick={submit as any}
          >
            <Microscope size={20} className="text-[var(--accent)]" />
            <span>{loading ? t("loading", lang) : t("diagnose", lang)}</span>
          </HoverBorderGradient>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <AnimatePresence>
          {result && (
            <motion.div
              className="flex flex-col gap-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <GlassCard
                className="p-1 border-l-4"
                style={{ borderLeftColor: result.escalated ? "var(--status-critical)" : "var(--status-good)" }}
              >
                <span className="inline-flex items-center gap-3 text-sm font-bold uppercase tracking-wider">
                  {result.escalated ? (
                    <>
                      <Landmark size={20} style={{ color: "var(--status-critical)" }} /> {t("escalated", lang)}
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={20} style={{ color: "var(--status-good)" }} /> {t("self_treat", lang)}
                    </>
                  )}
                </span>
              </GlassCard>

              <GlassCard className="flex flex-col gap-4 p-1">
                <div className="flex items-baseline justify-between border-b border-[var(--border)] pb-3">
                  <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[var(--text-primary)] to-[var(--text-muted)]">
                    {result.disease}
                  </span>
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-[var(--surface-1)] border border-[var(--border)]" style={{ color: SEV_COLOR[result.severity] }}>
                    <span className="inline-block h-2.5 w-2.5 rounded-full animate-pulse" style={{ background: SEV_COLOR[result.severity] }} />
                    {result.severity} · {result.confidence}%
                  </span>
                </div>
                <p className="whitespace-pre-wrap text-[15px] leading-relaxed font-medium" style={{ color: "var(--text-secondary)" }}>
                  {result.treatment}
                </p>
                <div className="flex gap-3 pt-2">
                  <button
                    className="btn-ghost inline-flex items-center gap-2 hover:bg-[var(--surface-1)] rounded-full px-4 py-2 transition-colors interactive"
                    onClick={() => speakAuto(`${result.disease}. ${result.treatment}`, lang, caps.tts)}
                  >
                    <Volume2 size={16} className="text-[var(--accent)]" /> 
                    <span className="font-semibold text-sm">{t("speak", lang)}</span>
                  </button>
                  {!result.ai_live && (
                    <span className="self-center text-xs px-3 py-1 rounded-full bg-[var(--surface-1)]" style={{ color: "var(--text-muted)" }}>
                      offline mode — add GEMINI_API_KEY
                    </span>
                  )}
                </div>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

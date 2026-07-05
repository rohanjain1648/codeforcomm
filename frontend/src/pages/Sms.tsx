// SMS / IVR — simulated gateway with live message composer + phone mockup,
// plus a Dialogflow-backed conversational endpoint (falls back to a
// keyword classifier when no Dialogflow agent is configured).
import { useState } from "react";
import { api, type AlertLevel } from "../lib/api";
import { useApp } from "../lib/store";
import { t } from "../lib/i18n";
import { speakAuto } from "../lib/voice";
import { Spinner, STATUS_COLOR, VoiceButton } from "../components/ui";

interface IvrTurn {
  from: "user" | "bot";
  text: string;
  intent?: string;
  live?: boolean;
}

export default function Sms() {
  const { lang, location, caps } = useApp();
  const [phone, setPhone] = useState("");
  const [loc, setLoc] = useState(location);
  const [messages, setMessages] = useState<{ sms: string; level: AlertLevel; live: boolean }[]>([]);
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const [ivrInput, setIvrInput] = useState("");
  const [ivrTurns, setIvrTurns] = useState<IvrTurn[]>([]);
  const [ivrBusy, setIvrBusy] = useState(false);

  const preview = async () => {
    setLoading(true);
    try {
      const res = await api.smsPreview(loc, lang);
      if (!res.error) setMessages((m) => [...m, { sms: res.sms, level: res.level, live: res.translate_live }]);
    } finally {
      setLoading(false);
    }
  };

  const subscribe = async () => {
    if (!phone.trim()) return;
    await api.smsSubscribe(phone, loc, lang);
    setSubscribed(true);
  };

  const sendIvr = async (text: string) => {
    if (!text.trim()) return;
    setIvrTurns((t2) => [...t2, { from: "user", text }]);
    setIvrInput("");
    setIvrBusy(true);
    try {
      const res = await api.ivr(`web-${Date.now()}`, text, lang);
      setIvrTurns((t2) => [...t2, { from: "bot", text: res.response_text, intent: res.intent, live: res.live }]);
      void speakAuto(res.response_text, lang, caps.tts);
    } finally {
      setIvrBusy(false);
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="flex flex-col gap-3">
        <div className="card flex flex-col gap-3">
          <span className="text-xs uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
            Feature-phone channel — daily advisory by SMS, no app or internet needed
          </span>
          <input className="input" placeholder={t("phone_ph", lang)} value={phone}
            onChange={(e) => setPhone(e.target.value)} />
          <input className="input" placeholder={t("location_ph", lang)} value={loc}
            onChange={(e) => setLoc(e.target.value)} />
          <div className="flex gap-2">
            <button className="btn" onClick={subscribe}>
              {subscribed ? "✓ Subscribed" : t("subscribe", lang)}
            </button>
            <button className="btn-ghost" onClick={preview} disabled={loading}>
              {t("sms_preview", lang)}
            </button>
            {loading && <Spinner label={t("loading", lang)} />}
          </div>
        </div>

        <div className="card flex flex-col gap-2">
          <span className="text-xs uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
            {t("ivr_chat", lang)} {caps.dialogflow ? "· live" : "· keyword fallback"}
          </span>
          <div className="flex max-h-56 flex-col gap-2 overflow-y-auto">
            {ivrTurns.length === 0 && (
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                Try: "which crop should I grow" or "is it going to rain this week"
              </p>
            )}
            {ivrTurns.map((turn, i) => (
              <div
                key={i}
                className="rounded-xl px-3 py-2 text-sm"
                style={{
                  alignSelf: turn.from === "user" ? "flex-end" : "flex-start",
                  background: turn.from === "user" ? "var(--accent)" : "var(--surface-2)",
                  color: turn.from === "user" ? "#08130d" : "var(--text-secondary)",
                  maxWidth: "85%",
                }}
              >
                {turn.text}
                {turn.intent && (
                  <div className="mt-1 text-[10px] opacity-70">intent: {turn.intent}</div>
                )}
              </div>
            ))}
            {ivrBusy && <Spinner label={t("loading", lang)} />}
          </div>
          <div className="flex gap-2">
            <input
              className="input"
              value={ivrInput}
              onChange={(e) => setIvrInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendIvr(ivrInput)}
              placeholder={t("ivr_chat", lang)}
            />
            <VoiceButton lang={lang} sttReady={caps.stt} onText={(txt) => sendIvr(txt)} />
            <button className="btn" onClick={() => sendIvr(ivrInput)}>
              {t("send", lang)}
            </button>
          </div>
        </div>
      </div>

      {/* Phone mockup */}
      <div
        className="mx-auto flex w-full max-w-xs flex-col gap-2 rounded-3xl p-4"
        style={{ background: "var(--surface-1)", border: "1px solid var(--border)", minHeight: 380 }}
      >
        <div className="mx-auto mb-1 h-1.5 w-16 rounded-full" style={{ background: "var(--border)" }} />
        <div className="text-center text-xs" style={{ color: "var(--text-muted)" }}>
          Messages · KA-KISAN
        </div>
        {messages.length === 0 && (
          <div className="mt-16 text-center text-sm" style={{ color: "var(--text-muted)" }}>
            Press "{t("sms_preview", lang)}" to compose today's real alert for {loc}.
          </div>
        )}
        {messages.map((m, i) => (
          <div
            key={i}
            className="rounded-2xl rounded-tl-sm p-3 text-sm"
            style={{
              background: "var(--surface-2)",
              borderLeft: `3px solid ${STATUS_COLOR[m.level]}`,
              color: "var(--text-secondary)",
            }}
          >
            {m.sms}
            <div className="mt-2 flex items-center justify-between">
              <button
                className="text-xs"
                style={{ color: "var(--accent)" }}
                onClick={() => speakAuto(m.sms, lang, caps.tts)}
              >
                🔊 {t("speak", lang)}
              </button>
              <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                {m.live ? "Translate: live" : "Translate: offline"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

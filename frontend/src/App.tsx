import { useEffect, useState } from "react";
import { useApp } from "./lib/store";
import { LANGS, t } from "./lib/i18n";
import { api } from "./lib/api";
import { CapabilityStrip } from "./components/ui";
import Dashboard from "./pages/Dashboard";
import Advisor from "./pages/Advisor";
import Alerts from "./pages/Alerts";
import Health from "./pages/Health";
import Rsk from "./pages/RSK";
import Sms from "./pages/Sms";
import Landing from "./pages/Landing";

const TABS = [
  { id: "dashboard", labelKey: "nav_dashboard", icon: "🌾" },
  { id: "advisor", labelKey: "nav_advisor", icon: "🧭" },
  { id: "alerts", labelKey: "nav_alerts", icon: "🔔" },
  { id: "health", labelKey: "nav_health", icon: "🔬" },
  { id: "rsk", labelKey: "nav_rsk", icon: "🏛️" },
  { id: "sms", labelKey: "nav_sms", icon: "📱" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function App() {
  const [tab, setTab] = useState<TabId>("dashboard");
  const [showApp, setShowApp] = useState(window.location.hash === "#app");
  const { lang, setLang, caps, setCaps } = useApp();

  useEffect(() => {
    const handleHashChange = () => setShowApp(window.location.hash === "#app");
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  useEffect(() => {
    api.status().then(setCaps).catch(() => {});
  }, [setCaps]);

  if (!showApp) {
    return <Landing />;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 pb-16">
      <header className="flex flex-wrap items-center justify-between gap-3 py-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            🌾 {t("app_title", lang)}
          </h1>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            {t("tagline", lang)}
          </p>
          <div className="mt-2">
            <CapabilityStrip caps={caps} />
          </div>
        </div>
        <div className="flex gap-1 rounded-xl p-1" style={{ background: "var(--surface-1)" }}>
          {LANGS.map((l) => (
            <button
              key={l.code}
              onClick={() => setLang(l.code)}
              className="rounded-lg px-3 py-1.5 text-sm"
              style={
                lang === l.code
                  ? { background: "var(--accent)", color: "#08130d", fontWeight: 600 }
                  : { color: "var(--text-secondary)" }
              }
            >
              {l.label}
            </button>
          ))}
        </div>
      </header>

      <nav className="mb-6 flex flex-wrap gap-2">
        {TABS.map((tb) => (
          <button
            key={tb.id}
            onClick={() => setTab(tb.id)}
            className="rounded-xl px-4 py-2 text-sm font-medium transition-colors"
            style={
              tab === tb.id
                ? { background: "var(--surface-2)", color: "var(--text-primary)", border: "1px solid var(--accent)" }
                : { background: "var(--surface-1)", color: "var(--text-secondary)", border: "1px solid var(--border)" }
            }
          >
            {tb.icon} {t(tb.labelKey, lang)}
          </button>
        ))}
      </nav>

      {tab === "dashboard" && <Dashboard />}
      {tab === "advisor" && <Advisor />}
      {tab === "alerts" && <Alerts />}
      {tab === "health" && <Health />}
      {tab === "rsk" && <Rsk />}
      {tab === "sms" && <Sms />}
    </div>
  );
}

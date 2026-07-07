import { useEffect, useState, type ComponentType } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wheat, Compass, Bell, Microscope, Landmark, MessageSquareText } from "lucide-react";
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
  { id: "dashboard", labelKey: "nav_dashboard", icon: Wheat },
  { id: "advisor", labelKey: "nav_advisor", icon: Compass },
  { id: "alerts", labelKey: "nav_alerts", icon: Bell },
  { id: "health", labelKey: "nav_health", icon: Microscope },
  { id: "rsk", labelKey: "nav_rsk", icon: Landmark },
  { id: "sms", labelKey: "nav_sms", icon: MessageSquareText },
] as const;

type TabId = (typeof TABS)[number]["id"];

const PAGES: Record<TabId, ComponentType> = {
  dashboard: Dashboard,
  advisor: Advisor,
  alerts: Alerts,
  health: Health,
  rsk: Rsk,
  sms: Sms,
};

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

  const ActivePage = PAGES[tab];

  return (
    <div className="mx-auto max-w-6xl px-4 pb-16">
      <motion.header
        className="flex flex-wrap items-center justify-between gap-3 py-5"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
            <Wheat size={26} style={{ color: "var(--accent)" }} />
            {t("app_title", lang)}
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
              className="relative rounded-lg px-3 py-1.5 text-sm transition-colors"
              style={
                lang === l.code
                  ? { color: "#08130d", fontWeight: 600 }
                  : { color: "var(--text-secondary)" }
              }
            >
              {lang === l.code && (
                <motion.span
                  layoutId="lang-active"
                  className="absolute inset-0 rounded-lg"
                  style={{ background: "var(--accent-gradient)" }}
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
              <span className="relative">{l.label}</span>
            </button>
          ))}
        </div>
      </motion.header>

      <nav className="mb-6 flex flex-wrap gap-2">
        {TABS.map((tb) => {
          const Icon = tb.icon;
          const active = tab === tb.id;
          return (
            <button
              key={tb.id}
              onClick={() => setTab(tb.id)}
              className="relative flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium"
              style={{
                color: active ? "var(--text-primary)" : "var(--text-secondary)",
                border: `1px solid ${active ? "var(--accent)" : "var(--border)"}`,
              }}
            >
              {active && (
                <motion.span
                  layoutId="nav-active"
                  className="absolute inset-0 rounded-xl"
                  style={{ background: "var(--surface-2)" }}
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
              <span className="relative flex items-center gap-2">
                <Icon size={16} />
                {t(tb.labelKey, lang)}
              </span>
            </button>
          );
        })}
      </nav>

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        >
          <ActivePage />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

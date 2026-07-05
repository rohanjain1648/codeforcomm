import { create } from "zustand";
import type { Lang } from "./i18n";
import type { AdvisoryRes, Capabilities } from "./api";

const EMPTY_CAPS: Capabilities = {
  ok: false, gemini: false, translate: false, tts: false, stt: false,
  earthengine: false, dialogflow: false, logs: 0, subscribers: 0,
};

interface AppState {
  lang: Lang;
  setLang: (l: Lang) => void;
  location: string;
  setLocation: (l: string) => void;
  advisory: AdvisoryRes | null;
  setAdvisory: (a: AdvisoryRes | null) => void;
  caps: Capabilities;
  setCaps: (c: Capabilities) => void;
}

export const useApp = create<AppState>((set) => ({
  lang: "en",
  setLang: (lang) => set({ lang }),
  location: "Anantapur",
  setLocation: (location) => set({ location }),
  advisory: null,
  setAdvisory: (advisory) => set({ advisory }),
  caps: EMPTY_CAPS,
  setCaps: (caps) => set({ caps }),
}));

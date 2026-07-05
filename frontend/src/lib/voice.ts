// Capability-aware voice pipeline: uses Cloud Text-to-Speech / Speech-to-Text
// (backend /api/tts, /api/stt) when GOOGLE_CLOUD_API_KEY is configured,
// falling back to the browser's Web Speech API otherwise — so voice always
// works in the demo, and upgrades transparently once real credentials exist.
import { api } from "./api";
import { speak as speakBrowser, type Lang } from "./i18n";

export async function speakAuto(text: string, lang: Lang, ttsReady: boolean): Promise<void> {
  if (ttsReady && text.trim()) {
    try {
      const { audio_b64, live } = await api.tts(text, lang);
      if (live && audio_b64) {
        const audio = new Audio(`data:audio/mp3;base64,${audio_b64}`);
        await audio.play();
        return;
      }
    } catch {
      // fall through to browser TTS
    }
  }
  speakBrowser(text, lang);
}

export function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(",")[1] ?? "");
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export async function transcribeCloudBlob(blob: Blob, lang: Lang): Promise<string> {
  const b64 = await blobToBase64(blob);
  const { text, live } = await api.stt(b64, lang);
  return live ? text : "";
}

import type { ReactNode } from "react";
import { Footer } from "../components/ui/Footer";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Wheat,
  Sparkles,
  Satellite,
  AudioLines,
  MessageCircle,
  Sun,
  Moon,
  CloudLightning,
} from "lucide-react";

import { useTheme } from "../components/ThemeProvider";
import { HeroScene } from "../components/three/HeroScene";
import { SpotlightCard } from "../components/ui/SpotlightCard";
import { AnimatedText } from "../components/ui/AnimatedText";

// Basic reveal animation wrapper
function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  
  return (
    <button
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="p-2 rounded-full hover:bg-[var(--surface-2)] transition-colors"
      aria-label="Toggle theme"
    >
      {resolvedTheme === "dark" ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} className="text-gray-600" />}
    </button>
  );
}

const BENTO_FEATURES = [
  {
    Icon: Satellite,
    title: "Live Earth Engine Telemetry",
    desc: "Ingest multi-spectral satellite imagery in real-time. Automatically track NDVI, soil moisture, and evapotranspiration to trigger precision irrigation workflows before a drought hits.",
    image: "/images/earth_engine.png",
    className: "md:col-span-2 md:row-span-2",
  },
  {
    Icon: Sparkles,
    title: "Gemini Vision Diagnostics",
    desc: "Snap a photo of a diseased leaf. Our multimodal models instantly identify the pathogen and recommend verified treatments.",
    image: "/images/gemini_vision.png",
    className: "md:col-span-1",
  },
  {
    Icon: CloudLightning,
    title: "Predictive Weather",
    desc: "16-day granular forecasts tied to your coordinates. Automate dry spell mitigation.",
    image: "/images/weather_forecast.png",
    className: "md:col-span-1",
  },
  {
    Icon: AudioLines,
    title: "Voice-First Multilingual Advisory",
    desc: "Dial in from any basic phone. Our Cloud TTS and Dialogflow integration delivers real-time advisory in native dialects.",
    image: "/images/voice_advisory.png",
    className: "md:col-span-3",
  },
];

const INTEGRATIONS = [
  { title: "Google Gemini", Icon: Sparkles },
  { title: "Earth Engine", Icon: Satellite },
  { title: "Cloud TTS", Icon: AudioLines },
  { title: "Dialogflow", Icon: MessageCircle },
];

export default function Landing() {
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 600], [1, 0]);
  const heroY = useTransform(scrollY, [0, 800], [0, 200]);

  return (
    <div className="flex flex-col min-h-screen bg-[var(--surface-0)] text-[var(--text-primary)] selection:bg-[var(--accent)] selection:text-[var(--accent-fg)] transition-colors duration-300">
      
      {/* Subtle Grid Background */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-grid opacity-60" />

      {/* Floating Header */}
      <div className="fixed top-0 w-full z-50 p-4 md:p-6 transition-colors duration-300 pointer-events-none">
        <header className="mx-auto max-w-5xl px-6 h-16 flex items-center justify-between bg-[var(--surface-0)] border border-[var(--border)] rounded-full shadow-sm pointer-events-auto">
          <div className="flex items-center gap-3 font-semibold tracking-tight text-lg">
            <Wheat size={20} className="text-[var(--text-primary)]" />
            <span>KisanAlert</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[var(--text-secondary)]">
            <a href="#platform" className="hover:text-[var(--text-primary)] transition-colors">Platform</a>
            <a href="#integrations" className="hover:text-[var(--text-primary)] transition-colors">Integrations</a>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <a
              href="/#app"
              className="text-sm font-semibold bg-[var(--accent)] text-[var(--accent-fg)] px-5 py-2 rounded-full border border-black/10 hover:brightness-95 transition-all shadow-sm"
            >
              Launch App
            </a>
          </div>
        </header>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen w-full flex items-center justify-center pt-20 pb-16 px-6">
        <div className="absolute inset-0 z-0 mask-image-bottom">
          <HeroScene />
        </div>
        
        <motion.div 
          className="relative z-10 mx-auto max-w-4xl text-center"
          style={{ opacity: heroOpacity, y: heroY }}
        >
          <AnimatedText 
            text="Precision Agriculture, Solved." 
            className="text-5xl md:text-8xl font-black tracking-tight justify-center mb-8 text-[var(--text-primary)]" 
          />
          
          <motion.p
            className="text-xl md:text-2xl text-[var(--text-secondary)] max-w-3xl mx-auto mb-12 font-medium tracking-wide leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            We abstracted the complexity of satellite telemetry and multimodal AI into actionable, hyper-localized insights. Built for the modern farmer.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a
              href="/#app"
              className="bg-[var(--accent)] text-[var(--accent-fg)] px-10 py-4 rounded-full font-bold text-lg border border-black/10 hover:-translate-y-1 hover:shadow-lg transition-all shadow-sm"
            >
              Start Building for Free
            </a>
            <a
              href="#platform"
              className="px-10 py-4 text-lg font-semibold text-[var(--text-primary)] bg-[var(--surface-0)] border border-[var(--border)] rounded-full hover:bg-[var(--surface-1)] transition-all shadow-sm"
            >
              Explore Features
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* Platform / Features (Bento Box Grid) */}
      <section id="platform" className="relative py-24 px-6 z-20 border-t border-[var(--border)] bg-[var(--surface-0)] transition-colors duration-300">
        <div className="mx-auto max-w-5xl">
          <Reveal className="mb-16 text-center md:text-left">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
              A Unified Ecosystem
            </h2>
            <p className="text-xl text-[var(--text-secondary)] max-w-2xl font-medium">
              We leverage planetary-scale datasets and multimodal language models to deliver predictive intelligence instantly.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {BENTO_FEATURES.map((feature, i) => (
              <Reveal key={i} delay={i * 0.1} className={feature.className}>
                <SpotlightCard className="p-8 md:p-10 flex flex-col h-full bg-[var(--surface-0)] border border-[var(--border)] rounded-[2rem] shadow-sm overflow-hidden group">
                  <div className="flex flex-col mb-8 relative z-10">
                    <div className="p-4 bg-[var(--surface-1)] border border-[var(--border)] rounded-2xl w-fit shadow-sm mb-6">
                      <feature.Icon size={28} className="text-[var(--text-primary)]" />
                    </div>
                    <h3 className="text-2xl font-bold tracking-tight mb-3 text-[var(--text-primary)]">
                      {feature.title}
                    </h3>
                    <p className="text-[var(--text-secondary)] text-base leading-relaxed font-medium max-w-xl">
                      {feature.desc}
                    </p>
                  </div>

                  <div className="mt-auto relative rounded-2xl overflow-hidden border border-[var(--border)] bg-[var(--surface-1)] flex items-center justify-center">
                    <img 
                      src={feature.image} 
                      alt={feature.title} 
                      className="w-full h-auto object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                    />
                  </div>
                </SpotlightCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations Marquee */}
      <section id="integrations" className="py-24 border-t border-[var(--border)] bg-[var(--surface-1)] overflow-hidden transition-colors duration-300 relative z-20">
        <div className="mx-auto max-w-7xl px-6 flex flex-col items-center">
          <p className="text-sm font-bold tracking-widest text-[var(--text-muted)] uppercase mb-12">
            Powered by Enterprise Infrastructure
          </p>
          <div className="flex flex-wrap justify-center gap-x-12 gap-y-8 opacity-70 grayscale hover:grayscale-0 transition-all duration-300">
            {INTEGRATIONS.map((item) => (
              <div key={item.title} className="flex items-center gap-3 text-xl font-bold tracking-tight text-[var(--text-primary)]">
                <item.Icon className="text-[var(--text-primary)]" size={28} />
                {item.title}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <div className="relative z-20">
        <Footer />
      </div>
    </div>
  );
}

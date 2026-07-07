import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import {
  Wheat,
  Compass,
  Bell,
  Microscope,
  Sparkles,
  Satellite,
  AudioLines,
  MessageCircle,
} from "lucide-react";

import { HeroScene } from "../components/three/HeroScene";
import { SpotlightCard } from "../components/ui/SpotlightCard";
import { AnimatedText } from "../components/ui/AnimatedText";
import { cn } from "../lib/utils";

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

const FEATURES = [
  {
    Icon: Compass,
    title: "Intelligence, Not Instinct",
    desc: "12 crops scored in real-time against granular soil, water, and economic datasets. Eliminate guesswork.",
    colSpan: "md:col-span-2",
  },
  {
    Icon: Bell,
    title: "Predictive Alerts",
    desc: "Hyper-local 16-day forecasts. Automatic dry-spell mitigation.",
    colSpan: "md:col-span-1",
  },
  {
    Icon: Microscope,
    title: "Vision AI Diagnostics",
    desc: "Capture a photo. Our vision models diagnose disease and recommend verified treatments instantly.",
    colSpan: "md:col-span-3",
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
    <div className="flex flex-col min-h-screen bg-[var(--surface-0)] text-white overflow-hidden selection:bg-emerald-500/30">
      
      {/* Sleek Header */}
      <header className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/40 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 font-semibold tracking-tight text-lg">
            <Wheat size={20} className="text-[#10B981]" />
            <span>KisanAlert</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
            <a href="#platform" className="hover:text-white transition-colors">Platform</a>
            <a href="#vision" className="hover:text-white transition-colors">Vision</a>
            <a href="#integrations" className="hover:text-white transition-colors">Integrations</a>
          </div>
          <a
            href="/#app"
            className="text-sm font-medium bg-white text-black px-4 py-1.5 rounded-full hover:scale-105 transition-transform"
          >
            Launch App
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-screen w-full flex items-center justify-center pt-16">
        <HeroScene />
        
        <motion.div 
          className="relative z-10 mx-auto max-w-5xl px-6 text-center"
          style={{ opacity: heroOpacity, y: heroY }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-8 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-xs font-medium tracking-wide text-gray-300 uppercase">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Live satellite telemetry
          </div>
          
          <AnimatedText 
            text="Precision Agriculture, Solved." 
            className="text-6xl md:text-8xl font-bold tracking-tighter justify-center mb-6" 
          />
          
          <motion.p
            className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto mb-10 font-light tracking-wide"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            High-fidelity data and predictive models for the modern farmer. 
            Accessible everywhere.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center justify-center gap-6"
          >
            <a
              href="/#app"
              className="bg-white text-black px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-200 transition-colors"
            >
              Start Building
            </a>
            <a
              href="#platform"
              className="px-8 py-4 text-lg font-medium text-gray-400 hover:text-white transition-colors"
            >
              Explore Platform
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* Platform / Features */}
      <section id="platform" className="relative py-32 px-6 z-20 bg-black">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        
        <div className="mx-auto max-w-6xl">
          <Reveal className="mb-20">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4">
              A Unified <span className="text-gray-500">Ecosystem</span>
            </h2>
            <p className="text-lg text-gray-400 max-w-xl">
              We abstracted the complexity of climate and satellite data into actionable, hyper-localized insights.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {FEATURES.map((feature, i) => (
              <SpotlightCard key={i} className={cn("p-8 flex flex-col min-h-[300px]", feature.colSpan)}>
                <div className="p-3 bg-white/5 border border-white/10 rounded-lg w-fit mb-auto">
                  <feature.Icon size={24} className="text-emerald-500" />
                </div>
                <div className="mt-12">
                  <h3 className="text-2xl font-bold tracking-tight mb-3">{feature.title}</h3>
                  <p className="text-gray-400 text-lg leading-relaxed">{feature.desc}</p>
                </div>
              </SpotlightCard>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations Marquee */}
      <section id="integrations" className="py-24 border-y border-white/5 bg-[#050505] overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 flex flex-col items-center">
          <p className="text-sm font-medium tracking-widest text-gray-500 uppercase mb-12">
            Powered by Enterprise Infrastructure
          </p>
          <div className="flex flex-wrap justify-center gap-x-12 gap-y-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            {INTEGRATIONS.map((item) => (
              <div key={item.title} className="flex items-center gap-3 text-xl font-bold tracking-tight">
                <item.Icon className="text-emerald-500" />
                {item.title}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-black">
        <div className="mx-auto max-w-6xl flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-2 font-semibold text-white">
            <Wheat size={16} className="text-emerald-500" />
            KisanAlert
          </div>
          <p>
            Designed for scale. Built for impact.
          </p>
        </div>
      </footer>
    </div>
  );
}

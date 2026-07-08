import type { ReactNode } from "react";
import { Wheat, ArrowLeft, Sun, Moon } from "lucide-react";
import { Footer } from "./Footer";
import { useTheme } from "../ThemeProvider";

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  
  return (
    <button
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="p-2 rounded-full bg-[var(--surface-1)] border border-[var(--border)] hover:border-[var(--border-hover)] transition-colors"
      aria-label="Toggle theme"
    >
      {resolvedTheme === "dark" ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} className="text-gray-600" />}
    </button>
  );
}

export function StaticPageLayout({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-[var(--surface-0)] text-[var(--text-primary)] transition-colors duration-300">
      
      {/* Header */}
      <header className="sticky top-0 w-full z-50 border-b border-[var(--border)] bg-[var(--surface-glass)] backdrop-blur-xl transition-colors duration-300">
        <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <a href="/#" className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
              <ArrowLeft size={18} />
              <span className="text-sm font-medium">Home</span>
            </a>
            <div className="w-px h-6 bg-[var(--border)] hidden md:block"></div>
            <div className="hidden md:flex items-center gap-2 font-semibold tracking-tight text-lg">
              <Wheat size={20} className="text-[var(--accent)]" />
              <span>KisanAlert</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <a
              href="/#app"
              className="text-sm font-medium bg-[var(--text-primary)] text-[var(--surface-0)] px-4 py-1.5 rounded-full hover:scale-105 transition-transform"
            >
              Launch App
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col py-24 px-6 relative z-10">
        <div className="mx-auto max-w-3xl w-full">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-12">{title}</h1>
          <div className="flex flex-col gap-6 text-[var(--text-secondary)] leading-relaxed text-lg">
            {children}
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

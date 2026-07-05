// Landing page — professional product site for KisanAlert
export default function Landing() {
  return (
    <div className="flex flex-col min-h-screen" style={{ background: "var(--surface-0)" }}>
      {/* Header */}
      <header className="sticky top-0 z-50 border-b" style={{ background: "var(--surface-1)", borderColor: "var(--border)" }}>
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <div className="text-xl font-bold">🌾 KisanAlert</div>
          <nav className="hidden md:flex gap-6 text-sm">
            <a href="#features" className="hover:text-accent" style={{ color: "var(--text-secondary)" }}>Features</a>
            <a href="#how-it-works" className="hover:text-accent" style={{ color: "var(--text-secondary)" }}>How It Works</a>
            <a href="#impact" className="hover:text-accent" style={{ color: "var(--text-secondary)" }}>Impact</a>
          </nav>
          <a href="/#app" className="btn text-sm px-4 py-2">Enter App</a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4" style={{ background: "linear-gradient(135deg, var(--surface-1) 0%, var(--surface-2) 100%)" }}>
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 tracking-tight">
            Smart Water. Smart Crops. Smart Farming.
          </h1>
          <p className="text-xl mb-8" style={{ color: "var(--text-secondary)" }}>
            Voice-first agricultural intelligence in 10 Indian languages, built for small and marginal farmers to make data-driven decisions — not habit-driven ones.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a href="/#app" className="btn px-6 py-3 text-base font-medium">
              Launch App
            </a>
            <a href="#features" className="btn-ghost px-6 py-3 text-base font-medium" style={{ border: "1px solid var(--accent)" }}>
              Learn More
            </a>
          </div>
          <div className="mt-12 grid grid-cols-3 gap-4 text-sm">
            <div>
              <div className="text-2xl font-bold">10</div>
              <div style={{ color: "var(--text-secondary)" }}>Languages Supported</div>
            </div>
            <div>
              <div className="text-2xl font-bold">12</div>
              <div style={{ color: "var(--text-secondary)" }}>Crops Analyzed</div>
            </div>
            <div>
              <div className="text-2xl font-bold">16</div>
              <div style={{ color: "var(--text-secondary)" }}>Day Forecast</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-4xl font-bold text-center mb-16">Three Components, One Workflow</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Component 1 */}
            <div className="card flex flex-col gap-4">
              <div className="text-4xl">🧭</div>
              <h3 className="text-xl font-bold">Smart Crop Recommendation</h3>
              <p style={{ color: "var(--text-secondary)" }}>
                Scores 12 crops against your district's soil type, rainfall, groundwater depth, irrigation source and market economics. Get a score breakdown with AI explanation in your language.
              </p>
              <ul className="text-sm space-y-2" style={{ color: "var(--text-secondary)" }}>
                <li>✓ Real-time Earth Engine satellite data (NDVI, soil moisture)</li>
                <li>✓ Profit projections in local currency</li>
                <li>✓ Soil-water-season-ROI scoring breakdown</li>
              </ul>
            </div>

            {/* Component 2 */}
            <div className="card flex flex-col gap-4">
              <div className="text-4xl">🔔</div>
              <h3 className="text-xl font-bold">Real-time Alerts & Advisory</h3>
              <p style={{ color: "var(--text-secondary)" }}>
                16-day rainfall forecasts pinned to your village. Automatic dry-spell detection (amber ≥4 days, red ≥7 days) with irrigation, fertilization and spraying day-actions.
              </p>
              <ul className="text-sm space-y-2" style={{ color: "var(--text-secondary)" }}>
                <li>✓ Maps hotspot view of 10 districts colored by alert level</li>
                <li>✓ SMS alerts for feature-phone users</li>
                <li>✓ Voice playback in your language</li>
              </ul>
            </div>

            {/* Component 3 */}
            <div className="card flex flex-col gap-4">
              <div className="text-4xl">🔬</div>
              <h3 className="text-xl font-bold">Crop Health → Expert Escalation</h3>
              <p style={{ color: "var(--text-secondary)" }}>
                Upload a photo + voice description of sick crops. AI vision diagnosis returns disease name, confidence, severity, and organic/chemical treatments.
              </p>
              <ul className="text-sm space-y-2" style={{ color: "var(--text-secondary)" }}>
                <li>✓ High-severity or low-confidence cases auto-escalate</li>
                <li>✓ Plugs into Rythu Seva Kendra expert network</li>
                <li>✓ Expert can schedule callbacks or resolve</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4" style={{ background: "var(--surface-1)" }}>
        <div className="mx-auto max-w-5xl">
          <h2 className="text-4xl font-bold text-center mb-16">How It Works</h2>
          <div className="space-y-8">
            <div className="flex gap-6 items-start">
              <div className="text-3xl font-bold" style={{ color: "var(--accent)", minWidth: 60 }}>1</div>
              <div>
                <h3 className="font-bold mb-2">Enter Your Farm Details</h3>
                <p style={{ color: "var(--text-secondary)" }}>District, soil type, groundwater depth, irrigation source, season, acreage. All optional — defaults exist.</p>
              </div>
            </div>
            <div className="flex gap-6 items-start">
              <div className="text-3xl font-bold" style={{ color: "var(--accent)", minWidth: 60 }}>2</div>
              <div>
                <h3 className="font-bold mb-2">Get Crop Scores (Real-time Data)</h3>
                <p style={{ color: "var(--text-secondary)" }}>12 crops ranked 0–100, overlaid with live Earth Engine satellite data (NDVI, soil moisture), with profit projections and AI explanation in your language.</p>
              </div>
            </div>
            <div className="flex gap-6 items-start">
              <div className="text-3xl font-bold" style={{ color: "var(--accent)", minWidth: 60 }}>3</div>
              <div>
                <h3 className="font-bold mb-2">Monitor Dry-Spell Alerts</h3>
                <p style={{ color: "var(--text-secondary)" }}>16-day forecast, automatic alert detection, voice/SMS/on-screen delivery. Tap a map marker to see your district's live alert level.</p>
              </div>
            </div>
            <div className="flex gap-6 items-start">
              <div className="text-3xl font-bold" style={{ color: "var(--accent)", minWidth: 60 }}>4</div>
              <div>
                <h3 className="font-bold mb-2">Log Crop Health</h3>
                <p style={{ color: "var(--text-secondary)" }}>Snap a photo of your sick crop, describe it by voice or text. AI vision returns a diagnosis, severity, and treatment. If serious, it auto-escalates to an RSK expert who may follow up.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technology */}
      <section className="py-20 px-4">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-4xl font-bold text-center mb-16">Built on Google Cloud</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: "🤖", title: "Gemini API", desc: "Recommendation reasoning, vision diagnosis, advisories" },
              { icon: "🗣️", title: "Cloud TTS/STT", desc: "Voice in your language, works offline too" },
              { icon: "🌐", title: "Cloud Translation", desc: "SMS and chat in 10 Indian languages" },
              { icon: "🛰️", title: "Earth Engine", desc: "Live satellite NDVI + soil moisture" },
              { icon: "🗺️", title: "Google Maps", desc: "District hotspot map, live alert coloring" },
              { icon: "💬", title: "Dialogflow ES", desc: "Conversational IVR routing (keyword fallback too)" },
            ].map((tech, i) => (
              <div key={i} className="card text-center p-6">
                <div className="text-4xl mb-3">{tech.icon}</div>
                <h3 className="font-bold mb-2">{tech.title}</h3>
                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{tech.desc}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-sm mt-12" style={{ color: "var(--text-secondary)" }}>
            Every service degrades gracefully to an offline fallback when no credentials are configured — so the demo always works end-to-end. A live capability strip in the app header shows which services are live vs. fallback.
          </p>
        </div>
      </section>

      {/* Impact Section */}
      <section id="impact" className="py-20 px-4" style={{ background: "var(--surface-1)" }}>
        <div className="mx-auto max-w-5xl">
          <h2 className="text-4xl font-bold text-center mb-16">Real Impact</h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold mb-4">For Farmers</h3>
              <ul className="space-y-3" style={{ color: "var(--text-secondary)" }}>
                <li className="flex gap-3">
                  <span className="text-lg">✓</span>
                  <span>No app install needed — works by SMS for feature phones</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-lg">✓</span>
                  <span>Low-literacy UI with icons and voice guidance</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-lg">✓</span>
                  <span>Expert escalation plugs into existing Rythu Seva Kendra network</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-lg">✓</span>
                  <span>Data-driven decisions beat habit — proven by crop scoring</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-4">Scale Potential</h3>
              <div className="space-y-4">
                <div className="card p-4">
                  <div className="font-bold">Andhra Pradesh</div>
                  <div className="text-sm" style={{ color: "var(--text-secondary)" }}>10,778 Rythu Seva Kendras (RSKs) reaching ~5M farm families</div>
                </div>
                <div className="card p-4">
                  <div className="font-bold">Stateless Design</div>
                  <div className="text-sm" style={{ color: "var(--text-secondary)" }}>FastAPI on Cloud Run + static frontend on Firebase Hosting</div>
                </div>
                <div className="card p-4">
                  <div className="font-bold">Any District</div>
                  <div className="text-sm" style={{ color: "var(--text-secondary)" }}>Add a row to the crop/district table, restart. No code changes.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Languages */}
      <section className="py-20 px-4">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="text-4xl font-bold mb-8">Available in Your Language</h2>
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {["English", "हिंदी", "தமிழ்", "తెలుగు", "मराठी", "ਪੰਜਾਬੀ", "বাংলা", "ಕನ್ನಡ", "മലയാളം", "ગુજરાતી"].map((lang) => (
              <span key={lang} className="card px-4 py-2 text-sm">{lang}</span>
            ))}
          </div>
          <p style={{ color: "var(--text-secondary)" }}>
            UI, AI responses, SMS alerts, voice guidance, satellite data — all localized to your selected language.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4" style={{ background: "linear-gradient(135deg, var(--accent) 0%, rgb(76, 175, 80) 100%)" }}>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-4xl font-bold mb-4" style={{ color: "#08130d" }}>Ready to Transform Your Farming?</h2>
          <p className="text-lg mb-8" style={{ color: "rgba(8, 19, 13, 0.8)" }}>
            Enter the app now — no signup required. Start with your district and language.
          </p>
          <a href="/#app" className="btn px-8 py-4 text-lg font-bold" style={{ background: "#08130d", color: "var(--accent)" }}>
            Launch KisanAlert
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto" style={{ background: "var(--surface-1)", borderTop: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-6xl px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            {/* About */}
            <div>
              <h4 className="font-bold mb-4">About</h4>
              <ul className="space-y-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                <li><a href="#features" className="hover:text-accent">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-accent">How It Works</a></li>
                <li><a href="#impact" className="hover:text-accent">Impact</a></li>
              </ul>
            </div>

            {/* App Sections */}
            <div>
              <h4 className="font-bold mb-4">App</h4>
              <ul className="space-y-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                <li><a href="/#app" className="hover:text-accent">Dashboard</a></li>
                <li><a href="/#app" className="hover:text-accent">Crop Advisor</a></li>
                <li><a href="/#app" className="hover:text-accent">Alerts</a></li>
                <li><a href="/#app" className="hover:text-accent">Crop Health</a></li>
              </ul>
            </div>

            {/* More Features */}
            <div>
              <h4 className="font-bold mb-4">More</h4>
              <ul className="space-y-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                <li><a href="/#app" className="hover:text-accent">RSK Desk</a></li>
                <li><a href="/#app" className="hover:text-accent">SMS / IVR</a></li>
              </ul>
            </div>

            {/* Technology */}
            <div>
              <h4 className="font-bold mb-4">Tech</h4>
              <ul className="space-y-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                <li><a href="https://cloud.google.com" target="_blank" rel="noopener noreferrer" className="hover:text-accent">Google Cloud</a></li>
                <li><a href="https://fastapi.tiangolo.com" target="_blank" rel="noopener noreferrer" className="hover:text-accent">FastAPI</a></li>
                <li><a href="https://react.dev" target="_blank" rel="noopener noreferrer" className="hover:text-accent">React</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                <li><a href="#privacy" className="hover:text-accent">Privacy</a></li>
                <li><a href="#terms" className="hover:text-accent">Terms</a></li>
                <li><a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-accent">GitHub</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t" style={{ borderColor: "var(--border)", paddingTop: 24 }}>
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm" style={{ color: "var(--text-secondary)" }}>
              <div>
                <div className="font-semibold">🌾 KisanAlert</div>
                <div>Smart Water. Smart Crops. Smart Farming.</div>
              </div>
              <div className="text-right">
                <div>Built for India's small and marginal farmers</div>
                <div>Hack2Skill "Code for Communities" — Track 4</div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t text-center text-xs" style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}>
            © 2026 KisanAlert. Data over habit, in your language. Open source, free for farmers.
          </div>
        </div>
      </footer>
    </div>
  );
}

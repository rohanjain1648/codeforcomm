import { Wheat } from "lucide-react";

export function Footer() {
  return (
    <footer className="py-16 px-6 bg-[var(--surface-0)] border-t border-[var(--border)] transition-colors duration-300">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-16">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 font-semibold text-xl tracking-tight text-[var(--text-primary)] mb-6">
              <Wheat size={24} className="text-[var(--accent)]" />
              KisanAlert
            </div>
            <p className="text-[var(--text-secondary)] text-sm max-w-sm leading-relaxed">
              Precision agriculture powered by AI and satellite telemetry. 
              Designed for scale, built for impact. We provide farmers with 
              predictive intelligence to navigate an unpredictable climate.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-[var(--text-primary)] mb-4">Product</h4>
            <ul className="flex flex-col gap-3 text-sm text-[var(--text-secondary)]">
              <li><a href="/#platform" className="hover:text-[var(--text-primary)] transition-colors">Platform</a></li>
              <li><a href="#features" className="hover:text-[var(--text-primary)] transition-colors">Features</a></li>
              <li><a href="#pricing" className="hover:text-[var(--text-primary)] transition-colors">Pricing</a></li>
              <li><a href="/#integrations" className="hover:text-[var(--text-primary)] transition-colors">Integrations</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-[var(--text-primary)] mb-4">Company</h4>
            <ul className="flex flex-col gap-3 text-sm text-[var(--text-secondary)]">
              <li><a href="#about" className="hover:text-[var(--text-primary)] transition-colors">About Us</a></li>
              <li><a href="#careers" className="hover:text-[var(--text-primary)] transition-colors">Careers</a></li>
              <li><a href="#press" className="hover:text-[var(--text-primary)] transition-colors">Press</a></li>
              <li><a href="#contact" className="hover:text-[var(--text-primary)] transition-colors">Contact</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-[var(--text-primary)] mb-4">Legal</h4>
            <ul className="flex flex-col gap-3 text-sm text-[var(--text-secondary)]">
              <li><a href="#privacy" className="hover:text-[var(--text-primary)] transition-colors">Privacy Policy</a></li>
              <li><a href="#terms" className="hover:text-[var(--text-primary)] transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-[var(--border)] flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-[var(--text-muted)]">
          <p>© {new Date().getFullYear()} KisanAlert Inc. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-[var(--text-primary)] transition-colors">Twitter</a>
            <a href="#" className="hover:text-[var(--text-primary)] transition-colors">GitHub</a>
            <a href="#" className="hover:text-[var(--text-primary)] transition-colors">LinkedIn</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

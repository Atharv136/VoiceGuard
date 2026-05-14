import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";
import { helplines } from "@/data/mock";

export function Footer() {
  return (
    <footer className="mt-24 border-t bg-card">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-4 md:px-6">
        <div className="md:col-span-2">
          <Logo />
          <p className="mt-3 max-w-sm text-sm text-muted-foreground">
            Protecting Indian families from deepfake voice scams. Free to use, private by design.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold">Product</p>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/dashboard" className="hover:text-foreground">Dashboard</Link></li>
            <li><Link to="/awareness" className="hover:text-foreground">Scam feed</Link></li>
            <li><Link to="/phrases" className="hover:text-foreground">Phrase library</Link></li>
            <li><Link to="/phone-check" className="hover:text-foreground">Phone check</Link></li>
            <li><Link to="/safety-check" className="hover:text-foreground">Safety check</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold">Emergency helplines</p>
          <ul className="mt-3 space-y-2 text-sm">
            {helplines.map((h) => (
              <li key={h.number} className="flex items-center justify-between">
                <span className="text-muted-foreground">{h.label}</span>
                <a href={`tel:${h.number}`} className="font-display font-bold text-danger">{h.number}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t">
        <p className="mx-auto max-w-7xl px-4 py-5 text-center text-xs text-muted-foreground md:px-6">
          © {new Date().getFullYear()} VoiceGuard. Protecting Indian families from deepfake voice scams.
        </p>
      </div>
    </footer>
  );
}

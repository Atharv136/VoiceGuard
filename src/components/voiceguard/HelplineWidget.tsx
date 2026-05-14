import { useState } from "react";
import { Phone, ShieldAlert, X } from "lucide-react";
import { helplines } from "@/data/mock";

export function HelplineWidget() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Card — shown when open */}
      {open && (
        <div
          className="w-64 rounded-2xl border border-danger/20 bg-card p-4 shadow-2xl"
          style={{
            animation: "helpline-in 0.2s cubic-bezier(0.34,1.56,0.64,1) both",
          }}
        >
          <div className="mb-3 flex items-center justify-between">
            <p className="flex items-center gap-1.5 text-sm font-bold text-danger">
              <ShieldAlert className="h-4 w-4" />
              Emergency Helplines
            </p>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close helplines"
              className="rounded-md p-0.5 text-muted-foreground transition hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <ul className="space-y-1">
            {helplines.map((h) => (
              <li key={h.number}>
                <a
                  href={`tel:${h.number}`}
                  className="flex items-center justify-between rounded-lg px-3 py-2 text-sm transition hover:bg-muted"
                >
                  <span className="text-muted-foreground">{h.label}</span>
                  <span className="inline-flex items-center gap-1 font-bold text-danger">
                    <Phone className="h-3.5 w-3.5" />
                    {h.number}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Toggle button — red shield */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close emergency helplines" : "Open emergency helplines"}
        className="grid h-14 w-14 place-items-center rounded-full bg-danger text-white shadow-lg ring-4 ring-danger/25 transition hover:bg-danger/90 hover:scale-105 active:scale-95"
        style={{ transition: "transform 0.15s ease, background 0.15s ease" }}
      >
        <ShieldAlert className="h-6 w-6" />
      </button>

      <style>{`
        @keyframes helpline-in {
          from { opacity: 0; transform: scale(0.85) translateY(10px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}

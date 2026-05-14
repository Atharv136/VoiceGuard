import { useState } from "react";
import { Phone, ShieldAlert, X } from "lucide-react";
import { helplines } from "@/data/mock";

export function HelplineWidget() {
  const [open, setOpen] = useState(false);
  return (
    <>
      {/* Mobile floating */}
      <div className="fixed bottom-5 right-5 z-50 md:hidden">
        {open && (
          <div className="mb-3 w-64 rounded-[14px] border bg-card p-3 shadow-xl">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm font-semibold">Emergency Helplines</p>
              <button onClick={() => setOpen(false)} aria-label="Close" className="text-muted-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>
            <ul className="space-y-1">
              {helplines.map((h) => (
                <li key={h.number}>
                  <a href={`tel:${h.number}`} className="tap-target flex items-center justify-between rounded-md px-3 py-2 text-sm hover:bg-muted">
                    <span>{h.label}</span>
                    <span className="font-display text-base font-bold text-danger">{h.number}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
        <button
          onClick={() => setOpen((v) => !v)}
          className="grid h-14 w-14 place-items-center rounded-full bg-danger text-danger-foreground shadow-lg ring-4 ring-danger/20"
          aria-label="Open emergency helplines"
        >
          <ShieldAlert className="h-6 w-6" />
        </button>
      </div>
      {/* Desktop side widget */}
      <aside className="fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 md:block">
        <div className="w-56 rounded-[14px] border bg-card p-3 shadow-md">
          <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-danger">
            <ShieldAlert className="h-3.5 w-3.5" /> Emergency Helplines
          </p>
          <ul className="space-y-1">
            {helplines.map((h) => (
              <li key={h.number}>
                <a href={`tel:${h.number}`} className="flex items-center justify-between rounded-md px-2 py-2 text-sm hover:bg-muted">
                  <span className="text-muted-foreground">{h.label}</span>
                  <span className="inline-flex items-center gap-1 font-display font-bold text-danger">
                    <Phone className="h-3.5 w-3.5" />
                    {h.number}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </>
  );
}

import { useEffect, useState } from "react";
import { Check, Loader2 } from "lucide-react";

const steps = [
  "Uploading audio",
  "Checking voice authenticity",
  "Reading conversation content",
  "Generating risk report",
];

export function AnalysisProgress({ onDone }: { onDone: () => void }) {
  const [active, setActive] = useState(0);
  useEffect(() => {
    if (active >= steps.length) {
      onDone();
      return;
    }
    const t = setTimeout(() => setActive((s) => s + 1), 700);
    return () => clearTimeout(t);
  }, [active, onDone]);
  return (
    <div className="space-y-3">
      {steps.map((s, i) => {
        const done = i < active;
        const current = i === active;
        return (
          <div
            key={s}
            className={`flex items-center gap-3 rounded-[12px] border bg-card p-4 ${current ? "ring-2 ring-primary/30" : ""}`}
          >
            <span
              className={`grid h-9 w-9 place-items-center rounded-full ${
                done ? "bg-safe text-safe-foreground" : current ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}
            >
              {done ? <Check className="h-4 w-4" /> : current ? <Loader2 className="h-4 w-4 animate-spin" /> : i + 1}
            </span>
            <p className="text-sm font-medium">{s}</p>
          </div>
        );
      })}
    </div>
  );
}

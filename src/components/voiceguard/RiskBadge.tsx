import type { Risk } from "@/data/mock";
import { cn } from "@/lib/utils";

const map: Record<Risk, { label: string; cls: string }> = {
  safe: { label: "Safe", cls: "bg-safe/10 text-safe ring-1 ring-safe/30" },
  suspicious: { label: "Suspicious", cls: "bg-warning/15 text-warning-foreground ring-1 ring-warning/40" },
  dangerous: { label: "Dangerous", cls: "bg-danger/10 text-danger ring-1 ring-danger/30" },
};

export function RiskBadge({ risk, className }: { risk: Risk; className?: string }) {
  const m = map[risk];
  return (
    <span className={cn("inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold", m.cls, className)}>
      {m.label}
    </span>
  );
}

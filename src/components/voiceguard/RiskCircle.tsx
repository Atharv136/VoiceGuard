import type { Risk } from "@/data/mock";

const tone: Record<Risk, { ring: string; text: string; label: string; bg: string }> = {
  safe: { ring: "stroke-safe", text: "text-safe", label: "Safe", bg: "bg-safe/5" },
  suspicious: { ring: "stroke-warning", text: "text-warning-foreground", label: "Suspicious", bg: "bg-warning/10" },
  dangerous: { ring: "stroke-danger", text: "text-danger", label: "Dangerous", bg: "bg-danger/5" },
};

export function RiskCircle({ risk, score }: { risk: Risk; score: number }) {
  const t = tone[risk];
  const r = 70;
  const c = 2 * Math.PI * r;
  const offset = c - (score / 100) * c;
  return (
    <div className={`flex flex-col items-center justify-center rounded-[20px] ${t.bg} p-8`}>
      <svg width="180" height="180" viewBox="0 0 180 180" className="-rotate-90">
        <circle cx="90" cy="90" r={r} className="stroke-border" strokeWidth="14" fill="none" />
        <circle
          cx="90"
          cy="90"
          r={r}
          className={`${t.ring} transition-[stroke-dashoffset] duration-1000`}
          strokeWidth="14"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
        />
      </svg>
      <p className={`mt-4 font-display text-4xl font-extrabold ${t.text}`} style={{ fontSize: "clamp(2rem, 5vw, 2.75rem)" }}>
        {t.label}
      </p>
      <p className="mt-1 text-sm text-muted-foreground">Combined risk score {score}/100</p>
    </div>
  );
}

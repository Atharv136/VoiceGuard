export function ScoreBar({
  label,
  value,
  helper,
  tone = "primary",
}: {
  label: string;
  value: number;
  helper?: string;
  tone?: "primary" | "danger" | "safe";
}) {
  const color =
    tone === "danger" ? "bg-danger" : tone === "safe" ? "bg-safe" : "bg-primary";
  return (
    <div className="rounded-[12px] border bg-card p-5">
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-sm font-semibold text-foreground">{label}</p>
        <p className="font-display text-2xl font-bold tabular-nums">{value}%</p>
      </div>
      <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-muted">
        <div className={`h-full ${color} transition-[width] duration-700`} style={{ width: `${value}%` }} />
      </div>
      {helper && <p className="mt-2 text-sm text-muted-foreground">{helper}</p>}
    </div>
  );
}

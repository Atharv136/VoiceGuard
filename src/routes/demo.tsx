import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Header } from "@/components/voiceguard/Header";
import { Footer } from "@/components/voiceguard/Footer";
import { Mic, Square, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/demo")({
  head: () => ({
    meta: [
      { title: "Live call analysis demo — VoiceGuard" },
      { name: "description", content: "Demonstration of how live call risk scoring will work in the VoiceGuard mobile app." },
    ],
  }),
  component: LiveDemo,
});

type Chunk = { time: string; risk: number };

function riskTone(r: number) {
  if (r >= 70) return "text-danger";
  if (r >= 40) return "text-warning-foreground";
  return "text-safe";
}

function LiveDemo() {
  const [active, setActive] = useState(false);
  const [chunks, setChunks] = useState<Chunk[]>([]);
  const [meter, setMeter] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!active) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      const r = Math.round(20 + Math.random() * 75);
      setMeter(r);
      setChunks((c) => [{ time: new Date().toLocaleTimeString("en-IN"), risk: r }, ...c]);
    }, 2000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [active]);

  const avg = chunks.length ? Math.round(chunks.reduce((s, c) => s + c.risk, 0) / chunks.length) : 0;

  return (
    <div>
      <Header />
      <div className="bg-warning/15 text-warning-foreground">
        <div className="mx-auto max-w-7xl px-4 py-3 text-sm font-medium md:px-6">
          This is a demonstration feature showing future mobile app capabilities. No real audio is processed.
        </div>
      </div>
      <main className="mx-auto max-w-4xl px-4 py-12 md:px-6">
        <h1 className="font-display text-3xl font-extrabold md:text-5xl">Live call analysis demo</h1>
        <p className="mt-3 text-muted-foreground">When VoiceGuard runs as a mobile app, it scores every 10 seconds of an ongoing call in real time.</p>

        <div className="mt-10 grid gap-6 md:grid-cols-[1fr_320px]">
          <div className="rounded-[20px] border bg-card p-8 text-center">
            <div className="mx-auto grid h-32 w-32 place-items-center rounded-full bg-primary/10">
              <span className={`grid h-24 w-24 place-items-center rounded-full ${active ? "bg-danger text-danger-foreground" : "bg-primary text-primary-foreground"} transition`}>
                {active ? <span className="h-3 w-3 animate-ping rounded-full bg-current" /> : <Mic className="h-8 w-8" />}
              </span>
            </div>
            <p className="mt-5 font-display text-lg font-semibold">{active ? "Listening to call…" : "Not recording"}</p>
            <button
              onClick={() => setActive((v) => !v)}
              className={`tap-target mt-5 inline-flex items-center gap-2 rounded-md px-6 text-base font-semibold ${
                active ? "bg-danger text-danger-foreground hover:bg-danger/90" : "bg-primary text-primary-foreground hover:bg-primary/90"
              }`}
            >
              {active ? <><Square className="h-4 w-4" /> Stop</> : <><Mic className="h-4 w-4" /> Start listening</>}
            </button>

            <div className="mt-8">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Live risk meter</p>
              <div className="mt-3 h-4 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className={`h-full transition-all duration-700 ${meter >= 70 ? "bg-danger" : meter >= 40 ? "bg-warning" : "bg-safe"}`}
                  style={{ width: `${meter}%` }}
                />
              </div>
              <p className={`mt-2 font-display text-3xl font-bold ${riskTone(meter)}`}>{meter}/100</p>
            </div>
          </div>

          <div className="rounded-[16px] border bg-card p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Per-chunk log</p>
            <ul className="mt-3 max-h-72 space-y-2 overflow-auto text-sm">
              {chunks.length === 0 && <p className="text-muted-foreground">No chunks yet. Press Start listening.</p>}
              {chunks.map((c, i) => (
                <li key={i} className="flex items-center justify-between rounded-md bg-muted px-3 py-2">
                  <span className="font-mono text-xs">{c.time}</span>
                  <span className={`font-display font-bold ${riskTone(c.risk)}`}>{c.risk}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {!active && chunks.length > 0 && (
          <div className={`mt-8 rounded-[14px] border-2 p-5 ${avg >= 70 ? "border-danger bg-danger/5" : avg >= 40 ? "border-warning bg-warning/10" : "border-safe bg-safe/5"}`}>
            <p className="flex items-center gap-2 font-display text-xl font-bold">
              {avg >= 40 && <AlertTriangle className="h-5 w-5 text-danger" />}
              Session summary — average risk {avg}/100
            </p>
            <p className="mt-1 text-sm text-muted-foreground">{chunks.length} chunks analyzed in this session.</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

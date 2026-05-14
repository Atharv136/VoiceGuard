import { createFileRoute, Link } from "@tanstack/react-router";
import { Upload, ShieldCheck, AlertTriangle, Loader2 } from "lucide-react";
import { useAuth } from "@/store/auth";
import { RiskBadge } from "@/components/voiceguard/RiskBadge";
import { HelplineWidget } from "@/components/voiceguard/HelplineWidget";
import { useEffect, useState } from "react";
import { historyService, type AnalysisRecord } from "@/services/historyService";
import { statisticsService, type StatisticsData } from "@/services/statisticsService";

export const Route = createFileRoute("/_app/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — VoiceGuard" }] }),
  component: Dashboard,
});

function Dashboard() {
  const { user } = useAuth();
  const [history, setHistory] = useState<AnalysisRecord[]>([]);
  const [stats, setStats] = useState<StatisticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [h, s] = await Promise.all([
          historyService.getLatest(),
          statisticsService.get()
        ]);
        setHistory(h.slice(0, 5));
        setStats(s);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const hasContact = !!user?.emergencyContact;

  return (
    <>
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-3xl font-extrabold">Hello {user?.name?.split(" ")[0] ?? "there"}</h1>
          <p className="mt-1 text-muted-foreground">Upload a suspicious call recording and get a risk report in seconds.</p>
        </div>
        <Link
          to="/analyze"
          className="block rounded-[16px] border-2 border-dashed border-primary/40 bg-card p-10 text-center transition hover:bg-accent/30"
        >
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-primary/10 text-primary">
            <Upload className="h-7 w-7" />
          </div>
          <p className="mt-4 font-display text-xl font-bold">Upload a suspicious call recording</p>
          <p className="mt-1 text-sm text-muted-foreground">Supported formats: MP3, WAV, M4A, OGG · Max 25 MB</p>
        </Link>

        <section>
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-bold">Recent analyses</h2>
            <Link to="/history" className="text-sm font-semibold text-primary hover:underline">View all</Link>
          </div>
          <div className="mt-3 overflow-hidden rounded-[14px] border bg-card">
            {loading ? (
              <div className="flex h-32 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-muted/60 text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Risk</th>
                    <th className="px-4 py-3">Keywords</th>
                    <th className="px-4 py-3">Transcript preview</th>
                  </tr>
                </thead>
                <tbody>
                  {history.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-4 py-10 text-center text-muted-foreground">No analyses yet. Your recent reports will appear here.</td>
                    </tr>
                  )}
                  {history.map((r) => (
                    <tr key={r.id} className="border-t hover:bg-muted/30">
                      <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                        {new Date(r.created_at).toLocaleDateString("en-IN")}
                      </td>
                      <td className="px-4 py-3"><RiskBadge risk={r.risk_level} /></td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {r.detected_keywords.slice(0, 2).map((k) => (
                            <span key={k} className="rounded-full bg-danger/10 px-2 py-0.5 text-xs font-semibold text-danger">{k}</span>
                          ))}
                          {r.detected_keywords.length === 0 && <span className="text-xs text-muted-foreground">None</span>}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Link to="/result/$id" params={{ id: r.id }} className="line-clamp-1 max-w-[280px] text-foreground hover:underline">
                          {r.transcript || "No transcript available"}
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </div>

      <aside className="space-y-4">
        <div className={`rounded-[14px] border p-5 ${hasContact ? "border-safe/30 bg-safe/5" : "border-warning/40 bg-warning/10"}`}>
          <div className="flex items-center gap-2">
            {hasContact ? <ShieldCheck className="h-5 w-5 text-safe" /> : <AlertTriangle className="h-5 w-5 text-warning-foreground" />}
            <p className="font-display font-bold">Emergency contact</p>
          </div>
          {hasContact ? (
            <>
              <p className="mt-2 text-sm">Set to <span className="font-semibold">{user?.emergencyContact}</span>.</p>
              <p className="mt-1 text-xs text-muted-foreground">We will alert this contact if a dangerous call is detected on your account.</p>
            </>
          ) : (
            <>
              <p className="mt-2 text-sm">No emergency contact set yet.</p>
              <Link to="/settings" className="tap-target mt-3 inline-flex items-center rounded-md bg-warning px-4 text-sm font-semibold text-warning-foreground hover:bg-warning/90">Set now</Link>
            </>
          )}
        </div>

        <div className="rounded-[14px] border bg-card p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Community impact</p>
          <p className="mt-2 font-display text-3xl font-extrabold tabular-nums">
            {(stats?.familiesAlerted || 0).toLocaleString("en-IN")}
          </p>
          <p className="text-xs text-muted-foreground">families alerted this month</p>
        </div>
      </aside>
    </div>
    <HelplineWidget />
    </>
  );
}

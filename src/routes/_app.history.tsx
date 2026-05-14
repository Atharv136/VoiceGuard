import { createFileRoute, Link } from "@tanstack/react-router";
import { RiskBadge } from "@/components/voiceguard/RiskBadge";
import { useEffect, useState } from "react";
import { historyService, type AnalysisRecord } from "@/services/historyService";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/_app/history")({
  head: () => ({ meta: [{ title: "My history — VoiceGuard" }] }),
  component: History,
});

function History() {
  const [history, setHistory] = useState<AnalysisRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    historyService.getLatest().then(setHistory).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="font-display text-3xl font-extrabold">My history</h1>
      <p className="mt-2 text-muted-foreground">Every call you have analyzed, newest first.</p>
      
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      ) : (
        <div className="mt-6 overflow-hidden rounded-[14px] border bg-card shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-muted/60 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Risk Level</th>
                <th className="px-4 py-3">Key Highlights</th>
                <th className="px-4 py-3">Transcript Preview</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {history.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-20 text-center">
                    <p className="text-lg font-bold text-muted-foreground">No analysis history found.</p>
                    <Link to="/analyze" className="mt-2 inline-block text-primary hover:underline">Start your first analysis</Link>
                  </td>
                </tr>
              )}
              {history.map((r) => (
                <tr key={r.id} className="border-t transition-colors hover:bg-muted/20">
                  <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                    {new Date(r.created_at).toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-4 py-3"><RiskBadge risk={r.risk_level} /></td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {r.detected_keywords.slice(0, 3).map(k => (
                        <span key={k} className="rounded-full bg-danger/10 px-2 py-0.5 text-[10px] font-bold text-danger uppercase">{k}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 max-w-[360px]">
                    <p className="line-clamp-1 text-muted-foreground italic">"{r.transcript || 'No transcript available'}"</p>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link to="/result/$id" params={{ id: r.id }} className="rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary hover:bg-primary/20">
                      Open Report
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

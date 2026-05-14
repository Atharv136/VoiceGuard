import { createFileRoute, Link } from "@tanstack/react-router";
import { seededAnalyses } from "@/data/mock";
import { RiskBadge } from "@/components/voiceguard/RiskBadge";

export const Route = createFileRoute("/_app/history")({
  head: () => ({ meta: [{ title: "My history — VoiceGuard" }] }),
  component: History,
});

function History() {
  return (
    <div>
      <h1 className="font-display text-3xl font-extrabold">My history</h1>
      <p className="mt-2 text-muted-foreground">Every call you have analyzed, newest first.</p>
      <div className="mt-6 overflow-hidden rounded-[14px] border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/60 text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr><th className="px-4 py-3">Date</th><th className="px-4 py-3">Caller</th><th className="px-4 py-3">Risk</th><th className="px-4 py-3">Preview</th><th className="px-4 py-3"></th></tr>
          </thead>
          <tbody>
            {seededAnalyses.map((r) => (
              <tr key={r.id} className="border-t">
                <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">{r.date}</td>
                <td className="px-4 py-3 font-mono text-xs">{r.callerNumber}</td>
                <td className="px-4 py-3"><RiskBadge risk={r.risk} /></td>
                <td className="px-4 py-3 max-w-[360px]"><p className="line-clamp-1">{r.preview}</p></td>
                <td className="px-4 py-3"><Link to="/result/$id" params={{ id: r.id }} className="text-sm font-semibold text-primary hover:underline">Open</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

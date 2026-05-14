import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { helplines } from "@/data/mock";
import { RiskCircle } from "@/components/voiceguard/RiskCircle";
import { ScoreBar } from "@/components/voiceguard/ScoreBar";
import { AlertTriangle, Share2, ThumbsUp, ThumbsDown, Phone, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { historyService, type AnalysisRecord } from "@/services/historyService";

export const Route = createFileRoute("/_app/result/$id")({
  head: () => ({ meta: [{ title: "Analysis result — VoiceGuard" }] }),
  component: Result,
});

function highlight(text: string, keywords: string[]) {
  if (!text || !keywords.length) return text || "No transcript available.";
  const re = new RegExp(`(${keywords.map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "gi");
  return text.split(re).map((p, i) =>
    keywords.some((k) => k.toLowerCase() === p.toLowerCase()) ? <span key={i} className="scam-phrase">{p}</span> : <span key={i}>{p}</span>
  );
}

function Result() {
  const { id } = Route.useParams();
  const [record, setRecord] = useState<AnalysisRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [wrong, setWrong] = useState(false);

  useEffect(() => {
    historyService.getOne(id)
      .then(setRecord)
      .catch(() => toast.error("Report not found"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!record) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-2xl font-bold">Report not found</h2>
        <Link to="/dashboard" className="text-primary hover:underline">Back to Dashboard</Link>
      </div>
    );
  }

  const risk = record.risk_level.toLowerCase() as "safe" | "suspicious" | "dangerous";
  const combinedScore = Math.max(record.aurigin_score, record.keyword_score);

  const plain =
    risk === "dangerous"
      ? "This call uses many tricks scammers use. Whoever called you is most likely trying to steal money or personal information. Do not call them back. Tell a family member."
      : risk === "suspicious"
        ? "This call has some warning signs. Be careful. Do not share OTPs, PINs or money. If they say they are from a bank or government office, hang up and call the official number yourself."
        : "This call looks normal. We did not find scam language or signs of a fake voice. Stay alert and trust your gut.";
  const hindi =
    risk === "dangerous"
      ? "यह कॉल बहुत खतरनाक लग रही है। पैसे या OTP कभी मत दें। तुरंत 1930 पर शिकायत करें और परिवार को बताएं।"
      : risk === "suspicious"
        ? "यह कॉल संदिग्ध है। OTP, PIN या पैसे साझा न करें। आधिकारिक नंबर से बैंक से दोबारा संपर्क करें।"
        : "यह कॉल सामान्य लगती है। फिर भी सतर्क रहें।";

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <RiskCircle risk={risk} score={combinedScore} />
        <div className="grid gap-4 sm:grid-cols-2">
          <ScoreBar 
            label="Voice authenticity (Aurigin)" 
            value={record.aurigin_score} 
            helper="How likely the voice is synthetic/AI-cloned (Higher = Higher Risk)." 
            tone={record.aurigin_score >= 70 ? "danger" : record.aurigin_score >= 40 ? "primary" : "safe"} 
          />
          <ScoreBar 
            label="Scam language score" 
            value={record.keyword_score} 
            helper="Detected known scam phrases in the conversation." 
            tone={record.keyword_score >= 60 ? "danger" : record.keyword_score >= 30 ? "primary" : "safe"} 
          />
        </div>
      </div>

      {risk === "dangerous" && (
        <div className="flex items-start gap-3 rounded-[12px] border border-danger/30 bg-danger/10 p-4 text-danger animate-in fade-in slide-in-from-top-2">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
          <p className="text-sm font-semibold">Emergency alert has been sent to your family contact.</p>
        </div>
      )}

      <section className="rounded-[14px] border bg-card p-5 shadow-sm">
        <h2 className="font-display text-lg font-bold">Full transcript</h2>
        
        {record.aurigin_segments && record.aurigin_segments.length > 0 && (
          <div className="mt-4 mb-4 rounded-md border border-primary/20 bg-primary/5 p-4 text-sm font-mono text-muted-foreground">
            <div className="font-semibold text-primary mb-2 border-b border-primary/10 pb-2">
              [Aurigin AI analysis — {record.aurigin_verdict || "unknown"}]
            </div>
            {record.aurigin_segments.map((seg, i) => (
              <div key={i} className="mb-1">
                <span className="text-foreground/70">[{seg.start.toFixed(1)}s - {seg.end.toFixed(1)}s]</span>{" "}
                <span className={seg.result === "spoofed" ? "text-danger font-semibold" : seg.result === "partially_spoofed" ? "text-warning font-semibold" : "text-safe font-semibold"}>
                  {seg.result}
                </span>{" "}
                (confidence: {seg.confidence}%)
              </div>
            ))}
          </div>
        )}

        <div className="mt-3 text-base leading-relaxed text-foreground/90 whitespace-pre-wrap">
          {highlight(record.transcript, record.detected_keywords)}
        </div>
      </section>

      <section className="rounded-[14px] border border-warning/40 bg-warning/10 p-5">
        <h2 className="font-display text-lg font-bold">What this means</h2>
        <p className="mt-2 text-base">{plain}</p>
        <p className="mt-3 text-sm font-bold text-warning-foreground">{hindi}</p>
      </section>

      <div className="flex flex-wrap items-center gap-3">
        <button onClick={() => toast.success("Thanks for your feedback")} className="tap-target inline-flex items-center gap-2 rounded-md border-2 border-safe px-4 text-sm font-semibold text-safe hover:bg-safe/5 transition-colors">
          <ThumbsUp className="h-4 w-4" /> This was helpful
        </button>
        <button onClick={() => setWrong((v) => !v)} className="tap-target inline-flex items-center gap-2 rounded-md border px-4 text-sm font-semibold text-muted-foreground hover:bg-muted transition-colors">
          <ThumbsDown className="h-4 w-4" /> This seems wrong
        </button>
        <button
          onClick={() => { navigator.clipboard?.writeText(window.location.href); toast.success("Report link copied"); }}
          className="tap-target inline-flex items-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-primary/90 shadow-md transition-all"
        >
          <Share2 className="h-4 w-4" /> Share report
        </button>
      </div>
      
      {wrong && (
        <div className="rounded-[14px] border bg-card p-4 animate-in slide-in-from-top-4">
          <textarea
            placeholder="Tell us briefly what looked wrong (optional)"
            className="w-full rounded-md border bg-background p-3 text-sm focus:ring-2 focus:ring-primary/20"
            rows={3}
            onBlur={() => toast.success("Feedback received")}
          />
        </div>
      )}

      <div className="sticky bottom-0 -mx-4 mt-8 grid gap-2 border-t bg-card p-4 sm:grid-cols-3 md:-mx-8 md:px-8 shadow-[0_-4px_10px_-5px_rgba(0,0,0,0.1)]">
        {helplines.map((h) => (
          <a key={h.number} href={`tel:${h.number}`} className="tap-target flex items-center justify-between rounded-md bg-danger/10 px-4 py-3 text-danger hover:bg-danger/15 transition-colors">
            <span className="font-semibold">{h.label}</span>
            <span className="font-display text-lg font-bold flex items-center gap-1"><Phone className="h-4 w-4" />{h.number}</span>
          </a>
        ))}
      </div>

      <Link to="/dashboard" className="text-sm text-muted-foreground hover:underline">← Back to dashboard</Link>
    </div>
  );
}

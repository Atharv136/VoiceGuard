import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { seededAnalyses, helplines } from "@/data/mock";
import { RiskCircle } from "@/components/voiceguard/RiskCircle";
import { ScoreBar } from "@/components/voiceguard/ScoreBar";
import { AlertTriangle, Share2, ThumbsUp, ThumbsDown, Phone } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/result/$id")({
  head: () => ({ meta: [{ title: "Analysis result — VoiceGuard" }] }),
  component: Result,
});

function highlight(text: string, keywords: string[]) {
  if (!keywords.length) return text;
  const re = new RegExp(`(${keywords.map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "gi");
  return text.split(re).map((p, i) =>
    keywords.some((k) => k.toLowerCase() === p.toLowerCase()) ? <span key={i} className="scam-phrase">{p}</span> : <span key={i}>{p}</span>
  );
}

function Result() {
  const { id } = Route.useParams();
  const r = seededAnalyses.find((x) => x.id === id) ?? seededAnalyses[0];
  const [wrong, setWrong] = useState(false);

  const plain =
    r.risk === "dangerous"
      ? "This call uses many tricks scammers use. Whoever called you is most likely trying to steal money or personal information. Do not call them back. Tell a family member."
      : r.risk === "suspicious"
        ? "This call has some warning signs. Be careful. Do not share OTPs, PINs or money. If they say they are from a bank or government office, hang up and call the official number yourself."
        : "This call looks normal. We did not find scam language or signs of a fake voice. Stay alert and trust your gut.";
  const hindi =
    r.risk === "dangerous"
      ? "यह कॉल बहुत खतरनाक लग रही है। पैसे या OTP कभी मत दें। तुरंत 1930 पर शिकायत करें और परिवार को बताएं।"
      : r.risk === "suspicious"
        ? "यह कॉल संदिग्ध है। OTP, PIN या पैसे साझा न करें। आधिकारिक नंबर से बैंक से दोबारा संपर्क करें।"
        : "यह कॉल सामान्य लगती है। फिर भी सतर्क रहें।";

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <RiskCircle risk={r.risk} score={r.combinedScore} />
        <div className="grid gap-4 sm:grid-cols-2">
          <ScoreBar label="Voice authenticity (Aurigin)" value={r.voiceScore} helper="How human-like the voice sounds." tone={r.voiceScore < 40 ? "danger" : r.voiceScore < 70 ? "primary" : "safe"} />
          <ScoreBar label="Scam language score" value={r.languageScore} helper="How clean the conversation is." tone={r.languageScore < 40 ? "danger" : r.languageScore < 70 ? "primary" : "safe"} />
        </div>
      </div>

      {r.risk === "dangerous" && (
        <div className="flex items-start gap-3 rounded-[12px] border border-danger/30 bg-danger/10 p-4 text-danger">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
          <p className="text-sm font-semibold">Emergency alert has been sent to your family contact.</p>
        </div>
      )}

      <section className="rounded-[14px] border bg-card p-5">
        <h2 className="font-display text-lg font-bold">Full transcript</h2>
        <p className="mt-3 text-base leading-relaxed">{highlight(r.transcript, r.keywords)}</p>
      </section>

      <section className="rounded-[14px] border bg-muted/40 p-5">
        <h2 className="font-display text-lg font-bold">How we calculated this</h2>
        <ul className="mt-3 space-y-2 text-sm">
          <li><span className="font-semibold">Voice analysis:</span> we listened for the small unnatural patterns that AI cloned voices leave behind.</li>
          <li><span className="font-semibold">Language analysis:</span> we matched the words to a library of phrases that real scams use in India.</li>
          <li><span className="font-semibold">Combined risk:</span> we mixed the two scores together. If either one is very low, we flag the call.</li>
        </ul>
      </section>

      <section className="rounded-[14px] border border-warning/40 bg-warning/10 p-5">
        <h2 className="font-display text-lg font-bold">What this means</h2>
        <p className="mt-2 text-base">{plain}</p>
        <p className="mt-3 text-sm text-muted-foreground">{hindi}</p>
      </section>

      <div className="flex flex-wrap items-center gap-3">
        <button onClick={() => toast.success("Thanks for your feedback")} className="tap-target inline-flex items-center gap-2 rounded-md border-2 border-safe px-4 text-sm font-semibold text-safe hover:bg-safe/5">
          <ThumbsUp className="h-4 w-4" /> This was helpful
        </button>
        <button onClick={() => setWrong((v) => !v)} className="tap-target inline-flex items-center gap-2 rounded-md border px-4 text-sm font-semibold text-muted-foreground hover:bg-muted">
          <ThumbsDown className="h-4 w-4" /> This seems wrong
        </button>
        <button
          onClick={() => { navigator.clipboard?.writeText(window.location.href); toast.success("Report link copied"); }}
          className="tap-target inline-flex items-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
        >
          <Share2 className="h-4 w-4" /> Share report
        </button>
      </div>
      {wrong && (
        <textarea
          placeholder="Tell us briefly what looked wrong (optional)"
          className="w-full rounded-md border bg-background p-3 text-sm"
          rows={3}
          onBlur={() => toast.success("Feedback received")}
        />
      )}

      <div className="sticky bottom-0 -mx-4 mt-8 grid gap-2 border-t bg-card p-4 sm:grid-cols-3 md:-mx-8 md:px-8">
        {helplines.map((h) => (
          <a key={h.number} href={`tel:${h.number}`} className="tap-target flex items-center justify-between rounded-md bg-danger/10 px-4 py-3 text-danger hover:bg-danger/15">
            <span className="font-semibold">{h.label}</span>
            <span className="font-display text-lg font-bold flex items-center gap-1"><Phone className="h-4 w-4" />{h.number}</span>
          </a>
        ))}
      </div>

      <Link to="/dashboard" className="text-sm text-muted-foreground hover:underline">← Back to dashboard</Link>
    </div>
  );
}

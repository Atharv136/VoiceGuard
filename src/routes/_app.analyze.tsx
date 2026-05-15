import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Upload, FileAudio, X, AlertTriangle, CheckCircle, AlertOctagon, ChevronDown } from "lucide-react";
import { AnalysisProgress } from "@/components/voiceguard/AnalysisProgress";
import { toast } from "sonner";
import { analyzeService, type AnalysisResponse } from "@/services/analyzeService";
import { ScoreBar } from "@/components/voiceguard/ScoreBar";

export const Route = createFileRoute("/_app/analyze")({
  head: () => ({ meta: [{ title: "Analyze a call — VoiceGuard" }] }),
  component: Analyze,
});

function highlight(text: string, keywords: string[]) {
  if (!text || !keywords.length) return text || "No transcript available.";
  const re = new RegExp(`(${keywords.map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "gi");
  return text.split(re).map((p, i) =>
    keywords.some((k) => k.toLowerCase() === p.toLowerCase()) ? <span key={i} className="scam-phrase">{p}</span> : <span key={i}>{p}</span>
  );
}

function Analyze() {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<AnalysisResponse | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function pick() { inputRef.current?.click(); }
  function onFile(f: File | null) {
    if (!f) return;
    const allowed = ["audio/mpeg", "audio/wav", "audio/mp4", "audio/ogg", "audio/x-m4a"];
    if (!allowed.includes(f.type) && !f.name.endsWith(".m4a")) {
      toast.error("Invalid file type. Supported: MP3, WAV, M4A, OGG");
      return;
    }
    if (f.size > 5 * 1024 * 1024) {
      toast.error("File is larger than 5 MB (Aurigin API limit)");
      return;
    }
    setFile(f);
    setResult(null);
  }

  async function start() {
    if (!file) { toast.error("Pick a file first"); return; }
    setRunning(true);
    setResult(null);

    try {
      const res = await analyzeService.analyze(file);
      await new Promise((r) => setTimeout(r, 2800));
      setResult(res);
    } catch (err: any) {
      toast.error("Analysis failed", {
        description: err.message || "Make sure your backend is running on port 3001."
      });
    } finally {
      setRunning(false);
    }
  }

  function resetForm() {
    setFile(null);
    setResult(null);
  }

  const riskColor = (level: string) =>
    level === "Safe" ? "text-safe border-safe/30 bg-safe/10" :
      level === "Suspicious" ? "text-warning-foreground border-warning/30 bg-warning/10" :
        "text-danger border-danger/30 bg-danger/10";

  const riskIcon = (level: string) =>
    level === "Safe" ? <CheckCircle className="h-6 w-6" /> :
      level === "Suspicious" ? <AlertTriangle className="h-6 w-6" /> :
        <AlertOctagon className="h-6 w-6" />;

  const riskLabel = (level: string) =>
    level === "Safe" ? "SAFE — No scam indicators found" :
      level === "Suspicious" ? "SUSPICIOUS — Some warning signs detected" :
        "HIGH RISK — This call is likely a scam";

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="font-display text-3xl font-extrabold">Analyze a call</h1>
      <p className="mt-2 text-muted-foreground">Upload a recording from your phone or computer. Your audio is processed in memory and discarded after the report is generated.</p>

      {!running && !result && (
        <>
          <div
            onClick={pick}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.preventDefault(); onFile(e.dataTransfer.files?.[0] ?? null); }}
            className="mt-6 cursor-pointer rounded-[16px] border-2 border-dashed border-primary/40 bg-card p-12 text-center transition hover:bg-accent/30"
          >
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-primary/10 text-primary">
              <Upload className="h-7 w-7" />
            </div>
            <p className="mt-4 font-display text-xl font-bold">Drop your recording here or click to browse</p>
            <p className="mt-1 text-sm text-muted-foreground">MP3, WAV, M4A, OGG · up to 5 MB</p>
            <input ref={inputRef} type="file" accept="audio/*" className="hidden" onChange={(e) => onFile(e.target.files?.[0] ?? null)} />
          </div>

          {file && (
            <div className="mt-4 flex items-center justify-between rounded-[12px] border bg-card p-4">
              <div className="flex items-center gap-3">
                <FileAudio className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-semibold">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
              <button onClick={() => setFile(null)} className="tap-target grid h-10 w-10 place-items-center rounded-md hover:bg-muted" aria-label="Remove">
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          <button
            onClick={start}
            disabled={!file}
            className="tap-target mt-6 w-full rounded-md bg-primary px-6 text-base font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            Start analysis
          </button>
        </>
      )}

      {running && (
        <div className="mt-8">
          <AnalysisProgress onDone={() => { }} />
          <p className="mt-6 text-center text-sm font-medium animate-pulse">Running AI deepfake detection & transcription...</p>
        </div>
      )}

      {result && !running && (
        <div className="mt-8 space-y-6">
          {/* Risk header */}
          <div className={`flex items-start gap-4 rounded-[16px] border p-5 ${riskColor(result.riskLevel)}`}>
            {riskIcon(result.riskLevel)}
            <div>
              <p className="font-display text-xl font-bold">{riskLabel(result.riskLevel)}</p>
              <p className="mt-1 text-sm opacity-80">Aurigin voice authenticity + scam language analysis complete.</p>
            </div>
          </div>

          {/* Score bars */}
          <div className="grid gap-4 sm:grid-cols-2">
            <ScoreBar
              label="Voice authenticity (Aurigin)"
              value={result.auriginScore}
              helper="How likely the voice is genuine/human (Higher = Lower Risk)"
              tone={result.auriginScore <= 50 ? "safe" : result.auriginScore <= 80 ? "primary" : "danger"}
            />
            <ScoreBar
              label="Scam language score"
              value={result.keywordScore}
              helper="Detected known scam phrases in the conversation."
              tone={result.keywordScore >= 60 ? "danger" : result.keywordScore >= 30 ? "primary" : "safe"}
            />
          </div>

          {/* Full Aurigin Prediction */}
          <section className="rounded-[14px] border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-bold">Aurigin AI Deepfake Detection</h2>
              <span className={`rounded-full px-3 py-1 text-xs font-bold ${result.auriginVerdict === "bonafide" ? "bg-safe/20 text-safe" :
                result.auriginVerdict === "spoofed" ? "bg-danger/20 text-danger" :
                  "bg-warning/20 text-warning-foreground"
                }`}>
                {result.auriginVerdict === "bonafide" ? "BONAFIDE" :
                  result.auriginVerdict === "spoofed" ? "SPOOFED" :
                    "PARTIALLY SPOOFED"}
              </span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-lg bg-muted/50 p-3">
                <span className="text-muted-foreground">Confidence</span>
                <p className="mt-0.5 font-bold">{result.auriginConfidence}%</p>
              </div>
              <div className="rounded-lg bg-muted/50 p-3">
                <span className="text-muted-foreground">Model</span>
                <p className="mt-0.5 font-mono text-xs font-bold">{result.auriginModel || "N/A"}</p>
              </div>
              <div className="rounded-lg bg-muted/50 p-3">
                <span className="text-muted-foreground">Audio Duration</span>
                <p className="mt-0.5 font-bold">{result.audioDuration.toFixed(2)}s</p>
              </div>
              <div className="rounded-lg bg-muted/50 p-3">
                <span className="text-muted-foreground">Processing Time</span>
                <p className="mt-0.5 font-bold">{result.processingTime.toFixed(2)}s</p>
              </div>
            </div>

            {result.auriginSegments.length > 0 && (
              <div className="mt-4">
                <h3 className="mb-2 text-sm font-semibold text-muted-foreground">Segment Analysis (per 5s chunk)</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b text-muted-foreground">
                        <th className="pb-2 pr-3">#</th>
                        <th className="pb-2 pr-3">Time</th>
                        <th className="pb-2 pr-3">Result</th>
                        <th className="pb-2 text-right">Confidence</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.auriginSegments.map((seg, i) => (
                        <tr key={i} className="border-b border-muted/30">
                          <td className="py-2 pr-3 font-mono text-xs">{i}</td>
                          <td className="py-2 pr-3 font-mono text-xs">{seg.start.toFixed(1)}s – {seg.end.toFixed(1)}s</td>
                          <td className="py-2 pr-3">
                            <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${seg.result === "bonafide" ? "bg-safe/15 text-safe" : "bg-danger/15 text-danger"
                              }`}>
                              {seg.result}
                            </span>
                          </td>
                          <td className="py-2 text-right font-mono text-xs">{seg.confidence}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {result.auriginWarnings.length > 0 && (
              <div className="mt-3 rounded-lg bg-warning/10 p-3 text-xs text-warning-foreground">
                {result.auriginWarnings.join("; ")}
              </div>
            )}

            <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
              <span>Prediction ID:</span>
              <code className="rounded bg-muted px-1.5 py-0.5 font-mono">{result.auriginPredictionId || "N/A"}</code>
            </div>
          </section>

          {/* Keywords */}
          {result.detectedKeywords.length > 0 && (
            <section className="rounded-[14px] border bg-card p-5 shadow-sm">
              <h2 className="font-display text-lg font-bold">Detected scam keywords</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {result.detectedKeywords.map((k) => (
                  <span key={k} className="rounded-full bg-danger/10 px-3 py-1 text-sm font-semibold text-danger">{k}</span>
                ))}
              </div>
            </section>
          )}

          {/* Transcript */}
          {result.transcript && (
            <section className="rounded-[14px] border bg-card p-5 shadow-sm">
              <h2 className="font-display text-lg font-bold">Transcript</h2>
              <div className="mt-3 text-base leading-relaxed text-foreground/90 whitespace-pre-wrap">
                {highlight(result.transcript, result.detectedKeywords)}
              </div>
            </section>
          )}

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => navigate({ to: "/result/$id", params: { id: result.sharedReportSlug } })}
              className="tap-target inline-flex items-center gap-2 rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 shadow-md"
            >
              View full report <ChevronDown className="h-4 w-4" />
            </button>
            <button
              onClick={resetForm}
              className="tap-target inline-flex items-center gap-2 rounded-md border px-5 text-sm font-semibold hover:bg-muted"
            >
              Analyze another call
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

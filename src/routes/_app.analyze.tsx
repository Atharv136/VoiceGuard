import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Upload, FileAudio, X } from "lucide-react";
import { AnalysisProgress } from "@/components/voiceguard/AnalysisProgress";
import { toast } from "sonner";
import { analyzeService } from "@/services/analyzeService";

export const Route = createFileRoute("/_app/analyze")({
  head: () => ({ meta: [{ title: "Analyze a call — VoiceGuard" }] }),
  component: Analyze,
});

function Analyze() {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [running, setRunning] = useState(false);
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
  }

  async function start() {
    if (!file) { toast.error("Pick a file first"); return; }
    setRunning(true);
    
    try {
      // Real API call to the backend
      const result = await analyzeService.analyze(file);
      // Wait for the animation to look good
      setTimeout(() => {
        navigate({ to: "/result/$id" as any, params: { id: result.sharedReportSlug } });
      }, 2000);
    } catch (err) {
      setRunning(false);
      toast.error("Analysis failed", {
        description: "Make sure your backend is running on port 3001."
      });
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="font-display text-3xl font-extrabold">Analyze a call</h1>
      <p className="mt-2 text-muted-foreground">Upload a recording from your phone or computer. Your audio is processed in memory and discarded after the report is generated.</p>

      {!running && (
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
          <AnalysisProgress onDone={() => {}} />
          <p className="mt-6 text-center text-sm font-medium animate-pulse">Running AI deepfake detection & transcription...</p>
        </div>
      )}
    </div>
  );
}

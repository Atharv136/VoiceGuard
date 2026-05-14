import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Header } from "@/components/voiceguard/Header";
import { Footer } from "@/components/voiceguard/Footer";
import { Mic, Square, AlertTriangle, ShieldCheck, Zap } from "lucide-react";
import { analyzeService, type ChunkResponse } from "@/services/analyzeService";
import { toast } from "sonner";

export const Route = createFileRoute("/live")({
  head: () => ({
    meta: [
      { title: "Live Call Analysis — VoiceGuard" },
      { name: "description", content: "Real-time AI analysis of ongoing calls for scam detection." },
    ],
  }),
  component: LiveAnalysisPage,
});

type Chunk = { time: string; risk: number; words: string[] };

function riskTone(r: number) {
  if (r >= 70) return "text-danger";
  if (r >= 40) return "text-warning-foreground";
  return "text-safe";
}

function LiveAnalysisPage() {
  const [active, setActive] = useState(false);
  const [chunks, setChunks] = useState<Chunk[]>([]);
  const [meter, setMeter] = useState(0);
  const [isCapturing, setIsCapturing] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.start();
      setActive(true);
      setIsCapturing(true);

      // Start 10-second chunking cycle
      let chunkCount = 0;
      intervalRef.current = setInterval(async () => {
        if (recorder.state === "recording") {
          recorder.stop(); // Trigger dataavailable
          
          // Wait a tiny bit for the blob to be ready
          setTimeout(async () => {
            const blob = new Blob(audioChunksRef.current, { type: "audio/wav" });
            audioChunksRef.current = [];
            recorder.start(); // Restart for next chunk

            try {
              const res = await analyzeService.analyzeChunk(blob, chunkCount);
              const aurigin = res.auriginScore || 0;
              const keyword = res.keywordScore || 0;
              const combined = Math.max(aurigin, keyword); // simple max for live view
              
              setMeter(combined);
              setChunks(prev => [{
                time: new Date().toLocaleTimeString("en-IN"),
                risk: combined,
                words: res.detectedKeywords || []
              }, ...prev]);
              
              if (combined >= 70) {
                toast.error("HIGH RISK SCAM DETECTED", {
                  description: "VoiceGuard detected dangerous language patterns.",
                  duration: 5000
                });
              }
              chunkCount++;
            } catch (err) {
              console.error("Analysis error:", err);
            }
          }, 100);
        }
      }, 10000); // 10 seconds

    } catch (err) {
      toast.error("Microphone access denied", {
        description: "Please allow microphone access to use Live Analysis."
      });
    }
  };

  const stopRecording = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(t => t.stop());
    }
    setActive(false);
    setIsCapturing(false);
    setMeter(0);
  };

  const avg = chunks.length ? Math.round(chunks.reduce((s, c) => s + c.risk, 0) / chunks.length) : 0;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="bg-primary/5 border-b border-primary/10">
        <div className="mx-auto max-w-7xl px-4 py-3 text-sm font-semibold text-primary md:px-6 flex items-center gap-2">
          <Zap className="h-4 w-4 fill-primary" />
          Live Call Analysis is active — analyzing every 10 seconds of audio via your microphone.
        </div>
      </div>

      <main className="mx-auto max-w-5xl px-4 py-12 md:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <h1 className="font-display text-4xl font-extrabold md:text-6xl tracking-tight">Real-time Call Guard</h1>
            <p className="mt-4 text-lg text-muted-foreground">Keep this page open during suspicious calls. VoiceGuard will listen through your speaker/mic and alert you instantly if it detects a scam.</p>
          </div>
          <div className="flex items-center gap-3 rounded-2xl bg-card border p-4 shadow-sm">
             <div className={`h-3 w-3 rounded-full ${active ? "bg-danger animate-pulse" : "bg-muted"}`} />
             <span className="text-sm font-bold uppercase tracking-wider">{active ? "System Monitoring" : "System Standby"}</span>
          </div>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_380px]">
          <div className="relative overflow-hidden rounded-[32px] border bg-card p-10 text-center shadow-sm">
            <div className="absolute top-0 left-0 h-1 w-full bg-muted overflow-hidden">
               {active && <div className="h-full bg-primary animate-progress-fast" style={{ width: '100%' }} />}
            </div>
            
            <div className="mx-auto relative">
              <div className={`mx-auto grid h-40 w-40 place-items-center rounded-full transition-all duration-500 ${active ? "bg-danger/10 scale-110" : "bg-primary/5"}`}>
                <div className={`grid h-32 w-32 place-items-center rounded-full shadow-2xl transition-all ${active ? "bg-danger text-white rotate-12" : "bg-primary text-white"}`}>
                  {active ? <Square className="h-10 w-10 fill-current" /> : <Mic className="h-10 w-10" />}
                </div>
              </div>
              {active && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 h-40 w-40 rounded-full border-4 border-danger/30 animate-ping" />
              )}
            </div>

            <h3 className="mt-8 font-display text-2xl font-bold">{active ? "Listening for scam patterns..." : "Ready to protect"}</h3>
            <p className="mt-2 text-muted-foreground">Place your phone near the laptop speaker for best results.</p>
            
            <button
              onClick={active ? stopRecording : startRecording}
              className={`tap-target mt-8 inline-flex items-center gap-3 rounded-full px-10 py-4 text-lg font-bold shadow-xl transition-all hover:scale-105 active:scale-95 ${
                active ? "bg-card border-2 border-danger text-danger hover:bg-danger/5" : "bg-primary text-white hover:bg-primary/90"
              }`}
            >
              {active ? "Stop Protection" : "Start Live Guard"}
            </button>

            <div className="mt-12 border-t pt-8">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Live Risk Probability</p>
                <span className={`font-display text-2xl font-black ${riskTone(meter)}`}>{meter}%</span>
              </div>
              <div className="mt-4 h-6 w-full overflow-hidden rounded-full bg-muted p-1">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${meter >= 70 ? "bg-danger" : meter >= 40 ? "bg-warning" : "bg-safe"}`}
                  style={{ width: `${meter}%` }}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="rounded-[24px] border bg-card p-6 shadow-sm">
              <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted-foreground">
                <ShieldCheck className="h-4 w-4" /> Live Analysis Log
              </h4>
              <div className="mt-4 space-y-3 max-h-[400px] overflow-auto pr-2 custom-scrollbar">
                {chunks.length === 0 && (
                  <div className="py-10 text-center border-2 border-dashed rounded-2xl">
                    <p className="text-sm text-muted-foreground">No data yet. Start recording to see live analysis.</p>
                  </div>
                )}
                {chunks.map((c, i) => (
                  <div key={i} className="rounded-xl border bg-muted/30 p-4 transition-all hover:bg-muted/50">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-muted-foreground">{c.time}</span>
                      <span className={`rounded-full px-2 py-0.5 text-xs font-black ${riskTone(c.risk)} bg-white border`}>
                        {c.risk}% Risk
                      </span>
                    </div>
                    {c.words.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {c.words.map(w => (
                          <span key={w} className="rounded-md bg-danger/10 px-1.5 py-0.5 text-[10px] font-bold text-danger uppercase">{w}</span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {!active && chunks.length > 0 && (
              <div className={`rounded-[24px] border-2 p-6 shadow-lg animate-in fade-in slide-in-from-bottom-4 ${
                avg >= 70 ? "border-danger bg-danger/5" : avg >= 40 ? "border-warning bg-warning/5" : "border-safe bg-safe/5"
              }`}>
                <h4 className="font-display text-xl font-bold flex items-center gap-2">
                  <AlertTriangle className={avg >= 40 ? "text-danger" : "text-safe"} />
                  Session Verdict
                </h4>
                <div className="mt-3">
                  <p className="text-3xl font-black tabular-nums">{avg}% Average Risk</p>
                  <p className="mt-1 text-sm text-muted-foreground">Based on {chunks.length} analyzed segments.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 10px; }
        @keyframes progress-fast {
          from { transform: translateX(-100%); }
          to { transform: translateX(100%); }
        }
        .animate-progress-fast {
          animation: progress-fast 2s linear infinite;
        }
      `}</style>
    </div>
  );
}

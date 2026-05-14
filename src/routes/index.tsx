import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Upload, Brain, FileText, Play, Lock, HeartHandshake, MapPin,
  ShieldCheck, AlertTriangle, ArrowRight, Phone,
} from "lucide-react";
import { Header } from "@/components/voiceguard/Header";
import { Footer } from "@/components/voiceguard/Footer";
import { stats } from "@/data/mock";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "VoiceGuard — Detect AI scam calls before it's too late" },
      { name: "description", content: "VoiceGuard analyzes suspicious calls for fake voices and scam language. Free, private, built for Indian families." },
    ],
  }),
  component: Landing,
});

const fmt = (n: number) => n.toLocaleString("en-IN");

const demoClips = [
  { label: "Real Human Voice", desc: "A genuine phone call between a parent and child checking in.", risk: "safe" as const },
  { label: "AI Generated Voice", desc: "A cloned voice pretending to be a relative in trouble.", risk: "dangerous" as const },
  { label: "Borderline Case", desc: "A bank-style call asking for verification details.", risk: "suspicious" as const },
];

function Landing() {
  return (
    <div>
      <Header />
      <main>
        {/* Hero */}
        <section className="border-b bg-gradient-to-b from-accent/40 to-background">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 md:grid-cols-12 md:px-6 md:py-24">
            <div className="md:col-span-7">
              <span className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs font-semibold text-primary">
                <ShieldCheck className="h-3.5 w-3.5" /> Built for Indian families
              </span>
              <h1 className="mt-4 font-display text-4xl font-extrabold leading-tight tracking-tight text-foreground md:text-6xl">
                Is that voice real?<br />
                <span className="text-primary">Detect AI scam calls</span> before it is too late.
              </h1>
              <p className="mt-5 max-w-xl text-base text-muted-foreground md:text-lg">
                VoiceGuard analyzes suspicious calls for fake voices and scam language. Free. Private.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link to="/demo" className="tap-target inline-flex items-center gap-2 rounded-[10px] bg-primary px-6 text-base font-semibold text-primary-foreground shadow-sm hover:bg-primary/90">
                  Try demo now <ArrowRight className="h-4 w-4" />
                </Link>
                <Link to="/signup" className="tap-target inline-flex items-center rounded-[10px] border-2 border-primary/30 bg-background px-6 text-base font-semibold text-primary hover:bg-accent">
                  Create free account
                </Link>
              </div>
              <div className="mt-6 flex items-center gap-5 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1.5"><Lock className="h-3.5 w-3.5" /> No call recordings stored without consent</span>
                <span className="inline-flex items-center gap-1.5"><HeartHandshake className="h-3.5 w-3.5" /> Free for everyone</span>
              </div>
            </div>
            <div className="md:col-span-5">
              <div className="relative rounded-[20px] border bg-card p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Live analysis preview</p>
                  <span className="inline-flex items-center gap-1 rounded-full bg-danger/10 px-2 py-0.5 text-xs font-bold text-danger">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-danger" /> Dangerous
                  </span>
                </div>
                <div className="mt-4 rounded-[14px] bg-muted p-4 text-sm leading-relaxed">
                  &ldquo;Ma'am this is officer Verma from CBI. Your Aadhaar is being used in a money laundering case. <span className="scam-phrase">You are under digital arrest</span> until verification is done. <span className="scam-phrase">Do not disconnect this call</span>.&rdquo;
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-[10px] border p-3">
                    <p className="text-xs text-muted-foreground">Voice authenticity</p>
                    <p className="font-display text-2xl font-bold text-danger">18%</p>
                  </div>
                  <div className="rounded-[10px] border p-3">
                    <p className="text-xs text-muted-foreground">Scam language</p>
                    <p className="font-display text-2xl font-bold text-danger">12%</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2 rounded-[10px] bg-danger/10 p-3 text-xs text-danger">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  Emergency alert was sent to your family contact.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="border-b">
          <div className="mx-auto max-w-7xl px-4 py-16 md:px-6">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-display text-3xl font-bold md:text-4xl">How it works</h2>
              <p className="mt-3 text-muted-foreground">Three simple steps. No technical knowledge needed.</p>
            </div>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {[
                { n: "01", icon: Upload, title: "Upload suspicious audio", body: "Drop a recording from your phone. We accept MP3, WAV, M4A and OGG." },
                { n: "02", icon: Brain, title: "AI analyzes voice and words", body: "We check if the voice is real or cloned, and look for known scam phrases." },
                { n: "03", icon: FileText, title: "Get instant risk report", body: "A clear safe, suspicious or dangerous verdict in plain English and Hindi." },
              ].map((s) => {
                const Icon = s.icon;
                return (
                  <div key={s.n} className="rounded-[16px] border bg-card p-6">
                    <p className="font-display text-sm font-bold text-primary">{s.n}</p>
                    <div className="mt-3 grid h-12 w-12 place-items-center rounded-[12px] bg-primary/10 text-primary">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="mt-4 font-display text-xl font-bold">{s.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Demo mode */}
        <section className="border-b bg-card">
          <div className="mx-auto max-w-7xl px-4 py-16 md:px-6">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-primary">Demo mode</p>
                <h2 className="mt-1 font-display text-3xl font-bold md:text-4xl">Hear how VoiceGuard analyzes a call</h2>
              </div>
              <Link to="/demo" className="text-sm font-semibold text-primary hover:underline">Open full demo →</Link>
            </div>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {demoClips.map((c) => (
                <div key={c.label} className="flex flex-col rounded-[16px] border bg-background p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Sample</span>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                      c.risk === "safe" ? "bg-safe/10 text-safe"
                      : c.risk === "suspicious" ? "bg-warning/15 text-warning-foreground"
                      : "bg-danger/10 text-danger"
                    }`}>{c.risk}</span>
                  </div>
                  <h3 className="mt-3 font-display text-lg font-bold">{c.label}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{c.desc}</p>
                  <div className="mt-4 flex items-center gap-2">
                    <button className="tap-target inline-flex items-center gap-2 rounded-md border px-4 text-sm font-semibold hover:bg-muted">
                      <Play className="h-4 w-4" /> Play
                    </button>
                    <Link to="/demo" className="tap-target inline-flex items-center rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
                      Analyze now
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Live stats */}
        <section className="border-b">
          <div className="mx-auto max-w-7xl px-4 py-12 md:px-6">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {[
                { k: "Total calls analyzed", v: fmt(stats.totalAnalyzed) },
                { k: "Flagged as dangerous", v: fmt(stats.dangerousFlagged) },
                { k: "Families alerted", v: fmt(stats.familiesAlerted) },
                { k: "Scam phrases detected", v: fmt(stats.scamPhrasesDetected) },
              ].map((s) => (
                <div key={s.k} className="rounded-[14px] border bg-card p-5">
                  <p className="font-display text-3xl font-extrabold tabular-nums md:text-4xl">{s.v}</p>
                  <p className="mt-1 text-xs font-medium text-muted-foreground">{s.k}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Highlights */}
        <section>
          <div className="mx-auto max-w-7xl px-4 py-16 md:px-6">
            <div className="grid gap-5 md:grid-cols-3">
              {[
                { icon: Lock, title: "Privacy first", body: "Recordings are processed in memory and discarded after analysis. We never sell your data." },
                { icon: HeartHandshake, title: "Elderly friendly", body: "Big buttons, plain language, and Hindi explanations on every result." },
                { icon: MapPin, title: "India focused", body: "Trained on the exact scam patterns targeting Indian families today." },
              ].map((f) => {
                const Icon = f.icon;
                return (
                  <div key={f.title} className="rounded-[16px] border bg-card p-6">
                    <div className="grid h-12 w-12 place-items-center rounded-[12px] bg-primary/10 text-primary">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="mt-4 font-display text-xl font-bold">{f.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{f.body}</p>
                  </div>
                );
              })}
            </div>
            <div className="mt-12 rounded-[20px] border bg-primary p-8 text-primary-foreground md:p-12">
              <div className="flex flex-wrap items-center justify-between gap-6">
                <div className="max-w-xl">
                  <h3 className="font-display text-2xl font-bold md:text-3xl">Help protect someone you love</h3>
                  <p className="mt-2 text-sm opacity-90">Add a parent or grandparent as your emergency contact. If we detect a dangerous call on their phone, you will know within seconds.</p>
                </div>
                <Link to="/signup" className="tap-target inline-flex items-center gap-2 rounded-md bg-background px-5 text-base font-semibold text-primary hover:bg-background/90">
                  Create free account <Phone className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

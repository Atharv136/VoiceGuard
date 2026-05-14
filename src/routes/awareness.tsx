import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Header } from "@/components/voiceguard/Header";
import { Footer } from "@/components/voiceguard/Footer";
import { awarenessCards, type AwarenessCategory } from "@/data/awareness";
import { AlertTriangle, CheckCircle2, ShieldCheck, Landmark, Heart } from "lucide-react";

export const Route = createFileRoute("/awareness")({
  head: () => ({
    meta: [
      { title: "Awareness & Govt Schemes — VoiceGuard" },
      { name: "description", content: "Learn about scams and explore Indian Government cybersecurity schemes and compensation frameworks." },
    ],
  }),
  component: AwarenessPage,
});

const tabs: ("All" | AwarenessCategory | "Schemes")[] = ["All", "Financial", "Impersonation", "Government", "Family", "Schemes"];

function AwarenessPage() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("All");
  
  const list = tab === "All" 
    ? awarenessCards 
    : tab === "Schemes" 
      ? awarenessCards.filter(c => c.isScheme)
      : awarenessCards.filter((c) => c.category === tab);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-12 md:px-6">
        <div className="max-w-3xl">
          <h1 className="font-display text-4xl font-extrabold tracking-tight md:text-6xl">
            Protecting your family <br className="hidden md:block" /> with knowledge.
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            Explore verified scam alerts and official Indian Government schemes designed to compensate victims and prevent digital crime.
          </p>
        </div>

        <div className="mt-10 flex flex-wrap gap-2 border-b pb-6">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`tap-target rounded-full px-5 py-2 text-sm font-bold transition-all ${
                tab === t 
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-105" 
                  : "bg-card text-muted-foreground hover:bg-muted border"
              }`}
            >
              {t === "Schemes" ? "🏛️ Govt Schemes" : t}
            </button>
          ))}
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-2">
          {list.map((card) => {
            const isScheme = card.isScheme;
            return (
              <article 
                key={card.id} 
                className={`group flex flex-col rounded-[24px] border transition-all hover:shadow-xl ${
                  isScheme ? "bg-primary/5 border-primary/20" : "bg-card hover:border-danger/30"
                } p-8`}
              >
                <div className="flex items-center justify-between">
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                    isScheme ? "bg-primary/10 text-primary" : "bg-danger/10 text-danger"
                  }`}>
                    {isScheme ? <Landmark className="h-3 w-3" /> : <AlertTriangle className="h-3 w-3" />}
                    {card.category}
                  </span>
                  {isScheme && <ShieldCheck className="h-5 w-5 text-primary opacity-50" />}
                </div>

                <h2 className="mt-5 font-display text-2xl font-bold group-hover:text-primary transition-colors">{card.title}</h2>
                <p className="mt-3 text-base leading-relaxed text-muted-foreground">{card.howItWorks}</p>
                
                <div className={`mt-6 rounded-2xl p-5 ${isScheme ? "bg-white/60 border border-primary/10" : "bg-danger/5"}`}>
                  <p className={`flex items-center gap-2 text-sm font-bold ${isScheme ? "text-primary" : "text-danger"}`}>
                    {isScheme ? <ShieldCheck className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
                    {isScheme ? "Key Details" : "Red flags"}
                  </p>
                  <ul className="mt-3 space-y-2">
                    {card.redFlags.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-foreground/80">
                        <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${isScheme ? "bg-primary" : "bg-danger"}`} />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-auto pt-6">
                  <p className={`flex items-start gap-2.5 text-sm font-bold ${isScheme ? "text-safe" : "text-safe"}`}>
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-safe" />
                    <span>
                      <span className="opacity-70 font-medium">{isScheme ? "Action point: " : "Protection: "}</span>
                      {card.whatToDo}
                    </span>
                  </p>
                </div>
              </article>
            );
          })}
        </div>
        
        <section className="mt-16 rounded-[32px] bg-sidebar p-10 text-center border">
          <Heart className="mx-auto h-10 w-10 text-danger animate-pulse" />
          <h3 className="mt-4 font-display text-2xl font-bold">Need direct support?</h3>
          <p className="mt-2 text-muted-foreground">NGOs like CyberPeace and NACIA offer free guidance for fraud victims.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
             <a href="tel:1930" className="tap-target inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-white hover:bg-primary/90">
               Call 1930 Now
             </a>
             <a href="https://cybercrime.gov.in" target="_blank" className="tap-target inline-flex items-center gap-2 rounded-full border bg-white px-6 py-3 text-sm font-bold hover:bg-muted">
               Visit CyberCell Portal
             </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

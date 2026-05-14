import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Header } from "@/components/voiceguard/Header";
import { Footer } from "@/components/voiceguard/Footer";
import { awarenessCards, type AwarenessCategory } from "@/data/awareness";
import { AlertTriangle, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/awareness")({
  head: () => ({
    meta: [
      { title: "Scam awareness feed — VoiceGuard" },
      { name: "description", content: "Real scams targeting Indian families today, with red flags and what to do." },
    ],
  }),
  component: AwarenessPage,
});

const tabs: ("All" | AwarenessCategory)[] = ["All", "Financial", "Impersonation", "Government", "Family"];

function AwarenessPage() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("All");
  const list = tab === "All" ? awarenessCards : awarenessCards.filter((c) => c.category === tab);
  return (
    <div>
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-12 md:px-6">
        <h1 className="font-display text-3xl font-extrabold md:text-5xl">Know the scams targeting Indian families today</h1>
        <p className="mt-3 max-w-2xl text-base text-muted-foreground">Real call scripts our team has verified this month. Read the red flags and share these with your parents and grandparents.</p>
        <div className="mt-8 flex flex-wrap gap-2">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`tap-target rounded-full px-4 text-sm font-semibold ${
                tab === t ? "bg-primary text-primary-foreground" : "border bg-card text-foreground hover:bg-muted"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {list.map((card) => (
            <article key={card.id} className="flex flex-col rounded-[16px] border bg-card p-6">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-primary">{card.category}</span>
              </div>
              <h2 className="mt-3 font-display text-xl font-bold">{card.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{card.howItWorks}</p>
              <div className="mt-4 rounded-[10px] bg-danger/5 p-4">
                <p className="flex items-center gap-2 text-sm font-bold text-danger"><AlertTriangle className="h-4 w-4" /> Red flags</p>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-foreground">
                  {card.redFlags.map((f) => <li key={f}>{f}</li>)}
                </ul>
              </div>
              <p className="mt-4 flex items-start gap-2 text-sm font-semibold text-safe">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                {card.whatToDo}
              </p>
            </article>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}

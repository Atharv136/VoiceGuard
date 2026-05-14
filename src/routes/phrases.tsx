import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Header } from "@/components/voiceguard/Header";
import { Footer } from "@/components/voiceguard/Footer";
import { phraseLibrary } from "@/data/phrases";
import { Search } from "lucide-react";

export const Route = createFileRoute("/phrases")({
  head: () => ({
    meta: [
      { title: "Scam phrase library — VoiceGuard" },
      { name: "description", content: "Phrases VoiceGuard detects as dangerous, with explanations." },
    ],
  }),
  component: PhrasesPage,
});

function PhrasesPage() {
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    if (!q.trim()) return phraseLibrary;
    const lc = q.toLowerCase();
    return phraseLibrary
      .map((g) => ({ ...g, phrases: g.phrases.filter((p) => p.phrase.toLowerCase().includes(lc) || p.reason.toLowerCase().includes(lc)) }))
      .filter((g) => g.phrases.length > 0);
  }, [q]);

  return (
    <div>
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-12 md:px-6">
        <h1 className="font-display text-3xl font-extrabold md:text-5xl">Phrases VoiceGuard detects as dangerous</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">If you hear any of these in a phone call, slow down and verify before doing anything. Hover any phrase to see why it is flagged.</p>
        <div className="mt-6 flex items-center gap-3 rounded-[12px] border bg-card px-4 py-3 shadow-sm">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search phrases like 'OTP' or 'arrest'"
            className="w-full bg-transparent text-base outline-none placeholder:text-muted-foreground"
          />
        </div>
        <div className="mt-10 space-y-10">
          {filtered.map((g) => (
            <section key={g.category}>
              <h2 className="font-display text-xl font-bold">{g.category}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{g.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {g.phrases.map((p) => (
                  <span
                    key={p.phrase}
                    title={p.reason}
                    className="group relative cursor-help rounded-full bg-danger/10 px-3 py-1.5 text-sm font-semibold text-danger ring-1 ring-danger/20 hover:bg-danger/15"
                  >
                    “{p.phrase}”
                    <span className="pointer-events-none absolute left-1/2 top-full z-10 mt-2 hidden w-64 -translate-x-1/2 rounded-md border bg-card p-3 text-xs font-normal text-foreground shadow-lg group-hover:block">
                      {p.reason}
                    </span>
                  </span>
                ))}
              </div>
            </section>
          ))}
          {filtered.length === 0 && (
            <p className="text-sm text-muted-foreground">No phrases match your search.</p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

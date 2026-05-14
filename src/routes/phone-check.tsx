import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Header } from "@/components/voiceguard/Header";
import { Footer } from "@/components/voiceguard/Footer";
import { phoneService } from "@/services/phoneService";
import { reportedNumbers } from "@/data/mock";
import { CheckCircle2, AlertTriangle, PhoneCall } from "lucide-react";

export const Route = createFileRoute("/phone-check")({
  head: () => ({
    meta: [
      { title: "Quick phone number check — VoiceGuard" },
      { name: "description", content: "Check if an Indian mobile number has been reported for scams." },
    ],
  }),
  component: PhoneCheck,
});

type Result = Awaited<ReturnType<typeof phoneService.check>>;

function PhoneCheck() {
  const [num, setNum] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  async function onCheck(e: React.FormEvent) {
    e.preventDefault();
    if (!num.trim()) return;
    setLoading(true);
    const r = await phoneService.check(num);
    setResult(r);
    setLoading(false);
  }

  return (
    <div>
      <Header />
      <main className="mx-auto max-w-4xl px-4 py-12 md:px-6">
        <h1 className="font-display text-3xl font-extrabold md:text-5xl">Check if a number has been reported</h1>
        <p className="mt-3 text-muted-foreground">Paste an Indian mobile number and we will tell you if it appears in our scam database.</p>

        <form onSubmit={onCheck} className="mt-6 flex flex-col gap-3 rounded-[14px] border bg-card p-4 shadow-sm sm:flex-row">
          <div className="flex flex-1 items-center gap-3 rounded-[10px] border bg-background px-3 py-3">
            <PhoneCall className="h-5 w-5 text-muted-foreground" />
            <input
              value={num}
              onChange={(e) => setNum(e.target.value)}
              placeholder="+91 98xxxx1234"
              inputMode="tel"
              className="w-full bg-transparent text-lg outline-none placeholder:text-muted-foreground"
            />
          </div>
          <button
            disabled={loading}
            className="tap-target inline-flex items-center justify-center rounded-md bg-primary px-6 text-base font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
          >
            {loading ? "Checking…" : "Check now"}
          </button>
        </form>

        {result && (
          <div className={`mt-6 rounded-[14px] border p-6 ${result.reported ? "border-danger/30 bg-danger/5" : "border-safe/30 bg-safe/5"}`}>
            <div className="flex items-start gap-3">
              {result.reported ? (
                <AlertTriangle className="mt-1 h-6 w-6 text-danger" />
              ) : (
                <CheckCircle2 className="mt-1 h-6 w-6 text-safe" />
              )}
              <div>
                <p className={`font-display text-2xl font-bold ${result.reported ? "text-danger" : "text-safe"}`}>
                  {result.reported ? "This number appears in our scam database" : "No reports found for this number"}
                </p>
                {result.reported && (
                  <p className="mt-1 text-sm">
                    Reported as <span className="font-semibold">{result.scamType || "Scam"}</span> · {result.reportCount || 0} reports · last reported {result.lastReported || "recently"}.
                  </p>
                )}
                <div className="mt-3 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
                  <p><span className="font-semibold text-foreground">Carrier:</span> {result.carrier}</p>
                  <p><span className="font-semibold text-foreground">Telecom circle:</span> {result.circle}</p>
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  Disclaimer: this database is built from user reports. A "no reports found" result does not guarantee the number is safe. Always verify before sharing personal details.
                </p>
              </div>
            </div>
          </div>
        )}

        <section className="mt-10">
          <h2 className="font-display text-xl font-bold">Recently reported numbers</h2>
          <div className="mt-4 overflow-hidden rounded-[14px] border bg-card">
            <table className="w-full text-sm">
              <thead className="bg-muted/60 text-left text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Number</th>
                  <th className="px-4 py-3">Scam type</th>
                  <th className="px-4 py-3">Reports</th>
                  <th className="px-4 py-3">Last reported</th>
                </tr>
              </thead>
              <tbody>
                {reportedNumbers.map((r) => (
                  <tr key={r.number} className="border-t">
                    <td className="px-4 py-3 font-mono">{r.number}</td>
                    <td className="px-4 py-3">{r.scam}</td>
                    <td className="px-4 py-3 font-semibold">{r.reports}</td>
                    <td className="px-4 py-3 text-muted-foreground">{r.last}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

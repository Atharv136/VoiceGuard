import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Header } from "@/components/voiceguard/Header";
import { Footer } from "@/components/voiceguard/Footer";
import { CheckCircle2, AlertTriangle, RefreshCcw } from "lucide-react";

export const Route = createFileRoute("/safety-check")({
  head: () => ({
    meta: [
      { title: "Is this call a scam? — VoiceGuard safety check" },
      { name: "description", content: "Answer seven simple questions to check if a call is a scam." },
    ],
  }),
  component: SafetyCheck,
});

const questions = [
  "Did the caller create urgency, like asking you to act in the next few minutes?",
  "Did they threaten you with arrest, FIR, or police action?",
  "Did they claim to be from CBI, RBI, income tax, court, or police?",
  "Did they ask for OTP, CVV, ATM PIN, or bank password?",
  "Did they ask you to install AnyDesk, TeamViewer or any screen sharing app?",
  "Did they tell you not to disconnect the call or not to tell your family?",
  "Did they ask you to transfer money to verify, refund, or release something?",
];

function SafetyCheck() {
  const [answers, setAnswers] = useState<(boolean | null)[]>(Array(questions.length).fill(null));
  const answered = answers.filter((a) => a !== null).length;
  const yesCount = answers.filter((a) => a === true).length;
  const done = answered === questions.length;
  const dangerous = yesCount >= 2;

  return (
    <div>
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-12 md:px-6">
        <h1 className="font-display text-3xl font-extrabold md:text-5xl">Is this call a scam? Answer these questions</h1>
        <p className="mt-3 text-muted-foreground">Two or more "yes" answers usually means the call is not safe.</p>

        <div className="sticky top-16 z-10 mt-6 rounded-full bg-card p-1 shadow-sm">
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div className="h-full bg-primary transition-[width] duration-300" style={{ width: `${(answered / questions.length) * 100}%` }} />
          </div>
        </div>

        <ol className="mt-8 space-y-4">
          {questions.map((q, i) => (
            <li key={q} className="rounded-[14px] border bg-card p-5">
              <p className="font-display text-lg font-semibold">{i + 1}. {q}</p>
              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => setAnswers((a) => a.map((v, idx) => (idx === i ? true : v)))}
                  className={`tap-target flex-1 rounded-md border-2 px-4 text-base font-bold ${
                    answers[i] === true ? "border-danger bg-danger text-danger-foreground" : "border-danger/40 text-danger hover:bg-danger/5"
                  }`}
                >
                  Yes
                </button>
                <button
                  onClick={() => setAnswers((a) => a.map((v, idx) => (idx === i ? false : v)))}
                  className={`tap-target flex-1 rounded-md border-2 px-4 text-base font-bold ${
                    answers[i] === false ? "border-safe bg-safe text-safe-foreground" : "border-safe/40 text-safe hover:bg-safe/5"
                  }`}
                >
                  No
                </button>
              </div>
            </li>
          ))}
        </ol>

        {done && (
          <div className={`mt-8 rounded-[16px] border-2 p-6 ${dangerous ? "border-danger bg-danger/5" : "border-safe bg-safe/5"}`}>
            <div className="flex items-start gap-3">
              {dangerous ? <AlertTriangle className="h-7 w-7 text-danger" /> : <CheckCircle2 className="h-7 w-7 text-safe" />}
              <div>
                <p className={`font-display text-2xl font-bold ${dangerous ? "text-danger" : "text-safe"}`}>
                  {dangerous ? "Warning — this call shows multiple scam signs" : "This call seems legitimate"}
                </p>
                <p className="mt-2 text-base">
                  {dangerous
                    ? "Hang up immediately. Do not share any details, do not transfer any money. If you need to contact the organisation they claimed to be from, call them on the official number printed on their website or your card."
                    : "Nothing strongly suggests a scam, but stay alert. If anything changes during the call, hang up and verify on a known number."}
                </p>
              </div>
            </div>
            <button
              onClick={() => setAnswers(Array(questions.length).fill(null))}
              className="tap-target mt-5 inline-flex items-center gap-2 rounded-md border bg-background px-4 text-sm font-medium hover:bg-muted"
            >
              <RefreshCcw className="h-4 w-4" /> Start again
            </button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

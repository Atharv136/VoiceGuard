import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ShieldAlert, Banknote, PhoneOff, Users, FileWarning, Copy, ExternalLink, ChevronRight, ChevronLeft } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/complaint")({
  head: () => ({ meta: [{ title: "File a complaint — VoiceGuard" }] }),
  component: Complaint,
});

const types = [
  { id: "digital-arrest", label: "Digital arrest scam", icon: ShieldAlert },
  { id: "financial", label: "Financial fraud", icon: Banknote },
  { id: "voice-clone", label: "Voice cloning of family", icon: Users },
  { id: "harassment", label: "Threat or harassment", icon: PhoneOff },
  { id: "other", label: "Other scam call", icon: FileWarning },
] as const;

function Complaint() {
  const [step, setStep] = useState(1);
  const [type, setType] = useState<string>("");
  const [form, setForm] = useState({ caller: "", date: "", time: "", amount: "", description: "", name: "", address: "", contact: "" });

  const text = `Subject: Complaint regarding scam call — ${type || "Phone scam"}

To the Cyber Crime Cell,

I, ${form.name || "[Your name]"}, residing at ${form.address || "[your address]"}, contact number ${form.contact || "[your contact]"}, wish to report a scam call I received.

Caller number: ${form.caller || "[caller number]"}
Date and time: ${form.date || "[date]"} at ${form.time || "[time]"}
Amount lost: ₹${form.amount || "0"}

What happened:
${form.description || "[Describe what was said during the call.]"}

I request the cell to register my complaint and take necessary action against the caller.

Sincerely,
${form.name || "[Your name]"}`;

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="font-display text-3xl font-extrabold">File a complaint</h1>
      <p className="mt-2 text-muted-foreground">Step {step} of 5</p>
      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-muted">
        <div className="h-full bg-primary transition-all" style={{ width: `${(step / 5) * 100}%` }} />
      </div>

      <div className="mt-8 rounded-[16px] border bg-card p-6">
        {step === 1 && (
          <div>
            <h2 className="font-display text-xl font-bold">What kind of incident?</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {types.map((t) => {
                const Icon = t.icon;
                const active = type === t.id;
                return (
                  <button key={t.id} onClick={() => setType(t.id)} className={`tap-target flex items-center gap-3 rounded-[12px] border-2 p-4 text-left ${active ? "border-primary bg-primary/5" : "border-border hover:bg-muted"}`}>
                    <Icon className="h-5 w-5 text-primary" />
                    <span className="font-semibold">{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
        {step === 2 && (
          <div className="space-y-4">
            <h2 className="font-display text-xl font-bold">Call details</h2>
            <Input label="Caller number" value={form.caller} onChange={(v) => setForm({ ...form, caller: v })} />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Date" type="date" value={form.date} onChange={(v) => setForm({ ...form, date: v })} />
              <Input label="Time" type="time" value={form.time} onChange={(v) => setForm({ ...form, time: v })} />
            </div>
            <Input label="Amount lost (₹) — optional" value={form.amount} onChange={(v) => setForm({ ...form, amount: v.replace(/\D/g, "") })} />
          </div>
        )}
        {step === 3 && (
          <div>
            <h2 className="font-display text-xl font-bold">What was said?</h2>
            <p className="mt-1 text-sm text-muted-foreground">Describe in your own words what happened. Our AI will organize it for you.</p>
            <textarea rows={6} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="mt-3 w-full rounded-md border bg-background p-3 text-sm" />
          </div>
        )}
        {step === 4 && (
          <div className="space-y-4">
            <h2 className="font-display text-xl font-bold">Your details</h2>
            <Input label="Full name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
            <Input label="Address" value={form.address} onChange={(v) => setForm({ ...form, address: v })} />
            <Input label="Contact number" value={form.contact} onChange={(v) => setForm({ ...form, contact: v })} />
          </div>
        )}
        {step === 5 && (
          <div>
            <h2 className="font-display text-xl font-bold">Your complaint is ready</h2>
            <pre className="mt-4 max-h-80 overflow-auto whitespace-pre-wrap rounded-[10px] border bg-muted/40 p-4 text-sm">{text}</pre>
            <div className="mt-4 flex flex-wrap gap-3">
              <button onClick={() => { navigator.clipboard?.writeText(text); toast.success("Complaint copied to clipboard"); }} className="tap-target inline-flex items-center gap-2 rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
                <Copy className="h-4 w-4" /> Copy full complaint
              </button>
              <a href="https://cybercrime.gov.in" target="_blank" rel="noreferrer" className="tap-target inline-flex items-center gap-2 rounded-md border-2 border-primary px-5 text-sm font-semibold text-primary hover:bg-primary/5">
                Open Cyber Crime portal <ExternalLink className="h-4 w-4" />
              </a>
            </div>
            <ol className="mt-6 space-y-2 text-sm text-muted-foreground">
              <li><span className="font-semibold text-foreground">1.</span> On the portal, click "Report Other Cyber Crime" and create a citizen login.</li>
              <li><span className="font-semibold text-foreground">2.</span> Choose the relevant category and paste the complaint text into the description field.</li>
              <li><span className="font-semibold text-foreground">3.</span> Attach any screenshots or recordings, then submit and save the acknowledgement number.</li>
            </ol>
          </div>
        )}

        <div className="mt-6 flex justify-between">
          <button disabled={step === 1} onClick={() => setStep((s) => s - 1)} className="tap-target inline-flex items-center gap-1 rounded-md border px-4 text-sm font-medium disabled:opacity-40">
            <ChevronLeft className="h-4 w-4" /> Back
          </button>
          {step < 5 && (
            <button onClick={() => setStep((s) => s + 1)} className="tap-target inline-flex items-center gap-1 rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
              Next <ChevronRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Input({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-semibold">{label}</span>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-md border bg-background p-3 text-base outline-none focus:border-primary" />
    </label>
  );
}

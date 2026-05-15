import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { Logo } from "@/components/voiceguard/Logo";
import { useAuth } from "@/store/auth";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/signup")({
  head: () => ({ meta: [{ title: "Create your account — VoiceGuard" }] }),
  component: Signup,
});

function Signup() {
  const navigate = useNavigate();
  const { login, setOnboardingDone } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [age, setAge] = useState<string>("");
  const [emergency, setEmergency] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const ageNum = Number(age);
  const emergencyRequired = !!age && (ageNum < 16 || ageNum > 40);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    const schema = z.object({
      name: z.string().trim().min(2, "Please enter your full name"),
      email: z.string().email("Enter a valid email"),
      pw: z.string().min(6, "Password must be at least 6 characters"),
      age: z.coerce.number().int().min(8, "Age must be 8 or more").max(110, "Age looks incorrect"),
      emergency: emergencyRequired
        ? z.string().email("Emergency contact email is required")
        : z.string().email("Enter a valid email").optional().or(z.literal("")),
    });
    const r = schema.safeParse({ name, email, pw, age, emergency });
    if (!r.success) {
      const errs: Record<string, string> = {};
      r.error.issues.forEach((i) => { errs[String(i.path[0])] = i.message; });
      setErrors(errs);
      return;
    }
    setErrors({});
    setLoading(true);

    try {
      // Call our backend instead of Supabase directly — no rate limits!
      const res = await fetch("http://localhost:3001/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password: pw,
          name,
          age: ageNum,
          emergencyContact: emergency || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Signup failed");

      // Store user + JWT in the auth store
      login(data.user, data.accessToken);
      setOnboardingDone(false);
      toast.success("Account created. Welcome to VoiceGuard.");
      navigate({ to: "/pricing" as any });
    } catch (err) {
      toast.error((err as Error).message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid min-h-screen place-items-center bg-background px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-6 flex justify-center"><Logo /></div>
        <div className="rounded-[16px] border bg-card p-7 shadow-sm">
          <h1 className="font-display text-2xl font-bold">Create your free account</h1>
          <p className="mt-1 text-sm text-muted-foreground">Built for Indian families. Always free.</p>
          <form onSubmit={onSubmit} className="mt-6 space-y-4" noValidate>
            <Field label="Full name" error={errors.name}>
              <input value={name} onChange={(e) => setName(e.target.value)} className="input" />
            </Field>
            <Field label="Email" error={errors.email}>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input" />
            </Field>
            <Field label="Password" error={errors.pw}>
              <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} className="input" />
            </Field>
            <Field label="Age" error={errors.age}>
              <input inputMode="numeric" value={age} onChange={(e) => setAge(e.target.value.replace(/\D/g, ""))} className="input" />
            </Field>
            <Field
              label={
                <>
                  Emergency contact email {emergencyRequired && <span className="text-danger">*</span>}
                </>
              }
              error={errors.emergency}
              note={
                emergencyRequired
                  ? "Because of your age, an emergency contact is required so we can alert someone you trust if a dangerous call is detected."
                  : "Optional. Recommended if you want a family member to be alerted automatically."
              }
              noteTone={emergencyRequired ? "warning" : "muted"}
            >
              <input
                type="email"
                value={emergency}
                onChange={(e) => setEmergency(e.target.value)}
                className="input"
                placeholder="family@example.com"
              />
            </Field>
            <button disabled={loading} className="tap-target flex w-full items-center justify-center gap-2 rounded-md bg-primary py-3 text-base font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-70">
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Create account
            </button>
          </form>
          <p className="mt-5 text-center text-sm text-muted-foreground">
            Already have an account? <Link to="/login" className="font-semibold text-primary hover:underline">Log in</Link>
          </p>
        </div>
      </div>
      <style>{`.input { width: 100%; border: 1px solid var(--color-border); background: var(--color-background); border-radius: 10px; padding: 12px 14px; font-size: 16px; outline: none; } .input:focus { border-color: var(--color-primary); box-shadow: 0 0 0 3px color-mix(in oklab, var(--color-primary) 18%, transparent); }`}</style>
    </div>
  );
}

function Field({ label, children, error, note, noteTone = "muted" }: {
  label: React.ReactNode;
  children: React.ReactNode;
  error?: string;
  note?: string;
  noteTone?: "muted" | "warning";
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-semibold">{label}</span>
      {children}
      {note && (
        <span className={`mt-1 block text-xs ${noteTone === "warning" ? "rounded-md bg-warning/15 p-2 font-medium text-warning-foreground" : "text-muted-foreground"}`}>
          {note}
        </span>
      )}
      {error && <span className="mt-1 block text-xs font-medium text-danger">{error}</span>}
    </label>
  );
}

import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Logo } from "@/components/voiceguard/Logo";
import { useAuth } from "@/store/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Log in — VoiceGuard" }] }),
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !pw) { toast.error("Email and password required"); return; }
    login({ name: email.split("@")[0].replace(/[^a-z]/gi, " ") || "Member", email, age: 32 });
    toast.success("Welcome back");
    navigate({ to: "/dashboard" });
  }

  return (
    <div className="grid min-h-screen place-items-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="mb-6 flex justify-center"><Logo /></div>
        <div className="rounded-[16px] border bg-card p-7 shadow-sm">
          <h1 className="font-display text-2xl font-bold">Log in</h1>
          <p className="mt-1 text-sm text-muted-foreground">Welcome back. Pick up where you left off.</p>
          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <Field label="Email">
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="input" />
            </Field>
            <Field label="Password">
              <input type="password" required value={pw} onChange={(e) => setPw(e.target.value)} className="input" />
            </Field>
            <div className="flex items-center justify-between text-sm">
              <Link to="/" className="text-primary hover:underline">Forgot password?</Link>
            </div>
            <button className="tap-target w-full rounded-md bg-primary text-base font-semibold text-primary-foreground hover:bg-primary/90">Log in</button>
          </form>
          <p className="mt-5 text-center text-sm text-muted-foreground">
            New to VoiceGuard? <Link to="/signup" className="font-semibold text-primary hover:underline">Create an account</Link>
          </p>
        </div>
      </div>
      <style>{`.input { width: 100%; border: 1px solid var(--color-border); background: var(--color-background); border-radius: 10px; padding: 12px 14px; font-size: 16px; outline: none; } .input:focus { border-color: var(--color-primary); box-shadow: 0 0 0 3px color-mix(in oklab, var(--color-primary) 18%, transparent); }`}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-semibold">{label}</span>
      {children}
    </label>
  );
}

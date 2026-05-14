import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Logo } from "@/components/voiceguard/Logo";
import { useAuth } from "@/store/auth";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Log in — VoiceGuard" }] }),
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    if (!email || !pw) { toast.error("Email and password required"); return; }
    setError("");
    setLoading(true);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password: pw,
      });

      if (authError) throw authError;
      if (!data.user) throw new Error("Login failed");

      // Fetch profile to get name and age (mock age for now as we didn't store it in profile)
      const { data: profile } = await supabase.from("profiles").select("*").eq("id", data.user.id).single();

      login({ 
        id: data.user.id,
        name: profile?.full_name || email.split("@")[0], 
        email, 
        age: 30, // Default for now
        emergencyContact: profile?.emergency_contact_email || undefined
      });
      
      toast.success("Welcome back!");
      navigate({ to: "/dashboard" });
    } catch (err) {
      setError((err as Error).message || "Invalid credentials");
      toast.error((err as Error).message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
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
            <button disabled={loading} className="tap-target mt-2 flex w-full items-center justify-center gap-2 rounded-md bg-primary py-3 text-base font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-70">
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Log in
            </button>
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

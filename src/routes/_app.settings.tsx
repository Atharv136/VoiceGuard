import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/store/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/settings")({
  head: () => ({ meta: [{ title: "Settings — VoiceGuard" }] }),
  component: Settings,
});

function Settings() {
  const { user, updateUser, setOnboardingDone, logout } = useAuth();
  const navigate = useNavigate();
  const [emergency, setEmergency] = useState(user?.emergencyContact ?? "");
  const [age, setAge] = useState(String(user?.age ?? ""));
  const [notif, setNotif] = useState({ email: true, sms: false, push: true });

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="font-display text-3xl font-extrabold">Settings</h1>

      <Card title="Emergency contact" desc="The person we alert when a dangerous call is detected on your account.">
        <div className="flex flex-col gap-3 sm:flex-row">
          <input value={emergency} onChange={(e) => setEmergency(e.target.value)} placeholder="family@example.com" className="flex-1 rounded-md border bg-background p-3 text-base outline-none focus:border-primary" />
          <button onClick={() => { updateUser({ emergencyContact: emergency }); toast.success("Emergency contact updated"); }} className="tap-target rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground hover:bg-primary/90">Save</button>
        </div>
      </Card>

      <Card title="Age" desc="Used to enable extra safeguards for younger and older users.">
        <div className="flex flex-col gap-3 sm:flex-row">
          <input value={age} onChange={(e) => setAge(e.target.value.replace(/\D/g, ""))} className="w-32 rounded-md border bg-background p-3 text-base outline-none focus:border-primary" />
          <button onClick={() => { updateUser({ age: Number(age) || 0 }); toast.success("Age updated"); }} className="tap-target rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground hover:bg-primary/90">Save</button>
        </div>
      </Card>

      <Card title="Notification preferences" desc="Pick how we should reach you.">
        {(["email", "sms", "push"] as const).map((k) => (
          <label key={k} className="flex items-center justify-between border-t py-3 first:border-t-0">
            <span className="text-sm font-medium capitalize">{k} notifications</span>
            <input type="checkbox" checked={notif[k]} onChange={(e) => setNotif({ ...notif, [k]: e.target.checked })} className="h-5 w-5 accent-[var(--color-primary)]" />
          </label>
        ))}
      </Card>

      <Card title="Tutorial" desc="Replay the welcome tour any time.">
        <button onClick={() => { setOnboardingDone(false); toast.success("Tutorial will replay now"); }} className="tap-target rounded-md border-2 border-primary px-5 text-sm font-semibold text-primary hover:bg-primary/5">
          Re-trigger onboarding tutorial
        </button>
      </Card>

      <Card title="Danger zone" desc="Irreversible account actions." tone="danger">
        <button onClick={() => { if (confirm("Delete your account? This cannot be undone.")) { logout(); navigate({ to: "/" }); toast.success("Account deleted"); } }} className="tap-target rounded-md bg-danger px-5 text-sm font-semibold text-danger-foreground hover:bg-danger/90">
          Delete my account
        </button>
      </Card>
    </div>
  );
}

function Card({ title, desc, children, tone }: { title: string; desc: string; children: React.ReactNode; tone?: "danger" }) {
  return (
    <section className={`rounded-[14px] border bg-card p-6 ${tone === "danger" ? "border-danger/30" : ""}`}>
      <h2 className={`font-display text-lg font-bold ${tone === "danger" ? "text-danger" : ""}`}>{title}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
      <div className="mt-4">{children}</div>
    </section>
  );
}

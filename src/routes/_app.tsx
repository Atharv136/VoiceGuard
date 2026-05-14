import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { AppShell } from "@/components/voiceguard/AppShell";
import { useAuth } from "@/store/auth";

export const Route = createFileRoute("/_app")({
  beforeLoad: () => {
    if (typeof window === "undefined") return;
    const raw = window.localStorage.getItem("voiceguard-auth");
    if (!raw) throw redirect({ to: "/login" });
    try {
      const parsed = JSON.parse(raw) as { state?: { user?: unknown } };
      if (!parsed?.state?.user) throw redirect({ to: "/login" });
    } catch {
      throw redirect({ to: "/login" });
    }
  },
  component: AppLayout,
});

function AppLayout() {
  // ensure auth hydration runs (no-op read)
  useAuth.getState();
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}

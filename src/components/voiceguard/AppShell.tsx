import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Mic,
  History,
  FileWarning,
  ListChecks,
  Newspaper,
  PhoneCall,
  BarChart3,
  Settings,
  LogOut,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { useAuth } from "@/store/auth";
import { OnboardingModal } from "./OnboardingModal";

const nav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/analyze", label: "Analyze call", icon: Mic },
  { to: "/history", label: "My history", icon: History },
  { to: "/complaint", label: "File complaint", icon: FileWarning },
  { to: "/safety-check", label: "Safety check", icon: ListChecks },
  { to: "/awareness", label: "Awareness feed", icon: Newspaper },
  { to: "/phone-check", label: "Phone lookup", icon: PhoneCall },
  { to: "/live", label: "Live Guard", icon: Zap },
  { to: "/statistics", label: "Statistics", icon: BarChart3 },

  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function AppShell({ children }: { children: React.ReactNode }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex max-w-[1400px]">
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r bg-sidebar md:block">
          <div className="flex h-16 items-center gap-2 px-5">
            <span className="grid h-9 w-9 place-items-center rounded-[10px] bg-primary text-primary-foreground">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <span className="font-display text-lg font-bold">VoiceGuard</span>
          </div>
          <nav className="px-3 py-2">
            {nav.map((item) => {
              const Icon = item.icon;
              const active = path === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`tap-target mb-1 flex items-center gap-3 rounded-[10px] px-3 text-sm font-medium ${
                    active ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground hover:bg-sidebar-accent/60"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-background/85 px-4 backdrop-blur md:px-8">
            <div className="md:hidden">
              <Link to="/dashboard" className="inline-flex items-center gap-2 font-display font-bold">
                <span className="grid h-8 w-8 place-items-center rounded-md bg-primary text-primary-foreground">
                  <ShieldCheck className="h-4 w-4" />
                </span>
                VoiceGuard
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-semibold">{user?.name ?? "Guest"}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
              <button
                onClick={() => {
                  logout();
                  navigate({ to: "/" });
                }}
                className="tap-target inline-flex items-center gap-2 rounded-md border px-3 text-sm font-medium hover:bg-muted"
              >
                <LogOut className="h-4 w-4" />
                Log out
              </button>
            </div>
          </header>
          <main className="px-4 py-6 md:px-8 md:py-8">{children}</main>
          {/* Mobile bottom nav */}
          <nav className="sticky bottom-0 z-20 grid grid-cols-5 border-t bg-card md:hidden">
            {nav.slice(0, 5).map((item) => {
              const Icon = item.icon;
              const active = path === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`tap-target flex flex-col items-center justify-center gap-0.5 py-2 text-[11px] font-medium ${
                    active ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
      <OnboardingModal />
    </div>
  );
}

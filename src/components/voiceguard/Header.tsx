import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";
import { useAuth } from "@/store/auth";
import { Moon, Sun } from "lucide-react";

export function Header() {
  const { user, theme, setTheme } = useAuth();
  return (
    <header className="sticky top-0 z-30 border-b bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        <Logo />
        <nav className="hidden items-center gap-6 md:flex">
          <Link to="/awareness" className="text-sm font-medium text-muted-foreground hover:text-foreground">Scam feed</Link>
          <Link to="/phrases" className="text-sm font-medium text-muted-foreground hover:text-foreground">Phrase library</Link>
          <Link to="/phone-check" className="text-sm font-medium text-muted-foreground hover:text-foreground">Phone check</Link>
          <Link to="/safety-check" className="text-sm font-medium text-muted-foreground hover:text-foreground">Safety check</Link>
          <Link to="/live" className="text-sm font-medium text-muted-foreground hover:text-foreground">Live demo</Link>
        </nav>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="tap-target grid h-10 w-10 place-items-center rounded-md text-muted-foreground hover:bg-muted"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          {user ? (
            <Link to="/dashboard" className="tap-target inline-flex items-center rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
              Dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" className="tap-target hidden items-center px-3 text-sm font-medium text-foreground sm:inline-flex">Log in</Link>
              <Link to="/signup" className="tap-target inline-flex items-center rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
                Create account
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

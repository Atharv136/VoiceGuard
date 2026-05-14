import { ShieldCheck } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`inline-flex items-center gap-2 font-display font-bold text-foreground ${className}`}>
      <span className="grid h-9 w-9 place-items-center rounded-[10px] bg-primary text-primary-foreground">
        <ShieldCheck className="h-5 w-5" />
      </span>
      <span className="text-lg tracking-tight">VoiceGuard</span>
    </Link>
  );
}

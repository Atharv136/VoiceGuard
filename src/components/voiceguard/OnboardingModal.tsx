import { useState } from "react";
import { useAuth } from "@/store/auth";
import { ShieldCheck, Upload, Users, X } from "lucide-react";

const steps = [
  {
    icon: ShieldCheck,
    title: "Welcome to VoiceGuard",
    body: "We help you check if a phone call you received is a scam. It is free, private, and built for Indian families.",
  },
  {
    icon: Upload,
    title: "How to check a call",
    body: "Open the call recording from your phone, tap Analyze Call, and upload the file. We will tell you if the voice was real and if the words sound like a scam.",
  },
  {
    icon: Users,
    title: "Confirm your emergency contact",
    body: "If something looks dangerous, we will tell a trusted family member. You can change this contact any time in Settings.",
  },
];

export function OnboardingModal() {
  const { user, onboardingDone, setOnboardingDone } = useAuth();
  const [step, setStep] = useState(0);
  if (!user || onboardingDone) return null;
  const S = steps[step];
  const Icon = S.icon;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-foreground/40 p-4">
      <div className="relative w-full max-w-md rounded-[16px] border bg-card p-6 shadow-2xl">
        <button onClick={() => setOnboardingDone(true)} className="absolute right-3 top-3 text-muted-foreground" aria-label="Close">
          <X className="h-4 w-4" />
        </button>
        <div className="grid h-14 w-14 place-items-center rounded-[14px] bg-primary/10 text-primary">
          <Icon className="h-7 w-7" />
        </div>
        <h2 className="mt-5 font-display text-2xl font-bold">{S.title}</h2>
        <p className="mt-2 text-base text-muted-foreground">{S.body}</p>
        <div className="mt-5 flex items-center gap-2">
          {steps.map((_, i) => (
            <span key={i} className={`h-1.5 flex-1 rounded-full ${i <= step ? "bg-primary" : "bg-muted"}`} />
          ))}
        </div>
        <div className="mt-6 flex justify-between gap-2">
          <button
            onClick={() => setOnboardingDone(true)}
            className="tap-target rounded-md px-4 text-sm font-medium text-muted-foreground hover:bg-muted"
          >
            Skip
          </button>
          <button
            onClick={() => (step === steps.length - 1 ? setOnboardingDone(true) : setStep((s) => s + 1))}
            className="tap-target inline-flex items-center rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
          >
            {step === steps.length - 1 ? "Get started" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}

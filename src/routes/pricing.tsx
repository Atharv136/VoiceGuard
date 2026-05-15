import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { CheckCircle2, X } from "lucide-react";

export const Route = createFileRoute("/pricing")({
  component: PricingPage,
});

function PricingPage() {
  const navigate = useNavigate();

  const handleSelectFree = () => {
    navigate({ to: "/dashboard" });
  };

  const handleSelectPremium = () => {
    navigate({ to: "/payment" as any });
  };

  return (
    <div className="min-h-screen bg-background py-16 px-4">
      <div className="mx-auto max-w-5xl text-center">
        <h1 className="font-display text-4xl font-extrabold tracking-tight md:text-5xl">
          Choose your protection plan
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          VoiceGuard is designed to keep you safe. Choose the plan that fits your needs.
        </p>

        <div className="mt-16 grid gap-8 md:grid-cols-2">
          {/* Free Plan Card */}
          <div className="flex flex-col rounded-[24px] border bg-card p-8 shadow-sm text-left relative overflow-hidden transition-all hover:border-primary/30">
            <h3 className="font-display text-2xl font-bold">Basic Protection</h3>
            <p className="mt-2 text-muted-foreground text-sm">Essential scam protection for individuals.</p>
            <div className="mt-6 font-display text-4xl font-black">
              ₹0 <span className="text-lg font-medium text-muted-foreground">/ forever</span>
            </div>
            
            <div className="mt-8 flex-1 space-y-4">
              <FeatureItem included={true} text="AI Scam Call Analysis" />
              <FeatureItem included={true} text="Community Scam Number DB" />
              <FeatureItem included={true} text="Manual Call Uploads" />
              <FeatureItem included={false} text="Family Emergency Alerts" />
              <FeatureItem included={false} text="Full Call Transcriptions" />
              <FeatureItem included={false} text="Live Call Analysis (Over 3 mins)" />
            </div>

            <button
              onClick={handleSelectFree}
              className="tap-target mt-8 w-full rounded-[10px] border-2 border-primary/20 bg-background px-6 py-3 font-bold text-primary transition-all hover:bg-primary/5 hover:border-primary"
            >
              Continue with Free
            </button>
          </div>

          {/* Premium Plan Card */}
          <div className="flex flex-col rounded-[24px] border-2 border-primary bg-card p-8 shadow-md text-left relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full bg-primary py-1 text-center text-xs font-bold uppercase tracking-widest text-primary-foreground">
              Most Popular & Recommended
            </div>
            <h3 className="mt-4 font-display text-2xl font-bold">Premium Guard</h3>
            <p className="mt-2 text-muted-foreground text-sm">Total peace of mind with real-time family alerts.</p>
            <div className="mt-6 flex flex-col gap-1">
              <div className="font-display text-4xl font-black">
                ₹99 <span className="text-lg font-medium text-muted-foreground">/ month</span>
              </div>
              <div className="text-sm font-semibold text-primary">
                or ₹899 / year <span className="text-muted-foreground font-normal bg-primary/10 px-2 py-0.5 rounded-full ml-1 text-xs">Save 24%</span>
              </div>
            </div>
            
            <div className="mt-8 flex-1 space-y-4">
              <FeatureItem included={true} text="AI Scam Call Analysis" />
              <FeatureItem included={true} text="Community Scam Number DB" />
              <FeatureItem included={true} text="Manual Call Uploads" />
              <FeatureItem included={true} text="Family Emergency Alerts" />
              <FeatureItem included={true} text="Full Call Transcriptions" />
              <FeatureItem included={true} text="Unlimited Live Call Analysis" />
            </div>

            <button
              onClick={handleSelectPremium}
              className="tap-target mt-8 w-full rounded-[10px] bg-primary px-6 py-3 font-bold text-primary-foreground shadow-lg transition-all hover:bg-primary/90 hover:shadow-primary/25"
            >
              Get Premium Guard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureItem({ included, text }: { included: boolean; text: string }) {
  return (
    <div className="flex items-start gap-3">
      {included ? (
        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-safe" />
      ) : (
        <X className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground/50" />
      )}
      <span className={`text-sm ${included ? "text-foreground font-medium" : "text-muted-foreground line-through"}`}>
        {text}
      </span>
    </div>
  );
}

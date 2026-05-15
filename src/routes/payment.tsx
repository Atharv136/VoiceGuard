import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { CheckCircle2, QrCode, ShieldCheck, Lock } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

export const Route = createFileRoute("/payment")({
  component: PaymentPage,
});

function PaymentPage() {
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);

  const handlePaymentComplete = () => {
    setProcessing(true);
    // Simulate payment verification delay
    setTimeout(() => {
      toast.success("Payment successful! Premium Guard activated.", { duration: 4000 });
      navigate({ to: "/dashboard" });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background py-16 px-4">
      <div className="mx-auto max-w-4xl">
        <div className="text-center">
          <h1 className="font-display text-3xl font-extrabold tracking-tight md:text-4xl">
            Complete your Premium Guard setup
          </h1>
          <p className="mt-2 text-muted-foreground">
            Scan the secure QR code below to activate your premium protection.
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-[1fr_400px]">
          {/* Order Summary */}
          <div className="space-y-6">
            <div className="rounded-[24px] border bg-card p-6 shadow-sm">
              <h2 className="font-display text-xl font-bold flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                Order Summary
              </h2>
              
              <div className="mt-6 space-y-4 border-b border-dashed pb-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-bold text-foreground">Premium Guard</p>
                    <p className="text-sm text-muted-foreground">Monthly Subscription</p>
                  </div>
                  <p className="font-bold">₹99</p>
                </div>
              </div>

              <div className="mt-6 flex justify-between items-center font-display text-2xl font-black">
                <p>Total</p>
                <p>₹99</p>
              </div>
            </div>

            <div className="rounded-[24px] bg-primary/5 p-6 border border-primary/10">
              <h3 className="font-bold text-primary flex items-center gap-2">
                <Lock className="h-4 w-4" /> Secure Checkout
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Your payment is securely processed. VoiceGuard does not store your banking information. Activation is instant upon successful payment.
              </p>
            </div>
          </div>

          {/* QR Code Section */}
          <div className="flex flex-col rounded-[24px] border bg-card p-8 shadow-sm text-center">
            <h3 className="font-display text-lg font-bold">Pay via UPI</h3>
            <p className="mt-1 text-sm text-muted-foreground">Scan with any UPI app (GPay, PhonePe, Paytm)</p>
            
            <div className="mx-auto mt-8 flex h-64 w-64 items-center justify-center rounded-2xl bg-white p-4 shadow-inner border-2 border-dashed border-muted-foreground/20">
              <div className="flex flex-col items-center justify-center text-muted-foreground/40">
                <QrCode className="h-40 w-40" strokeWidth={1} />
                <span className="mt-2 font-mono text-xs tracking-widest uppercase font-bold text-muted-foreground/60">UPI_MOCK_QR</span>
              </div>
            </div>

            <p className="mt-6 font-mono text-sm font-semibold tracking-wider text-muted-foreground bg-muted py-2 px-4 rounded-lg inline-block mx-auto">
              voiceguard@upi
            </p>

            <button
              onClick={handlePaymentComplete}
              disabled={processing}
              className="tap-target mt-8 w-full flex items-center justify-center gap-2 rounded-[10px] bg-primary px-6 py-4 font-bold text-primary-foreground shadow-lg transition-all hover:bg-primary/90 disabled:opacity-70 disabled:pointer-events-none"
            >
              {processing ? (
                "Verifying payment..."
              ) : (
                <>
                  <CheckCircle2 className="h-5 w-5" />
                  I have completed the payment
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

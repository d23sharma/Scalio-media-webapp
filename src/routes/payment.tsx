import { useState, type FormEvent } from "react";
import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { ArrowLeft, CreditCard, Smartphone, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type PayMethod = "card-credit" | "card-debit" | "upi";

interface PaymentSearch {
  method?: PayMethod;
  plan?: string;
  amount?: string;
}

export const Route = createFileRoute("/payment")({
  head: () => ({
    meta: [
      { title: "Payment — Scalio Media" },
      { name: "description", content: "Complete your package purchase." },
    ],
  }),
  validateSearch: (s: Record<string, unknown>): PaymentSearch => ({
    method: (s.method as PayMethod) || "card-credit",
    plan: typeof s.plan === "string" ? s.plan : "",
    amount: typeof s.amount === "string" ? s.amount : "",
  }),
  component: PaymentPage,
});

const METHOD_META: Record<PayMethod, { label: string; icon: React.ReactNode }> = {
  "card-credit": { label: "Credit Card", icon: <CreditCard size={18} /> },
  "card-debit": { label: "Debit Card", icon: <Wallet size={18} /> },
  upi: { label: "UPI", icon: <Smartphone size={18} /> },
};

function PaymentPage() {
  const { method = "card-credit", plan, amount } = useSearch({ from: "/payment" });
  const [done, setDone] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setDone(true);
  };

  const meta = METHOD_META[method as PayMethod];
  const isUpi = method === "upi";

  return (
    <main className="min-h-screen bg-[#F5F7FA] py-16 px-4">
      <div className="max-w-xl mx-auto">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-[#1B2A4A] hover:text-[#4A9EFF] mb-6"
        >
          <ArrowLeft size={16} /> Back
        </Link>

        <div className="rounded-3xl bg-white shadow-card p-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-10 h-10 rounded-full bg-gradient-brand text-white flex items-center justify-center">
              {meta.icon}
            </span>
            <div>
              <h1 className="font-display font-bold text-2xl text-[#1A1A2E]">
                Pay with {meta.label}
              </h1>
              {plan && <p className="text-sm text-[#6B7280]">{plan}</p>}
            </div>
          </div>

          {done ? (
            <div className="text-center py-10">
              <p className="font-display font-bold text-xl text-[#1A1A2E]">Demo complete</p>
              <p className="mt-2 text-sm text-[#6B7280]">No real payment was processed.</p>
              <Link
                to="/"
                className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-brand text-white font-semibold"
              >
                Back to home
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {isUpi ? (
                <div className="space-y-2">
                  <Label htmlFor="upi">UPI ID</Label>
                  <Input id="upi" placeholder="yourname@bank" required />
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="cardName">Name on card</Label>
                    <Input id="cardName" required autoComplete="cc-name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Card number</Label>
                    <Input
                      id="cardNumber"
                      inputMode="numeric"
                      maxLength={19}
                      placeholder="1234 5678 9012 3456"
                      required
                      autoComplete="cc-number"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="expiry">Expiry (MM/YY)</Label>
                      <Input
                        id="expiry"
                        placeholder="08/29"
                        maxLength={5}
                        required
                        autoComplete="cc-exp"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        inputMode="numeric"
                        maxLength={4}
                        required
                        autoComplete="cc-csc"
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="flex items-center justify-between rounded-xl bg-[#F5F7FA] px-4 py-3">
                <span className="text-sm text-[#6B7280]">Total amount</span>
                <span className="font-display font-bold text-lg text-[#1A1A2E]">
                  {amount || "₹—"}
                </span>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-brand text-white shadow-glow hover:scale-[1.01] transition-transform"
              >
                Pay Now
              </Button>
              <p className="text-center text-xs text-[#6B7280]">
                Demo only — no payment will be processed.
              </p>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}

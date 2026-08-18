import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Sparkles, ShieldCheck, Lock, AlertCircle } from "lucide-react";
import CtaButton from "./ui/CtaButton";
import { PRICING } from "../lib/site";

type Props = {
  bumpSelected: boolean;
  onToggle: (v: boolean) => void;
};

export default function OrderBumpCheckout({ bumpSelected, onToggle }: Props) {
  const total = bumpSelected ? PRICING.withBump : PRICING.base;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCheckout() {
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hasOrderBump: bumpSelected }),
      });

      const data: { url?: string; error?: string } = await res
        .json()
        .catch(() => ({}));

      if (!res.ok || !data.url) {
        throw new Error(data.error || "לא הצלחנו ליצור עמוד תשלום.");
      }

      // Redirect to Stripe's hosted Checkout page.
      window.location.href = data.url;
    } catch {
      setError("אירעה שגיאה במעבר לתשלום. אנא נסו שוב בעוד רגע.");
      setIsSubmitting(false);
    }
  }

  return (
    <section
      id="checkout"
      className="scroll-mt-8 px-4 py-16 lg:py-24"
      aria-labelledby="checkout-heading"
    >
      <div className="mx-auto max-w-2xl">
        <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-tactile-lg backdrop-blur-md sm:p-8">
          {/* top inner highlight */}
          <span
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/[0.06]"
            aria-hidden="true"
          />
          {/* top ribbon */}
          <div className="mb-7 text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-gold-cta px-4 py-1.5 text-xs font-extrabold tracking-wide text-slate-950 shadow-cta">
              <Sparkles className="h-3.5 w-3.5" strokeWidth={2.4} aria-hidden="true" /> שריון מקום
              לסדנה
            </span>
            <h2
              id="checkout-heading"
              className="mt-4 text-2xl font-extrabold tracking-tight text-cloud-50 sm:text-3xl"
            >
              סיכום ההזמנה שלך
            </h2>
          </div>

          {/* line items */}
          <div className="space-y-2.5">
            <LineItem label="כרטיס לסדנת הלייב + כל 4 הבונוסים" price="$97" highlight />
            <AnimatePresence initial={false}>
              {bumpSelected && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <LineItem label="Off-Market & Contractor Pack" price="$27" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ---- Order bump (native, keyboard-accessible checkbox) ---- */}
          <div className="my-6">
            <input
              id="order-bump"
              type="checkbox"
              checked={bumpSelected}
              onChange={(e) => onToggle(e.target.checked)}
              className="peer sr-only"
            />
            <label
              htmlFor="order-bump"
              className={`relative flex cursor-pointer items-start gap-3 overflow-hidden rounded-2xl border-2 border-dashed p-4 pt-5 text-right shadow-tactile transition-colors duration-300 peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-amber-400 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-ink-900 ${
                bumpSelected
                  ? "border-emerald-400/70 bg-emerald-500/[0.08]"
                  : "border-gold-500/60 bg-gold-500/[0.05] hover:bg-gold-500/[0.09]"
              }`}
            >
              {/* pulsing attention ring only while unselected */}
              {!bumpSelected && (
                <span
                  className="pointer-events-none absolute inset-0 rounded-2xl animate-pulse-glow"
                  aria-hidden="true"
                />
              )}
              {/* highlighter tag */}
              <span
                className="absolute -top-px right-4 -translate-y-1/2 rounded-md bg-gold-400 px-2 py-0.5 text-[11px] font-extrabold text-slate-950 shadow-tactile"
                aria-hidden="true"
              >
                הצעה חד פעמית שלא תחזור
              </span>

              {/* visual checkbox — the native input above carries the real state */}
              <span
                className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 transition-colors duration-200 ${
                  bumpSelected
                    ? "border-emerald-400 bg-emerald-500 text-slate-950"
                    : "border-gold-500 bg-transparent"
                }`}
                aria-hidden="true"
              >
                {bumpSelected && <Check className="h-4 w-4" strokeWidth={3.5} />}
              </span>
              <span className="text-sm leading-relaxed text-slate-100">
                <span className="font-bold">כן! הוסף להזמנה שלי</span> את חבילת החוזים לעבודה מול
                קבלנים ומוכרים פרטיים{" "}
                <span className="font-semibold text-gold-400">
                  (Off-Market &amp; Contractor Pack)
                </span>{" "}
                ב-<span className="ltr-nums font-bold">$27</span> בלבד{" "}
                <span className="text-slate-300">
                  (במקום <span className="ltr-nums line-through">${PRICING.bumpOriginal}</span>).
                </span>
              </span>
            </label>
          </div>

          {/* ---- Total ---- */}
          <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-ink-900/70 px-5 py-4 shadow-tactile">
            <span className="text-base font-bold text-cloud-50">סה״כ לתשלום היום</span>
            <div
              className="relative h-11 overflow-hidden text-left"
              role="status"
              aria-live="polite"
              aria-atomic="true"
              aria-label={`סך הכל לתשלום: ${total} דולר`}
            >
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={total}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="ltr-nums block text-4xl font-extrabold tracking-tight text-emerald-400"
                >
                  ${total}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>

          {/* ---- CTA ---- */}
          <div className="mt-6">
            <CtaButton
              onClick={handleCheckout}
              loading={isSubmitting}
              pulse={false}
              aria-label={`שריין את מקומי בסדנה עכשיו בעלות של ${total} דולר`}
            >
              {isSubmitting ? (
                "מעבירים אותך לתשלום מאובטח…"
              ) : (
                <>
                  שריין את מקומי בסדנה עכשיו - <span className="ltr-nums">${total}</span>
                </>
              )}
            </CtaButton>

            {error && (
              <p
                role="alert"
                className="mt-3 flex items-center justify-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm font-semibold text-red-300"
              >
                <AlertCircle className="h-4 w-4 shrink-0" strokeWidth={2.2} aria-hidden="true" />
                {error}
              </p>
            )}

            <div className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-slate-300">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-400" aria-hidden="true" /> החזר כספי מלא
                100%
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Lock className="h-4 w-4 text-emerald-400" aria-hidden="true" /> תשלום מאובטח
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function LineItem({
  label,
  price,
  highlight = false,
}: {
  label: string;
  price: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between rounded-xl px-4 py-3 shadow-tactile ring-1 ring-inset ${
        highlight ? "bg-ink-900/60 ring-slate-800" : "bg-emerald-500/[0.07] ring-emerald-500/20"
      }`}
    >
      <span className="pe-3 text-sm font-semibold text-cloud-50">{label}</span>
      <span className="ltr-nums shrink-0 text-sm font-bold text-cloud-50">{price}</span>
    </div>
  );
}

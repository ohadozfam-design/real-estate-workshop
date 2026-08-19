import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ShieldCheck, Lock, AlertCircle, CalendarDays } from "lucide-react";
import CtaButton from "./ui/CtaButton";
import { PRICING, SITE } from "../lib/site";

type Props = {
  bumpSelected: boolean;
  onToggle: (v: boolean) => void;
};

type Lead = { name: string; phone: string; email: string };
type FieldErrors = Partial<Record<keyof Lead, string>>;

function validateLead(lead: Lead): FieldErrors {
  const errs: FieldErrors = {};
  if (lead.name.trim().length < 2) errs.name = "נא למלא שם מלא";
  if (lead.phone.replace(/\D/g, "").length < 9) errs.phone = "נא למלא מספר טלפון תקין";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email.trim())) errs.email = "נא למלא כתובת אימייל תקינה";
  return errs;
}

export default function OrderBumpCheckout({ bumpSelected, onToggle }: Props) {
  const total = bumpSelected ? PRICING.withBump : PRICING.base;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [lead, setLead] = useState<Lead>({ name: "", phone: "", email: "" });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [showErrors, setShowErrors] = useState(false);

  function setField(key: keyof Lead, value: string) {
    setLead((prev) => ({ ...prev, [key]: value }));
    if (showErrors) {
      setFieldErrors(validateLead({ ...lead, [key]: value }));
    }
  }

  function paymentLinkFallback(): string | undefined {
    const base = import.meta.env.VITE_STRIPE_PAYMENT_URL_BASE;
    const bump = import.meta.env.VITE_STRIPE_PAYMENT_URL_BUMP;
    return bumpSelected ? bump || base : base;
  }

  async function handleCheckout() {
    // Validate the lead details before allowing submission.
    const errs = validateLead(lead);
    if (Object.keys(errs).length > 0) {
      setShowErrors(true);
      setFieldErrors(errs);
      setError("נא למלא שם מלא, טלפון ואימייל כדי להמשיך.");
      const firstInvalid = (["name", "phone", "email"] as (keyof Lead)[]).find((k) => errs[k]);
      if (firstInvalid) document.getElementById(`lead-${firstInvalid}`)?.focus();
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hasOrderBump: bumpSelected,
          name: lead.name.trim(),
          phone: lead.phone.trim(),
          email: lead.email.trim(),
        }),
      });

      // Read as text first so a non-JSON response (e.g. an HTML SPA fallback that
      // means the /api route wasn't hit) can be logged instead of silently swallowed.
      const rawBody = await res.text();
      let data: { url?: string; error?: string } = {};
      try {
        data = rawBody ? JSON.parse(rawBody) : {};
      } catch {
        throw new Error(
          `Non-JSON response from /api/create-checkout-session (status ${res.status}). ` +
            `First bytes: ${rawBody.slice(0, 120)}`
        );
      }

      if (!res.ok || !data.url) {
        throw new Error(data.error || `Checkout API failed with status ${res.status}.`);
      }

      // Redirect to Stripe's hosted Checkout page.
      window.location.href = data.url;
    } catch (err) {
      console.error("[checkout] create-checkout-session failed:", err);

      const fallbackUrl = paymentLinkFallback();
      if (fallbackUrl) {
        console.warn("[checkout] falling back to Stripe Payment Link:", fallbackUrl);
        window.location.href = fallbackUrl;
        return;
      }

      setError("אירעה שגיאה במעבר לתשלום. אנא נסו שוב בעוד רגע.");
      setIsSubmitting(false);
    }
  }

  return (
    <section id="checkout" className="scroll-mt-8 px-5 py-16 lg:py-24" aria-labelledby="checkout-heading">
      <div className="mx-auto max-w-2xl">
        <div className="overflow-hidden rounded-2xl border border-drift/15 bg-ateneo/15 shadow-card">
          {/* header */}
          <div className="border-b border-drift/10 px-6 py-7 text-center sm:px-8">
            <span className="text-xs font-bold uppercase tracking-[0.22em] text-gold">
              שריון מקום לסדנה
            </span>
            <h2
              id="checkout-heading"
              className="mt-3 text-2xl font-extrabold tracking-tight text-cloud sm:text-3xl"
            >
              סיכום ההזמנה שלך
            </h2>
            {/* Prominent dates badge */}
            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-sm font-bold text-gold">
              <CalendarDays className="h-4 w-4" strokeWidth={2.2} aria-hidden="true" />
              <span className="ltr-nums">{SITE.eventDates}</span>
              <span className="text-gold/50" aria-hidden="true">·</span>
              יומיים בלייב בזום
            </div>
          </div>

          <div className="p-6 sm:p-8">
            {/* line items */}
            <div className="space-y-2.5">
              <LineItem label="כרטיס לסדנת הלייב + כל 4 הבונוסים" price="$97" />
              <AnimatePresence initial={false}>
                {bumpSelected && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <LineItem label="Off-Market & Contractor Pack" price="$27" accent />
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
                className={`relative flex cursor-pointer items-start gap-3 rounded-xl border-2 border-dashed p-4 pt-5 text-right transition-colors duration-300 peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-gold peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-night ${
                  bumpSelected
                    ? "border-gold bg-night/50"
                    : "border-gold/50 bg-night/30 hover:bg-night/45"
                }`}
              >
                <span
                  className="absolute -top-px right-4 -translate-y-1/2 rounded-md bg-coral px-2 py-0.5 text-[11px] font-extrabold text-night"
                  aria-hidden="true"
                >
                  הצעה חד פעמית שלא תחזור
                </span>

                <span
                  className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 transition-colors duration-200 ${
                    bumpSelected ? "border-gold bg-gold text-night" : "border-gold/70 bg-transparent"
                  }`}
                  aria-hidden="true"
                >
                  {bumpSelected && <Check className="h-4 w-4" strokeWidth={3.5} />}
                </span>
                <span className="text-sm leading-relaxed text-cloud">
                  <span className="font-bold">כן! הוסף להזמנה שלי</span> את חבילת החוזים לעבודה מול
                  קבלנים ומוכרים פרטיים{" "}
                  <span className="font-semibold text-gold">(Off-Market &amp; Contractor Pack)</span>{" "}
                  תמורת <span className="ltr-nums font-bold">$27</span> בלבד{" "}
                  <span className="text-drift">
                    (במקום <span className="ltr-nums line-through">${PRICING.bumpOriginal}</span>).
                  </span>
                </span>
              </label>
            </div>

            {/* ---- Lead capture form ---- */}
            <div className="rounded-xl border border-drift/15 bg-night/40 p-5 sm:p-6">
              <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-gold">הפרטים שלך</h3>
              <p className="mt-1 text-xs text-drift">
                כדי לשמור לך את המקום ולשלוח את הקישור לזום ואת כל החומרים.
              </p>
              <div className="mt-4 space-y-3.5">
                <Field
                  id="lead-name"
                  label="שם מלא"
                  value={lead.name}
                  onChange={(v) => setField("name", v)}
                  autoComplete="name"
                  placeholder="ישראל ישראלי"
                  error={showErrors ? fieldErrors.name : undefined}
                />
                <Field
                  id="lead-phone"
                  label="טלפון / וואטסאפ"
                  type="tel"
                  inputMode="tel"
                  dir="ltr"
                  value={lead.phone}
                  onChange={(v) => setField("phone", v)}
                  autoComplete="tel"
                  placeholder="050 000 0000"
                  error={showErrors ? fieldErrors.phone : undefined}
                />
                <Field
                  id="lead-email"
                  label="כתובת אימייל"
                  type="email"
                  inputMode="email"
                  dir="ltr"
                  value={lead.email}
                  onChange={(v) => setField("email", v)}
                  autoComplete="email"
                  placeholder="name@email.com"
                  error={showErrors ? fieldErrors.email : undefined}
                />
              </div>
            </div>

            {/* ---- Total ---- */}
            <div className="mt-6 flex items-center justify-between rounded-xl border border-cloud/10 bg-night/50 px-5 py-4">
              <span className="text-base font-bold text-cloud">סה״כ לתשלום היום</span>
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
                    className="ltr-nums block text-4xl font-extrabold tracking-tight text-gold"
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
                aria-label={`שריין את מקומי בסדנה עכשיו בעלות של ${total} דולר`}
              >
                {isSubmitting ? (
                  "מעבירים אותך לתשלום מאובטח…"
                ) : (
                  <>
                    שריין את מקומי בסדנה עכשיו · <span className="ltr-nums">${total}</span>
                  </>
                )}
              </CtaButton>

              {error && (
                <p
                  role="alert"
                  className="mt-3 flex items-center justify-center gap-2 rounded-lg border border-coral/40 bg-coral/10 px-4 py-2.5 text-sm font-semibold text-coral"
                >
                  <AlertCircle className="h-4 w-4 shrink-0" strokeWidth={2.2} aria-hidden="true" />
                  {error}
                </p>
              )}

              <div className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-drift">
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-gold" aria-hidden="true" /> החזר כספי מלא 100%
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Lock className="h-4 w-4 text-gold" aria-hidden="true" /> תשלום מאובטח
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  error,
  type = "text",
  inputMode,
  dir,
  autoComplete,
  placeholder,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  type?: string;
  inputMode?: "text" | "tel" | "email" | "numeric";
  dir?: "rtl" | "ltr";
  autoComplete?: string;
  placeholder?: string;
}) {
  const invalid = Boolean(error);
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-cloud">
        {label}
      </label>
      <input
        id={id}
        type={type}
        inputMode={inputMode}
        dir={dir}
        autoComplete={autoComplete}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={invalid}
        aria-describedby={invalid ? `${id}-error` : undefined}
        className={`focus-ring w-full rounded-xl border bg-night/60 px-4 py-3 text-[15px] text-cloud placeholder:text-drift/40 transition-colors ${
          invalid ? "border-coral" : "border-drift/20 hover:border-drift/35"
        }`}
      />
      {invalid && (
        <p id={`${id}-error`} className="mt-1.5 text-xs font-semibold text-coral">
          {error}
        </p>
      )}
    </div>
  );
}

function LineItem({
  label,
  price,
  accent = false,
}: {
  label: string;
  price: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between rounded-xl border px-4 py-3 ${
        accent ? "border-gold/40 bg-gold/10" : "border-cloud/10 bg-night/40"
      }`}
    >
      <span className="pe-3 text-sm font-semibold text-cloud">{label}</span>
      <span className="ltr-nums shrink-0 text-sm font-bold text-cloud">{price}</span>
    </div>
  );
}

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, AlertCircle, CheckCircle2 } from "lucide-react";

const SHOWN_FLAG = "k2_exit_shown";

/** Israeli phone: local 0XXXXXXXX(X) or international 972XXXXXXXX(X). */
function isValidIsraeliPhone(raw: string): boolean {
  const d = raw.replace(/\D/g, "");
  return /^0\d{8,9}$/.test(d) || /^972\d{8,9}$/.test(d);
}

export default function ExitPopup() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [showErrors, setShowErrors] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const nameError = name.trim().length < 2 ? "נא למלא שם מלא" : undefined;
  const phoneError = !isValidIsraeliPhone(phone) ? "נא למלא מספר טלפון ישראלי תקין" : undefined;

  // STRICT exit-intent only - no timers, no scroll-depth trigger:
  //   • Desktop: mouse leaves the viewport toward the top (clientY <= 10).
  //   • Mobile/touch: the tab is hidden / the page is being left
  //     (visibilitychange -> hidden, or pagehide) - never mid-scroll.
  //   • Never shown once the checkout section has entered the viewport.
  //   • Capped to once per browser session.
  useEffect(() => {
    let done = false;
    try {
      if (sessionStorage.getItem(SHOWN_FLAG)) done = true;
    } catch {
      /* storage blocked - still allow one show in-memory */
    }
    // Skip on the post-payment thank-you view (already converted).
    if (new URLSearchParams(window.location.search).get("checkout") === "success") return;
    if (done) return;

    // Checkout protection: once #checkout has entered the viewport, never show
    // the popup (don't interrupt a user heading to pay). Passive observer only.
    let reachedCheckout = false;
    const checkoutEl = document.getElementById("checkout");
    let io: IntersectionObserver | undefined;
    if (checkoutEl && "IntersectionObserver" in window) {
      io = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            reachedCheckout = true;
            io?.disconnect();
          }
        },
        { threshold: 0 }
      );
      io.observe(checkoutEl);
    }
    const inCheckout = () => {
      if (reachedCheckout) return true;
      if (!checkoutEl) return false;
      const r = checkoutEl.getBoundingClientRect();
      return r.top < window.innerHeight && r.bottom > 0;
    };

    const trigger = () => {
      if (done || inCheckout()) return; // never block the checkout section
      done = true;
      try {
        sessionStorage.setItem(SHOWN_FLAG, "1");
      } catch {
        /* ignore */
      }
      setOpen(true);
      cleanup();
    };

    // Desktop: genuine exit intent - cursor leaves the top edge of the viewport.
    const onMouseOut = (e: MouseEvent) => {
      if (!e.relatedTarget && e.clientY <= 10) trigger();
    };
    // Mobile/touch: leaving the tab/page is the only exit signal (no cursor).
    const onVisibility = () => {
      if (document.visibilityState === "hidden") trigger();
    };
    const onPageHide = () => trigger();

    const isTouch =
      window.matchMedia("(max-width: 767px)").matches || "ontouchstart" in window;

    function cleanup() {
      document.removeEventListener("mouseout", onMouseOut);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pagehide", onPageHide);
      io?.disconnect();
    }

    if (isTouch) {
      document.addEventListener("visibilitychange", onVisibility);
      window.addEventListener("pagehide", onPageHide);
    } else {
      document.addEventListener("mouseout", onMouseOut);
    }
    return cleanup;
  }, []);

  // Focus the close button + support Escape when the popup opens.
  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  async function submit() {
    if (nameError || phoneError) {
      setShowErrors(true);
      setError("נא למלא שם וטלפון תקין.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const r = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          email: "",
          tag: "Workshop_Waitlist",
          source: "exit_popup",
        }),
      });
      if (!r.ok) throw new Error(`waitlist failed (${r.status})`);
      setSubmitted(true);
    } catch (err) {
      console.error("[exit-popup] submit failed:", err);
      setError("אירעה שגיאה. נסה שוב בעוד רגע.");
      setSubmitting(false);
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="exit-title"
          dir="rtl"
        >
          {/* Backdrop */}
          <button
            aria-label="סגירה"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-night/80 backdrop-blur-sm"
          />

          {/* Card */}
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-md overflow-hidden rounded-2xl border border-drift/20 bg-ateneo/25 p-7 text-center shadow-card sm:p-8"
          >
            <button
              ref={closeRef}
              onClick={() => setOpen(false)}
              aria-label="סגירה"
              className="focus-ring absolute left-3 top-3 rounded-full p-2 text-drift transition-colors hover:text-cloud"
            >
              <X className="h-5 w-5" strokeWidth={2.2} aria-hidden="true" />
            </button>

            {submitted ? (
              <div className="py-6">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-400/15">
                  <CheckCircle2 className="h-9 w-9 text-emerald-400" strokeWidth={2} aria-hidden="true" />
                </div>
                <p className="mt-5 text-2xl font-extrabold tracking-tight text-cloud">
                  הפרטים נשמרו בהצלחה!
                </p>
                <p className="mt-2 text-lg leading-relaxed text-drift">
                  ניצור איתך קשר בהקדם.
                </p>
                <button
                  onClick={() => setOpen(false)}
                  className="focus-ring mt-6 w-full rounded-full bg-gold px-6 py-3.5 text-lg font-bold text-night shadow-cta transition-colors hover:bg-[#ffca82]"
                >
                  סגירה
                </button>
              </div>
            ) : (
              <>
                <h2
                  id="exit-title"
                  className="text-2xl font-extrabold tracking-tight text-cloud sm:text-3xl"
                >
                  מתלבט אם זה מתאים לך? בוא נדבר
                </h2>
                <p className="mx-auto mt-3 max-w-sm text-base leading-relaxed text-drift sm:text-lg">
                  השאר פרטים ונחזור אליך כדי לענות על כל השאלות ולוודא שהסדנה מדויקת עבורך.
                </p>

                <div className="mt-6 space-y-3.5 text-right">
                  <Field
                    id="exit-name"
                    label="שם מלא"
                    value={name}
                    onChange={setName}
                    autoComplete="name"
                    placeholder="ישראל ישראלי"
                    error={showErrors ? nameError : undefined}
                  />
                  <Field
                    id="exit-phone"
                    label="טלפון"
                    type="tel"
                    inputMode="tel"
                    dir="ltr"
                    value={phone}
                    onChange={setPhone}
                    autoComplete="tel"
                    placeholder="050 000 0000"
                    error={showErrors ? phoneError : undefined}
                  />
                </div>

                <button
                  onClick={submit}
                  disabled={submitting}
                  className="focus-ring mt-5 w-full rounded-full bg-gold px-6 py-4 text-lg font-bold text-night shadow-cta transition-colors hover:bg-[#ffca82] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {submitting ? "שולח…" : "רוצה שיחזרו אליי"}
                </button>

                {error && (
                  <p
                    role="alert"
                    className="mt-3 flex items-center justify-center gap-2 rounded-lg border border-coral/40 bg-coral/10 px-4 py-2.5 text-base font-semibold text-coral"
                  >
                    <AlertCircle className="h-4 w-4 shrink-0" strokeWidth={2.2} aria-hidden="true" />
                    {error}
                  </p>
                )}
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
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
      <label htmlFor={id} className="mb-1.5 block text-base font-semibold text-cloud">
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
        className={`focus-ring w-full rounded-xl border bg-night/60 px-4 py-3 text-lg text-cloud placeholder:text-drift/40 transition-colors ${
          invalid ? "border-coral" : "border-drift/20 hover:border-drift/35"
        }`}
      />
      {invalid && (
        <p id={`${id}-error`} className="mt-1.5 text-sm font-semibold text-coral">
          {error}
        </p>
      )}
    </div>
  );
}

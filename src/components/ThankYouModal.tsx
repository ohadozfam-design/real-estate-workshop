import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, CalendarDays } from "lucide-react";
import { SITE } from "../lib/site";

type Props = { open: boolean; onClose: () => void };

export default function ThankYouModal({ open, onClose }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    closeRef.current?.focus();
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center px-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* backdrop */}
          <div
            className="absolute inset-0 bg-night/80 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* dialog */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="thankyou-title"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300, damping: 26 }}
            className="relative w-full max-w-md rounded-2xl border border-drift/15 bg-night p-8 text-center shadow-card sm:p-10"
          >
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gold/15">
              <CheckCircle2 className="h-9 w-9 text-gold" strokeWidth={2} aria-hidden="true" />
            </div>

            <h2
              id="thankyou-title"
              className="mt-5 text-3xl font-extrabold tracking-tight text-cloud"
            >
              הרשמתך לוורקשופ אושרה בהצלחה!
            </h2>

            <p className="mt-3 text-lg leading-relaxed text-drift">
              שלחנו אליך למייל את כל פרטי ההתחברות, התאריכים והקישור לזום.
            </p>

            {/* Event summary */}
            <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 rounded-xl border border-gold/30 bg-gold/10 px-5 py-3 text-lg font-bold text-gold">
              <CalendarDays className="h-5 w-5" strokeWidth={2.2} aria-hidden="true" />
              <span className="ltr-nums">{SITE.eventDates}</span>
              <span className="text-gold/50" aria-hidden="true">|</span>
              <span>
                <span className="ltr-nums">18:00</span> עד <span className="ltr-nums">20:00</span>
              </span>
            </div>

            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              className="focus-ring mt-8 w-full rounded-full bg-gold px-6 py-4 text-lg font-bold text-night shadow-cta transition-colors hover:bg-[#ffca82]"
            >
              מעולה, סגירה
            </button>

            <p className="mt-4 text-base text-drift">
              לא קיבלת מייל? בדוק גם בתיקיית הספאם, או פנה אלינו.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

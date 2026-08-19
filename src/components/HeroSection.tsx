import { motion } from "framer-motion";
import { Check, Radio } from "lucide-react";
import CtaButton from "./ui/CtaButton";
import { SITE, scrollToCheckout } from "../lib/site";

const bullets = [
  "מנתחים עסקאות אמיתיות בזמן אמת.",
  "מקבלים תסריטים מוכנים באנגלית מול סוכנים.",
  "יוצאים עם הצעה מוכנה להגשה.",
];

const stats = [
  { value: "יומיים", label: "שעתיים בכל יום" },
  { value: "בזום", label: "שידור חי" },
  { value: "מוגבל", label: "מספר מקומות" },
];

export default function HeroSection() {
  return (
    <section
      className="relative overflow-hidden px-5 pb-20 pt-10 sm:pt-16 lg:pb-28"
      aria-labelledby="hero-heading"
    >
      <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
        {/* ---- Copy column ---- */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center lg:text-right"
        >
          {/* Understated editorial pill — subtle border, quiet warm dot */}
          <div className="inline-flex items-center gap-2.5 rounded-full border border-drift/20 bg-cloud/[0.03] px-3.5 py-1.5 text-[13px] font-semibold text-drift lg:mx-0">
            <span className="h-1.5 w-1.5 rounded-full bg-gold" aria-hidden="true" />
            לייב בזום · יומיים מרוכזים, {SITE.eventDates}
          </div>

          <h1
            id="hero-heading"
            className="mt-7 text-balance font-extrabold leading-[1.04] tracking-tight text-cloud text-[clamp(2.3rem,6vw,4.4rem)]"
          >
            לאתר, לנתח ולהגיש את ההצעה הראשונה שלך על נכס בארה״ב{" "}
            <span className="text-gold">תוך 4 שעות לייב</span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-balance text-lg leading-relaxed text-drift lg:mx-0">
            בלי לשלם שקל על תוכנות ניתוח יקרות, בלי תיאוריות מיותרות ובלי להישמע
            חובבן מול סוכני שטח מקומיים.
          </p>

          {/* bullets — a clean hairline-separated list, not icon cards */}
          <ul className="mx-auto mt-8 max-w-xl divide-y divide-drift/10 border-y border-drift/10 lg:mx-0">
            {bullets.map((b) => (
              <li key={b} className="flex items-center gap-3 py-3.5 text-start">
                <Check className="h-[18px] w-[18px] shrink-0 text-gold" strokeWidth={2.6} aria-hidden="true" />
                <span className="text-[15px] font-semibold text-cloud sm:text-base">{b}</span>
              </li>
            ))}
          </ul>

          <div className="mx-auto mt-9 max-w-md lg:mx-0">
            <CtaButton onClick={scrollToCheckout}>
              שריין את המקום שלי בסדנה במחיר <span className="ltr-nums">$97</span> בלבד
            </CtaButton>
            <p className="mt-3.5 text-sm text-drift">
              🔒 100% אחריות להחזר כספי מלא בסיום הסדנה ללא שאלות.
            </p>
          </div>
        </motion.div>

        {/* ---- Event card (minimal, hairline, no glow) ---- */}
        <motion.aside
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto w-full max-w-md"
          aria-label="סיכום האירוע"
        >
          <div className="overflow-hidden rounded-2xl border border-drift/15 bg-cloud/[0.02] shadow-card">
            {/* header */}
            <div className="flex items-center justify-between border-b border-drift/10 px-5 py-3.5">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-drift">Live Workshop</span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-coral/15 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-coral">
                <Radio className="h-3.5 w-3.5" strokeWidth={2.4} aria-hidden="true" /> Live
              </span>
            </div>

            {/* stage */}
            <div className="border-b border-drift/10 px-6 py-10 text-center">
              <p className="text-2xl font-extrabold tracking-tight text-cloud">
                ניתוח עסקה חיה על המסך
              </p>
              <p className="mt-2 text-sm text-drift">שידור אינטראקטיבי · סשן שאלות ותשובות פתוח</p>
            </div>

            {/* stats — editorial 3-up separated by hairlines (no icon circles) */}
            <div className="grid grid-cols-3 divide-x divide-drift/10 [direction:ltr]">
              {stats.map((s) => (
                <div key={s.label} className="px-3 py-4 text-center [direction:rtl]">
                  <div className="text-base font-extrabold text-cloud">{s.value}</div>
                  <div className="mt-0.5 text-[11px] uppercase tracking-wide text-drift">{s.label}</div>
                </div>
              ))}
            </div>

            {/* date + price */}
            <div className="flex items-center justify-between gap-3 border-t border-drift/10 bg-cloud/[0.02] px-5 py-4">
              <span className="text-sm font-semibold text-drift">
                📅 {SITE.eventDates} · שעתיים בכל יום
              </span>
              <span className="shrink-0 text-right leading-none">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-drift">רק</span>
                <span className="ltr-nums text-2xl font-extrabold text-gold">$97</span>
              </span>
            </div>
          </div>
        </motion.aside>
      </div>
    </section>
  );
}

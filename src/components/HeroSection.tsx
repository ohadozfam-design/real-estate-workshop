import { motion } from "framer-motion";
import { CheckCircle2, CalendarDays } from "lucide-react";
import CtaButton from "./ui/CtaButton";
import { scrollToCheckout } from "../lib/site";

const bullets = [
  "תנתח עסקאות אמיתיות בזמן אמת.",
  "תקבל תסריטים מוכנים באנגלית מול סוכנים.",
  "תחשב MAO ורווח צפוי ישירות בשטח.",
];

// Staggered entrance: badge, H1, subheadline, and CTA fade in + slide up on load.
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export default function HeroSection() {
  return (
    <section
      className="relative overflow-hidden px-5 pb-20 pt-12 sm:pt-20 lg:pb-28"
      aria-labelledby="hero-heading"
    >
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="mx-auto flex max-w-3xl flex-col items-center text-center"
      >
        {/* Badge */}
        <motion.div
          variants={item}
          className="inline-flex items-center gap-2.5 rounded-full border border-drift/20 bg-cloud/[0.03] px-4 py-2 text-base font-semibold text-drift"
        >
          <span className="relative flex h-2.5 w-2.5" aria-hidden="true">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
          </span>
          וורקשופ אונליין · יומיים · 4 שעות
        </motion.div>

        {/* Centered headline */}
        <motion.h1
          variants={item}
          id="hero-heading"
          className="mx-auto mt-7 max-w-4xl text-balance text-center font-extrabold leading-[1.03] tracking-tight text-cloud text-[clamp(2.4rem,6.4vw,4.8rem)]"
        >
          <span className="text-gold">תוך 4 שעות בלייב</span>{" "}
          תגיש את ההצעה הראשונה שלך על נכס בארה״ב בהתחייבות
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          variants={item}
          className="mx-auto mt-6 max-w-2xl text-balance text-xl leading-relaxed text-drift sm:text-2xl"
        >
          בלי לשלם שקל על תוכנות ניתוח יקרות, בלי תיאוריות מיותרות ובלי להישמע
          חובבן מול סוכני שטח מקומיים.
        </motion.p>

        {/* Bullets - centered row */}
        <motion.ul
          variants={item}
          className="mx-auto mt-9 flex w-full max-w-3xl flex-col items-stretch gap-3 sm:flex-row sm:justify-center"
        >
          {bullets.map((b) => (
            <li
              key={b}
              className="flex items-center justify-center gap-3 rounded-xl border border-drift/12 bg-cloud/[0.02] px-4 py-4 text-lg font-semibold text-cloud sm:flex-1"
            >
              <CheckCircle2
                className="h-8 w-8 shrink-0 text-emerald-400"
                strokeWidth={2.4}
                aria-hidden="true"
              />
              {b}
            </li>
          ))}
        </motion.ul>

        {/* Prominent dates + hours */}
        <motion.div
          variants={item}
          className="mx-auto mt-9 flex flex-col items-center gap-1.5 rounded-2xl border border-gold/40 bg-gold/10 px-6 py-4 sm:flex-row sm:gap-3"
        >
          <span className="inline-flex items-center gap-2.5">
            <CalendarDays className="h-6 w-6 shrink-0 text-gold" strokeWidth={2.2} aria-hidden="true" />
            <span className="ltr-nums text-2xl font-extrabold text-gold sm:text-3xl">
              26 &amp; 24 באוגוסט
            </span>
          </span>
          <span className="hidden text-gold/40 sm:block" aria-hidden="true">
            |
          </span>
          <span className="text-lg font-bold text-cloud sm:text-xl">
            <span className="ltr-nums">18:00</span> עד <span className="ltr-nums">20:00</span>
          </span>
          <span className="text-base font-semibold text-drift">(שעון ישראל)</span>
        </motion.div>

        {/* CTA */}
        <motion.div variants={item} className="mx-auto mt-8 w-full max-w-md">
          <CtaButton onClick={scrollToCheckout}>
            שריין את המקום שלי בוורקשופ במחיר <span className="ltr-nums">$97</span> בלבד
          </CtaButton>
          <p className="mt-4 text-lg text-drift">
            🔒 100% אחריות להחזר כספי מלא בסיום הוורקשופ ללא שאלות.
          </p>
          <p className="mt-2 text-base font-semibold text-coral">
            המקומות מוגבלים כדי לשמור על סשן שאלות ותשובות אישי בלייב.
          </p>
        </motion.div>
      </motion.div>

      {/* Relocated outcome statement - prominent, no label, no icon */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto mt-16 max-w-4xl rounded-3xl bg-gold px-6 py-11 text-center text-night sm:px-12"
      >
        <h2 className="font-extrabold tracking-tight text-[clamp(1.9rem,4.5vw,3rem)] md:whitespace-nowrap">
          תצא עם הצעה אמיתית, מוכנה להגשה
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-xl font-semibold leading-relaxed text-night/85">
          על נכס אמיתי מתחת למחיר השוק, עם המספרים והתסריטים שמאחוריה.
        </p>
      </motion.div>
    </section>
  );
}

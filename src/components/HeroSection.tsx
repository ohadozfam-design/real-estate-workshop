import { motion } from "framer-motion";
import { CheckCircle2, ShieldCheck, Radio, Users, Clock, Video, CalendarDays } from "lucide-react";
import CtaButton from "./ui/CtaButton";
import { SITE, scrollToCheckout } from "../lib/site";

const bullets = [
  "מנתחים עסקאות אמיתיות בזמן אמת.",
  "מקבלים תסריטים מוכנים באנגלית מול סוכנים.",
  "יוצאים עם הצעה מוכנה להגשה.",
];

export default function HeroSection() {
  return (
    <section
      className="relative overflow-hidden px-4 pb-16 pt-8 sm:pt-12 lg:pb-24"
      aria-labelledby="hero-heading"
    >
      {/* ambient glow */}
      <div className="pointer-events-none absolute inset-x-0 -top-40 h-[520px] bg-radial-fade" aria-hidden="true" />

      <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
        {/* ---- Copy column ---- */}
        <div className="text-center lg:text-right">
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto inline-flex items-center gap-2 rounded-full border border-red-500/40 bg-red-500/10 px-4 py-1.5 text-sm font-semibold text-red-300 lg:mx-0"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
            </span>
            סדנת לייב אינטנסיבית בזום | מספר המקומות מוגבל
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            id="hero-heading"
            className="mt-6 text-balance text-3xl font-extrabold leading-[1.15] tracking-tight text-cloud-50 sm:text-4xl lg:text-5xl"
          >
            איך לאתר, לנתח ולהגיש את ההצעה הראשונה שלך על נכס בארה״ב{" "}
            <span className="gold-text">ב-4 שעות בלייב</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12 }}
            className="mx-auto mt-5 max-w-xl text-balance text-base leading-relaxed text-slate-300 sm:text-lg lg:mx-0"
          >
            בלי לשלם שקל על תוכנות ניתוח יקרות, בלי תיאוריות מיותרות ובלי להישמע
            חובבן מול סוכני שטח מקומיים.
          </motion.p>

          <motion.ul
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.1, delayChildren: 0.25 } } }}
            className="mx-auto mt-7 flex max-w-xl flex-col gap-3 lg:mx-0"
          >
            {bullets.map((b) => (
              <motion.li
                key={b}
                variants={{ hidden: { opacity: 0, x: 16 }, show: { opacity: 1, x: 0 } }}
                className="flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-900/50 px-4 py-3 text-start shadow-tactile"
              >
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" strokeWidth={2.2} aria-hidden="true" />
                <span className="text-sm font-semibold text-cloud-50 sm:text-[15px]">{b}</span>
              </motion.li>
            ))}
          </motion.ul>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mx-auto mt-8 max-w-md lg:mx-0"
          >
            <CtaButton onClick={scrollToCheckout}>
              שריין את המקום שלי בסדנה ב-<span className="ltr-nums">$97</span> בלבד
            </CtaButton>
            <p className="mt-3 flex items-center justify-center gap-2 text-sm text-slate-300 lg:justify-start">
              <ShieldCheck className="h-4 w-4 text-emerald-400" aria-hidden="true" />
              100% אחריות להחזר כספי מלא בסיום הסדנה ללא שאלות.
            </p>
          </motion.div>
        </div>

        {/* ---- Event media card ---- */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto w-full max-w-md"
        >
          <div className="animate-float-slow rounded-3xl border border-ink-500/70 bg-gradient-to-b from-ink-700 to-ink-800 p-2 shadow-card">
            {/* live preview mock */}
            <div className="relative overflow-hidden rounded-2xl border border-ink-500/60 bg-ink-900">
              <div className="flex items-center justify-between border-b border-ink-500/60 bg-ink-800/80 px-4 py-2.5">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-gold-500/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
                </div>
                <div className="flex items-center gap-1.5 rounded-full bg-red-500/15 px-2.5 py-1 text-xs font-bold text-red-300">
                  <Radio className="h-3.5 w-3.5" aria-hidden="true" /> LIVE
                </div>
              </div>

              {/* faux zoom stage */}
              <div className="relative aspect-video bg-gradient-to-br from-ink-800 via-ink-900 to-black">
                <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.08)_1px,transparent_1px)] [background-size:26px_26px]" />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gold-cta text-ink-900 shadow-gold-glow">
                    <Video className="h-8 w-8" strokeWidth={2.2} aria-hidden="true" />
                  </div>
                  <p className="text-sm font-bold text-cloud-50">ניתוח עסקה חיה על המסך</p>
                  <p className="text-xs text-slate-300">שידור אינטראקטיבי + שאלות ותשובות</p>
                </div>
                {/* participant tiles */}
                <div className="absolute bottom-3 left-3 right-3 grid grid-cols-4 gap-2">
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="flex h-9 items-center justify-center rounded-md border border-ink-500/60 bg-ink-800/80"
                    >
                      <Users className="h-4 w-4 text-slate-300" aria-hidden="true" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* summary strip */}
            <div className="grid grid-cols-3 gap-2 p-3">
              <Badge icon={<Clock className="h-4 w-4" aria-hidden="true" />} label="4 שעות" sub="עבודה מעשית" />
              <Badge icon={<Video className="h-4 w-4" aria-hidden="true" />} label="בזום" sub="שידור חי" />
              <Badge icon={<Users className="h-4 w-4" aria-hidden="true" />} label="מקומות" sub="מוגבלים" />
            </div>

            <div className="mx-3 mb-3 flex items-center justify-center gap-2 rounded-xl border border-gold-500/25 bg-gold-500/[0.08] px-4 py-2.5 text-center text-sm font-semibold text-gold-400 shadow-tactile">
              <CalendarDays className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden="true" />
              <span>
                {SITE.eventDatePlaceholder} · {SITE.eventTimePlaceholder}
              </span>
            </div>
          </div>

          {/* price sticker */}
          <motion.div
            initial={{ opacity: 0, rotate: -8, scale: 0.6 }}
            animate={{ opacity: 1, rotate: -10, scale: 1 }}
            transition={{ delay: 0.6, type: "spring", stiffness: 260, damping: 14 }}
            className="absolute -top-5 -left-4 flex h-20 w-20 flex-col items-center justify-center rounded-full border-2 border-ink-900 bg-gold-cta text-ink-900 shadow-gold-glow sm:-left-6 sm:h-24 sm:w-24"
          >
            <span className="text-[10px] font-bold leading-none">רק</span>
            <span className="ltr-nums text-2xl font-extrabold leading-none sm:text-3xl">$97</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function Badge({ icon, label, sub }: { icon: React.ReactNode; label: string; sub: string }) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-xl border border-ink-500/50 bg-ink-800/60 py-2.5">
      <span className="text-gold-400">{icon}</span>
      <span className="text-xs font-bold text-cloud-50">{label}</span>
      <span className="text-[10px] text-slate-300">{sub}</span>
    </div>
  );
}

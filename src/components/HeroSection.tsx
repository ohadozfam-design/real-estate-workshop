import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, CalendarDays } from "lucide-react";
import CtaButton from "./ui/CtaButton";
import { scrollToCheckout } from "../lib/site";

const bullets = [
  "תדע איך ליצור קשר עם בעלי מקצוע שישלחו לך עסקאות טובות בכל חודש.",
  "תנתח עסקה בפחות מ5 דקות, ותציע לפחות 5 הצעות נכונות ביום",
  "תחזיק במערכת עבודה מסודרת שמייצרת ומגישה הצעות מחיר באופן עקבי בכל שבוע",
  "תרכוש מהר את האמון של הסוכנים ובעלי המקצוע כך שירצו לעבוד איתך",
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
  const videoRef = useRef<HTMLVideoElement>(null);
  const [enlarged, setEnlarged] = useState(false);

  useEffect(() => {
    // Autoplay muted on load (browsers block autoplay with sound), then enlarge
    // the player 2 seconds later to draw attention.
    const v = videoRef.current;
    if (v) {
      v.muted = true;
      v.play().catch(() => {
        /* autoplay may be blocked - controls/poster still available */
      });
    }
    const timer = window.setTimeout(() => setEnlarged(true), 2000);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <section
      className="relative overflow-hidden px-5 pb-20 pt-12 sm:pt-20 lg:pb-28"
      aria-labelledby="hero-heading"
    >
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="mx-auto flex max-w-5xl flex-col items-center text-center"
      >
        {/* Badge */}
        <motion.div
          variants={item}
          className="inline-flex items-center gap-2.5 rounded-full border border-drift/25 bg-cloud/[0.04] px-6 py-2.5 text-lg font-bold text-cloud"
        >
          <span className="relative flex h-2.5 w-2.5" aria-hidden="true">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
          </span>
          סדנה אונליין
        </motion.div>

        {/* Centered headline - stretches across the width on desktop */}
        <motion.h1
          variants={item}
          id="hero-heading"
          className="mx-auto mt-7 w-full max-w-5xl text-center font-extrabold leading-[1.05] tracking-tight text-cloud text-4xl sm:text-5xl lg:text-6xl"
        >
          <span className="text-gold">ב-4 שעות בלייב</span>, נקים מנוע עסקאות שיסגור
          לך 2 עסקאות בחודש
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          variants={item}
          className="mx-auto mt-6 max-w-2xl text-balance text-xl leading-relaxed text-drift sm:text-2xl"
        >
          בלי לנחש מספרים, בלי להסתמך על מזל ובלי להתפזר. שיטת עבודה של יזמים
          מקצועיים שמאתרת נכסים מתחת למחיר השוק ומייצרת זרם הצעות קבוע על השולחן.
        </motion.p>

        {/* VSL video - autoplays muted on load, then enlarges after 2s */}
        <motion.div
          variants={item}
          className={`mx-auto mt-9 w-full overflow-hidden rounded-2xl border border-drift/20 bg-night shadow-card transition-[max-width] duration-700 ease-out ${
            enlarged ? "max-w-5xl" : "max-w-3xl"
          }`}
        >
          <video
            ref={videoRef}
            className="aspect-video h-full w-full"
            controls
            autoPlay
            muted
            playsInline
            preload="auto"
            poster="/vsl/0826-poster.jpg"
          >
            <source src="/vsl/0826.mp4" type="video/mp4" />
            הדפדפן שלך אינו תומך בהצגת וידאו.
          </video>
        </motion.div>

        {/* Bullets - 2-column grid, top-aligned for longer lines */}
        <motion.ul
          variants={item}
          className="mx-auto mt-9 grid w-full max-w-3xl grid-cols-1 gap-3 sm:grid-cols-2"
        >
          {bullets.map((b) => (
            <li
              key={b}
              className="flex items-start gap-3 rounded-xl border border-drift/12 bg-cloud/[0.02] px-4 py-4 text-right text-lg font-semibold leading-relaxed text-cloud"
            >
              <CheckCircle2
                className="mt-0.5 h-7 w-7 shrink-0 text-emerald-400"
                strokeWidth={2.4}
                aria-hidden="true"
              />
              <span>{b}</span>
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
            <span className="text-2xl font-extrabold text-gold sm:text-3xl">
              2 &amp; 3 בספטמבר
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
            שריין את המקום שלי בסדנה במחיר <span className="ltr-nums">$97</span> בלבד
          </CtaButton>
          <p className="mt-4 text-lg text-drift">
            🔒 100% אחריות להחזר כספי מלא בסיום הסדנה ללא שאלות.
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
          תיכנס ללפחות 2 חוזים בכל חודש
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-xl font-semibold leading-relaxed text-night/85">
          כך שתוכל לקנות ולמכור נכסים טובים ולהרוויח כסף כבר עכשיו
        </p>
      </motion.div>
    </section>
  );
}

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn } from "lucide-react";
import Reveal from "./ui/Reveal";

type Shot = { src: string; alt: string };

const shots: Shot[] = [
  {
    src: "/case-studies/case-1.jpg",
    alt: "הודעת בוגר בוואטסאפ: סדנה של 400 דולר פלוס, היה מטורף",
  },
  {
    src: "/case-studies/case-2.png",
    alt: "הודעת בוגר בוואטסאפ: עזר לי מאוד עם הבעיה הכי גדולה ופתח לי את הראש",
  },
  {
    src: "/case-studies/case-3.jpg",
    alt: "הודעת בוגר בוואטסאפ: אחלה חשיפה, למדתי כמה דברים חדשים",
  },
];

export default function CaseStudies() {
  const [open, setOpen] = useState<number | null>(null);

  // Close the lightbox on Escape.
  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <section className="px-5 py-20 lg:py-28" aria-labelledby="cases-heading">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <div className="text-center">
            <span className="eyebrow">עדויות מהשטח</span>
            <h2
              id="cases-heading"
              className="mx-auto mt-5 max-w-3xl text-balance font-extrabold tracking-tight text-cloud text-[clamp(2rem,4.8vw,3.3rem)]"
            >
              מה כותבים בוגרי הסדנה הקודמת
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-drift sm:text-xl">
              הודעות אמת שקיבלנו מתלמידים אחרי הסדנה. לחצו על תמונה כדי להגדיל.
            </p>
          </div>
        </Reveal>

        {/* Masonry columns keep each screenshot's natural aspect ratio + legibility */}
        <div className="mt-12 gap-4 [column-fill:_balance] sm:columns-2">
          {shots.map((s, i) => (
            <Reveal key={s.src} delay={i * 0.06}>
              <button
                type="button"
                onClick={() => setOpen(i)}
                aria-label="הגדל את התמונה"
                className="focus-ring group mb-4 block w-full break-inside-avoid overflow-hidden rounded-2xl border border-drift/15 bg-cloud/[0.02] transition-colors duration-300 hover:border-gold/35"
              >
                <span className="relative block">
                  <img
                    src={s.src}
                    alt={s.alt}
                    loading="lazy"
                    decoding="async"
                    className="w-full"
                  />
                  <span className="pointer-events-none absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-night/70 px-3 py-1.5 text-sm font-semibold text-cloud opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
                    <ZoomIn className="h-4 w-4" strokeWidth={2.2} aria-hidden="true" /> הגדל
                  </span>
                </span>
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {open !== null && (
          <motion.div
            className="fixed inset-0 z-[70] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-label="תצוגת תמונה מוגדלת"
            onClick={() => setOpen(null)}
          >
            <div className="absolute inset-0 bg-night/85 backdrop-blur-sm" />
            <button
              type="button"
              onClick={() => setOpen(null)}
              aria-label="סגירה"
              className="focus-ring absolute right-4 top-4 z-10 rounded-full bg-cloud/10 p-2.5 text-cloud transition-colors hover:bg-cloud/20"
            >
              <X className="h-6 w-6" strokeWidth={2.2} aria-hidden="true" />
            </button>
            <motion.img
              key={shots[open].src}
              src={shots[open].src}
              alt={shots[open].alt}
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-h-[88vh] max-w-[92vw] rounded-xl border border-drift/20 object-contain shadow-card"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

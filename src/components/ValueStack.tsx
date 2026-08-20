import Reveal from "./ui/Reveal";
import { PRICING } from "../lib/site";

const bonuses = [
  {
    n: 1,
    name: "מחשבון הניתוח המהיר",
    en: "The 5-Minute Deal Analyzer Sheet",
    desc: "קובץ מוכן לקבלת מחיר הצעה מקסימלי ורווחיות מתוך 4 נתונים.",
    value: 297,
  },
  {
    n: 2,
    name: "תסריטי שיחה ומיילים מול סוכנים",
    en: "The Investor Authority Scripts",
    desc: "הקובץ המלא, מוכן להעתקה מילה במילה, לשיחות ולמיילים מול סוכנים.",
    value: 197,
  },
  {
    n: 3,
    name: "צ'קליסט תמחור שיפוץ מהיר",
    en: "The Fast Rehab Estimator Cheat-Sheet",
    desc: "טבלת אצבע להערכת שיפוץ בשטח.",
    value: 197,
  },
  {
    n: 4,
    name: "מדד איתור וניתוח שווקים צומחים",
    en: "The Top-Market Scorecard",
    desc: "כלי עזר לבחירת שוק מנצח בארה״ב.",
    value: 197,
  },
];

export default function ValueStack() {
  return (
    <section className="px-5 py-20 lg:py-28" aria-labelledby="value-heading">
      <div className="mx-auto max-w-4xl">
        <Reveal>
          <div className="text-center">
            <span className="eyebrow">הבונוסים</span>
            <h2
              id="value-heading"
              className="mt-5 font-extrabold tracking-tight text-cloud text-[clamp(2.25rem,5.6vw,3.8rem)]"
            >
              עוד נכסים שנשארים איתך
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-drift sm:text-xl">
              4 כלים חובה לכל יזם נדל״ן שפיתחנו באקדמיית K2 שחוסכים זמן, מגדילים
              וודאות ושורת רווח.
            </p>
          </div>
        </Reveal>

        {/* Distinct value cards with prominent monetary tags */}
        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {bonuses.map((b, i) => (
            <Reveal key={b.n} delay={i * 0.06}>
              <div className="flex h-full flex-col rounded-2xl border border-drift/15 bg-cloud/[0.02] p-6 transition-colors duration-300 hover:border-gold/35">
                <div className="flex items-center justify-between gap-3">
                  <span className="ltr-nums text-sm font-bold uppercase tracking-[0.16em] text-drift">
                    בונוס {String(b.n).padStart(2, "0")}
                  </span>
                  <span className="ltr-nums rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-base font-extrabold text-gold">
                    שווי ${b.value}
                  </span>
                </div>
                <h3 className="mt-4 text-xl font-bold tracking-tight text-cloud">{b.name}</h3>
                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-gold/70">
                  {b.en}
                </p>
                <p className="mt-3 text-xl leading-relaxed text-drift">{b.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Social-proof headline bridging the bonus list and the value stack */}
        <Reveal delay={0.08}>
          <p className="mx-auto mt-12 max-w-3xl text-center text-xl font-bold leading-relaxed text-cloud md:text-2xl">
            תלמידי הליווי שלנו משתמשים בכלים האלה יום יום וככה הם מגדילים פי 3 את
            כמות ההצעות שהם מציעים ומביאים עסקאות מליגה אחרת.
          </p>
        </Reveal>

        {/* Summary */}
        <Reveal delay={0.1}>
          <div className="mx-auto mt-6 max-w-2xl rounded-2xl border border-gold/25 bg-cloud/[0.03] p-6 sm:p-8">
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold text-drift sm:text-xl">סה״כ שווי כולל</span>
              <span className="ltr-nums text-3xl font-extrabold text-drift line-through decoration-coral/80 decoration-2 sm:text-4xl">
                ${PRICING.totalStackValue}
              </span>
            </div>
            <div className="my-5 hairline" />
            <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
              <span className="text-xl font-extrabold tracking-tight text-cloud sm:text-xl">
                מחיר הצטרפות היום
              </span>
              <span className="inline-flex items-baseline gap-2">
                <span className="ltr-nums text-5xl font-extrabold tracking-tight text-gold sm:text-6xl">
                  $97
                </span>
                <span className="text-lg font-bold text-drift">בלבד</span>
              </span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

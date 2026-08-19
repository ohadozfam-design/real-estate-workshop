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
    desc: "טמפלייטים מילה במילה באנגלית לשיחה והתכתבות מול סוכנים.",
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
    <section className="px-5 py-16 lg:py-24" aria-labelledby="value-heading">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <div className="text-center">
            <span className="eyebrow">מה מקבלים</span>
            <h2
              id="value-heading"
              className="mt-5 font-extrabold tracking-tight text-cloud text-[clamp(2rem,5vw,3.25rem)]"
            >
              כל הבונוסים שנכנסים לסדנה
            </h2>
          </div>
        </Reveal>

        <Reveal delay={0.06}>
          <div className="mt-12 overflow-hidden rounded-2xl border border-drift/15">
            <ul className="divide-y divide-drift/12">
              {bonuses.map((b) => (
                <li
                  key={b.n}
                  className="flex items-start gap-4 p-5 transition-colors duration-300 hover:bg-cloud/[0.02] sm:gap-5 sm:p-6"
                >
                  <span className="ltr-nums mt-0.5 shrink-0 text-lg font-extrabold text-gold">
                    {String(b.n).padStart(2, "0")}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-[15px] font-bold tracking-tight text-cloud sm:text-base">
                      {b.name}
                    </h3>
                    <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-gold/80">
                      {b.en}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-drift">{b.desc}</p>
                  </div>
                  <div className="shrink-0 whitespace-nowrap text-left text-sm text-drift">
                    שווי{" "}
                    <span className="ltr-nums font-bold text-cloud">${b.value}</span>
                  </div>
                </li>
              ))}
            </ul>

            {/* Summary */}
            <div className="border-t border-drift/15 bg-cloud/[0.03] p-6 sm:p-8">
              <div className="flex items-center justify-between">
                <span className="text-base font-semibold text-drift sm:text-lg">סה״כ שווי כולל</span>
                <span className="ltr-nums text-2xl font-extrabold text-drift line-through decoration-coral/80 decoration-2 sm:text-3xl">
                  ${PRICING.totalStackValue}
                </span>
              </div>
              <div className="my-5 hairline" />
              <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
                <span className="text-lg font-extrabold tracking-tight text-cloud sm:text-xl">
                  מחיר הצטרפות היום
                </span>
                <span className="inline-flex items-baseline gap-2">
                  <span className="ltr-nums text-4xl font-extrabold tracking-tight text-gold sm:text-5xl">
                    $97
                  </span>
                  <span className="text-base font-bold text-drift">בלבד</span>
                </span>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

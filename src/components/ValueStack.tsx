import { Gift, ArrowLeft } from "lucide-react";
import Reveal from "./ui/Reveal";
import { PRICING } from "../lib/site";

const bonuses = [
  {
    n: 1,
    name: "מחשבון הניתוח המהיר",
    en: "The 5-Minute Deal Analyzer Sheet",
    desc: "קובץ מוכן לקבלת מחיר הצעה מקסימלי ורווחיות ב-4 נתונים.",
    value: 297,
  },
  {
    n: 2,
    name: "תסריטי שיחה ומיילים מול סוכנים",
    en: "The Investor Authority Scripts",
    desc: "טמפלייטים מילה-במילה באנגלית לשיחה והתכתבות מול סוכנים.",
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
    <section className="px-4 py-16 lg:py-24" aria-labelledby="value-heading">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <div className="text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/[0.07] px-4 py-1.5 text-xs font-bold tracking-[0.15em] text-amber-400">
              מה בדיוק מקבלים
            </span>
            <h2
              id="value-heading"
              className="mt-5 text-3xl font-extrabold tracking-tight text-cloud-50 sm:text-4xl"
            >
              כל הבונוסים שנכנסים לסדנה
            </h2>
          </div>
        </Reveal>

        <div className="mt-12 overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/70 shadow-tactile-lg backdrop-blur-md">
          <ul className="divide-y divide-slate-800/80">
            {bonuses.map((b, i) => (
              <Reveal key={b.n} delay={i * 0.07}>
                <li className="flex items-start gap-4 p-5 transition-colors duration-300 hover:bg-amber-500/[0.03] sm:p-6">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-500/[0.08] text-amber-400 shadow-[0_0_20px_-8px_rgba(245,158,11,0.5)] ring-1 ring-inset ring-amber-500/25">
                    <Gift className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-[15px] font-bold tracking-tight text-cloud-50 sm:text-base">
                      בונוס {b.n}: {b.name}
                    </h3>
                    <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-amber-400/70">
                      {b.en}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-slate-300">{b.desc}</p>
                  </div>
                  <div className="shrink-0 text-left">
                    <span className="rounded-lg border border-slate-800 bg-ink-900/70 px-2.5 py-1 text-sm font-bold text-cloud-50 shadow-tactile">
                      <span className="text-slate-300">שווי: </span>
                      <span className="ltr-nums">${b.value}</span>
                    </span>
                  </div>
                </li>
              </Reveal>
            ))}
          </ul>

          {/* value summary */}
          <Reveal>
            <div className="border-t border-slate-800 bg-ink-900/50 p-6 sm:p-8">
              <div className="flex items-center justify-between">
                <span className="text-base font-semibold text-slate-300 sm:text-lg">
                  סה״כ שווי כולל
                </span>
                <span className="ltr-nums text-2xl font-extrabold text-slate-300 line-through decoration-red-500/70 decoration-2 sm:text-3xl">
                  ${PRICING.totalStackValue}
                </span>
              </div>
              <div className="my-4 h-px hairline" />
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <span className="text-lg font-extrabold text-cloud-50 sm:text-xl">
                  מחיר הצטרפות היום
                </span>
                <div className="flex items-center gap-3">
                  <ArrowLeft className="hidden h-6 w-6 text-emerald-400 sm:block" aria-hidden="true" />
                  <span className="inline-flex items-baseline gap-2 rounded-2xl bg-emerald-500/[0.1] px-5 py-2.5 shadow-tactile ring-1 ring-inset ring-emerald-500/40">
                    <span className="ltr-nums text-4xl font-extrabold tracking-tight text-emerald-400 sm:text-5xl">
                      $97
                    </span>
                    <span className="text-base font-bold text-emerald-300/90">בלבד</span>
                  </span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

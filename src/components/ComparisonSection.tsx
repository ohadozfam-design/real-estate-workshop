import { CheckCircle2, XCircle } from "lucide-react";
import Reveal from "./ui/Reveal";

type Row = { topic: string; without: string; withEngine: string };

const rows: Row[] = [
  {
    topic: "זמן ניתוח עסקה",
    without: "שעות של בהייה בזילו ובאקסלים מסובכים",
    withEngine: "5 דקות בעזרת המחשבון המהיר",
  },
  {
    topic: "שיחות מול סוכנים",
    without: "שיחות מגומגמות שסוכנים מסננים",
    withEngine: "מעמד של יזם רציני עם תסריטי שיחה מוכחים",
  },
  {
    topic: "הגשת הצעות",
    without: "0-1 בחודש, מלווה בפחד לטעות",
    withEngine: "סיסטם שבועי קבוע של הגשת הצעות מדויקות",
  },
  {
    topic: "שליטה במספרים ושיפוץ",
    without: "ניחושים והערכות באוויר",
    withEngine: "צ'קליסט שיפוצים ונוסחת MAO נעולה",
  },
];

/**
 * "Without vs. with" the deal engine. Desktop: a 3-column table (topic /
 * without / with) whose "with" cells stack into one continuous, gold-bordered
 * elevated column. Mobile: each row becomes its own card - the row wrapper is
 * `md:contents`, so on desktop its cells drop straight into the grid.
 */
export default function ComparisonSection() {
  const last = rows.length - 1;
  return (
    <section className="px-5 py-16 md:py-24" aria-labelledby="compare-heading">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <div className="text-center">
            <span className="eyebrow">ההבדל</span>
            <h2
              id="compare-heading"
              className="mx-auto mt-5 max-w-3xl text-balance font-extrabold tracking-tight text-cloud text-[clamp(2rem,4.8vw,3.3rem)]"
            >
              הדרך המתישה מול מנוע העסקאות
            </h2>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="mt-12 space-y-4 md:grid md:grid-cols-[0.8fr_1fr_1.2fr] md:space-y-0 md:rounded-3xl md:border md:border-drift/15 md:bg-cloud/[0.02] md:p-3">
            {/* Column headers (desktop) */}
            <div className="hidden md:block" />
            <div className="hidden items-center gap-2 px-5 py-5 text-lg font-extrabold text-coral md:flex">
              <XCircle className="h-6 w-6 shrink-0" strokeWidth={2.2} aria-hidden="true" />
              הדרך המתישה
              <span className="text-sm font-semibold text-drift">(בלי מנגנון)</span>
            </div>
            <div className="hidden items-center gap-2 rounded-t-2xl border-x border-t border-gold/50 bg-gold/[0.08] px-5 py-5 text-lg font-extrabold text-gold md:flex">
              <CheckCircle2 className="h-6 w-6 shrink-0" strokeWidth={2.2} aria-hidden="true" />
              הדרך המקצועית
              <span className="text-sm font-semibold text-cloud/70">(עם מנגנון עסקאות)</span>
            </div>

            {rows.map((r, i) => (
              <div
                key={r.topic}
                className="rounded-2xl border border-drift/15 bg-cloud/[0.03] p-5 md:contents"
              >
                <div className="text-xl font-extrabold text-cloud md:flex md:items-center md:border-t md:border-drift/10 md:px-5 md:py-6 md:text-lg">
                  {r.topic}
                </div>

                <div className="mt-4 flex items-start gap-3 opacity-75 md:mt-0 md:border-t md:border-drift/10 md:px-5 md:py-6">
                  <XCircle className="mt-0.5 h-6 w-6 shrink-0 text-coral" strokeWidth={2.2} aria-hidden="true" />
                  <span className="text-lg leading-relaxed text-drift">
                    <span className="sr-only">בלי מנגנון: </span>
                    {r.without}
                  </span>
                </div>

                <div
                  className={`mt-3 flex items-start gap-3 rounded-xl border border-gold/40 bg-gold/[0.08] p-4 md:mt-0 md:rounded-none md:border-x md:border-y-0 md:border-gold/50 md:px-5 md:py-6 ${
                    i === last ? "md:rounded-b-2xl md:border-b" : ""
                  }`}
                >
                  <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-emerald-400" strokeWidth={2.4} aria-hidden="true" />
                  <span className="text-lg font-bold leading-relaxed text-cloud">
                    <span className="sr-only">עם מנגנון: </span>
                    {r.withEngine}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

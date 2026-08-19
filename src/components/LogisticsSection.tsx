import { ShieldCheck } from "lucide-react";
import Reveal from "./ui/Reveal";
import { SITE } from "../lib/site";

const cells = [
  {
    label: "מתי",
    body: `${SITE.eventDates} · ${SITE.eventFormat}`,
  },
  {
    label: "איפה",
    body: "שידור חי אינטראקטיבי בזום, כולל סשן שאלות ותשובות פתוח",
  },
  {
    label: "למי זה מתאים",
    body: "למשקיעים ויזמים (גם ללא ניסיון קודם) שרוצים להגיש הצעות מחיר בביטחון",
  },
  {
    label: "מה להכין",
    body: "מחשב נייד, מחברת וראש פתוח לפרקטיקה",
  },
];

export default function LogisticsSection() {
  return (
    <section className="px-5 py-20 lg:py-28" aria-label="פרטים לוגיסטיים ואחריות">
      <div className="mx-auto max-w-6xl">
        {/* Editorial detail table — hairline separators, no icon cards */}
        <Reveal>
          <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-drift/15 bg-drift/15 sm:grid-cols-2 lg:grid-cols-4">
            {cells.map((c) => (
              <div key={c.label} className="bg-night p-6 transition-colors duration-300 hover:bg-cloud/[0.02]">
                <div className="text-sm font-bold uppercase tracking-[0.18em] text-gold">
                  {c.label}
                </div>
                <p className="mt-3 text-lg leading-relaxed text-drift">{c.body}</p>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Guarantee band — a refined deep Ateneo surface that breaks the rhythm */}
        <Reveal delay={0.08}>
          <div className="mt-6 rounded-2xl border border-drift/15 bg-ateneo/25 p-8 sm:p-11">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
              <ShieldCheck
                className="mx-auto h-10 w-10 shrink-0 text-gold sm:mx-0"
                strokeWidth={1.6}
                aria-hidden="true"
              />
              <div className="text-center sm:text-right">
                <div className="text-sm font-bold uppercase tracking-[0.22em] text-gold">
                  No Questions Asked
                </div>
                <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-cloud sm:text-4xl">
                  אחריות 100% שביעות רצון
                </h2>
                <p className="mt-4 max-w-2xl text-lg leading-relaxed text-cloud/85 sm:text-lg">
                  „אם תשתתף בסדנה ותרגיש שלא קיבלת לפחות פי 10 מערך ההשקעה שלך, שלח
                  הודעה עד 24 שעות מסיום הסדנה וקבל בחזרה את מלוא הסכום ששילמת
                  (<span className="ltr-nums font-bold text-gold">$97</span>). כל המחשבונים
                  והתבניות נשארים אצלך.”
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

import { ShieldCheck } from "lucide-react";
import Reveal from "./ui/Reveal";
import { SITE } from "../lib/site";

const cells = [
  {
    label: "מתי",
    body: `${SITE.eventDatePlaceholder} · ${SITE.eventTimePlaceholder} · 4 שעות עבודה מעשית`,
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
    <section className="px-5 py-16 lg:py-24" aria-label="פרטים לוגיסטיים ואחריות">
      <div className="mx-auto max-w-6xl">
        {/* Editorial detail table — hairline separators, no icon cards */}
        <Reveal>
          <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-drift/15 bg-drift/15 sm:grid-cols-2 lg:grid-cols-4">
            {cells.map((c) => (
              <div key={c.label} className="bg-night p-6 transition-colors duration-300 hover:bg-cloud/[0.02]">
                <div className="text-xs font-bold uppercase tracking-[0.18em] text-gold">
                  {c.label}
                </div>
                <p className="mt-3 text-[15px] leading-relaxed text-drift">{c.body}</p>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Guarantee band — a solid Ateneo surface that breaks the rhythm */}
        <Reveal delay={0.08}>
          <div className="mt-6 rounded-2xl border border-gold/25 bg-ateneo p-8 sm:p-11">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
              <ShieldCheck
                className="mx-auto h-10 w-10 shrink-0 text-gold sm:mx-0"
                strokeWidth={1.6}
                aria-hidden="true"
              />
              <div className="text-center sm:text-right">
                <div className="text-xs font-bold uppercase tracking-[0.22em] text-gold">
                  No Questions Asked
                </div>
                <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-cloud sm:text-3xl">
                  אחריות 100% שביעות רצון
                </h2>
                <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-cloud/85 sm:text-base">
                  „אם תשתתף בסדנה ותרגיש שלא קיבלת לפחות פי 10 מערך ההשקעה שלך —
                  שלח הודעה עד 24 שעות מסיום הסדנה וקבל את כל ה-
                  <span className="ltr-nums font-bold text-gold">$97</span> בחזרה, וכל
                  המחשבונים והתבניות נשארים אצלך.”
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

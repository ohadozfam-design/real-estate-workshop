import { Calendar, MapPin, Target, Briefcase, ShieldCheck } from "lucide-react";
import Reveal from "./ui/Reveal";
import { SITE } from "../lib/site";

const cards = [
  {
    icon: Calendar,
    title: "מתי",
    body: `${SITE.eventDatePlaceholder} | ${SITE.eventTimePlaceholder} (4 שעות של עבודה מעשית)`,
  },
  {
    icon: MapPin,
    title: "איפה",
    body: "שידור חי אינטראקטיבי בזום (כולל סשן שאלות ותשובות פתוח)",
  },
  {
    icon: Target,
    title: "למי זה מתאים",
    body: "למשקיעים ויזמים (גם ללא ניסיון קודם) שרוצים להגיש הצעות מחיר בביטחון",
  },
  {
    icon: Briefcase,
    title: "מה להכין",
    body: "מחשב נייד, מחברת וראש פתוח לפרקטיקה",
  },
];

export default function LogisticsSection() {
  return (
    <section className="px-4 py-16 lg:py-24" aria-label="פרטים לוגיסטיים ואחריות">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {cards.map((c, i) => (
            <Reveal key={c.title} delay={i * 0.08}>
              <div className="group flex h-full items-start gap-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-tactile backdrop-blur-sm transition-all duration-300 hover:border-amber-500/40 hover:shadow-tactile-lg">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-500/[0.08] text-amber-400 ring-1 ring-inset ring-amber-500/25 transition-transform duration-300 group-hover:scale-105">
                  <c.icon className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
                </span>
                <div>
                  <h3 className="text-base font-bold tracking-tight text-cloud-50">{c.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-300">{c.body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* No-Brainer Guarantee */}
        <Reveal delay={0.1}>
          <div className="relative mt-6 overflow-hidden rounded-3xl border border-emerald-500/30 bg-slate-900/70 p-7 shadow-tactile-lg backdrop-blur-sm sm:mt-8 sm:p-10">
            {/* soft emerald wash, single accent */}
            <div className="pointer-events-none absolute inset-0 opacity-70 [background:radial-gradient(520px_200px_at_88%_-20%,rgba(16,185,129,0.16),transparent)]" />
            <div className="relative flex flex-col items-center gap-6 text-center sm:flex-row sm:items-start sm:text-right">
              <div className="relative shrink-0">
                <div className="absolute inset-0 rounded-2xl bg-emerald-500/25 blur-xl" />
                <div className="relative flex h-[72px] w-[72px] items-center justify-center rounded-2xl border border-emerald-400/40 bg-emerald-500/10 shadow-tactile">
                  <ShieldCheck className="h-9 w-9 text-emerald-400" strokeWidth={1.8} aria-hidden="true" />
                </div>
              </div>
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.15em] text-emerald-300">
                  No Questions Asked
                </div>
                <h3 className="text-xl font-extrabold tracking-tight text-cloud-50 sm:text-2xl">
                  אחריות 100% שביעות רצון
                </h3>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-[15px]">
                  „אם תשתתף בסדנה ותרגיש שלא קיבלת לפחות פי 10 מערך ההשקעה שלך —
                  שלח הודעה עד 24 שעות מסיום הסדנה וקבל את כל ה-
                  <span className="ltr-nums font-bold text-emerald-400">$97</span> בחזרה, וכל
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

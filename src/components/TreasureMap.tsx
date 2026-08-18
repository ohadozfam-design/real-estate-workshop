import { Users, Compass, Swords, Calculator, Trophy } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import Reveal from "./ui/Reveal";

type Station = {
  n: number;
  icon: LucideIcon;
  title: string;
  challenge: string;
  solution: string;
};

const stations: Station[] = [
  {
    n: 1,
    icon: Users,
    title: "איתור הצוות (סוכנים של יזמים)",
    challenge: "רוב הסוכנים מורחים זמן ולא מבינים מה יזם מחפש.",
    solution:
      "איך לאתר ולסנן את ה-5% המובילים של הסוכנים שיזינו אותך בעסקאות ויעבדו בשבילך.",
  },
  {
    n: 2,
    icon: Compass,
    title: "המצפן של השוק (ניתוח קומפסים בחינם)",
    challenge: "תוכנות יקרות ומסובכות שמבלבלות משקיעים מתחילים.",
    solution: "שיטת הניתוח הידנית והחינמית להבנת שווי שוק אמיתי ומדויק תוך 5 דקות.",
  },
  {
    n: 3,
    icon: Swords,
    title: "קוד הפיראטים (סמכות מול הסוכן)",
    challenge: "הפחד להישמע חובבן או חסר ניסיון באנגלית.",
    solution:
      "מה בדיוק אומרים, מה מציגים לסוכן, ואיך מייצרים רושם של קונה רציני ומנוסה מהשיחה הראשונה.",
  },
  {
    n: 4,
    icon: Calculator,
    title: "נוסחת הזהב (חישוב שיפוץ והגשת ההצעה)",
    challenge: "הערכות שיפוץ שגויות ששורפות את כל הרווח.",
    solution:
      "נוסחת אצבע לתמחור שיפוץ מהיר בשטח, חישוב ה-MAO (מחיר הצעה מקסימלי), והגשת הצעה שמרוויחה כבר בקנייה.",
  },
];

export default function TreasureMap() {
  return (
    <section className="relative px-4 py-16 lg:py-24" aria-labelledby="treasure-heading">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <div className="text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/[0.07] px-4 py-1.5 text-xs font-bold tracking-[0.15em] text-amber-400">
              מפת המסע שלך
            </span>
            <h2
              id="treasure-heading"
              className="mt-5 text-3xl font-extrabold tracking-tight text-cloud-50 sm:text-4xl"
            >
              4 תחנות עד <span className="gold-text">תיבת האוצר</span>
            </h2>
            <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-slate-300">
              מסלול עבודה מעשי — מהאתגר בים הפתוח אל המפתח שפותח כל תחנה.
            </p>
          </div>
        </Reveal>

        {/* ---- Timeline ---- */}
        <div className="relative mt-16">
          {/* desktop dashed gold trail running behind the icon badges */}
          <div className="pointer-events-none absolute inset-x-6 top-[52px] hidden lg:block">
            <svg className="h-2 w-full" preserveAspectRatio="none" viewBox="0 0 1000 8">
              <line
                x1="8"
                y1="4"
                x2="992"
                y2="4"
                stroke="url(#trail)"
                strokeWidth="2"
                strokeDasharray="1 10"
                strokeLinecap="round"
                className="animate-trail-flow"
              />
              <defs>
                <linearGradient id="trail" x1="1" y1="0" x2="0" y2="0">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.15" />
                  <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.15" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-4 lg:gap-6">
            {stations.map((s, i) => (
              <StationCard key={s.n} station={s} index={i} isLast={i === stations.length - 1} />
            ))}
          </div>
        </div>

        {/* ---- Treasure chest banner ---- */}
        <Reveal delay={0.1}>
          <div className="relative mt-14 overflow-hidden rounded-3xl border border-amber-500/40 bg-gradient-to-b from-amber-500/[0.12] to-ink-800/60 p-9 text-center shadow-tactile-lg sm:p-11">
            <div className="pointer-events-none absolute inset-0 opacity-60 [background:radial-gradient(560px_180px_at_50%_-10%,rgba(245,158,11,0.35),transparent)]" />
            <div className="relative flex flex-col items-center gap-5">
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-b from-gold-400 to-gold-600 text-ink-900 shadow-cta"
              >
                <Trophy className="h-8 w-8" strokeWidth={2} aria-hidden="true" />
              </motion.div>
              <div>
                <span className="text-xs font-bold tracking-[0.2em] text-amber-400/90">
                  היעד הסופי
                </span>
                <h3 className="mt-2 text-2xl font-extrabold tracking-tight text-cloud-50 sm:text-3xl">
                  תיבת האוצר
                </h3>
              </div>
              <p className="max-w-lg text-[15px] font-semibold leading-relaxed text-cloud-50/80 sm:text-base">
                הגשת הצעה אמיתית, בטוחה ומקצועית על נכס מתחת למחיר השוק.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function StationCard({
  station,
  index,
  isLast,
}: {
  station: Station;
  index: number;
  isLast: boolean;
}) {
  const Icon = station.icon;
  const step = String(station.n).padStart(2, "0");

  return (
    <Reveal delay={index * 0.1} className="relative">
      {/* mobile vertical dashed connector between cards */}
      {!isLast && (
        <span className="absolute right-1/2 top-[100%] hidden h-6 w-px translate-x-1/2 border-r-2 border-dashed border-amber-500/40 max-lg:block" />
      )}

      <div className="group relative flex h-full flex-col rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-tactile backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/40 hover:shadow-tactile-lg">
        {/* header: step label + glowing icon badge */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-extrabold tracking-[0.2em] text-amber-400">
            תחנה {step}
          </span>
          <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/[0.08] ring-1 ring-inset ring-amber-500/30 shadow-[0_0_22px_-6px_rgba(245,158,11,0.55)] transition-transform duration-300 group-hover:scale-105">
            <span className="pointer-events-none absolute inset-0 rounded-full bg-amber-500/10 opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100" />
            <Icon className="relative h-[22px] w-[22px] text-amber-400" strokeWidth={1.9} aria-hidden="true" />
          </div>
        </div>

        <h3 className="mt-5 text-[17px] font-bold leading-snug tracking-tight text-cloud-50">
          {station.title}
        </h3>

        {/* editorial accent lines instead of nested colored boxes */}
        <div className="mt-5 flex flex-col gap-4">
          <div className="border-r-2 border-rose-500/60 pr-3">
            <div className="text-[11px] font-bold tracking-wide text-rose-300/90">
              האתגר בים הפתוח
            </div>
            <p className="mt-1 text-[13px] leading-relaxed text-slate-300">
              {station.challenge}
            </p>
          </div>
          <div className="border-r-2 border-emerald-500/60 pr-3">
            <div className="text-[11px] font-bold tracking-wide text-emerald-300/90">
              המפתח
            </div>
            <p className="mt-1 text-[13px] leading-relaxed text-cloud-50/85">
              {station.solution}
            </p>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

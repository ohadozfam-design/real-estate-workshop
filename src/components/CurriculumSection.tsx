import { Target } from "lucide-react";
import Reveal from "./ui/Reveal";
import { SITE } from "../lib/site";

type Module = { n: number; title: string; outcome: string };
type Day = { label: string; date: string; modules: Module[] };

const days: Day[] = [
  {
    label: "יום 1",
    date: SITE.day1.date, // 24 באוגוסט
    modules: [
      {
        n: 1,
        title: "סינון ואיתור נכסים אמיתיים מתחת למחיר השוק",
        outcome: "רשימת נכסים אמיתית לעבודה, ושיטה לזהות עסקה טובה תוך דקות.",
      },
      {
        n: 2,
        title: "בניית הצעת מחיר מדויקת וחישוב מספרים בשטח",
        outcome: "מספרים מדויקים: עלות שיפוץ, מחיר הצעה מקסימלי (MAO) ורווח צפוי, בלי לנחש.",
      },
    ],
  },
  {
    label: "יום 2",
    date: SITE.day2.date, // 26 באוגוסט
    modules: [
      {
        n: 3,
        title: "תסריטי שיחה ומו״מ מול מוכרים ומתווכים",
        outcome: "בדיוק מה אומרים בשיחה, כדי להישמע כמו קונה רציני ומנוסה.",
      },
      {
        n: 4,
        title: "ניסוח והגשת LOI או חוזה בלייב",
        outcome: "הצעה כתובה ומוכנה, שמוגשת בלייב על נכס אמיתי.",
      },
    ],
  },
];

export default function CurriculumSection() {
  return (
    <section className="px-5 py-16 lg:py-24" aria-labelledby="curriculum-heading">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <div className="text-center">
            <span className="eyebrow">תכנית הסדנה</span>
            <h2
              id="curriculum-heading"
              className="mt-5 text-balance font-extrabold tracking-tight text-cloud text-[clamp(2rem,5vw,3.25rem)]"
            >
              תכנית העבודה ליומיים של הסדנה
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-drift">
              בדיוק מה עושים בכל יום, ומה תצאו איתו בסוף. ארבעה מודולים מעשיים,
              שניים בכל יום.
            </p>
          </div>
        </Reveal>

        <div className="mt-14 space-y-14">
          {days.map((day) => (
            <Reveal key={day.label}>
              <div>
                {/* Day header */}
                <div className="flex items-baseline gap-3 border-b border-drift/15 pb-4">
                  <h3 className="text-xl font-extrabold tracking-tight text-cloud sm:text-2xl">
                    {day.label}
                  </h3>
                  <span className="text-sm font-bold text-gold">· {day.date}</span>
                </div>

                {/* Modules */}
                <ol>
                  {day.modules.map((m) => (
                    <li
                      key={m.n}
                      className="grid grid-cols-1 gap-4 border-b border-drift/12 py-7 sm:grid-cols-[6rem_1fr] sm:gap-8"
                    >
                      <div className="flex items-baseline gap-3 sm:block">
                        <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-drift sm:mb-2 sm:block">
                          מודול
                        </span>
                        <span className="ltr-nums text-[clamp(2.5rem,5vw,3.75rem)] font-extrabold leading-none text-gold">
                          {String(m.n).padStart(2, "0")}
                        </span>
                      </div>

                      <div>
                        <h4 className="text-lg font-bold tracking-tight text-cloud">{m.title}</h4>
                        <div className="mt-3 border-r-2 border-gold/60 pr-4">
                          <div className="text-[11px] font-bold uppercase tracking-wider text-gold">
                            התוצאה שתצאו איתה
                          </div>
                          <p className="mt-1.5 text-sm leading-relaxed text-cloud/90">{m.outcome}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Final outcome — solid accent panel with dark text */}
        <Reveal delay={0.08}>
          <div className="mt-12 flex flex-col items-center gap-4 rounded-2xl bg-gold px-8 py-11 text-center text-night sm:px-12">
            <Target className="h-9 w-9" strokeWidth={1.8} aria-hidden="true" />
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.22em] text-night/70">
                התוצאה הסופית
              </div>
              <h3 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">
                יוצאים עם הצעה אמיתית, מוכנה להגשה
              </h3>
            </div>
            <p className="max-w-lg font-semibold leading-relaxed text-night/85">
              על נכס אמיתי מתחת למחיר השוק, עם המספרים והתסריטים שמאחוריה.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

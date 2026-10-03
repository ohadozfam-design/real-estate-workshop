import { ArrowLeft, CheckCircle2 } from "lucide-react";
import Reveal from "./ui/Reveal";
import Sentences from "./ui/Sentences";
import { SITE } from "../lib/site";

type Day = {
  label: string;
  date: string;
  title: string;
  points: string[];
  outcome: string;
};

const days: Day[] = [
  {
    label: "יום 1",
    date: `${SITE.day1.label}, ${SITE.day1.date}`, // יום שלישי, 29 בספטמבר
    title: "מנוע האיתור, סוכנים וגיוס בעלי מקצוע",
    points: [
      "איך לאתר ולרתום את הסוכנים הנכונים בשוק היעד שיזרימו לך עסקאות חמות",
      "איך לשדר רצינות וסמכות מול בעלי מקצוע כדי שיפתחו בפניך את הנכסים הכי טובים שלהם",
      "בניית שיטת סינון מהירה להפרדה מיידית בין נכסים מבוזבזים להזדמנויות רווח אמיתיות",
    ],
    outcome:
      "תדע בדיוק איך לגרום לסוכנים לרדוף אחריך עם נכסים, ותחזיק בשיטה מוכחת לגיוס בעלי מקצוע שפותחים לך דלתות להזדמנויות ראשונות.",
  },
  {
    label: "יום 2",
    date: `${SITE.day2.label}, ${SITE.day2.date}`, // יום רביעי, 30 בספטמבר
    title: "ניתוח קומפס מהיר, תמחור שיפוץ מדויק והגשת הצעה",
    points: [
      "ניתוח קומפס (Comps) מהיר ומדויק כדי לדעת את שווי הנכס האמיתי ולהגיש הצעות במהירות שיא",
      "חישוב עלויות שיפוץ לפי סעיפים ופריטים כדי שאף קבלן לא יוכל לעבוד עליך",
      "חישוב מחיר ההצעה המקסימאלי (MAO) והגשת הצעה רשמית שנועלת את הרווח שלך מראש",
      "מודל ה-Wholesaling: איך להעביר עסקה טובה ליזם אחר ולגזור רווח מהיר בלי הון עצמי",
    ],
    outcome:
      "תציע לפחות 5 הצעות מחיר בכל יום. תיצור קשר עם בעלי המקצוע הנכונים ותדע איך להביא מהם עסקאות מתחת למחיר השוק",
  },
];

export default function CurriculumSection() {
  return (
    <section className="px-5 py-16 md:py-24" aria-labelledby="curriculum-heading">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <div className="text-center">
            <span className="eyebrow">תכנית הסדנה</span>

            <h2
              id="curriculum-heading"
              className="mx-auto mt-5 max-w-4xl text-balance font-extrabold leading-tight tracking-tight text-cloud text-[clamp(2rem,4.8vw,3.3rem)]"
            >
              <span className="block">
                <span className="text-gold" aria-hidden="true">"</span>
                הגשתי כמה הצעות אבל זה לא עבד.
              </span>
              <span className="mt-1 block">
                אני רוצה להתחיל לבנות צוות ולעלות על חוזים
                <span className="text-gold" aria-hidden="true">"</span>
              </span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-drift sm:text-xl">
              אני כבר 4 חודשים בתחום ולא מצליח לעלות על עסקה
            </p>
          </div>
        </Reveal>

        {/* Day 1 and Day 2: stacked cards on mobile, side by side from lg up */}
        <div className="relative mt-14 grid grid-cols-1 gap-6 md:mt-16 lg:grid-cols-2 lg:gap-12">
          {/* Day 1 -> Day 2 connector (RTL: Day 1 sits on the right) */}
          <span
            className="absolute left-1/2 top-[3.5rem] z-10 hidden h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-gold/40 bg-night text-gold lg:flex"
            aria-hidden="true"
          >
            <ArrowLeft className="h-6 w-6" strokeWidth={2.4} />
          </span>

          {days.map((day, i) => (
            <Reveal key={day.label} delay={i * 0.15} className="h-full">
              <article className="flex h-full flex-col rounded-3xl border border-drift/20 bg-cloud/[0.04] p-6 transition duration-300 hover:border-gold/40 hover:bg-cloud/[0.06] hover:shadow-card sm:p-8">
                {/* Day header */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-3 border-b border-drift/15 pb-6">
                  <span className="inline-flex items-center rounded-full bg-gold px-5 py-2 text-2xl font-extrabold text-night">
                    {day.label}
                  </span>
                  <span className="text-lg font-bold text-cloud/85">{day.date}</span>
                </div>

                {/* Day theme */}
                <h3 className="mt-7 text-balance text-2xl font-extrabold leading-[1.2] tracking-tight text-cloud lg:text-3xl">
                  {day.title}
                </h3>

                {/* Live points */}
                <ul className="mt-7 space-y-5">
                  {day.points.map((p) => (
                    <li key={p} className="flex items-start gap-3.5">
                      <CheckCircle2
                        className="mt-0.5 h-6 w-6 shrink-0 text-emerald-400"
                        strokeWidth={2.4}
                        aria-hidden="true"
                      />
                      <span className="text-lg font-semibold leading-relaxed text-cloud md:text-xl">
                        {p}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Outcome - pinned to the bottom so both cards align */}
                <div className="mt-auto pt-9">
                  <div className="border-r-4 border-gold/60 pr-5">
                    <div className="text-sm font-bold uppercase tracking-wider text-gold md:text-base">
                      התוצאה שתצא איתה
                    </div>
                    <p className="mt-2 text-lg font-medium leading-relaxed text-cloud md:text-xl">
                      <Sentences text={day.outcome} />
                    </p>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

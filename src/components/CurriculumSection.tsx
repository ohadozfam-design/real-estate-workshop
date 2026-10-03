import { ArrowLeft, CheckCircle2, Quote } from "lucide-react";
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

            {/* The pain point, framed as the participant's own words */}
            <figure className="relative mx-auto mt-10 max-w-4xl rounded-3xl border border-gold/25 bg-gold/[0.06] px-6 pb-9 pt-12 sm:px-12">
              <span
                className="absolute -top-7 left-1/2 flex h-14 w-14 -translate-x-1/2 items-center justify-center rounded-full bg-night ring-1 ring-gold/40"
                aria-hidden="true"
              >
                <Quote className="h-7 w-7 -scale-x-100 fill-gold/20 text-gold" strokeWidth={2} />
              </span>
              <blockquote>
                <h2
                  id="curriculum-heading"
                  className="text-balance font-extrabold leading-tight tracking-tight text-cloud text-[clamp(1.85rem,4.4vw,3.1rem)]"
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
              </blockquote>
              <figcaption className="mt-5 text-lg italic leading-relaxed text-drift sm:text-xl">
                אני כבר 4 חודשים בתחום ולא מצליח לעלות על עסקה
              </figcaption>
            </figure>
          </div>
        </Reveal>

        {/* Day 1 and Day 2: stacked cards on mobile, side by side from md up */}
        <div className="relative mt-14 grid grid-cols-1 gap-6 md:mt-16 md:grid-cols-2 md:gap-8">
          {/* Day 1 -> Day 2 connector (RTL: Day 1 sits on the right) */}
          <span
            className="absolute left-1/2 top-1/2 z-10 hidden h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-gold/40 bg-night text-gold md:flex"
            aria-hidden="true"
          >
            <ArrowLeft className="h-6 w-6" strokeWidth={2.4} />
          </span>

          {days.map((day, i) => (
            <Reveal key={day.label} delay={i * 0.15} className="h-full">
              <article className="flex h-full flex-col rounded-3xl border border-drift/20 bg-cloud/[0.04] p-6 transition duration-300 hover:border-gold/40 hover:bg-cloud/[0.06] hover:shadow-card motion-safe:hover:-translate-y-1 sm:p-8 lg:p-10">
                {/* Day header */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-3 border-b border-drift/15 pb-6">
                  <span className="inline-flex items-center rounded-full bg-gold px-5 py-2 text-2xl font-black text-night md:text-3xl">
                    {day.label}
                  </span>
                  <span className="text-xl font-bold text-cloud/85 md:text-2xl">{day.date}</span>
                </div>

                {/* Day theme */}
                <h3 className="mt-7 text-balance text-3xl font-black leading-tight tracking-tight text-cloud md:text-4xl lg:text-[2.6rem]">
                  {day.title}
                </h3>

                {/* Live points */}
                <ul className="mt-7 space-y-5">
                  {day.points.map((p) => (
                    <li key={p} className="flex items-start gap-3.5">
                      <CheckCircle2
                        className="mt-0.5 h-7 w-7 shrink-0 text-emerald-400 md:h-8 md:w-8"
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

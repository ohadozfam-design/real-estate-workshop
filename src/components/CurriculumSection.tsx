import { CheckCircle2 } from "lucide-react";
import Reveal from "./ui/Reveal";
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
    date: `${SITE.day1.label}, ${SITE.day1.date}`, // יום רביעי, 16 בספטמבר
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
    date: `${SITE.day2.label}, ${SITE.day2.date}`, // יום חמישי, 17 בספטמבר
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
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <div className="text-center">
            <span className="eyebrow">תכנית הסדנה</span>
            <h2
              id="curriculum-heading"
              className="mx-auto mt-5 max-w-4xl text-balance font-extrabold tracking-tight text-cloud text-[clamp(2rem,4.8vw,3.3rem)]"
            >
              הגשתי כמה הצעות אבל זה לא עבד. אני רוצה להתחיל לבנות צוות ולעלות על חוזים
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-drift sm:text-xl">
              אני כבר 4 חודשים בתחום ולא מצליח לעלות על עסקה
            </p>
          </div>
        </Reveal>

        <div className="mt-14 space-y-16">
          {days.map((day) => (
            <Reveal key={day.label}>
              <div>
                {/* Day header */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-drift/15 pb-5">
                  <span className="inline-flex items-center rounded-full bg-gold/15 px-5 py-2 text-xl font-extrabold text-gold sm:text-2xl">
                    {day.label}
                  </span>
                  <span className="text-xl font-bold text-cloud/80 sm:text-2xl">{day.date}</span>
                </div>

                {/* Day theme + live points */}
                <div className="pt-8">
                  <h4 className="text-3xl font-extrabold tracking-tight text-cloud md:text-4xl">
                    {day.title}
                  </h4>

                  <ul className="mt-7 space-y-5">
                    {day.points.map((p) => (
                      <li key={p} className="flex items-start gap-4">
                        <CheckCircle2
                          className="mt-0.5 h-8 w-8 shrink-0 text-emerald-400"
                          strokeWidth={2.4}
                          aria-hidden="true"
                        />
                        <span className="text-lg font-medium leading-relaxed text-cloud md:text-xl">
                          {p}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* Outcome */}
                  <div className="mt-9 border-r-4 border-gold/60 pr-5">
                    <div className="text-base font-bold uppercase tracking-wider text-gold">
                      התוצאה שתצא איתה
                    </div>
                    <p className="mt-2 text-xl font-medium leading-relaxed text-cloud md:text-2xl">
                      {day.outcome}
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

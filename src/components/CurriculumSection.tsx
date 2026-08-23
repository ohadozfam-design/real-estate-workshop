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
    date: `${SITE.day1.label}, ${SITE.day1.date}`, // יום רביעי, 2 בספטמבר
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
    date: `${SITE.day2.label}, ${SITE.day2.date}`, // יום חמישי, 3 בספטמבר
    title: "ניתוח קומפס מהיר, תמחור שיפוץ מדויק והגשת הצעה",
    points: [
      "ניתוח קומפס (Comps) מהיר ומדויק כדי לדעת את שווי הנכס האמיתי ולהגיש הצעות במהירות שיא",
      "חישוב עלויות שיפוץ לפי סעיפים ופריטים כדי שאף קבלן לא יוכל לעבוד עליך",
      "חישוב מחיר ההצעה המקסימאלי (MAO) והגשת הצעה רשמית שנועלת את הרווח שלך מראש",
      "מודל ה-Wholesaling: איך להעביר עסקה טובה ליזם אחר ולגזור רווח מהיר בלי הון עצמי",
    ],
    outcome:
      "תדע להגיע למספרים המדוייקים של עלויות השיפוץ, מה מחיר ההצעה המקסימאלי (MAO) ומה הרווח הצפוי שלך מבלי לנחש, ותשלוט במערכת שממשיכה לייצר לך הצעות באופן שוטף.",
  },
];

export default function CurriculumSection() {
  return (
    <section className="px-5 py-20 lg:py-28" aria-labelledby="curriculum-heading">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <div className="text-center">
            <span className="eyebrow">תכנית הוורקשופ</span>
            <h2
              id="curriculum-heading"
              className="mx-auto mt-5 max-w-4xl text-balance font-extrabold tracking-tight text-cloud text-[clamp(2rem,4.8vw,3.3rem)]"
            >
              תמיד רצית לקפוץ למים של הנדל״ן? זו תהיה הטבילה הראשונה שלך
            </h2>
          </div>
        </Reveal>

        <div className="mt-14 space-y-16">
          {days.map((day) => (
            <Reveal key={day.label}>
              <div>
                {/* Day header */}
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b border-drift/15 pb-4">
                  <h3 className="text-2xl font-extrabold tracking-tight text-cloud sm:text-3xl">
                    {day.label}
                  </h3>
                  <span className="text-lg font-bold text-gold">· {day.date}</span>
                </div>

                {/* Day theme + live points */}
                <div className="pt-7">
                  <h4 className="text-2xl font-bold tracking-tight text-cloud sm:text-[1.75rem]">
                    {day.title}
                  </h4>

                  <ul className="mt-6 space-y-4">
                    {day.points.map((p) => (
                      <li key={p} className="flex items-start gap-3.5">
                        <CheckCircle2
                          className="mt-0.5 h-6 w-6 shrink-0 text-emerald-400"
                          strokeWidth={2.3}
                          aria-hidden="true"
                        />
                        <span className="text-lg leading-relaxed text-cloud/90 sm:text-xl">{p}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Outcome */}
                  <div className="mt-8 border-r-2 border-gold/60 pr-4">
                    <div className="text-sm font-bold uppercase tracking-wider text-gold">
                      התוצאה שתצא איתה
                    </div>
                    <p className="mt-1.5 text-xl leading-relaxed text-cloud/90">{day.outcome}</p>
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

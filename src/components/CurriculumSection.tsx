import Reveal from "./ui/Reveal";
import { SITE } from "../lib/site";

type Module = { n: number; title: string; outcome: string };
type Day = { label: string; date: string; modules: Module[] };

const days: Day[] = [
  {
    label: "יום 1",
    date: `${SITE.day1.label}, ${SITE.day1.date}`, // יום רביעי, 2 בספטמבר
    modules: [
      {
        n: 1,
        title: "סינון ואיתור נכסים אמיתיים מתחת למחיר השוק",
        outcome: "רשימת נכסים אמיתית לעבודה, ושיטה לזהות עסקה טובה תוך דקות.",
      },
      {
        n: 2,
        title: "בניית הצעת מחיר מדויקת וחישוב מספרים בשטח",
        outcome:
          "תדע להגיע למספרים המדוייקים של עלויות השיפוץ, מה מחיר ההצעה המקסימאלי (MAO) ומה הרווח הצפוי שלך מבלי לנחש.",
      },
    ],
  },
  {
    label: "יום 2",
    date: `${SITE.day2.label}, ${SITE.day2.date}`, // יום חמישי, 3 בספטמבר
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

        <div className="mt-14 space-y-14">
          {days.map((day) => (
            <Reveal key={day.label}>
              <div>
                {/* Day header */}
                <div className="flex items-baseline gap-3 border-b border-drift/15 pb-4">
                  <h3 className="text-2xl font-extrabold tracking-tight text-cloud sm:text-3xl">
                    {day.label}
                  </h3>
                  <span className="text-lg font-bold text-gold">· {day.date}</span>
                </div>

                {/* Modules */}
                <ol>
                  {day.modules.map((m) => (
                    <li
                      key={m.n}
                      className="grid grid-cols-1 gap-4 border-b border-drift/12 py-7 sm:grid-cols-[6rem_1fr] sm:gap-8"
                    >
                      <div className="flex items-baseline gap-3 sm:block">
                        <span className="text-sm font-bold uppercase tracking-[0.22em] text-drift sm:mb-2 sm:block">
                          מודול
                        </span>
                        <span className="ltr-nums text-[clamp(2.5rem,5vw,3.75rem)] font-extrabold leading-none text-gold">
                          {String(m.n).padStart(2, "0")}
                        </span>
                      </div>

                      <div>
                        <h4 className="text-2xl font-bold tracking-tight text-cloud">{m.title}</h4>
                        <div className="mt-3 border-r-2 border-gold/60 pr-4">
                          <div className="text-sm font-bold uppercase tracking-wider text-gold">
                            התוצאה שתצא איתה
                          </div>
                          <p className="mt-1.5 text-xl leading-relaxed text-cloud/90">{m.outcome}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

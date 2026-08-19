import { Trophy } from "lucide-react";
import Reveal from "./ui/Reveal";
import { SITE } from "../lib/site";

type Station = {
  n: number;
  title: string;
  challenge: string;
  solution: string;
};

const stations: Station[] = [
  {
    n: 1,
    title: "איתור הצוות · סוכנים של יזמים",
    challenge: "רוב הסוכנים מורחים זמן ולא מבינים מה יזם מחפש.",
    solution:
      "איך לאתר ולסנן את חמשת האחוזים המובילים של הסוכנים שיזינו אותך בעסקאות ויעבדו בשבילך.",
  },
  {
    n: 2,
    title: "המצפן של השוק · ניתוח קומפסים בחינם",
    challenge: "תוכנות יקרות ומסובכות שמבלבלות משקיעים מתחילים.",
    solution: "שיטת הניתוח הידנית והחינמית להבנת שווי שוק אמיתי ומדויק תוך 5 דקות.",
  },
  {
    n: 3,
    title: "קוד הפיראטים · סמכות מול הסוכן",
    challenge: "הפחד להישמע חובבן או חסר ניסיון באנגלית.",
    solution:
      "מה בדיוק אומרים, מה מציגים לסוכן, ואיך מייצרים רושם של קונה רציני ומנוסה מהשיחה הראשונה.",
  },
  {
    n: 4,
    title: "נוסחת הזהב · חישוב שיפוץ והגשת ההצעה",
    challenge: "הערכות שיפוץ שגויות ששורפות את כל הרווח.",
    solution:
      "נוסחת אצבע לתמחור שיפוץ מהיר בשטח, חישוב מחיר ההצעה המקסימלי (MAO), והגשת הצעה שמרוויחה כבר בקנייה.",
  },
];

export default function TreasureMap() {
  return (
    <section className="px-5 py-16 lg:py-24" aria-labelledby="treasure-heading">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <div className="text-center">
            <span className="eyebrow">מפת המסע שלך</span>
            <h2
              id="treasure-heading"
              className="mt-5 text-balance font-extrabold tracking-tight text-cloud text-[clamp(2rem,5vw,3.25rem)]"
            >
              4 תחנות עד <span className="text-gold">תיבת האוצר</span>
            </h2>
            <p className="mx-auto mt-4 max-w-md text-drift">
              מסלול עבודה מעשי על פני יומיים מרוכזים, מהאתגר בים הפתוח אל המפתח
              שפותח כל תחנה.
            </p>

            {/* Explicit 2 day → stations mapping */}
            <div className="mx-auto mt-7 inline-flex flex-col items-center gap-y-2 rounded-2xl border border-drift/15 px-6 py-3 text-sm text-drift sm:flex-row sm:gap-x-7">
              <span>
                <span className="font-bold text-gold">{SITE.day1.date}</span> · תחנות 01, 02
              </span>
              <span className="hidden h-4 w-px bg-drift/20 sm:block" aria-hidden="true" />
              <span>
                <span className="font-bold text-gold">{SITE.day2.date}</span> · תחנות 03, 04
              </span>
            </div>
          </div>
        </Reveal>

        {/* Numbered editorial list — giant numerals anchor each station */}
        <ol className="mt-14 border-t border-drift/12">
          {stations.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.06}>
              <li className="grid grid-cols-1 gap-5 border-b border-drift/12 py-8 sm:grid-cols-[7rem_1fr] sm:gap-8 sm:py-10">
                <div className="flex items-start gap-3 sm:block">
                  <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-drift sm:mb-2 sm:block">
                    תחנה
                  </span>
                  <span className="ltr-nums text-[clamp(2.75rem,6vw,4.25rem)] font-extrabold leading-none text-gold">
                    {String(s.n).padStart(2, "0")}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold tracking-tight text-cloud sm:text-xl">
                    {s.title}
                  </h3>
                  <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-7">
                    <div className="border-r-2 border-coral/60 pr-4">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-coral">
                        האתגר בים הפתוח
                      </div>
                      <p className="mt-1.5 text-sm leading-relaxed text-drift">{s.challenge}</p>
                    </div>
                    <div className="border-r-2 border-gold/60 pr-4">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-gold">
                        המפתח
                      </div>
                      <p className="mt-1.5 text-sm leading-relaxed text-cloud/90">{s.solution}</p>
                    </div>
                  </div>
                </div>
              </li>
            </Reveal>
          ))}
        </ol>

        {/* Treasure block — solid Sea Buckthorn accent panel with dark text */}
        <Reveal delay={0.08}>
          <div className="mt-10 flex flex-col items-center gap-4 rounded-2xl bg-gold px-8 py-11 text-center text-night sm:px-12">
            <Trophy className="h-9 w-9" strokeWidth={1.8} aria-hidden="true" />
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.22em] text-night/70">
                היעד הסופי
              </div>
              <h3 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">
                תיבת האוצר
              </h3>
            </div>
            <p className="max-w-lg font-semibold leading-relaxed text-night/85">
              הגשת הצעה אמיתית, בטוחה ומקצועית על נכס מתחת למחיר השוק.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

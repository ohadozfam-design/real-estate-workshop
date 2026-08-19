import { ChevronDown } from "lucide-react";
import Reveal from "./ui/Reveal";

const faqs = [
  {
    q: "אין לי ניסיון קודם בנדל״ן. הסדנה מתאימה לי?",
    a: "כן. הסדנה בנויה למשקיעים ויזמים גם בלי ניסיון קודם. עובדים על עסקאות אמיתיות שלב אחר שלב, כך שתסיימו עם תהליך עבודה ברור ליישום.",
  },
  {
    q: "האנגלית שלי בינונית. אצליח מול הסוכנים?",
    a: "בדיוק בשביל זה יש בסדנה תסריטי שיחה ומיילים מוכנים, מילה במילה באנגלית. מעתיקים, מתאימים ושולחים.",
  },
  {
    q: "עדיין אין לי הון להשקעה. שווה לי להשתתף?",
    a: "הסדנה מלמדת את השיטה והתהליך: איתור, ניתוח והגשת הצעה. הכלים והמחשבונים נשארים אצלכם לתמיד, ומחכים לרגע שתהיו מוכנים.",
  },
  {
    q: "מה אם ארגיש שזה לא בשבילי?",
    a: "יש אחריות 100%: אם תרגישו שלא קיבלתם לפחות פי 10 מהערך, שלחו הודעה עד 24 שעות מסיום הסדנה וקבלו החזר מלא. כל החומרים נשארים אצלכם.",
  },
  {
    q: "איך מתבצע התשלום ומתי מקבלים את הקישור לזום?",
    a: "התשלום מאובטח בכרטיס אשראי (בדולרים). מיד אחרי ההרשמה תקבלו למייל את הקישור לזום ואת כל החומרים.",
  },
];

export default function FaqSection() {
  return (
    <section className="px-5 py-20 lg:py-28" aria-labelledby="faq-heading">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <div className="text-center">
            <span className="eyebrow">לפני שנתחיל</span>
            <h2
              id="faq-heading"
              className="mt-5 font-extrabold tracking-tight text-cloud text-[clamp(2rem,5vw,3.25rem)]"
            >
              שאלות נפוצות
            </h2>
          </div>
        </Reveal>

        <Reveal delay={0.06}>
          <div className="mt-12 border-t border-drift/12">
            {faqs.map((f) => (
              <details key={f.q} className="group border-b border-drift/12">
                <summary className="focus-ring flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-xl font-bold text-cloud [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <ChevronDown
                    className="h-6 w-6 shrink-0 text-gold transition-transform duration-300 group-open:rotate-180"
                    strokeWidth={2.2}
                    aria-hidden="true"
                  />
                </summary>
                <p className="pb-5 text-lg leading-relaxed text-drift">{f.a}</p>
              </details>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

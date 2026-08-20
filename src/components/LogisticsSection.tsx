import Reveal from "./ui/Reveal";
import { SITE } from "../lib/site";

const cells = [
  {
    label: "מתי",
    body: `${SITE.eventDates} · ${SITE.eventHours}`,
  },
  {
    label: "איפה",
    body: "שידור חי אינטראקטיבי בזום, כולל סשן שאלות ותשובות פתוח",
  },
  {
    label: "למי זה מתאים",
    body: "למשקיעים ויזמים (גם ללא ניסיון קודם) שרוצים להגיש הצעות מחיר בביטחון",
  },
  {
    label: "מה להכין",
    body: "מחשב נייד, מחברת וראש פתוח לפרקטיקה",
  },
];

export default function LogisticsSection() {
  return (
    <section className="px-5 py-20 lg:py-28" aria-label="פרטים לוגיסטיים">
      <div className="mx-auto max-w-6xl">
        {/* Editorial detail table - hairline separators, no icon cards */}
        <Reveal>
          <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-drift/15 bg-drift/15 sm:grid-cols-2 lg:grid-cols-4">
            {cells.map((c) => (
              <div
                key={c.label}
                className="bg-night p-7 text-center transition-colors duration-300 hover:bg-cloud/[0.02]"
              >
                <h3 className="mx-auto text-2xl font-extrabold tracking-tight text-gold sm:text-3xl">
                  {c.label}
                </h3>
                <p className="mx-auto mt-3 text-xl leading-relaxed text-drift">{c.body}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

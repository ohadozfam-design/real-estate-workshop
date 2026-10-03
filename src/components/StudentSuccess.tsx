import type { LucideIcon } from "lucide-react";
import { Trophy, TrendingUp, MapPin } from "lucide-react";
import Reveal from "./ui/Reveal";
import Sentences from "./ui/Sentences";

type Story = {
  name: string;
  location?: string;
  highlight: string;
  highlightIcon: LucideIcon;
  result: string;
  /** Single headline metric, or a full deal breakdown via `deal` below. */
  metricValue?: string;
  metricLabel?: string;
  deal?: { label: string; value: string; wide?: boolean; featured?: boolean }[];
  images: string[];
  alt: string[];
  cols: 1 | 2;
};

const stories: Story[] = [
  {
    name: "אליהו",
    location: "סינסינטי, אוהיו",
    highlight: "קנה ב-$140K נכס ששווה $260K אחרי שיפוץ",
    highlightIcon: TrendingUp,
    result:
      "עם מחשבון הניתוח המהיר ותסריטי השיחה מול הסוכנים, אליהו זיהה נכס מתחת למחיר השוק ונעל אותו בלי היסוס.",
    deal: [
      { label: "מחיר רכישה", value: "$140,000" },
      { label: "תקציב שיפוץ בפועל", value: "$32,000" },
      { label: "שווי לאחר שיפוץ (ARV)", value: "$260,000", wide: true },
      { label: "שווי שנוצר בעסקה (על הנייר)", value: "$88,000+", featured: true },
    ],
    images: ["/testimonials/eli/eli-1.jpg"],
    alt: ["הנכס של אליהו באזור מבוקש בסינסינטי"],
    cols: 1,
  },
  {
    name: "אסף",
    highlight: "קצב סגירת עסקאות שיא",
    highlightIcon: Trophy,
    result: "עלה על 6 עסקאות נדל״ן בפחות מ-3 חודשים.",
    metricValue: "6 עסקאות",
    metricLabel: "בפחות מ-3 חודשים",
    images: ["/testimonials/asaf/asaf-1.jpg", "/testimonials/asaf/asaf-2.jpg"],
    alt: ["אסף מול נכס שרכש בשטח", "אסף מול נכס נוסף שרכש בשטח"],
    cols: 2,
  },
];

export default function StudentSuccess() {
  return (
    <section className="px-5 py-16 md:py-24" aria-labelledby="success-heading">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <div className="text-center">
            <span className="eyebrow">סיפורי הצלחה</span>
            <h2
              id="success-heading"
              className="mx-auto mt-5 max-w-4xl text-balance font-extrabold tracking-tight text-cloud text-[clamp(2rem,4.8vw,3.3rem)]"
            >
              תלמידים שכבר עלו על עסקאות אמיתיות
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-drift sm:text-xl">
              <Sentences text="לא תיאוריה ולא הבטחות. נכסים אמיתיים בשטח, של תלמידים שיישמו את השיטה." />
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
          {stories.map((s, i) => {
            const HighlightIcon = s.highlightIcon;
            return (
              <Reveal key={s.name} delay={i * 0.08}>
                <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-drift/15 bg-cloud/[0.02] shadow-card transition-colors duration-300 hover:border-gold/35">
                  {/* Media */}
                  <div className="p-3">
                    {s.cols === 2 ? (
                      <div className="grid grid-cols-2 gap-2">
                        {s.images.map((src, idx) => (
                          <img
                            key={src}
                            src={src}
                            alt={s.alt[idx]}
                            loading="lazy"
                            decoding="async"
                            className="aspect-[3/4] w-full rounded-xl object-cover"
                          />
                        ))}
                      </div>
                    ) : (
                      <img
                        src={s.images[0]}
                        alt={s.alt[0]}
                        loading="lazy"
                        decoding="async"
                        className="aspect-[16/10] w-full rounded-xl object-cover"
                      />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex grow flex-col px-6 pb-6 pt-3">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-2xl font-extrabold tracking-tight text-cloud">{s.name}</h3>
                    </div>

                    {s.location && (
                      <div className="mt-2 inline-flex items-center gap-1.5 text-base font-semibold text-drift">
                        <MapPin className="h-4 w-4 text-gold" strokeWidth={2.2} aria-hidden="true" />
                        {s.location}
                      </div>
                    )}

                    <div className="mt-4 inline-flex items-start gap-2.5">
                      <HighlightIcon
                        className="mt-0.5 h-6 w-6 shrink-0 text-emerald-400"
                        strokeWidth={2.2}
                        aria-hidden="true"
                      />
                      <span className="text-xl font-bold leading-snug text-cloud">{s.highlight}</span>
                    </div>

                    <p className="mt-3 text-lg leading-relaxed text-drift">{s.result}</p>

                    {/* Deal breakdown chips, or a single metric badge */}
                    <div className="mt-auto pt-6">
                      {s.deal ? (
                        <dl className="grid grid-cols-2 gap-2.5">
                          {s.deal.map((m) => (
                            <div
                              key={m.label}
                              className={
                                m.featured
                                  ? "col-span-2 flex items-center justify-between gap-3 rounded-xl border border-emerald-400/40 bg-emerald-400/10 px-4 py-3.5"
                                  : `rounded-xl border border-drift/15 bg-cloud/[0.03] px-4 py-3 ${
                                      m.wide ? "col-span-2 flex items-center justify-between gap-3" : ""
                                    }`
                              }
                            >
                              <dt
                                className={
                                  m.featured
                                    ? "text-base font-bold text-emerald-300"
                                    : "text-sm font-semibold text-drift"
                                }
                              >
                                {m.label}
                              </dt>
                              <dd
                                className={
                                  m.featured
                                    ? "ltr-nums text-3xl font-black tracking-tight text-emerald-300"
                                    : "ltr-nums mt-0.5 text-xl font-extrabold tracking-tight text-cloud"
                                }
                              >
                                {m.value}
                              </dd>
                            </div>
                          ))}
                        </dl>
                      ) : (
                        <div className="flex items-center justify-between rounded-xl border border-gold/25 bg-cloud/[0.03] px-5 py-4">
                          <span className="ltr-nums text-3xl font-extrabold tracking-tight text-gold">
                            {s.metricValue}
                          </span>
                          <span className="text-base font-semibold text-drift">{s.metricLabel}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

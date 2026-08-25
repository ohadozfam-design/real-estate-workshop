import { useState } from "react";
import { HardHat, Handshake, Mic } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Reveal from "./ui/Reveal";

const story: { label: string; body: string }[] = [
  {
    label: "המסע והנוכחות בשטח",
    body: "אוהד הוא יזם נדל״ן שחי את השטח בארה״ב, בעיקר בשווקים של אוהיו ואינדיאנה. לא גורו של שקפים ותיאוריות, אלא יזם שמנהל עסקאות מורכבות מקצה לקצה: מאיתור נכסים מתחת למחיר השוק (Off Market), דרך ניהול שיפוצים (Rehab) ועסקאות BRRRR, ועד השבחה, השכרה והחזקת פורטפוליו.",
  },
  {
    label: "השיטה המעשית · Zero Fluff",
    body: "כל מה שתלמד נבנה מתוך הפרקטיקה היומיומית: שיחות אמיתיות מול ברוקרים, סוכנים, קבלנים וחברות טייטל. הסדנה מנגישה בדיוק את התהליך הזה, איך לדבר בשפה של השוק, לנתח עסקה תוך 5 דקות, ולהגיש הצעה בביטחון, בלי להיתקע בפחדים ובלי תוכנות יקרות.",
  },
];

const track: { icon: LucideIcon; text: string }[] = [
  { icon: HardHat, text: "עסקאות שטח אמיתיות, רכישות Single Family ופרוטפוליו/ים." },
  { icon: Handshake, text: "ליווי והכשרת מחזורים של יזמים להגשת הצעות וסגירת עסקאות." },
  { icon: Mic, text: "שיתוף ידע שוטף מהשטח: פודקאסטים, קהילה ותוכן מקצועי." },
];

const stats: { value: string; label: string }[] = [
  { value: "40", label: "פרויקטי נדל״ן בארה״ב" },
  { value: "6", label: "שנות ניסיון בתחום" },
  { value: "30+", label: "תלמידים" },
];

export default function InstructorSection() {
  return (
    <section className="px-5 py-20 lg:py-28" aria-labelledby="instructor-heading">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <div>
            <span className="eyebrow">המנחה</span>
            <h2
              id="instructor-heading"
              className="mt-5 font-extrabold tracking-tight text-cloud text-[clamp(2.25rem,5.6vw,3.8rem)]"
            >
              מי יעביר לך את הסדנה?
            </h2>
          </div>
        </Reveal>

        {/* Authority stats */}
        <Reveal delay={0.05}>
          <div className="mt-10 grid grid-cols-3 gap-px overflow-hidden rounded-2xl border border-drift/15 bg-drift/15">
            {stats.map((s) => (
              <div key={s.label} className="bg-night px-3 py-7 text-center sm:py-9">
                <div className="ltr-nums font-extrabold tracking-tight text-gold text-[clamp(2.5rem,7vw,4.5rem)]">
                  {s.value}
                </div>
                <div className="mx-auto mt-1.5 max-w-[10rem] text-base font-semibold leading-snug text-drift sm:text-lg">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-10 md:grid-cols-[300px_1fr] md:items-start md:gap-14">
          {/* Identity */}
          <Reveal>
            <div className="md:sticky md:top-8">
              <InstructorPortrait />
              <div className="mt-5">
                <h3 className="text-3xl font-extrabold tracking-tight text-cloud">אוהד עוז</h3>
                <p className="ltr-nums mt-0.5 text-base font-semibold text-drift">Ohad Ozalvo</p>
                <p className="mt-4 text-xl leading-relaxed text-drift">
                  יזם נדל״ן פעיל בארה״ב · אוהיו ואינדיאנה. מנהל פורטפוליו עסקאות ומנטור למשקיעים.
                </p>
              </div>
            </div>
          </Reveal>

          {/* Story + proof */}
          <div>
            <div className="divide-y divide-drift/12 border-y border-drift/12">
              {story.map((block, i) => (
                <Reveal key={block.label} delay={i * 0.06}>
                  <article className="py-7">
                    <div className="text-sm font-bold uppercase tracking-[0.18em] text-gold">
                      {block.label}
                    </div>
                    <p className="mt-3 text-xl leading-relaxed text-cloud/90">{block.body}</p>
                  </article>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.12}>
              <div className="mt-8">
                <div className="text-sm font-bold uppercase tracking-[0.18em] text-gold">
                  ההוכחה בשטח
                </div>
                <ul className="mt-4 space-y-px overflow-hidden rounded-xl bg-drift/15">
                  {track.map((item) => (
                    <li
                      key={item.text}
                      className="flex items-center gap-3.5 bg-night px-4 py-3.5"
                    >
                      <item.icon className="h-[18px] w-[18px] shrink-0 text-gold" strokeWidth={2} aria-hidden="true" />
                      <span className="text-xl leading-relaxed text-cloud/90">{item.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Editorial portrait frame - real photo with a styled monogram fallback. */
function InstructorPortrait() {
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-drift/15 bg-cloud/[0.03]">
      {imgFailed ? (
        <div className="flex h-full w-full items-center justify-center" role="img" aria-label="אוהד עוז">
          <span className="text-6xl font-extrabold text-gold">א״ע</span>
        </div>
      ) : (
        <img
          src="/images/instructor.jpg"
          alt="אוהד עוז"
          loading="lazy"
          onError={() => setImgFailed(true)}
          className="h-full w-full object-cover"
        />
      )}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-night/80 to-transparent px-4 pb-3 pt-10">
        <span className="text-sm font-bold uppercase tracking-[0.18em] text-cloud">מנחה הסדנה</span>
      </div>
    </div>
  );
}

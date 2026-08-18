import { useState } from "react";
import { BadgeCheck, Compass, Zap, HardHat, Handshake, Mic, MapPin } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Reveal from "./ui/Reveal";

const story: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: Compass,
    title: "המסע והנוכחות בשטח",
    body: "אוהד הוא יזם נדל״ן שחי את השטח בארה״ב — בעיקר בשווקים של אוהיו ואינדיאנה. לא גורו של שקפים ותיאוריות, אלא יזם שמנהל עסקאות מורכבות מקצה לקצה: מאיתור נכסים מתחת למחיר השוק (Off-Market), דרך ניהול שיפוצים (Rehab) ועסקאות BRRRR, ועד השבחה, השכרה והחזקת פורטפוליו.",
  },
  {
    icon: Zap,
    title: "השיטה המעשית (Zero Fluff)",
    body: "כל מה שתלמד נבנה מתוך הפרקטיקה היומיומית — שיחות אמיתיות מול ברוקרים, סוכנים, קבלנים וחברות טייטל. הסדנה מנגישה בדיוק את התהליך הזה: איך לדבר בשפה של השוק, לנתח עסקה ב-5 דקות, ולהגיש הצעה בביטחון — בלי להיתקע בפחדים ובלי תוכנות יקרות.",
  },
];

const track: { icon: LucideIcon; text: string }[] = [
  {
    icon: HardHat,
    text: "עסקאות שטח אמיתיות — רכישות ב-Single Family וב-Multi Family.",
  },
  {
    icon: Handshake,
    text: "ליווי והכשרת מחזורים של יזמים להגשת הצעות וסגירת עסקאות.",
  },
  {
    icon: Mic,
    text: "שיתוף ידע שוטף מהשטח — פודקאסטים, קהילה ותוכן מקצועי.",
  },
];

export default function InstructorSection() {
  return (
    <section className="px-4 py-16 lg:py-24" aria-labelledby="instructor-heading">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <h2
            id="instructor-heading"
            className="text-center text-3xl font-extrabold tracking-tight text-cloud-50 sm:text-4xl"
          >
            מי יעביר לך את הסדנה?
          </h2>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-[300px_1fr] md:items-start md:gap-10">
          {/* ---- Identity card ---- */}
          <Reveal>
            <div className="md:sticky md:top-8">
              <div className="relative mx-auto w-full max-w-[300px]">
                <div className="rounded-3xl border border-slate-800 bg-gradient-to-b from-ink-700 to-ink-800 p-2 shadow-tactile-lg">
                  <InstructorPortrait />
                </div>
                <div className="mt-5 text-center">
                  <h3 className="text-2xl font-extrabold tracking-tight text-cloud-50">אוהד עוז</h3>
                  <p className="ltr-nums mt-0.5 text-sm font-semibold text-slate-400">
                    Ohad Ozalvo
                  </p>
                  <p className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-300">
                    <BadgeCheck className="h-4 w-4" strokeWidth={2.2} aria-hidden="true" />
                    יזם נדל״ן פעיל בארה״ב
                  </p>
                  <p className="mt-3 flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-300">
                    <MapPin className="h-3.5 w-3.5 text-amber-400" strokeWidth={2.2} aria-hidden="true" />
                    אוהיו · אינדיאנה
                  </p>
                  <p className="mt-3 text-[13px] leading-relaxed text-slate-300">
                    מנהל פורטפוליו עסקאות ומנטור למשקיעים.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>

          {/* ---- Story column ---- */}
          <div className="flex flex-col gap-6">
            {story.map((block, i) => (
              <Reveal key={block.title} delay={i * 0.08}>
                <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-tactile backdrop-blur-sm sm:p-7">
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-500/[0.08] text-amber-400 ring-1 ring-inset ring-amber-500/25">
                      <block.icon className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
                    </span>
                    <h3 className="text-lg font-bold tracking-tight text-cloud-50">{block.title}</h3>
                  </div>
                  <p className="mt-4 text-base leading-relaxed text-slate-200">{block.body}</p>
                </article>
              </Reveal>
            ))}

            {/* ---- Track record grid ---- */}
            <Reveal delay={0.16}>
              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-tactile backdrop-blur-sm sm:p-7">
                <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-amber-400">
                  ההוכחה בשטח
                </h3>
                <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {track.map((item) => (
                    <li
                      key={item.text}
                      className="flex flex-col gap-3 rounded-xl border border-slate-800 bg-ink-900/50 p-4 shadow-tactile"
                    >
                      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/[0.08] text-amber-400 ring-1 ring-inset ring-amber-500/25">
                        <item.icon className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
                      </span>
                      <span className="text-sm leading-relaxed text-slate-200">{item.text}</span>
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

/** Editorial portrait frame — shows the instructor photo, with a styled
 *  monogram fallback if the image is missing or fails to load. */
function InstructorPortrait() {
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-gradient-to-br from-ink-800 via-ink-900 to-black ring-1 ring-inset ring-amber-500/30">
      <div
        className="absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_50%_30%,rgba(245,158,11,0.25),transparent_60%)]"
        aria-hidden="true"
      />

      {imgFailed ? (
        // Fallback: styled monogram, used until the real photo is added.
        <div
          className="flex h-full w-full items-center justify-center"
          role="img"
          aria-label="אוהד עוז"
        >
          <div className="flex h-28 w-28 items-center justify-center rounded-full border border-amber-500/40 bg-ink-900 text-4xl font-extrabold text-amber-400 shadow-[0_0_40px_-10px_rgba(245,158,11,0.5)] ring-1 ring-inset ring-white/[0.04]">
            א״ע
          </div>
        </div>
      ) : (
        <img
          src="/images/instructor.jpg"
          alt="אוהד עוז"
          loading="lazy"
          onError={() => setImgFailed(true)}
          className="relative h-full w-full object-cover"
        />
      )}

      <div className="absolute bottom-3 left-3 right-3 rounded-xl border border-slate-800 bg-ink-900/80 px-3 py-2 text-center shadow-tactile backdrop-blur">
        <span className="text-xs font-semibold text-slate-300">מנחה הסדנה</span>
      </div>
    </div>
  );
}

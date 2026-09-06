import { useEffect, useRef, useState } from "react";

const PREVIEW_SRC = "/vsl/vsl-preview.mp4";
const FULL_SRC = "/vsl/vsl-full.mp4";
const POSTER = "/vsl/vsl-poster.jpg";

/**
 * Interactive VSL player.
 *
 * State A (default): a silent, CONTINUOUSLY-looping preview (muted autoplay, no
 * controls). Looping is made bulletproof with several redundant layers because
 * mobile Safari/Chrome silently halt native `loop`:
 *   - the muted ATTRIBUTE is forced via defaultMuted (React only sets the muted
 *     property, which iOS/WebKit ignore when re-checking autoplay on each loop),
 *   - the native `loop` attribute,
 *   - onEnded (JSX) + a direct `ended` listener that reset to 0 and re-play,
 *   - onTimeUpdate that catches an end-of-clip stall before a frozen frame shows,
 *   - visibility/focus/pageshow resume so a tab switch never leaves it paused.
 *
 * State B (on click/tap anywhere): swaps to the full VSL, unmuted, from 0:00,
 * with native controls - synchronously inside the click handler so unmuted
 * playback stays within the user-gesture window (mobile). A single <video>
 * element is reused (never remounted) so there is zero layout shift.
 */
export default function VslPlayer() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [active, setActive] = useState(false);

  // Start the muted preview loop on mount.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    // Force the muted ATTRIBUTE (not just the property) so WebKit/Chromium keep
    // permitting autoplay + loop restarts. React's `muted` prop alone is not enough.
    v.defaultMuted = true;
    v.muted = true;
    v.setAttribute("muted", "");
    v.loop = true;
    v.src = PREVIEW_SRC;
    v.play().catch(() => {
      /* muted autoplay may be blocked while backgrounded - poster shows */
    });
  }, []);

  // Direct `ended` listener on the node (belt-and-suspenders with the JSX onEnded)
  // for browsers where the native loop halts and fires `ended` instead.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const handleEnded = () => {
      if (!active) {
        video.currentTime = 0;
        video.play().catch(() => {});
      }
    };
    video.addEventListener("ended", handleEnded);
    return () => video.removeEventListener("ended", handleEnded);
  }, [active]);

  // Resume the preview if a tab/visibility/focus change paused it (only while the
  // full VSL hasn't been activated - never override the user's manual pause).
  useEffect(() => {
    const resume = () => {
      const v = videoRef.current;
      if (v && !active && v.paused) v.play().catch(() => {});
    };
    document.addEventListener("visibilitychange", resume);
    window.addEventListener("pageshow", resume);
    window.addEventListener("focus", resume);
    return () => {
      document.removeEventListener("visibilitychange", resume);
      window.removeEventListener("pageshow", resume);
      window.removeEventListener("focus", resume);
    };
  }, [active]);

  const activate = () => {
    if (active) return;
    const v = videoRef.current;
    if (!v) return;
    // All synchronous, inside the user gesture -> unmuted playback is allowed.
    v.loop = false;
    v.muted = false;
    v.removeAttribute("muted");
    v.src = FULL_SRC;
    v.load();
    v.play().catch(() => {
      /* if autoplay-with-sound is refused, the visible controls let them start it */
    });
    setActive(true);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!active && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      activate();
    }
  };

  return (
    <div
      className={`relative aspect-video w-full overflow-hidden rounded-2xl border border-drift/20 bg-night shadow-card ring-1 ring-white/5 ${
        active ? "" : "cursor-pointer"
      }`}
      onClick={activate}
      onKeyDown={onKeyDown}
      role={active ? undefined : "button"}
      tabIndex={active ? undefined : 0}
      aria-label={active ? undefined : "הפעל את הסרטון המלא עם סאונד"}
    >
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        muted={!active}
        loop={!active}
        playsInline
        preload="auto"
        controls={active}
        poster={POSTER}
        onEnded={(e) => {
          // JS fallback loop for browsers that ignore the native loop (preview only).
          if (!active) {
            e.currentTarget.currentTime = 0;
            const p = e.currentTarget.play();
            if (p !== undefined) p.catch(() => {});
          }
        }}
        onTimeUpdate={(e) => {
          // Safety net: some mobile browsers stall in the final fraction of a
          // second without firing `ended` - reset just before a frozen frame shows.
          if (active) return;
          const v = e.currentTarget;
          if (v.duration && v.currentTime > 0.5 && v.currentTime >= v.duration - 0.12) {
            v.currentTime = 0;
            v.play().catch(() => {});
          }
        }}
      >
        הדפדפן שלך אינו תומך בהצגת וידאו.
      </video>
    </div>
  );
}

import { useEffect, useRef, useState } from "react";
import { Play } from "lucide-react";

const PREVIEW_SRC = "/vsl/vsl-preview.mp4";
const FULL_SRC = "/vsl/vsl-full.mp4";
const POSTER = "/vsl/vsl-poster.jpg";

/**
 * Interactive VSL player.
 *
 * State A (default): a silent, looping preview (muted autoplay, no controls) with
 * an eye-catching overlay inviting the visitor to watch with sound.
 * State B (on click/tap): swaps to the full VSL, unmuted, from 0:00, with native
 * controls. The swap + play() happen SYNCHRONOUSLY inside the click handler so the
 * unmuted playback stays within the user-gesture window (required on mobile).
 *
 * A single <video> element is reused (never remounted) so there is zero layout
 * shift and the gesture is preserved.
 */
export default function VslPlayer() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [active, setActive] = useState(false);

  // Start the muted preview loop on mount.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.loop = true;
    v.controls = false;
    v.src = PREVIEW_SRC;
    v.play().catch(() => {
      /* muted autoplay may still be blocked while backgrounded - poster shows */
    });
  }, []);

  const activate = () => {
    if (active) return;
    const v = videoRef.current;
    if (!v) return;
    // All synchronous, inside the user gesture -> unmuted playback is allowed.
    v.muted = false;
    v.loop = false;
    v.controls = true;
    v.src = FULL_SRC;
    v.load();
    v.currentTime = 0;
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
      className="group relative aspect-video w-full overflow-hidden rounded-2xl border border-drift/20 bg-night shadow-card ring-1 ring-white/5"
      onClick={activate}
      onKeyDown={onKeyDown}
      role={active ? undefined : "button"}
      tabIndex={active ? undefined : 0}
      aria-label={active ? undefined : "הפעל את הסרטון המלא עם סאונד"}
    >
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        playsInline
        preload="auto"
        poster={POSTER}
      >
        הדפדפן שלך אינו תומך בהצגת וידאו.
      </video>

      {/* Preview overlay - hidden once the full VSL is active */}
      {!active && (
        <div className="pointer-events-none absolute inset-0 flex cursor-pointer flex-col items-center justify-center gap-4 bg-gradient-to-t from-night/70 via-night/10 to-night/30 transition-opacity duration-300">
          <span className="relative flex h-20 w-20 items-center justify-center">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold/40" />
            <span className="relative inline-flex h-20 w-20 items-center justify-center rounded-full bg-gold text-night shadow-cta transition-transform duration-300 group-hover:scale-105">
              <Play className="h-9 w-9 translate-x-0.5 fill-current" strokeWidth={0} aria-hidden="true" />
            </span>
          </span>
          <span className="rounded-full bg-night/70 px-5 py-2 text-lg font-bold text-cloud backdrop-blur-sm sm:text-xl">
            🔊 לחץ כאן לצפייה עם סאונד
          </span>
        </div>
      )}
    </div>
  );
}

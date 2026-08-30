import { useEffect, useRef, useState } from "react";

const PREVIEW_SRC = "/vsl/vsl-preview.mp4";
const FULL_SRC = "/vsl/vsl-full.mp4";
const POSTER = "/vsl/vsl-poster.jpg";

/**
 * Interactive VSL player.
 *
 * State A (default): a silent, continuously-looping preview (muted autoplay, no
 * controls, no overlay - the video already carries its own graphic).
 * State B (on click/tap anywhere): swaps to the full VSL, unmuted, from 0:00,
 * with native controls. The swap + play() happen SYNCHRONOUSLY inside the click
 * handler so unmuted playback stays within the user-gesture window (mobile).
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
    v.src = PREVIEW_SRC;
    v.play().catch(() => {
      /* muted autoplay may be blocked while backgrounded - poster shows */
    });
  }, []);

  const activate = () => {
    if (active) return;
    const v = videoRef.current;
    if (!v) return;
    // All synchronous, inside the user gesture -> unmuted playback is allowed.
    v.muted = false;
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
          // JS fallback loop for browsers that ignore the loop attribute (preview only).
          if (!active) {
            e.currentTarget.currentTime = 0;
            e.currentTarget.play().catch(() => {});
          }
        }}
      >
        הדפדפן שלך אינו תומך בהצגת וידאו.
      </video>
    </div>
  );
}

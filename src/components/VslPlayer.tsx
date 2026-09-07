import { useEffect, useRef, useState } from "react";

const PREVIEW_SRC = "/vsl/vsl-preview.mp4";
const FULL_SRC = "/vsl/vsl-full.mp4";
const POSTER = "/vsl/vsl-poster.jpg";

/**
 * Interactive VSL player - bulletproof preview loop.
 *
 * Uses TWO distinct <video> elements (not a single tag whose src is swapped):
 *   - Preview (rendered only when !active): silent, looping teaser. It is never
 *     allowed to reach EOF - a `timeupdate` handler loops it back ~0.25s before
 *     the true end, because WebKit/Chromium stall the video buffer at EOF and
 *     pause permanently. `ended` + `pause` handlers are extra safety nets.
 *   - Full VSL (rendered only when active): unmuted, native controls, from 0:00.
 *
 * Both live in the same fixed aspect-video container, so switching between them
 * causes zero layout shift.
 */
export default function VslPlayer() {
  const previewRef = useRef<HTMLVideoElement>(null);
  const fullVideoRef = useRef<HTMLVideoElement>(null);
  const [active, setActive] = useState(false);

  // Preview: keep it looping seamlessly and never let it hit the end.
  useEffect(() => {
    if (active) return;
    const video = previewRef.current;
    if (!video) return;

    // Force the muted + playsinline ATTRIBUTES (not just the properties) so
    // iOS/WebKit keep permitting autoplay across every loop restart.
    video.muted = true;
    video.defaultMuted = true;
    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");

    const startPlayback = () => {
      video.play().catch(() => {});
    };
    startPlayback();

    // Loop back ~0.25s BEFORE the true end so it never stalls or pauses at EOF.
    const handleTimeUpdate = () => {
      if (video.duration && video.currentTime >= video.duration - 0.25) {
        video.currentTime = 0.01;
        video.play().catch(() => {});
      }
    };

    // Extra safety nets: if it ever does reach the end, or gets paused by the
    // browser (tab/focus change), immediately restart from the top.
    const handleEnded = () => {
      video.currentTime = 0.01;
      video.play().catch(() => {});
    };

    const handlePause = () => {
      if (!active) video.play().catch(() => {});
    };

    // Resume when a hidden tab becomes visible / the window regains focus.
    const handleResume = () => {
      if (!active) video.play().catch(() => {});
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("ended", handleEnded);
    video.addEventListener("pause", handlePause);
    document.addEventListener("visibilitychange", handleResume);
    window.addEventListener("pageshow", handleResume);
    window.addEventListener("focus", handleResume);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("ended", handleEnded);
      video.removeEventListener("pause", handlePause);
      document.removeEventListener("visibilitychange", handleResume);
      window.removeEventListener("pageshow", handleResume);
      window.removeEventListener("focus", handleResume);
    };
  }, [active]);

  // Full VSL: when activated (right after the user's click), start from 0 with
  // sound. The click grants transient user activation, so play() is permitted.
  useEffect(() => {
    if (!active) return;
    const video = fullVideoRef.current;
    if (!video) return;
    video.currentTime = 0;
    video.play().catch(() => {
      /* if refused, the visible native controls let the user start it */
    });
  }, [active]);

  const activate = () => setActive(true);
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!active && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      setActive(true);
    }
  };

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-drift/20 bg-night shadow-card ring-1 ring-white/5">
      {!active ? (
        <div
          className="absolute inset-0 cursor-pointer"
          onClick={activate}
          onKeyDown={onKeyDown}
          role="button"
          tabIndex={0}
          aria-label="הפעל את הסרטון המלא עם סאונד"
        >
          <video
            ref={previewRef}
            src={PREVIEW_SRC}
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster={POSTER}
          >
            הדפדפן שלך אינו תומך בהצגת וידאו.
          </video>
        </div>
      ) : (
        <video
          ref={fullVideoRef}
          src={FULL_SRC}
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          controls
          playsInline
          preload="auto"
        >
          הדפדפן שלך אינו תומך בהצגת וידאו.
        </video>
      )}
    </div>
  );
}

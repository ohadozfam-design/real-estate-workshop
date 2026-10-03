import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent, MouseEvent } from "react";
import { Mic, Pause, Play } from "lucide-react";

type Props = {
  src: string;
  /** 0..1 bar heights, precomputed from the recording itself (RMS per slice). */
  peaks: number[];
  /** Seconds, shown until the browser has read the file's metadata. */
  durationHint: number;
  speaker: string;
  caption: string;
};

const fmt = (s: number) => {
  const t = Math.max(0, Math.floor(s));
  return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, "0")}`;
};

/**
 * WhatsApp-style voice note: play/pause, a waveform that doubles as the
 * progress bar (click or arrow keys to seek), and elapsed / total time. Media
 * timelines and the play glyph stay LTR on this RTL page, per the usual
 * bidi convention for playback controls.
 */
export default function VoiceNotePlayer({ src, peaks, durationHint, speaker, caption }: Props) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(durationHint);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const onTime = () => setCurrent(a.currentTime);
    const onMeta = () => {
      if (Number.isFinite(a.duration) && a.duration > 0) setDuration(a.duration);
    };
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onEnded = () => {
      setPlaying(false);
      setCurrent(0);
      a.currentTime = 0;
    };
    a.addEventListener("timeupdate", onTime);
    a.addEventListener("loadedmetadata", onMeta);
    a.addEventListener("play", onPlay);
    a.addEventListener("pause", onPause);
    a.addEventListener("ended", onEnded);
    return () => {
      a.removeEventListener("timeupdate", onTime);
      a.removeEventListener("loadedmetadata", onMeta);
      a.removeEventListener("play", onPlay);
      a.removeEventListener("pause", onPause);
      a.removeEventListener("ended", onEnded);
    };
  }, []);

  function toggle() {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) void a.play().catch(() => setPlaying(false));
    else a.pause();
  }

  function seekTo(seconds: number) {
    const a = audioRef.current;
    if (!a) return;
    const t = Math.min(Math.max(seconds, 0), duration);
    a.currentTime = t;
    setCurrent(t);
  }

  function onWaveClick(e: MouseEvent<HTMLDivElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    seekTo(((e.clientX - r.left) / r.width) * duration);
  }

  function onWaveKey(e: KeyboardEvent<HTMLDivElement>) {
    const step = { ArrowRight: 5, ArrowUp: 5, ArrowLeft: -5, ArrowDown: -5 }[e.key];
    if (step === undefined) return;
    e.preventDefault();
    seekTo(current + step);
  }

  const progress = duration ? current / duration : 0;
  const playedBars = Math.round(progress * peaks.length);

  return (
    <figure className="mx-auto max-w-2xl">
      <figcaption className="text-center text-2xl font-extrabold tracking-tight text-cloud md:text-3xl">
        {caption}
      </figcaption>

      <div className="mt-6 flex items-center gap-4 rounded-3xl border border-drift/20 bg-[#1b262d] p-4 shadow-card sm:p-5">
        {/* Speaker avatar */}
        <div className="relative hidden shrink-0 sm:block">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gold/15 ring-1 ring-gold/30">
            <span className="text-xl font-extrabold text-gold">{speaker.charAt(0)}</span>
          </div>
          <span className="absolute -bottom-1 -left-1 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-[#1b262d]">
            <Mic className="h-3.5 w-3.5 text-night" strokeWidth={2.6} aria-hidden="true" />
          </span>
        </div>

        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? "השהיית ההקלטה" : "השמעת ההקלטה"}
          className="focus-ring flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gold text-night shadow-cta transition-transform duration-200 motion-safe:hover:scale-105"
        >
          {playing ? (
            <Pause className="h-6 w-6 fill-current" strokeWidth={2} aria-hidden="true" />
          ) : (
            <Play className="h-6 w-6 translate-x-px fill-current" strokeWidth={2} aria-hidden="true" />
          )}
        </button>

        <div className="min-w-0 flex-1">
          <div className="mb-1.5 text-sm font-bold text-drift">{speaker} · הודעה קולית</div>
          <div
            dir="ltr"
            role="slider"
            tabIndex={0}
            aria-label="מיקום בהקלטה"
            aria-valuemin={0}
            aria-valuemax={Math.round(duration)}
            aria-valuenow={Math.round(current)}
            aria-valuetext={`${fmt(current)} מתוך ${fmt(duration)}`}
            onClick={onWaveClick}
            onKeyDown={onWaveKey}
            className="focus-ring flex h-10 cursor-pointer items-center gap-[2px] rounded-md"
          >
            {peaks.map((p, i) => (
              <span
                key={i}
                className={`flex-1 rounded-full transition-colors duration-150 ${
                  i < playedBars ? "bg-gold" : "bg-drift/30"
                }`}
                style={{ height: `${Math.round(p * 100)}%` }}
                aria-hidden="true"
              />
            ))}
          </div>
          <div dir="ltr" className="mt-1.5 flex justify-between text-sm font-semibold text-drift">
            <span className="ltr-nums">{fmt(current)}</span>
            <span className="ltr-nums">{fmt(duration)}</span>
          </div>
        </div>
      </div>

      <audio ref={audioRef} src={src} preload="metadata" />
    </figure>
  );
}

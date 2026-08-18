import { Lock, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

type CtaButtonProps = {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  showLock?: boolean;
  pulse?: boolean;
  size?: "md" | "lg";
  loading?: boolean;
  disabled?: boolean;
  "aria-label"?: string;
};

export default function CtaButton({
  children,
  onClick,
  className = "",
  showLock = true,
  pulse = true,
  size = "lg",
  loading = false,
  disabled = false,
  "aria-label": ariaLabel,
}: CtaButtonProps) {
  const pad = size === "lg" ? "px-7 py-[18px] text-lg sm:text-xl" : "px-5 py-3 text-base";
  const isDisabled = disabled || loading;

  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      aria-busy={loading}
      disabled={isDisabled}
      whileHover={isDisabled ? undefined : { scale: 1.015, y: -2 }}
      whileTap={isDisabled ? undefined : { scale: 0.985 }}
      transition={{ type: "spring", stiffness: 380, damping: 24 }}
      className={`focus-ring group relative inline-flex w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-gold-cta font-extrabold tracking-tight text-slate-950 shadow-cta ${pad} ${
        pulse && !isDisabled ? "animate-pulse-glow" : ""
      } ${isDisabled ? "cursor-not-allowed opacity-80" : ""} ${className}`}
    >
      {/* top inner highlight for a molded, tactile edge */}
      <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/50" aria-hidden="true" />
      {/* moving shine on hover */}
      {!isDisabled && (
        <span
          className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-l from-transparent via-white/30 to-transparent group-hover:animate-shimmer"
          aria-hidden="true"
        />
      )}
      {loading ? (
        <Loader2 className="h-5 w-5 shrink-0 animate-spin" strokeWidth={2.5} aria-hidden="true" />
      ) : (
        showLock && (
          <Lock className="h-[18px] w-[18px] shrink-0" strokeWidth={2.5} aria-hidden="true" />
        )
      )}
      <span className="relative">{children}</span>
    </motion.button>
  );
}

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Assistant", "system-ui", "sans-serif"],
      },
      colors: {
        ink: {
          900: "#0B0F17", // page background (deepest)
          800: "#111827", // secondary background
          700: "#1A2234", // elevated card
          600: "#1E293B", // elevated card alt
          500: "#334155", // borders
        },
        gold: {
          400: "#FBBF24",
          500: "#F59E0B",
          600: "#D97706",
        },
        emerald: {
          400: "#34D399",
          500: "#10B981",
          600: "#059669",
        },
        cloud: {
          50: "#F8FAFC", // headings
          400: "#94A3B8", // muted body
        },
      },
      boxShadow: {
        "gold-glow": "0 0 0 1px rgba(245,158,11,0.35), 0 10px 40px -10px rgba(245,158,11,0.45)",
        "card": "0 24px 60px -28px rgba(0,0,0,0.85)",
        // tactile depth: top inner highlight + bottom inner shade
        "tactile":
          "inset 0 1px 0 0 rgba(248,250,252,0.05), inset 0 -1px 0 0 rgba(0,0,0,0.3), 0 1px 2px 0 rgba(0,0,0,0.4)",
        "tactile-lg":
          "inset 0 1px 0 0 rgba(248,250,252,0.06), 0 30px 60px -30px rgba(0,0,0,0.9)",
        "cta":
          "inset 0 1px 0 0 rgba(255,255,255,0.35), 0 12px 32px -10px rgba(245,158,11,0.55)",
      },
      backgroundImage: {
        "gold-cta": "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
        "radial-fade": "radial-gradient(1200px 600px at 50% -10%, rgba(245,158,11,0.14), transparent 60%)",
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(245,158,11,0.55)" },
          "50%": { boxShadow: "0 0 0 14px rgba(245,158,11,0)" },
        },
        "dash": {
          to: { strokeDashoffset: "-1000" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "shimmer": {
          "100%": { transform: "translateX(100%)" },
        },
        "trail-flow": {
          to: { strokeDashoffset: "-24" },
        },
      },
      animation: {
        "pulse-glow": "pulse-glow 2.2s cubic-bezier(0.4,0,0.6,1) infinite",
        "dash": "dash 30s linear infinite",
        "trail-flow": "trail-flow 1.4s linear infinite",
        "float-slow": "float-slow 6s ease-in-out infinite",
        "shimmer": "shimmer 2.5s infinite",
      },
    },
  },
  plugins: [],
};

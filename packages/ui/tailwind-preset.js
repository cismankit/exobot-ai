/** Shared Tailwind preset — both surfaces (marketing + console) use these
 * tokens. Colors reference the CSS vars in src/tokens.css. */

/** @type {import('tailwindcss').Config} */
const preset = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        surface: { DEFAULT: "var(--surface)", 2: "var(--surface-2)" },
        line: "var(--border)",
        fg: "var(--fg)",
        muted: "var(--muted)",
        signal: { DEFAULT: "var(--signal)", dim: "var(--signal-dim)" },
        danger: { DEFAULT: "var(--danger)", dim: "var(--danger-dim)" },
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        display: ["var(--font-display)"],
        mono: ["var(--font-mono)"],
      },
      boxShadow: {
        signal: "0 0 24px var(--signal-glow)",
        danger: "0 0 24px var(--danger-glow)",
      },
      keyframes: {
        pulseSignal: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.45" },
        },
      },
      animation: {
        "pulse-signal": "pulseSignal 1.6s ease-in-out infinite",
      },
    },
  },
};

export default preset;

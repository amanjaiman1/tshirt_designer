/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Owned palette — DESIGN.md §3. Driven by CSS variables (see styles/tokens.css)
        // so we can flip to a "studio" dark mode without touching components.
        ink: "rgb(var(--c-ink) / <alpha-value>)",
        paper: "rgb(var(--c-paper) / <alpha-value>)",
        accent: "rgb(var(--c-accent) / <alpha-value>)",
        violet: "rgb(var(--c-violet) / <alpha-value>)",
        muted: "rgb(var(--c-muted) / <alpha-value>)",
        line: "rgb(var(--c-line) / <alpha-value>)",
      },
      fontFamily: {
        // Fontshare faces — DESIGN.md §4
        display: ['"Clash Display"', "system-ui", "sans-serif"],
        sans: ['"General Sans"', "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "monospace"],
      },
      letterSpacing: {
        tightest: "-0.04em",
      },
      transitionTimingFunction: {
        // Signature easing — DESIGN.md §6 ("expo-out")
        expo: "cubic-bezier(0.16, 1, 0.3, 1)",
        snap: "cubic-bezier(0.3, 0, 0.2, 1)",
      },
      maxWidth: {
        edge: "1600px",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        marquee: "marquee 28s linear infinite",
      },
    },
  },
  plugins: [],
};

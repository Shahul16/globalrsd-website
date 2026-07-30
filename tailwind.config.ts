import type { Config } from "tailwindcss";

/**
 * GIRSD design system — official institutional palette.
 * Oxford Blue dominant, Royal Gold sparingly for accents only.
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Primary — Oxford Blue
        navy: {
          DEFAULT: "#0B1F3A",
          light: "#16345C",
          dark: "#071527",
        },
        // Secondary — Royal Gold (accents only)
        gold: {
          DEFAULT: "#B88A2E",
          light: "#D2A64A",
          dark: "#8F6B22",
        },
        // Neutrals
        cream: "#F7F7F4",        // page background (Ivory White)
        platinum: "#D8DADF",     // accent
        ink: "#1E1E1E",          // body text
        muted: "#5F6368",        // secondary text
        line: "#E5E7EB",         // borders
      },
      fontFamily: {
        display: ["'Playfair Display'", "Georgia", "serif"],
        body: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        // Soft institutional shadows (no heavy drops)
        card: "0 1px 2px rgba(11,31,58,0.04), 0 4px 12px rgba(11,31,58,0.05)",
        "card-hover": "0 6px 18px rgba(11,31,58,0.09)",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        shimmer: {
          "0%, 100%": { opacity: "0.85" },
          "50%": { opacity: "1" },
        },
        loaderbar: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(300%)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-14px)" },
        },
      },
      animation: {
        fadeUp: "fadeUp 0.8s ease-out both",
        marquee: "marquee 30s linear infinite",
        shimmer: "shimmer 4s ease-in-out infinite",
        loaderbar: "loaderbar 1.1s ease-in-out infinite",
        float: "float 7s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;

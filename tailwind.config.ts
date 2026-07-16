import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#14213D",
          light: "#1F3159",
          dark: "#0C1526",
        },
        gold: {
          DEFAULT: "#C9A227",
          light: "#E0BE4B",
          dark: "#A5841C",
        },
        cream: "#FAF7F0",
      },
      fontFamily: {
        display: ["'Playfair Display'", "Georgia", "serif"],
        body: ["Inter", "system-ui", "sans-serif"],
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

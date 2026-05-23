import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // deep institutional navy void
        void: {
          950: "#050810",
          900: "#080d1a",
          800: "#0c1426",
          700: "#121d38",
          600: "#1a2950",
          500: "#243561",
        },
        // EQUALITY · coordination — the primary signal (luminous azure)
        azure: {
          600: "#3f6fe0",
          500: "#5b8cff",
          400: "#8aadff",
          300: "#b9cdff",
        },
        // LAW · justice · rights — restrained brass gold
        gold: {
          600: "#cf9a35",
          500: "#e3b24f",
          400: "#f0c976",
          300: "#f7dca6",
        },
        // ECONOMY · wealth · mobility — coordination cyan
        cyan: {
          600: "#2bb3aa",
          500: "#3fd1c7",
          400: "#76e0d8",
          300: "#aceee9",
        },
        // POWER · hierarchy · resentment — the tension pole (rose)
        rose: {
          600: "#e8537a",
          500: "#ff6f91",
          400: "#ff9bb1",
          300: "#ffc4d2",
        },
        // TECHNOLOGY · AI · the integrative future (violet aura)
        aura: {
          500: "#9b8cff",
          400: "#b6abff",
          300: "#d2caff",
        },
        // institutional silver
        ink: {
          50: "#f4f7ff",
          100: "#e6ecfa",
          300: "#b4c0db",
          500: "#7d89a8",
        },
      },
      fontFamily: {
        display: ['"Sora"', "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ['"Newsreader"', "ui-serif", "Georgia", "serif"],
        mono: ['"IBM Plex Mono"', "ui-monospace", "monospace"],
        zh: ['"Noto Serif SC"', "serif"],
      },
      boxShadow: {
        relic: "inset 0 1px 0 rgba(180,192,219,0.08), 0 24px 64px -30px rgba(0,0,0,0.92)",
        glow: "0 0 46px -8px rgba(91,140,255,0.5)",
      },
    },
  },
  plugins: [],
};

export default config;

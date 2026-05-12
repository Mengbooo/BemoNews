import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        surface: {
          950: "#0a0a0a",
          900: "#111111",
          800: "#171717",
          700: "#1f1f1f",
        },
        ink: {
          100: "#f5f5f5",
          300: "#d4d4d8",
          400: "#a1a1aa",
          500: "#71717a",
        },
        accent: {
          DEFAULT: "#fafafa",
          muted: "rgba(255,255,255,0.08)",
        },
      },
      borderRadius: {
        sm: "10px",
        md: "14px",
        lg: "20px",
        xl: "28px",
      },
      boxShadow: {
        soft: "0 10px 30px rgba(0,0,0,0.28)",
      },
      fontFamily: {
        sans: ["Geist Sans", "system-ui", "sans-serif"],
        mono: ["Geist Mono", "ui-monospace", "monospace"],
      },
      backgroundImage: {
        grid: "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: "32px 32px",
      },
    },
  },
  plugins: [],
};

export default config;

import type { Config } from "tailwindcss";
import typographyPlugin from "@tailwindcss/typography";
import animatePlugin from "tailwindcss-animate";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#EA580C",
        secondary: "#1E293B",
        "background-light": "#F3F0E7",
        "background-dark": "#0F172A",
        "surface-light": "#FFFFFF",
        "surface-dark": "#1E293B",
        "text-light": "#1F2937",
        "text-dark": "#F3F4F6",
        "muted-light": "#6B7280",
        "muted-dark": "#9CA3AF",

        // Retaining old variables just in case they are used somewhere deeply
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        border: "var(--border)",
      },
      fontFamily: {
        display: ['var(--font-poppins)', 'sans-serif'],
        body: ['var(--font-poppins)', 'sans-serif'],
        sans: ["var(--font-poppins)", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "1.5rem",
        'xl': "1rem",
        '2xl': "1.5rem",
        '3xl': "2rem",
      },
    },
  },
  plugins: [
    typographyPlugin,
    animatePlugin
  ],
};
export default config;

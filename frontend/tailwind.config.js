/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],

  theme: {
    extend: {
      colors: {
        // MAIN DESIGN SYSTEM
        background: "#f9fafb",
        foreground: "#ffffff",
        card: "#ffffff",
        muted: "#f3f4f6",
        border: "#e5e7eb",

        // TEXT
        dark: "#111827",
        "text-light": "#6b7280",

        // PRIMARY (CTA / Buttons)
        primary: "#2563eb",
        "primary-hover": "#1d4ed8",
        "primary-active": "#1e40af",
        "primary-light": "#dbeafe",

        // ACCENT COLORS (Brand personality)
        accent: "#4ecdc4",
        highlight: "#9b5de5",

        // STATUS
        success: "#16a34a",
        warning: "#ffe66d",
        danger: "#dc2626",
      },
    },

    // RESPONSIVE BREAKPOINTS
    screens: {
      xs: "360px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
    },
  },

  plugins: [],
};
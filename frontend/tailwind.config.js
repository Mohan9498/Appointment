/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class", // ✅ ENABLE DARK MODE

  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],

  theme: {
    extend: {
      colors: {
        background: "#0B1120",
        surface: "#111827",
        primary: "#6366F1",
        secondary: "#22D3EE",
        accent: "#A78BFA",
        border: "#1F2937",
        text: {
          main: "#F9FAFB",
          secondary: "#9CA3AF"
        },
      }, 
      
      backdropBlur: {
        xs: "2px", 
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
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class", // ✅ ENABLE DARK MODE

  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],

  theme: {
    extend: {
      colors: { 
        background: "#0F172A", 
        surface: "#111827", 
        border: "#1F2937", 
        primary: "#3B82F6", 
        "primary-hover": "#2563EB", 
        accent: "#6366F1", 
        success: "#22C55E", 
        warning: "#F59E0B", 
        danger: "#EF4444", 
        text: { 
          main: "#E5E7EB", 
          secondary: "#9CA3AF", 
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
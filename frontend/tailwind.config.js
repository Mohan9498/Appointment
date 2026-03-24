/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],

  theme: {
    extend: {
      colors: {
        primary: "#ff6b6b",
        secondary: "#4ecdc4",
        yellow: "#ffe66d",
        purple: "#9b5de5",
        bg: "#f9f9ff"
      }
    },

    screens: {
      xs: "360px",  
      sm: "640px",
      md: "768px",
      lg: "1024px",
    },
  },

  plugins: [],
};
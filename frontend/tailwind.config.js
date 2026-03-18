/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html","./src/**/*.{js,jsx}"],
  theme: {
  extend: {
    colors: {
      primary: "#ff6b6b",   // pink/red
      secondary: "#4ecdc4", // teal
      yellow: "#ffe66d",
      purple: "#9b5de5",
      bg: "#f9f9ff"
    }
  }
},
  plugins: [],
};
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
  extend: {
    colors: {
      primary: "#4F9CF9",
      secondary: "#7ED957",
      accent: "#F9FBFF"
    }
  },
},
  plugins: [],
}
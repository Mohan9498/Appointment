/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class", // ✅ ENABLE DARK MODE

  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],

  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
      },

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

      // ✅ CUSTOM ANIMATIONS
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        'glow-pulse': {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        },
        'slide-in-right': {
          '0%': { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.7s ease-out both',
        'fade-in-up-delay-1': 'fade-in-up 0.7s ease-out 0.15s both',
        'fade-in-up-delay-2': 'fade-in-up 0.7s ease-out 0.3s both',
        'fade-in-up-delay-3': 'fade-in-up 0.7s ease-out 0.45s both',
        'fade-in': 'fade-in 0.5s ease-out both',
        'float': 'float 6s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 4s ease-in-out infinite',
        'slide-in-right': 'slide-in-right 0.6s ease-out both',
        'scale-in': 'scale-in 0.5s ease-out both',
      },

      // ✅ PREMIUM BOX SHADOWS
      boxShadow: {
        'glow-blue': '0 0 40px -10px rgba(59, 130, 246, 0.4)',
        'glow-indigo': '0 0 40px -10px rgba(99, 102, 241, 0.4)',
        'glow-purple': '0 0 40px -10px rgba(139, 92, 246, 0.3)',
        'premium': '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
        'premium-dark': '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
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
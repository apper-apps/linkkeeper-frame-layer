/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#5B67CA",
        secondary: "#9BA3EB",
        accent: "#FF6B6B",
        success: "#4ECDC4",
        warning: "#FFE66D",
        error: "#FF6B6B",
        info: "#5B67CA",
        surface: "#FFFFFF",
        background: "#F7F8FC"
      },
      fontFamily: {
        'display': ['Plus Jakarta Sans', 'sans-serif'],
        'body': ['Inter', 'sans-serif']
      },
      animation: {
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'typing': 'typing 1.5s ease-in-out infinite'
      },
      keyframes: {
        typing: {
          '0%, 60%, 100%': { opacity: '0.3' },
          '30%': { opacity: '1' }
        }
      }
    },
  },
  plugins: [],
}
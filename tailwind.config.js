/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#080607",
        vinho: {
          DEFAULT: "#3B0A18",
          dark: "#1A030A",
          light: "#5A1327",
        },
        rosa: {
          DEFAULT: "#C7798B",
          dark: "#A35C6D",
          light: "#DF9BB0",
        },
        dourado: {
          DEFAULT: "#D8B26E",
          dark: "#B8914D",
          light: "#EAD2A3",
        },
        brancoQuente: "#FFF7F2",
      },
      fontFamily: {
        title: ["'Playfair Display'", "serif"],
        sans: ["'Inter'", "sans-serif"],
      },
      animation: {
        'fade-in-up': 'fadeInUp 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in': 'fadeIn 1s ease-out forwards',
        'float-slow': 'floatSlow 6s ease-in-out infinite',
        'float-medium': 'floatMedium 4s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'grain-anim': 'grainAnim 8s steps(10) infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)', filter: 'blur(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)', filter: 'blur(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0', filter: 'blur(5px)' },
          '100%': { opacity: '1', filter: 'blur(0)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-15px)' },
        },
        floatMedium: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.3', filter: 'brightness(1)' },
          '50%': { opacity: '0.6', filter: 'brightness(1.3)' },
        },
        grainAnim: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '10%': { transform: 'translate(-5%, -5%)' },
          '20%': { transform: 'translate(-10%, 5%)' },
          '30%': { transform: 'translate(5%, -10%)' },
          '40%': { transform: 'translate(-5%, 15%)' },
          '50%': { transform: 'translate(-10%, 5%)' },
          '60%': { transform: 'translate(15%, 0)' },
          '75%': { transform: 'translate(-5%, -10%)' },
          '90%': { transform: 'translate(10%, 5%)' },
        }
      },
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#101118',
          800: '#1A1C27',
          700: '#252838',
        },
        purple: {
          600: '#6C5CE7',
          700: '#5B4BC4',
          50: '#F0EEFF',
        },
        risk: {
          low: '#10B981',
          medium: '#F59E0B',
          high: '#EF4444',
        }
      }
    },
  },
  plugins: [],
}

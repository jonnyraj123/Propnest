/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0b0908',
        champagne: '#ecd2b4',
        rose: '#d9a99a',
      },
      fontFamily: {
        serif: ["'Instrument Serif'", 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}

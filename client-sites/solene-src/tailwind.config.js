import animate from 'tailwindcss-animate'
/** @type {import('tailwindcss').Config} */
const v = (n) => `rgb(var(--${n}) / <alpha-value>)`
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: { sans: ['Inter', 'sans-serif'], serif: ['"Instrument Serif"', 'serif'] },
      colors: { bg: v('bg'), ink: v('ink'), soft: v('soft'), deep: v('deep'), accent: v('accent'), tx: v('text'), onink: v('onink') },
    },
  },
  plugins: [animate],
}

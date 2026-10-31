import animate from 'tailwindcss-animate'
/** @type {import('tailwindcss').Config} */
const v = (n) => `hsl(var(--${n}) / <alpha-value>)`
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: { sans: ['Inter', 'sans-serif'], serif: ['"Instrument Serif"', 'serif'] },
      colors: {
        background: v('background'), foreground: v('foreground'), card: v('card'),
        primary: { DEFAULT: v('primary'), foreground: v('primary-foreground') },
        secondary: { DEFAULT: v('secondary'), foreground: v('secondary-foreground') },
        muted: { DEFAULT: v('muted'), foreground: v('muted-foreground') },
        accent: { DEFAULT: v('accent'), foreground: v('accent-foreground') },
        'hero-sub': v('hero-subtitle'), border: v('border'), input: v('input'), ring: v('ring'),
      },
    },
  },
  plugins: [animate],
}

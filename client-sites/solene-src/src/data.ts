export type Shade = {
  id: string
  name: string
  word: string // giant word behind the model
  line: [string, string] // hero headline
  bg: string // studio colour (r g b)
  ink: string // text on the colour
  soft: string // page background tint
  deep: string // darker tone for buttons/footer
  hex: string // swatch
}

export const SHADES: Shade[] = [
  { id: 'sage', name: 'Sage', word: 'Sage', line: ['Quiet colour,', 'loud presence.'], bg: '124 141 98', ink: '24 33 19', soft: '236 240 228', deep: '58 72 46', hex: '#7c8d62' },
  { id: 'blush', name: 'Blush', word: 'Blush', line: ['Soft as silk,', 'sure as you.'], bg: '221 150 157', ink: '66 22 33', soft: '250 236 238', deep: '120 52 66', hex: '#dd969d' },
  { id: 'terracotta', name: 'Terracotta', word: 'Terra', line: ['Warm days,', 'warmer nights.'], bg: '193 66 30', ink: '255 244 236', soft: '250 233 224', deep: '112 34 14', hex: '#c1421e' },
  { id: 'butter', name: 'Butter', word: 'Butter', line: ['Golden hour,', 'all day long.'], bg: '243 195 104', ink: '58 41 8', soft: '252 244 224', deep: '128 88 18', hex: '#f3c368' },
  { id: 'cobalt', name: 'Cobalt', word: 'Cobalt', line: ['Bold blue,', 'made to be seen.'], bg: '2 63 163', ink: '238 243 255', soft: '230 236 250', deep: '4 32 92', hex: '#023fa3' },
]

export const M = './media/'
export const PRICE = 248
export const SIZES = ['XS', 'S', 'M', 'L', 'XL']

export const NEWS = [
  { tag: 'New in', title: 'The Silk Bow Set lands in five new shades', body: 'One cut, five moods. Hand-finished mulberry silk with a bow you can tie three ways.', shade: 'butter', date: 'Nov 2026' },
  { tag: 'Atelier', title: 'Inside the studio: how we dye silk by hand', body: 'Each shade is mixed in small batches so every piece keeps a soft, living tone.', shade: 'terracotta', date: 'Oct 2026' },
  { tag: 'Care', title: 'Keep your silk glowing for years', body: 'Cool hand-wash, no wringing, dry in the shade. Our three-step care ritual.', shade: 'cobalt', date: 'Oct 2026' },
]

export const REVIEWS = [
  ['Amelia R.', 'New York', 'The sage set is even prettier in person. The silk feels like water.'],
  ['Sofia M.', 'Toronto', 'I wore the blush bow blouse to a wedding and got compliments all night.'],
  ['Hannah L.', 'London', 'Perfect fit, the trousers fall beautifully. Ordering the cobalt next.'],
  ['Priya K.', 'Dubai', 'Packaging was gorgeous and delivery was quick. Feels truly luxury.'],
  ['Chloe D.', 'Paris', 'Terracotta is my new favourite colour. The bow ties so nicely.'],
  ['Maya S.', 'Sydney', 'Comfortable all day at the office, elegant enough for dinner.'],
  ['Grace T.', 'Chicago', 'Butter yellow made me smile every time I looked in the mirror.'],
  ['Zara A.', 'Austin', 'Quality is amazing for the price. Customer care was so kind.'],
]

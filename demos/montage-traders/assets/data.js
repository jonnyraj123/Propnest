/* Montage Traders — shop details and products. Prices are from the shop's own Instagram price lists (July). */
window.SHOP = {
  name: 'Montage Traders',
  whatsapp: '919906761488',
  phones: ['94190 08168', '99067 61488'],
  address: 'Opposite Agriculture Complex, Lal Mandi, Srinagar, Jammu & Kashmir 190008',
  map: 'https://www.google.com/maps/search/?api=1&query=Montage+Traders+Lal+Mandi+Srinagar',
  instagram: 'https://www.instagram.com/montagetraders69/'
};

window.CATS = [
  { id: 'tents', name: 'Camping Tents', short: 'Tents', img: 'tent-l' },
  { id: 'rods', name: 'Fishing Rods', short: 'Rods', img: 'rod-tele' },
  { id: 'combos', name: 'Rod Combos & Accessories', short: 'Combos', img: 'rod-2pc' },
  { id: 'safety', name: 'Waders & Safety', short: 'Waders', img: 'wader' },
  { id: 'aqua', name: 'Aquariums & Fish', short: 'Aquariums', img: 'aquarium' }
];

/* v = variants: [label, price]. price null = ask on WhatsApp. */
window.PRODUCTS = [
  { id: 'dome-tent', name: 'Dome Camping Tent', cat: 'tents', img: ['tent-s', 'tent-l'], label: 'Capacity', tag: 'Bestseller',
    v: [['2 Person · 200×150×110 cm', 1050], ['4 Person · 200×200×135 cm', 1300], ['6 Person · 220×250×150 cm', 1600], ['8 Person · 220×250×150 cm', 2150]],
    about: 'Water-resistant dome tent with fibre poles, mesh windows, double-layer door and a carry bag. Colours may vary.' },
  { id: 'jianggan', name: 'Jianggan Zoom Rod Set', cat: 'rods', img: ['rod-tele'], label: 'Length', tag: 'Best value',
    v: [['170 cm', 550], ['210 cm', 600], ['230 cm', 650]],
    about: 'Telescopic rod that comes ready with line, float and hooks — perfect for a first trip to the lake.' },
  { id: 'shimano-rod', name: 'Shimano Fishing Rod', cat: 'rods', img: ['rod-2pc'], label: 'Length',
    v: [['7 ft · 210 cm', 750], ['8 ft · 240 cm', 800], ['9 ft · 270 cm', 870]],
    about: 'Shimano rod in three lengths for river and lake fishing.' },
  { id: 'semi-corban', name: 'Semi Corban Rod', cat: 'rods', img: ['rod-2pc'], label: 'Length',
    v: [['7 ft · 210 cm', 430], ['8 ft · 240 cm', 500], ['9 ft · 270 cm', 530], ['10 ft · 300 cm', 600]],
    about: 'Light, budget-friendly rod available from 7 to 10 feet.' },
  { id: 'diao-wong', name: 'Diao Wong Rod', cat: 'rods', img: ['rod-tele'], label: 'Length',
    v: [['7 ft · 210 cm', 530], ['8 ft · 240 cm', 600], ['9 ft · 270 cm', 650]],
    about: 'Diao Wong rod in three lengths.' },
  { id: 'rod-combo', name: '2-Piece Rod & Reel Combo', cat: 'combos', img: ['rod-2pc'], label: 'Brand', tag: 'Popular',
    v: [['Draft 2pc · 8 ft', 530], ['Fairy Wolf 2pc · 8 ft', 600], ['ChangJin 2pc · 8 ft', 900], ['Shakespeare 2pc · 8 ft', 1000], ['Shimano 2pc · 8 ft', 1150]],
    about: 'Two-piece 8 ft rod combos from five brands — pick the one that fits your budget.' },
  { id: 'folding-chair', name: 'Folding Camping Chair', cat: 'combos', img: ['chair'], label: 'Type', v: [['Standard', 550]],
    about: 'Folding chair with armrests and a cup holder — for the lakeside or the campsite.' },
  { id: 'tackle-kit', name: 'Floats, Hooks & Line Kit', cat: 'combos', img: ['tackle'], label: 'Type', v: [['Kit', null]],
    about: 'Floats, hooks, sinkers, swivels and line. Ask us on WhatsApp for what is in stock.' },
  { id: 'wader', name: 'Waterproof Chest Wader', cat: 'safety', img: ['wader'], label: 'Type', tag: 'Must-have',
    v: [['Chest wader with boots', 2500]],
    about: 'Waterproof, durable chest wader with boots — comfortable fit for fishing and outdoor work.' },
  { id: 'life-jacket', name: 'Life Jacket', cat: 'safety', img: ['jacket'], label: 'Type', v: [['Adult', 800]],
    about: 'Bright orange life jacket with buckled straps for boating and water sports.' },
  { id: 'aquarium', name: 'Glass Aquarium', cat: 'aqua', img: ['aquarium'], label: 'Size', tag: 'Sale',
    v: [['AQ-12 · 12 inch', 3500], ['AQ-380 · 15 inch', 4200], ['AQ-580 · 23 inch', 5500], ['AQ-620A · 24 inch', 7000], ['AQ-1000 EL · 40 inch', 23000], ['AQ-120B · 48 inch', 29900], ['AQ-150B · 60 inch', 44000]],
    about: 'Aquariums from 12 to 60 inches. Ask us about stands, filters and setting it up.' },
  { id: 'fish', name: 'Ornamental Fish', cat: 'aqua', img: ['fish'], label: 'Type', v: [['Goldfish, angelfish, tetras & more', null]],
    about: 'Healthy ornamental fish for your aquarium. Stock changes often — message us to see what is in today.' }
];

/* Trips around Srinagar — general travel info, gear links point to real products above. */
window.TREKS = [
  { id: 'sonamarg', name: 'Sonamarg', img: 'sonamarg', type: 'Overnight camp', tint: '#3f6a8f',
    line: 'Meadows, glacier views and a night under the stars.',
    facts: [['Best time', 'May – October'], ['Trip type', 'Camping & day hikes'], ['Level', 'Easy'], ['From', 'Srinagar by road']],
    about: ['Sonamarg — the “meadow of gold” — sits beside the Sindh river with snow peaks all around. It is one of the easiest places from Srinagar to pitch a tent and wake up to glacier views.',
      'Most visitors walk up towards Thajiwas glacier, camp by the river, or use Sonamarg as the starting point for the Great Lakes trek.'],
    pack: ['dome-tent', 'folding-chair', 'life-jacket', 'jianggan'],
    tips: ['Nights are cold even in summer — carry warm layers', 'Pitch your tent on flat, high ground away from the river', 'Keep a rain cover handy; weather changes fast'] },
  { id: 'tarsar', name: 'Tarsar–Marsar', img: 'tarsar', type: 'Alpine lakes trek', tint: '#4f7f7a',
    line: 'Multi-day trek past turquoise lakes and high passes.',
    facts: [['Best time', 'July – September'], ['Trip type', 'Multi-day trek'], ['Level', 'Moderate'], ['Starts near', 'Aru, Pahalgam']],
    about: ['Tarsar and Marsar are twin alpine lakes in the Aru valley. The trek crosses green meadows, shepherd camps and a high pass with views over both lakes.',
      'It is a camping trek — you carry or hire a tent for several nights, so light, waterproof gear matters.'],
    pack: ['dome-tent', 'jianggan', 'folding-chair', 'tackle-kit'],
    tips: ['A light 2-person tent saves weight on long days', 'Start early — afternoons can bring rain', 'Carry a basic first-aid kit and water purifier'] },
  { id: 'gangbal', name: 'Gangbal & Lidder', img: 'gangbal', type: 'River & lake fishing', tint: '#7b6aa0',
    line: 'Cold, clear water — the angler’s Kashmir.',
    facts: [['Best time', 'April – October'], ['Trip type', 'Fishing & trekking'], ['Level', 'Easy to moderate'], ['Note', 'Fishing permit needed']],
    about: ['Gangbal lake lies below Mount Harmukh, reached by trek from Naranag. The Lidder river flows through Pahalgam — both are loved by anglers for their cold, clear water.',
      'Fishing in Kashmir’s rivers and lakes needs a permit from the J&K Fisheries Department, so arrange it before your trip.'],
    pack: ['rod-combo', 'wader', 'life-jacket', 'tackle-kit'],
    tips: ['Get your fishing permit before you go', 'Waders keep you dry and warm in snow-fed rivers', 'Always wear a life jacket near deep or fast water'] }
];
/* Other popular places — listed for the demo without photos. */
window.MORE_PLACES = [
  ['Pahalgam', 'Lidder valley, Betaab and Aru — base for many treks', 'dome-tent'],
  ['Gulmarg', 'Gondola rides, meadows in summer and snow in winter', 'dome-tent'],
  ['Dal Lake', 'Shikara rides and houseboats in Srinagar', 'life-jacket'],
  ['Doodhpathri', 'Quiet green meadows and streams', 'folding-chair'],
  ['Gurez', 'Remote valley along the Kishanganga river', 'dome-tent']
];

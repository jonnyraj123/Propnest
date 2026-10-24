/* ALIMUDDIN Garments — all shop details and products live here.
   Price: number = same price for every size, priceBySize = price per size, null = "Ask on WhatsApp". */
window.SHOP = {
  name: 'ALIMUDDIN', sub: 'Garments',
  tagline: 'Wholesale Kidswear · Kolkata',
  whatsapp: '919330634663',
  phones: ['87776 26556', '93306 34663'],
  address: 'V-109, S.A. Farooquie Road, Kolkata – 700018 (Near Union Bank)',
  map: 'https://www.google.com/maps/search/?api=1&query=S.A.+Farooquie+Road+Kolkata+700018',
  moq: 25
};

const S16 = ['16', '18', '20', '22', '24', '26'];
const SKIRT = ['26', '28', '30', '32', '34', 'XL'];
const SKIRT_P = { '26': 200, '28': 200, '30': 200, '32': 230, '34': 230, 'XL': 260 };
const ABC = ['Colour A', 'Colour B', 'Colour C'];

window.CATS = [
  { id: 'skirt', name: 'Skirt Sets', icon: '🎀' },
  { id: 'bell', name: 'Bell-Bottom Sets', icon: '👖' },
  { id: 'coord', name: 'Co-ord Sets', icon: '🌸' },
  { id: 'frock', name: 'Frocks', icon: '👗' },
  { id: 'boys', name: 'Boys Sets', icon: '🧢' },
  { id: 'baby', name: 'Baby Sets', icon: '🍼' },
  { id: 'dung', name: 'Dungarees', icon: '🧸' }
];

window.PRODUCTS = [
  // Skirt sets — 26–30 ₹200 · 32/34 ₹230 · XL ₹260
  { id: 'clock-skirt', name: 'Clock Tee Bandhani Skirt Set', cat: 'skirt', img: [76, 77], sizes: SKIRT, priceBySize: SKIRT_P, colours: ['Navy', 'Olive', 'Purple'], tag: 'Bestseller' },
  { id: 'sweet-skirt', name: 'Sweet Butterfly Skirt Set', cat: 'skirt', img: [78], sizes: SKIRT, priceBySize: SKIRT_P, colours: ABC },
  { id: 'love-lime', name: 'Love Lime Swirl Skirt Set', cat: 'skirt', img: [54], sizes: SKIRT, priceBySize: SKIRT_P, colours: ABC, tag: 'New' },
  { id: 'paris-lilac', name: 'Paris Lilac Layered Skirt Set', cat: 'skirt', img: [80], sizes: SKIRT, priceBySize: SKIRT_P, colours: ABC },
  { id: 'love-lemon', name: 'Love Sequin Lemon Skirt Set', cat: 'skirt', img: [81], sizes: SKIRT, priceBySize: SKIRT_P, colours: ABC },
  { id: 'clock-rose', name: 'Clock Tee Big-Flower Skirt Set', cat: 'skirt', img: [82], sizes: SKIRT, priceBySize: SKIRT_P, colours: ABC, tag: 'Bestseller' },
  { id: 'best-girl', name: 'Best Girl Tulle Skirt Set', cat: 'skirt', img: [84], sizes: SKIRT, priceBySize: SKIRT_P, colours: ABC },
  { id: 'what-skirt', name: 'Stop Doing What Floral Skirt Set', cat: 'skirt', img: [86], sizes: SKIRT, priceBySize: SKIRT_P, colours: ABC },
  { id: 'paris-pink', name: 'Paris Pink Eyelet Skirt Set', cat: 'skirt', img: [87], sizes: SKIRT, priceBySize: SKIRT_P, colours: ABC },
  { id: 'love-pink', name: 'Love Pink Chevron Skirt Set', cat: 'skirt', img: [88], sizes: SKIRT, priceBySize: SKIRT_P, colours: ABC },
  { id: 'vibes', name: 'Vibes Black Floral Skirt Set', cat: 'skirt', img: [89], sizes: SKIRT, priceBySize: SKIRT_P, colours: ABC },
  { id: 'lilac-shirt-skirt', name: 'Lilac Stripe Shirt & Skirt Set', cat: 'skirt', img: [63], sizes: S16, price: null, colours: ABC },

  // Bell-bottom sets
  { id: 'check-flare', name: 'Check Ruffle Shirt & Flare Jeans', cat: 'bell', img: [55, 58, 60], sizes: S16, price: null, colours: ABC, tag: 'Trending' },
  { id: 'satin-flare', name: 'Satin Bow Shirt & Black Flares', cat: 'bell', img: [56, 57, 59], sizes: S16, price: null, colours: ['Wine', 'Bottle Green', 'Navy'] },
  { id: 'bunny-flare', name: 'Bunny Embroidered Shirt & Flares', cat: 'bell', img: [61, 65, 66, 67], sizes: S16, price: null, colours: ['Brown', 'Purple', 'Blue'], tag: 'New' },
  { id: 'butterfly-flare', name: 'Butterfly Squiggle Shirt & Flares', cat: 'bell', img: [62, 64, 70], sizes: S16, price: null, colours: ['Olive', 'Wine', 'Purple'] },
  { id: 'ruffle-black-flare', name: 'Ruffle Shirt & Black Flares', cat: 'bell', img: [83, 85], sizes: S16, price: null, colours: ['Olive', 'Purple', 'Colour C'] },

  // Co-ord sets (codes from the client's catalogue)
  { id: 'c-450rbu', code: '450 RBU', name: 'Love Patch Textured Co-ord', cat: 'coord', img: [41], sizes: S16, price: null, colours: ABC, tag: 'New' },
  { id: 'c-rbu15', code: 'RBU 15 SM', name: 'Wonderful Collar Co-ord', cat: 'coord', img: [39], sizes: S16, price: null, colours: ABC },
  { id: 'c-226js', code: '226 JS', name: 'Stripe Flower Co-ord', cat: 'coord', img: [31], sizes: S16, price: null, colours: ABC },
  { id: 'c-201ab', code: '201 AB', name: 'New York Smiley Shorts Set', cat: 'coord', img: [40], sizes: S16, price: null, colours: ABC },
  { id: 'c-0biab2', code: 'OBI AB 2', name: 'Love Stripe Jogger Set', cat: 'coord', img: [42], sizes: S16, price: null, colours: ABC },
  { id: 'c-11a', code: '11 A', name: 'Fluffy Heart Shorts Set', cat: 'coord', img: [35], sizes: S16, price: null, colours: ABC },
  { id: 'c-g2', code: 'G 2', name: 'Purple Eyelet Shirt & Dhoti Set', cat: 'coord', img: [30], sizes: S16, price: null, colours: ABC },
  { id: 'c-hr1', code: 'HR 1', name: 'Lilac Textured Co-ord', cat: 'coord', img: [12], sizes: S16, price: null, colours: ABC },
  { id: 'c-248x', code: '248 X', name: 'Pink Sequin Collar Co-ord', cat: 'coord', img: [13], sizes: S16, price: null, colours: ABC },
  { id: 'c-204f', code: '204 F', name: 'Mint Print Shorts Set', cat: 'coord', img: [15], sizes: S16, price: null, colours: ABC },
  { id: 'c-202e', code: '202 E', name: 'Teddy Puff Shorts Set', cat: 'coord', img: [17], sizes: S16, price: null, colours: ABC },
  { id: 'c-rbu14', code: 'RBU 14', name: 'Bunny Lace Top & Pant Set', cat: 'coord', img: [11], sizes: S16, price: null, colours: ABC },
  { id: 'c-222a', code: '222 A', name: 'Embroidered Fringe Top & Pant Set', cat: 'coord', img: [14], sizes: S16, price: null, colours: ABC },
  { id: 'c-240fg', code: '240 FG', name: 'Pink Sequin Shirt & Gold Dhoti Set', cat: 'coord', img: [24], sizes: S16, price: null, colours: ABC, tag: 'Festive' },
  { id: 'c-245g', code: '245 G', name: 'Red Sequin Shirt & Gold Dhoti Set', cat: 'coord', img: [44], sizes: S16, price: null, colours: ABC, tag: 'Festive' },
  { id: 'c-200zs', code: '200 ZS', name: 'Green Geo Frill Jumpsuit', cat: 'coord', img: [43], sizes: S16, price: null, colours: ABC },
  { id: 'c-220', code: '220', name: 'Wonderful Flower Top & Skirt', cat: 'coord', img: [32], sizes: S16, price: null, colours: ABC },
  { id: 'yellow-coord', name: 'Sunny Yellow Textured Co-ord', cat: 'coord', img: [19], sizes: S16, price: null, colours: ABC },
  { id: 'love-shorts', name: 'Love Bunny Shorts Set', cat: 'coord', img: [51], sizes: S16, price: null, colours: ABC },
  { id: 'peach-salwar', name: 'Peach Sequin Kurti & Salwar', cat: 'coord', img: [53], sizes: S16, price: null, colours: ABC },
  { id: 'butterfly-skirt', name: 'Butterfly Stripe Top & Tulle Skirt', cat: 'coord', img: [49], sizes: S16, price: null, colours: ABC },
  { id: 'purple-check-skirt', name: 'Purple Sparkle Check Skirt Set', cat: 'coord', img: [36], sizes: S16, price: null, colours: ABC },

  // Frocks
  { id: 'happy-frock', name: 'Happy Tulle Frock', cat: 'frock', img: [79], sizes: S16, price: 110, colours: ['Pink', 'Mint', 'Lilac', 'Yellow'], tag: 'Bestseller' },
  { id: 'f-obia1', code: 'OBI A 1', name: 'Floral Pleated Frock & Leggings', cat: 'frock', img: [27], sizes: S16, price: null, colours: ABC },
  { id: 'f-obia3', code: 'OBI A 3', name: 'Magenta Pleated Frock', cat: 'frock', img: [16], sizes: S16, price: null, colours: ABC },
  { id: 'f-obiaf11', code: 'OBI AF 11', name: 'Polka Lace Collar Frock', cat: 'frock', img: [6], sizes: S16, price: null, colours: ABC },
  { id: 'paisley-frock', name: 'Paisley Silk Festive Frock', cat: 'frock', img: [37], sizes: S16, price: null, colours: ABC, tag: 'Festive' },
  { id: 'yellow-frock', name: 'Lemon Bow Pleated Frock', cat: 'frock', img: [47], sizes: S16, price: null, colours: ABC },
  { id: 'rani-frock', name: 'Rani Pink Bow Frock', cat: 'frock', img: [48], sizes: S16, price: null, colours: ABC },
  { id: 'paris-frock', name: 'I Love Paris Mesh Frock', cat: 'frock', img: [50], sizes: S16, price: null, colours: ABC },
  { id: 'ruffle-frock', name: 'Layered Ruffle Frock', cat: 'frock', img: [2], sizes: S16, price: null, colours: ABC },
  { id: 'red-floral-frock', name: 'Red Floral Frock & Leggings', cat: 'frock', img: [3], sizes: S16, price: null, colours: ABC },

  // Boys sets
  { id: 'kurta-embro', name: 'Embroidered Kurta & Mirror Pant', cat: 'boys', img: [71], sizes: ['16', '18'], price: 130, colours: ['Brown', 'Maroon', 'Purple'], tag: 'Festive' },
  { id: 'kurta-geo', name: 'Geometric Kurta & Pant Set', cat: 'boys', img: [74], sizes: ['16', '18'], price: 130, colours: ['Rust', 'Mauve', 'Olive'] },
  { id: 'sequin-boys', name: 'Sequin Shirt & Dhoti Pant', cat: 'boys', img: [34], sizes: S16, price: 60, colours: ['Yellow', 'Peach', 'Aqua'], tag: 'Festive', note: 'Half sleeve ₹60 · Full sleeve ₹70' },
  { id: 'white-orange', name: 'Sequin Shirt & Shimmer Pant', cat: 'boys', img: [25], sizes: S16, price: 60, colours: ['Orange', 'Maroon', 'Teal'], note: 'Half sleeve ₹60 · Full sleeve ₹70' },
  { id: 'stripe-boys', name: 'Smile Stripe Shirt & Shorts', cat: 'boys', img: [28], sizes: S16, price: 60, colours: ['Maroon', 'Mustard', 'Green'], note: 'Half sleeve ₹60 · Full sleeve ₹70' },
  { id: 'rose-boys', name: 'Rose Print Shirt & Shorts', cat: 'boys', img: [46], sizes: S16, price: 60, colours: ['Orange', 'Pink', 'Aqua'], note: 'Half sleeve ₹60 · Full sleeve ₹70' },

  // Baby / girls sets
  { id: 'pinafore', name: 'Pinafore Top & Pant Set', cat: 'baby', img: [72], sizes: ['16', '18'], price: 130, colours: ['Rose', 'Brown', 'Teal'] },
  { id: 'floral-jacket', name: 'Floral Jacket & Pant Set', cat: 'baby', img: [73], sizes: ['16', '18'], price: 130, colours: ['Grey', 'Blue', 'Pink'] },
  { id: 'mama-set', name: 'Mama Print Top & Pant Set', cat: 'baby', img: [75], sizes: ['16', '18'], price: 130, colours: ABC },
  { id: 'polka-romper', name: 'Polka Ruffle Romper Set', cat: 'baby', img: [26], sizes: S16, price: 70, colours: ['Teal', 'Purple', 'Red'] },
  { id: 'flower-skirt-set', name: 'Wonderful Flower Top & Skirt', cat: 'baby', img: [29], sizes: S16, price: 70, colours: ['Pink', 'Green', 'Peach'] },
  { id: 'floral-frock-legging', name: 'Floral Frock & Leggings', cat: 'baby', img: [9, 21], sizes: S16, price: 70, colours: ABC },
  { id: 'tulle-frock-legging', name: 'Tulle Party Frock & Leggings', cat: 'baby', img: [22], sizes: S16, price: 70, colours: ABC },

  // Dungarees
  { id: 'dung-six', name: 'Number 6 Dungaree Set', cat: 'dung', img: [4, 5, 18, 52], sizes: S16, price: null, colours: ['Green', 'Maroon', 'Brown'] },
  { id: 'dung-graffiti', name: 'Graffiti Print Dungaree Set', cat: 'dung', img: [7, 10], sizes: S16, price: null, colours: ABC },
  { id: 'dung-play', name: 'Lets Play Print Dungaree Set', cat: 'dung', img: [33], sizes: S16, price: null, colours: ABC },
  { id: 'dung-luo', name: 'Luo Print Dungaree Set', cat: 'dung', img: [45], sizes: S16, price: null, colours: ['Rose', 'Sky', 'Sage'] }
];

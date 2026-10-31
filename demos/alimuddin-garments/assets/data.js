/* M.A ALIMUDDIN Garments — all shop details and products live here.
   No prices on the website: the wholesale rate is shared on call / WhatsApp. */
window.SHOP = {
  name: 'M.A ALIMUDDIN', sub: 'Garments',
  tagline: 'Little Stars Wholesale Kidswear',
  whatsapp: '919330634663',
  call: '+919330634663',
  pay: '62903 20193',
  email: 'maalimuddin786@gmail.com',
  qr: '', // payment QR image, e.g. 'img/b/pay-qr.webp'
  phones: ['93306 34663', '87776 26556'],
  address: 'V-109, S.A. Farooquie Road, Kolkata – 700018 (Near Union Bank)',
  map: 'https://www.google.com/maps/search/?api=1&query=S.A.+Farooquie+Road+Kolkata+700018',
  facebook: 'https://www.facebook.com/share/14sLNyNakYf/',
  instagram: 'https://www.instagram.com/ma_alimuddin',
  moq: 24
};

/* Sizes the shop sells: small 16–18, regular 20–30, big 32–34, XL, XXL. Every design has a 3-colour chart. */
const SMALL = ['16', '18'];
const REG = ['20', '22', '24', '26', '28', '30'];
const SKIRT = ['26', '28', '30', '32', '34'];
const BIG = ['26', '28', '30', '32', '34', 'XL', 'XXL'];
window.SIZE_GROUPS = [
  { id: 'small', name: 'Small', range: '16–18', sizes: SMALL, icon: '🧸' },
  { id: 'regular', name: 'Regular', range: '20–30', sizes: ['20', '22', '24', '26', '28', '30'], icon: '🎀' },
  { id: 'big', name: 'Big', range: '32–XXL', sizes: ['32', '34', 'XL', 'XXL'], icon: '👗' }
];
const ABC = ['Colour A', 'Colour B', 'Colour C'];

window.CATS = [
  { id: 'skirt', name: 'Skirt Sets', icon: '🎀' },
  { id: 'bell', name: 'Bell-Bottom Sets', icon: '👖' },
  { id: 'coord', name: 'Co-ord Sets', icon: '🌸' },
  { id: 'frock', name: 'Frocks', icon: '👗' },
  { id: 'baby', name: 'Baby Sets', icon: '🍼' },
  { id: 'dung', name: 'Dungarees', icon: '🧸' }
];

window.PRODUCTS = [
  // Skirt sets
  { id: 'clock-skirt', name: 'Clock Tee Bandhani Skirt Set', cat: 'skirt', img: [76, 77], sizes: SKIRT, colours: ['Navy', 'Olive', 'Purple'], tag: 'Bestseller' },
  { id: 'sweet-skirt', name: 'Sweet Butterfly Skirt Set', cat: 'skirt', img: [78], sizes: SKIRT, colours: ABC },
  { id: 'love-lime', name: 'Love Lime Swirl Skirt Set', cat: 'skirt', img: [54], sizes: SKIRT, colours: ABC, tag: 'New' },
  { id: 'paris-lilac', name: 'Paris Lilac Layered Skirt Set', cat: 'skirt', img: [80], sizes: SKIRT, colours: ABC },
  { id: 'love-lemon', name: 'Love Sequin Lemon Skirt Set', cat: 'skirt', img: [81], sizes: SKIRT, colours: ABC },
  { id: 'clock-rose', name: 'Clock Tee Big-Flower Skirt Set', cat: 'skirt', img: [82], sizes: SKIRT, colours: ABC, tag: 'Bestseller' },
  { id: 'best-girl', name: 'Best Girl Tulle Skirt Set', cat: 'skirt', img: [84], sizes: SKIRT, colours: ABC },
  { id: 'what-skirt', name: 'Stop Doing What Floral Skirt Set', cat: 'skirt', img: [86], sizes: SKIRT, colours: ABC },
  { id: 'paris-pink', name: 'Paris Pink Eyelet Skirt Set', cat: 'skirt', img: [87], sizes: SKIRT, colours: ABC },
  { id: 'love-pink', name: 'Love Pink Chevron Skirt Set', cat: 'skirt', img: [88], sizes: SKIRT, colours: ABC },
  { id: 'vibes', name: 'Vibes Black Floral Skirt Set', cat: 'skirt', img: [89], sizes: SKIRT, colours: ABC },
  { id: 'lilac-shirt-skirt', name: 'Lilac Stripe Shirt & Skirt Set', cat: 'skirt', img: [63], sizes: REG, colours: ABC },

  // Bell-bottom sets
  { id: 'check-flare', name: 'Check Ruffle Shirt & Flare Jeans', cat: 'bell', img: [55, 58, 60], sizes: REG, colours: ABC, tag: 'Trending' },
  { id: 'satin-flare', name: 'Satin Bow Shirt & Black Flares', cat: 'bell', img: [56, 57, 59], sizes: REG, colours: ['Wine', 'Bottle Green', 'Navy'] },
  { id: 'bunny-flare', name: 'Bunny Embroidered Shirt & Flares', cat: 'bell', img: [61, 65, 66, 67], sizes: REG, colours: ['Brown', 'Purple', 'Blue'], tag: 'New' },
  { id: 'butterfly-flare', name: 'Butterfly Squiggle Shirt & Flares', cat: 'bell', img: [62, 64, 70], sizes: REG, colours: ['Olive', 'Wine', 'Purple'] },
  { id: 'ruffle-black-flare', name: 'Ruffle Shirt & Black Flares', cat: 'bell', img: [83, 85], sizes: REG, colours: ['Olive', 'Purple', 'Colour C'] },

  // Co-ord sets (codes from the client's catalogue)
  { id: 'c-450rbu', code: '450 RBU', name: 'Love Patch Textured Co-ord', cat: 'coord', img: [41], sizes: REG, colours: ABC, tag: 'New' },
  { id: 'c-rbu15', code: 'RBU 15 SM', name: 'Wonderful Collar Co-ord', cat: 'coord', img: [39], sizes: REG, colours: ABC },
  { id: 'c-226js', code: '226 JS', name: 'Stripe Flower Co-ord', cat: 'coord', img: [31], sizes: REG, colours: ABC },
  { id: 'c-201ab', code: '201 AB', name: 'New York Smiley Shorts Set', cat: 'coord', img: [40], sizes: REG, colours: ABC },
  { id: 'c-0biab2', code: 'OBI AB 2', name: 'Love Stripe Jogger Set', cat: 'coord', img: [42], sizes: REG, colours: ABC },
  { id: 'c-11a', code: '11 A', name: 'Fluffy Heart Shorts Set', cat: 'coord', img: [35], sizes: REG, colours: ABC },
  { id: 'c-g2', code: 'G 2', name: 'Purple Eyelet Shirt & Dhoti Set', cat: 'coord', img: [30], sizes: REG, colours: ABC },
  { id: 'c-hr1', code: 'HR 1', name: 'Lilac Textured Co-ord', cat: 'coord', img: [12], sizes: REG, colours: ABC },
  { id: 'c-248x', code: '248 X', name: 'Pink Sequin Collar Co-ord', cat: 'coord', img: [13], sizes: REG, colours: ABC },
  { id: 'c-204f', code: '204 F', name: 'Mint Print Shorts Set', cat: 'coord', img: [15], sizes: REG, colours: ABC },
  { id: 'c-202e', code: '202 E', name: 'Teddy Puff Shorts Set', cat: 'coord', img: [17], sizes: REG, colours: ABC },
  { id: 'c-rbu14', code: 'RBU 14', name: 'Bunny Lace Top & Pant Set', cat: 'coord', img: [11], sizes: REG, colours: ABC },
  { id: 'c-222a', code: '222 A', name: 'Embroidered Fringe Top & Pant Set', cat: 'coord', img: [14], sizes: REG, colours: ABC },
  { id: 'c-240fg', code: '240 FG', name: 'Pink Sequin Shirt & Gold Dhoti Set', cat: 'coord', img: [24], sizes: REG, colours: ABC, tag: 'Festive' },
  { id: 'c-245g', code: '245 G', name: 'Red Sequin Shirt & Gold Dhoti Set', cat: 'coord', img: [44], sizes: REG, colours: ABC, tag: 'Festive' },
  { id: 'c-200zs', code: '200 ZS', name: 'Green Geo Frill Jumpsuit', cat: 'coord', img: [43], sizes: REG, colours: ABC },
  { id: 'c-220', code: '220', name: 'Wonderful Flower Top & Skirt', cat: 'coord', img: [32], sizes: REG, colours: ABC },
  { id: 'yellow-coord', name: 'Sunny Yellow Textured Co-ord', cat: 'coord', img: [19], sizes: REG, colours: ABC },
  { id: 'love-shorts', name: 'Love Bunny Shorts Set', cat: 'coord', img: [51], sizes: REG, colours: ABC },
  { id: 'peach-salwar', name: 'Peach Sequin Kurti & Salwar', cat: 'coord', img: [53], sizes: REG, colours: ABC },
  { id: 'butterfly-skirt', name: 'Butterfly Stripe Top & Tulle Skirt', cat: 'coord', img: [49], sizes: REG, colours: ABC },
  { id: 'purple-check-skirt', name: 'Purple Sparkle Check Skirt Set', cat: 'coord', img: [36], sizes: REG, colours: ABC },

  // Frocks
  // New frocks with salwar / leggings — sizes 26–30, 32/34, XL, XXL
  { id: 'bolero-yellow', name: 'Bolero Jacket Frock & Salwar (Yellow chart)', cat: 'frock', img: [90], sizes: BIG, colours: ['Mustard', 'Rani Pink', 'Lime'], tag: 'New' },
  { id: 'bolero-lilac', name: 'Bolero Jacket Frock & Salwar (Lilac chart)', cat: 'frock', img: [91], sizes: BIG, colours: ['Lilac', 'Peach', 'Aqua'], tag: 'New' },
  { id: 'nice-wine', name: "It's Nice Sling-Bag Frock & Leggings (Wine chart)", cat: 'frock', img: [92], sizes: BIG, colours: ['Wine', 'Navy', 'Olive'], tag: 'New' },
  { id: 'nice-mustard', name: "It's Nice Sling-Bag Frock & Leggings (Mustard chart)", cat: 'frock', img: [93], sizes: BIG, colours: ['Mustard', 'Maroon', 'Grey'], tag: 'New' },


  { id: 'happy-frock', name: 'Happy Tulle Frock', cat: 'frock', img: [79], sizes: REG, colours: ['Pink', 'Mint', 'Lilac', 'Yellow'], tag: 'Bestseller' },
  { id: 'f-obia1', code: 'OBI A 1', name: 'Floral Pleated Frock & Leggings', cat: 'frock', img: [27], sizes: REG, colours: ABC },
  { id: 'f-obia3', code: 'OBI A 3', name: 'Magenta Pleated Frock', cat: 'frock', img: [16], sizes: REG, colours: ABC },
  { id: 'f-obiaf11', code: 'OBI AF 11', name: 'Polka Lace Collar Frock', cat: 'frock', img: [6], sizes: REG, colours: ABC },
  { id: 'paisley-frock', name: 'Paisley Silk Festive Frock', cat: 'frock', img: [37], sizes: REG, colours: ABC, tag: 'Festive' },
  { id: 'yellow-frock', name: 'Lemon Bow Pleated Frock', cat: 'frock', img: [47], sizes: REG, colours: ABC },
  { id: 'rani-frock', name: 'Rani Pink Bow Frock', cat: 'frock', img: [48], sizes: REG, colours: ABC },
  { id: 'paris-frock', name: 'I Love Paris Mesh Frock', cat: 'frock', img: [50], sizes: REG, colours: ABC },
  { id: 'ruffle-frock', name: 'Layered Ruffle Frock', cat: 'frock', img: [2], sizes: REG, colours: ABC },
  { id: 'red-floral-frock', name: 'Red Floral Frock & Leggings', cat: 'frock', img: [3], sizes: REG, colours: ABC },

  // Boys sets (listed under Co-ord Sets)
  { id: 'kurta-embro', name: 'Embroidered Kurta & Mirror Pant', cat: 'coord', img: [71], sizes: SMALL, colours: ['Brown', 'Maroon', 'Purple'], tag: 'Festive' },
  { id: 'kurta-geo', name: 'Geometric Kurta & Pant Set', cat: 'coord', img: [74], sizes: SMALL, colours: ['Rust', 'Mauve', 'Olive'] },
  { id: 'sequin-boys', name: 'Sequin Shirt & Dhoti Pant', cat: 'coord', img: [34], sizes: REG, colours: ['Yellow', 'Peach', 'Aqua'], tag: 'Festive' },
  { id: 'white-orange', name: 'Sequin Shirt & Shimmer Pant', cat: 'coord', img: [25], sizes: REG, colours: ['Orange', 'Maroon', 'Teal'] },
  { id: 'stripe-boys', name: 'Smile Stripe Shirt & Shorts', cat: 'coord', img: [28], sizes: REG, colours: ['Maroon', 'Mustard', 'Green'] },
  { id: 'rose-boys', name: 'Rose Print Shirt & Shorts', cat: 'coord', img: [46], sizes: REG, colours: ['Orange', 'Pink', 'Aqua'] },

  // Baby / girls sets
  // New baby frocks with leggings — sizes 16–18
  { id: 'pinafore-maroon', name: 'Bow Pinafore Frock & Leggings (Maroon chart)', cat: 'baby', img: [94], sizes: SMALL, colours: ['Maroon', 'Sage', 'Brown'], tag: 'New' },
  { id: 'pinafore-brown', name: 'Bow Pinafore Frock & Leggings (Brown chart)', cat: 'baby', img: [95], sizes: SMALL, colours: ['Brown', 'Pink', 'Dark Brown'], tag: 'New' },
  { id: 'collar-pocket-frock', name: 'Collar Pocket Frock & Leggings', cat: 'baby', img: [96, 97], sizes: SMALL, colours: ['Brown', 'Purple', 'Olive'], tag: 'New' },
  { id: 'jacket-frock-maroon', name: 'Button Jacket Frock & Leggings', cat: 'baby', img: [98], sizes: SMALL, colours: ['Maroon', 'Teal', 'Grey'], tag: 'New' },
  { id: 'pinafore', name: 'Pinafore Top & Pant Set', cat: 'baby', img: [72], sizes: SMALL, colours: ['Rose', 'Brown', 'Teal'] },
  { id: 'floral-jacket', name: 'Floral Jacket & Pant Set', cat: 'baby', img: [73], sizes: SMALL, colours: ['Grey', 'Blue', 'Pink'] },
  { id: 'mama-set', name: 'Mama Print Top & Pant Set', cat: 'baby', img: [75], sizes: SMALL, colours: ABC },
  { id: 'polka-romper', name: 'Polka Ruffle Romper Set', cat: 'baby', img: [26], sizes: REG, colours: ['Teal', 'Purple', 'Red'] },
  { id: 'flower-skirt-set', name: 'Wonderful Flower Top & Skirt', cat: 'baby', img: [29], sizes: REG, colours: ['Pink', 'Green', 'Peach'] },
  { id: 'floral-frock-legging', name: 'Floral Frock & Leggings', cat: 'baby', img: [9, 21], sizes: REG, colours: ABC },
  { id: 'tulle-frock-legging', name: 'Tulle Party Frock & Leggings', cat: 'baby', img: [22], sizes: REG, colours: ABC },

  // Dungarees
  { id: 'dung-six', name: 'Number 6 Dungaree Set', cat: 'dung', img: [4, 5, 18, 52], sizes: REG, colours: ['Green', 'Maroon', 'Brown'] },
  { id: 'dung-graffiti', name: 'Graffiti Print Dungaree Set', cat: 'dung', img: [7, 10], sizes: REG, colours: ABC },
  { id: 'dung-play', name: 'Lets Play Print Dungaree Set', cat: 'dung', img: [33], sizes: REG, colours: ABC },
  { id: 'dung-luo', name: 'Luo Print Dungaree Set', cat: 'dung', img: [45], sizes: REG, colours: ['Rose', 'Sky', 'Sage'] }
];

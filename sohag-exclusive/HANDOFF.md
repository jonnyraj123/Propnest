# Sohag — ওয়েবসাইট প্রজেক্টের সারসংক্ষেপ (নতুন কথোপকথনের জন্য)

> **নতুন Claude-কে:** এই ফাইলে আগের পুরো কাজের সারাংশ আছে। এটা পড়ে ঠিক যেখানে থামা হয়েছিল সেখান থেকে শুরু করো।

---

## ১. ব্যবহারকারীর সাথে কথা বলার নিয়ম (খুব জরুরি)

- **সব কথা বাংলায়।** একটাও ইংরেজি বাক্যে উত্তর নয়। বাটন বা মেনুর নাম যেমন লেখা থাকে (যেমন **Add website**), শুধু সেগুলো ইংরেজিতে।
- **ছোট করে, শুধু কাজের কথা।** বাড়তি ব্যাখ্যা নয়।
- **ধাপে ধাপে:** একবারে ১–৩টে ধাপ বলো। ব্যবহারকারী প্রতিটা ধাপের স্ক্রিনশট পাঠাবেন, দেখে পরের ধাপ বলবে।
- **ওয়েবসাইটের সব লেখা ইংরেজিতে** থাকবে (এটা ব্যবহারকারীর সিদ্ধান্ত)। শুধু কথোপকথন বাংলায়।

---

## ২. ব্যবসা

| বিষয় | তথ্য |
| --- | --- |
| ব্র্যান্ড | Sohag (লোগোতে "Sohag · Wear Your Story"; আগে "Sohag Exclusive" নামে Facebook পেজ) |
| কী বিক্রি হয় | হ্যান্ডমেড "Bangaliana Handcraft" জুয়েলারি (নেকলেস, চোকার, কানের দুল, অক্সিডাইজড কাফ), পুজোর লাল-সাদা শাড়ি |
| দেশ | **ভারত**, দাম ₹ (INR) |
| ডেলিভারি | **সারা ভারতে ফ্রি** |
| ক্যাশ অন ডেলিভারি | **ফ্রি, কোনো চার্জ নেই** |
| অনলাইন পেমেন্ট | UPI (UPI ID-তে টাকা পাঠিয়ে গ্রাহক UTR নম্বর দেন) |
| ফোন / WhatsApp | +91 90737 66083 (WhatsApp: 919073766083) |
| UPI ID | swarnalibanerjee0217@oksbi |
| ডোমেইন | **shopsohag.com** (কেনা ও ভেরিফাই করা হয়েছে, ২ বছর, Hostinger) |
| উদ্বোধন | পুজোর আগে, মোটামুটি ২০ দিনের মধ্যে। তারিখ এখনও ঠিক হয়নি |

---

## ৩. হোস্টিং ও ডোমেইন — এখন কোথায় আছি ⬅️

- Hostinger অ্যাকাউন্ট আগে থেকেই ছিল: **Premium** প্ল্যান, মেয়াদ **২০২৭-০৬-২৭** পর্যন্ত। এতে আরেকটা সাইট **plastrixstudio.com** আছে। Premium-এ অনেকগুলো সাইট রাখা যায়, তাই **নতুন হোস্টিং কেনা হয়নি।**
- **shopsohag.com** কেনা হয়েছে (২৯ সেপ্টেম্বর ২০২৬): ২ বছর, HADOMAINS কুপনে মোট ₹২,১৬৩.০৫। Domain Shield আর বিজনেস ইমেইল নেওয়া হয়নি। UPI AutoPay mandate চালু আছে (সর্বোচ্চ ₹৪,৭০০ পর্যন্ত, শুধু রিনিউয়ের সময় কাটবে)।
- ডোমেইনের ইমেইল ভেরিফিকেশন **হয়ে গেছে** ✅

### এখান থেকে পরের ধাপগুলো
1. **Hostinger → Websites → + Add website** → **WordPress** বেছে নেওয়া → ডোমেইন **shopsohag.com** দেওয়া (Hostinger-এর AI Builder নয়)। ব্যবহারকারী এই পাতার স্ক্রিনশট পাঠাবেন।
2. WordPress ইনস্টলের সময়: ভাষা **English**। অ্যাডমিন ইউজারনেম, পাসওয়ার্ড আর ইমেইল ব্যবহারকারী নিজে রাখবেন। কোনো "starter theme / AI content" চাইলে Skip করতে হবে।
3. SSL (https) চালু আছে কিনা দেখে নেওয়া (Hostinger সাধারণত নিজেই দেয়)।
4. WordPress-এ: **Plugins → Add New → WooCommerce** ইনস্টল করে Activate। WooCommerce-এর নিজের সেটআপ উইজার্ড Skip করা যাবে।
5. **Appearance → Themes → Add New → Upload Theme** → `sohag-exclusive-theme.zip` আপলোড করে Activate।
6. **Appearance → Sohag Store Setup** → নম্বর, UPI, ইমেইল, ঠিকানা দেওয়া → "Add the Sohag starter products" টিক দেওয়াই থাকে → **Run Store Setup**।
7. **Appearance → Grand Opening** → টিম লিংক কপি করে টিমকে পাঠানো, উদ্বোধনের তারিখ বসানো (কাউন্টডাউন)। উদ্বোধনের দিন **"✂ Cut the Ribbon — Open Store"**।
8. **Settings → Permalinks** "Post name" আছে কিনা দেখা (সেটআপ নিজেই বসায়)।

---

## ৪. ওয়েবসাইট (WordPress থিম) — কী তৈরি হয়ে আছে

**কোড যেখানে আছে:** GitHub রিপো `jonnyraj123/Propnest`, ব্রাঞ্চ `claude/sim-ecommerce-website-37agih`, ফোল্ডার `sohag-exclusive/`।
- ইনস্টল করার ফাইল: `sohag-exclusive/sohag-exclusive-theme.zip` (সর্বশেষ সংস্করণ, নতুন লোগো আর shopsohag.com-সহ)।
- থিমের কোড: `sohag-exclusive/theme/sohag-exclusive/`।
- বাংলা গাইড: `sohag-exclusive/README.md`।

**থিমের বৈশিষ্ট্য**
- **ডিজাইন:** মেরুন, সোনালি আর ক্রিম রঙ। ফন্ট Playfair Display, Jost আর Great Vibes। ₹ চিহ্নের জন্য Hind ফন্টের ছোট একটা অংশ লোড হয়।
- **হোমপেজ:**
  - হিরো অংশে পুজোর শাড়ির ছবি, শিরোনাম "Bangaliana Handcraft", পাশে লেখা "Only from ₹199"।
  - সুবিধার সারি: Free Delivery, Free COD, 100% Handmade, Easy Returns।
  - গোল ছবিসহ ক্যাটাগরি। শুধু যেগুলোয় প্রোডাক্ট আছে সেগুলো দেখায়।
  - New Arrivals (৪টে), ব্র্যান্ড স্টোরি, Best Sellers, How to Order, Facebook/WhatsApp অংশ।
- **প্রোডাক্ট পেজ:**
  - Order Now বাটন (সরাসরি চেকআউটে যায়), WhatsApp-এ অর্ডারের বাটন, ডেলিভারির তথ্যবক্স।
  - দাম না থাকলে "Price on request" দেখায়, সাথে "Ask for Price on WhatsApp"।
- **চেকআউট:**
  - ঘরগুলো: Full name, Mobile, Address, Landmark, City, PIN code, State, Email (ঐচ্ছিক)।
  - ভারতীয় ১০ সংখ্যার মোবাইল আর ৬ সংখ্যার PIN যাচাই হয়।
  - COD দিলে অর্ডার "Processing" হয়। UPI দিলে UTR নম্বর লাগে, অর্ডার "On hold" থাকে।
- **মোবাইল:** নিচে নেভিগেশন বার, পাশ থেকে খোলা মেনু, ভাসমান WhatsApp বাটন।
- **এক ক্লিকে সেটআপ** (`inc/setup.php`) যা যা করে:
  - টাকা INR, দেশ ভারত, সময় Asia/Kolkata।
  - ভারতজুড়ে একটা ডেলিভারি জোন, ফ্রি ডেলিভারি। COD ফ্রি। UPI গেটওয়ে চালু।
  - ৬টা ক্যাটাগরি, ৫টা স্টার্টার প্রোডাক্ট।
  - পলিসি পেজ: About, Contact, Shipping, Returns & Refunds, Cancellation, Privacy, Terms। Grievance Officer-এর তথ্যও থাকে।
  - মেনু, সাইট আইকন।
  - WooCommerce-এর নিজের "Coming soon" বন্ধ করে দেয় (তার জায়গায় আমাদের Grand Opening পর্দা আছে)।
- **Grand Opening / ফিতে কাটা** (`inc/launch.php`, `assets/css/launch.css`, `assets/js/launch.js`):
  - দোকান না খোলা পর্যন্ত সাধারণ মানুষ একটা সিনেমার মতো পর্দা দেখে: মখমলের পর্দা, লাল ফিতে ও বো, সোনালি কাঁচি, সোনালি কণা, কাউন্টডাউন।
  - WordPress-এ লগইন থাকলে বা গোপন টিম লিংক (`/?team=KEY`, ৬০ দিনের কুকি) খুললে পুরো দোকান দেখা যায়।
  - "Cut the Ribbon" চাপার পর ১৪ দিন প্রত্যেক নতুন ভিজিটর একবার ফিতে কাটার অ্যানিমেশন দেখে।

**৫টা স্টার্টার প্রোডাক্ট** (ছবি থিমের ভেতরে দেওয়া আছে)
| প্রোডাক্ট | দাম | ক্যাটাগরি |
| --- | --- | --- |
| Bangaliana Handcraft Oxidised Pendant Necklace | ₹239 | Necklaces |
| Bangaliana Handcraft Choker Set with Earrings | ₹299 | Necklaces, Earrings |
| Bangaliana Handcraft Necklace & Earrings Set (Maroon / Green) | ₹199 | Necklaces, Earrings |
| Pure Oxidised Cuff Bangle (One Piece) | ₹299 | Bangles |
| Red & White Frill Border Puja Saree | দাম জানা নেই → "Price on request" | Indian Wear |

**কী কী পরীক্ষা করা হয়েছে:** লোকাল WordPress + WooCommerce-এ (SQLite দিয়ে)। Playwright দিয়ে ৬টা স্ক্রিন-মাপে (৩৬০ থেকে ১৩৬৬ পিক্সেল) লেখা বাইরে বেরোনো আর পাশে স্ক্রল হওয়ার অডিট চালানো হয়েছে। COD আর UPI অর্ডার, মোবাইল/PIN যাচাই, রঙ অনুযায়ী ছবি বদলানো, টিম লিংক, ফিতে কাটা, আবার পর্দা ফেলা — সব পাস করেছে।

---

## ৫. ব্যবহারকারীর কাছ থেকে যা এখনও বাকি
- লাল-সাদা পুজোর শাড়ির **দাম**
- ₹১৯৯ সেটের অফারের **আগের দাম** (কাটা দাম দেখানোর জন্য, থাকলে)
- **ব্যবসার নাম সাইটে কী থাকবে:** শুধু "Sohag", নাকি "Sohag Exclusive" (নতুন লোগোতে "Exclusive" নেই)। উত্তর এলে header-এর ব্র্যান্ড লেখা (`inc/template-tags.php` → `sohag_brand()`), পেজ টাইটেল আর পলিসির লেখা বদলাতে হবে।
- **ইমেইল আইডি** (দোকানের জন্য)
- **Facebook পেজের লিংক**, Instagram থাকলে সেটাও
- **দোকানের ঠিকানা** (শহর, রাজ্য)
- **Grievance Officer-এর নাম** (Swarnali Banerjee হবে কিনা জিজ্ঞেস করা হয়েছে, উত্তর আসেনি)
- **উদ্বোধনের তারিখ ও সময়** (কাউন্টডাউনের জন্য)
- আরও প্রোডাক্টের ছবি, নাম আর দাম

---

## ৬. পুরনো ব্যাপার (এখন আর দরকার নেই)
- শুরুতে সাইট বাংলাদেশের জন্য বানানো হয়েছিল (৳, বিকাশ/নগদ, ঢাকা)। পরে পুরোটা **ভারতে** বদলানো হয়েছে।
- Netlify-তে স্ট্যাটিক ডেমো বানানো হয়েছিল (`sohag-netlify-demo.zip`)। ব্যবহারকারী সেটা বাদ দিয়ে সরাসরি Hostinger-এ যাচ্ছেন।
- sohag.com অন্য কারও কেনা। sohagexclusive.com বাদ দিয়ে শেষে **shopsohag.com** নেওয়া হয়েছে।

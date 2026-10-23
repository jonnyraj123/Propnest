# PLASTRIX STUDIO — MASTER MEMORY FILE (updated 16 Oct 2026)

> **For Claude:** Joni gave you this file because the old chat was deleted or lost. Read ALL of it before you reply. It holds everything from the earlier chats.
> Also read these, from repo `jonnyraj123/Propnest`, branch `ccr-7117943e-suhwf8`, folder `demos/`:
> RULES.md, leads.md, HANDOFF.md (older, from 7 Oct), PROGRESS.md, kashmir-ecom-client-messages.md, us-search-list.md and whatsapp-agent-prompt.md.
> If the repo is not available, this file alone is enough to continue.

---

## 1. Who Joni is
- **Name:** Joni Raj Mollick, Kolkata, India.
- **Business:** **Plastrix Studio** (plastrixstudio.com). He has built 48+ websites.
- **Email:**
  - Business: hello@plastrixstudio.com (Hostinger). It forwards to rajjonim@gmail.com.
  - Other Gmail: jonnyrajmollick@gmail.com.
- **Services:**
  1. Website design.
  2. Facebook, Instagram and Google ads.
  3. WhatsApp AI agent (n8n + WhatsApp Cloud API).
- **Goal:** paying clients fast, without spending his own money.

## 2. How to talk to Joni (MOST IMPORTANT)
- **HARD LIMIT: max 5-6 short lines per reply. Only main points. No extra explanation, no warnings list, no file paths unless asked. Joni has repeated this many times and gets very angry.**
- **Language and length:**
  - Always reply in Bengali.
  - Keep it very short and point-wise, main points only.
  - Long or vague replies make him angry.
- **Steps:**
  - Give one small step at a time, then wait for his screenshot.
  - Before asking him to do anything, explain WHY in 1–2 lines.
  - Say exactly where to click. He is not technical.
- **Honesty:**
  - Be honest about mistakes and limits.
  - Never invent facts, prices or claims. Say where information came from.
- **Security:** never ask for passwords, tokens, Aadhaar, PAN or bank numbers in chat.
- **Credits:** his usage credits are limited, so don't waste tool calls.

## 3. Message language for clients
- **India:** Hinglish, meaning Hindi written in English letters. Polite and short. For Kolkata, Banglish is OK.
- **US, Canada and Dubai:** professional English.
- **Don'ts:**
  - Don't write "Namaste ji".
  - Don't promise times like "1-2 din". Joni scolded about this.
- **Closing line used:** "Mera naam Joni Raj Mollick hai… Kya aap interested hain? 🙏"
- **Signature rule:** In every client message always sign as **"Joni Raj"** (জনিরাজ), never only "Joni".

## 4. Demo quality rules (Joni is strict)
- **Uniqueness:** every demo must be 100% unique (concept, layout, fonts, colours, animation). Never reuse a theme with only the name swapped.
- **Quality:** paid and e-commerce demos must be **world-class, cinematic and premium**:
  - 3D, scroll storytelling and glow effects.
  - Smooth motion and luxury fonts.
  - A "normal" template look gets REJECTED.
- **New India leads:** they get a **luxury e-commerce demo** with:
  - Product page, cart, checkout and thank-you page.
  - WhatsApp as a secondary option.
- **Product mockups:**
  - **Never crop them or cut a collage apart.** Show the full image (`object-fit: contain`).
  - Always **remove the Gemini sparkle watermark** (bottom-right) and keep the original size and quality. Method:
    1. Make a star-shaped mask.
    2. Run cv2.inpaint TELEA.
    3. Transplant texture from a patch to the left.
  - Mockup format: 1024×1536 (2:3), vertical, about 3–4 per product:
    - 1 with the same Kashmiri model (same face, a different pose and location each time).
    - 2 without a model (mannequin, folded).
    - 1 optional embroidery close-up.
  - The design must stay 100% identical to the original shawl.
- **Gemini video:**
  - Remove the logo with ffmpeg delogo `x=1128:y=566:w=66:h=66` (for 1280×720).
  - Use libx264 with faststart.
  - Make a smaller mobile version.
- **Artifacts:** claude.ai artifact links are private, only for Joni. **NEVER send them to clients.** For clients, use GitHub Pages links only.

## 5. Live demo sites (send these to clients)
Base: `https://jonnyraj123.github.io/Propnest/demos/<folder>/`

| Folder | For | Notes |
|---|---|---|
| noor-e-kashmir | Paying Kashmir e-com client | MASTER luxury template (see section 7) |
| kashmir-shawl-bazar | Kashmir Shawl Bazar, Kolkata | cinematic video hero |
| kashmir-dreams | KASHMIR DREAMS, Lal Chowk | ivory, chinar red and teal; video hero |
| wani-shawl-factory | The Wani Shawl Factory, Waripora | black-gold, runway, welcome popup, WSF product codes |
| 10 US demos | electricians and plumbers | cannon-electric, on-the-way-electric, aaron-electrician, huff-plumbing, advance-plumbing, second-opinion-electric, pablos-electrical, arcore-electric, plumbing-wizard, losco-plumbing |

Privacy page for the Meta app: `/demos/privacy.html`

## 6. Client status (16 Oct)
- **Kashmir e-commerce client (PAYING lead):**
  - Agreed by phone. Wants an online store like ahujasons, pashtush and pashmina.com.
  - Plan sent:
    - **₹15,000 setup** on WordPress + WooCommerce (not Shopify). 50% advance (₹7,500), the rest when it goes live.
    - **₹4,000/month** for management plus FB and Instagram ads handling.
    - Hosting is FREE on Joni's Hostinger while management continues.
    - Domain about ₹1,000/year, in the client's name.
    - The ads budget is paid by the client directly to Facebook.
  - Payment: Razorpay. Use the number linked to the business bank account that stays with the owner (needed for OTP and KYC).
  - Instagram: via Meta Business Suite partner access, NEVER the password.
  - Saved messages: `kashmir-ecom-client-messages.md`.
  - Demo sent: noor-e-kashmir. Message: please check it, much is still to do, an advance is needed for the next step, how do you like it?
  - **Waiting** for reply and advance. Next: collect real details and build the real site on WordPress/WooCommerce.
- **Wani Shawl Factory (+91 91496 69231):**
  - Said yes and sent photos. Demo built.
  - On 16 Oct they wrote: "Mai cousin sai yahi baat kar raha hu" (discussing it with a cousin).
  - Told them: no pressure, tell us when free. Follow up next day if silent.
- **KASHMIR DREAMS (+91 70065 57900):**
  - Demo sent. OK with ₹7,000 for the WhatsApp-site version.
  - Asked about:
    - Uploading products themselves (Google Sheet idea).
    - A payment gateway.
    - International buyers and USD pricing.
  - "Discussing with higher authorities." Next: quote ₹15–20k for an international store.
- **Craftastic Cashmere:** asked charges, was told "from ₹5,000", then went silent.
- **Cashmere Crafts:** said no.
- **US, Canada and Dubai emails:** no replies yet.

## 7. Noor-e-Kashmir master demo (template for future Kashmir demos)
- **Source:** the public copy is `demos/noor-e-kashmir/index.html`. It is single-file HTML with images and videos alongside.
- **Look:** royal night-wine-gold theme.
  - Colours: night #16040a, wine #3a0b18, gold #d6b26e, rose #dba792, cream #f8eee6.
  - Fonts: Bodoni Moda + Hanken Grotesk.
- **Sections, in order:**
  1. Hero video with blur-word reveal and a glass email box.
  2. Two-direction marquee.
  3. 3D coverflow carousel (autoplay 3.2s, side cards blurred).
  4. Craft categories.
  5. Trust row.
  6. Boutique grid with tabs (best, new, limited).
  7. Festive edit.
  8. Craft marquee.
  9. Reviews (sample).
  10. Newsletter and footer, over a lazy-loaded film video.
- **Product page:**
  - Thumbnails, a full image with contain and hover zoom.
  - Colour, size and qty options.
  - Tabs, "You might also like" and a trust row.
- **Cart and checkout:**
  - Cart drawer.
  - Checkout with UPI, Card, PayPal and COD.
  - Thank-you page showing the **ordered product's image**, with order and tracking numbers.
- **Other:** glass policy sheets (shipping, COD, returns, terms, privacy). Glow on hover and touch.
- **Products (5):**
  - Noir Sozni Jaal
  - Olive Sozni Jaal
  - Ivory Sunflower Lattice
  - Ivory Paisley Border
  - Turquoise Kani Garden
  - All are mockups with watermarks removed.
- **Performance:** about 4.3MB initial load, about 1s load, about 58fps.

## 8. NEXT: luxury demo queue (build ONLY when Joni says "start")
Joni will build a Noor-e-Kashmir-level demo for each and send it on WhatsApp. These leads were messaged and have not replied.

| # | Business | Area | WhatsApp |
|---|---|---|---|
| 1 | The Royal Threads of Kashmir | Zadibal, Srinagar | +91 70060 22017 |
| 2 | Finest Shawls | Khanyar, Srinagar | +91 70069 62973 |
| 3 | Kasmira Emporium | Bemina, Srinagar | +91 70064 09583 |
| 4 | Hoor the Designer Wear | Nowhatta, Srinagar | +91 88250 60887 |
| 5 | Craftastic Cashmere 🔥 | Dalgate | +91 99060 49023 |
| 6 | Al Kashmiri Shawls | Lal Chowk | +91 70068 68557 |
| 7 | Kashmir Pashmina Art & Craft | Srinagar | +91 94197 62636 |
| 8 | Kashmir Kraft | Jammu | +91 97960 85940 |
| 9 | Bazar Kashur | Safakadal, Srinagar | +91 84939 58585 |
| 10 | Crafts Emporium | Dal Lake | +91 94190 46261 |
| 11 | Kashmir Collections | Gandhi Nagar, Jammu | +91 97976 60600 |
| 12 | Kashmiri Hunar | Gandhi Nagar, Jammu | +91 88996 90909 |
| 13 | Navriti Kashmiri Designs | Panjtirthi, Jammu | +91 96222 58263 |
| 14 | Kashmir Art Emporium | New Market, Kolkata | +91 98314 90860 |
| 15 | Kashmir Kraft Emporium | New Market, Kolkata | +91 70038 62277 |
| 16 | Kashmir Gift House | New Market, Kolkata | +91 99037 81100 |
| 17 | Kashmir Cottage | New Market, Kolkata | +91 89108 33810 |
| 18 | Kashmir Crafts Hawal ⚠ | Hawal ("may be closed") | +91 94190 77855 |

- **Not shawl shops:** Kashmiri Kesar (saffron), Kashmiri Dawat (food; odd number), Happy Destination (travel agency).
- **Needs a number:** The Cashmere Store (its Shopify site is down).
- **Uncertain:** whether every batch-3 lead was actually sent the message.

## 9. Lead finding
- **India:**
  - Joni sends Google Maps screenshots.
  - Claude makes one card per shop, with a unique Hinglish message and a wa.me button.
- **US:**
  - Contact by email and Facebook Messenger. **No cold SMS** (TCPA fines). Google Business chat no longer exists.
  - Trigger "সার্চ লিস্ট দাও" ("give me the search list") → give the list from `us-search-list.md`.
  - Pick only: 4.5★+, 10+ reviews, phone shown, NO website.
- **Email rules:**
  - Always HTML. Link text is plastrixstudio.com.
  - **No demo link in the first email** (spam risk).
  - Send from hello@. 5-minute gap, max 10–15 per day.

## 10. Backlog / pending
- **WhatsApp AI bot (n8n "My workflow 2", plastrix.app.n8n.cloud):**
  - It needs a **permanent System User token**. The temporary token expired.
  - The n8n trial is ending.
  - Meta app "Plastrix AI Assistant", App ID 2350245835789368. WABA ID 1662851395263771.
  - Prompt: whatsapp-agent-prompt.md.
- **Other:**
  - PayPal video KYC failed twice. Retry it.
  - Send follow-up emails to US, Canada and Dubai leads.
  - When Joni sends more product mockups: remove the watermark and add them to Noor-e-Kashmir.

## 11. Tech notes
- **Repo:** `jonnyraj123/Propnest`. Branch `ccr-7117943e-suhwf8` is the GitHub Pages source. Pushing a new folder gives a new live link.
- **Tools:**
  - Playwright for screenshots: `NODE_PATH=$(npm root -g) node script.js`.
  - Chromium at /opt/pw-browsers.
  - OpenCV (cv2) and ffmpeg are available.

## 12. Update 16 Oct night
- Joni wants it: short replies, ONE step at a time, like the AnimatedWebs setup steps.
- AnimatedWebs plugin: account made (jonnyrajmollick@gmail.com). Clicking "Allow access" does nothing in Chrome or Edge, so it is their bug. Retry in 1-2 days via Claude app → Customize → Plugins → AnimatedWebs → Connectors → Connect.
- MotionSites affiliate: APPLIED 16 Oct (PayPal rajjonim@gmail.com, FB personal profile). Under review; the referral link will appear on motionsites.ai/affiliates after approval. Script is in motionsites-affiliate.md.
- Wani: replied "talking with cousin". Follow up 17 Oct if silent.
- Pending, one at a time: affiliate apply → Wani follow-up → Noor-e-Kashmir client advance → 18-lead demo queue (when Joni says start) → WhatsApp bot token → PayPal KYC → US follow-ups.
- 17 Oct morning, send to Noor-e-Kashmir client (give Joni again when asked). Send the desktop screen video first, then:
  "Sir, aapki website maine bahut dil se banayi hai 🙏 Mobile ka link bheja tha. Desktop pe ye aur bhi sundar lagti hai, uski chhoti si video bhej raha hoon. Ek baar mujhe mauka dijiye. Jitne dil se website banayi hai, utne hi dil se aapki online sale badhane ki koshish karunga. Aapke liye ek offer: pehle mahine ka management (₹4,000) bilkul FREE. Bataiye, kab shuru karein? 🙏"
- 17 Oct: Noor-e-Kashmir client cut the call and has not replied, so treat as likely lost. Plan: one soft last message ~20 Oct, then move on. Reuse the demo as a portfolio piece/Instagram reel and as the template for the 18-lead Kashmir queue.
- 17 Oct: Joni asked to take down client demo links. Removed from the live site: noor-e-kashmir, kashmir-shawl-bazar, kashmir-dreams, wani-shawl-factory. Code is kept in branch `archive-client-demos` (not served) to reuse as templates. US demos are still live.
- 17 Oct: PayPal video KYC SUBMITTED. PayPal says review in 2-3 days. Canara bank linked. Use Invoicing to bill clients after approval.
- Joni's rule (17 Oct, strict): answer ONLY what he asks. Do not bring up other pending tasks or old plans unless he asks.
- 18 Oct LinkedIn setup DONE: profile verified (DigiLocker), US headline, About, Services page (remote, contact for pricing, open profile), Featured (plastrixstudio.com + Wanderly), Experience (Founder, Plastrix Studio, Jan 2023), banner (demos/resume/linkedin-banner.jpg), first post (Wanderly reel). Resume PDF: demos/resume/Joni-Raj-Mollick-Resume.pdf. NEXT: daily routine of 10 US connections + 5 job applications + comments; apply to N4 Studio (Deel form).

## MR Fashion client (19 Oct)
- Demo live: jonnyraj123.github.io/Propnest/demos/mr-fashion/ (client liked it). Deal: ₹5,000 for site; domain+hosting paid by client separately; Facebook campaign = separate charge. Small changes free.
- If client backs out, Joni will say "MR Fashion বন্ধ করো" → take site offline (keep code in archive branch).
- If confirmed: buy domain (mrfashion.com taken; mrfashionindia.com / shopmrfashion.com free) + hosting, go live.
- TO BUILD WHEN JONI SAYS: private admin panel (phone home-screen app, password, no link on site): pick category (Shirt/T-shirt/Polo/Jeans, add new), name + price once, "Add colour" per colour (name + photo), Save → appears on site with colour swatches; edit/delete.
- Pricing advice for next clients: simple site ₹8–10k, e-commerce + admin ₹12–15k.

## LATEST STATE (20 Oct) — read this first in a new session
**How to talk to Joni:** Bengali, very short (5–6 lines), one step at a time, answer ONLY what he asks, explain "why" in one line, honest. Hinglish for India clients, English for US/CA/UAE. Never ask for passwords/OTP/bank numbers. Never send claude.ai links to clients. All quality rules are in demos/RULES.md (read it too).

**Live demos (GitHub Pages, branch ccr-7117943e-suhwf8):**
- Wanderly (scroll travel): jonnyraj123.github.io/Propnest/demos/wanderly/
- SAHRA (Egypt 3D, enter gate + Anubis Arise music, story film, 3D buttons, orange click glow): .../demos/sahra/
- MR Fashion (Indian e-com, colour variants, cart, checkout, thank-you card, WhatsApp order, silk video hero + model video): .../demos/mr-fashion/
- Reels: demos/instagram/ (08 = SAHRA laptop mockup, 09 = SAHRA in real laptop photo, posted on LinkedIn 20 Oct).

**MR Fashion client:** ₹5,000 site deal. Client hesitant about ₹1,000 advance for the admin app; Joni sent soft message ("advance = slot booking"). Admin app (phone, password, category + name + price + colours/photos → auto on site) — build ONLY when client agrees. If client drops: "MR Fashion বন্ধ করো" → take offline.

**LinkedIn (main channel for US clients):**
- Profile done: headline, About, Services (+ suggest adding E-commerce Development, WordPress Design), skills (incl. WordPress, WooCommerce, Figma, SEO, GSAP, Web Development), Experience = Founder & Lead Web Developer, Plastrix Studio (Jan 2023), banner, Open to Work = VISIBLE to everyone; titles Web/Front End/Web Designer/WordPress/Creative Developer; locations Kolkata, US, UAE, California, Canada; Remote; Full-time+Contract+Part-time.
- Featured: plastrixstudio.com + Wanderly. Joni wants to ADD later: (1) a Figma design of a premium site, (2) a new modern 3D animation website. (Not SAHRA.)
- Resume for US: demos/resume/Joni-Raj-Mollick-Resume-US.pdf (1 page, no photo).
- Rate: say $25–30 USD/hr now (35 CAD earlier ≈ $25). Raise to $35–45 after 3–4 jobs.
- N4 Studio Digital Designer (Deel): applied 19 Oct → REJECTED 20 Oct (generic). Lesson: avoid Senior/Lead/Hybrid/PHP-heavy jobs; target freelance/contract web dev, Entry/Associate.
- Daily routine: 15–20 connection requests to US web/marketing agency OWNERS (search "agency owner web design", People, United States). Notes only for best leads (free = 5 notes/month; ALL 5 USED for Oct: Adam Delong, Andre Fox, Carsten Frasier, Seth Gilmore, Travis Dulaney). Note text: "Hi [Name], great to connect with a fellow web pro! I build custom websites, e-commerce stores and animated/3D web experiences. Happy to help with overflow projects. Work: plastrixstudio.com – Joni". Skip students and #OpenToWork people. Sent ~40 so far (18 + 20 Oct). Find them: Network → Manage → Invitations → Sent.
- When someone accepts: write them a short English intro message offering overflow/white-label help. Comment helpful (not "nice post") on agency owners' posts.
- LinkedIn job alerts on; RemoteHunter/Jobfinder/Wiraa = reposters, skip. Never pay to apply.
- Cannot automate LinkedIn (account-ban risk) — Joni clicks, I guide.

**Money:** PayPal KYC submitted 17 Oct, "2–3 days", no issues by 20 Oct; if not approved after 21 Oct → PayPal app / Help & Contact.

**Media sourcing:** I can download free 4K Pexels videos/photos myself (www.pexels.com/download/video/ID/ → videos.pexels.com). Use instead of Joni's Gemini credits. Remove Gemini watermark always.

## 21-22 Oct
- Joni rule: answer ONLY the main point, very short. Old name = Rahul (now Joni) — answer just "তোমার পুরোনো নাম ছিল রাহুল".
- Re-enabled live: demos/kashmir-dreams (client re-checking) + demos/noor-e-kashmir (shown as full e-com sample). Suggested ₹15-20k for full store.
- LinkedIn outreach (white-label/overflow msg with plastrixstudio.com + sahra + wanderly links): messaged Jeff Boob, Sandy Gomez, Ashleigh Barnard, Johnny Digges (free messages); connect sent to Elaine Robinson (Smiling Web Design), Mariam Ali (Citizen, Manager of Websites). Wait for replies.
- Target only agency OWNERS/managers; skip #OpenToWork, employees, job reposters (Torentify, Wiraa, RemoteHunter), hybrid/US-work-authorization jobs.
- LinkedIn Service Requests need Premium; skipped (Indian low-budget leads). Don't take ₹0 trial (auto-charge risk).

- 22 Oct: BRIKA (brick-built chronograph concept) demo live at demos/brika/. Scroll colour swap (Citrus/Cobalt/Noir Gold, page colour changes), 5-step pinned "making" story (exploded parts, dial, hands drop, bezel seal, tested), live-time dial with city picker, shop + bag drawer, FAQ. Assets = Joni ChatGPT/Gemini images + 1 Gemini hero video (watermarks removed).

- 22 Oct: ALIMUDDIN Garments (wholesale kidswear, V-109 S.A. Farooquie Rd Kolkata-18, WA 9330634663, MOQ 25) B2B demo live at demos/alimuddin-garments/. 8 pages (home, shop, product, cart, checkout, thankyou, about, contact), size x colour grid, order sent via WhatsApp, gift popup after 3.5s, glass policy popups. Prices from client chat: skirt sets 26-30 Rs200 / 32-34 Rs230 / XL Rs260; kurta sets 16-18 Rs130; Happy frock Rs110; baby shirt-pant Rs60 half / Rs70 full; others "Price on WhatsApp". Excluded GUCCI + Little Fashionistas + Spider-Man photos.

- 22 Oct ALIMUDDIN feedback (Joni NOT happy yet; wait for his go before work): no tap/sparkle effect; product photos standard size, nothing cut on phone (fixed); hero needs better video + zoom-out text reveal; new 3D gold "MA" monogram logo like their visiting card (prompt given); colours -> card style black + gold + ivory + light blush, drop green; replace "Colour A/B/C" with real colour names when client sends. Joni will discuss more before restart.

- 22 Oct ALIMUDDIN v3: white+blush pink theme (#e8798f), Playfair + Dancing Script, single hero image (kids + dress form), trust bar, promo cards, wide sofa banner -> shop, footer glow video, simple popup, wishlist hearts. Still B2B MOQ 25.

- 22 Oct: Montage Traders (Lal Mandi Srinagar; fishing/camping/aquariums; ph 9419008168 / 9906761488; IG montagetraders69; lead via KASHMIR DREAMS contact) retail e-com demo live at demos/montage-traders/. Glass-poster intro that splits like doors, real prices from their IG price lists, cart+checkout+WhatsApp. Demo WhatsApp = 9906761488 (confirm). Images = Joni ChatGPT/Gemini.
- **Upwork:** Profile set up (Joni Raj M., $15/hr). Cannot buy Connects yet: Joni has only a RuPay card (tried, failed). Waiting for a Visa/Mastercard from the bank. Until then focus on link-based applying (LinkedIn Easy Apply, worldwide remote) and direct client outreach.

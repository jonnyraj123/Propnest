# Client website workflow (Plastrix Studio)

The owner (Joni) builds sample homepages for clients they have emailed.
Follow this workflow for every client site. Reply to the owner in Bengali.

## 1. Inputs from the owner
- A design **prompt** copied from a site they like (e.g. motionsites.ai).
  When they say "font" / "pont" / "ফন্ট" they mean this prompt.
- The client: name, business type, and details. If only a name is given,
  find it in the owner's Sent mail and research public details (address,
  hours, phone, services). Use real content only; never invent facts.

## 2. Design rule: 70 / 30
- Keep about **70%** of the prompt's design: layout, section order,
  animations, liquid-glass style and motion quality.
- Change about **30%** to make it better and to fit the client's business:
  palette, type accents, booking/contact flow, extra sections (e.g. Visit),
  scroll effects. It must never look like a copy of the original.
- Animation quality must stay at the same level as the prompt, or higher.

## 3. Must work on every screen
- Test laptop (1440px) and phone (390px) widths before delivering.
  No horizontal scroll, readable text, tappable buttons.
- Respect `prefers-reduced-motion`.

## 4. Videos: the owner makes them, I write the scripts
- Do **not** make or download videos myself.
- For every video slot on the page, write a **video script** that matches
  the client's business and the site's look. Each script includes:
  - Slot name and where it appears (hero, featured, section card...)
  - Aspect ratio and length (hero: 16:9, 8–10 s, loopable)
  - Scene description: subject, setting, camera movement, lighting, mood,
    colour palette matching the site
  - What to avoid (text in video, logos, faces that look fake, fast cuts)
  - A ready-to-paste prompt in English for the video generator (Gemini)
- Videos must look premium ("ultra level") and fit the business
  (e.g. real estate → architecture, interiors, golden-hour exteriors).
- Keep every video URL in one place (`src/content.ts`) so the owner's
  videos can be dropped in by changing one line each. When the owner
  sends the files, put them in `public/videos/` and update the paths.

## 5. Project setup
- Each client gets its own folder (e.g. `royal-shahnaz/`), React +
  TypeScript + Vite + Tailwind + framer-motion + lucide-react.
- All client-specific text, contact details and video paths go in
  `src/content.ts`.
- Deploy each client to its own Netlify site named `<client>-preview`.
  Never touch other clients' Netlify sites.
- Hosting on Hostinger: run `npm run build` and upload the contents of
  `dist/` into `public_html`, or connect the .com domain to the Netlify site.

## 6. Before delivering
- Build passes, laptop + phone screenshots checked, live URL opens.
- Tell the owner what to verify (e.g. WhatsApp number, social links).

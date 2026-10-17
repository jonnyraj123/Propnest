# HANDOFF: everything from the first session (read this first)

Read this whole file before replying. Also read demos/RULES.md, demos/PROGRESS.md, demos/leads.md and demos/whatsapp-agent-prompt.md.
All files live on git branch `ccr-7117943e-suhwf8` of jonnyraj123/Propnest.

## 1. Who the user is
- Joni Raj Mollick, Kolkata, India. Business: **Plastrix Studio** (plastrixstudio.com).
- Business email: **hello@plastrixstudio.com** (Hostinger). Personal Gmail connected to Claude: rajjonim@gmail.com. Other Gmail: jonnyrajmollick@gmail.com.
- 48+ websites built (proof of work).
- Sells 3 services: (1) website design, (2) Facebook/Instagram/Google ads and digital marketing, (3) WhatsApp AI assistant (n8n + WhatsApp Cloud API).
- Target markets: **USA first** (best pay), Canada, Dubai/GCC. India via WhatsApp (Banglish for Kolkata, Hinglish elsewhere).
- Goal: get the first paying client fast. Spend no own money; client money pays tools (OpenAI, etc.).

## 2. How to talk to Joni (very important)
- Always Bengali. Very short, point-wise, only the main points. No extra talk.
- Step by step: ONE small step at a time, wait for his screenshot, then next step.
- Before asking him to do something, explain in 1-2 lines WHY (he got angry when steps came without explanation).
- Be honest about mistakes and limits. Don't guess UI; ask for a screenshot.
- Say exactly where to click ("top-right blue button X"). He is not technical.
- Never ask him to send passwords, tokens, Aadhaar/PAN/bank numbers in chat.
- He has limited usage credits: be economical, don't waste tool calls.

## 3. Outreach rules (also in RULES.md)
- Every demo website must be 100% unique (concept, layout, fonts, colors, animation). Never same theme with name swapped. Classy animation, minimal text, fast.
- Emails: always HTML (htmlBody), link text "plastrixstudio.com" (never plain-text body; Gmail makes ugly google.com/url links).
- Send from hello@plastrixstudio.com (Gmail "Send mail as" default). 5-minute gap between emails, max 10-15 new per day.
- First email has NO demo link (github.io links caused spam). Send demo link only after they reply.
- Segment: no website -> free sample homepage offer. Has website -> WhatsApp AI / ads offer, or Loom video audit.
- Tone: short, polite, honest, not boring. Never "I'll handle everything"; say "if you'd like, I can handle everything for you".
- Mention other services in one line + "48+ websites, plastrixstudio.com".
- Pick leads carefully (real, active small businesses, reachable email, likely to need us).
- Loom "video audit" for businesses WITH a website: record their site (Chrome tab share), show 3 real problems, offer free sample homepage, send Loom link. 2-3/day, best leads only.

## 4. Demo websites (GitHub Pages, LIVE)
Base URL: https://jonnyraj123.github.io/Propnest/demos/<folder>/
Built (10): cannon-electric, on-the-way-electric, aaron-electrician, huff-plumbing, advance-plumbing, second-opinion-electric, pablos-electrical, arcore-electric, plumbing-wizard, losco-plumbing.
Pages served from branch ccr-7117943e-suhwf8, root. Pushing new demo folders = new links automatically.
Privacy policy page (for Meta app): /demos/privacy.html

## 5. Emails sent (no replies yet as of 7 Oct 2026 evening)
- 6 Oct: Second Opinion Electric, Pablo (All In One Electrical) - had demo links (sent from rajjonim Gmail, landed in spam).
- 6 Oct from hello@: ARCORE Electric, Plumbing Wizard, Losco Plumbing (US); Hey Larry Handyman, Nimble Plumbing, HandyCGY, Daily Plumbing & Drains (Canada); Dubai Pure Clean, Dubai Deep Clean, Super Dream Pest, Expert Pest, Al Waha Hygiene (Dubai, WhatsApp AI pitch).
- 7 Oct: Mile-End Soap & Candle (Etsy, Canada), Carr's Creek Soaps (NY).
- Earlier sessions also emailed many US/Dubai businesses (see Gmail Sent).
- NEXT: follow-up emails 3 days after first email (around 9-10 Oct) to non-repliers.
- hello@ mail forwards to rajjonim@gmail.com (Hostinger forwarder) -> Claude can read replies via Gmail tool.

## 6. WhatsApp AI bot (learning/demo setup)
- n8n cloud: https://plastrix.app.n8n.cloud (login hello@plastrixstudio.com). Free trial, ~9 days left on 7 Oct.
- Workflow "My workflow 2": WhatsApp Trigger -> AI Agent (OpenAI gpt-5-mini via n8n free credits ~$1.9; Simple Memory key = wa_id + "-v3", window 20) -> WhatsApp Send message.
- System prompt: demos/whatsapp-agent-prompt.md (v3: same language AND same alphabet as customer, short, human, consultant who guides and warns about policy risks, small paragraphs, no lists).
- Meta app: "Plastrix AI Assistant", App ID 2350245835789368, business portfolio "Plastrix Studio", Live mode, Facebook account "Joni Mollick".
- Test number +1 555 639 5458. Phone number ID 1290657400805793. WABA ID 1662851395263771.
- Fix that made it work: Graph API Explorer POST /1662851395263771/subscribed_apps -> success:true.
- CURRENT PROBLEM: bot stopped replying ~2h later because the access token in n8n credential "WhatsApp account" was a temporary Graph Explorer token. This was Claude's mistake (should have made a permanent one first).
- NEXT STEP (in progress): create a permanent System User token:
  1. business.facebook.com/settings/system-users -> Add -> name "n8n-bot", role Admin.
  2. Assign assets: App "Plastrix AI Assistant" (full control) and the WhatsApp account (full control).
  3. Generate new token -> app Plastrix AI Assistant -> expiration Never -> permissions whatsapp_business_messaging + whatsapp_business_management.
  4. Paste into n8n Credentials -> "WhatsApp account" -> Access Token -> Save.
  5. Test from phone.
  Same method is used for clients (client adds Joni as admin to their business, create System User there).
- Later TODO: 20-second wait/debounce so the bot replies once after the customer finishes several messages (WhatsApp does not expose "typing", so use a wait timer + data table). Persistent memory (Postgres) for real clients.
- Meta's grey "secure service from Meta" banner is normal for Cloud API; no "AI" label.

## 7. Other status
- PayPal (business): Canara bank linked and verified, Aadhaar via DigiLocker done, purpose code "Software consultancy/implementation". Video KYC failed twice due to PayPal technical issues -> retry later.
- Loom: works (mic was muted in Windows; fixed). Always choose "Chrome tab" when sharing. Free plan ~25 videos.
- Upwork: card payment declined earlier; needs Visa/Mastercard. Paused.
- Network: environment "Default" set to Custom with allowed domains (etsy, nextdoor + nextdoor.com, hotfrog, threeui, github, reactbits, aceternity, magicui, 21st.dev, godly, graph.facebook.com, *.n8n.cloud). Etsy and Hotfrog block bots (403) -> use web search. If nextdoor.com still blocked, re-check the allowlist line "nextdoor.com".
- Design inspiration sites for demos: threeui.com (3D Three.js components), reactbits.dev, ui.aceternity.com, magicui.design, 21st.dev, godly.website (ideas only).

## 8. Pricing advice given (US)
First 2-3 clients cheaper for reviews: website $150-300; WhatsApp AI $100 setup + $30/month. Raise later.

## 9. What to do when Joni comes back
1. Finish permanent WhatsApp token (section 6) one step at a time.
2. Check Gmail for client replies; if someone replies, build their unique demo and send link.
3. Find 10 new US leads (Nextdoor etc.), email from hello@ (rules in section 3).
4. Follow-ups to earlier emails after 3 days.
5. Keep PROGRESS.md updated after each work block.

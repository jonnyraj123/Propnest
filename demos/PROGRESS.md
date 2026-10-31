# Progress (7 Oct 2026)

## Email outreach
- 12 sent today from hello@plastrixstudio.com (US 3, Canada 4, Dubai 5). No demo link in first email.
- hello@ forwards to rajjonim@gmail.com (Hostinger forwarder) -> replies visible in Gmail.
- On reply: build unique demo, send link.

## PayPal
- Bank (Canara) linked. Aadhaar via DigiLocker done. Video KYC pending (PayPal technical issue, retry).

## WhatsApp AI bot (n8n "My workflow 2", plastrix.app.n8n.cloud, trial ~9 days left)
- Meta app "Plastrix AI Assistant" (App ID 2350245835789368), now Published.
- Test number +1 555 639 5458, Phone ID 1290657400805793, WABA ID 1662851395263771.
- Workflow: WhatsApp Trigger -> AI Agent (gpt-5-mini, n8n gateway credits, Simple Memory key = wa_id, window 20) -> Send message.
- Webhook configured, "messages" subscribed. PROBLEM: messages from phone do not reach n8n (Executions empty).
- Next: send new msg after publish; Meta webhook "Test" -> Send to My Server; if only test arrives, subscribe WABA to app (POST /{WABA_ID}/subscribed_apps via Graph API Explorer).
- Access token is temporary (24h) -> regenerate / make permanent System User token.
- Later: wait-and-batch multi-messages, persistent memory.

## Tomorrow
- Find 10 Etsy sellers (US/Canada/UK) with no own website. Etsy blocked here -> use web search, find their Instagram/Facebook email. Do NOT pitch via Etsy messages (against Etsy rules).

## Network (environment "Default", Custom)
- Allowed: etsy, nextdoor (+apex), hotfrog, threeui, github, reactbits, aceternity, magicui, 21st.dev, godly, graph.facebook.com, *.n8n.cloud.
- Etsy (DataDome) and Hotfrog block bots (403) -> use web search for those.
- New allowlist applies to NEW sessions only.

## Sent 7 Oct: Mile-End Soap (mileendsoap@gmail.com), Carr's Creek Soaps (carrscreeksoaps@gmail.com).

## 7 Oct evening: WhatsApp bot WORKED, then stopped
- Fixed by: POST /1662851395263771/subscribed_apps (Graph API Explorer) + new access token in n8n "WhatsApp account" credential.
- Stopped after ~2h: Graph Explorer token is temporary. NEXT: create permanent System User token (business.facebook.com/settings/system-users), assign app + WhatsApp account, never-expire, paste in n8n.
- System prompt v3 in demos/whatsapp-agent-prompt.md. Memory key suffix -v3.
- TODO: 20s wait/debounce for multi-messages.
- Services: website, FB/Google ads, WhatsApp AI agent. Focus US clients.
- No client replies yet (7 Oct evening).

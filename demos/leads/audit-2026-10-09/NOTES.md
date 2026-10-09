# Dallas plumber site audit (9 Oct 2026, mobile view, iPhone 13)
Lead sites now open from this env (network test 9 Oct: nextdoor OK, sketchfab OK, peteplumbingdallas OK; etsy/yelp bot-blocked; awwwards 502).

## Real, verified issues (pitch-worthy)
- **Elite Plumbers Dallas** (elite@eliteplumbersdallas.com): https://eliteplumbersdallas.com/ = ERR_TOO_MANY_REDIRECTS (301 loop to itself). http:// version loads HTML but its CSS/JS are on https -> same loop -> page shows unstyled (Times font, giant logo, no layout). Strongest lead. Screenshot: elite-mobile-unstyled.png
- **CMH Plumbing Solutions** (info@cmhdfw.com): no Call button/phone visible on first mobile screen (only hamburger + "Get Free Estimate"). Screenshot: cmh-mobile-top.png
- **Eagle Plumbing**: hero button "Repair my Plumbing" text overflows its box on mobile (minor).
- **Phantom Plumbing**: H1 is "Home" (SEO), load ~5.6s (minor).

## No real issues (skip)
Reeves Family, Blue Moon, TCS, Double A Pros, Colvex - modern/agency sites.
Koen: blank area under header in headless capture, NOT verified in real browser -> do not claim.

## Sent 9 Oct (from hello@, text only, no demo link)
- 12:46 UTC Elite Plumbers Dallas -> elite@eliteplumbersdallas.com + eliteplumbing12@yahoo.com ("Your website isn't opening for some visitors"). Follow up ~12 Oct.
- 12:57 UTC CMH Plumbing -> info@cmhdfw.com + cmhplumbingsolutions@gmail.com, WITH screenshot ("No call button on CMH Plumbing's mobile homepage"). Follow up ~12 Oct.
- Elite first email went without screenshot (mistake) -> send screenshot in same thread.

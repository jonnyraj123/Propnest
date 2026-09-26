"""Export the local WordPress test store as a static site for Netlify.

Pages are saved as <path>/index.html, assets are downloaded without their ?ver= query,
WordPress/WooCommerce scripts are removed and replaced by demo.js (client-side cart/checkout).
"""
import http.cookiejar
import os
import re
import shutil
import sys
import urllib.error
import urllib.parse
import urllib.request

BASE = "http://localhost:8089"
OUT = sys.argv[1]
DEMO_ASSETS = sys.argv[2]  # folder with demo.js, demo.css, products.json

PAGES = [
    "/", "/shop/", "/cart/", "/checkout/", "/my-account/",
    "/about-us/", "/contact/", "/shipping-policy/", "/return-refund-policy/",
    "/cancellation-policy/", "/privacy-policy/", "/terms-and-conditions/",
    "/product/silk-thread-bangles-choose-your-colour/", "/product/maroon-banarasi-style-saree/",
    "/product/mauve-cotton-midi-dress/", "/product/handmade-crochet-flower-bag/",
    "/product/maroon-bead-pendant-necklace-set/", "/product/pink-green-silk-thread-bangles-set-of-6/",
    "/product/maroon-pearl-jhumka-earrings/",
    "/product-category/earrings/", "/product-category/bangles/", "/product-category/necklaces/",
    "/product-category/bags/", "/product-category/western-wear/", "/product-category/indian-wear/",
]

jar = http.cookiejar.CookieJar()
opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(jar))


def get(url):
    with opener.open(url) as r:
        return r.read()


def local_path(url_path):
    """Map a site URL path (no query) to a file under OUT."""
    p = urllib.parse.unquote(url_path.split("?")[0].split("#")[0])
    if p.endswith("/"):
        p += "index.html"
    return os.path.join(OUT, p.lstrip("/"))


assets = set()
ASSET_RE = re.compile(r"""(?:href|src)=["'](?:http://localhost:8089)?(/wp-(?:content|includes)/[^"'\s>]+)["']""")
SRCSET_RE = re.compile(r"""srcset=["']([^"']+)["']""")


def collect_assets(html):
    for m in ASSET_RE.finditer(html):
        assets.add(m.group(1).split("?")[0])
    for m in SRCSET_RE.finditer(html):
        for part in m.group(1).split(","):
            u = part.strip().split(" ")[0]
            if u:
                assets.add(urllib.parse.urlparse(u).path)


SCRIPT_RE = re.compile(r"<script\b[^>]*>.*?</script>", re.S | re.I)


def clean(html, path):
    # Keep only the theme script; everything else needs WordPress (AJAX, nonces) to work.
    def keep_script(m):
        tag = m.group(0)
        return tag if "/themes/sohag-exclusive/assets/js/main.js" in tag else ""

    html = SCRIPT_RE.sub(keep_script, html)
    # WordPress head extras that point at the API or feeds.
    html = re.sub(r"<link[^>]+rel=['\"](?:https://api\.w\.org/|alternate|EditURI|shortlink|pingback|dns-prefetch)['\"][^>]*>\s*", "", html)
    html = re.sub(r"<meta name=['\"]generator['\"][^>]*>\s*", "", html)
    # Product gallery is hidden until WooCommerce JS runs — show it.
    html = html.replace("opacity: 0; transition: opacity .25s ease-in-out;", "")
    # Absolute URLs -> root-relative; drop ?ver= on local assets.
    html = html.replace("http%3A%2F%2Flocalhost%3A8089", "https%3A%2F%2Fsohagexclusive.com")
    html = html.replace("http://localhost:8089", "").replace("http:\\/\\/localhost:8089", "")
    html = re.sub(r"(/wp-(?:content|includes)/[^\"'\s>?]+)\?ver=[^\"'\s>&]*", r"\1", html)
    html = re.sub(r"(/wp-(?:content|includes)/[^\"'\s>?]+)\?[^\"'\s>]*", r"\1", html)
    html = html.replace("woocommerce-no-js", "woocommerce-js")
    # Demo assets.
    html = html.replace("</head>", '<link rel="stylesheet" href="/demo/demo.css">\n</head>', 1)
    html = html.replace("</body>", '<script src="/demo/products.js"></script>\n<script src="/demo/demo.js"></script>\n</body>', 1)
    return html


def save_page(path, html):
    dest = local_path(path)
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    with open(dest, "w", encoding="utf-8") as f:
        f.write(html)


if os.path.exists(OUT):
    shutil.rmtree(OUT)
os.makedirs(OUT)

# Put one item in the cart so the cart and checkout templates render their full layout.
get(BASE + "/?add-to-cart=43")
get(BASE + "/cart/")  # consume the "added to cart" notice so it doesn't appear on exported pages

for path in PAGES:
    html = get(BASE + path).decode("utf-8")
    collect_assets(html)
    save_page(path, clean(html, path))

# 404 page (Netlify serves /404.html for unknown paths).
try:
    get(BASE + "/this-page-does-not-exist/")
except urllib.error.HTTPError as e:
    html = e.read().decode("utf-8")
    collect_assets(html)
    save_page("/404.html", clean(html, "/404.html"))

# Order-received page: About Us shell with an empty container that demo.js fills in.
about = open(local_path("/about-us/"), encoding="utf-8").read()
about = re.sub(r"<title>[^<]*</title>", "<title>Order Received &#8211; Sohag Exclusive</title>", about)
about = re.sub(r'(<div class="page-hero">\s*<div class="container">\s*<h1>)[^<]*(</h1>)', r"\1Order Received\2", about)
about = re.sub(r'<div class="container content-area">.*?</main>',
               '<div class="container content-area"><div class="woocommerce" id="demo-order"></div></div>\n</main>',
               about, flags=re.S)
save_page("/order-received/", about)

# Download assets, then anything their CSS references (fonts, icons).
done = set()
queue = sorted(assets)
while queue:
    a = queue.pop()
    if a in done:
        continue
    done.add(a)
    try:
        data = get(BASE + a)
    except Exception as exc:  # noqa: BLE001
        print("skip", a, exc)
        continue
    dest = local_path(a)
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    if a.endswith(".css"):
        css = data.decode("utf-8", "replace")
        for m in re.finditer(r"url\(\s*['\"]?([^'\")]+)['\"]?\s*\)", css):
            ref = m.group(1)
            if ref.startswith(("data:", "http:", "https:", "#")):
                continue
            full = urllib.parse.urljoin(a, ref).split("?")[0].split("#")[0]
            queue.append(full)
        data = css.replace("http://localhost:8089", "").encode("utf-8")
    with open(dest, "wb") as f:
        f.write(data)

# Demo files.
shutil.copytree(DEMO_ASSETS, os.path.join(OUT, "demo"))
print("pages:", len(PAGES) + 2, "assets:", len(done))

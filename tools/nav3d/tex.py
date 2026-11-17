# Texture painter for the pre-rendered Navigator rooms. Run with normal Python (needs Pillow):
#   python tools/nav3d/tex.py          -> writes tools/nav3d/tex/*.png
# Everything here is original procedural art.
import math, os, random
from PIL import Image, ImageDraw, ImageFilter, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))
TEX = os.path.join(HERE, "tex")
os.makedirs(TEX, exist_ok=True)
FONTS = os.path.join(os.environ.get("WINDIR", r"C:\Windows"), "Fonts")

def font(name="arialbd.ttf", size=20):
    try: return ImageFont.truetype(os.path.join(FONTS, name), size)
    except Exception: return ImageFont.load_default()

def emoji(img, xy, ch, size):
    """Draw a colour emoji (Segoe UI Emoji) centred at xy."""
    f = font("seguiemj.ttf", size); d = ImageDraw.Draw(img)
    try:
        l, t, r, b = d.textbbox((0, 0), ch, font=f, embedded_color=True)
        d.text((xy[0] - (l + r) / 2, xy[1] - (t + b) / 2), ch, font=f, embedded_color=True)
    except Exception: d.text(xy, ch, font=f, fill="#222", anchor="mm")

def hexc(h):
    h = h.lstrip("#")
    if len(h) == 3: h = "".join(ch * 2 for ch in h)
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))
def mix(a, b, t): return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))
def save(img, name): img.save(os.path.join(TEX, name)); print("tex", name)

# ------------------------------------------------------------------ floors and rugs
def planks(name, base="#a8622e", dark="#6a3414", w=1024, h=1024, rows=8, seed=1):
    r = random.Random(seed); img = Image.new("RGB", (w, h)); d = ImageDraw.Draw(img)
    B, D = hexc(base), hexc(dark); rh = h // rows
    for i in range(rows):
        x = -r.randint(0, w // 2)
        while x < w:
            L = r.randint(w // 3, w); t = r.random() * 0.45
            c = mix(B, D, t)
            d.rectangle([x, i * rh, x + L, (i + 1) * rh], fill=c)
            for g in range(18):  # grain lines
                gy = i * rh + r.randint(2, rh - 2); gc = mix(c, D, 0.25 + r.random() * 0.3)
                pts = [(xx, gy + int(3 * math.sin(xx / r.uniform(40, 120) + g))) for xx in range(x, x + L, 12)]
                if len(pts) > 1: d.line(pts, fill=gc, width=1)
            d.line([(x, i * rh), (x, (i + 1) * rh)], fill=mix(D, (0, 0, 0), 0.4), width=2)
            x += L
        d.line([(0, i * rh), (w, i * rh)], fill=mix(D, (0, 0, 0), 0.5), width=3)
    save(img.filter(ImageFilter.GaussianBlur(0.6)), name)

def persian(name, w=1024, h=640, seed=2, field="#8a1a1a", border="#1a2a5a", accent="#e8c070"):
    r = random.Random(seed); img = Image.new("RGB", (w, h), hexc(field)); d = ImageDraw.Draw(img)
    F, Bc, A = hexc(field), hexc(border), hexc(accent)
    for k, (c, m) in enumerate([(Bc, 0), (A, 34), (Bc, 44), (A, 70), (F, 78)]):
        d.rectangle([m, m, w - m, h - m], fill=c)
    # diamond lattice
    s = 64
    for y in range(78, h - 78, s):
        for x in range(78, w - 78, s):
            cx, cy = x + s / 2, y + s / 2
            d.polygon([(cx, cy - 26), (cx + 26, cy), (cx, cy + 26), (cx - 26, cy)], outline=A, fill=mix(F, Bc, 0.35))
            d.ellipse([cx - 6, cy - 6, cx + 6, cy + 6], fill=A)
    # medallion
    cx, cy = w / 2, h / 2
    for rr, c in [(180, A), (160, Bc), (120, F), (90, A), (60, Bc), (24, A)]:
        d.polygon([(cx + rr * 1.3 * math.cos(a), cy + rr * 0.8 * math.sin(a)) for a in [i * math.pi / 8 for i in range(16)]], fill=c)
    # border motifs
    for x in range(10, w, 40):
        d.ellipse([x, 10, x + 16, 26], fill=A); d.ellipse([x, h - 26, x + 16, h - 10], fill=A)
    img = img.filter(ImageFilter.GaussianBlur(1.0))
    px = img.load()
    for _ in range(60000):  # wool speckle
        x, y = r.randrange(w), r.randrange(h); c = px[x, y]; k = r.uniform(0.85, 1.12)
        px[x, y] = tuple(max(0, min(255, int(v * k))) for v in c)
    save(img, name)

def starrug(name, w=1024, h=768, seed=3):
    r = random.Random(seed); img = Image.new("RGB", (w, h), hexc("#1a2a8a")); d = ImageDraw.Draw(img)
    d.rectangle([0, 0, w, h], outline=hexc("#e8c040"), width=26)
    for _ in range(26):
        x, y, s = r.randint(60, w - 60), r.randint(60, h - 60), r.randint(14, 34)
        pts = []
        for i in range(10):
            a = -math.pi / 2 + i * math.pi / 5; rr = s if i % 2 == 0 else s * 0.42
            pts.append((x + rr * math.cos(a), y + rr * math.sin(a)))
        d.polygon(pts, fill=hexc(r.choice(["#ffe060", "#ffffff", "#ffb040"])))
    d.ellipse([w * 0.62, h * 0.18, w * 0.62 + 140, h * 0.18 + 140], fill=hexc("#f8f0c0")); d.ellipse([w * 0.62 + 40, h * 0.18 - 10, w * 0.62 + 180, h * 0.18 + 130], fill=hexc("#1a2a8a"))
    save(img.filter(ImageFilter.GaussianBlur(1.2)), name)

# ------------------------------------------------------------------ wall art
def abstract_fish(name, w=900, h=640, seed=4):
    """An original abstract 'koi' painting: bold strokes on deep blue."""
    r = random.Random(seed); img = Image.new("RGB", (w, h), hexc("#0e2a6a")); d = ImageDraw.Draw(img)
    for _ in range(40):
        x, y = r.randint(0, w), r.randint(0, h); rr = r.randint(30, 120)
        d.ellipse([x - rr, y - rr, x + rr, y + rr], fill=mix(hexc("#0e2a6a"), hexc(r.choice(["#2a6ad8", "#0a1a4a", "#3a8ae8"])), 0.5))
    img = img.filter(ImageFilter.GaussianBlur(18)); d = ImageDraw.Draw(img)
    def koi(cx, cy, s, ang, body, spots):
        pts = []
        for i in range(40):
            t = i / 39 * 2 * math.pi
            x = math.cos(t) * s * (1.0 if math.cos(t) > 0 else 1.25); y = math.sin(t) * s * 0.38 * (1 - 0.4 * max(0, -math.cos(t)))
            pts.append((cx + x * math.cos(ang) - y * math.sin(ang), cy + x * math.sin(ang) + y * math.cos(ang)))
        d.polygon(pts, fill=hexc(body))
        tx, ty = cx - math.cos(ang) * s * 1.3, cy - math.sin(ang) * s * 1.3
        d.polygon([(tx, ty), (tx - math.cos(ang - 0.6) * s * 0.6, ty - math.sin(ang - 0.6) * s * 0.6), (tx - math.cos(ang + 0.6) * s * 0.6, ty - math.sin(ang + 0.6) * s * 0.6)], fill=hexc(body))
        for _ in range(4):
            a = r.uniform(-0.6, 0.8); rr = s * r.uniform(0.1, 0.22)
            sx, sy = cx + math.cos(ang) * s * a, cy + math.sin(ang) * s * a
            d.ellipse([sx - rr, sy - rr, sx + rr, sy + rr], fill=hexc(spots))
        ex, ey = cx + math.cos(ang) * s * 0.75, cy + math.sin(ang) * s * 0.75
        d.ellipse([ex - 6, ey - 12, ex + 6, ey], fill=(10, 10, 10))
    koi(w * 0.45, h * 0.5, 210, -0.15, "#f07a1a", "#fff4e0")
    koi(w * 0.72, h * 0.28, 90, 2.6, "#ffd040", "#e83a1a")
    for _ in range(14):
        x, y = r.randint(0, w), r.randint(0, h)
        d.arc([x, y, x + 60, y + 30], 200, 340, fill=hexc("#7ab8ff"), width=4)
    save(img, name)

def exterior(name, w=1600, h=800, seed=5, pool=True):
    """Painted backyard seen through the windows: sky, hedges, trees and (optionally) a pool."""
    r = random.Random(seed); img = Image.new("RGB", (w, h)); d = ImageDraw.Draw(img)
    for y in range(h):
        t = y / h; d.line([(0, y), (w, y)], fill=mix(hexc("#3a78d8"), hexc("#cfe6ff"), min(1, t * 1.6)))
    for _ in range(9):
        cx, cy = r.randint(0, w), r.randint(30, int(h * 0.35))
        for k in range(7): rr = r.randint(30, 70); d.ellipse([cx + k * 40 - rr, cy - rr * 0.5, cx + k * 40 + rr, cy + rr * 0.5], fill=(250, 252, 255))
    img = img.filter(ImageFilter.GaussianBlur(3)); d = ImageDraw.Draw(img)
    hz = int(h * 0.55)
    d.rectangle([0, hz, w, h], fill=hexc("#4a8a3a"))
    for x in range(-40, w + 40, 55):  # distant tree line
        rr = r.randint(50, 110); d.ellipse([x - rr, hz - rr * 1.3, x + rr, hz + 20], fill=mix(hexc("#2a5a2a"), hexc("#3a7a3a"), r.random()))
    for x in range(0, w, 6):
        d.line([(x, hz + 10), (x + r.randint(-3, 3), hz - r.randint(4, 16))], fill=hexc("#3a6a2a"))
    if pool:
        d.rectangle([0, int(h * 0.68), w, h], fill=hexc("#d8ccb4"))
        d.polygon([(w * 0.05, h * 0.74), (w * 0.95, h * 0.74), (w, h * 0.95), (0, h * 0.95)], fill=hexc("#2a9ae0"))
        for _ in range(300):
            x, y = r.uniform(0, w), r.uniform(h * 0.75, h * 0.94); d.line([(x, y), (x + r.uniform(10, 40), y)], fill=hexc(r.choice(["#7ad0ff", "#1a7ac8", "#b8ecff"])), width=2)
    for x in (w * 0.12, w * 0.78):  # two big trees
        d.rectangle([x - 12, hz - 140, x + 12, hz + 60], fill=hexc("#5a3a1a"))
        for _ in range(30):
            rr = r.randint(40, 90); cx, cy = x + r.randint(-120, 120), hz - 160 + r.randint(-90, 60)
            d.ellipse([cx - rr, cy - rr, cx + rr, cy + rr], fill=mix(hexc("#2a6a2a"), hexc("#6aaa3a"), r.random()))
    save(img.filter(ImageFilter.GaussianBlur(1.2)), name)

def skyline(name, w=1600, h=900, seed=6):
    """Dusk sky over a little skyline for the loft's tall window (3.9)."""
    r = random.Random(seed); img = Image.new("RGB", (w, h)); d = ImageDraw.Draw(img)
    for y in range(h):
        t = y / h; d.line([(0, y), (w, y)], fill=mix(hexc("#0a1a5a"), hexc("#7aa8e8"), min(1, t * 1.3)))
    for _ in range(120): x, y = r.randint(0, w), r.randint(0, int(h * 0.4)); d.point((x, y), fill=(255, 255, 255))
    hz = int(h * 0.62)
    x = 0
    while x < w:
        bw, bh = r.randint(50, 140), r.randint(60, 300); c = mix(hexc("#2a3a5a"), hexc("#4a5a7a"), r.random())
        d.rectangle([x, hz - bh, x + bw, hz + 40], fill=c)
        for wy in range(hz - bh + 12, hz, 22):
            for wx in range(x + 8, x + bw - 8, 18):
                if r.random() < 0.45: d.rectangle([wx, wy, wx + 8, wy + 10], fill=hexc(r.choice(["#ffe08a", "#ffd060", "#fff4c0"])))
        x += bw + r.randint(4, 30)
    d.rectangle([0, hz + 30, w, h], fill=hexc("#3a6a32"))
    for x in range(-40, w, 70):
        rr = r.randint(30, 60); d.ellipse([x - rr, hz + 10 - rr, x + rr, hz + 40 + rr * 0.3], fill=hexc("#2a5a2a"))
    d.rectangle([0, int(h * 0.82), w, h], fill=hexc("#7a7468"))
    for x in range(0, w, 60): d.line([(x, h * 0.82), (x, h)], fill=hexc("#5a5448"), width=3)
    save(img.filter(ImageFilter.GaussianBlur(1.0)), name)

# ------------------------------------------------------------------ boxes, books, labels
def boxart(name, title, glyph, c1, c2, ink="#ffffff", w=320, h=420, sub=""):
    img = Image.new("RGB", (w, h)); d = ImageDraw.Draw(img)
    for y in range(h): d.line([(0, y), (w, y)], fill=mix(hexc(c1), hexc(c2), y / h))
    d.rectangle([0, 0, w, 30], fill=mix(hexc(c1), (255, 255, 255), 0.25))
    d.ellipse([w / 2 - 110, 70, w / 2 + 110, 290], fill=mix(hexc(c1), (255, 255, 255), 0.18))
    if glyph: emoji(img, (w / 2, 180), glyph, 130)
    f = font("ariblk.ttf", 34 if len(title) < 12 else 26); d = ImageDraw.Draw(img)
    lines, cur = [], ""
    for wd in title.split():
        if len(cur + " " + wd) > 12 and cur: lines.append(cur); cur = wd
        else: cur = (cur + " " + wd).strip()
    lines.append(cur)
    for i, l in enumerate(lines[:2]): d.text((w / 2, 330 + i * 38), l, font=f, fill=hexc(ink), anchor="mm")
    if sub: d.text((w / 2, 22), sub, font=font("arialbd.ttf", 16), fill=hexc(ink), anchor="mm")
    save(img, name)

def spines(name, colors, w=1024, h=256, seed=7, gold=True):
    r = random.Random(seed); img = Image.new("RGB", (w, h), (20, 8, 4)); d = ImageDraw.Draw(img)
    x = 0
    while x < w:
        bw = r.randint(28, 52); c = hexc(r.choice(colors)); top = r.randint(0, 40)
        for i in range(bw):  # rounded spine shading
            k = 0.65 + 0.45 * math.sin(math.pi * i / bw); d.line([(x + i, top), (x + i, h)], fill=tuple(min(255, int(v * k)) for v in c))
        if gold:
            for yy in (top + 20, top + 30, h - 30):
                d.line([(x + 4, yy), (x + bw - 4, yy)], fill=hexc("#e8c060"), width=3)
            d.rectangle([x + bw * 0.3, top + 60, x + bw * 0.7, top + 150], fill=mix(c, (0, 0, 0), 0.3))
        x += bw + 1
    save(img, name)

def label(name, text_, w=512, h=128, bg="#00000000", fg="#ffffff", fnt="arialbd.ttf", size=72, glyph=None):
    img = Image.new("RGBA", (w, h), (0, 0, 0, 0) if bg.endswith("00000000") else hexc(bg) + (255,)); d = ImageDraw.Draw(img)
    x = w / 2
    if glyph:
        emoji(img, (h * 0.55, h / 2), glyph, int(h * 0.62)); x = (w + h) / 2
    d.text((x, h / 2), text_, font=font(fnt, size), fill=hexc(fg) + (255,), anchor="mm")
    save(img, name)

def tile(name, glyph, caption, bg="#fff4e0", ink="#5a2a08", w=256, h=256):
    img = Image.new("RGB", (w, h), hexc(bg)); d = ImageDraw.Draw(img)
    d.rectangle([6, 6, w - 7, h - 7], outline=hexc(ink), width=6)
    emoji(img, (w / 2, h * 0.44), glyph, 110)
    d = ImageDraw.Draw(img); d.text((w / 2, h * 0.85), caption, font=font("arialbd.ttf", 26), fill=hexc(ink), anchor="mm")
    save(img, name)

def screen(name, kind="tv", w=640, h=480):
    img = Image.new("RGB", (w, h)); d = ImageDraw.Draw(img)
    if kind == "tv":
        for y in range(h): d.line([(0, y), (w, y)], fill=mix(hexc("#0a141c"), hexc("#1a2a34"), y / h))
        d.polygon([(0, 0), (w * 0.55, 0), (w * 0.2, h), (0, h)], fill=hexc("#1c2c38"))
    elif kind == "desktop":
        d.rectangle([0, 0, w, h], fill=hexc("#008080"))
        for i in range(4): d.rectangle([20, 20 + i * 70, 60, 60 + i * 70], fill=hexc(["#c0c0c0", "#ffd040", "#c0c0c0", "#40a0ff"][i]))
        d.rectangle([150, 90, 560, 380], fill=hexc("#c0c0c0")); d.rectangle([150, 90, 560, 116], fill=hexc("#000080"))
        d.rectangle([0, h - 34, w, h], fill=hexc("#c0c0c0")); d.rectangle([6, h - 30, 90, h - 4], fill=hexc("#d8d8d8"))
    elif kind == "linkedin":
        d.rectangle([0, 0, w, h], fill=hexc("#0a3a6a"))
        d.rounded_rectangle([w / 2 - 110, 90, w / 2 + 110, 310], 30, fill=hexc("#0a66c2"))
        d.text((w / 2, 200), "in", font=font("ariblk.ttf", 170), fill=(255, 255, 255), anchor="mm")
        d.text((w / 2, 380), "LinkedIn", font=font("arialbd.ttf", 54), fill=hexc("#bfe8ff"), anchor="mm")
    save(img, name)

def calendar_blank(name, w=256, h=320):
    img = Image.new("RGB", (w, h), (255, 255, 255)); d = ImageDraw.Draw(img)
    d.rectangle([0, 0, w, 80], fill=hexc("#c82a2a"))
    for i in range(2): d.ellipse([60 + i * 120, 8, 76 + i * 120, 24], fill=(60, 60, 60))
    save(img, name)

def registration(name, w=800, h=500):
    img = Image.new("RGB", (w, h), hexc("#e8dcc0")); d = ImageDraw.Draw(img)
    for _ in range(4000):
        x, y = random.randrange(w), random.randrange(h); d.point((x, y), fill=mix(hexc("#e8dcc0"), hexc("#b8a888"), random.random()))
    d.rounded_rectangle([40, 70, 340, 370], 30, fill=hexc("#0a66c2"))
    d.text((190, 220), "in", font=font("ariblk.ttf", 200), fill=(255, 255, 255), anchor="mm")
    d.text((560, 170), "REGISTER", font=font("ariblk.ttf", 64), fill=hexc("#3a3628"), anchor="mm")
    d.text((560, 250), "with Dom", font=font("arial.ttf", 46), fill=hexc("#3a3628"), anchor="mm")
    d.line([(400, 320), (720, 320)], fill=hexc("#3a3628"), width=4)
    d.text((560, 380), "THIS SIDE UP  \u2191\u2191", font=font("arialbd.ttf", 30), fill=hexc("#7a6a48"), anchor="mm")
    d.rectangle([0, 0, w, 30], fill=hexc("#c8b88a")); d.rectangle([0, h - 30, w, h], fill=hexc("#c8b88a"))
    save(img, name)

def plaque(name, symbols="\u2609 \u263d \u2644 \u2643 \u263f", bg="#2a2418", fg="#c8b87a", w=512, h=160):
    img = Image.new("RGB", (w, h), hexc(bg)); d = ImageDraw.Draw(img)
    d.rectangle([6, 6, w - 7, h - 7], outline=hexc("#8a7a50"), width=6)
    d.text((w / 2, h / 2), symbols, font=font("seguisym.ttf", 80), fill=hexc(fg), anchor="mm")
    save(img, name)

def stereo_face(name, w=512, h=128):
    img = Image.new("RGB", (w, h), hexc("#1a1a1e")); d = ImageDraw.Draw(img)
    d.rectangle([20, 30, 200, 90], fill=hexc("#0a1a10")); d.text((110, 60), "88:88", font=font("consola.ttf", 40), fill=hexc("#4f6"), anchor="mm")
    for i in range(6): d.ellipse([230 + i * 40, 46, 254 + i * 40, 70], fill=hexc("#3a3a40"), outline=hexc("#6a6a70"))
    d.ellipse([w - 90, 24, w - 20, 94], fill=hexc("#2a2a30"), outline=hexc("#8a8a90"), width=3)
    d.rectangle([20, 100, 300, 108], fill=hexc("#2a2a30"))
    save(img, name)

def clockface(name, w=256):
    img = Image.new("RGBA", (w, w), (0, 0, 0, 0)); d = ImageDraw.Draw(img); d.ellipse([2, 2, w - 3, w - 3], fill=(250, 248, 240, 255))
    for i in range(12):
        a = i * math.pi / 6; r0, r1 = w * 0.38, w * 0.46
        d.line([(w / 2 + r0 * math.sin(a), w / 2 - r0 * math.cos(a)), (w / 2 + r1 * math.sin(a), w / 2 - r1 * math.cos(a))], fill=(30, 30, 30), width=6 if i % 3 == 0 else 3)
    save(img, name)

if __name__ == "__main__":
    planks("floor_cherry.png", "#b0642a", "#6a2e10", rows=10)
    planks("floor_maple.png", "#d8a868", "#a0703a", rows=10, seed=11)
    planks("floor_dark.png", "#5a3420", "#2a160a", rows=12, seed=12)
    persian("rug_persian.png")
    starrug("rug_stars.png")
    abstract_fish("art_koi.png")
    exterior("ext_pool.png")
    exterior("ext_garden.png", pool=False, seed=9)
    skyline("ext_skyline.png")
    registration("register.png")
    spines("books_blue.png", ["#1a3a8a", "#2a4aa0", "#3a5ab8", "#0a2a6a", "#7a1a1a"])
    spines("books_red.png", ["#b01818", "#c83a2a", "#8a1010", "#e8dcc0"], seed=8)
    spines("books_mixed.png", ["#1a3a6a", "#7a1a1a", "#2a5a2a", "#c8a030", "#3a2a5a", "#8a5a2a"], seed=9)
    screen("tv.png", "tv"); screen("pc_desktop.png", "desktop"); screen("pc_linkedin.png", "linkedin")
    stereo_face("stereo.png"); clockface("clock.png"); calendar_blank("calendar.png")
    plaque("plaque.png")
    for k, t, g, c1, c2, ink in [
        ("svc_linkedin", "LinkedIn Online", "\U0001F4BC", "#0a66c2", "#02284a", "#ffffff"), ("svc_github", "GitHub Service", "\U0001F419", "#24292e", "#000000", "#ffffff"),
        ("svc_mail", "Mail Dom", "\u2709\ufe0f", "#e8b81a", "#5a4000", "#ffffff"), ("svc_oldsite", "Old Homepage", "\U0001F4DF", "#0a5a0a", "#001a00", "#9fff9f"),
        ("svc_net", "Internet in a Box", "\U0001F310", "#1a5ab8", "#0a1a4a", "#ffffff"), ("svc_arcade", "404 Arcade", "\U0001F47E", "#6a0aa0", "#1a0030", "#ffe040"),
        ("svc_phone", "Internet Phone", "\u260e\ufe0f", "#e8e8e8", "#8a8a8a", "#1a2a5a")]:
        boxart(k + ".png", t, g, c1, c2, ink)
    for k, g, cap in [("tut_mouse", "\U0001F5B1\ufe0f", "MOUSE"), ("tut_overview", "\U0001F39E\ufe0f", "OVERVIEW"), ("tut_about", "\U0001F4C4", "ABOUT"), ("tut_media", "\U0001F3B5", "MEDIA"),
                      ("tut_software", "\U0001F4BF", "SOFTWARE"), ("tut_info", "\U0001F4DA", "INFO"), ("tut_kidspace", "\U0001F680", "KIDSPACE"), ("tut_internet", "\U0001F310", "INTERNET"), ("tut_faq", "\u2753", "Q & A")]:
        tile(k + ".png", g, cap)
    label("lbl_tutorials.png", "TUTORIALS", fg="#3a1404", fnt="georgiab.ttf")
    label("lbl_manuals.png", "MANUALS", fg="#f0d890", fnt="georgiab.ttf")
    label("lbl_swlib.png", "SOFTWARE LIBRARY", w=1024, fg="#f0d890", fnt="arialbd.ttf", size=64)
    label("lbl_questions.png", "QUESTIONS", fg="#f0e090", fnt="arialbd.ttf")
    label("lbl_internet.png", "INTERNET", fg="#ffffff", fnt="ariblk.ttf")
    label("door_gameroom.png", "GAMEROOM", w=512, h=640, bg="#f4f0e4", fg="#5a2a6a", size=56, glyph=None)
    label("door_workspace.png", "WORKSPACE", w=512, h=640, bg="#f4f0e4", fg="#2a4a6a", size=56)

import sys; sys.path.insert(0, ".")
from tex import *
def wallpaper(name, base="#eadcbc", stripe="#e0cfa8", w=512, h=512):
    img = Image.new("RGB", (w, h), hexc(base)); d = ImageDraw.Draw(img)
    for x in range(0, w, 64):
        d.rectangle([x, 0, x + 22, h], fill=hexc(stripe))
        for y in range(16, h, 64):
            cx = x + 43; d.polygon([(cx, y - 7), (cx + 5, y), (cx, y + 7), (cx - 5, y)], fill=hexc(stripe))
    save(img.filter(ImageFilter.GaussianBlur(0.8)), name)
wallpaper("wallpaper_cream.png")
wallpaper("wallpaper_red.png", "#8a2a1a", "#7a2216")

def wicker(name, w=512, h=512):
    img = Image.new("RGB", (w, h), hexc("#1a3a3a")); d = ImageDraw.Draw(img)
    for y in range(0, h, 16):
        for x in range(0, w, 32):
            o = 16 if (y // 16) % 2 else 0
            d.rounded_rectangle([x + o, y + 2, x + o + 28, y + 14], 5, fill=hexc("#3a6a6a"))
    for x in range(0, w, 32): d.line([(x + 30, 0), (x + 30, h)], fill=hexc("#0a2a2a"), width=4)
    save(img, name)
wicker("wicker.png")

def globe_map(name, w=1024, h=512, seed=21):
    r = random.Random(seed); img = Image.new("RGB", (w, h), hexc("#1a5ab8")); d = ImageDraw.Draw(img)
    for _ in range(14):
        cx, cy = r.randint(0, w), r.randint(int(h * 0.15), int(h * 0.85))
        for _ in range(26):
            rr = r.randint(14, 60); x, y = cx + r.randint(-90, 90), cy + r.randint(-50, 50)
            d.ellipse([x - rr, y - rr * 0.7, x + rr, y + rr * 0.7], fill=hexc(r.choice(["#3a9a3a", "#4aaa3a", "#8aa04a", "#c8b070"])))
    d.rectangle([0, 0, w, 26], fill=(240, 248, 255)); d.rectangle([0, h - 26, w, h], fill=(240, 248, 255))
    for y in range(0, h, 64): d.line([(0, y), (w, y)], fill=hexc("#7ab0e8"), width=1)
    for x in range(0, w, 64): d.line([(x, 0), (x, h)], fill=hexc("#7ab0e8"), width=1)
    save(img.filter(ImageFilter.GaussianBlur(1.2)), name)
globe_map("globe_map.png")
def portal_label(name, glyph, text_, fg, w=512, h=640):
    img = Image.new("RGBA", (w, h), (0, 0, 0, 0)); d = ImageDraw.Draw(img)
    emoji(img, (w / 2, h * 0.38), glyph, 220)
    d = ImageDraw.Draw(img); d.text((w / 2, h * 0.8), text_, font=font("ariblk.ttf", 64), fill=hexc(fg) + (255,), anchor="mm", stroke_width=4, stroke_fill=(0, 0, 0, 160))
    save(img, name)
portal_label("lbl_kidspace.png", "\U0001F680", "KIDSPACE", "#ffffff")
portal_label("lbl_myspace.png", "\U0001F319", "MYSPACE", "#e0d0ff")
portal_label("lbl_gameroom.png", "\U0001F0CF", "GAMEROOM", "#ffe8ff")
portal_label("lbl_workspace.png", "\U0001F5C2\ufe0f", "WORKSPACE", "#e8f4ff")

GAMES = [("doom", "DOOM", "#8a1a0a", "#2a0400", "\U0001F479"), ("minesweeper", "Minesweeper", "#6a6a7a", "#2a2a3a", "\U0001F4A3"),
         ("app-kojima", "Kojima Names", "#4a5a3a", "#1a2010", "\U0001F4E6"), ("pinball", "Space Pinball", "#2a1a6a", "#0a0a2a", "\U0001F680"),
         ("app-lostatsea", "Lost at Sea", "#0a5a8a", "#022a40", "\U0001F6DF"), ("tk-oneshot", "One Shot", "#5a1a5a", "#1a041a", "\U0001F409"),
         ("solitaire", "Solitaire", "#1a7a3a", "#0a3a1a", "\U0001F0A1"), ("app-everybodyisjohn", "Everybody is John", "#6a2a6a", "#2a0a2a", "\U0001F3B2"),
         ("tk-pointkeeper", "Point Keeper", "#3a7a7a", "#0a2a2a", "\U0001F4DD")]
for gid, t, c1, c2, g in GAMES: boxart("game_" + gid + ".png", t, g, c1, c2)
def night_window(name, w=800, h=800, seed=31):
    r = random.Random(seed); img = Image.new("RGB", (w, h)); d = ImageDraw.Draw(img)
    for y in range(h): d.line([(0, y), (w, y)], fill=mix(hexc("#0a0a2a"), hexc("#3a2a6a"), y / h))
    for _ in range(220): x, y = r.randint(0, w), r.randint(0, h); d.point((x, y), fill=(255, 255, 255))
    d.ellipse([w * 0.58, h * 0.16, w * 0.58 + 130, h * 0.16 + 130], fill=hexc("#efe6ff"))
    d.ellipse([w * 0.58 + 30, h * 0.16 + 30, w * 0.58 + 52, h * 0.16 + 52], fill=hexc("#d8ccf0"))
    for x in range(0, w, 40):  # rooftops and a chimney silhouette
        d.rectangle([x, h * 0.78 + r.randint(-30, 30), x + 40, h], fill=hexc("#120a1e"))
    save(img.filter(ImageFilter.GaussianBlur(0.8)), name)
night_window("night.png")
def stone(name, w=512, h=512, seed=33):
    r = random.Random(seed); img = Image.new("RGB", (w, h), hexc("#2a2420")); d = ImageDraw.Draw(img)
    for row in range(0, h, 48):
        x = -r.randint(0, 60)
        while x < w:
            bw = r.randint(60, 110); c = mix(hexc("#5a5450"), hexc("#8a8076"), r.random())
            d.rounded_rectangle([x + 3, row + 3, x + bw - 3, row + 45], 8, fill=c); x += bw
    save(img.filter(ImageFilter.GaussianBlur(1.0)), name)
stone("stone.png")

label("lbl_crypt.png", "MY CRYPT", w=512, h=128, fg="#c9a54a", fnt="georgiab.ttf", size=60)
portal_label("lbl_lab.png", "\u2697\ufe0f", "MY LAB", "#9fe8bf", w=512, h=320)
portal_label("lbl_exit.png", "\U0001F6AA", "LIVING ROOM", "#e0d0ff", w=640, h=320)

def roundmask(src, name):
    im = Image.open(os.path.join(TEX, src)).convert("RGBA"); w, h = im.size
    mk = Image.new("L", (w, h), 0); ImageDraw.Draw(mk).ellipse([0, 0, w - 1, h - 1], fill=255); im.putalpha(mk); save(im, name)
roundmask("night.png", "night_round.png")

def polka(name, w=512, h=512):
    img = Image.new("RGB", (w, h), hexc("#f2f2f0")); d = ImageDraw.Draw(img)
    for y in range(0, h, 64):
        for x in range(0, w, 64):
            o = 32 if (y // 64) % 2 else 0; d.ellipse([x + o + 10, y + 10, x + o + 54, y + 54], fill=hexc("#141414"))
    save(img, name)
polka("polka.png")
def sea(name, w=512, h=512):
    img = Image.new("RGB", (w, h)); d = ImageDraw.Draw(img)
    for y in range(h): d.line([(0, y), (w, y)], fill=mix(hexc("#5aa8e8"), hexc("#cfe8ff"), y / (h * 0.55)) if y < h * 0.55 else mix(hexc("#1a6ab0"), hexc("#0a3a7a"), (y - h * 0.55) / (h * 0.45)))
    for i in range(40): x, y = random.randint(0, w), random.randint(int(h * 0.58), h); d.line([(x, y), (x + 30, y)], fill=hexc("#7ac0ff"), width=2)
    save(img, name)
sea("sea.png")
def arcade_screen(name, w=320, h=240):
    img = Image.new("RGB", (w, h), (0, 0, 0)); d = ImageDraw.Draw(img)
    d.text((w / 2, 70), "404", font=font("consola.ttf", 90), fill=hexc("#55ff55"), anchor="mm")
    d.text((w / 2, 150), "INSERT COIN", font=font("consola.ttf", 26), fill=hexc("#ffff55"), anchor="mm")
    for x in range(20, w, 40): d.rectangle([x, 200, x + 16, 214], fill=hexc("#ff55ff"))
    save(img, name)
arcade_screen("arcade.png")
label("lbl_arcade.png", "404 ARCADE", w=512, h=128, fg="#ffe040", fnt="ariblk.ttf", size=64)

roundmask("sea.png", "sea_round.png")


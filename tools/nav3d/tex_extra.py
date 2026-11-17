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

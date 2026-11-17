# Navigator 3.5 — Living Room. Warm 1995 CG: cherry wall unit, marble coffee table, pool out the window.
import sys, os, math
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from lib import *

reset()
T = lambda n: os.path.join(TEX, n)
PI = math.pi

# ---------------------------------------------------------------- materials
cherry = wood("cherry", "#9a2a12", "#4a0c04", scale=5, rough=0.22, coat=0.7, axis="X")
cherryV = wood("cherryV", "#9a2a12", "#4a0c04", scale=5, rough=0.22, coat=0.7, axis="Z")
wall = image("wall", T("wallpaper_cream.png"), rough=0.85, spec=0.15, world_scale=0.9)
wallR = mat("wallR", "#e6d6b6", rough=0.85, spec=0.2)
trim = mat("trim", "#f8f2e4", rough=0.4)
ceil = mat("ceil", "#f4ecdc", rough=0.9)
floor = image("floor", T("floor_cherry.png"), rough=0.15, spec=0.7, world_scale=0.35)
rug = image("rug", T("rug_persian.png"), rough=0.95, spec=0.05)
blk = mat("black", "#141416", rough=0.3, spec=0.5)
blkm = mat("blackMatte", "#1c1c20", rough=0.7)
glass = mat("glass", "#dff0ff", rough=0.02, glass=1.0, spec=0.5)
gold = mat("gold", "#c9a54a", rough=0.25, metal=1.0)
chrome = mat("chrome", "#d8d8dc", rough=0.12, metal=1.0)
beige = mat("beige", "#e2d8c0", rough=0.45)
cream = mat("cream", "#f4eedc", rough=0.5)
marb = marble("marble", "#f6f3ec", "#a8a29a", scale=2.4)
red = mat("upholstery", "#a81c1c", rough=0.75)
void = mat("void", "#000000", alpha=0.0)

# ---------------------------------------------------------------- shell: 7m wide, 7m deep, 3m high
X0, X1, Y1, H = -3.2, 3.2, 6.0, 3.0
box("floor", X0, X1, -1.5, Y1, -0.05, 0, floor, bevel=0)
box("ceiling", X0, X1, -1.5, Y1, H, H + 0.05, ceil, bevel=0)
# back wall with a big picture window on the left
box("backL", X0, -3.1, Y1, Y1 + 0.15, 0, H, wall, bevel=0)
box("backSill", -3.1, -1.7, Y1, Y1 + 0.15, 0, 0.75, wall, bevel=0)
box("backHead", -3.1, -1.7, Y1, Y1 + 0.15, 2.35, H, wall, bevel=0)
box("backR", -1.7, X1, Y1, Y1 + 0.15, 0, H, wall, bevel=0)
for n, a in (("B", (-3.12, -1.68, 0.72, 0.78)), ("T", (-3.12, -1.68, 2.32, 2.38)), ("L", (-3.12, -3.06, 0.72, 2.38)), ("R", (-1.74, -1.68, 0.72, 2.38)), ("M", (-2.43, -2.37, 0.75, 2.35)), ("H", (-3.08, -1.72, 1.53, 1.58))):
    box("winFrame" + n, a[0], a[1], Y1 - 0.04, Y1 + 0.02, a[2], a[3], trim)
# the backyard: a painted backdrop lit by itself
yd = wallquad("yard", -10, 7, -1.6, 5.0, 13, image("yardImg", T("ext_pool.png"), emit=1.3, rough=1)); yd.visible_shadow = False
# left wall with a doorway to the Info Room (a lit hall beyond)
box("leftA", X0 - 0.15, X0, -1.5, 3.0, 0, H, wall, bevel=0)
box("leftB", X0 - 0.15, X0, 4.2, Y1, 0, H, wall, bevel=0)
box("leftHead", X0 - 0.15, X0, 3.0, 4.2, 2.3, H, wall, bevel=0)
door_info = [box("doorL1", X0 - 0.02, X0 + 0.06, 2.92, 3.02, 0, 2.38, cherry), box("doorL2", X0 - 0.02, X0 + 0.06, 4.18, 4.28, 0, 2.38, cherry), box("doorL3", X0 - 0.02, X0 + 0.06, 2.92, 4.28, 2.3, 2.38, cherry)]
box("hallFloor", -6.5, X0, 3.0, 4.2, -0.05, 0, floor, bevel=0)
box("hallBack", -6.6, -6.5, 2.6, 4.6, 0, H, wall, bevel=0)
box("hallSideA", -6.5, X0, 2.85, 3.0, 0, H, wallR, bevel=0)
box("hallSideB", -6.5, X0, 4.2, 4.35, 0, H, wallR, bevel=0)
box("hallCeil", -6.5, X0, 2.85, 4.35, H, H + 0.05, ceil, bevel=0)
box("hallPic", -6.5, -6.46, 3.3, 3.9, 1.2, 1.8, image("hallArt", T("art_koi.png")), bevel=0)
area("hallLight", (-5.0, 3.6, 2.9), 0.8, 120, "#ffe0b0", target=(-5.0, 3.6, 0))
group("door-info", *door_info, sidequad("doorInfoHot", 3.0, 4.2, 0, 2.3, X0 + 0.01, void, facing=1))
# right wall with an archway to the Software Room (bright shelves beyond)
box("rightA", X1, X1 + 0.15, -1.5, 2.9, 0, H, wallR, bevel=0)
box("rightB", X1, X1 + 0.15, 4.4, Y1, 0, H, wallR, bevel=0)
box("rightHead", X1, X1 + 0.15, 2.9, 4.4, 2.3, H, wallR, bevel=0)
door_sw = [box("doorR1", X1 - 0.06, X1 + 0.02, 2.82, 2.92, 0, 2.38, cherry), box("doorR2", X1 - 0.06, X1 + 0.02, 4.38, 4.48, 0, 2.38, cherry), box("doorR3", X1 - 0.06, X1 + 0.02, 2.82, 4.48, 2.3, 2.38, cherry)]
box("swFloor", X1, 7.0, 2.9, 4.4, -0.05, 0, floor, bevel=0)
box("swBack", 7.0, 7.1, 2.5, 4.8, 0, H, mat("swWall", "#dfe4ea", rough=0.8), bevel=0)
box("swCeil", X1, 7.0, 2.5, 4.8, H, H + 0.05, ceil, bevel=0)
box("swSideA", X1, 7.0, 2.75, 2.9, 0, H, wallR, bevel=0); box("swSideB", X1, 7.0, 4.4, 4.55, 0, H, wallR, bevel=0)
box("swShelf", 3.6, 6.8, 4.3, 4.4, 0, 2.2, cherryV)
box("swShelfEnd", 3.6, 3.7, 3.9, 4.4, 0, 2.2, cherryV)
for i, z in enumerate((0.5, 1.05, 1.6)):
    box(f"swBoard{i}", 3.62, 6.78, 3.92, 4.38, z - 0.03, z, cherry)
    for b in range(10):
        box(f"swBox{i}{b}", 3.75 + b * 0.3, 3.98 + b * 0.3, 3.98, 4.3, z, z + 0.38, mat(f"swb{(i + b) % 5}", ["#c83a2a", "#2a6ad0", "#3aa03a", "#e8a01a", "#8a3ad0"][(i + b) % 5], rough=0.3))
area("swLight", (5.3, 3.65, 2.9), 1.0, 200, "#fff4e0", target=(5.3, 3.65, 0))
group("door-software", *door_sw, sidequad("doorSwHot", 2.9, 4.4, 0, 2.3, X1 - 0.01, void, facing=-1))
box("baseBack", X0, X1, Y1 - 0.03, Y1, 0, 0.12, trim, bevel=0)

# ---------------------------------------------------------------- the cherry wall unit
U0, U1 = 4.55, 4.95
box("unitTop", -1.6, 1.6, U0 - 0.05, U1, 2.25, 2.42, cherry)
for nm, a, b in (("L", -1.6, -0.66), ("R", 0.66, 1.6)):
    box("tower" + nm + "Back", a, b, U1 - 0.04, U1, 0.86, 2.25, mat("cutInside", "#3a0e06", rough=0.7), bevel=0)
    box("tower" + nm + "Low", a, b, U0, U1, 0, 0.92, cherryV)
    box("tower" + nm + "SideA", a, a + 0.09, U0, U1, 0.9, 2.25, cherryV)
    box("tower" + nm + "SideB", b - 0.09, b, U0, U1, 0.9, 2.25, cherryV)
    box("tower" + nm + "Head", a, b, U0, U1, 2.12, 2.25, cherryV)
box("unitNiche", -0.66, 0.66, U1 - 0.02, U1, 0, 2.25, mat("niche", "#2a0804", rough=0.6), bevel=0)
box("unitBase", -0.66, 0.66, U0, U1, 0, 0.12, cherry)
for side, xc in ((-1, -1.13), (1, 1.13)):
    for k, z in enumerate((1.02, 1.55)):
        box(f"glassShelf{side}{k}", xc - 0.38, xc + 0.38, U0 + 0.02, U1 - 0.04, z - 0.015, z, glass, bevel=0)
    box(f"books{side}", xc - 0.32, xc + 0.18, U0 + 0.05, U1 - 0.1, 1.02, 1.36, image("bookImg", T("books_mixed.png")), bevel=0)
    point(f"shelfLamp{side}", (xc, U0 + 0.1, 2.05), 6, "#ffe0a0", radius=0.03)
    box(f"cupboard{side}", xc - 0.38, xc + 0.38, U0 - 0.02, U0, 0.12, 0.84, cherry)
    box(f"knob{side}", xc - side * 0.3, xc - side * 0.27, U0 - 0.05, U0 - 0.02, 0.46, 0.52, gold)
sphere("globe", 1.25, U0 + 0.15, 1.69, 0.13, mat("globe", "#2a6ad8", rough=0.25, coat=1))
cyl("globeStand", 1.25, U0 + 0.15, 1.55, 1.58, 0.07, gold)
box("vase", -1.25, -1.05, U0 + 0.08, U0 + 0.26, 1.55, 1.9, mat("vase", "#1a5a8a", rough=0.15, coat=1))
# TV
tv = box("tvBody", -0.6, 0.6, U0 - 0.05, U1 - 0.03, 0.98, 1.98, blk, bevel=0.03)
scr = wallquad("tvScreen", -0.52, 0.42, 1.06, 1.9, U0 - 0.052, image("tvImg", T("tv.png"), rough=0.05, spec=0.8), anchor="tvScreen")
for i in range(3): cyl(f"tvBtn{i}", 0.51, U0 - 0.055, 1.6 - i * 0.12 - 0.005, 1.6 - i * 0.12 + 0.005, 0.018, chrome, rot=(PI / 2, 0, 0))
group("tv", tv, scr)
# stereo stack
st = []
for i, (z0, z1) in enumerate(((0.14, 0.34), (0.37, 0.56), (0.59, 0.82))):
    st.append(box(f"stereo{i}", -0.48, 0.48, U0 - 0.02, U1 - 0.05, z0, z1, blk, bevel=0.01))
    st.append(wallquad(f"stereoFace{i}", -0.46, 0.46, z0 + 0.02, z1 - 0.02, U0 - 0.022, image("stereoImg", T("stereo.png"), rough=0.25, emit=0.25)))
group("stereo", *st)
# speakers either side of the unit
spk = []
for side, x in ((-1, -2.05), (1, 2.05)):
    spk.append(box(f"spk{side}", x - 0.2, x + 0.2, U0 - 0.25, U0 + 0.1, 0, 1.15, blkm, bevel=0.015))
    for j, (z, r) in enumerate(((0.85, 0.09), (0.45, 0.14))):
        spk.append(cyl(f"cone{side}{j}", x, U0 - 0.26, z - 0.01, z + 0.01, r, mat("cone", "#2a2a2e", rough=0.6), rot=(PI / 2, 0, 0)))
        spk.append(torus(f"ring{side}{j}", x, U0 - 0.265, z, r, 0.012, chrome, rot=(PI / 2, 0, 0)))
group("speakers", *spk)
group("clock", *wallclock("clock", 2.5, 2.48, Y1, 0.2, gold, image("clockImg", T("clock.png"), alpha=True, rough=0.3), blk))

# ---------------------------------------------------------------- portrait + memorial candle (right of the unit)
fr = box("portraitFrame", 2.05, 2.95, Y1 - 0.05, Y1, 1.35, 2.05, gold, bevel=0.012)
pic = wallquad("portraitPic", 2.12, 2.88, 1.42, 1.98, Y1 - 0.052, mat("portraitBlank", "#2a2f9e", rough=0.4), anchor="portrait")
group("portrait", fr, pic)
box("sideTable", 2.1, 2.9, Y1 - 0.6, Y1 - 0.05, 0, 0.62, cherry)
cd = [cyl("candle", 2.5, Y1 - 0.32, 0.62, 0.84, 0.05, mat("wax", "#f8f0e0", rough=0.6)),
      sphere("flame", 2.5, Y1 - 0.32, 0.875, 0.018, mat("flame", "#ffcc40", emit="#ffb030", emit_str=30), scale=(1, 1, 2.2))]
point("candleGlow", (2.5, Y1 - 0.4, 0.95), 3, "#ffb050", radius=0.02)
group("candle", *cd)
# a potted plant in the far left corner by the window
cyl("pot", -2.8, 5.5, 0, 0.42, 0.2, mat("pot", "#c06a3a", rough=0.5))
cyl("trunk", -2.8, 5.5, 0.4, 1.5, 0.025, mat("bark", "#5a3a1a", rough=0.8))
import random
rr = random.Random(3)
for i in range(46):
    a = rr.uniform(0, 2 * PI); h = rr.uniform(0.9, 1.95); rad = rr.uniform(0.05, 0.38) * (1.2 - abs(h - 1.45))
    lf = sphere(f"leaf{i}", -2.8 + rad * math.cos(a), 5.5 + rad * math.sin(a), h, 0.09, mat("leaf" + str(i % 3), ["#2a6a1a", "#3a8a2a", "#1a5a14"][i % 3], rough=0.45, coat=0.3), scale=(1.0, 0.35, 0.55))
    lf.rotation_euler = (rr.uniform(-0.6, 0.6), rr.uniform(-0.6, 0.6), a)

# ---------------------------------------------------------------- the rug, marble coffee table and what's on it
floorquad("rug", -1.9, 1.9, 0.9, 3.4, 0.004, rug)
TZ = 0.42
box("tableTop", -1.05, 1.05, 1.35, 2.45, TZ - 0.05, TZ, marb, bevel=0.012)
for x in (-0.95, 0.85):
    for y in (1.45, 2.25):
        box(f"tleg{x}{y}", x, x + 0.1, y, y + 0.1, 0, TZ - 0.05, chrome, bevel=0.01)
fx = [box("faxBody", -0.85, -0.3, 1.65, 2.05, TZ, TZ + 0.12, beige, bevel=0.02),
      box("faxPanel", -0.82, -0.33, 1.64, 1.75, TZ + 0.12, TZ + 0.13, mat("faxPanel", "#3a3a40", rough=0.4), bevel=0),
      box("faxTray", -0.75, -0.4, 1.95, 2.18, TZ + 0.12, TZ + 0.2, cream, bevel=0.005),
      quad("faxPaper", [(-0.72, 2.02, TZ + 0.2), (-0.43, 2.02, TZ + 0.2), (-0.43, 2.14, TZ + 0.36), (-0.72, 2.14, TZ + 0.36)], mat("paper", "#ffffff", rough=0.8))]
group("fax", *fx)
ph = [box("phoneBase", 0.35, 0.72, 1.6, 1.9, TZ, TZ + 0.07, mat("phone", "#2a2a30", rough=0.35), bevel=0.02),
      box("phoneHandset", 0.36, 0.71, 1.82, 1.9, TZ + 0.07, TZ + 0.12, mat("phone", "#2a2a30", rough=0.35), bevel=0.02)]
for i in range(12):
    ph.append(box(f"key{i}", 0.42 + (i % 3) * 0.07, 0.47 + (i % 3) * 0.07, 1.62 + (i // 3) * 0.045, 1.655 + (i // 3) * 0.045, TZ + 0.07, TZ + 0.08, mat("key", "#d8d8d8", rough=0.4), bevel=0))
group("phone", *ph)
rm = [box("remote", -0.18, -0.06, 1.55, 1.9, TZ, TZ + 0.03, blk, bevel=0.01)]
for i in range(4): rm.append(box(f"rbtn{i}", -0.15, -0.09, 1.6 + i * 0.07, 1.63 + i * 0.07, TZ + 0.03, TZ + 0.036, mat("rbtn" + str(i), ["#c82a2a", "#2a8a2a", "#d8d8d8", "#d8d8d8"][i], rough=0.4), bevel=0))
group("remote", *rm)
lp = [box("lapBase", 0.05, 0.38, 2.05, 2.32, TZ, TZ + 0.025, mat("lap", "#3a3a40", rough=0.4), bevel=0.006),
      quad("lapLid", [(0.04, 2.33, TZ + 0.02), (0.39, 2.33, TZ + 0.02), (0.39, 2.385, TZ + 0.275), (0.04, 2.385, TZ + 0.275)], mat("lap", "#3a3a40", rough=0.4)),
      quad("lapScreen", [(0.06, 2.325, TZ + 0.035), (0.37, 2.325, TZ + 0.035), (0.37, 2.378, TZ + 0.26), (0.06, 2.378, TZ + 0.26)], mat("lapScreen", "#1a5ab8", rough=0.2, emit="#2a7ae8", emit_str=0.8)),
      text("lapText", "TASK", 0.215, 2.345, TZ + 0.15, size=0.065, material=mat("white", "#ffffff", emit="#ffffff", emit_str=2), rot=(PI / 2 - 0.21, 0, 0))]
group("task", *lp)
rb = box("registerBox", 1.55, 2.3, 1.5, 2.05, 0, 0.52, image("regFront", T("register.png"), rough=0.7), bevel=0.01)
box("tape", 1.55, 2.3, 1.74, 1.81, 0.52, 0.525, mat("tape", "#c8b88a", rough=0.5), bevel=0)
rb["hot"] = "register"
# two chairs at the front edges (decor, half out of frame)
for side, x in ((-1, -2.35), (1, 2.55)):
    box(f"chairSeat{side}", x - 0.4, x + 0.4, 0.9, 1.6, 0.42, 0.52, red, bevel=0.03)
    box(f"chairBack{side}", x - 0.4, x + 0.4, 0.82, 0.9, 0.42, 1.15, cherry) if False else None
    for lx in (x - 0.38, x + 0.32):
        for ly in (0.92, 1.52): box(f"cl{side}{lx}{ly}", lx, lx + 0.06, ly, ly + 0.06, 0, 0.42, cherry)
    box(f"chairArm{side}", (x - 0.42 if side > 0 else x + 0.36), (x - 0.36 if side > 0 else x + 0.42), 0.9, 1.6, 0.42, 0.72, cherry)
    box(f"chairArmTop{side}", (x - 0.44 if side > 0 else x + 0.34), (x - 0.34 if side > 0 else x + 0.44), 0.88, 1.62, 0.72, 0.76, cherry)

# decor on the unit and around the room
cyl("urn", -1.2, U0 + 0.2, 2.42, 2.72, 0.09, mat("urn", "#2a4a8a", rough=0.15, coat=1))
sphere("urnTop", -1.2, U0 + 0.2, 2.74, 0.06, mat("urn", "#2a4a8a", rough=0.15, coat=1))
box("statue", 1.1, 1.3, U0 + 0.1, U0 + 0.3, 2.42, 2.82, mat("bronze", "#8a5a2a", rough=0.3, metal=1.0))
cyl("lampPole", -2.9, 4.5, 0, 1.7, 0.02, chrome)
cyl("lampBase", -2.9, 4.5, 0, 0.03, 0.18, chrome)
cone("lampShade", -2.9, 4.5, 1.6, 1.95, 0.28, 0.16, mat("shade", "#f8ecd0", rough=0.7, emit="#fff0c8", emit_str=1.2))
point("lampBulb", (-2.9, 4.5, 1.72), 40, "#ffe0a8", radius=0.08)
for i, x in enumerate((-2.6, 2.6)):
    box(f"sconce{i}", x - 0.1, x + 0.1, Y1 - 0.12, Y1, 2.0, 2.2, mat("sconce", "#f8f0e0", emit="#fff0d0", emit_str=3))

box("hallCase", -5.6, X0 - 0.2, 4.0, 4.2, 0, 2.3, cherryV)
for i, z in enumerate((0.3, 0.85, 1.4)):
    box(f"hallBooks{i}", -5.5, X0 - 0.3, 3.98, 4.0, z, z + 0.42, image("redBooks", T("books_red.png")), bevel=0)
for i, x in enumerate((-1.6, 0, 1.6)):
    box(f"beam{i}", x - 0.12, x + 0.12, -1.5, Y1, H - 0.22, H, cherry)

# ---------------------------------------------------------------- lights
world("#bcd8f0", 0.5)
sun("sun", (0.35, -1.0, -0.6), energy=6.5, color="#ffe2b0", angle=1.2)
area("ceilingMain", (0, 2.8, 2.95), 3.0, 220, "#fff2dc", target=(0, 2.8, 0), size_y=2.0)
area("windowFill", (-2.4, 5.9, 1.5), 1.4, 180, "#d8ecff", target=(-1, 2, 0.5), size_y=1.6)
area("frontFill", (0.5, -1.2, 2.4), 2.5, 90, "#fff4e4", target=(0, 4, 1))
spot("unitSpot", (0, 3.6, 2.95), (0, U0, 1.4), 160, "#fff0d0", angle=60)
for i, x in enumerate((-2.0, 0, 2.0)):
    cyl(f"can{i}", x, 4.2, H - 0.01, H, 0.1, mat("can", "#fffaf0", emit="#fff4dc", emit_str=8))

camera((0.0, -0.45, 1.6), (0.0, 6.0, 1.6), lens=18, shift_y=-0.12)
render("v35_living", 640, 480, samples=160, look="Punchy", exposure=-0.2)

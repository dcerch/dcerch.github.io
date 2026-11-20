# Navigator 3.5 — Software Room: one big cherry cabinet, straight on. Category buttons on the left,
# three shelves of software on the right (the boxes themselves are drawn by the page at the slot anchors).
import sys, os, math
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from common import *

reset(); m = M()
X0, X1, Y1, H = -4.2, 4.2, 4.4, 3.2
wall = image("wallS", T("wallpaper_cream.png"), rough=0.85, spec=0.15, world_scale=0.9)
wallR = mat("wallR", "#e6d6b6", rough=0.85, spec=0.2)
ceil = mat("ceil", "#f4ecdc", rough=0.9)
floor = image("floor", T("floor_cherry.png"), rough=0.15, spec=0.7, world_scale=0.35)
maple = wood("maple", "#e8c890", "#b8884a", scale=4, rough=0.3, coat=0.5, axis="X")
box("floor", X0, X1, -2, Y1 + 3, -0.05, 0, floor, bevel=0)
box("ceiling", X0, X1, -2, Y1 + 3, H, H + 0.05, ceil, bevel=0)
box("left", X0 - 0.15, X0, -2, Y1 + 3, 0, H, wallR, bevel=0); box("right", X1, X1 + 0.15, -2, Y1 + 3, 0, H, wallR, bevel=0)
for i, x in enumerate((-2.4, 2.4)): box(f"beam{i}", x - 0.12, x + 0.12, -2, Y1, H - 0.22, H, m["cherry"])
# back wall with a doorway each side of the cabinet: left -> Info Room, right -> Living Room
DL, DR = (-3.85, -2.75), (2.75, 3.85)
box("backA", X0, DL[0], Y1, Y1 + 0.15, 0, H, wall, bevel=0)
box("backB", DL[1], DR[0], Y1, Y1 + 0.15, 0, H, wall, bevel=0)
box("backC", DR[1], X1, Y1, Y1 + 0.15, 0, H, wall, bevel=0)
for nm, (a, b) in (("L", DL), ("R", DR)):
    box("backHead" + nm, a, b, Y1, Y1 + 0.15, 2.35, H, wall, bevel=0)
door = {}
for nm, (a, b) in (("L", DL), ("R", DR)):
    door[nm] = [box(f"jamb{nm}1", a - 0.08, a + 0.02, Y1 - 0.06, Y1 + 0.02, 0, 2.43, m["cherry"]), box(f"jamb{nm}2", b - 0.02, b + 0.08, Y1 - 0.06, Y1 + 0.02, 0, 2.43, m["cherry"]),
                box(f"jamb{nm}3", a - 0.08, b + 0.08, Y1 - 0.06, Y1 + 0.02, 2.35, 2.43, m["cherry"]), wallquad(f"doorHot{nm}", a, b, 0, 2.35, Y1 + 0.01, m["void"])]
# beyond the left door: the Info Room's red walls and manuals
box("infoBack", X0, -1.5, Y1 + 2.6, Y1 + 2.7, 0, H, mat("infoWall", "#8a2414", rough=0.6), bevel=0)
box("infoBooks", -4.0, -2.6, Y1 + 2.55, Y1 + 2.6, 0.2, 2.2, image("redBooks", T("books_red.png")), bevel=0)
area("infoLight", (-3.3, Y1 + 1.3, 3.1), 0.9, 140, "#ffe0b0", target=(-3.3, Y1 + 1.3, 0))
# beyond the right door: the Living Room (sofa and a window)
# the Living Room beyond is a sunny glass wall onto the garden (real geometry, so the sun pours back through the door)
for i, x in enumerate((1.6, 2.5, 3.4, 4.2)):
    box(f"livMul{i}", x - 0.04, x + 0.04, Y1 + 2.6, Y1 + 2.68, 0, H, mat("mullion", "#f4f0e6", rough=0.35), bevel=0.004)
box("livTransom", 1.5, X1, Y1 + 2.6, Y1 + 2.68, 2.1, 2.16, mat("mullion", "#f4f0e6", rough=0.35), bevel=0.004)
box("livHead", 1.5, X1, Y1 + 2.6, Y1 + 2.7, 2.6, H, wall, bevel=0)
box("livSofa", 2.6, 4.0, Y1 + 1.7, Y1 + 2.35, 0, 0.75, mat("sofa", "#a81c1c", rough=0.7), bevel=0.06)
box("swLawn", -20, 20, Y1 + 2.7, Y1 + 30, -0.05, -0.02, grass(), bevel=0)
tree("swTree0", 2.4, Y1 + 6.5, 1.5, seed=31); tree("swTree1", 5.5, Y1 + 9, 1.3, seed=32, kind="tall")
hedge("swHedge", -4, 9, Y1 + 11, Y1 + 12, 1.3)
sun("sun", (-0.25, -0.85, -0.55), energy=5.0, color="#fff0d0", angle=0.5)
area("livLight", (3.3, Y1 + 1.3, 3.1), 0.9, 90, "#ffe0b0", target=(3.3, Y1 + 1.3, 0))
group("door-info", *door["L"]); group("door-living", *door["R"])

# ---------------------------------------------------------------- the cabinet
C0, C1 = 3.5, 4.3         # front / back
cab = []
box("cabBack", -2.4, 2.4, C1 - 0.06, C1, 0, 2.85, m["cherryV"], bevel=0)
box("cabTop", -2.5, 2.5, C0 - 0.08, C1, 2.75, 2.95, m["cherry"])
box("cabBase", -2.4, 2.4, C0, C1, 0, 0.32, m["cherry"])
box("cabL", -2.4, -2.25, C0, C1, 0, 2.75, m["cherryV"]); box("cabR", 2.25, 2.4, C0, C1, 0, 2.75, m["cherryV"])
box("cabMid", -1.3, -1.15, C0, C1, 0, 2.75, m["cherryV"])
# category buttons
for i in range(7):
    z1 = 2.6 - i * 0.33; z0 = z1 - 0.27
    b = box(f"catBtn{i}", -2.18, -1.36, C0 - 0.06, C0 + 0.02, z0, z1, m["cherry"], bevel=0.02); b["hot"] = f"cat-{i}"
    a = wallquad(f"catLbl{i}", -2.14, -1.5, z0 + 0.03, z1 - 0.03, C0 - 0.062, m["void"], anchor=f"cat{i}")
    sphere(f"catLed{i}", -1.43, C0 - 0.07, (z0 + z1) / 2, 0.022, mat("led", "#5a0a0a", rough=0.2, coat=1))
box("catPanel", -2.25, -1.3, C0 - 0.02, C0, 0.3, 2.68, mat("niche", "#3a0e06", rough=0.6), bevel=0)
# shelves
box("shelfBack", -1.15, 2.25, C1 - 0.08, C1 - 0.06, 0.32, 2.75, m["cherryV"], bevel=0)
rows = (1.96, 1.2, 0.44)
for r, z in enumerate(rows):
    box(f"shelf{r}", -1.15, 2.25, C0 - 0.04, C1 - 0.08, z - 0.05, z, maple, bevel=0.01)
    for c in range(4):
        x = -1.02 + c * 0.82
        wallquad(f"slot{r}{c}", x, x + 0.56, z, z + 0.68, C0 + 0.1, m["void"], anchor=f"slot{r * 4 + c}")
point("cabGlowL", (-0.2, C0 + 0.2, 2.6), 22, "#ffe0a8", radius=0.06)
point("cabGlowR", (1.4, C0 + 0.2, 2.6), 22, "#ffe0a8", radius=0.06)
# the button rail: previous · add · next
rail = box("rail", -0.4, 1.5, C0 - 0.06, C0, 0.06, 0.28, m["cherry"], bevel=0.01)
sym = lambda n, s, x: text(n, s, x, C0 - 0.105, 0.17, size=0.13, material=mat("brassTxt", "#2a1404", rough=0.5), font="seguisym.ttf")
for k, x, s in (("prev", 0.0, "\u25c0"), ("install", 0.55, "+"), ("next", 1.1, "\u25b6")):
    b = box("btn" + k, x - 0.17, x + 0.17, C0 - 0.1, C0 - 0.06, 0.09, 0.25, m["gold"], bevel=0.015)
    t = sym("btnT" + k, s, x)
    group(k, b, t)
wallquad("pageLbl", 1.6, 2.2, 0.08, 0.26, C0 - 0.01, m["void"], anchor="pageLbl")

# ---------------------------------------------------------------- the room's other things
# wicker trash can, front left
wick = image("wicker", T("wicker.png"), rough=0.8)
tc = [cyl("trash", -1.75, 2.55, 0, 0.62, 0.26, wick, verts=40), torus("trashRim", -1.75, 2.55, 0.62, 0.26, 0.02, mat("rim", "#2a3a3a", rough=0.5))]
group("trash", *tc)
# a PC on a marble pedestal (decor, like the original)
box("pedestal", 2.6, 3.2, 2.6, 3.2, 0, 1.0, marble("marble", "#e8e2d8", "#8a8278", scale=2.0), bevel=0.01)
box("pcMon", 2.65, 3.15, 2.65, 3.15, 1.0, 1.42, m["beige"], bevel=0.03)
wallquad("pcScr", 2.71, 3.09, 1.05, 1.37, 2.64, image("pcDesk", T("pc_desktop.png"), emit=0.8, rough=0.2))


# ---------------------------------------------------------------- lights + camera
world("#a8ccf0", 0.35)
area("ceilingMain", (0, 1.8, 3.15), 3.5, 200, "#fff2dc", target=(0, 2.6, 0), size_y=2.0)["soft"] = 1
spot("cabSpot", (0, 0.4, 3.1), (0.3, C0, 1.3), 320, "#fff0d0", angle=70, blend=0.6)
area("frontFill", (0.5, -1.2, 2.4), 2.5, 80, "#fff4e4", target=(0, 4, 1))
ceiling_cans((-1.2, 1.2), 2.2, H)
camera((0.0, -0.1, 1.5), (0.0, 6.0, 1.5), lens=20, shift_y=0.03)
render("v35_software", 640, 480, samples=160, exposure=-0.45)

# Navigator 3.9 — Software Library (generated from the 3.5 room script, then darkened): one big cherry cabinet, straight on. Category buttons on the left,
# three shelves of software on the right (the boxes themselves are drawn by the page at the slot anchors).
import sys, os, math
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from common import *

reset(); m = M()
X0, X1, Y1, H = -4.2, 4.2, 4.4, 3.2
wall = mat("darkWall", "#4a4440", rough=0.8, spec=0.2)
wallR = mat("darkWallR", "#3a3632", rough=0.8, spec=0.2)
ceil = mat("ceilDark", "#2a2826", rough=0.9)
floor = image("floor", T("floor_maple.png"), rough=0.2, spec=0.6, world_scale=0.35)
maple = wood("maple", "#e8c890", "#b8884a", scale=4, rough=0.3, coat=0.5, axis="X")
box("floor", X0, X1, -2, Y1 + 3, -0.05, 0, floor, bevel=0)
box("ceiling", X0, X1, -2, Y1 + 3, H, H + 0.05, ceil, bevel=0)
box("left", X0 - 0.15, X0, -2, Y1 + 3, 0, H, wallR, bevel=0); box("right", X1, X1 + 0.15, -2, Y1 + 3, 0, H, wallR, bevel=0)
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
box("livBack", 1.5, X1, Y1 + 2.6, Y1 + 2.7, 0, H, wall, bevel=0)
box("livSofa", 2.8, 4.1, Y1 + 1.9, Y1 + 2.55, 0, 0.75, mat("sofa", "#a81c1c", rough=0.7), bevel=0.06)
wallquad("livWin", 2.9, 3.9, 1.0, 2.2, Y1 + 2.59, image("yardImg", T("ext_garden.png"), emit=1.2, rough=1))
area("livLight", (3.3, Y1 + 1.3, 3.1), 0.9, 160, "#ffe0b0", target=(3.3, Y1 + 1.3, 0))
group("living", *door["L"], *door["R"])

# ---------------------------------------------------------------- the cabinet
C0, C1 = 3.5, 4.3         # front / back
cab = []
box("cabBack", -2.4, 2.4, C1 - 0.06, C1, 0, 2.85, m["cherryV"], bevel=0)
box("cabTop", -2.5, 2.5, C0 - 0.08, C1, 2.75, 2.95, m["cherry"])
box("cabBase", -2.4, 2.4, C0, C1, 0, 0.32, m["cherry"])
box("cabL", -2.4, -2.25, C0, C1, 0, 2.75, m["cherryV"]); box("cabR", 2.25, 2.4, C0, C1, 0, 2.75, m["cherryV"])
box("cabMid", -1.3, -1.15, C0, C1, 0, 2.75, m["cherryV"])
# category buttons
for i in range(8):
    z1 = 2.62 - i * 0.29; z0 = z1 - 0.24
    b = box(f"catBtn{i}", -2.18, -1.36, C0 - 0.06, C0 + 0.02, z0, z1, m["cherry"], bevel=0.02); b["hot"] = f"cat-{i}"
    a = wallquad(f"catLbl{i}", -2.14, -1.5, z0 + 0.03, z1 - 0.03, C0 - 0.062, m["void"], anchor=f"cat{i}")
    sphere(f"catLed{i}", -1.43, C0 - 0.07, (z0 + z1) / 2, 0.022, mat("led", "#5a0a0a", rough=0.2, coat=1))
box("catPanel", -2.25, -1.3, C0 - 0.02, C0, 0.3, 2.68, mat("niche", "#3a0e06", rough=0.6), bevel=0)
# shelves
box("shelfBack", -1.15, 2.25, C1 - 0.08, C1 - 0.06, 0.32, 2.75, m["cherryV"], bevel=0)
rows = (1.96, 1.2, 0.44)
for r, z in enumerate(rows):
    box(f"shelf{r}", -1.15, 2.25, C0 - 0.04, C1 - 0.08, z - 0.05, z, maple, bevel=0.01)
    for c in range(3):
        x = -0.85 + c * 1.1
        wallquad(f"slot{r}{c}", x, x + 0.56, z, z + 0.68, C0 + 0.1, m["void"], anchor=f"slot{r * 3 + c}")
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
tc = [cyl("trash", 2.45, 2.2, 0, 0.62, 0.26, wick, verts=40), torus("trashRim", 2.45, 2.2, 0.62, 0.26, 0.02, mat("rim", "#2a3a3a", rough=0.5))]
group("trash", *tc)

# ---------------------------------------------------------------- lights + camera
world("#202024", 0.3)
area("ceilingMain", (0, 1.8, 3.15), 3.5, 90, "#fff2dc", target=(0, 2.6, 0), size_y=2.0)
spot("cabSpot", (0, 0.4, 3.1), (0.3, C0, 1.3), 320, "#fff0d0", angle=70, blend=0.6)
area("frontFill", (0.5, -1.2, 2.4), 2.5, 80, "#fff4e4", target=(0, 4, 1))
ceiling_cans((-1.2, 1.2), 2.2, H)
camera((0.0, 0.0, 1.5), (0.0, 6.0, 1.5), lens=20, shift_y=0.03)
render("v39_software", 800, 600, samples=160, look="Punchy", exposure=-0.15)

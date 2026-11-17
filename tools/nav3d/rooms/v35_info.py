# Navigator 3.5 — Info Room: a cherry display wall of online services, tutorials in a gallery, the manuals bookcase.
import sys, os, math
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from common import *

reset(); m = M()
X0, X1, Y1, H = -3.3, 3.3, 5.6, 3.3
wall = image("wallI", T("wallpaper_cream.png"), rough=0.85, spec=0.15, world_scale=0.9)
wallR = mat("wallR", "#e6d6b6", rough=0.85, spec=0.2)
trim = mat("trim", "#f8f2e4", rough=0.4)
ceil = mat("ceil", "#f4ecdc", rough=0.9)
floor = image("floor", T("floor_cherry.png"), rough=0.15, spec=0.7, world_scale=0.35)

box("floor", X0, X1, -2, Y1, -0.05, 0, floor, bevel=0)
box("ceiling", X0, X1, -2, Y1, H, H + 0.05, ceil, bevel=0)
box("back", X0, X1, Y1, Y1 + 0.15, 0, H, wall, bevel=0)
box("baseBack", X0, X1, Y1 - 0.03, Y1, 0, 0.12, trim, bevel=0)
for i, x in enumerate((-1.6, 1.6)): box(f"beam{i}", x - 0.12, x + 0.12, -2, Y1, H - 0.22, H, m["cherry"])

# left: shoji screens near the camera, then the hall back to the Living Room
box("leftFar", X0 - 0.15, X0, 4.2, Y1, 0, H, wall, bevel=0)
door = opening_left("hall", X0, 3.0, 4.2, H, wall, m["cherry"], hall_floor=floor, hall_wall=wallR, ceil_m=ceil, depth=2.6)
box("hallChest", X0 - 2.5, X0 - 2.1, 3.05, 4.15, 0, 0.9, m["cherry"])
cyl("hallLamp", X0 - 2.3, 3.6, 0.9, 1.3, 0.12, mat("lampShade", "#f8ecd0", emit="#fff0c8", emit_str=2))
area("hallLight", (X0 - 1.3, 3.6, 3.2), 0.8, 110, "#ffe0b0", target=(X0 - 1.3, 3.6, 0))
box("hallArt", X0 - 2.6, X0 - 2.56, 3.25, 3.95, 1.2, 1.8, image("hallArt", T("art_koi.png")), bevel=0)
group("door-living", *door)
# the shoji screens are on the left wall in front of the doorway
shoji = mat("shoji", "#fff8ea", rough=0.7, emit="#fff4dc", emit_str=0.9)
for k, (ya, yb) in enumerate(((-0.6, 0.9), (0.9, 2.4))):
    sidequad(f"shoji{k}", ya + 0.05, yb - 0.05, 0.25, 2.55, X0 + 0.02, shoji, facing=1)
    for j in range(5): box(f"shG{k}{j}", X0 + 0.02, X0 + 0.05, ya + 0.05 + j * (yb - ya - 0.1) / 4 - 0.015, ya + 0.05 + j * (yb - ya - 0.1) / 4 + 0.015, 0.25, 2.55, m["walnut"], bevel=0)
    for j in range(6): box(f"shH{k}{j}", X0 + 0.02, X0 + 0.05, ya + 0.05, yb - 0.05, 0.25 + j * 0.46 - 0.015, 0.25 + j * 0.46 + 0.015, m["walnut"], bevel=0)
area("shojiLight", (X0 - 0.4, 0.9, 1.4), 2.2, 300, "#fff2dc", target=(0, 1.2, 1.0), size_y=2.0)
box("leftNear", X0 - 0.15, X0, -2, 3.0, 0, H, wallR, bevel=0)

# right: doorway to the Software Room (shelves of boxes beyond)
box("rightFar", X1, X1 + 0.15, 4.2, Y1, 0, H, wallR, bevel=0)
dsw = opening_right("sw", X1, 3.0, 4.2, H, wallR, m["cherry"], hall_floor=floor, ceil_m=ceil, depth=3.0, hall_wall=mat("swWall", "#dfe4ea", rough=0.8))
box("swCase", X1 + 0.4, X1 + 2.9, 4.08, 4.18, 0, 2.2, m["cherryV"])
for i, z in enumerate((0.5, 1.05, 1.6)):
    box(f"swB{i}", X1 + 0.4, X1 + 2.9, 3.85, 4.12, z - 0.03, z, m["cherry"])
    for b in range(8):
        box(f"swBx{i}{b}", X1 + 0.5 + b * 0.29, X1 + 0.72 + b * 0.29, 3.92, 4.08, z, z + 0.36, mat(f"swb{(i + b) % 5}", ["#c83a2a", "#2a6ad0", "#3aa03a", "#e8a01a", "#8a3ad0"][(i + b) % 5], rough=0.3))
area("swLight", (X1 + 1.5, 3.6, 2.9), 1.0, 160, "#fff4e0", target=(X1 + 1.5, 3.6, 0))
box("rightNear", X1, X1 + 0.15, -2, 3.0, 0, H, wallR, bevel=0)
group("door-software", *dsw)

# ---------------------------------------------------------------- the tutorials gallery (back wall, left)
wallquad("lblTut", -3.1, -1.7, 2.4, 2.66, Y1 - 0.01, image("lblTut", T("lbl_tutorials.png"), alpha=True, rough=0.6))
for i, k in enumerate(("mouse", "overview", "about", "media")):
    x = -3.1 + (i % 2) * 0.72; z = 1.62 - (i // 2) * 0.76
    group("tut-" + k, *frame("tut" + k, x, x + 0.64, z, z + 0.68, Y1, f"tut_{k}.png", m, rim="walnut"))
# the plaque of symbols underneath
pl = box("plaque", -2.95, -2.0, Y1 - 0.04, Y1, 0.42, 0.7, m["walnut"], bevel=0.01)
plf = wallquad("plaqueFace", -2.9, -2.05, 0.46, 0.66, Y1 - 0.042, image("plaqueImg", T("plaque.png"), rough=0.5), anchor="symbols")
group("symbols", pl, plf)

# ---------------------------------------------------------------- the cherry display wall (centre) with the clock on top
U0, U1 = 4.75, 5.55
box("dispBack", -1.55, 1.55, U1 - 0.05, U1, 0, 2.6, m["cherryV"], bevel=0)
box("dispSideL", -1.55, -1.42, U0, U1, 0, 2.6, m["cherryV"]); box("dispSideR", 1.42, 1.55, U0, U1, 0, 2.6, m["cherryV"])
box("dispTop", -1.6, 1.6, U0 - 0.05, U1, 2.6, 2.75, m["cherry"])
box("dispBase", -1.55, 1.55, U0, U1, 0, 0.25, m["cherry"])
for i, z in enumerate((0.25, 0.95, 1.65)):
    box(f"dispShelf{i}", -1.42, 1.42, U0, U1 - 0.05, z - 0.04, z, mat("shelfCream", "#f4f0e6", rough=0.35, coat=0.4))
spot("dispSpot", (0, 3.4, 2.95), (0, U0, 1.3), 200, "#fff0d0", angle=55)
point("dispGlow", (0, U0 + 0.2, 2.45), 18, "#ffe0a8", radius=0.05)
svcs = ["svc_linkedin", "svc_github", "svc_mail", "svc_oldsite", "svc_net", "svc_arcade"]
keys = ["svc-linkedin", "svc-github", "svc-mail", "svc-oldsite", "svc-net", "svc-arcade"]
for i, (art, key) in enumerate(zip(svcs, keys)):
    row, col = i // 3, i % 3; z = 1.65 if row == 0 else 0.95; x = -1.15 + col * 0.82
    b = softbox("svc" + str(i), x, x + 0.5, z, z + 0.62, U0 + 0.25, art, d=0.14)
    b["hot"] = key
# film reel on the bottom shelf
reel = [cyl("reelDisc", -0.8, U0 + 0.3, 0.6 - 0.02, 0.6 + 0.02, 0.32, mat("reel", "#6a6a70", rough=0.3, metal=0.8), rot=(PI / 2 - 0.25, 0, 0))]
for i in range(5):
    a = i * 2 * PI / 5; reel.append(cyl(f"reelHole{i}", -0.8 + 0.17 * math.cos(a), U0 + 0.27, 0.6 + 0.17 * math.sin(a) - 0.025, 0.6 + 0.17 * math.sin(a) + 0.025, 0.065, m["blk"], rot=(PI / 2 - 0.25, 0, 0)))
reel.append(cyl("reelHub", -0.8, U0 + 0.26, 0.58, 0.62, 0.04, m["chrome"], rot=(PI / 2 - 0.25, 0, 0)))
group("reel", *reel)
box("filmCan", 0.3, 1.1, U0 + 0.2, U0 + 0.5, 0.25, 0.34, mat("can2", "#8a8a90", rough=0.3, metal=0.9))
ck = wallclock("clock", 0, 3.0, Y1, 0.24, m["gold"], image("clockImg", T("clock.png"), alpha=True, rough=0.3), m["blk"])
group("clock", *ck)

# ---------------------------------------------------------------- the manuals bookcase (right)
bc = [box("caseBack", 1.85, 3.05, Y1 - 0.05, Y1, 0, 2.5, m["cherryV"], bevel=0), box("caseL", 1.85, 1.95, Y1 - 0.45, Y1, 0, 2.5, m["cherryV"]),
      box("caseR", 2.95, 3.05, Y1 - 0.45, Y1, 0, 2.5, m["cherryV"]), box("caseTop", 1.8, 3.1, Y1 - 0.5, Y1, 2.5, 2.6, m["cherry"])]
for i, z in enumerate((0.1, 0.72, 1.34, 1.96)):
    bc.append(box(f"caseShelf{i}", 1.95, 2.95, Y1 - 0.45, Y1 - 0.05, z - 0.04, z, m["cherry"]))
    bc.append(books(f"caseBooks{i}", 1.97, 2.93, z, z + 0.46, Y1 - 0.4, "books_blue.png", d=0.3))
bc.append(wallquad("lblMan", 1.95, 2.95, 2.62, 2.84, Y1 - 0.01, image("lblMan", T("lbl_manuals.png"), alpha=True, rough=0.6)))
group("manuals", *bc)

# ---------------------------------------------------------------- the star rug, glass table, QUESTIONS book and the notebook
floorquad("rug", -2.0, 2.0, 0.9, 3.6, 0.004, image("rugStars", T("rug_stars.png"), rough=0.95, spec=0.05))
TZ = 0.42
box("glassTop", -1.0, 1.0, 1.4, 2.4, TZ - 0.03, TZ, m["glass"], bevel=0.008)
for x in (-0.92, 0.86):
    for y in (1.48, 2.26): box(f"tl{x}{y}", x, x + 0.06, y, y + 0.06, 0, TZ - 0.03, m["cherry"], bevel=0.008)
q = [box("qBook", -0.65, -0.15, 1.65, 2.05, TZ, TZ + 0.07, mat("qCover", "#2a3a8a", rough=0.4, coat=0.5), bevel=0.01),
     box("qPages", -0.63, -0.17, 1.66, 2.04, TZ + 0.005, TZ + 0.065, mat("pages", "#f8f4e8", rough=0.8), bevel=0),
     floorquad("qLbl", -0.6, -0.2, 1.75, 1.95, TZ + 0.072, image("lblQ", T("lbl_questions.png"), alpha=True, rough=0.5))]
group("questions", *q)
group("task", *laptop("lap", 0.25, 1.7, TZ, m))

# ---------------------------------------------------------------- lights + camera
world("#bcd8f0", 0.4)
spot("tutSpot", (-2.0, 3.0, 3.2), (-2.4, Y1, 1.5), 160, "#fff0d0", angle=45)
area("ceilingMain", (0, 2.6, 3.25), 3.0, 260, "#fff2dc", target=(0, 2.6, 0), size_y=2.0)
area("frontFill", (0.5, -1.2, 2.4), 2.5, 90, "#fff4e4", target=(0, 4, 1))
ceiling_cans((-2.0, 0, 2.0), 3.8, H)
camera((0.0, -0.45, 1.6), (0.0, 6.0, 1.6), lens=18, shift_y=-0.12)
render("v35_info", 640, 480, samples=160, look="Punchy", exposure=-0.2)

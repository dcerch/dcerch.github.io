# Navigator 3.9 — WorkSpace: a tidy office. Filing cabinet, a green-marble desk with the computer,
# certificates on the wall, a credenza of briefcases (one per job), a calendar and a banker's lamp.
import sys, os, math
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from common import *

reset(); m = M()
X0, X1, Y1, H = -3.4, 3.4, 4.6, 3.0
wall = mat("wsWall", "#e8dcc4", rough=0.8, spec=0.2)
wallS = mat("wsWallS", "#d8c8a8", rough=0.8, spec=0.2)
ceil = mat("ceil", "#eceef0", rough=0.9)
carpet = mat("wsCarpet", "#2a4a6a", rough=0.95, spec=0.05)
steelM = mat("metal", "#a8acb4", rough=0.35, metal=0.8)
green = marble("greenMarble", "#2a5a3a", "#9ac8a8", rough=0.1, scale=3.5)
box("floor", X0, X1, -2, Y1, -0.05, 0, carpet, bevel=0)
box("ceiling", X0, X1, -2, Y1, H, H + 0.05, ceil, bevel=0)
box("left", X0 - 0.15, X0, -2, Y1, 0, H, wallS, bevel=0)
# back wall with a big window on the left
box("backA", X0, -3.0, Y1, Y1 + 0.15, 0, H, wall, bevel=0)
box("backSill", -3.0, -1.2, Y1, Y1 + 0.15, 0, 0.9, wall, bevel=0); box("backHead", -3.0, -1.2, Y1, Y1 + 0.15, 2.4, H, wall, bevel=0)
box("backB", -1.2, X1, Y1, Y1 + 0.15, 0, H, wall, bevel=0)
for n, a in (("B", (-3.02, -1.18, 0.86, 0.92)), ("T", (-3.02, -1.18, 2.38, 2.44)), ("L", (-3.02, -2.96, 0.86, 2.44)), ("R", (-1.24, -1.18, 0.86, 2.44)), ("M", (-2.13, -2.07, 0.9, 2.4)), ("H", (-2.98, -1.22, 1.62, 1.68))):
    box("win" + n, a[0], a[1], Y1 - 0.04, Y1 + 0.02, a[2], a[3], mat("winFrame", "#f2f2f0", rough=0.4))
yd = wallquad("yard", -9, 5, -1.5, 5, 12, image("garden", T("ext_garden.png"), emit=1.3, rough=1)); yd.visible_shadow = False
# right: doorway back to the Living Room
box("rightNear", X1, X1 + 0.15, -2, 1.7, 0, H, wallS, bevel=0); box("rightFar", X1, X1 + 0.15, 3.1, Y1, 0, H, wallS, bevel=0)
box("rightHead", X1, X1 + 0.15, 1.7, 3.1, 2.3, H, wallS, bevel=0)
dr = [box("drJ1", X1 - 0.06, X1 + 0.02, 1.62, 1.72, 0, 2.38, mat("trim", "#f2f2f0", rough=0.4)), box("drJ2", X1 - 0.06, X1 + 0.02, 3.08, 3.18, 0, 2.38, mat("trim", "#f2f2f0", rough=0.4)),
      box("drJ3", X1 - 0.06, X1 + 0.02, 1.62, 3.18, 2.3, 2.38, mat("trim", "#f2f2f0", rough=0.4))]
box("drFloor", X1, X1 + 3, 1.7, 3.1, -0.05, 0, image("floorC", T("floor_cherry.png"), rough=0.2, world_scale=0.35), bevel=0)
loft = mat("loftWall", "#ece4d4", rough=0.8)
box("drA", X1, X1 + 3, 1.55, 1.7, 0, H, loft, bevel=0); box("drB", X1, X1 + 3, 3.1, 3.25, 0, H, loft, bevel=0); box("drEnd", X1 + 3, X1 + 3.1, 1.5, 3.3, 0, H, loft, bevel=0)
area("drLight", (X1 + 1.5, 2.4, 2.9), 1.0, 200, "#fff4e0", target=(X1 + 1.5, 2.4, 0))
dr.append(sidequad("drHot", 1.7, 3.1, 0, 2.3, X1 - 0.01, m["void"], facing=-1))
group("living", *dr)

# ---------------------------------------------------------------- certificates (frames; the page writes the text) + calendar
for i in range(6):
    col, row = i % 3, i // 3
    x = -0.6 + col * 0.82; z = 1.9 - row * 0.62
    f = box(f"cert{i}", x, x + 0.66, Y1 - 0.04, Y1, z, z + 0.48, m["walnut"], bevel=0.008)
    p = wallquad(f"certPaper{i}", x + 0.05, x + 0.61, z + 0.05, z + 0.43, Y1 - 0.042, mat("certPaper", "#fbf6e6", rough=0.6), anchor=f"cert{i}")
    group(f"cert-{i}", f, p)
cal = [box("calBoard", 2.1, 2.8, Y1 - 0.02, Y1, 1.2, 2.05, mat("calBack", "#ffffff", rough=0.6), bevel=0.004),
       wallquad("calFace", 2.12, 2.78, 1.22, 2.03, Y1 - 0.022, image("calImg", T("calendar.png"), rough=0.6), anchor="calendar")]
group("calendar", *cal)

# ---------------------------------------------------------------- the credenza of briefcases (back wall, under the certificates)
box("credenza", -3.0, -0.6, Y1 - 0.5, Y1 - 0.02, 0, 0.62, m["walnut"])
colors = ["#6a3a1a", "#2a2a2a", "#7a1a1a", "#3a2a1a"]
for i in range(4):
    x = -2.85 + i * 0.58
    bc = mat("brief" + str(i), colors[i], rough=0.4, coat=0.3)
    b = [box(f"brief{i}", x, x + 0.48, Y1 - 0.42, Y1 - 0.26, 0.62, 0.96, bc, bevel=0.02),
         torus(f"handle{i}", x + 0.24, Y1 - 0.34, 0.99, 0.06, 0.012, m["blk"], rot=(PI / 2, 0, 0)),
         box(f"clasp{i}a", x + 0.08, x + 0.14, Y1 - 0.43, Y1 - 0.42, 0.86, 0.9, m["gold"], bevel=0), box(f"clasp{i}b", x + 0.34, x + 0.4, Y1 - 0.43, Y1 - 0.42, 0.86, 0.9, m["gold"], bevel=0)]
    group(f"job-{i}", *b)

# ---------------------------------------------------------------- filing cabinet (front left)
FX0, FX1, FY0, FY1 = -3.3, -2.55, 2.2, 2.9
box("fileBody", FX0, FX1, FY0, FY1, 0, 1.4, steelM, bevel=0.01)
for i, (k, lbl) in enumerate((("file-forms", "Forms"), ("file-personal", "Personal Docs"), ("file-business", "Business"))):
    z0 = 0.95 - i * 0.45
    d = [box(f"drawer{i}", FX0 + 0.04, FX1 - 0.04, FY0 - 0.03, FY0, z0, z0 + 0.4, mat("drawerM", "#b8bcc4", rough=0.3, metal=0.7), bevel=0.01),
         box(f"pull{i}", FX0 + 0.27, FX1 - 0.27, FY0 - 0.07, FY0 - 0.03, z0 + 0.1, z0 + 0.14, m["chrome"], bevel=0.005),
         wallquad(f"lbl{i}", FX0 + 0.22, FX1 - 0.22, z0 + 0.22, z0 + 0.32, FY0 - 0.032, mat("lblCard", "#ffffff", rough=0.6), anchor=f"fileLbl{i}")]
    group(k, *d)

# ---------------------------------------------------------------- the desk
DZ = 0.76
box("deskTop", -1.6, 1.6, 1.4, 2.4, DZ - 0.06, DZ, green, bevel=0.012)
box("deskPedL", -1.55, -0.95, 1.5, 2.35, 0, DZ - 0.06, m["walnut"]); box("deskPedR", 0.95, 1.55, 1.5, 2.35, 0, DZ - 0.06, m["walnut"])
box("deskModesty", -0.95, 0.95, 2.25, 2.3, 0.2, DZ - 0.06, m["walnut"], bevel=0)
pc = [box("pcBase", -0.55, 0.35, 1.85, 2.3, DZ, DZ + 0.12, m["beige"], bevel=0.015),
      box("pcMon", -0.45, 0.25, 1.9, 2.3, DZ + 0.12, DZ + 0.66, m["beige"], bevel=0.03),
      wallquad("pcScr", -0.39, 0.19, DZ + 0.17, DZ + 0.61, 1.898, image("pcLi", T("pc_linkedin.png"), emit=1.0, rough=0.15)),
      box("keyboard", -0.5, 0.3, 1.5, 1.7, DZ, DZ + 0.03, m["beige"], bevel=0.008)]
group("computer", *pc)
rep = [box("report", 0.6, 1.1, 1.55, 1.9, DZ, DZ + 0.02, mat("folder", "#8a6a3a", rough=0.6), bevel=0),
       box("reportPaper", 0.63, 1.07, 1.58, 1.87, DZ + 0.02, DZ + 0.025, mat("paper", "#ffffff", rough=0.8), bevel=0)]
group("report", *rep)
lamp = [cyl("lampBase", 1.3, 2.15, DZ, DZ + 0.03, 0.09, m["gold"]), cyl("lampStem", 1.3, 2.15, DZ, DZ + 0.38, 0.012, m["gold"]),
        cyl("lampShade", 1.3, 2.05, DZ + 0.38, DZ + 0.42, 0.13, mat("bankerGreen", "#1a6a3a", rough=0.15, coat=1, glass=0.0), rot=(0.25, 0, 0))]
point("lampBulb", (1.3, 2.05, DZ + 0.33), 25, "#fff0c0", radius=0.03)
group("lamp", *lamp)
plant("plant", 2.9, 3.9, s=1.0)
# walnut wainscoting all round
for nm, a in (("wB", (X0, X1, Y1 - 0.03, Y1)),):
    box(nm, a[0], a[1], a[2], a[3], 0, 0.95, m["walnut"], bevel=0)
box("wL", X0, X0 + 0.03, -2, Y1, 0, 0.95, m["walnut"], bevel=0)
box("wRA", X1 - 0.03, X1, -2, 1.62, 0, 0.95, m["walnut"], bevel=0); box("wRB", X1 - 0.03, X1, 3.18, Y1, 0, 0.95, m["walnut"], bevel=0)
box("rail", X0, X1, Y1 - 0.05, Y1, 0.93, 0.98, m["walnut"])

# ---------------------------------------------------------------- lights + camera
world("#bcd8f0", 0.5)
sun("sun", (0.4, -1.0, -0.55), energy=4.0, color="#fff0d0", angle=1.5)
area("ceilingMain", (0, 2.4, 2.95), 3.0, 300, "#f4f6ff", target=(0, 2.4, 0), size_y=2.0)
area("windowFill", (-2.1, 4.4, 1.6), 1.6, 160, "#d8ecff", target=(0, 2, 0.8), size_y=1.4)
area("frontFill", (0.5, -1.2, 2.4), 2.5, 90, "#fff4e4", target=(0, 4, 1))
ceiling_cans((-1.6, 0.4, 2.2), 3.0, H)
camera((0.0, -1.3, 1.6), (0.0, 6.0, 1.6), lens=18, shift_y=-0.09)
render("v39_workspace", 800, 600, samples=160, look="Punchy", exposure=-0.2)

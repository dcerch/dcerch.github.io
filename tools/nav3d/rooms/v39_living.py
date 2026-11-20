# Navigator 3.9 — the Living Room loft (the hub). Two storeys, a glass wall, a mezzanine with the
# GameRoom and WorkSpace upstairs, KidSpace and MySpace under the balcony, the Software Library cabinet.
import sys, os, math
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from common import *

reset(); m = M()
X0, X1, Y1, H, MZ = -4.2, 4.2, 7.4, 5.0, 2.7       # MZ = mezzanine floor height
plaster = mat("plaster", "#e8dcc4", rough=0.85, spec=0.2)
plasterW = mat("plasterW", "#dccdb0", rough=0.85, spec=0.2)
ceil = mat("ceil", "#f6f4ee", rough=0.9)
maple = image("floorM", T("floor_cherry.png"), rough=0.15, spec=0.7, world_scale=0.35)
steel = mat("steel", "#9aa0a8", rough=0.3, metal=0.9)
rail_glass = mat("railGlass", "#d8ecf8", rough=0.02, glass=1.0)

box("floor", X0, X1, -2, Y1, -0.05, 0, maple, bevel=0)
box("ceiling", X0, X1, -2, Y1, H, H + 0.05, ceil, bevel=0)
box("right", X1, X1 + 0.15, -2, 3.6, 0, H, plasterW, bevel=0)
box("rightB", X1, X1 + 0.15, 5.2, Y1, 0, H, plasterW, bevel=0)
box("rightHead", X1, X1 + 0.15, 3.6, 5.2, 2.4, H, plasterW, bevel=0)

# ---------------------------------------------------------------- the glass wall (left), sky and city beyond
for i, y in enumerate([-1.5 + k * 1.15 for k in range(9)]):
    box(f"mull{i}", X0 - 0.06, X0 + 0.04, y - 0.05, y + 0.05, 0, H, mat("frame", "#e8e4dc", rough=0.4))
for i, z in enumerate((0.05, 1.9, 3.8, H - 0.05)):
    box(f"transom{i}", X0 - 0.06, X0 + 0.04, -2, Y1, z - 0.05, z + 0.05, mat("frame", "#e8e4dc", rough=0.4))
sk = sidequad("skyline", -12, 18, -3, 12, X0 - 9, image("sky", T("ext_skyline.png"), emit=1.3, rough=1), facing=1); sk.visible_shadow = False
box("lawn", X0 - 9, X0, -12, 18, -0.08, -0.02, mat("lawn", "#3a6a2a", rough=0.9), bevel=0)

# ---------------------------------------------------------------- back wall, mezzanine, stairs
box("back", X0, X1, Y1, Y1 + 0.15, 0, H, plaster, bevel=0)
mz = box("mezzSlab", -1.2, X1, 4.9, Y1, MZ - 0.2, MZ, mat("fascia", "#ece8e0", rough=0.5), bevel=0.01)
box("mezzFloor", -1.2, X1, 4.9, Y1, MZ, MZ + 0.01, maple, bevel=0)
box("railTop", -1.2, X1, 4.88, 4.94, MZ + 1.0, MZ + 1.05, steel)
wallquad("railGlass", -1.2, X1, MZ, MZ + 1.0, 4.91, rail_glass)
for i, x in enumerate((-1.15, 0.9, 2.95)): box(f"railPost{i}", x - 0.03, x + 0.03, 4.88, 4.94, MZ, MZ + 1.05, steel)
box("column", -1.25, -1.0, 4.85, 5.1, 0, MZ, mat("col", "#e8e4dc", rough=0.5))
box("stringer", -3.9, -1.2, 6.12, 6.2, 0, 0.01, steel)
# stairs: from the floor at the left, rising toward the mezzanine along the back wall
NS = 13
for i in range(NS):
    x0 = -3.9 + i * (2.7 / NS)
    box(f"step{i}", x0, x0 + 2.7 / NS + 0.01, 6.2, Y1, 0, (i + 1) * MZ / NS, plasterW, bevel=0.005)
    box(f"tread{i}", x0 - 0.02, x0 + 2.7 / NS + 0.01, 6.15, Y1, (i + 1) * MZ / NS - 0.03, (i + 1) * MZ / NS, mat("tread", "#c89a5a", rough=0.35, coat=0.3), bevel=0.005)

def portal(key, x0, x1, z0, z1, y, inside, label_tex, light):
    fr = [box(key + "J1", x0 - 0.08, x0, y - 0.06, y + 0.02, z0, z1 + 0.08, m["white"]), box(key + "J2", x1, x1 + 0.08, y - 0.06, y + 0.02, z0, z1 + 0.08, m["white"]),
          box(key + "J3", x0 - 0.08, x1 + 0.08, y - 0.06, y + 0.02, z1, z1 + 0.08, m["white"])]
    door = wallquad(key + "In", x0, x1, z0, z1, y - 0.01, inside)
    parts = fr + [door]
    if label_tex:
        parts.append(wallquad(key + "Lbl", x0 + 0.06, x1 - 0.06, z0 + (z1 - z0) * 0.22, z0 + (z1 - z0) * 0.78, y - 0.02, image(key + "LblImg", T(label_tex), alpha=True, rough=0.4)))
    point(key + "Glow", ((x0 + x1) / 2, y - 1.2, z0 + (z1 - z0) * 0.9), 12, light, radius=0.3)
    return parts

group("kidspace", *portal("ks", -0.2, 0.9, 0, 2.15, Y1, mat("ksIn", "#5a2ab0", rough=0.5, emit="#7a3ae0", emit_str=1.6), "lbl_kidspace.png", "#c080ff"))
group("myspace", *portal("ms", 1.6, 2.7, 0, 2.15, Y1, mat("msIn", "#1a0a2a", rough=0.5, emit="#3a1a5a", emit_str=1.2), "lbl_myspace.png", "#a080ff"))
group("gameroom", *portal("gr", -0.2, 0.9, MZ, MZ + 2.0, Y1, mat("grIn", "#3a1a5a", rough=0.5, emit="#6a2a8a", emit_str=0.8), "lbl_gameroom.png", "#ffd0f0"))
group("workspace", *portal("wsp", 1.6, 2.7, MZ, MZ + 2.0, Y1, mat("wsIn", "#2a4a6a", rough=0.5, emit="#4a7aa8", emit_str=0.8), "lbl_workspace.png", "#d0e8ff"))

# ---------------------------------------------------------------- the media corner (under the stairs, left of the portals)
TVY = 5.6
box("mediaTop", -3.9, -1.7, TVY, TVY + 0.55, 0.5, 0.56, m["walnut"]); box("mediaBot", -3.9, -1.7, TVY, TVY + 0.55, 0, 0.05, m["walnut"])
box("mediaBack", -3.9, -1.7, TVY + 0.5, TVY + 0.55, 0, 0.56, m["walnut"]); box("mediaL", -3.9, -3.85, TVY, TVY + 0.55, 0, 0.56, m["walnut"]); box("mediaR", -1.75, -1.7, TVY, TVY + 0.55, 0, 0.56, m["walnut"])
group("tv", *tvset("tv", -3.45, -2.15, 0.62, 1.55, TVY + 0.05, m, anchor="tvScreen"))
box("tvStand", -3.0, -2.6, TVY + 0.15, TVY + 0.4, 0.55, 0.62, m["blk"])
group("speakers", *speaker("spkL", -3.75, TVY + 0.08, 1.2, m, w=0.24, d=0.3), *speaker("spkR", -1.85, TVY + 0.08, 1.2, m, w=0.24, d=0.3))
group("stereo", *stereo("st", -3.75, -2.95, 0.06, TVY + 0.08, m, units=2, uh=0.19))
rad = [box("radio", -2.7, -1.95, TVY + 0.08, TVY + 0.4, 0.06, 0.3, mat("radio", "#c0c0c8", rough=0.25, metal=0.6), bevel=0.01),
       wallquad("radioFace", -2.66, -1.99, 0.09, 0.27, TVY + 0.078, image("stereoImg", T("stereo.png"), rough=0.25, emit=0.25))]
group("radio", *rad)

# ---------------------------------------------------------------- right wall: doorway into the Info Room, portrait
ir = [box("irJ1", X1 - 0.06, X1 + 0.02, 3.52, 3.62, 0, 2.48, m["white"]), box("irJ2", X1 - 0.06, X1 + 0.02, 5.18, 5.28, 0, 2.48, m["white"]),
      box("irJ3", X1 - 0.06, X1 + 0.02, 3.52, 5.28, 2.4, 2.48, m["white"])]
box("irFloor", X1, X1 + 3, 3.6, 5.2, -0.05, 0, image("floorC", T("floor_cherry.png"), rough=0.2, world_scale=0.35), bevel=0)
box("irSideA", X1, X1 + 3, 3.45, 3.6, 0, 2.6, mat("irWall", "#8a2414", rough=0.6), bevel=0)
box("irSideB", X1, X1 + 3, 5.2, 5.35, 0, 2.6, mat("irWall", "#8a2414", rough=0.6), bevel=0)
box("irEnd", X1 + 3, X1 + 3.1, 3.4, 5.4, 0, 2.6, mat("irWall", "#8a2414", rough=0.6), bevel=0)
box("irCeil", X1, X1 + 3, 3.4, 5.4, 2.6, 2.65, ceil, bevel=0)
box("irCase", X1 + 0.4, X1 + 2.8, 5.0, 5.2, 0, 2.3, m["cherryV"])
for i, z in enumerate((0.25, 0.85, 1.45)): box(f"irBooks{i}", X1 + 0.5, X1 + 2.7, 4.97, 5.0, z, z + 0.45, image("redBooks", T("books_red.png")), bevel=0)
area("irLight", (X1 + 1.5, 4.4, 2.55), 0.9, 120, "#ffd8a0", target=(X1 + 1.5, 4.4, 0))
ir.append(sidequad("irHot", 3.6, 5.2, 0, 2.4, X1 - 0.01, m["void"], facing=-1))
group("info", *ir)
group("portrait", *frame("portrait", 3.05, 3.95, 1.05, 1.75, Y1, None, m, anchor="portrait"))

# ---------------------------------------------------------------- the desk (foreground left)
DZ = 0.74
box("deskTop", -3.6, -1.5, 1.2, 2.2, DZ - 0.05, DZ, m["oak"], bevel=0.012)
for x in (-3.55, -1.6):
    for y in (1.25, 2.1): box(f"dl{x}{y}", x, x + 0.06, y, y + 0.06, 0, DZ - 0.05, steel)
group("fax", *fax("fax", -3.4, 1.55, DZ, m))
group("phone", *phone("ph", -2.65, 1.35, DZ, m, color="#3a3a40"))
group("scanner", box("scan", -2.15, -1.62, 1.6, 2.05, DZ, DZ + 0.08, mat("scanner", "#d8d8dc", rough=0.3), bevel=0.01),
      floorquad("scanGlass", -2.1, -1.67, 1.65, 2.0, DZ + 0.081, mat("scanGl", "#3a4a5a", rough=0.05, coat=1)))
group("remote", *remote("rem", -2.25, 1.28, DZ, m))
box("lampBase", -3.5, -3.3, 2.0, 2.15, DZ, DZ + 0.02, m["blk"])
cyl("lampArm", -3.4, 2.07, DZ, DZ + 0.5, 0.012, m["blk"])
cone("lampHead", -3.4, 2.0, DZ + 0.42, DZ + 0.56, 0.11, 0.03, mat("lampGreen", "#2a6a3a", rough=0.3, coat=0.8))
point("lampBulb", (-3.4, 1.98, DZ + 0.4), 20, "#fff0c8", radius=0.03)
# printer on its cart
box("cart", -1.25, -0.6, 2.2, 2.75, 0, 0.5, mat("cart", "#9a9aa2", rough=0.4, metal=0.4))
group("printer", box("printer", -1.22, -0.63, 2.25, 2.7, 0.5, 0.72, m["beige"], bevel=0.02),
      quad("printPaper", [(-1.08, 2.62, 0.72), (-0.77, 2.62, 0.72), (-0.77, 2.7, 0.95), (-1.08, 2.7, 0.95)], mat("paper", "#ffffff", rough=0.8)))
# register box on the floor
group("register", *regbox("reg", -0.4, 0.35, 0.9, 1.4, 0.5, m))

# ---------------------------------------------------------------- the Software Library cabinet (front right) + the INTERNET globe
CY0, CY1 = 1.5, 2.15
sl = [box("slBody", 1.1, 3.3, CY0, CY1, 0, 1.0, m["cherry"]), box("slTop", 1.05, 3.35, CY0 - 0.04, CY1, 1.0, 1.06, m["cherry"])]
cols = ["#1a5ab8", "#c83a2a", "#3aa03a", "#e8a01a", "#8a3ad0", "#2a8a8a", "#d86a9a"]
for r, z in enumerate((0.1, 0.52)):
    sl.append(box(f"slNiche{r}", 1.18, 3.22, CY0 - 0.005, CY1 - 0.1, z, z + 0.38, mat("niche", "#2a0804", rough=0.6), bevel=0))
    for b in range(8):
        x = 1.24 + b * 0.245
        sl.append(box(f"slBox{r}{b}", x, x + 0.2, CY0 - 0.01, CY0 + 0.25, z + 0.02, z + 0.34, mat("slb" + str((b + r * 3) % 7), cols[(b + r * 3) % 7], rough=0.3, coat=0.4), bevel=0.005))
sl.append(wallquad("slLbl", 1.6, 2.8, 0.91, 0.99, CY0 - 0.012, image("lblSw", T("lbl_swlib.png"), alpha=True, rough=0.5)))
group("software", *sl)
gl = [cyl("globeBase", 2.2, 1.82, 1.06, 1.1, 0.16, m["gold"]), cyl("globeStem", 2.2, 1.82, 1.1, 1.24, 0.02, m["gold"]),
      sphere("globe", 2.2, 1.82, 1.52, 0.3, image("globeImg", T("globe_map.png"), rough=0.25, spec=0.6)),
      torus("globeRing", 2.2, 1.82, 1.52, 0.33, 0.012, m["gold"], rot=(0.4, 0, 0)),
      wallquad("globeLbl", 1.98, 2.42, 1.47, 1.57, 1.5, image("lblNet", T("lbl_internet.png"), alpha=True, rough=0.4))]
group("globe", *gl)
group("cat", *cat("cat", 0.85, 0.55, color="#cbbba3", stripe="#8f8a84", heading=0.3))

# a sofa and rug in the middle of the loft, a big plant by the glass
floorquad("rug", -1.4, 1.6, 2.6, 4.6, 0.004, image("rug", T("rug_persian.png"), rough=0.95, spec=0.05))
sofa = mat("sofaFab", "#b83a2a", rough=0.75)
box("sofaSeat", -1.0, 1.4, 4.0, 4.75, 0.2, 0.45, sofa, bevel=0.06); box("sofaBack", -1.0, 1.4, 4.55, 4.8, 0.2, 0.85, sofa, bevel=0.06)
box("sofaArmL", -1.15, -0.95, 4.0, 4.8, 0.2, 0.65, sofa, bevel=0.06); box("sofaArmR", 1.35, 1.55, 4.0, 4.8, 0.2, 0.65, sofa, bevel=0.06)
box("sofaBase", -1.1, 1.5, 4.05, 4.75, 0.0, 0.2, m["walnut"], bevel=0.01)
box("cTable", -0.6, 1.0, 3.0, 3.6, 0.35, 0.4, m["glass"], bevel=0.008)
for x in (-0.55, 0.9):
    for y in (3.05, 3.5): box(f"ctl{x}{y}", x, x + 0.05, y, y + 0.05, 0, 0.35, steel)
box("mag1", -0.3, 0.1, 3.15, 3.4, 0.4, 0.41, mat("mag", "#e8402a", rough=0.4), bevel=0)
plant("ficus", -3.6, 4.6, s=1.2)

# ---------------------------------------------------------------- lights + camera
world("#a8c8f0", 0.5)
sun("sun", (1.0, 0.35, -0.55), energy=4.5, color="#ffe8c4", angle=1.5)
area("sky", (X0 + 0.3, 2.8, 3.0), 6.0, 380, "#b8d0ff", target=(0, 2.8, 2.0), size_y=4.0)
area("ceilingMain", (0.5, 3.0, H - 0.05), 4.0, 380, "#ffe8c8", target=(0.5, 3.0, 0), size_y=3.0)
area("underMezz", (1.0, 6.2, MZ - 0.25), 3.0, 220, "#fff0d8", target=(1.0, 6.2, 0), size_y=1.2)
area("frontFill", (0.5, -1.4, 2.6), 3.0, 120, "#fff4e4", target=(0, 4, 1))
for i, x in enumerate((-2.5, 0.5, 3.0)): cyl(f"can{i}", x, 3.5, H - 0.01, H, 0.12, mat("can", "#fffaf0", emit="#fff4dc", emit_str=8))
camera((1.1, -1.85, 1.5), (-0.55, 7.0, 1.95), lens=17, shift_y=-0.02)
render("v39_living", 800, 600, samples=160, exposure=-0.75)

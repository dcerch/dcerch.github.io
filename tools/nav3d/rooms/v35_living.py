# Navigator 3.5 — Living Room, rebuilt in the 1994-95 raytrace style: an open-plan room with a sunlit glass wall
# onto a modelled garden and pool, a cherry media wall, exposed beams with track lights, and a low, slightly
# off-centre camera with lounge chairs and the coffee table pushing into the frame. Original scene.
import sys, os, math
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from lib import *
from common import *

reset()
m = M()
cherry, cherryV, blk, chrome, gold, glass = m["cherry"], m["cherryV"], m["blk"], m["chrome"], m["gold"], m["glass"]
wall = mat("wall", "#efe6d2", rough=0.8, spec=0.2)
wallWarm = mat("wallWarm", "#e8d6b4", rough=0.8, spec=0.2)
ceil = mat("ceil", "#f6f0e2", rough=0.9)
floor = image("floor", T("floor_cherry.png"), rough=0.12, spec=0.8, world_scale=0.35)
rug = image("rug", T("rug_persian.png"), rough=0.95, spec=0.05)
marb = marble("marble", "#f8f6f0", "#9a948a", scale=2.4)
mull = mat("mullion", "#f4f0e6", rough=0.35)
stone = mat("terrace", "#d8ccb0", rough=0.7)
void = mat("void", "#000000", alpha=0.0)

X0, X1, Y1, H = -3.6, 3.4, 6.4, 3.1

# ---------------------------------------------------------------- shell
box("floor", X0, X1, -1.5, Y1, -0.05, 0, floor, bevel=0)
box("ceiling", X0 - 0.2, X1, -1.5, Y1, H, H + 0.05, ceil, bevel=0)
for i, y in enumerate((0.6, 2.4, 4.2)):
    box(f"beam{i}", X0, X1, y - 0.11, y + 0.11, H - 0.26, H, cherry)
box("beamSpine", -0.12, 0.12, -1.5, Y1, H - 0.18, H, cherry)

# left: floor-to-ceiling glass wall onto the terrace and pool
box("leftSill", X0 - 0.12, X0, -1.5, Y1, 0, 0.08, mull, bevel=0)
box("leftHead", X0 - 0.12, X0, -1.5, Y1, 2.55, H, wall, bevel=0)
for i, y in enumerate((-0.6, 0.6, 1.8, 3.0, 4.2, 5.4)):
    box(f"mullion{i}", X0 - 0.1, X0 + 0.02, y - 0.05, y + 0.05, 0, 2.55, mull, bevel=0.005)
box("transom", X0 - 0.1, X0 + 0.02, -1.5, Y1, 2.0, 2.06, mull, bevel=0.005)
# the garden: terrace, pool, lawn, hedges and trees, all real geometry lit by the sun
box("terrace", -9.0, X0, -3, 10, -0.06, -0.02, stone, bevel=0)
box("poolRimN", -8.4, -5.0, 0.6, 0.8, -0.04, 0.03, stone); box("poolRimS", -8.4, -5.0, 5.0, 5.2, -0.04, 0.03, stone)
box("poolRimE", -5.2, -5.0, 0.6, 5.2, -0.04, 0.03, stone)
box("pool", -8.4, -5.2, 0.8, 5.0, -0.3, -0.05, water(), bevel=0)
box("lawn", -40, -9.0, -20, 40, -0.06, -0.03, grass(), bevel=0)
hedge("hedgeA", -11.5, -10.6, -4, 12, 1.2)
for i, (x, y, s, k) in enumerate(((-9.6, -1.5, 1.2, "round"), (-10.5, 3.5, 1.5, "round"), (-9.4, 7.6, 1.1, "tall"), (-13, 9, 1.6, "round"), (-14, 0.5, 1.3, "tall"), (-12.5, -4, 1.4, "round"))):
    tree(f"tree{i}", x, y, s, seed=i + 3, kind=k)
for i, (x, y) in enumerate(((-7.6, 6.0), (-6.0, 6.2))):
    cyl(f"pot{i}", x, y, 0, 0.5, 0.3, mat("terracotta", "#b8582a", rough=0.6))
    for j in range(7):
        sphere(f"potLeaf{i}{j}", x + 0.15 * math.cos(j), y + 0.15 * math.sin(j), 0.75 + 0.06 * (j % 3), 0.25, mat("leafB", "#3a8a22", rough=0.5))

# back wall: Info Room archway at the left, the cherry media wall, a window at the right
box("backA", X0, -2.3, Y1, Y1 + 0.15, 2.45, H, wall, bevel=0)
box("backB", 2.0, X1, Y1, Y1 + 0.15, 0, H, wall, bevel=0)
door_info = [box("archJ1", X0 + 0.02, X0 + 0.14, Y1 - 0.08, Y1 + 0.16, 0, 2.5, cherry), box("archJ2", -2.42, -2.3, Y1 - 0.08, Y1 + 0.16, 0, 2.5, cherry),
             box("archHead", X0 + 0.02, -2.3, Y1 - 0.08, Y1 + 0.16, 2.42, 2.54, cherry)]
# the Info Room hall beyond: a warm corridor with a bookcase of red books
box("hallFloor", X0, -2.3, Y1, Y1 + 3.6, -0.05, 0, floor, bevel=0)
box("hallL", X0 - 0.15, X0, Y1, Y1 + 3.6, 0, H, wallWarm, bevel=0)
box("hallR", -2.3, -2.15, Y1, Y1 + 3.6, 0, H, wallWarm, bevel=0)
box("hallEnd", X0, -2.3, Y1 + 3.6, Y1 + 3.7, 0, H, wallWarm, bevel=0)
box("hallCeil", X0, -2.3, Y1, Y1 + 3.6, 2.6, 2.65, ceil, bevel=0)
box("hallCase", X0 + 0.1, -2.45, Y1 + 3.2, Y1 + 3.6, 0, 2.2, cherryV)
for i, z in enumerate((0.25, 0.8, 1.35)):
    books(f"hallBooks{i}", X0 + 0.2, -2.55, z, z + 0.42, Y1 + 3.18, "books_red.png")
area("hallLight", (-2.95, Y1 + 2.2, 2.55), 0.6, 160, "#ffd8a0", target=(-2.95, Y1 + 2.2, 0))
group("door-info", *door_info, wallquad("doorInfoHot", X0 + 0.14, -2.42, 0, 2.42, Y1 + 0.02, void))

# the cherry media wall: a deep panelled block, floor to ceiling
MW0, MW1, MY = -2.3, 2.0, Y1 - 0.35
box("mediaWall", MW0, MW1, MY, Y1 + 0.15, 0, H, cherryV)
for i, x in enumerate((MW0 + 0.06, MW1 - 0.06)):
    box(f"pilaster{i}", x - 0.07, x + 0.07, MY - 0.06, MY, 0, H, cherryV)
box("mediaCrown", MW0, MW1, MY - 0.08, MY, 2.62, 2.72, cherry)
# family portrait in a gold frame, lit by a picture light
fr = box("portraitFrame", -0.75, 0.75, MY - 0.06, MY, 1.42, 2.42, gold, bevel=0.015)
pic = wallquad("portraitPic", -0.66, 0.66, 1.5, 2.34, MY - 0.062, mat("portraitBlank", "#2a2f9e", rough=0.4), anchor="portrait")
group("portrait", fr, pic)
cyl("picLight", 0, MY - 0.12, 2.5, 2.54, 0.03, gold, rot=(0, PI / 2, 0))
cyl("picLightShade", 0, MY - 0.16, 2.47, 2.53, 0.05, gold, rot=(0, PI / 2, 0))
spot("picLightSpot", (0, MY - 0.25, 2.55), (0, MY, 1.9), 70, "#fff0c8", angle=70, blend=0.6)
# low cherry console under it: stereo stack in the left bay, TV on the right
box("console", MW0 + 0.15, MW1 - 0.15, MY - 0.55, MY, 0, 0.6, cherry, bevel=0.012)
box("consoleTop", MW0 + 0.1, MW1 - 0.1, MY - 0.6, MY, 0.6, 0.65, cherry, bevel=0.01)
for i, x in enumerate((-1.25, 0.0, 1.25)):
    box(f"consoleDoor{i}", x - 0.55, x + 0.55, MY - 0.57, MY - 0.55, 0.06, 0.55, cherryV, bevel=0.006)
    box(f"consoleKnob{i}", x - 0.03, x + 0.03, MY - 0.6, MY - 0.57, 0.3, 0.36, gold)
st = []
for i, (z0, z1) in enumerate(((0.65, 0.8), (0.82, 0.97), (0.99, 1.14))):
    st.append(box(f"stereo{i}", -1.85, -0.95, MY - 0.5, MY - 0.12, z0, z1, blk, bevel=0.008))
    st.append(wallquad(f"stereoFace{i}", -1.83, -0.97, z0 + 0.012, z1 - 0.012, MY - 0.502, image("stereoImg", T("stereo.png"), rough=0.25, emit=0.3)))
group("stereo", *st)
tvb = box("tvBody", 0.75, 1.75, MY - 0.55, MY - 0.1, 0.65, 1.42, blk, bevel=0.035)
scr = wallquad("tvScreen", 0.82, 1.56, 0.71, 1.36, MY - 0.552, image("tvImg", T("tv.png"), rough=0.05, spec=0.9), anchor="tvScreen")
tvk = [cyl(f"tvBtn{i}", 1.66, MY - 0.556, 1.2 - i * 0.1 - 0.005, 1.2 - i * 0.1 + 0.005, 0.016, chrome, rot=(PI / 2, 0, 0)) for i in range(3)]
group("tv", tvb, scr, *tvk)
cd = [cyl("candle", -0.35, MY - 0.32, 0.65, 0.9, 0.05, mat("wax", "#f8f0e0", rough=0.6)),
      cyl("candleDish", -0.35, MY - 0.32, 0.65, 0.67, 0.09, gold),
      sphere("flame", -0.35, MY - 0.32, 0.935, 0.018, mat("flame", "#ffcc40", emit="#ffb030", emit_str=30), scale=(1, 1, 2.2))]
point("candleGlow", (-0.35, MY - 0.42, 1.0), 3, "#ffb050", radius=0.02)
group("candle", *cd)
# speakers on stands either side of the media wall
spk = []
for side, x in ((-1, -2.75), (1, 2.45)):
    spk += speaker(f"spk{side}", x, MY - 0.2, 1.1, m, w=0.38, d=0.32)
group("speakers", *spk)
group("clock", *wallclock("clock", 2.7, 2.35, Y1, 0.2, gold, image("clockImg", T("clock.png"), alpha=True, rough=0.3), blk))
# back-right window with a tree outside
box("winSill", 2.0, X1, Y1 - 0.02, Y1 + 0.15, 0, 0.8, wall, bevel=0)
for n, a in (("B", (2.25, 3.2, 0.78, 0.86)), ("T", (2.25, 3.2, 2.0, 2.08)), ("L", (2.25, 2.33, 0.78, 2.08)), ("R", (3.12, 3.2, 0.78, 2.08)), ("M", (2.69, 2.76, 0.78, 2.08))):
    box("winFrame" + n, a[0], a[1], Y1 - 0.03, Y1 + 0.03, a[2], a[3], mull)
# cut the hole: rebuild backB around the window
bpy.data.objects.remove(bpy.data.objects["backB"])
box("backB1", 2.0, 2.25, Y1, Y1 + 0.15, 0, H, wall, bevel=0); box("backB2", 3.2, X1, Y1, Y1 + 0.15, 0, H, wall, bevel=0)
box("backB3", 2.25, 3.2, Y1, Y1 + 0.15, 2.08, H, wall, bevel=0)
tree("treeBack", 3.6, Y1 + 4.0, 1.4, seed=11)
box("yardBack", -2, 12, Y1 + 0.2, Y1 + 12, -0.06, -0.03, grass(), bevel=0)
hedge("hedgeB", -2, 12, Y1 + 6, Y1 + 7, 1.4)

# right wall: doorway to the Software Room, glowing shelves of boxes beyond
door_sw = opening_right("swDoor", X1, 3.4, 4.9, H, wall, cherry, hall_floor=floor, depth=3.2, hall_wall=wallWarm, ceil_m=ceil)
box("swCase", X1 + 0.3, X1 + 3.0, 4.8, 4.9, 0, 2.2, cherryV)
for i, z in enumerate((0.45, 1.0, 1.55)):
    box(f"swBoard{i}", X1 + 0.3, X1 + 3.0, 4.6, 4.9, z - 0.03, z, cherry)
    for b in range(9):
        box(f"swBox{i}{b}", X1 + 0.38 + b * 0.29, X1 + 0.6 + b * 0.29, 4.66, 4.82, z, z + 0.36, mat(f"swb{(i + b) % 5}", ["#c83a2a", "#2a6ad0", "#3aa03a", "#e8a01a", "#8a3ad0"][(i + b) % 5], rough=0.3))
area("swLight", (X1 + 1.6, 4.15, 3.0), 0.8, 220, "#fff4e0", target=(X1 + 1.6, 4.15, 0))
group("door-software", *door_sw)
plant("ficus", 3.0, 2.6, 1.0, seed=5)

# ---------------------------------------------------------------- the rug, marble coffee table and what's on it
floorquad("rug", -1.9, 2.0, 0.6, 3.6, 0.004, rug)
TX, TY, TZ = 0.15, 1.75, 0.4
box("tableTop", TX - 1.05, TX + 1.05, TY - 0.55, TY + 0.55, TZ - 0.06, TZ, marb, bevel=0.015)
for dx in (-0.9, 0.84):
    box(f"tblock{dx}", TX + dx, TX + dx + 0.12, TY - 0.4, TY + 0.4, 0, TZ - 0.06, cherry, bevel=0.01)
group("fax", *fax("fax", TX - 0.85, TY - 0.2, TZ, m))
group("phone", *phone("phone", TX + 0.38, TY - 0.32, TZ, m))
rm = remote("remote", TX - 0.12, TY - 0.42, TZ, m)
rotate_about(rm, (TX - 0.06, TY - 0.25), 0.5)
group("remote", *rm)
lp = laptop("task", TX + 0.2, TY + 0.06, TZ, m)
group("task", *lp)
rb = regbox("register", 1.6, 2.35, 2.75, 3.3, 0.52, m)
rb[0]["hot"] = "register"
rotate_about([rb[0], bpy.data.objects["registerTape"]], (1.98, 3.0), -0.35)
# two lounge chairs angled in from the front corners, half out of frame
lounge("chairL", -2.1, 1.3, m, angle=-2.1)
lounge("chairR", 2.35, 1.0, m, angle=2.3)
box("sideTable", -2.95, -2.45, 2.7, 3.2, 0, 0.55, cherry, bevel=0.01)
cyl("lampBase", -2.7, 2.95, 0.55, 0.85, 0.08, mat("ginger", "#1a4a8a", rough=0.15, coat=1))
cone("lampShade", -2.7, 2.95, 0.85, 1.2, 0.22, 0.14, mat("shade", "#f8ecd0", rough=0.7, emit="#fff0c8", emit_str=1.5))
point("lampBulb", (-2.7, 2.95, 1.0), 25, "#ffe0a8", radius=0.05)

# ---------------------------------------------------------------- lights: a hot afternoon sun through the glass wall
world("#a8ccf0", 0.35)
sun("sun", (0.88, 0.2, -0.48), energy=6.0, color="#fff0d0", angle=0.4)
area("skyFill", (X0 - 0.5, 2.5, 1.5), 4.0, 110, "#cfe4ff", target=(0, 2.5, 0.8), size_y=2.0)["soft"] = 1
area("roomFill", (0.5, -1.2, 2.6), 3.0, 70, "#fff0dc", target=(0, 4, 1.0))["soft"] = 1
track_light("trackA", -1.6, 1.6, 4.9, H - 0.18, 4, m, aim_z=0.9, energy=55, aim_dy=0.5)

camera((0.55, -0.85, 1.32), (-0.55, 6.0, 1.05), lens=17.5, shift_y=-0.07)
render("v35_living", 640, 480, samples=160, exposure=-0.35)


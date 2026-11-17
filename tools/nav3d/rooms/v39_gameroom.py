# Navigator 3.9 — GameRoom: surreal and playful. A curved blue wall with a porthole to the sea,
# a polka-dot floor, Tesla-coil lamps, a card table, the 404 Arcade, shelves of games and a sleepy dog.
import sys, os, math
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from common import *

reset(); m = M()
X0, X1, Y1, H = -3.6, 3.6, 4.6, 3.3
polka = image("polka", T("polka.png"), rough=0.25, spec=0.6, world_scale=0.6)
grey = mat("greyWall", "#8a8a92", rough=0.7)
blue = mat("blueWall", "#3048c8", rough=0.55)
box("floor", X0, X1, -2, Y1, -0.05, 0, polka, bevel=0)
box("back", X0, X1, Y1, Y1 + 0.15, 0, H, grey, bevel=0)
box("ceiling", X0, X1, -2, Y1, H, H + 0.05, mat("ceilDark", "#2a2a30", rough=0.9), bevel=0)
box("right", X1, X1 + 0.15, -2, 1.6, 0, H, grey, bevel=0); box("rightFar", X1, X1 + 0.15, 3.0, Y1, 0, H, grey, bevel=0)
box("rightHead", X1, X1 + 0.15, 1.6, 3.0, 2.3, H, grey, bevel=0)

# ---------------------------------------------------------------- the curved blue wall (left) and its porthole
import bmesh
CX, CY, CR = 0.5, 2.8, 4.1
bpy.ops.mesh.primitive_cylinder_add(vertices=128, radius=CR, depth=H, location=(CX, CY, H / 2), end_fill_type="NOTHING")
cw = bpy.context.active_object; cw.name = "curve"; cw.data.materials.append(blue)
bm = bmesh.new(); bm.from_mesh(cw.data)
bmesh.ops.delete(bm, geom=[v for v in bm.verts if v.co.x + CX > -1.2 or v.co.y + CY > Y1 + 0.2], context="VERTS")
bm.to_mesh(cw.data); bm.free()
for p in cw.data.polygons: p.use_smooth = True
def onCurve(y): return CX - math.sqrt(CR * CR - (y - CY) ** 2)
PY, PZ, PR = 2.75, 1.75, 0.5
PX = onCurve(PY) + 0.03; ang = math.atan2(PY - CY, CX - PX)
port = [torus("portRim", PX, PY, PZ, PR, 0.07, m["gold"], rot=(0, PI / 2, ang))]
dy, dx = PR * math.cos(ang), PR * math.sin(ang)
pq = quad("portSea", [(PX + 0.01 - dx, PY - dy, PZ - PR), (PX + 0.01 + dx, PY + dy, PZ - PR), (PX + 0.01 + dx, PY + dy, PZ + PR), (PX + 0.01 - dx, PY - dy, PZ + PR)],
          image("seaRound", T("sea_round.png"), emit=1.2, rough=0.1, alpha=True), anchor="port")
port.append(pq)
group("port", *port)

# ---------------------------------------------------------------- the games shelves (back wall)
box("gBack", -0.7, 2.5, Y1 - 0.05, Y1, 0, 2.45, m["walnut"], bevel=0)
box("gL", -0.7, -0.6, Y1 - 0.45, Y1, 0, 2.45, m["walnut"]); box("gR", 2.4, 2.5, Y1 - 0.45, Y1, 0, 2.45, m["walnut"])
box("gTop", -0.75, 2.55, Y1 - 0.5, Y1, 2.45, 2.55, m["walnut"])
games = ["solitaire", "minesweeper", "pinball", "doom", "app-kojima", "app-lostatsea", "app-everybodyisjohn", "tk-pointkeeper", "tk-oneshot"]
for r, z in enumerate((1.68, 0.98, 0.28)):
    box(f"gShelf{r}", -0.6, 2.4, Y1 - 0.45, Y1 - 0.05, z - 0.04, z, mat("shelfWal", "#7a5030", rough=0.4))
    for c in range(3):
        i = r * 3 + c; x = -0.45 + c * 0.95
        b = softbox("game" + str(i), x, x + 0.5, z, z + 0.62, Y1 - 0.35, "game_" + games[i], d=0.14); b["hot"] = f"g-{i}"
group("install", box("plusBtn", 2.62, 3.02, Y1 - 0.06, Y1, 0.2, 0.5, m["gold"], bevel=0.02), text("plusT", "+", 2.82, Y1 - 0.065, 0.35, size=0.3, material=mat("ink", "#2a1a04", rough=0.5)))
spot("shelfSpot", (0.9, 2.2, H - 0.1), (0.9, Y1, 1.2), 380, "#fff0d8", angle=48, blend=0.5)

# ---------------------------------------------------------------- the 404 Arcade (left front)
AX0, AX1, AY0, AY1 = -2.75, -2.05, 3.5, 4.2
ac = mat("arcadePurple", "#7a1aa8", rough=0.4, coat=0.3)
arc = [box("arcBody", AX0, AX1, AY0, AY1, 0, 1.9, ac, bevel=0.02),
       box("arcPanel", AX0, AX1, AY0 - 0.2, AY0 + 0.1, 0.9, 1.0, mat("arcadeDark", "#2a0a4a", rough=0.4), bevel=0.02),
       quad("arcScreen", [(AX0 + 0.08, AY0 - 0.12, 1.06), (AX1 - 0.08, AY0 - 0.12, 1.06), (AX1 - 0.08, AY0 - 0.01, 1.6), (AX0 + 0.08, AY0 - 0.01, 1.6)], image("arcScr", T("arcade.png"), emit=1.6, rough=0.1)),
       wallquad("arcMarquee", AX0 + 0.04, AX1 - 0.04, 1.68, 1.85, AY0 - 0.002, image("arcLbl", T("lbl_arcade.png"), alpha=True, emit=1.0)),
       cyl("joy", AX0 + 0.25, AY0 - 0.1, 1.0, 1.12, 0.012, m["blk"]), sphere("joyBall", AX0 + 0.25, AY0 - 0.1, 1.13, 0.035, mat("joyRed", "#e82a2a", rough=0.3, coat=1))]
for i in range(3): arc.append(cyl(f"abtn{i}", AX0 + 0.45 + i * 0.08, AY0 - 0.1, 1.0, 1.02, 0.025, mat("abtn" + str(i), ["#ffd020", "#20c0ff", "#ff40c0"][i], rough=0.3)))
group("arcade", *arc)
point("arcGlow", (AX0 + 0.37, AY0 - 0.6, 1.4), 25, "#a060ff", radius=0.2)

# ---------------------------------------------------------------- card table, Tesla lamps, the dog
TZ = 0.75
box("tableTop", -0.3, 1.1, 1.9, 2.8, TZ - 0.05, TZ, mat("felt", "#1a6a3a", rough=0.9), bevel=0.01)
box("tableRim", -0.35, 1.15, 1.85, 2.85, TZ - 0.08, TZ - 0.04, m["walnut"], bevel=0.01)
for x in (-0.28, 1.04):
    for y in (1.92, 2.72): box(f"tl{x}{y}", x, x + 0.05, y, y + 0.05, 0, TZ - 0.05, m["walnut"])
for i, (x, y) in enumerate(((0.1, 2.2), (0.35, 2.3), (0.6, 2.15))):
    c = box(f"card{i}", x, x + 0.12, y, y + 0.17, TZ, TZ + 0.005, mat("card", "#ffffff", rough=0.5), bevel=0)
for i, (x, y) in enumerate(((-0.9, 3.4), (2.9, 2.0))):
    cyl(f"teslaBase{i}", x, y, 0, 0.08, 0.16, m["chrome"]); cyl(f"teslaPole{i}", x, y, 0.08, 1.5, 0.025, m["chrome"])
    for k in range(3): torus(f"teslaCoil{i}{k}", x, y, 0.6 + k * 0.25, 0.07, 0.015, mat("copper", "#b86a3a", rough=0.3, metal=1.0))
    sphere(f"teslaOrb{i}", x, y, 1.6, 0.13, mat("orb", "#c8e8ff", rough=0.05, glass=0.6, emit="#80c0ff", emit_str=4))
    point(f"teslaLight{i}", (x, y, 1.6), 30, "#80c0ff", radius=0.15)
dog = cat("dog", 1.5, 1.4, color="#f4f4f0", stripe="#141414", heading=-0.4)
group("dog", *dog)

# right: the doorway back to the Living Room
dr = [box("drJ1", X1 - 0.06, X1 + 0.02, 1.52, 1.62, 0, 2.38, m["gold"]), box("drJ2", X1 - 0.06, X1 + 0.02, 2.98, 3.08, 0, 2.38, m["gold"]),
      box("drJ3", X1 - 0.06, X1 + 0.02, 1.52, 3.08, 2.3, 2.38, m["gold"])]
box("drFloor", X1, X1 + 3, 1.6, 3.0, -0.05, 0, image("floorC", T("floor_cherry.png"), rough=0.2, world_scale=0.35), bevel=0)
loft = mat("loftWall", "#ece4d4", rough=0.8)
box("drA", X1, X1 + 3, 1.45, 1.6, 0, H, loft, bevel=0); box("drB", X1, X1 + 3, 3.0, 3.15, 0, H, loft, bevel=0); box("drEnd", X1 + 3, X1 + 3.1, 1.4, 3.2, 0, H, loft, bevel=0)
area("drLight", (X1 + 1.5, 2.3, 3.0), 1.0, 220, "#fff4e0", target=(X1 + 1.5, 2.3, 0))
dr.append(sidequad("drHot", 1.6, 3.0, 0, 2.3, X1 - 0.01, m["void"], facing=-1))
group("living", *dr)

# ---------------------------------------------------------------- lights + camera
world("#101018", 0.3)
area("ceilingMain", (0.4, 2.0, H - 0.05), 3.0, 260, "#f0f0ff", target=(0.4, 2.0, 0), size_y=2.0)
area("fill", (0, -1.2, 2.5), 3.0, 80, "#fff0e0", target=(0, 3, 1))
area("blueBounce", (-1.0, 2.0, 1.5), 1.0, 60, "#8090ff", target=(-3, 2, 1.5))
camera((0.2, -1.3, 1.6), (0.2, 6.0, 1.6), lens=18, shift_y=-0.02)
render("v39_gameroom", 800, 600, samples=160, look="Punchy", exposure=-0.05)

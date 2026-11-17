# Navigator 3.9 — MySpace: a moody attic den for older kids. Porthole window (pull the lever!),
# stone fireplace with the symbols on its mantel, a desk of curiosities, drawers, a games shelf,
# a trapdoor (My Crypt) and a green door (My Lab).
import sys, os, math
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from common import *

reset(); m = M()
X0, X1, Y1, H = -3.1, 3.6, 4.4, 3.6
boards = image("boards", T("floor_dark.png"), rough=0.5, spec=0.3, world_scale=0.35)
plank = wood("plankWall", "#5a3a2a", "#2a160a", scale=3, rough=0.6, coat=0.1, axis="Y")
plankX = wood("plankWallX", "#5a3a2a", "#2a160a", scale=3, rough=0.6, coat=0.1, axis="X")
beamM = wood("beam", "#3a2414", "#1a0c04", scale=3, rough=0.6, coat=0.0, axis="X")
copper = mat("copper", "#b86a3a", rough=0.3, metal=1.0)
purple = mat("purpleWood", "#4a2a4a", rough=0.4, coat=0.4)
box("floor", X0, X1, -2, Y1, -0.05, 0, boards, bevel=0)
box("back", X0, X1, Y1, Y1 + 0.15, 0, H, plankX, bevel=0)
box("left", X0 - 0.15, X0, -2, Y1, 0, H, plank, bevel=0)
box("right", X1, X1 + 0.15, -2, Y1, 0, H, plank, bevel=0)
# sloped roof: two big rafters planes meeting high above
for side in (-1, 1):
    q = quad("roof" + str(side), [(side * 3.6, -2, 2.8), (side * 3.6, Y1, 2.8), (0, Y1, H + 0.4), (0, -2, H + 0.4)] if side < 0 else [(0, -2, H + 0.4), (0, Y1, H + 0.4), (3.6, Y1, 2.8), (3.6, -2, 2.8)], plank)
for i, y in enumerate((0.4, 1.9, 3.4)):
    box(f"tie{i}", X0, X1, y - 0.08, y + 0.08, 2.7, 2.86, beamM, bevel=0.01)
# copper pipes along the back wall
for i, z in enumerate((3.0, 3.12)):
    cyl(f"pipe{i}", 0, Y1 - 0.12 - i * 0.1, -3.4, 3.4, 0.035, copper, rot=(0, PI / 2, 0)).location = (0, Y1 - 0.12 - i * 0.1, z)

# ---------------------------------------------------------------- the porthole window (centre) and the lever
WX, WZ, WR = 0.2, 1.95, 0.62
win = [torus("portRing", WX, Y1 - 0.06, WZ, WR, 0.07, copper, rot=(PI / 2, 0, 0))]
for i in range(8):
    a = i * PI / 4; win.append(sphere(f"rivet{i}", WX + (WR + 0.07) * math.cos(a), Y1 - 0.1, WZ + (WR + 0.07) * math.sin(a), 0.03, copper))
win.append(wallquad("portGlass", WX - WR, WX + WR, WZ - WR, WZ + WR, Y1 - 0.03, image("night", T("night_round.png"), emit=1.3, rough=0.1, alpha=True), anchor="window"))
box("portBar1", WX - WR, WX + WR, Y1 - 0.05, Y1 - 0.03, WZ - 0.025, WZ + 0.025, copper, bevel=0); box("portBar2", WX - 0.025, WX + 0.025, Y1 - 0.05, Y1 - 0.03, WZ - WR, WZ + WR, copper, bevel=0)
group("window", *win)
# curtains either side
for side in (-1, 1):
    c = box(f"curtain{side}", WX + side * 0.85 - 0.18, WX + side * 0.85 + 0.18, Y1 - 0.2, Y1 - 0.08, 1.0, 2.9, mat("velvet", "#5a0a2a", rough=0.9), bevel=0.06)
lever = [box("leverPlate", 0.95, 1.15, Y1 - 0.04, Y1, 1.05, 1.35, mat("iron", "#4a4a4a", rough=0.5, metal=0.8), bevel=0.01),
         box("leverArm", 1.03, 1.07, Y1 - 0.12, Y1 - 0.04, 1.2, 1.5, mat("steel", "#9a9a9a", rough=0.3, metal=0.9), bevel=0),
         sphere("leverKnob", 1.05, Y1 - 0.08, 1.52, 0.05, mat("knobRed", "#c82a2a", rough=0.3, coat=1))]
group("lever", *lever)

# ---------------------------------------------------------------- the desk of curiosities (under the window)
DZ = 0.78
box("desk", -0.6, 1.4, Y1 - 0.9, Y1 - 0.25, DZ - 0.06, DZ, m["walnut"], bevel=0.012)
for x in (-0.55, 1.3):
    for y in (Y1 - 0.85, Y1 - 0.35): box(f"dleg{x}{y}", x, x + 0.06, y, y + 0.06, 0, DZ - 0.06, m["walnut"])
group("help", box("helpBox", -0.75, -0.3, Y1 - 0.75, Y1 - 0.45, DZ, DZ + 0.3, mat("helpBox", "#e8e0c8", rough=0.6), bevel=0.01),
      text("helpQ", "?", -0.525, Y1 - 0.752, DZ + 0.15, size=0.2, material=mat("helpInk", "#5a2a6a", rough=0.5)))
group("cup", cyl("cup", -0.12, Y1 - 0.6, DZ, DZ + 0.13, 0.055, mat("mug", "#e8e8f0", rough=0.3, coat=0.5)), torus("cupH", -0.06, Y1 - 0.6, DZ + 0.07, 0.035, 0.01, mat("mug", "#e8e8f0", rough=0.3, coat=0.5), rot=(PI / 2, 0, PI / 2)))
group("disk", box("diskDrive", 0.1, 0.6, Y1 - 0.75, Y1 - 0.45, DZ, DZ + 0.12, m["beige"], bevel=0.01),
      box("diskSlot", 0.18, 0.52, Y1 - 0.752, Y1 - 0.75, DZ + 0.05, DZ + 0.07, m["blk"], bevel=0))
group("crystal", cyl("crystalBase", 0.95, Y1 - 0.6, DZ, DZ + 0.06, 0.1, mat("brass", "#8a6a2a", rough=0.3, metal=1.0)),
      sphere("crystal", 0.95, Y1 - 0.6, DZ + 0.2, 0.15, mat("crystal", "#c8a8ff", rough=0.0, glass=1.0, emit="#8a5ad0", emit_str=0.6)))

# ---------------------------------------------------------------- stone fireplace (left) with the symbols on the mantel
FX0, FX1, FY = -2.75, -1.05, 3.5
st = image("stone", T("stone.png"), rough=0.8, world_scale=0.8)
box("fpL", FX0, FX0 + 0.35, FY, Y1, 0, 1.8, st); box("fpR", FX1 - 0.35, FX1, FY, Y1, 0, 1.8, st); box("fpTop", FX0, FX1, FY, Y1, 1.2, 1.8, st)
box("fpBack", FX0 + 0.35, FX1 - 0.35, Y1 - 0.15, Y1, 0, 1.2, mat("soot", "#0a0604", rough=0.9), bevel=0)
box("mantel", FX0 - 0.1, FX1 + 0.1, FY - 0.12, Y1, 1.8, 1.9, m["walnut"])
sy = [box("plaque", -2.25, -1.55, FY - 0.04, FY, 1.38, 1.62, m["walnut"], bevel=0.01), wallquad("plaqueFace", -2.2, -1.6, 1.41, 1.59, FY - 0.042, image("plaqueImg", T("plaque.png"), rough=0.5), anchor="symbols")]
group("symbols", *sy)
flame = mat("fire", "#ff6a10", emit="#ff5a00", emit_str=3.5)
for i, (x, h) in enumerate(((-2.15, 0.35), (-2.0, 0.5), (-1.9, 0.6), (-1.78, 0.42), (-1.65, 0.3))):
    cone(f"flame{i}", x, Y1 - 0.45, 0.1, 0.1 + h, 0.07, 0.0, flame, verts=12)
for i in range(3): cyl(f"log{i}", -1.9, Y1 - 0.45 + (i - 1) * 0.08, 0.04, 0.12, 0.05, beamM, rot=(0, PI / 2, 0.3 * (i - 1))).location = (-1.9, Y1 - 0.45 + (i - 1) * 0.08, 0.08)
point("fireLight", (-1.9, Y1 - 0.8, 0.5), 160, "#ff8a30", radius=0.2)
pk = [cyl("poker", -0.85, FY - 0.35, 0.0, 1.0, 0.012, m["blk"], rot=(0.0, 0.25, 0)), sphere("pokerKnob", -0.73, FY - 0.35, 0.98, 0.03, mat("brass", "#8a6a2a", rough=0.3, metal=1.0))]
group("poker", *pk)

# ---------------------------------------------------------------- the dresser of drawers (right) and the games shelf above it
DX0, DX1, DY0, DY1 = 2.2, 3.4, 3.6, 4.3
box("dresser", DX0, DX1, DY0, DY1, 0, 1.75, purple)
for i in range(5):
    z0 = 1.42 - i * 0.33
    dr = [box(f"drw{i}", DX0 + 0.06, DX1 - 0.06, DY0 - 0.03, DY0, z0, z0 + 0.29, mat("purpleDr", "#5a3a5a", rough=0.35, coat=0.5), bevel=0.01),
          sphere(f"drKnob{i}", DX1 - 0.18, DY0 - 0.05, z0 + 0.145, 0.03, m["gold"]),
          wallquad(f"drLbl{i}", DX0 + 0.12, DX1 - 0.3, z0 + 0.07, z0 + 0.22, DY0 - 0.032, m["void"], anchor=f"drawer{i}")]
    group(f"drawer-{i}", *dr)
box("gShelfBack", 1.6, 3.4, Y1 - 0.04, Y1, 1.95, 2.75, purple, bevel=0)
for i, z in enumerate((1.95, 2.35)): box(f"gShelf{i}", 1.6, 3.4, Y1 - 0.32, Y1 - 0.04, z - 0.03, z, purple)
games = ["doom", "minesweeper", "app-kojima", "pinball", "app-lostatsea", "tk-oneshot"]
for i, gid in enumerate(games):
    r, c = i // 3, i % 3; x = 1.72 + c * 0.56; z = 2.35 if r == 0 else 1.95
    b = softbox("g" + str(i), x, x + 0.3, z, z + 0.38, Y1 - 0.24, "game_" + gid, d=0.1); b["hot"] = f"g-{i}"

# ---------------------------------------------------------------- crypt trapdoor, lab door, bin, exit
cr = [box("trapdoor", -2.1, -0.9, 0.9, 1.7, 0.0, 0.02, m["walnut"], bevel=0.008), torus("trapRing", -1.5, 1.3, 0.03, 0.08, 0.012, m["gold"])]
for i in range(4): cr.append(box(f"trapSlat{i}", -2.1, -0.9, 0.9 + i * 0.2 - 0.005, 0.9 + i * 0.2 + 0.005, 0.02, 0.025, mat("gap", "#140804", rough=0.9), bevel=0))
cr.append(floorquad("trapLbl", -1.9, -1.1, 0.95, 1.15, 0.026, image("lblCrypt", T("lbl_crypt.png"), alpha=True, rough=0.5)))
group("crypt", *cr)
lab = [sidequad("labDoor", 2.2, 3.4, 0, 2.1, X1 - 0.02, mat("labGreen", "#1a4a2a", rough=0.4, coat=0.4), facing=-1),
       sidequad("labLbl", 2.4, 3.2, 1.2, 1.7, X1 - 0.03, image("lblLab", T("lbl_lab.png"), alpha=True, rough=0.5), facing=-1),
       sphere("labKnob", X1 - 0.06, 3.25, 1.0, 0.035, m["gold"])]
group("lab", *lab)
group("bin", cyl("bin", 1.9, 0.9, 0, 0.45, 0.18, mat("binMetal", "#3a3a3a", rough=0.4, metal=0.7)), torus("binRim", 1.9, 0.9, 0.45, 0.18, 0.012, m["chrome"]))
ex = [sidequad("exitDoor", 1.9, 3.2, 0, 2.2, X0 + 0.02, mat("exitIn", "#2a1a3a", rough=0.5, emit="#5a3a7a", emit_str=0.5), facing=1),
      sidequad("exitLbl", 2.0, 3.1, 1.3, 1.8, X0 + 0.03, image("lblExit", T("lbl_exit.png"), alpha=True, rough=0.5), facing=1)]
group("exit", *ex)

# ---------------------------------------------------------------- lights + camera
world("#0a0a14", 0.2)
area("moon", (WX, Y1 + 0.6, WZ), 1.0, 60, "#b8a8ff", target=(WX, 0, 1.0))
point("hanging", (0.2, 2.2, 2.5), 160, "#ffd8a0", radius=0.08)
sphere("bulb", 0.2, 2.2, 2.55, 0.05, mat("bulb", "#fff0c8", emit="#fff0c8", emit_str=20))
cyl("cord", 0.2, 2.2, 2.6, 3.4, 0.006, m["blk"])
area("fill", (0, -1.2, 2.5), 3.0, 110, "#c8b8ff", target=(0, 3, 1))
point("dresserLamp", (2.8, 3.3, 2.0), 70, "#ffc890", radius=0.1)
cyl("candleR", 3.1, 3.9, 1.75, 1.95, 0.04, mat("wax", "#f8f0e0", rough=0.6))
sphere("candleFlame", 3.1, 3.9, 1.99, 0.015, mat("flameS", "#ffcc40", emit="#ffb030", emit_str=20), scale=(1, 1, 2))
spot("gamesSpot", (2.5, 2.4, 3.2), (2.5, Y1, 2.2), 120, "#e8d8ff", angle=40)
camera((0.0, -1.3, 1.6), (0.0, 6.0, 1.6), lens=18, shift_y=0.0)
render("v39_myspace", 800, 600, samples=200, look="Punchy", exposure=0.0)

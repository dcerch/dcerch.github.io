# Navigator 3.9 — Info Room: dark walls, track lights, an orange-lit tutorial cabinet, the red manuals
# bookcase and a cherry shelf of online services.
import sys, os, math
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from common import *

reset(); m = M()
X0, X1, Y1, H = -3.6, 3.6, 4.4, 3.2
dark = mat("darkWall", "#5a5248", rough=0.8, spec=0.2)
darkL = mat("darkWallL", "#4a443c", rough=0.8, spec=0.2)
ceil = mat("ceilDark", "#3a3632", rough=0.9)
carpet = mat("carpet", "#9a948a", rough=0.95, spec=0.05)
floorW = image("floorC", T("floor_cherry.png"), rough=0.2, spec=0.6, world_scale=0.35)
box("floor", X0, X1, -2, Y1, -0.05, 0, floorW, bevel=0)
floorquad("carpet", -2.6, 2.4, 0.6, 3.6, 0.004, carpet)
box("ceiling", X0, X1, -2, Y1, H, H + 0.05, ceil, bevel=0)
box("back", X0, X1, Y1, Y1 + 0.15, 0, H, dark, bevel=0)
box("left", X0 - 0.15, X0, -2, Y1, 0, H, darkL, bevel=0)
# right: the doorway back to the bright Living Room
box("rightNear", X1, X1 + 0.15, -2, 1.6, 0, H, darkL, bevel=0); box("rightFar", X1, X1 + 0.15, 3.0, Y1, 0, H, darkL, bevel=0)
box("rightHead", X1, X1 + 0.15, 1.6, 3.0, 2.4, H, darkL, bevel=0)
lr = [box("lrJ1", X1 - 0.06, X1 + 0.02, 1.52, 1.62, 0, 2.48, mat("frameDark", "#2a2622", rough=0.4)), box("lrJ2", X1 - 0.06, X1 + 0.02, 2.98, 3.08, 0, 2.48, mat("frameDark", "#2a2622", rough=0.4)),
      box("lrJ3", X1 - 0.06, X1 + 0.02, 1.52, 3.08, 2.4, 2.48, mat("frameDark", "#2a2622", rough=0.4))]
box("lrFloor", X1, X1 + 3, 1.6, 3.0, -0.05, 0, floorW, bevel=0)
bright = mat("loftWall", "#f0ebe2", rough=0.8)
box("lrA", X1, X1 + 3, 1.45, 1.6, 0, 3.0, bright, bevel=0); box("lrB", X1, X1 + 3, 3.0, 3.15, 0, 3.0, bright, bevel=0); box("lrEnd", X1 + 3, X1 + 3.1, 1.4, 3.2, 0, 3.0, bright, bevel=0)
wallquad("lrWin", X1 + 1.0, X1 + 2.6, 0.9, 2.6, 2.99, image("skyImg", T("ext_skyline.png"), emit=1.2, rough=1))
area("lrLight", (X1 + 1.5, 2.3, 2.9), 1.2, 260, "#fff4e0", target=(X1 + 1.5, 2.3, 0))
lr.append(sidequad("lrHot", 1.6, 3.0, 0, 2.4, X1 - 0.01, m["void"], facing=-1))
group("living", *lr)

# ---------------------------------------------------------------- the tutorial cabinet (left), lit warm orange from inside
TY = 3.0
orange = mat("orangeCab", "#e8822a", rough=0.35, coat=0.5)
box("tutBody", -3.4, -1.3, TY, TY + 0.6, 0, 2.5, orange)
box("tutInside", -3.25, -1.45, TY - 0.01, TY + 0.02, 0.35, 2.15, mat("tutIn", "#a84a10", rough=0.5, emit="#ff9a40", emit_str=0.35), bevel=0)
wallquad("lblTut", -3.1, -1.6, 2.2, 2.42, TY - 0.012, image("lblTut", T("lbl_tutorials.png"), alpha=True, rough=0.5))
tuts = ["mouse", "overview", "about", "media", "software", "info", "kidspace", "internet", "faq"]
for i, k in enumerate(tuts):
    col, row = i % 3, i // 3
    x = -3.18 + col * 0.6; z = 1.6 - row * 0.6
    t = box("tut" + k, x, x + 0.5, TY - 0.06, TY - 0.02, z, z + 0.5, image("tile_" + k, T(f"tut_{k}.png"), rough=0.4), bevel=0.008)
    t["hot"] = "t-" + k
point("tutGlow", (-2.35, TY - 0.5, 1.5), 40, "#ffb060", radius=0.3)
group("clock", *wallclock("clock", -0.35, 2.88, Y1, 0.2, mat("rimDark", "#3a2414", rough=0.3), image("clockImg", T("clock.png"), alpha=True, rough=0.3), m["blk"]))

# ---------------------------------------------------------------- the manuals bookcase (centre)
mb = [box("manBack", -1.05, 0.35, Y1 - 0.06, Y1, 0, 2.5, m["cherryV"], bevel=0), box("manL", -1.05, -0.95, Y1 - 0.5, Y1, 0, 2.5, m["cherryV"]),
      box("manR", 0.25, 0.35, Y1 - 0.5, Y1, 0, 2.5, m["cherryV"]), box("manTop", -1.1, 0.4, Y1 - 0.55, Y1, 2.5, 2.6, m["cherry"])]
for i, z in enumerate((0.12, 0.75, 1.38)):
    mb.append(box(f"manShelf{i}", -0.95, 0.25, Y1 - 0.5, Y1 - 0.06, z - 0.04, z, m["cherry"]))
    mb.append(books(f"manBooks{i}", -0.93, 0.23, z, z + 0.52, Y1 - 0.42, "books_red.png", d=0.34))
mb.append(wallquad("lblMan", -0.95, 0.25, 2.1, 2.36, Y1 - 0.5, image("lblMan", T("lbl_manuals.png"), alpha=True, rough=0.6)))
group("manuals", *mb)

# ---------------------------------------------------------------- the online shelf (right)
OY = 3.6
box("onBack", 0.6, 3.0, OY + 0.4, OY + 0.46, 0, 2.3, m["cherryV"], bevel=0)
box("onL", 0.6, 0.7, OY, OY + 0.46, 0, 2.3, m["cherryV"]); box("onR", 2.9, 3.0, OY, OY + 0.46, 0, 2.3, m["cherryV"])
box("onTop", 0.55, 3.05, OY - 0.04, OY + 0.46, 2.3, 2.4, m["cherry"]); box("onBase", 0.6, 3.0, OY, OY + 0.46, 0, 0.2, m["cherry"])
ON = [("o-linkedin", "svc_linkedin"), ("o-github", "svc_github"), ("o-mail", "svc_mail"), ("o-oldsite", "svc_oldsite"), ("o-net", "svc_net"), ("o-phone", "svc_phone")]
for r, z in enumerate((1.45, 0.62)):
    box(f"onShelf{r}", 0.7, 2.9, OY, OY + 0.42, z - 0.04, z, m["cherry"])
    for c in range(3):
        k, art = ON[r * 3 + c]; x = 0.85 + c * 0.7
        b = softbox("on" + k, x, x + 0.5, z, z + 0.64, OY + 0.12, art, d=0.14); b["hot"] = k
point("onGlow", (1.8, OY - 0.3, 2.2), 30, "#ffe0b0", radius=0.2)

plant("plant", 3.1, 1.2, s=1.0)

# ---------------------------------------------------------------- track lights + camera
for i, x in enumerate((-2.4, -0.4, 1.8)):
    box(f"track{i}", x - 0.03, x + 0.03, 0.5, 3.6, H - 0.06, H - 0.02, m["blk"], bevel=0)
    for j, y in enumerate((1.2, 2.6)):
        cyl(f"tlamp{i}{j}", x, y, H - 0.26, H - 0.06, 0.06, m["blk"])
spot("spotTut", (-2.4, 1.6, H - 0.2), (-2.35, TY, 1.4), 260, "#ffd8a0", angle=40, blend=0.5)
spot("spotMan", (-0.4, 2.2, H - 0.2), (-0.35, Y1, 1.3), 300, "#fff0d0", angle=36, blend=0.5)
spot("spotOn", (1.8, 1.8, H - 0.2), (1.8, OY, 1.2), 300, "#fff0d0", angle=42, blend=0.5)
area("fill", (0, -1.2, 2.5), 3.0, 60, "#fff0e0", target=(0, 3, 1))
world("#202024", 0.3)
camera((0.0, -1.2, 1.6), (0.0, 6.0, 1.6), lens=18, shift_y=0.02)
render("v39_info", 800, 600, samples=160, look="Punchy", exposure=-0.1)

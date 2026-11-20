# Navigator toolbar icons, rendered like the 1995 bitmaps: little photoreal objects with hard light.
#   blender -b --factory-startup -P icons.py      -> out/icons/<key>.png (transparent, 128px)
#   python post.py --icons                        -> img/nav/tb/<key>.png
# Original models; nothing traced from the real Navigator.
import sys, os, math
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from lib import *
import lib

PI = math.pi
T = lambda n: os.path.join(TEX, n)
ICO = os.path.join(OUT, "icons"); os.makedirs(ICO, exist_ok=True)
only = [a for a in sys.argv[sys.argv.index("--") + 1:]] if "--" in sys.argv else []

def M_():
    return dict(blk=mat("blk", "#18181c", rough=0.3), chrome=mat("chrome", "#e0e0e4", rough=0.12, metal=1.0), gold=mat("gold", "#d8a83a", rough=0.22, metal=1.0),
                beige=mat("beige", "#e6dcc4", rough=0.4), white=mat("white", "#f6f4ee", rough=0.35), red=mat("red", "#d02020", rough=0.3, coat=0.6),
                green=mat("green", "#1aa040", rough=0.3, coat=0.6), blue=mat("blue", "#1e5ad8", rough=0.25, coat=0.6), yellow=mat("yellow", "#f2c21a", rough=0.3, coat=0.6),
                skin=mat("skin", "#f0b88a", rough=0.5), glow=mat("glowW", "#ffffff", emit="#ffffff", emit_str=3))

def setup(tilt=0.95, dist=3.4, lens=50, target=(0, 0, 0.2)):
    sc = bpy.context.scene
    world("#7a8088", 0.6)
    area("key", (-2.2, -2.4, 3.2), 0.8, 700, "#fff4e4", target=(0, 0, 0))
    area("rim", (2.4, 1.8, 2.0), 1.0, 300, "#d8e4ff", target=(0, 0, 0.3))
    area("fill", (1.8, -3, 0.8), 1.5, 120, "#ffffff", target=(0, 0, 0.3))
    camera((0, -dist * math.sin(tilt), dist * math.cos(tilt) + target[2]), target, lens=lens)
    sc.render.film_transparent = True

def shoot(key, samples=64):
    sc = bpy.context.scene
    sc.render.engine = "CYCLES"; lib._gpu(sc)
    sc.cycles.samples = samples; sc.cycles.use_denoising = True
    sc.cycles.max_bounces = 4
    sc.render.resolution_x = sc.render.resolution_y = 128
    sc.view_settings.view_transform = "Standard"; sc.view_settings.look = "None"
    sc.render.image_settings.file_format = "PNG"; sc.render.image_settings.color_mode = "RGBA"
    sc.render.filepath = os.path.join(ICO, key + ".png")
    bpy.ops.render.render(write_still=True)

def rot(o, x=0, y=0, z=0):
    for oo in o if isinstance(o, (list, tuple)) else [o]:
        oo.rotation_euler = (oo.rotation_euler.x + x, oo.rotation_euler.y + y, oo.rotation_euler.z + z)
    return o

def parent(objs, loc=(0, 0, 0), r=(0, 0, 0), s=1.0):
    e = bpy.data.objects.new("pivot", None); bpy.context.scene.collection.objects.link(e)
    for o in objs:
        for oo in o if isinstance(o, (list, tuple)) else [o]: oo.parent = e
    e.location = loc; e.rotation_euler = r; e.scale = (s, s, s)
    return e

def figure(name, m, colr, x=0, y=0, s=1.0, run=False):
    """A chunky little person: ball head, rounded body, cylinder limbs."""
    c = mat("fig" + colr, colr, rough=0.35, coat=0.5)
    p = [sphere(name + "H", x, y, 1.05 * s, 0.17 * s, m["skin"]), sphere(name + "B", x, y, 0.62 * s, 0.24 * s, c, scale=(1, 0.75, 1.35))]
    if not run:
        p += [cyl(name + "L1", x - 0.1 * s, y, 0, 0.35 * s, 0.07 * s, c), cyl(name + "L2", x + 0.1 * s, y, 0, 0.35 * s, 0.07 * s, c)]
        return p
    limbs = [((-0.05, 0.62), (-0.42, 0.3), 0.06), ((0.05, 0.62), (0.38, 0.85), 0.06), ((-0.05, 0.42), (-0.32, 0.0), 0.075), ((0.05, 0.42), (0.36, 0.12), 0.075)]
    for i, ((ax, az), (bx, bz), r) in enumerate(limbs):
        L = math.hypot(bx - ax, bz - az); a = math.atan2(bx - ax, bz - az)
        o = cyl(f"{name}Limb{i}", x + (ax + bx) / 2 * s, y, (az + bz) / 2 * s - L / 2 * s, (az + bz) / 2 * s + L / 2 * s, r * s, c)
        o.rotation_euler = (0, a, 0)
    return p

def tile(colr="#1c2228"):
    """The dark bevelled square every Navigator tool sits on."""
    return box("tile", -0.95, 0.95, -0.95, 0.95, -0.12, 0, mat("tile" + colr, colr, rough=0.35, metal=0.3), bevel=0.06, segs=3)

ICONS = {}
def icon(k):
    def d(f): ICONS[k] = f; return f
    return d

@icon("map")
def _(m):
    box("lawn", -0.85, 0.85, -0.7, 0.7, 0, 0.08, mat("lawn", "#3a9a2a", rough=0.7), bevel=0.03)
    box("house", -0.5, 0.5, -0.38, 0.38, 0.08, 0.72, m["beige"], bevel=0.01)
    me = bpy.data.meshes.new("roof"); me.from_pydata([(-0.62, -0.5, 0.7), (0.62, -0.5, 0.7), (0.62, 0.5, 0.7), (-0.62, 0.5, 0.7), (-0.62, 0, 1.15), (0.62, 0, 1.15)], [],
                                                      [(0, 1, 5, 4), (3, 4, 5, 2), (0, 4, 3), (1, 2, 5)]); lib._obj("roof", me, mat("roofR", "#b8301e", rough=0.5))
    box("door", -0.1, 0.12, -0.4, -0.38, 0.08, 0.46, mat("doorB", "#5a2a14", rough=0.4), bevel=0)
    for x in (-0.33, 0.33): box("win" + str(x), x - 0.1, x + 0.1, -0.4, -0.38, 0.38, 0.56, mat("winB", "#7ab8f0", rough=0.1, emit="#a8d0ff", emit_str=0.6), bevel=0)
    box("chim", 0.25, 0.4, 0.05, 0.2, 0.85, 1.2, mat("brick", "#8a3a22", rough=0.7), bevel=0.01)
    return dict(tilt=0.85, dist=4.2, target=(0, 0, 0.45))

@icon("media")
def _(m):
    o = [box("rem", -0.28, 0.28, -0.85, 0.85, 0, 0.16, m["blk"], bevel=0.06, segs=3)]
    cols = ["#d02020", "#20a040", "#e8e8e8", "#e8e8e8", "#e8e8e8", "#e8e8e8", "#e8e8e8", "#e8e8e8", "#f2c21a"]
    for i, cc in enumerate(cols):
        x = -0.15 + (i % 3) * 0.15; y = 0.35 - (i // 3) * 0.2
        o.append(cyl(f"rb{i}", x, y, 0.16, 0.2, 0.05, mat("rb" + cc, cc, rough=0.3)))
    o.append(box("lcd", -0.2, 0.2, 0.55, 0.75, 0.16, 0.17, mat("lcd", "#5ad070", emit="#5ad070", emit_str=0.8), bevel=0))
    parent(o, r=(0, 0, -0.45))
    return dict(tilt=0.7, dist=4.4)

@icon("windows")
def _(m):
    box("frame", -0.8, 0.8, -0.12, 0.12, 0, 1.3, mat("winFr", "#d8d8d0", rough=0.3), bevel=0.03)
    box("title", -0.72, 0.72, -0.14, -0.1, 1.08, 1.22, mat("navy", "#10208a", rough=0.3), bevel=0)
    for i, cc in enumerate(("#e0301e", "#2aa83a", "#2a5ae0", "#f2c21a")):
        x = -0.68 + (i % 2) * 0.7; z = 0.56 - (i // 2) * 0.48
        box(f"pane{i}", x, x + 0.64, -0.15, -0.1, z, z + 0.44, mat("pane" + cc, cc, rough=0.2, coat=0.6), bevel=0.01)
    return dict(tilt=1.35, dist=4.0, target=(0, 0, 0.62))

@icon("exit")
def _(m):
    box("sign", -0.9, 0.9, -0.1, 0.1, 0, 0.9, mat("signBody", "#e8e8e0", rough=0.3), bevel=0.04)
    box("face", -0.8, 0.8, -0.12, -0.1, 0.08, 0.82, mat("signFace", "#0a5a20", rough=0.3, emit="#0a7a28", emit_str=0.6), bevel=0)
    text("txt", "EXIT", 0, -0.13, 0.45, size=0.5, material=mat("exitT", "#b8ffb8", emit="#d8ffd8", emit_str=3), extrude=0.01)
    return dict(tilt=1.35, dist=4.0, target=(0, 0, 0.45))

@icon("key")
def _(m):
    o = [torus("bow", -0.5, 0, 0.1, 0.32, 0.09, m["gold"]), box("shaft", -0.2, 0.85, -0.06, 0.06, 0.04, 0.16, m["gold"], bevel=0.03)]
    o += [box("t1", 0.55, 0.65, -0.32, 0, 0.04, 0.16, m["gold"], bevel=0.01), box("t2", 0.7, 0.8, -0.24, 0, 0.04, 0.16, m["gold"], bevel=0.01)]
    parent(o, r=(0, 0, 0.6))
    return dict(tilt=0.5, dist=3.6)

@icon("docs")
def _(m):
    pg = mat("page", "#f8f4e8", rough=0.6)
    for s in (-1, 1):
        b = box(f"cov{s}", 0 if s > 0 else -0.85, 0.85 if s > 0 else 0, -0.6, 0.6, 0, 0.05, mat("cov", "#1a3a8a", rough=0.4), bevel=0.01)
        p = box(f"pg{s}", 0.02 if s > 0 else -0.8, 0.8 if s > 0 else -0.02, -0.55, 0.55, 0.05, 0.14, pg, bevel=0.01)
        for o in (b, p): o.rotation_euler = (0, -s * 0.22, 0)
    for i in range(4):
        for s in (-1, 1): box(f"ln{s}{i}", (0.15 if s > 0 else -0.68), (0.68 if s > 0 else -0.15), 0.3 - i * 0.18, 0.33 - i * 0.18, 0.15 + (0.08 if s else 0), 0.155 + 0.08, mat("ink", "#3a3a3a", rough=0.6), bevel=0).rotation_euler = (0, -s * 0.22, 0)
    me = bpy.data.meshes.new("bolt"); me.from_pydata([(0.05, -0.1, 0.35), (0.35, -0.1, 0.95), (0.18, -0.1, 0.95), (0.4, -0.1, 1.45), (-0.05, -0.1, 0.8), (0.12, -0.1, 0.8), (-0.12, -0.1, 0.35)], [], [(0, 1, 2, 3, 4, 5, 6)])
    o = lib._obj("bolt", me, mat("boltY", "#f8d020", rough=0.3, emit="#f8c010", emit_str=0.4)); md = o.modifiers.new("s", "SOLIDIFY"); md.thickness = 0.08
    return dict(tilt=0.95, dist=4.0, target=(0, 0, 0.45))

@icon("prefs")
def _(m):
    st = mat("steel", "#8a929e", rough=0.22, metal=0.85)
    o = [box("handle", -0.75, 0.35, -0.11, 0.11, 0, 0.12, st, bevel=0.04, segs=3), torus("jaw", 0.55, 0, 0.06, 0.25, 0.1, st),
         torus("jawEnd", -0.85, 0, 0.06, 0.16, 0.07, st)]
    parent(o, r=(0, 0, 0.75))
    return dict(tilt=0.55, dist=3.4)

@icon("phone")
def _(m):
    ph = mat("phoneB", "#e6dcc4", rough=0.35)
    box("base", -0.6, 0.6, -0.5, 0.5, 0, 0.3, ph, bevel=0.08, segs=3)
    box("hand", -0.65, 0.65, 0.18, 0.5, 0.3, 0.48, ph, bevel=0.1, segs=3)
    for i in range(12):
        x = -0.24 + (i % 3) * 0.24; y = 0.02 - (i // 3) * 0.13
        box(f"k{i}", x - 0.08, x + 0.08, y - 0.05, y + 0.05, 0.3, 0.34, mat("keyG", "#4a4a50", rough=0.4), bevel=0.01)
    return dict(tilt=0.85, dist=4.0, target=(0, 0, 0.2))

@icon("run")
def _(m):
    box("sign", -0.85, 0.85, -0.08, 0.08, 0, 1.6, mat("runG", "#0a8a3a", rough=0.3, emit="#0a8a3a", emit_str=0.5), bevel=0.05)
    w = mat("runW", "#ffffff", emit="#ffffff", emit_str=1.2)
    sphere("rHead", 0.12, -0.12, 1.28, 0.15, w)
    def limb(n, a, b, r):
        L = math.hypot(b[0] - a[0], b[1] - a[1]); ang = math.atan2(b[0] - a[0], b[1] - a[1])
        o = cyl(n, (a[0] + b[0]) / 2, -0.12, (a[1] + b[1]) / 2 - L / 2, (a[1] + b[1]) / 2 + L / 2, r, w, verts=16); o.rotation_euler = (0, ang, 0)
        sphere(n + "J", b[0], -0.12, b[1], r, w)
    limb("torso", (-0.08, 0.6), (0.06, 1.08), 0.11)
    limb("armF1", (0.04, 1.02), (0.36, 0.86), 0.065); limb("armF2", (0.36, 0.86), (0.52, 1.08), 0.06)
    limb("armB1", (0.0, 1.0), (-0.3, 0.88), 0.065); limb("armB2", (-0.3, 0.88), (-0.48, 0.66), 0.06)
    limb("legF1", (-0.06, 0.6), (0.28, 0.42), 0.08); limb("legF2", (0.28, 0.42), (0.3, 0.12), 0.075)
    limb("legB1", (-0.1, 0.6), (-0.3, 0.36), 0.08); limb("legB2", (-0.3, 0.36), (-0.6, 0.26), 0.075)
    return dict(tilt=1.45, dist=4.4, target=(0, 0, 0.8))

@icon("info")
def _(m):
    cyl("disc", 0, 0, 0, 0.18, 0.9, mat("igBlue", "#1840b0", rough=0.15, coat=1), verts=64, bevel=0.05)
    cyl("face", 0, 0, 0.18, 0.2, 0.68, m["white"], verts=64)
    cyl("ring", 0, 0, 0.2, 0.22, 0.5, m["red"], verts=64)
    cyl("hole", 0, 0, 0.22, 0.225, 0.4, m["white"], verts=64)
    sphere("dot", 0, 0.2, 0.3, 0.08, m["red"])
    box("stem", -0.065, 0.065, -0.28, 0.08, 0.22, 0.3, m["red"], bevel=0.02)
    return dict(tilt=0.25, dist=3.3, target=(0, 0, 0.1))

@icon("users")
def _(m):
    figure("a", m, "#d02a2a", x=-0.38, y=0.1, s=0.95); figure("b", m, "#2a5ad0", x=0.36, y=-0.1, s=1.05)
    return dict(tilt=1.25, dist=4.6, target=(0, 0, 0.6))

@icon("globe")
def _(m):
    sphere("earth", 0, 0, 0.75, 0.62, image("earth", T("globe_map.png"), rough=0.25, spec=0.6)).rotation_euler = (0.4, 0, 2.2)
    torus("mer", 0, 0, 0.75, 0.7, 0.03, m["gold"], rot=(PI / 2, 0, 0.5))
    cyl("stem", 0, 0, 0.04, 0.12, 0.1, m["gold"]); cyl("foot", 0, 0, 0, 0.05, 0.4, m["gold"])
    return dict(tilt=1.25, dist=4.2, target=(0, 0, 0.7))

@icon("task")
def _(m):
    box("board", -0.6, 0.6, -0.8, 0.8, 0, 0.06, mat("masonite", "#9a6a3a", rough=0.6), bevel=0.02)
    box("paper", -0.5, 0.5, -0.7, 0.6, 0.06, 0.08, m["white"], bevel=0)
    box("clip", -0.25, 0.25, 0.55, 0.78, 0.06, 0.16, m["chrome"], bevel=0.02)
    for i in range(4):
        y = 0.35 - i * 0.28
        box(f"chk{i}", -0.4, -0.25, y - 0.07, y + 0.07, 0.08, 0.09, mat("chkB", "#2a2a2a", rough=0.5), bevel=0)
        box(f"line{i}", -0.15, 0.38, y - 0.025, y + 0.025, 0.08, 0.09, mat("ink", "#3a3a3a", rough=0.6), bevel=0)
        if i < 2: box(f"tick{i}", -0.38, -0.27, y - 0.04, y + 0.04, 0.09, 0.1, m["red"], bevel=0)
    return dict(tilt=0.6, dist=4.2)

@icon("voice")
def _(m):
    sphere("head", 0, 0, 1.1, 0.32, mat("mesh", "#9a9aa2", rough=0.5, metal=0.8), scale=(1, 1, 1.25))
    cyl("neck", 0, 0, 0.3, 0.75, 0.07, m["chrome"]); cyl("foot", 0, 0, 0, 0.08, 0.45, m["blk"])
    torus("band", 0, 0, 1.0, 0.33, 0.03, m["chrome"])
    return dict(tilt=1.3, dist=4.4, target=(0, 0, 0.7))

@icon("power")
def _(m):
    box("plate", -0.5, 0.5, -0.1, 0.0, 0, 1.4, m["white"], bevel=0.05, segs=3)
    box("slot", -0.12, 0.12, -0.11, -0.09, 0.5, 0.9, mat("slotD", "#5a5a5a", rough=0.5), bevel=0)
    box("toggle", -0.09, 0.09, -0.3, -0.08, 0.72, 0.88, m["white"], bevel=0.03)
    for z in (0.15, 1.25): cyl(f"screw{z}", 0, -0.11, z - 0.05, z + 0.05, 0.05, m["chrome"], rot=(PI / 2, 0, 0))
    return dict(tilt=1.35, dist=4.0, target=(0, 0, 0.7))

for k, f in ICONS.items():
    if only and k not in only: continue
    reset(); lib._mats.clear()
    m = M_()
    opts = f(m) or {}
    setup(**opts)
    shoot(k)
print("icons done")

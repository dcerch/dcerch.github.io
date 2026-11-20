# KidSpace — pre-rendered backdrops for the kids' room (Moon base, Mars, Jungle treehouse, Beach treehouse).
# Like the rest of Navigator, the room is a still render and the interactive bits (programs, drawers, the
# guide Pip, the help box…) are sprites drawn on top by js/nav2d/kidspace.js. Furniture is placed by
# casting rays through the sprites' existing stage coordinates, so everything lines up. Original scene.
#   blender -b --factory-startup -P rooms/kidspace.py [-- --fast] [-- space0 tree1 …]
import sys, os, math, random
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from common import *
import lib

W, H = 800, 600
args = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
VARIANTS = [v for v in ("space0", "space1", "tree0", "tree1") if not [a for a in args if not a.startswith("--")] or v in args]
S = lambda px, py, axis, val: screen_to_world(px, py, W, H, axis, val)

def stripes(name, a="#5a5ad0", b="#202024", scale=9.0):
    """Hazard stripes for the play mat."""
    m, nt, bs = lib._new(name); N = nt.nodes; L = nt.links
    tc = N.new("ShaderNodeTexCoord"); wv = N.new("ShaderNodeTexWave"); wv.wave_type = "BANDS"; wv.bands_direction = "DIAGONAL"
    wv.inputs["Scale"].default_value = scale; wv.wave_profile = "SAW"
    L.new(tc.outputs["Object"], wv.inputs["Vector"])
    r = N.new("ShaderNodeValToRGB"); r.color_ramp.interpolation = "CONSTANT"; e = r.color_ramp.elements
    e[0].position = 0.0; e[0].color = hexrgb(b); e[1].position = 0.5; e[1].color = hexrgb(a)
    L.new(wv.outputs["Fac"], r.inputs["Fac"]); L.new(r.outputs["Color"], bs.inputs["Base Color"])
    lib._set(bs, "Roughness", 0.35); lib._set(bs, ["Coat Weight", "Clearcoat"], 0.5)
    return m

def stars_world(strength=1.0, base="#02020c"):
    w = bpy.data.worlds.new("stars"); bpy.context.scene.world = w; w.use_nodes = True
    N = w.node_tree.nodes; L = w.node_tree.links; bg = N.get("Background")
    tc = N.new("ShaderNodeTexCoord"); vo = N.new("ShaderNodeTexVoronoi"); vo.inputs["Scale"].default_value = 260
    L.new(tc.outputs["Generated"], vo.inputs["Vector"])
    r = N.new("ShaderNodeValToRGB"); e = r.color_ramp.elements; e[0].position = 0.0; e[0].color = (1, 1, 1, 1); e[1].position = 0.035; e[1].color = hexrgb(base)
    L.new(vo.outputs["Distance"], r.inputs["Fac"]); L.new(r.outputs["Color"], bg.inputs["Color"]); bg.inputs["Strength"].default_value = strength

def bumpy(name, color, dark, scale=1.5, strength=0.6, rough=0.9):
    m, nt, bs = lib._new(name); N = nt.nodes; L = nt.links
    tc = N.new("ShaderNodeTexCoord"); nz = N.new("ShaderNodeTexNoise"); nz.inputs["Scale"].default_value = scale; nz.inputs["Detail"].default_value = 8
    L.new(tc.outputs["Object"], nz.inputs["Vector"])
    r = N.new("ShaderNodeValToRGB"); e = r.color_ramp.elements; e[0].color = hexrgb(dark); e[1].color = hexrgb(color)
    L.new(nz.outputs["Fac"], r.inputs["Fac"]); L.new(r.outputs["Color"], bs.inputs["Base Color"])
    bp = N.new("ShaderNodeBump"); bp.inputs["Strength"].default_value = strength; L.new(nz.outputs["Fac"], bp.inputs["Height"]); L.new(bp.outputs["Normal"], bs.inputs["Normal"])
    lib._set(bs, "Roughness", rough)
    return m

def terrain(name, z, y0, material, size=160, amp=1.4, scale=0.08, seed=0):
    """A big displaced ground plane starting at y0, sinking to z."""
    bpy.ops.mesh.primitive_grid_add(x_subdivisions=160, y_subdivisions=120, size=1, location=(0, y0 + size / 2, z))
    o = bpy.context.active_object; o.scale = (size * 1.6, size, 1); o.name = name
    tx = bpy.data.textures.new(name + "Tex", "CLOUDS"); tx.noise_scale = 1 / scale / 10; tx.noise_depth = 3
    md = o.modifiers.new("disp", "DISPLACE"); md.texture = tx; md.strength = amp; md.texture_coords = "GLOBAL"
    o.data.materials.append(material)
    for p in o.data.polygons: p.use_smooth = True
    return o

def crater(name, x, y, z, r, material):
    return [torus(name + "Rim", x, y, z, r, r * 0.18, material), cyl(name + "Pit", x, y, z - 0.25 * r, z - 0.05 * r, r * 0.95, bumpy(name + "PitM", "#6a6a74", "#3a3a44", 4, 0.3))]

def build(theme, view):
    reset(); lib._mats.clear()
    m = M()
    camera((0.0, -5.2, 1.45), (0.0, 0.0, 1.32), lens=24, shift_y=0.0)
    space = theme == "space"
    # where things sit: the back edge of the deck lines up with the SVG's railing (y 412)
    yBack = S(400, 412, "z", 0.0).y
    deckM = bumpy("deck", "#8a8a9e", "#5a5a6e", 6, 0.15, 0.4) if space else image("planks", T("floor_maple.png"), rough=0.35, spec=0.4, world_scale=0.5)
    box("deck", -12, 12, -6, yBack, -0.1, 0, deckM, bevel=0)
    if space:
        for i in range(-24, 25):
            box(f"seam{i}", i * 0.5 - 0.01, i * 0.5 + 0.01, -6, yBack, 0, 0.002, mat("seam", "#3a3a4a", rough=0.6), bevel=0)
    # railing / low parapet at the back edge (SVG band 400-412)
    zPar = S(400, 400, "y", yBack).z
    box("parapet", -12, 12, yBack, yBack + 0.25, -0.1, zPar, mat("parapet", "#8a8a9a", rough=0.35, metal=0.5) if space else m["walnut"], bevel=0.02)
    # pillars at the SVG's x = 170, 390, 650 (30 px wide), standing on the deck at y ~450, rising into the ceiling rail (y ~130)
    yP = S(400, 452, "z", 0.0).y
    zRail = S(400, 131, "y", yP).z
    for i, px in enumerate((185, 405, 665)):
        xc = S(px, 452, "z", 0.0).x; hw = (S(px + 15, 452, "z", 0.0).x - xc)
        if space:
            cyl(f"pillar{i}", xc, yP, 0, zRail, hw, mat("plasma", "#3a8ae8", rough=0.1, emit="#2a7ae8", emit_str=0.6, coat=1))
            cyl(f"pillarCore{i}", xc, yP - hw * 0.4, 0, zRail, hw * 0.25, mat("core", "#cfefff", emit="#bfe8ff", emit_str=3))
            cyl(f"pillarFoot{i}", xc, yP, 0, 0.12, hw * 1.6, mat("foot", "#5a1a2a", rough=0.4, metal=0.4), bevel=0.02)
        else:
            cyl(f"post{i}", xc, yP, 0, zRail, hw * 0.9, image("bark", T("wicker.png"), rough=0.9), verts=12)
    if space:
        r = cyl("rail", 0, yP, zRail - 0.12, zRail + 0.12, 0.12, mat("plasma", "#3a8ae8", rough=0.1, emit="#2a7ae8", emit_str=0.6, coat=1), rot=(0, PI / 2, 0)); r.scale = (1, 1, 100)
        box("girder", -12, 12, yP - 0.1, yP + 0.1, zRail - 0.3, zRail - 0.18, mat("girder", "#9a9aaa", rough=0.3, metal=0.7), bevel=0.01)
        for i in range(-30, 31): cyl(f"rivet{i}", i * 0.2, yP - 0.105, zRail - 0.25, zRail - 0.23, 0.012, m["chrome"], rot=(PI / 2, 0, 0))
        box("roof", -12, 12, -6, yP + 0.2, zRail + 0.4, zRail + 0.5, mat("roofDark", "#0a0a1a", rough=0.6), bevel=0)
    else:
        box("beam", -12, 12, yP - 0.14, yP + 0.14, zRail - 0.15, zRail + 0.15, m["walnut"], bevel=0.03)
        me = bpy.data.meshes.new("thatch"); me.from_pydata([(-12, -6, zRail + 0.9), (12, -6, zRail + 0.9), (12, yP + 1.5, zRail - 0.25), (-12, yP + 1.5, zRail - 0.25)], [], [(0, 1, 2, 3)])
        th = lib._obj("thatch", me, bumpy("thatchM", "#b89848", "#6a5020", 40, 0.8, 0.95))
    # ---------------------------------------------------------------- the bookcase (SVG x 120-290, top 238)
    yB = S(200, 650, "z", 0.0).y
    bl, br = S(120, 400, "y", yB).x, S(280, 400, "y", yB).x
    zt = S(200, 238, "y", yB).z
    bcol = ["#9a8ad8", "#6a5aa8", "#4a3a88"] if space else ["#b88a54", "#8a5a2a", "#5a3a18"]
    bm = mat("bc0", bcol[0], rough=0.3, coat=0.6); bmi = mat("bc2", bcol[2], rough=0.6)
    box("bcBody", bl, br, yB, yB + 0.35, 0, zt, bm, bevel=0.02)
    xi0, xi1 = S(132, 400, "y", yB).x, S(268, 400, "y", yB).x
    zi0, zi1 = S(200, 482, "y", yB).z, S(200, 252, "y", yB).z
    box("bcInside", xi0, xi1, yB - 0.01, yB + 0.3, zi0, zi1, bmi, bevel=0)
    for sy in (322, 400, 478):
        z = S(200, sy, "y", yB).z
        box(f"bcShelf{sy}", xi0, xi1, yB - 0.02, yB + 0.3, z - 0.035, z, bm, bevel=0.005)
    zd0, zd1 = S(200, 590, "y", yB).z, S(200, 490, "y", yB).z
    xm = (xi0 + xi1) / 2
    for i, (a, b) in enumerate(((xi0, xm - 0.02), (xm + 0.02, xi1))):
        box(f"bcDoor{i}", a, b, yB - 0.03, yB, zd0, zd1, bm, bevel=0.01)
        box(f"bcPanel{i}", a + 0.05, b - 0.05, yB - 0.035, yB - 0.03, zd0 + 0.05, zd1 - 0.05, bmi, bevel=0)
        sphere(f"bcKnob{i}", (b - 0.06) if i == 0 else (a + 0.06), yB - 0.05, (zd0 + zd1) / 2, 0.025, m["gold"])
    point("bcLamp", ((xi0 + xi1) / 2, yB + 0.1, zi1 - 0.1), 6, "#fff0d0", radius=0.03)
    # ---------------------------------------------------------------- the dresser (SVG x 706-800, top 196): body + five drawer fronts
    yD = S(750, 680, "z", 0.0).y
    dl = S(706, 400, "y", yD).x; ztD = S(750, 196, "y", yD).z
    dcol = ["#c8c8d0", "#7a7a88", "#3a3a48", "#1a1a24"] if space else ["#c86a4a", "#8a3a20", "#5a2010", "#3a1408"]
    dm = mat("dr0", dcol[0], rough=0.25, metal=0.5 if space else 0.0, coat=0.5)
    box("drBody", dl, dl + 3.0, yD, yD + 0.22, 0, ztD, dm, bevel=0.02)
    for i in range(5):
        y0 = 206 + i * 56
        a, b = S(714, y0 + 46, "y", yD), S(800, y0, "y", yD)
        box(f"drFront{i}", a.x, b.x + 0.4, yD - 0.04, yD, a.z, b.z, mat("dr2", dcol[2], rough=0.35, coat=0.4), bevel=0.012)
        box(f"drPull{i}", a.x + 0.06, a.x + 0.09, yD - 0.08, yD - 0.04, (a.z + b.z) / 2 - 0.06, (a.z + b.z) / 2 + 0.06, m["chrome"], bevel=0.005)
    a, b = S(714, 562, "y", yD), S(800, 490, "y", yD)
    box("drCubby", a.x, b.x + 0.4, yD - 0.02, yD, a.z, b.z, mat("dr3", dcol[3], rough=0.5), bevel=0.01)
    # ---------------------------------------------------------------- the desk (SVG trapezoid 230-640 @476, 170-700 @560)
    zD = 0.72
    c = [S(170, 560, "z", zD), S(700, 560, "z", zD), S(640, 476, "z", zD), S(230, 476, "z", zD)]
    me = bpy.data.meshes.new("deskTop"); me.from_pydata([tuple(v) for v in c], [], [(0, 1, 2, 3)])
    o = lib._obj("deskTop", me, mat("deskTopM", "#3a3a44" if space else "#7a5430", rough=0.3, coat=0.5))
    md = o.modifiers.new("solid", "SOLIDIFY"); md.thickness = 0.06; md.offset = -1
    front = [S(170, 578, "y", c[0].y), S(700, 578, "y", c[0].y)]
    box("deskApron", c[0].x, c[1].x, c[0].y - 0.02, c[0].y + 0.04, front[0].z, zD - 0.06, mat("apron", "#22222a" if space else "#4a3018", rough=0.4), bevel=0.01)
    for i, px in enumerate((203, 667)):
        lx = S(px, 590, "y", c[0].y).x
        box(f"deskLeg{i}", lx - 0.06, lx + 0.06, c[0].y, c[0].y + 0.12, 0, front[0].z, m["blk"], bevel=0.01)
    mc = [S(300, 486, "z", zD + 0.005), S(560, 486, "z", zD + 0.005), S(596, 548, "z", zD + 0.005), S(262, 548, "z", zD + 0.005)]
    me = bpy.data.meshes.new("mat"); me.from_pydata([tuple(mc[3]), tuple(mc[2]), tuple(mc[1]), tuple(mc[0])], [], [(0, 1, 2, 3)])
    lib._obj("playMat", me, stripes("hazard", "#5a5ad0" if space else "#e8b020", "#202024"))
    ic = [S(318, 494, "z", zD + 0.008), S(544, 494, "z", zD + 0.008), S(572, 540, "z", zD + 0.008), S(288, 540, "z", zD + 0.008)]
    me = bpy.data.meshes.new("matIn"); me.from_pydata([tuple(ic[3]), tuple(ic[2]), tuple(ic[1]), tuple(ic[0])], [], [(0, 1, 2, 3)])
    lib._obj("playMatIn", me, mat("matIn", "#5a5a66" if space else "#b88a54", rough=0.5))
    # ---------------------------------------------------------------- outside
    far = yBack + 0.3
    if space and view == 0:
        stars_world(1.0)
        moon = bumpy("moon", "#c8c8cc", "#7a7a84", 0.6, 0.8, 0.95)
        terrain("moonGround", -2.5, far, moon, amp=3.5, scale=0.05)
        for i, (sx, sy, r) in enumerate(((120, 345, 26), (330, 360, 18), (610, 350, 30))):
            p = S(sx, sy, "z", -1.6); crater(f"crater{i}", p.x, p.y, -1.6, r * 0.05, moon)
        e = S(560, 230, "y", 120)
        sphere("earth", e.x, 120, e.z, 6.5, image("earthM", T("globe_map.png"), rough=0.4, emit=0.9)).rotation_euler = (0.4, 0, 1.2)
        sun("sun", (0.6, 0.5, -0.45), energy=4.5, color="#ffffff", angle=0.3)
    elif space:
        world("#c88a5a", 0.6)
        mars = bumpy("mars", "#c8602a", "#7a2a10", 0.5, 0.8, 0.95)
        terrain("marsGround", -2.5, far, mars, amp=4.5, scale=0.04)
        hab = S(505, 318, "z", -1.0)
        sphere("dome", hab.x, hab.y, -1.0, 1.6, mat("domeM", "#e8e8f0", rough=0.3, coat=1), scale=(1, 1, 0.6))
        box("habBox", hab.x - 1.4, hab.x + 1.4, hab.y - 0.8, hab.y + 0.8, -1.4, -0.4, mat("habB", "#d8d8e0", rough=0.4))
        cyl("mast", hab.x + 1.2, hab.y, -0.4, 2.0, 0.05, m["chrome"]); box("flag", hab.x + 1.25, hab.x + 2.0, hab.y - 0.02, hab.y + 0.02, 1.4, 1.9, mat("flagR", "#c83a2a", rough=0.5), bevel=0)
        sun("sun", (0.5, 0.6, -0.5), energy=4.0, color="#ffe8c8", angle=0.6)
    elif view == 0:
        world("#cfe8b0", 0.8)
        terrain("jungleGround", -1.5, far, grass("jg", "#4a9a3a", "#1f5a20"), amp=1.0, scale=0.1)
        rr = random.Random(4)
        for i in range(26):
            x = rr.uniform(-14, 14); y = far + rr.uniform(1.5, 14)
            tree(f"jt{i}", x, y, rr.uniform(1.0, 2.0), seed=40 + i, kind=rr.choice(("round", "round", "tall")))
        sun("sun", (0.4, 0.6, -0.6), energy=4.0, color="#fff4d8", angle=0.8)
    else:
        world("#9ad0f8", 0.9)
        box("sand", -60, 60, far, far + 34, -1.6, -1.2, bumpy("sandM", "#f0d898", "#d8b870", 3, 0.2, 0.9), bevel=0)
        box("sea", -400, 400, far + 34, far + 600, -1.6, -1.45, mat("seaM", "#0a5ab0", rough=0.35, spec=0.25), bevel=0)
        p = S(585, 352, "z", -1.2)
        cyl("palmTrunk", p.x, p.y + 2, -1.2, 3.2, 0.14, mat("palmBark", "#8a5a2a", rough=0.8), verts=12).rotation_euler = (0, 0.25, 0)
        for i in range(7):
            a = i / 7 * 2 * PI
            lf = sphere(f"frond{i}", p.x + 1.1 + 1.0 * math.cos(a), p.y + 2 + 1.0 * math.sin(a), 3.0 - 0.15 * abs(math.sin(a)), 0.9, mat("frondG", "#2f8a2a", rough=0.5), scale=(1.4, 0.35, 0.12))
            lf.rotation_euler = (0, 0.35, a)
        b = S(470, 312, "z", -1.45)
        box("boatHull", b.x - 0.8, b.x + 0.8, b.y - 0.3, b.y + 0.3, -1.55, -1.25, mat("hullR", "#c83a2a", rough=0.4), bevel=0.06)
        me = bpy.data.meshes.new("sail"); me.from_pydata([(b.x, b.y, -1.25), (b.x + 0.9, b.y, -1.25), (b.x, b.y, 0.4)], [], [(0, 1, 2)]); lib._obj("sail", me, mat("sailW", "#ffffff", rough=0.6))
        sun("sun", (-0.3, 0.7, -0.6), energy=4.5, color="#fff4d8", angle=0.6)
    # interior light: the room is lit warm, the sky stays cool
    area("roomKey", (-2.0, -3.5, 3.4), 2.0, 520 if space else 420, "#fff0dc", target=(0, 1.5, 0.6))["soft"] = 1
    area("roomFill", (2.5, -3.0, 2.0), 3.0, 160, "#e8f0ff" if space else "#fff4e0", target=(0, 1.5, 0.8))["soft"] = 1
    spot("deskSpot", (0.2, -1.0, 3.2), (0.2, c[0].y + 0.5, zD), 220, "#fff4e0", angle=55, blend=0.5)

for v in VARIANTS:
    build(v[:-1], int(v[-1]))
    render("kid_" + v, W, H, samples=96, exposure=-0.35, hots=False)
print("kidspace done")

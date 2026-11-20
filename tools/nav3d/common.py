# Reusable furniture for the Navigator rooms (imported by rooms/*.py after lib).
import math, os, random
from lib import *

PI = math.pi
T = lambda n: os.path.join(TEX, n)

def M():
    """The shared palette (call after reset())."""
    return dict(
        cherry=wood("cherry", "#9a2a12", "#4a0c04", scale=5, rough=0.22, coat=0.7, axis="X"),
        cherryV=wood("cherryV", "#9a2a12", "#4a0c04", scale=5, rough=0.22, coat=0.7, axis="Z"),
        oak=wood("oak", "#c8904a", "#7a4a1a", scale=4, rough=0.3, coat=0.5, axis="X"),
        walnut=wood("walnut", "#5a3418", "#24120a", scale=5, rough=0.25, coat=0.6, axis="X"),
        blk=mat("black", "#141416", rough=0.3, spec=0.5), blkm=mat("blackMatte", "#1c1c20", rough=0.7),
        glass=mat("glass", "#dff0ff", rough=0.02, glass=1.0, spec=0.5), gold=mat("gold", "#c9a54a", rough=0.25, metal=1.0),
        chrome=mat("chrome", "#d8d8dc", rough=0.12, metal=1.0), beige=mat("beige", "#e2d8c0", rough=0.45), cream=mat("cream", "#f4eedc", rough=0.5),
        white=mat("whiteGloss", "#f4f2ee", rough=0.3), void=mat("void", "#000000", alpha=0.0),
        glow=mat("white", "#ffffff", emit="#ffffff", emit_str=2),
    )

def speaker(name, x, y, h, m, w=0.4, d=0.35):
    parts = [box(name, x - w / 2, x + w / 2, y, y + d, 0, h, m["blkm"], bevel=0.015)]
    for j, (z, r) in enumerate(((h * 0.74, w * 0.22), (h * 0.4, w * 0.34))):
        parts.append(cyl(f"{name}c{j}", x, y - 0.01, z - 0.01, z + 0.01, r, mat("cone", "#2a2a2e", rough=0.6), rot=(PI / 2, 0, 0)))
        parts.append(torus(f"{name}r{j}", x, y - 0.015, z, r, 0.012, m["chrome"], rot=(PI / 2, 0, 0)))
    return parts

def tvset(name, x0, x1, z0, z1, y, m, anchor="tvScreen", body="black"):
    b = box(name, x0, x1, y, y + 0.4, z0, z1, m["blk"] if body == "black" else mat("tvBody", body, rough=0.4), bevel=0.03)
    pad = (x1 - x0) * 0.07
    s = wallquad(name + "Scr", x0 + pad, x1 - pad * 1.7, z0 + pad, z1 - pad, y - 0.002, image("tvImg", T("tv.png"), rough=0.05, spec=0.8), anchor=anchor)
    btn = [cyl(f"{name}b{i}", x1 - pad * 0.85, y - 0.005, z1 - pad * 2 - i * 0.1 - 0.005, z1 - pad * 2 - i * 0.1 + 0.005, 0.016, m["chrome"], rot=(PI / 2, 0, 0)) for i in range(3)]
    return [b, s, *btn]

def stereo(name, x0, x1, z, y, m, units=3, uh=0.2):
    parts = []
    for i in range(units):
        a, b = z + i * (uh + 0.03), z + i * (uh + 0.03) + uh
        parts.append(box(f"{name}{i}", x0, x1, y, y + 0.35, a, b, m["blk"], bevel=0.01))
        parts.append(wallquad(f"{name}f{i}", x0 + 0.02, x1 - 0.02, a + 0.02, b - 0.02, y - 0.002, image("stereoImg", T("stereo.png"), rough=0.25, emit=0.25)))
    return parts

def fax(name, x, y, z, m):
    return [box(name, x, x + 0.55, y, y + 0.4, z, z + 0.12, m["beige"], bevel=0.02),
            box(name + "P", x + 0.03, x + 0.52, y - 0.01, y + 0.1, z + 0.12, z + 0.13, mat("faxPanel", "#3a3a40", rough=0.4), bevel=0),
            box(name + "T", x + 0.1, x + 0.45, y + 0.3, y + 0.53, z + 0.12, z + 0.2, m["cream"], bevel=0.005),
            quad(name + "Pp", [(x + 0.13, y + 0.37, z + 0.2), (x + 0.42, y + 0.37, z + 0.2), (x + 0.42, y + 0.49, z + 0.36), (x + 0.13, y + 0.49, z + 0.36)], mat("paper", "#ffffff", rough=0.8))]

def phone(name, x, y, z, m, color="#2a2a30"):
    pm = mat("phone" + color, color, rough=0.35)
    p = [box(name, x, x + 0.37, y, y + 0.3, z, z + 0.07, pm, bevel=0.02), box(name + "H", x + 0.01, x + 0.36, y + 0.22, y + 0.3, z + 0.07, z + 0.12, pm, bevel=0.02)]
    for i in range(12):
        p.append(box(f"{name}k{i}", x + 0.07 + (i % 3) * 0.07, x + 0.12 + (i % 3) * 0.07, y + 0.02 + (i // 3) * 0.045, y + 0.055 + (i // 3) * 0.045, z + 0.07, z + 0.08, mat("key", "#d8d8d8", rough=0.4), bevel=0))
    return p

def remote(name, x, y, z, m):
    p = [box(name, x, x + 0.12, y, y + 0.35, z, z + 0.03, m["blk"], bevel=0.01)]
    for i in range(4): p.append(box(f"{name}b{i}", x + 0.03, x + 0.09, y + 0.05 + i * 0.07, y + 0.08 + i * 0.07, z + 0.03, z + 0.036, mat("rbtn" + str(i), ["#c82a2a", "#2a8a2a", "#d8d8d8", "#d8d8d8"][i], rough=0.4), bevel=0))
    return p

def laptop(name, x, y, z, m, label="TASK", screen="#1a5ab8"):
    lm = mat("lap", "#3a3a40", rough=0.4)
    return [box(name, x, x + 0.33, y, y + 0.27, z, z + 0.025, lm, bevel=0.006),
            quad(name + "L", [(x - 0.01, y + 0.28, z + 0.02), (x + 0.34, y + 0.28, z + 0.02), (x + 0.34, y + 0.335, z + 0.275), (x - 0.01, y + 0.335, z + 0.275)], lm),
            quad(name + "S", [(x + 0.01, y + 0.275, z + 0.035), (x + 0.32, y + 0.275, z + 0.035), (x + 0.32, y + 0.328, z + 0.26), (x + 0.01, y + 0.328, z + 0.26)], mat("lapScreen" + screen, screen, rough=0.2, emit=screen, emit_str=0.9)),
            text(name + "T", label, x + 0.165, y + 0.295, z + 0.15, size=0.065, material=m["glow"], rot=(PI / 2 - 0.21, 0, 0))]

def regbox(name, x0, x1, y0, y1, h, m):
    b = box(name, x0, x1, y0, y1, 0, h, image("regFront", T("register.png"), rough=0.7), bevel=0.01)
    box(name + "Tape", x0, x1, (y0 + y1) / 2 - 0.035, (y0 + y1) / 2 + 0.035, h, h + 0.005, mat("tape", "#c8b88a", rough=0.5), bevel=0)
    return [b]

def softbox(name, x0, x1, z0, z1, y, art, d=0.12):
    """A software box standing on a shelf, cover art on the front."""
    return box(name, x0, x1, y, y + d, z0, z1, [image("box_" + art, T(art + ".png"), rough=0.35, spec=0.5)], bevel=0.006)

def books(name, x0, x1, z0, z1, y, tex="books_mixed.png", d=0.22):
    return box(name, x0, x1, y, y + d, z0, z1, image("bk_" + tex, T(tex), rough=0.6), bevel=0)

def plant(name, x, y, s=1.0, seed=3):
    rr = random.Random(seed); parts = [cyl(name + "Pot", x, y, 0, 0.42 * s, 0.2 * s, mat("pot", "#c06a3a", rough=0.5)), cyl(name + "Trunk", x, y, 0.4 * s, 1.5 * s, 0.025, mat("bark", "#5a3a1a", rough=0.8))]
    for i in range(46):
        a = rr.uniform(0, 2 * PI); h = rr.uniform(0.9, 1.95) * s; rad = rr.uniform(0.05, 0.38) * (1.2 - abs(h / s - 1.45)) * s
        lf = sphere(f"{name}L{i}", x + rad * math.cos(a), y + rad * math.sin(a), h, 0.09 * s, mat("leaf" + str(i % 3), ["#2a6a1a", "#3a8a2a", "#1a5a14"][i % 3], rough=0.45, coat=0.3), scale=(1.0, 0.35, 0.55))
        lf.rotation_euler = (rr.uniform(-0.6, 0.6), rr.uniform(-0.6, 0.6), a); parts.append(lf)
    return parts

def cat(name, x, y, color="#e0802e", stripe="#9e4a12", heading=0.0):
    """A sleeping loaf of a cat on the floor."""
    fur = mat("fur" + color, color, rough=0.85); dk = mat("fur" + stripe, stripe, rough=0.85)
    ca, sa = math.cos(heading), math.sin(heading)
    at = lambda dx, dy: (x + dx * ca - dy * sa, y + dx * sa + dy * ca)
    parts = [sphere(name + "Body", *at(0, 0), 0.11, 0.2, fur, scale=(1.0, 0.62, 0.55))]
    hx, hy = at(-0.2, -0.04); parts.append(sphere(name + "Head", hx, hy, 0.12, 0.085, fur))
    for k in (-1, 1):
        ex, ey = at(-0.22, -0.04 + k * 0.05); parts.append(cone(name + "Ear" + str(k), ex, ey, 0.17, 0.23, 0.035, 0.0, fur, verts=12))
    tx, ty = at(0.12, 0.12); parts.append(torus(name + "Tail", tx, ty, 0.04, 0.12, 0.03, fur, rot=(0, 0, heading)))
    for i in range(4):
        sx, sy = at(-0.08 + i * 0.07, 0); s = sphere(f"{name}S{i}", sx, sy, 0.205, 0.05, dk, scale=(0.35, 1.6, 0.25)); s.rotation_euler = (0, 0, heading); parts.append(s)
    return parts

def chair(name, x, y, m, cushion="#a81c1c", facing=0):
    red = mat("upholstery" + cushion, cushion, rough=0.75)
    parts = [box(name + "Seat", x - 0.4, x + 0.4, y, y + 0.7, 0.42, 0.52, red, bevel=0.03)]
    for lx in (x - 0.38, x + 0.32):
        for ly in (y + 0.02, y + 0.62): parts.append(box(f"{name}l{lx}{ly}", lx, lx + 0.06, ly, ly + 0.06, 0, 0.42, m["cherry"]))
    side = -1 if x > 0 else 1
    ax = x - 0.42 if side < 0 else x + 0.36
    parts += [box(name + "Arm", ax, ax + 0.06, y, y + 0.7, 0.42, 0.72, m["cherry"]), box(name + "ArmT", ax - 0.02, ax + 0.08, y - 0.02, y + 0.72, 0.72, 0.76, m["cherry"])]
    return parts

def frame(name, x0, x1, z0, z1, y, art, m, rim="gold", anchor=None):
    """A framed picture on a back wall facing -Y; art is a texture file (or None for a blank, anchor-only picture)."""
    f = box(name, x0, x1, y - 0.05, y, z0, z1, m[rim] if isinstance(rim, str) else rim, bevel=0.012)
    pad = min(x1 - x0, z1 - z0) * 0.08
    pic = wallquad(name + "Pic", x0 + pad, x1 - pad, z0 + pad, z1 - pad, y - 0.052, image("art_" + art, T(art), rough=0.4) if art else mat("blankPic", "#2a2f9e", rough=0.4), anchor=anchor)
    return [f, pic]

def ceiling_cans(xs, y, H, n=0):
    return [cyl(f"can{n}{i}", x, y, H - 0.01, H, 0.1, mat("can", "#fffaf0", emit="#fff4dc", emit_str=8)) for i, x in enumerate(xs)]

def opening_left(name, X0, ya, yb, H, wall, trim_m, hall_floor=None, depth=3.0, hall_wall=None, ceil_m=None):
    """Doorway in the left wall (x = X0) between ya and yb, with a short hall behind. Returns the clickable parts."""
    box(name + "A", X0 - 0.15, X0, -2, ya, 0, H, wall, bevel=0)
    box(name + "Head", X0 - 0.15, X0, ya, yb, 2.3, H, wall, bevel=0)
    fr = [box(name + "J1", X0 - 0.02, X0 + 0.06, ya - 0.08, ya + 0.02, 0, 2.38, trim_m), box(name + "J2", X0 - 0.02, X0 + 0.06, yb - 0.02, yb + 0.08, 0, 2.38, trim_m), box(name + "J3", X0 - 0.02, X0 + 0.06, ya - 0.08, yb + 0.08, 2.3, 2.38, trim_m)]
    if hall_floor: box(name + "F", X0 - depth, X0, ya, yb, -0.05, 0, hall_floor, bevel=0)
    hw = hall_wall or wall
    box(name + "SA", X0 - depth, X0, ya - 0.15, ya, 0, H, hw, bevel=0); box(name + "SB", X0 - depth, X0, yb, yb + 0.15, 0, H, hw, bevel=0)
    box(name + "End", X0 - depth - 0.1, X0 - depth, ya - 0.2, yb + 0.2, 0, H, hw, bevel=0)
    if ceil_m: box(name + "C", X0 - depth, X0, ya - 0.15, yb + 0.15, H, H + 0.05, ceil_m, bevel=0)
    hot = sidequad(name + "Hot", ya, yb, 0, 2.3, X0 + 0.01, mat("void", "#000000", alpha=0.0), facing=1)
    return fr + [hot]

def opening_right(name, X1, ya, yb, H, wall, trim_m, hall_floor=None, depth=3.0, hall_wall=None, ceil_m=None):
    box(name + "A", X1, X1 + 0.15, -2, ya, 0, H, wall, bevel=0)
    box(name + "Head", X1, X1 + 0.15, ya, yb, 2.3, H, wall, bevel=0)
    fr = [box(name + "J1", X1 - 0.06, X1 + 0.02, ya - 0.08, ya + 0.02, 0, 2.38, trim_m), box(name + "J2", X1 - 0.06, X1 + 0.02, yb - 0.02, yb + 0.08, 0, 2.38, trim_m), box(name + "J3", X1 - 0.06, X1 + 0.02, ya - 0.08, yb + 0.08, 2.3, 2.38, trim_m)]
    if hall_floor: box(name + "F", X1, X1 + depth, ya, yb, -0.05, 0, hall_floor, bevel=0)
    hw = hall_wall or wall
    box(name + "SA", X1, X1 + depth, ya - 0.15, ya, 0, H, hw, bevel=0); box(name + "SB", X1, X1 + depth, yb, yb + 0.15, 0, H, hw, bevel=0)
    box(name + "End", X1 + depth, X1 + depth + 0.1, ya - 0.2, yb + 0.2, 0, H, hw, bevel=0)
    if ceil_m: box(name + "C", X1, X1 + depth, ya - 0.15, yb + 0.15, H, H + 0.05, ceil_m, bevel=0)
    hot = sidequad(name + "Hot", ya, yb, 0, 2.3, X1 - 0.01, mat("void", "#000000", alpha=0.0), facing=-1)
    return fr + [hot]

# ------------------------------------------------------------------ 1995 raytrace kit: real exteriors, rotations, lounge chairs
from mathutils import Matrix, Vector as _V
from lib import _new, _set, _mats

def rotate_about(objs, pivot, angle):
    """Turn already-built objects about a vertical axis through pivot (x, y)."""
    R = Matrix.Rotation(angle, 4, "Z"); p = _V((pivot[0], pivot[1], 0))
    for o in objs:
        for oo in o if isinstance(o, (list, tuple)) else [o]:
            oo.location = p + R @ (oo.location - p)
            oo.rotation_euler.z += angle
    return objs

def water(name="water", color="#1f86d8"):
    """Glossy pool water with a rippled bump, so the sun throws sparkles like an old raytrace."""
    key = ("water", name, color)
    if key in _mats: return _mats[key]
    m, nt, b = _new(name); N = nt.nodes; L = nt.links
    _set(b, "Base Color", hexrgb(color)); _set(b, "Roughness", 0.04); _set(b, ["Specular IOR Level", "Specular"], 1.0)
    _set(b, ["Coat Weight", "Clearcoat"], 1.0)
    tc = N.new("ShaderNodeTexCoord"); nz = N.new("ShaderNodeTexNoise"); nz.inputs["Scale"].default_value = 3.5; nz.inputs["Detail"].default_value = 4
    L.new(tc.outputs["Object"], nz.inputs["Vector"])
    bp = N.new("ShaderNodeBump"); bp.inputs["Strength"].default_value = 0.25
    L.new(nz.outputs["Fac"], bp.inputs["Height"]); L.new(bp.outputs["Normal"], b.inputs["Normal"])
    _mats[key] = m
    return m

def grass(name="grass", base="#3c8a24", dark="#1f5a12", scale=14):
    key = ("grass", name, base, dark)
    if key in _mats: return _mats[key]
    m, nt, b = _new(name); N = nt.nodes; L = nt.links
    tc = N.new("ShaderNodeTexCoord"); nz = N.new("ShaderNodeTexNoise"); nz.inputs["Scale"].default_value = scale; nz.inputs["Detail"].default_value = 8
    L.new(tc.outputs["Object"], nz.inputs["Vector"])
    ramp = N.new("ShaderNodeValToRGB"); e = ramp.color_ramp.elements; e[0].color = hexrgb(dark); e[1].color = hexrgb(base); e[0].position = 0.3; e[1].position = 0.7
    L.new(nz.outputs["Fac"], ramp.inputs["Fac"]); L.new(ramp.outputs["Color"], b.inputs["Base Color"])
    _set(b, "Roughness", 0.85)
    _mats[key] = m
    return m

def tree(name, x, y, s=1.0, seed=1, kind="round", greens=("#2f7a1c", "#3f9a26", "#24601a", "#4aa82e")):
    """A chunky low-poly tree made of overlapping leaf balls (round), or a tall poplar (tall)."""
    rr = random.Random(seed)
    lm = [mat("treeLeaf" + g, g, rough=0.6) for g in greens]
    h = (2.6 if kind == "round" else 4.0) * s
    parts = [cone(name + "Trunk", x, y, 0, h * 0.75, 0.13 * s, 0.06 * s, mat("treeBark", "#4a3018", rough=0.9), verts=10)]
    n = 16 if kind == "round" else 12
    for i in range(n):
        if kind == "round":
            a = rr.uniform(0, 2 * PI); r = rr.uniform(0.2, 0.85) * s; z = h * 0.7 + rr.uniform(-0.45, 0.6) * s
            parts.append(sphere(f"{name}F{i}", x + r * math.cos(a), y + r * math.sin(a), z, rr.uniform(0.45, 0.75) * s, lm[i % len(lm)]))
        else:
            z = h * (0.3 + 0.7 * i / n); r = 0.55 * s * math.sin(PI * (0.15 + 0.85 * i / n))
            parts.append(sphere(f"{name}F{i}", x + rr.uniform(-0.1, 0.1) * s, y + rr.uniform(-0.1, 0.1) * s, z, r + 0.15 * s, lm[i % len(lm)], scale=(1, 1, 1.3)))
    for p in parts[1:]:
        md = p.modifiers.new("disp", "DISPLACE"); tx = bpy.data.textures.get("leafNoise") or bpy.data.textures.new("leafNoise", "CLOUDS")
        tx.noise_scale = 0.25; md.texture = tx; md.strength = 0.18 * s
    return parts

def hedge(name, x0, x1, y0, y1, h, color="#2a6a1a"):
    b = box(name, x0, x1, y0, y1, 0, h, mat("hedge" + color, color, rough=0.8), bevel=0.15, segs=3)
    sub = b.modifiers.new("sub", "SUBSURF"); sub.levels = 2
    md = b.modifiers.new("disp", "DISPLACE"); tx = bpy.data.textures.get("hedgeNoise") or bpy.data.textures.new("hedgeNoise", "CLOUDS")
    tx.noise_scale = 0.2; md.texture = tx; md.strength = 0.12
    return b

def lounge(name, x, y, m, angle=0.0, cushion="#b01818", frame=None):
    """A 1990s cherry-framed lounge chair with a deep red cushion, facing -Y before rotation."""
    fm = frame or m["cherry"]; cm = mat("cushion" + cushion, cushion, rough=0.7)
    p = [box(name + "Seat", x - 0.42, x + 0.42, y - 0.4, y + 0.4, 0.34, 0.5, cm, bevel=0.06, segs=3),
         box(name + "Back", x - 0.42, x + 0.42, y + 0.32, y + 0.48, 0.5, 1.02, cm, bevel=0.06, segs=3)]
    for sx in (-1, 1):
        ax = x + sx * 0.47
        p += [box(f"{name}Arm{sx}", ax - 0.05, ax + 0.05, y - 0.42, y + 0.46, 0.2, 0.7, fm, bevel=0.015),
              box(f"{name}ArmT{sx}", ax - 0.07, ax + 0.07, y - 0.46, y + 0.48, 0.7, 0.75, fm, bevel=0.015),
              box(f"{name}LegF{sx}", ax - 0.05, ax + 0.05, y - 0.42, y - 0.34, 0, 0.2, fm, bevel=0.01),
              box(f"{name}LegB{sx}", ax - 0.05, ax + 0.05, y + 0.38, y + 0.46, 0, 0.2, fm, bevel=0.01)]
    p.append(box(name + "Rail", x - 0.47, x + 0.47, y + 0.4, y + 0.48, 0.2, 0.34, fm, bevel=0.01))
    return rotate_about(p, (x, y), angle)

def track_light(name, x0, x1, y, z, n, m, aim_z=0.0, energy=60, color="#fff0d0", aim_dy=0.6):
    """A black ceiling rail with little can spots hanging off it, each a real spot light."""
    parts = [box(name + "Rail", x0, x1, y - 0.03, y + 0.03, z - 0.04, z, m["blk"], bevel=0.005)]
    for i in range(n):
        x = x0 + (x1 - x0) * (i + 0.5) / n
        parts.append(cyl(f"{name}C{i}", x, y, z - 0.22, z - 0.06, 0.055, m["blk"], verts=16, rot=(0.5, 0, 0)))
        spot(f"{name}S{i}", (x, y + 0.05, z - 0.2), (x, y + aim_dy * 3, aim_z), energy, color, angle=38, blend=0.25, radius=0.02)
    return parts

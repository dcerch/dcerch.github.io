# Blender helpers for the pre-rendered Navigator rooms (run inside Blender: blender -b -P room.py).
# Coordinates: X right, Y away from the camera, Z up. Units are metres.
# Every mesh can be tagged as a hotspot (obj["hot"] = key) or an anchor plane (obj["anchor"] = name);
# export() writes the projected polygons next to the render so the 2D Navigator can make them clickable.
import bpy, bmesh, math, json, os, sys
from mathutils import Vector
from bpy_extras.object_utils import world_to_camera_view

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "out")
TEX = os.path.join(HERE, "tex")
os.makedirs(OUT, exist_ok=True)

def reset():
    bpy.ops.wm.read_factory_settings(use_empty=True)

# ------------------------------------------------------------------ materials
def _set(node, names, value):
    for n in names if isinstance(names, (list, tuple)) else [names]:
        if n in node.inputs:
            node.inputs[n].default_value = value
            return True
    return False

def hexrgb(h, a=1.0):
    h = h.lstrip("#")
    srgb = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    lin = [c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4 for c in srgb]
    return (*lin, a)

_mats = {}
def _new(name):
    m = bpy.data.materials.new(name); m.use_nodes = True
    nt = m.node_tree; bsdf = nt.nodes.get("Principled BSDF")
    return m, nt, bsdf

def mat(name, color="#cccccc", rough=0.5, metal=0.0, spec=0.5, emit=None, emit_str=1.0, glass=0.0, coat=0.0, alpha=1.0):
    key = (name, color, rough, metal, spec, emit, emit_str, glass, coat, alpha)
    if key in _mats: return _mats[key]
    m, nt, b = _new(name)
    _set(b, "Base Color", hexrgb(color)); _set(b, "Roughness", rough); _set(b, "Metallic", metal)
    _set(b, ["Specular IOR Level", "Specular"], spec)
    if coat: _set(b, ["Coat Weight", "Clearcoat"], coat); _set(b, ["Coat Roughness", "Clearcoat Roughness"], 0.05)
    if emit: _set(b, ["Emission Color", "Emission"], hexrgb(emit)); _set(b, "Emission Strength", emit_str)
    if glass: _set(b, ["Transmission Weight", "Transmission"], glass); _set(b, "IOR", 1.45)
    if alpha < 1:
        _set(b, "Alpha", alpha)
        try: m.blend_method = "BLEND"
        except Exception: pass
    _mats[key] = m
    return m

def wood(name, base="#8a2a14", dark="#4a0e04", scale=6.0, rough=0.25, coat=0.6, axis="X", distort=6.0):
    """Procedural wood: wave bands distorted by noise, mixed between two colours, glossy clear coat.
    axis is the direction the grain runs along."""
    key = ("wood", name, base, dark, scale, rough, coat, axis)
    if key in _mats: return _mats[key]
    m, nt, b = _new(name)
    N = nt.nodes; L = nt.links
    tc = N.new("ShaderNodeTexCoord"); mp = N.new("ShaderNodeMapping")
    sx = {"X": (0.3, 3, 3), "Y": (3, 0.3, 3), "Z": (3, 3, 0.3)}[axis]
    mp.inputs["Scale"].default_value = tuple(v * scale for v in sx)
    L.new(tc.outputs["Object"], mp.inputs["Vector"])
    wave = N.new("ShaderNodeTexWave"); wave.wave_type = "RINGS"
    try: wave.rings_direction = {"X": "X", "Y": "Y", "Z": "Z"}[axis]
    except Exception: pass
    wave.inputs["Scale"].default_value = 0.6; wave.inputs["Distortion"].default_value = distort; wave.inputs["Detail"].default_value = 3
    L.new(mp.outputs["Vector"], wave.inputs["Vector"])
    noise = N.new("ShaderNodeTexNoise"); noise.inputs["Scale"].default_value = 30; noise.inputs["Detail"].default_value = 6
    L.new(mp.outputs["Vector"], noise.inputs["Vector"])
    mix = N.new("ShaderNodeMath"); mix.operation = "MULTIPLY_ADD"; mix.inputs[1].default_value = 0.85
    L.new(wave.outputs["Fac"], mix.inputs[0]); L.new(noise.outputs["Fac"], mix.inputs[2])
    ramp = N.new("ShaderNodeValToRGB")
    ramp.color_ramp.elements[0].color = hexrgb(dark); ramp.color_ramp.elements[1].color = hexrgb(base)
    ramp.color_ramp.elements[0].position = 0.35; ramp.color_ramp.elements[1].position = 0.95
    L.new(mix.outputs[0], ramp.inputs["Fac"]); L.new(ramp.outputs["Color"], b.inputs["Base Color"])
    _set(b, "Roughness", rough); _set(b, ["Coat Weight", "Clearcoat"], coat); _set(b, ["Coat Roughness", "Clearcoat Roughness"], 0.08)
    _set(b, ["Specular IOR Level", "Specular"], 0.5)
    _mats[key] = m
    return m

def marble(name, base="#f2efe8", vein="#9a948a", rough=0.12, scale=3.0):
    key = ("marble", name, base, vein, scale)
    if key in _mats: return _mats[key]
    m, nt, b = _new(name); N = nt.nodes; L = nt.links
    tc = N.new("ShaderNodeTexCoord"); noise = N.new("ShaderNodeTexNoise")
    noise.inputs["Scale"].default_value = scale; noise.inputs["Detail"].default_value = 12; noise.inputs["Distortion"].default_value = 4.0
    L.new(tc.outputs["Object"], noise.inputs["Vector"])
    ramp = N.new("ShaderNodeValToRGB"); e = ramp.color_ramp.elements
    e[0].position = 0.46; e[0].color = hexrgb(vein); e[1].position = 0.54; e[1].color = hexrgb(base)
    L.new(noise.outputs["Fac"], ramp.inputs["Fac"]); L.new(ramp.outputs["Color"], b.inputs["Base Color"])
    _set(b, "Roughness", rough); _set(b, ["Coat Weight", "Clearcoat"], 0.8)
    _mats[key] = m
    return m

def image(name, path, rough=0.5, emit=0.0, alpha=False, interp="Linear", spec=0.3, repeat=(1, 1), world_scale=None):
    """Image-textured material (uses the mesh UVs; quads map 0..1). world_scale tiles it by world position instead."""
    key = ("img", name, path, rough, emit, repeat, world_scale)
    if key in _mats: return _mats[key]
    m, nt, b = _new(name); N = nt.nodes; L = nt.links
    t = N.new("ShaderNodeTexImage"); t.image = bpy.data.images.load(path, check_existing=True); t.interpolation = interp
    t.extension = "CLIP" if alpha else "REPEAT"
    if world_scale:
        # tile by world position (objects are built in place, so object coords == world coords)
        tc = N.new("ShaderNodeTexCoord"); mp = N.new("ShaderNodeMapping"); mp.inputs["Scale"].default_value = (world_scale, world_scale, world_scale)
        L.new(tc.outputs["Object"], mp.inputs["Vector"]); L.new(mp.outputs["Vector"], t.inputs["Vector"])
        t.projection = "BOX"; t.projection_blend = 0.1
    elif repeat != (1, 1):
        tc = N.new("ShaderNodeTexCoord"); mp = N.new("ShaderNodeMapping"); mp.inputs["Scale"].default_value = (repeat[0], repeat[1], 1)
        L.new(tc.outputs["UV"], mp.inputs["Vector"]); L.new(mp.outputs["Vector"], t.inputs["Vector"])
    L.new(t.outputs["Color"], b.inputs["Base Color"])
    if emit:
        L.new(t.outputs["Color"], b.inputs["Emission Color"] if "Emission Color" in b.inputs else b.inputs["Emission"])
        _set(b, "Emission Strength", emit)
    if alpha:
        L.new(t.outputs["Alpha"], b.inputs["Alpha"])
        try: m.blend_method = "HASHED"
        except Exception: pass
    _set(b, "Roughness", rough); _set(b, ["Specular IOR Level", "Specular"], spec)
    _mats[key] = m
    return m

# ------------------------------------------------------------------ geometry
def _obj(name, me, material=None):
    o = bpy.data.objects.new(name, me); bpy.context.scene.collection.objects.link(o)
    if material is not None:
        for mm in material if isinstance(material, (list, tuple)) else [material]: o.data.materials.append(mm)
    return o

def box(name, x0, x1, y0, y1, z0, z1, material=None, bevel=0.008, hot=None, segs=2):
    me = bpy.data.meshes.new(name); bm = bmesh.new()
    bmesh.ops.create_cube(bm, size=1.0); bmesh.ops.scale(bm, vec=(x1 - x0, y1 - y0, z1 - z0), verts=bm.verts)
    bmesh.ops.translate(bm, vec=((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2), verts=bm.verts)
    bm.to_mesh(me); bm.free()
    _uv_box(me)
    o = _obj(name, me, material)
    if bevel and min(x1 - x0, y1 - y0, z1 - z0) > bevel * 2.2:
        md = o.modifiers.new("bevel", "BEVEL"); md.width = bevel; md.segments = segs; md.limit_method = "ANGLE"
    if hot: o["hot"] = hot
    return o

def _uv_box(me):
    """Each face gets a 0..1 UV square (so an image covers a whole face, upright)."""
    if not me.uv_layers: me.uv_layers.new(name="UV")
    uv = me.uv_layers.active.data
    for p in me.polygons:
        n = p.normal; ax = max(range(3), key=lambda i: abs(n[i]))
        u_ax, v_ax = [(1, 2), (0, 2), (0, 1)][ax]
        cs = [me.vertices[i].co for i in p.vertices]
        umin, umax = min(c[u_ax] for c in cs), max(c[u_ax] for c in cs)
        vmin, vmax = min(c[v_ax] for c in cs), max(c[v_ax] for c in cs)
        for li, vi in zip(p.loop_indices, p.vertices):
            c = me.vertices[vi].co
            u = (c[u_ax] - umin) / ((umax - umin) or 1); v = (c[v_ax] - vmin) / ((vmax - vmin) or 1)
            if (ax == 1 and n[1] > 0) or (ax == 0 and n[0] < 0): u = 1 - u
            uv[li].uv = (u, v)

def quad(name, pts, material=None, hot=None, anchor=None):
    """A flat 4-point polygon (p0 bottom-left, p1 bottom-right, p2 top-right, p3 top-left) with 0..1 UVs."""
    me = bpy.data.meshes.new(name); me.from_pydata([Vector(p) for p in pts], [], [(0, 1, 2, 3)])
    me.uv_layers.new(name="UV"); uv = me.uv_layers.active.data
    for li, (u, v) in zip(range(4), [(0, 0), (1, 0), (1, 1), (0, 1)]): uv[li].uv = (u, v)
    o = _obj(name, me, material)
    if hot: o["hot"] = hot
    if anchor: o["anchor"] = anchor
    return o

def wallquad(name, x0, x1, z0, z1, y, material=None, **k):
    """Upright quad facing the camera (-Y) at depth y."""
    return quad(name, [(x0, y, z0), (x1, y, z0), (x1, y, z1), (x0, y, z1)], material, **k)

def sidequad(name, y0, y1, z0, z1, x, material=None, facing=1, **k):
    """Upright quad on a side wall at x. facing=+1: faces +X (on the left wall); -1: faces -X (right wall).
    UV u runs from the near edge (small y) to the far edge on the left wall, and far->near... always 'reads' correctly."""
    pts = [(x, y0, z0), (x, y1, z0), (x, y1, z1), (x, y0, z1)] if facing > 0 else [(x, y1, z0), (x, y0, z0), (x, y0, z1), (x, y1, z1)]
    return quad(name, pts, material, **k)

def floorquad(name, x0, x1, y0, y1, z, material=None, **k):
    return quad(name, [(x0, y0, z), (x1, y0, z), (x1, y1, z), (x0, y1, z)], material, **k)

def _finish(o, name, material, hot, smooth=True):
    o.name = name
    if material is not None: o.data.materials.append(material)
    if smooth:
        for p in o.data.polygons: p.use_smooth = True
    if hot: o["hot"] = hot
    return o

def cyl(name, x, y, z0, z1, r, material=None, verts=32, hot=None, rot=None, bevel=0.0):
    """Upright cylinder at (x, y) from z0 to z1. rot rotates it about its centre (Euler radians)."""
    bpy.ops.mesh.primitive_cylinder_add(vertices=verts, radius=r, depth=abs(z1 - z0), location=(x, y, (z0 + z1) / 2))
    o = bpy.context.active_object
    if rot: o.rotation_euler = rot
    if bevel:
        md = o.modifiers.new("bevel", "BEVEL"); md.width = bevel; md.segments = 2; md.limit_method = "ANGLE"
    return _finish(o, name, material, hot)

def sphere(name, x, y, z, r, material=None, hot=None, scale=(1, 1, 1)):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=48, ring_count=24, radius=r, location=(x, y, z))
    o = bpy.context.active_object; o.scale = scale
    return _finish(o, name, material, hot)

def cone(name, x, y, z0, z1, r0, r1, material=None, verts=32, hot=None):
    bpy.ops.mesh.primitive_cone_add(vertices=verts, radius1=r0, radius2=r1, depth=z1 - z0, location=(x, y, (z0 + z1) / 2))
    return _finish(bpy.context.active_object, name, material, hot)

def torus(name, x, y, z, R, r, material=None, rot=(0, 0, 0), hot=None):
    bpy.ops.mesh.primitive_torus_add(major_radius=R, minor_radius=r, location=(x, y, z), rotation=rot, major_segments=48, minor_segments=16)
    return _finish(bpy.context.active_object, name, material, hot)

def text(name, s, x, y, z, size=0.1, material=None, align="CENTER", rot=(math.pi / 2, 0, 0), extrude=0.0, hot=None, font="arialbd.ttf"):
    cu = bpy.data.curves.new(name, "FONT"); cu.body = s; cu.size = size; cu.align_x = align; cu.align_y = "CENTER"; cu.extrude = extrude
    fp = os.path.join(os.environ.get("WINDIR", "C:\\Windows"), "Fonts", font)
    if os.path.exists(fp): cu.font = bpy.data.fonts.load(fp, check_existing=True)
    o = bpy.data.objects.new(name, cu); bpy.context.scene.collection.objects.link(o)
    o.location = (x, y, z); o.rotation_euler = rot
    if material is not None: o.data.materials.append(material)
    if hot: o["hot"] = hot
    return o

def group(key, *objs):
    for o in objs:
        for oo in o if isinstance(o, (list, tuple)) else [o]: oo["hot"] = key

def hand(name, cx, cz, y, angle_deg, length, width, material):
    """A clock hand on a wall at depth y, pointing at angle (0 = 12 o'clock, clockwise)."""
    a = math.radians(angle_deg); ux, uz = math.sin(a), math.cos(a); px, pz = uz * width / 2, -ux * width / 2
    tail = 0.15 * length
    p0 = (cx - ux * tail - px, y, cz - uz * tail - pz); p1 = (cx - ux * tail + px, y, cz - uz * tail + pz)
    p2 = (cx + ux * length + px * 0.4, y, cz + uz * length + pz * 0.4); p3 = (cx + ux * length - px * 0.4, y, cz + uz * length - pz * 0.4)
    return quad(name, [p0, p1, p2, p3], material)

def wallclock(name, cx, cz, y, r, rim, face_img, hand_mat, hour=10, minute=10, hands=False):
    """Round wall clock facing -Y. Its face is exported as anchor <name> so the page can draw live hands."""
    parts = [cyl(name + "Rim", cx, y - 0.02, cz - 0.03, cz + 0.03, r, rim, rot=(math.pi / 2, 0, 0)),
             wallquad(name + "Face", cx - r * 0.9, cx + r * 0.9, cz - r * 0.9, cz + r * 0.9, y - 0.051, face_img, anchor=name)]
    if not hands: return parts
    parts.append(hand(name + "H", cx, cz, y - 0.054, (hour % 12) * 30 + minute * 0.5, r * 0.5, r * 0.09, hand_mat))
    parts.append(hand(name + "M", cx, cz, y - 0.056, minute * 6, r * 0.78, r * 0.06, hand_mat))
    return parts

# ------------------------------------------------------------------ lights, camera, world
def area(name, loc, size, energy, color="#fff4e0", target=None, size_y=None, spread=None, shape="RECTANGLE"):
    l = bpy.data.lights.new(name, "AREA"); l.energy = energy; l.color = hexrgb(color)[:3]; l.shape = shape; l.size = size
    if size_y is not None: l.size_y = size_y
    if spread is not None: l.spread = math.radians(spread)
    o = bpy.data.objects.new(name, l); bpy.context.scene.collection.objects.link(o); o.location = loc
    if target is not None: o.rotation_euler = (Vector(target) - Vector(loc)).to_track_quat("-Z", "Y").to_euler()
    return o

def point(name, loc, energy, color="#ffe8c0", radius=0.05):
    l = bpy.data.lights.new(name, "POINT"); l.energy = energy; l.color = hexrgb(color)[:3]; l.shadow_soft_size = radius
    o = bpy.data.objects.new(name, l); bpy.context.scene.collection.objects.link(o); o.location = loc
    return o

def spot(name, loc, target, energy, color="#fff0d0", angle=50, blend=0.4, radius=0.05):
    l = bpy.data.lights.new(name, "SPOT"); l.energy = energy; l.color = hexrgb(color)[:3]; l.spot_size = math.radians(angle); l.spot_blend = blend; l.shadow_soft_size = radius
    o = bpy.data.objects.new(name, l); bpy.context.scene.collection.objects.link(o); o.location = loc
    o.rotation_euler = (Vector(target) - Vector(loc)).to_track_quat("-Z", "Y").to_euler()
    return o

def sun(name, direction, energy=3.0, color="#fff2dc", angle=1.0):
    """direction = the way the light travels (e.g. (-1, 1, -1): from front-right-above towards back-left-down)."""
    l = bpy.data.lights.new(name, "SUN"); l.energy = energy; l.color = hexrgb(color)[:3]; l.angle = math.radians(angle)
    o = bpy.data.objects.new(name, l); bpy.context.scene.collection.objects.link(o)
    o.rotation_euler = Vector(direction).to_track_quat("-Z", "Y").to_euler()
    return o

def screen_to_world(px, py, W, H, axis, value):
    """Where the camera ray through stage pixel (px, py) meets the plane axis=value ("x", "y" or "z").
    Lets a scene place furniture exactly under existing 2D hotspots."""
    sc = bpy.context.scene; cam = sc.camera
    sc.render.resolution_x = W; sc.render.resolution_y = H
    bpy.context.view_layer.update()
    tr, br, bl, tl = cam.data.view_frame(scene=sc)
    u, v = px / W, py / H
    p = tl + (tr - tl) * u + (bl - tl) * v
    o = cam.matrix_world.translation; d = (cam.matrix_world.to_3x3() @ p).normalized()
    i = "xyz".index(axis); t = (value - o[i]) / d[i]
    return o + d * t

def camera(loc, target, lens=24, shift_y=0.0, shift_x=0.0):
    c = bpy.data.cameras.new("cam"); c.lens = lens; c.shift_y = shift_y; c.shift_x = shift_x; c.sensor_fit = "HORIZONTAL"; c.sensor_width = 36
    c.clip_start = 0.05; c.clip_end = 200
    o = bpy.data.objects.new("cam", c); bpy.context.scene.collection.objects.link(o); o.location = loc
    o.rotation_euler = (Vector(target) - Vector(loc)).to_track_quat("-Z", "Y").to_euler()
    bpy.context.scene.camera = o
    return o

def world(color="#9ec8f0", strength=1.0, sky=False, sun_dir=(0.4, 0.6, 0.5), sky_strength=1.0):
    w = bpy.data.worlds.new("world"); bpy.context.scene.world = w; w.use_nodes = True
    nt = w.node_tree; bg = nt.nodes.get("Background")
    if sky:
        s = nt.nodes.new("ShaderNodeTexSky")
        try:
            s.sky_type = "NISHITA"; d = Vector(sun_dir).normalized()
            s.sun_elevation = math.asin(d.z); s.sun_rotation = math.atan2(d.x, d.y); s.sun_intensity = 0.3
        except Exception: pass
        nt.links.new(s.outputs["Color"], bg.inputs["Color"])
        bg.inputs["Strength"].default_value = sky_strength
    else:
        bg.inputs["Color"].default_value = hexrgb(color)
        bg.inputs["Strength"].default_value = strength

# ------------------------------------------------------------------ render + export
def _gpu(sc):
    try:
        prefs = bpy.context.preferences.addons["cycles"].preferences
        for dev in ("OPTIX", "CUDA"):
            try:
                prefs.compute_device_type = dev
                prefs.get_devices()
                if any(d.type == dev for d in prefs.devices):
                    for d in prefs.devices: d.use = d.type == dev
                    sc.cycles.device = "GPU"
                    print("cycles device:", dev)
                    return
            except Exception: continue
    except Exception as e:
        print("gpu setup failed", e)

def _harden(factor=0.3, sun_max=0.6):
    """1994 raytracers had point-ish lights: shrink every area light and sun so shadows go crisp."""
    for o in bpy.context.scene.objects:
        if o.type != "LIGHT": continue
        l = o.data
        if l.type == "AREA" and not o.get("soft"):
            l.size *= factor
            if l.shape in ("RECTANGLE", "ELLIPSE"): l.size_y *= factor
        elif l.type == "SUN": l.angle = min(l.angle, math.radians(sun_max))
        elif l.type in ("POINT", "SPOT"): l.shadow_soft_size = min(l.shadow_soft_size, 0.03)

def render(room, W, H, samples=128, scale=2, exposure=0.0, look="Medium High Contrast", style="raytrace95", gamma=1.0, hots=True):
    """style="raytrace95": the 1994-95 Strata/3D Studio look Navigator shipped with — no filmic tone curve
    (Standard sRGB, so colours stay saturated and highlights clip hot), few bounces (dark, contrasty corners)
    and crisp shadows. style="modern" keeps the old AgX look."""
    sc = bpy.context.scene
    for a in sys.argv:
        if a.startswith("--exp="): exposure = float(a[6:])
        if a.startswith("--style="): style = a[8:]
    if hots: export(room, W, H)
    sc.render.engine = "CYCLES"; _gpu(sc)
    sc.cycles.samples = samples; sc.cycles.use_denoising = True
    try: sc.cycles.denoiser = "OPENIMAGEDENOISE"
    except Exception: pass
    sc.cycles.caustics_reflective = False; sc.cycles.caustics_refractive = False
    sc.cycles.sample_clamp_indirect = 8
    sc.render.resolution_x = W * scale; sc.render.resolution_y = H * scale; sc.render.resolution_percentage = 100
    if style == "raytrace95":
        _harden()
        sc.cycles.max_bounces = 4; sc.cycles.diffuse_bounces = 1; sc.cycles.glossy_bounces = 3; sc.cycles.transmission_bounces = 4
        sc.view_settings.view_transform = "Standard"; sc.view_settings.look = "None"
        sc.view_settings.gamma = gamma
    else:
        sc.cycles.max_bounces = 8
        try:
            sc.view_settings.view_transform = "AgX"; sc.view_settings.look = "AgX - " + look
        except Exception:
            try: sc.view_settings.view_transform = "Filmic"; sc.view_settings.look = look
            except Exception: pass
    sc.view_settings.exposure = exposure
    sc.render.image_settings.file_format = "PNG"
    sc.render.filepath = os.path.join(OUT, room + ".png")
    if "--dry" in sys.argv: return
    if "--fast" in sys.argv:
        sc.cycles.samples = 24; sc.render.resolution_x = W; sc.render.resolution_y = H
    bpy.ops.render.render(write_still=True)

def _hull(pts):
    pts = sorted(set(pts))
    if len(pts) <= 2: return pts
    def cross(o, a, b): return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])
    lo, up = [], []
    for p in pts:
        while len(lo) >= 2 and cross(lo[-2], lo[-1], p) <= 0: lo.pop()
        lo.append(p)
    for p in reversed(pts):
        while len(up) >= 2 and cross(up[-2], up[-1], p) <= 0: up.pop()
        up.append(p)
    return lo[:-1] + up[:-1]

def _clip(poly, W, H):
    def edge(ps, inside, inter):
        out = []
        for i in range(len(ps)):
            a, b = ps[i - 1], ps[i]
            if inside(b):
                if not inside(a): out.append(inter(a, b))
                out.append(b)
            elif inside(a): out.append(inter(a, b))
        return out
    ix = lambda x: (lambda a, b: (x, a[1] + (b[1] - a[1]) * (x - a[0]) / ((b[0] - a[0]) or 1e-9)))
    iy = lambda y: (lambda a, b: (a[0] + (b[0] - a[0]) * (y - a[1]) / ((b[1] - a[1]) or 1e-9), y))
    for inside, inter in ((lambda p: p[0] >= 0, ix(0)), (lambda p: p[0] <= W, ix(W)), (lambda p: p[1] >= 0, iy(0)), (lambda p: p[1] <= H, iy(H))):
        if not poly: break
        poly = edge(poly, inside, inter)
    return poly

def export(room, W, H):
    """Write out/<room>.json: hot polygons (far to near) and anchor quads, in native pixels."""
    sc = bpy.context.scene; cam = sc.camera
    bpy.context.view_layer.update()
    sc.render.resolution_x = W; sc.render.resolution_y = H
    dg = bpy.context.evaluated_depsgraph_get()
    def proj(co):
        v = world_to_camera_view(sc, cam, co)
        return (v.x * W, (1 - v.y) * H, v.z)
    hots = []; anchors = {}
    for o in sc.objects:
        if "hot" not in o and "anchor" not in o: continue
        ev = o.evaluated_get(dg)
        try: me = ev.to_mesh()
        except Exception: continue
        if me is None: continue
        P = [proj(ev.matrix_world @ v.co) for v in me.vertices]
        ev.to_mesh_clear()
        P = [p for p in P if p[2] > 0]
        if not P: continue
        if "anchor" in o:
            anchors[o["anchor"]] = [[round(p[0], 1), round(p[1], 1)] for p in P[:4]]
        if "hot" in o:
            poly = _clip(_hull([(round(p[0], 1), round(p[1], 1)) for p in P]), W, H)
            if len(poly) >= 3:
                hots.append({"k": o["hot"], "d": round(min(p[2] for p in P), 3), "p": [[round(x, 1), round(y, 1)] for x, y in poly]})
    hots.sort(key=lambda h: -h["d"])
    with open(os.path.join(OUT, room + ".json"), "w") as f:
        json.dump({"W": W, "H": H, "hots": hots, "anchors": anchors}, f)
    print("exported", room, len(hots), "hot polys,", len(anchors), "anchors")

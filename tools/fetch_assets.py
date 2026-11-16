"""
fetch_assets.py — downloads the CC0 Poly Haven models & textures used by Navigator
and shrinks their textures for the web. Run from the repo root:  python tools/fetch_assets.py
All assets are CC0 (https://polyhaven.com/license). Re-running is safe; existing files are skipped.
"""
import json, os, sys, urllib.request, io
from PIL import Image

UA = {"User-Agent": "dominiccerchio.com asset fetch (static site build)"}
ROOT = os.path.join(os.path.dirname(__file__), "..", "assets")

MODELS = [
    # living room
    "Sofa_01", "ArmChair_01", "CoffeeTable_01", "Television_01", "potted_plant_04",
    "fancy_picture_frame_01", "mantel_clock_01", "throw_pillows_01", "side_table_01", "painted_wooden_chair_01",
    # kitchen
    "round_wooden_table_01", "painted_wooden_chair_02", "vintage_microwave", "vintage_electric_kettle",
    "food_apple_01", "wooden_bowl_02",
    # den
    "Rockingchair_01", "hanging_picture_frame_01", "vintage_suitcase",
    "standing_picture_frame_01", "vintage_oil_lamp",
    # rec room / kidspace
    "cardboard_box_01", "lifebuoy", "gamepad", "dartboard", "rubber_duck_toy", "boombox", "Ukulele_01",
    "football", "baseball_01",
]
TEXTURES = {  # id: max size of the diffuse map
    "rectangular_parquet": 1024, "herringbone_parquet": 1024, "beige_wall_001": 512, "red_brick_03": 512,
    "velour_velvet": 512, "white_plaster_02": 512,
}
MODEL_TEX_MAX = 512


def get(url):
    with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=60) as r:
        return r.read()


def shrink(data, max_px, name):
    if not name.lower().endswith((".jpg", ".jpeg", ".png")):
        return data
    im = Image.open(io.BytesIO(data))
    if max(im.size) > max_px:
        im.thumbnail((max_px, max_px), Image.LANCZOS)
    out = io.BytesIO()
    if name.lower().endswith(".png"):
        im.save(out, "PNG", optimize=True)
    else:
        im.convert("RGB").save(out, "JPEG", quality=82, optimize=True, progressive=True)
    return out.getvalue()


def fetch_model(mid):
    dest = os.path.join(ROOT, "models", mid)
    files = json.loads(get(f"https://api.polyhaven.com/files/{mid}"))
    g = files["gltf"]["1k"]["gltf"]
    os.makedirs(dest, exist_ok=True)
    main = os.path.join(dest, os.path.basename(g["url"]))
    if not os.path.exists(main):
        open(main, "wb").write(get(g["url"]))
    for rel, info in g.get("include", {}).items():
        p = os.path.join(dest, rel)
        if os.path.exists(p):
            continue
        os.makedirs(os.path.dirname(p), exist_ok=True)
        open(p, "wb").write(shrink(get(info["url"]), MODEL_TEX_MAX, rel))
    return sum(os.path.getsize(os.path.join(dp, f)) for dp, _, fs in os.walk(dest) for f in fs)


def fetch_texture(tid, max_px):
    dest = os.path.join(ROOT, "textures", tid)
    os.makedirs(dest, exist_ok=True)
    files = json.loads(get(f"https://api.polyhaven.com/files/{tid}"))
    for key, out in (("Diffuse", "diff.jpg"), ("nor_gl", "nor.jpg"), ("arm", "arm.jpg")):
        if key not in files:
            continue
        p = os.path.join(dest, out)
        if os.path.exists(p):
            continue
        url = files[key]["1k"]["jpg"]["url"]
        open(p, "wb").write(shrink(get(url), max_px if key == "Diffuse" else 512, out))
    return sum(os.path.getsize(os.path.join(dest, f)) for f in os.listdir(dest))


if __name__ == "__main__":
    total = 0
    for m in MODELS:
        try:
            s = fetch_model(m); total += s; print(f"model   {m:28s} {s/1024:7.0f} KB")
        except Exception as e:
            print(f"model   {m:28s} FAILED {e}", file=sys.stderr)
    for t, mx in TEXTURES.items():
        try:
            s = fetch_texture(t, mx); total += s; print(f"texture {t:28s} {s/1024:7.0f} KB")
        except Exception as e:
            print(f"texture {t:28s} FAILED {e}", file=sys.stderr)
    print(f"TOTAL {total/1024/1024:.1f} MB")

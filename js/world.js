// =====================================================================
//  world.js — builds the house, its rooms, and every clickable prop.
//  Coordinates are meters. Yaw 0 looks north (-z). Each prop is authored
//  facing +z, then rotated into place.
// =====================================================================
import * as THREE from "three";
import * as T from "./textures.js";
import { TRINKETS, CERTIFICATIONS, VOLUNTEERING, FAMILY, CATS } from "./data.js";
import { pbr } from "./assets.js";

const H = 3.2;          // wall height
const WT = 0.16;        // wall thickness
export const FACE = { s: 0, n: Math.PI, e: Math.PI / 2, w: -Math.PI / 2 }; // which way a prop's front faces: s=+z, e=+x

// ---------------------------------------------------------------- helpers
export function M(color, o = {}) {
  return new THREE.MeshStandardMaterial({
    color, roughness: o.r ?? 0.75, metalness: o.m ?? 0, map: o.map || null,
    emissive: o.e || 0x000000, emissiveIntensity: o.ei ?? 1, emissiveMap: o.emap || null,
    transparent: !!o.t, opacity: o.op ?? 1, side: o.side ?? THREE.FrontSide, flatShading: !!o.flat
  });
}
export const B = (w, h, d) => new THREE.BoxGeometry(w, h, d);
export const C = (rt, rb, h, s = 20, ...rest) => new THREE.CylinderGeometry(rt, rb, h, s, ...rest);
export const S = (r, w = 20, h = 14, ...rest) => new THREE.SphereGeometry(r, w, h, ...rest);
export function add(parent, geo, mat, x = 0, y = 0, z = 0, shadow = true) {
  const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z);
  m.castShadow = shadow; m.receiveShadow = true; parent.add(m); return m;
}
export function group(parent, x = 0, y = 0, z = 0, face = 0) {
  const g = new THREE.Group(); g.position.set(x, y, z); g.rotation.y = face; parent.add(g); return g;
}
export function scaleUV(geo, su, sv) {
  const uv = geo.attributes.uv; for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * su, uv.getY(i) * sv);
  uv.needsUpdate = true; return geo;
}

/** Glossy varnished wood, the signature Navigator look. */
export function varnish(map, { color = 0xffffff, rough = 0.5, coat = 0.75 } = {}) {
  return new THREE.MeshPhysicalMaterial({ color, map, roughness: rough, clearcoat: coat, clearcoatRoughness: 0.14, envMapIntensity: 0.9 });
}
const swap = g => { g.traverse(c => { if (c.isMesh && !c.userData.keepMat) c.userData.swap = true; }); return g; };

// ---------------------------------------------------------------- world
export function buildWorld(scene) {
  const hotspots = [];
  const updaters = [];
  const refs = { ceilings: [], roomFloors: {}, certFrames: [] };

  /** Mark an object as clickable. def: { id, label, desc, action, focus:[dx,dy,dz], room } */
  function hot(obj, def) {
    obj.traverse(o => { if (o.isMesh && !o.userData.keepMat) o.material = o.material.clone(); });
    obj.userData.hot = def; def.obj = obj; hotspots.push(obj); return obj;
  }

  // ---------- materials
  const mat = {
    cherry: varnish(T.woodTex("#7a2a14", 7, [1, 1])),
    cherryDark: varnish(T.woodTex("#4f1a0b", 9, [1, 1]), { rough: 0.45 }),
    oak: varnish(T.woodTex("#a8743d", 5, [1, 1]), { rough: 0.55, coat: 0.5 }),
    cream: pbr("beige_wall_001", { color: 0xfbefd2 }),
    kitchenWall: new THREE.MeshStandardMaterial({ color: 0xf7efd8, roughness: 0.92, normalMap: pbr("beige_wall_001").normalMap }),
    denWall: pbr("beige_wall_001", { color: 0x6f9478 }),
    recWall: pbr("beige_wall_001", { color: 0x7484c8 }),
    stucco: pbr("white_plaster_02", { color: 0xf1e2bd }),
    ceiling: M(0xfbf5e8, { r: 0.95 }),
    black: M(0x161616, { r: 0.4 }),
    metal: M(0xb8bcc4, { r: 0.3, m: 0.8 }),
    brass: M(0xc9a54a, { r: 0.35, m: 0.85 }),
    glass: new THREE.MeshPhysicalMaterial({ color: 0xdff0ff, transparent: true, opacity: 0.16, roughness: 0.02, metalness: 0, envMapIntensity: 1.4 }),
    beige: M(0xd9d0b8, { r: 0.6 }),
    white: M(0xf4f1ea, { r: 0.5 })
  };
  mat.glass.depthWrite = false;
  mat.ceiling.shadowSide = THREE.DoubleSide;

  // ---------- sky + ground + trees (seen through the windows, and in Map view)
  const skyC = document.createElement("canvas"); skyC.width = 4; skyC.height = 256;
  const sg = skyC.getContext("2d"), grd = sg.createLinearGradient(0, 0, 0, 256);
  grd.addColorStop(0, "#4f86c6"); grd.addColorStop(0.5, "#a9d0f0"); grd.addColorStop(1, "#f3e3c3");
  sg.fillStyle = grd; sg.fillRect(0, 0, 4, 256);
  const skyTex = new THREE.CanvasTexture(skyC); skyTex.colorSpace = THREE.SRGBColorSpace;
  scene.add(new THREE.Mesh(new THREE.SphereGeometry(120, 32, 16), new THREE.MeshBasicMaterial({ map: skyTex, side: THREE.BackSide, fog: false })));
  const ground = add(scene, new THREE.CircleGeometry(110, 48), M(0x6f8a45, { r: 1 }), 0, -0.02, 0, false);
  ground.rotation.x = -Math.PI / 2;
  const dirt = add(scene, new THREE.CircleGeometry(24, 40), M(0x9a7a4e, { r: 1 }), 0, -0.01, -4, false);
  dirt.rotation.x = -Math.PI / 2;
  const rnd = (() => { let s = 42; return () => ((s = (s * 16807) % 2147483647) / 2147483647); })();
  for (let i = 0; i < 46; i++) {
    const a = rnd() * Math.PI * 2, d = 20 + rnd() * 40;
    const x = Math.cos(a) * d, z = Math.sin(a) * d - 4, h = 6 + rnd() * 7;
    const tg = group(scene, x, 0, z);
    add(tg, C(0.18, 0.3, h * 0.5, 7), M(0x5a3d26), 0, h * 0.25, 0);
    const leaf = M(new THREE.Color().setHSL(0.24 + rnd() * 0.08, 0.45, 0.28 + rnd() * 0.12), { flat: true });
    for (let k = 0; k < 4; k++) add(tg, new THREE.IcosahedronGeometry(1.4 + rnd() * 1.4, 0), leaf, (rnd() - 0.5) * 2, h * 0.55 + k * 0.9, (rnd() - 0.5) * 2);
  }

  // ---------- walls with openings
  // axis 'x' => wall runs along x at z=fixed. matPos faces +z/+x side, matNeg the other side.
  function wall(axis, fixed, u0, u1, openings, matPos, matNeg) {
    const mats = axis === "x" ? [matPos, matPos, matPos, matPos, matPos, matNeg] : [matPos, matNeg, matPos, matPos, matPos, matPos];
    const piece = (a, b, y0, y1) => {
      if (b - a < 0.01 || y1 - y0 < 0.01) return;
      const len = b - a, h = y1 - y0, cu = (a + b) / 2, cy = (y0 + y1) / 2;
      const geo = scaleUV(axis === "x" ? B(len, h, WT) : B(WT, h, len), len / 2.2, h / 2.2);
      const m = new THREE.Mesh(geo, mats); m.receiveShadow = true; m.castShadow = true;
      m.position.set(axis === "x" ? cu : fixed, cy, axis === "x" ? fixed : cu); scene.add(m);
    };
    let u = u0;
    for (const o of openings.sort((a, b) => a.from - b.from)) {
      piece(u, o.from, 0, H); piece(o.from, o.to, 0, o.bottom ?? 0); piece(o.from, o.to, o.top ?? 2.3, H); u = o.to;
      const mid = (o.from + o.to) / 2, w = o.to - o.from, isWin = (o.bottom ?? 0) > 0;
      // trim / frame
      const fr = mat.cherryDark, top = o.top ?? 2.3, bot = o.bottom ?? 0, hh = top - bot;
      const at = (along, y, gw, gh, gd) => add(scene, axis === "x" ? B(gw, gh, gd) : B(gd, gh, gw), fr, axis === "x" ? along : fixed, y, axis === "x" ? fixed : along);
      at(o.from - 0.04, bot + hh / 2, 0.08, hh, WT + 0.06); at(o.to + 0.04, bot + hh / 2, 0.08, hh, WT + 0.06);
      at(mid, top + 0.04, w + 0.16, 0.08, WT + 0.06);
      if (isWin) {
        at(mid, bot - 0.04, w + 0.16, 0.08, WT + 0.12);
        at(mid, bot + hh / 2, 0.04, hh, 0.05);
        const g = add(scene, axis === "x" ? new THREE.PlaneGeometry(w, hh) : new THREE.PlaneGeometry(w, hh), mat.glass, axis === "x" ? mid : fixed, bot + hh / 2, axis === "x" ? fixed : mid, false);
        if (axis === "z") g.rotation.y = Math.PI / 2;
        g.userData.keepMat = true;
      }
    }
    piece(u, u1, 0, H);
  }
  const door = (from, to) => ({ from, to, bottom: 0, top: 2.35 });
  const win = (from, to) => ({ from, to, bottom: 0.95, top: 2.45 });

  // Living room  x[-6,6] z[-6,6]
  wall("x", 6, -6, 6, [win(-4.4, -2.4), door(-0.55, 0.55), win(2.2, 4.2)], mat.stucco, mat.cream);          // south (front door)
  wall("x", -6, -6, 6, [door(3.6, 5.4)], mat.cream, mat.recWall);                                             // north -> rec
  wall("z", -6, -6, -5, [], mat.cream, mat.stucco); wall("z", -6, 5, 6, [], mat.cream, mat.stucco);
  wall("z", -6, -5, 5, [door(-1, 1)], mat.cream, mat.denWall);                                                // west -> den
  wall("z", 6, -6, -5, [], mat.stucco, mat.cream); wall("z", 6, 5, 6, [], mat.stucco, mat.cream);
  wall("z", 6, -5, 5, [door(-1, 1), win(2.4, 4.2)], mat.kitchenWall, mat.cream);                              // east -> kitchen
  // Kitchen x[6,14] z[-5,5]
  wall("x", -5, 6, 14, [win(8.5, 10)], mat.kitchenWall, mat.stucco);
  wall("x", 5, 6, 14, [win(9, 11)], mat.stucco, mat.kitchenWall);
  wall("z", 14, -5, 5, [win(-0.8, 0.8)], mat.stucco, mat.kitchenWall);
  // Den x[-14,-6] z[-5,5]
  wall("x", -5, -14, -6, [win(-8.4, -7)], mat.denWall, mat.stucco);
  wall("x", 5, -14, -6, [win(-13.2, -12)], mat.stucco, mat.denWall);
  wall("z", -14, -5, 5, [], mat.denWall, mat.stucco);
  // Rec room x[-6,6] z[-14,-6]
  wall("x", -14, -6, 6, [win(-4.4, -2.8), win(2.6, 4.2)], mat.recWall, mat.stucco);
  wall("z", -6, -14, -6, [], mat.recWall, mat.stucco);
  wall("z", 6, -14, -6, [], mat.stucco, mat.recWall);

  // floors + ceilings
  function floor(name, x0, x1, z0, z1, m) {
    const w = x1 - x0, d = z1 - z0;
    const f = add(scene, scaleUV(new THREE.PlaneGeometry(w, d), w / 2, d / 2), m, (x0 + x1) / 2, 0, (z0 + z1) / 2, false);
    f.rotation.x = -Math.PI / 2; refs.roomFloors[name] = f;
    const c = add(scene, new THREE.PlaneGeometry(w, d), mat.ceiling, (x0 + x1) / 2, H, (z0 + z1) / 2, false);
    c.rotation.x = Math.PI / 2; c.castShadow = true; refs.ceilings.push(c);
    // baseboard-ish foundation slab visible from outside
    add(scene, B(w + 0.3, 0.25, d + 0.3), M(0x8d8578, { r: 1 }), (x0 + x1) / 2, -0.13, (z0 + z1) / 2, false);
  }
  floor("living", -6, 6, -6, 6, pbr("rectangular_parquet", { color: 0xffb680, roughness: 1.15 }));
  floor("kitchen", 6, 14, -5, 5, M(0xffffff, { map: T.tileTex(), r: 0.45 }));
  floor("den", -14, -6, -5, 5, pbr("herringbone_parquet", { color: 0xd88a5c, roughness: 1.15 }));
  floor("rec", -6, 6, -14, -6, pbr("velour_velvet", { color: 0x7a86c8 }));
  // roof cap rim (for the map view)
  const rim = M(0xd9c48f, { r: 1 });
  [[0, 0, 12.3, 12.3], [10, 0, 8.3, 10.3], [-10, 0, 8.3, 10.3], [0, -10, 12.3, 8.3]].forEach(([x, z, w, d]) => {
    add(scene, B(w, 0.12, 0.25), rim, x, H + 0.06, z - d / 2 + 0.12, false); add(scene, B(w, 0.12, 0.25), rim, x, H + 0.06, z + d / 2 - 0.12, false);
  });
  // ceiling beams (Navigator 3.5 had dark wood beams)
  for (let x = -4; x <= 4; x += 4) add(scene, B(0.22, 0.26, 12), mat.cherryDark, x, H - 0.13, 0);
  // wainscot rail in living room
  // ---------- architectural trim: baseboards, crown molding, and cherry wainscoting (Navigator's paneled look)
  const trimWhite = M(0xf3ead6, { r: 0.5 });
  function trim(x0, x1, z0, z1, gaps, { wains = false, baseMat = trimWhite } = {}) {
    const inset = WT / 2;
    const sides = [
      ["x", z0 + inset, x0, x1, 1], ["x", z1 - inset, x0, x1, -1],
      ["z", x0 + inset, z0, z1, 1], ["z", x1 - inset, z0, z1, -1]
    ];
    sides.forEach(([axis, fixed, a, b, sgn], si) => {
      const holes = (gaps[si] || []).slice().sort((p, q) => p[0] - q[0]);
      const runs = []; let u = a + inset;
      holes.forEach(([h0, h1]) => { runs.push([u, h0 - 0.08]); u = h1 + 0.08; }); runs.push([u, b - inset]);
      const strip = (u0, u1, y, h, d, m) => {
        if (u1 - u0 < 0.02) return;
        const len = u1 - u0, mid = (u0 + u1) / 2, off = fixed + sgn * d / 2;
        add(scene, axis === "x" ? B(len, h, d) : B(d, h, len), m, axis === "x" ? mid : off, y, axis === "x" ? off : mid, false);
      };
      runs.forEach(([u0, u1]) => {
        strip(u0, u1, 0.07, 0.14, 0.03, baseMat);
        if (wains) {
          strip(u0, u1, 0.5, 0.86, 0.02, mat.cherry);            // the panel field
          strip(u0, u1, 0.95, 0.07, 0.045, mat.cherryDark);      // chair rail
          for (let p = u0 + 0.3; p < u1 - 0.2; p += 0.7) strip(p, p + 0.04, 0.5, 0.86, 0.035, mat.cherryDark); // stiles
        }
      });
      strip(a + inset, b - inset, H - 0.06, 0.12, 0.06, trimWhite); // crown molding (runs over door heads)
    });
  }
  // gaps per side: [z0 wall (north), z1 wall (south), x0 wall (west), x1 wall (east)]
  trim(-6, 6, -6, 6, [[[3.6, 5.4]], [[-0.55, 0.55]], [[-1, 1]], [[-1, 1]]], { wains: true, baseMat: mat.cherryDark });
  trim(6, 14, -5, 5, [[], [], [[-1, 1]], []]);
  trim(-14, -6, -5, 5, [[], [], [], [[-1, 1]]], { wains: true, baseMat: mat.cherryDark });
  trim(-6, 6, -14, -6, [[], [[3.6, 5.4]], [], []]);

  // ---------- lights (warm, room by room)
  function lamp(x, z, color = 0xffd9a0, intensity = 9, dist = 11) {
    const l = new THREE.PointLight(color, intensity * 0.6, dist, 1.4); l.position.set(x, H - 0.45, z); scene.add(l);
    const shade = add(scene, C(0.18, 0.32, 0.22, 16), M(0xf5e1b0, { e: 0xffd28a, ei: 0.7 }), x, H - 0.35, z, false);
    add(scene, C(0.01, 0.01, 0.25, 4), mat.brass, x, H - 0.12, z, false);
    return l;
  }
  lamp(0, 0); lamp(10, 0, 0xfff0d0, 8); lamp(-10, 0, 0xffcf8a, 8); lamp(0, -10, 0xd8e0ff, 8);

  // =====================================================================
  // LIVING ROOM
  // =====================================================================
  const living = new THREE.Group(); scene.add(living);
  // rug
  const rug = add(living, new THREE.PlaneGeometry(5.2, 3.6), M(0xffffff, { map: T.rugTex(), r: 1 }), 0, 0.012, -0.4, false); rug.rotation.x = -Math.PI / 2;

  // fireplace + mantle + portrait + candle
  const fp = group(living, -2.8, 0, -5.7, FACE.s);
  add(fp, scaleUV(B(2.6, H, 0.5), 1.3, 1.6), pbr("red_brick_03", { color: 0xffe2d0 }), 0, H / 2, 0);
  add(fp, B(1.2, 0.85, 0.3), M(0x0d0806), 0, 0.5, 0.12);
  add(fp, B(1.6, 0.08, 0.6), M(0x6d6a66), 0, 0.04, 0.4);
  add(fp, B(2.9, 0.1, 0.42), mat.cherry, 0, 1.25, 0.3);
  const embers = add(fp, B(0.8, 0.12, 0.2), M(0x330800, { e: 0xff5a10, ei: 1.4 }), 0, 0.15, 0.18, false);
  const fireLight = new THREE.PointLight(0xff7a2a, 1, 4, 2); fireLight.position.set(0, 0.45, 0.45); fp.add(fireLight);
  updaters.push(t => { fireLight.intensity = 0.8 + Math.sin(t * 9) * 0.15 + Math.sin(t * 23) * 0.1; embers.material.emissiveIntensity = 1.1 + Math.sin(t * 7) * 0.3; });

  const portrait = group(fp, 0, 2.15, 0.27);
  swap(add(portrait, B(1.5, 1.14, 0.06), mat.brass));
  const pc = T.portraitCanvas(FAMILY, CATS); refs.portraitCanvas = pc;
  add(portrait, new THREE.PlaneGeometry(1.36, 1.0), M(0xffffff, { map: T.tex(pc), r: 0.6 }), 0, 0, 0.035, false);
  hot(portrait, { id: "family", label: "Family portrait", desc: "Picture day, 1996. Dad, Mom, the big sister, two big brothers, me — and the three cats who ran the house.", action: { type: "panel", panel: "family" }, focus: [0, -0.1, 1.9] });

  const candle = group(fp, 1.05, 1.3, 0.32);
  add(candle, C(0.05, 0.05, 0.2, 14), M(0xf5ecd6, { r: 0.9 }), 0, 0.1, 0);
  add(candle, C(0.08, 0.09, 0.02, 14), mat.brass, 0, 0.01, 0);
  const flame = add(candle, new THREE.ConeGeometry(0.018, 0.06, 8), M(0xffd27a, { e: 0xffa020, ei: 2 }), 0, 0.24, 0, false);
  const cl = new THREE.PointLight(0xffa040, 0.8, 2.5, 2); cl.position.set(0, 0.3, 0.05); candle.add(cl);
  updaters.push(t => { const f = 1 + Math.sin(t * 13) * 0.08 + Math.sin(t * 31) * 0.05; flame.scale.set(1, f, 1); cl.intensity = 0.7 * f; });
  hot(candle, { id: "remembrance", label: "Memorial candle", desc: "A candle that's always lit. In loving memory.", action: { type: "panel", panel: "remembrance" }, focus: [0, 0.15, 0.9] });

  // entertainment center + CRT TV
  const ent = group(living, 1.5, 0, -5.55, FACE.s);
  add(ent, B(2.5, 0.7, 0.6), mat.cherry, 0, 0.35, 0);
  add(ent, B(2.3, 0.04, 0.02), mat.cherryDark, 0, 0.35, 0.305);
  add(ent, B(0.7, 0.12, 0.4), mat.black, -0.75, 0.76, 0); // VCR
  add(ent, B(0.2, 0.02, 0.01), M(0x22ff66, { e: 0x22ff66 }), -0.85, 0.76, 0.205, false);
  [-1.05, 1.05].forEach(x => { const sp = add(ent, B(0.32, 0.9, 0.32), mat.cherryDark, x, 1.15, 0); add(ent, C(0.1, 0.1, 0.02, 16), M(0x222222), x, 1.25, 0.17).rotation.x = Math.PI / 2; });
  const tv = group(ent, 0.15, 0.7, 0);
  add(tv, B(1.0, 0.82, 0.62), M(0x2b2b2e, { r: 0.45 }), 0, 0.41, -0.02);
  add(tv, B(0.12, 0.05, 0.02), M(0xff3030, { e: 0xff2020, ei: 0.8 }), 0.38, 0.06, 0.3, false);
  swap(tv);
  const tvScreen = new T.CanvasScreen(512, 384); refs.tvScreen = tvScreen;
  const tvGlass = add(tv, new THREE.PlaneGeometry(0.82, 0.6), new THREE.MeshBasicMaterial({ map: tvScreen.texture }), 0, 0.45, 0.295, false);
  tvGlass.userData.keepMat = true;
  hot(tv, { id: "tv", label: "Television", desc: "Channel 3: “Meet Dominic.” Click to learn about me.", action: { type: "panel", panel: "about" }, focus: [0, 0.45, 1.9] });

  // coffee table + ballot box (Ranked Choice Voting)
  const ct = group(living, 0, 0, -0.5, FACE.s);
  add(ct, B(1.7, 0.07, 0.85), mat.cherry, 0, 0.44, 0);
  [[-0.75, -0.35], [0.75, -0.35], [-0.75, 0.35], [0.75, 0.35]].forEach(([x, z]) => add(ct, B(0.07, 0.42, 0.07), mat.cherryDark, x, 0.21, z));
  swap(ct);
  const ballot = group(ct, -0.2, 0.475, 0);
  add(ballot, B(0.42, 0.36, 0.32), M(0x1f3f7a, { r: 0.5 }), 0, 0.18, 0);
  add(ballot, B(0.25, 0.012, 0.03), mat.black, 0, 0.365, 0, false);
  add(ballot, new THREE.PlaneGeometry(0.3, 0.1), M(0xffffff, { map: T.labelTex("VOTE", { bg: "#1f3f7a", fg: "#fff", font: "bold 80px Arial" }) }), 0, 0.2, 0.161, false);
  const paper = add(ballot, B(0.16, 0.002, 0.22), M(0xfbfaf4), 0, 0.42, 0, false); paper.rotation.x = -1.2;
  for (let i = 0; i < 3; i++) {
    const b = add(ballot, B(0.17, 0.003, 0.23), M(0xfbfaf4), 0.36 + i * 0.03, 0.002 + i * 0.003, 0.05 - i * 0.02, false); b.rotation.y = 0.3 * i;
  }
  hot(ballot, { id: "rcv", label: "Ballot box", desc: "Ranked Choice Voting — create polls, rank choices, and watch the instant runoff.", action: { type: "app", app: "rankedchoicevoting" }, focus: [0.2, 0.55, 0.95] });

  // couch (back faces the camera) + armchairs
  function couch(parent, x, z, face, w, color) {
    const g = group(parent, x, 0, z, face), fab = M(color, { r: 0.95 });
    add(g, B(w, 0.42, 0.9), fab, 0, 0.21, 0);
    add(g, B(w, 0.5, 0.22), fab, 0, 0.62, -0.34);
    add(g, B(0.2, 0.62, 0.9), fab, -w / 2 + 0.1, 0.31, 0); add(g, B(0.2, 0.62, 0.9), fab, w / 2 - 0.1, 0.31, 0);
    for (let i = 0; i < Math.round(w / 0.8); i++) add(g, B(w / Math.round(w / 0.8) - 0.05, 0.12, 0.62), M(color, { r: 1 }), -w / 2 + 0.2 + (i + 0.5) * ((w - 0.4) / Math.round(w / 0.8)), 0.48, 0.05);
    return g;
  }


  // family PC desk (classic terminal site) on west wall
  const desk = group(living, -5.45, 0, -4.35, FACE.e);
  add(desk, B(1.6, 0.06, 0.75), mat.oak, 0, 0.74, 0);
  [[-0.75, -0.33], [0.75, -0.33], [-0.75, 0.33], [0.75, 0.33]].forEach(([x, z]) => add(desk, B(0.05, 0.72, 0.05), mat.oak, x, 0.36, z));
  const pcG = group(desk, 0, 0.77, -0.05);
  add(pcG, B(0.48, 0.12, 0.42), mat.beige, 0, 0.06, 0);
  add(pcG, B(0.46, 0.4, 0.42), mat.beige, 0, 0.34, -0.03);
  add(pcG, B(0.36, 0.26, 0.22), mat.beige, 0, 0.32, -0.3);
  const pcScreen = new T.CanvasScreen(320, 240); refs.pcScreen = pcScreen;
  const pcGlass = add(pcG, new THREE.PlaneGeometry(0.36, 0.27), new THREE.MeshBasicMaterial({ map: pcScreen.texture }), 0, 0.35, 0.185, false);
  pcGlass.userData.keepMat = true;
  add(pcG, B(0.46, 0.025, 0.16), mat.beige, 0, 0.012, 0.36);
  add(pcG, B(0.42, 0.12, 0.4), mat.beige, 0.55, -0.0 + 0.06, -0.05).scale.set(0.45, 3.2, 1); // tower
  hot(pcG, { id: "pc", label: "The family computer", desc: "A beige box with a green-screen soul. Opens the classic terminal version of this site.", action: { type: "pc" }, focus: [0, 0.35, 0.95] });
  const chair = group(desk, 0, 0, 0.75);
  add(chair, B(0.45, 0.06, 0.45), M(0x333333), 0, 0.46, 0); add(chair, C(0.03, 0.03, 0.44, 8), mat.metal, 0, 0.22, 0);
  add(chair, B(0.45, 0.45, 0.05), M(0x333333), 0, 0.72, 0.21);
  swap(chair);

  // LinkedIn dress form wearing a suit
  const form = group(living, -5.15, 0, -2.6, Math.PI / 4 + Math.PI / 6);
  add(form, C(0.12, 0.2, 0.03, 16), M(0x3a2a1a), 0, 0.015, 0);
  add(form, C(0.018, 0.018, 1.0, 8), mat.brass, 0, 0.5, 0);
  const suit = M(0x1d2738, { r: 0.85 });
  add(form, C(0.21, 0.24, 0.55, 18), suit, 0, 1.25, 0);
  add(form, C(0.24, 0.21, 0.12, 18), suit, 0, 1.58, 0);
  add(form, S(0.1, 14, 10), suit, -0.25, 1.5, 0).scale.set(1, 0.8, 1); add(form, S(0.1, 14, 10), suit, 0.25, 1.5, 0).scale.set(1, 0.8, 1);
  add(form, C(0.07, 0.065, 0.55, 12), suit, -0.29, 1.2, 0).rotation.z = 0.08; add(form, C(0.07, 0.065, 0.55, 12), suit, 0.29, 1.2, 0).rotation.z = -0.08;
  const shirt = add(form, new THREE.CircleGeometry(0.12, 3), M(0xf6f6f6), 0, 1.53, 0.215, false); shirt.rotation.z = -Math.PI / 2; shirt.scale.set(1.6, 0.9, 1);
  add(form, B(0.045, 0.24, 0.01), M(0x9b1b30, { r: 0.5 }), 0, 1.42, 0.232, false);
  add(form, B(0.06, 0.04, 0.012), M(0x9b1b30), 0, 1.56, 0.232, false);
  add(form, B(0.07, 0.07, 0.01), M(0xffffff, { map: T.linkedinTex(), r: 0.3, m: 0.2 }), -0.12, 1.47, 0.225, false);
  add(form, C(0.05, 0.06, 0.12, 12), mat.brass, 0, 1.7, 0);
  hot(form, { id: "linkedin", label: "Interview suit (with LinkedIn pin)", desc: "My professional side. Click to see my career and connect on LinkedIn.", action: { type: "panel", panel: "linkedin" }, focus: [0, 1.35, 1.25] });

  // rotary phone on side table by the kitchen door
  const st = group(living, 5.45, 0, -3.0, FACE.w);
  add(st, C(0.3, 0.3, 0.04, 20), mat.cherry, 0, 0.66, 0); add(st, C(0.04, 0.06, 0.64, 10), mat.cherryDark, 0, 0.32, 0);
  add(st, C(0.2, 0.2, 0.02, 20), mat.cherryDark, 0, 0.01, 0);
  swap(st);
  const phone = group(st, 0, 0.68, 0);
  const red = M(0xa01c1c, { r: 0.35 });
  add(phone, B(0.24, 0.1, 0.2), red, 0, 0.05, 0);
  add(phone, C(0.07, 0.07, 0.02, 20), M(0xf2efe6), 0, 0.09, 0.05).rotation.x = -0.4;
  const handset = add(phone, B(0.26, 0.04, 0.05), red, 0, 0.14, -0.02);
  add(phone, S(0.035, 10, 8), red, -0.12, 0.12, -0.02); add(phone, S(0.035, 10, 8), red, 0.12, 0.12, -0.02);
  hot(phone, { id: "phone", label: "Rotary phone", desc: "A dial tone, a curly cord, and the feeling someone might be listening. Dial a number… or a word.", action: { type: "panel", panel: "phone" }, focus: [0, 0.3, 0.75] });
  refs.handset = handset;

  // plant
  const plant = group(living, 5.3, 0, 5.3);
  add(plant, C(0.22, 0.17, 0.4, 14), M(0xb5653a), 0, 0.2, 0);
  for (let i = 0; i < 9; i++) { const l = add(plant, S(0.25, 6, 5), M(0x3d7a3a, { flat: true }), Math.sin(i) * 0.2, 0.6 + (i % 3) * 0.25, Math.cos(i) * 0.2); l.scale.set(0.6, 1.4, 0.3); l.rotation.set(i, i * 2, 0.3); }
  swap(plant);
  // front door
  const fdoor = group(scene, -0.54, 0, 5.98, FACE.n); // pivots on its hinge
  add(fdoor, B(1.08, 2.33, 0.05), mat.cherry, -0.54, 1.165, 0);
  add(fdoor, S(0.035), mat.brass, -0.94, 1.05, 0.05); add(fdoor, S(0.035), mat.brass, -0.94, 1.05, -0.05);
  refs.frontDoor = fdoor;

  // =====================================================================
  // KITCHEN
  // =====================================================================
  const kitchen = new THREE.Group(); scene.add(kitchen);
  const cab = M(0xffffff, { map: T.woodTex("#b98a52", 21, [1, 1], 4), r: 0.6 });
  const counterTop = M(0xe8e2d3, { r: 0.3 });
  // base cabinets along the east wall: z from -3.4 to 3.4, front faces -x
  const run = group(kitchen, 13.6, 0, 0, FACE.w);
  add(run, B(6.8, 0.88, 0.62), cab, 0, 0.44, 0);
  add(run, B(6.9, 0.05, 0.68), counterTop, 0, 0.905, 0.03);
  add(run, B(6.8, 0.08, 0.5), M(0x1a1a1a), 0, 0.04, 0.02);
  // cabinet doors (decorative), skipping the junk-drawer zone
  for (let z = -3.0; z <= 3.0; z += 0.6) {
    if (z > 0.95 && z < 2.7) continue;
    add(run, B(0.56, 0.6, 0.02), cab, z, 0.4, 0.32); add(run, B(0.12, 0.02, 0.02), mat.metal, z + 0.18 * Math.sign(z || 1), 0.62, 0.34, false);
  }
  // sink under the window
  add(run, B(0.8, 0.02, 0.45), mat.metal, 0, 0.92, 0.0, false);
  add(run, C(0.02, 0.02, 0.32, 8), mat.metal, 0, 1.06, -0.22).rotation.x = 0.0;
  // upper cabinets (around the window)
  [[-2.3, 2.0], [2.3, 2.0]].forEach(([z, w]) => { add(run, B(w, 0.75, 0.36), cab, z, 2.25, -0.13); });
  // junk drawer: wide drawer spanning z 1.0..2.6 (local x), slides along local +z
  const drawerGroup = group(run, 1.8, 0, 0.0);
  const dW = 1.5, dD = 0.56;
  const drawer = group(drawerGroup, 0, 0, 0);
  const box = M(0xc9a06a, { r: 0.8 });
  add(drawer, B(dW, 0.02, dD), box, 0, 0.6, 0.02);
  add(drawer, B(dW, 0.18, 0.02), box, 0, 0.69, -dD / 2 + 0.03);
  add(drawer, B(0.02, 0.18, dD), box, -dW / 2, 0.69, 0.02); add(drawer, B(0.02, 0.18, dD), box, dW / 2, 0.69, 0.02);
  add(drawer, B(dW + 0.06, 0.2, 0.04), cab, 0, 0.68, dD / 2 + 0.02);
  add(drawer, B(0.3, 0.025, 0.04), mat.brass, 0, 0.625, dD / 2 + 0.06);
  add(drawer, new THREE.PlaneGeometry(0.42, 0.09), M(0xffffff, { map: T.labelTex("JUNK", { bg: "#f5efd8", fg: "#333", font: "bold 70px 'Comic Sans MS', cursive", w: 256, h: 64 }) }), 0, 0.715, dD / 2 + 0.042, false);
  refs.drawer = { group: drawer, open: 0, target: 0, trinkets: [] };
  hot(drawer, { id: "drawer", label: "The junk drawer", desc: "Every house has one. Mine is full of tiny web tools. Click to open it.", action: { type: "drawer" }, focus: [0, 0.75, 1.2] });
  // trinkets laid out in a grid inside the drawer
  const cols = 7, rows = 3;
  TRINKETS.forEach((tk, i) => {
    const c = i % cols, r = Math.floor(i / cols);
    const tx = -dW / 2 + 0.12 + c * ((dW - 0.24) / (cols - 1)), tz = -dD / 2 + 0.12 + r * ((dD - 0.2) / (rows - 1));
    const tg = group(drawer, tx, 0.615, tz + 0.02, (i * 0.7) % 0.6 - 0.3);
    buildTrinket(tg, tk.shape);
    tg.visible = true;
    hot(tg, { id: "tk-" + tk.id, label: tk.name, desc: tk.desc, action: { type: "toolbox", id: tk.id, title: tk.name }, inDrawer: true });
    refs.drawer.trinkets.push(tg);
  });
  // drawer junk filler (not clickable)
  for (let i = 0; i < 14; i++) {
    const j = add(drawer, B(0.03 + Math.random() * 0.05, 0.01, 0.01 + Math.random() * 0.03), M(new THREE.Color().setHSL(Math.random(), 0.6, 0.5)), -dW / 2 + 0.05 + Math.random() * (dW - 0.1), 0.616, -dD / 2 + 0.05 + Math.random() * (dD - 0.1), false);
    j.rotation.y = Math.random() * 3;
  }
  updaters.push((t, dt) => {
    const d = refs.drawer; d.open += (d.target - d.open) * Math.min(1, dt * 6);
    d.group.position.z = d.open * 0.6;
  });

  // fridge with magnet slogan board (front faces -x)
  const fridge = group(kitchen, 13.3, 0, -4.35, FACE.w);
  add(fridge, B(0.95, 1.95, 0.75), M(0xf1efe8, { r: 0.35 }), 0, 0.975, 0);
  add(fridge, B(0.93, 0.01, 0.01), M(0x999999), 0, 1.35, 0.378, false);
  add(fridge, B(0.03, 0.35, 0.04), mat.metal, -0.38, 1.6, 0.4); add(fridge, B(0.03, 0.35, 0.04), mat.metal, -0.38, 1.05, 0.4);
  const fridgeScreen = new T.CanvasScreen(512, 512); refs.fridgeScreen = fridgeScreen;
  const fz = add(fridge, new THREE.PlaneGeometry(0.8, 0.8), new THREE.MeshStandardMaterial({ map: fridgeScreen.texture, transparent: true, roughness: 0.5 }), 0.03, 0.85, 0.377, false);
  fz.userData.keepMat = true;
  hot(fridge, { id: "fridge", label: "Fridge magnets", desc: "Words to live by, rearranged daily. Click for a new one.", action: { type: "slogan" }, focus: [0, 1.05, 1.6] });

  // kitchen table
  const kt = group(kitchen, 9.6, 0, 2.6);
  add(kt, C(0.6, 0.6, 0.05, 28), mat.oak, 0, 0.75, 0); add(kt, C(0.06, 0.12, 0.73, 10), mat.oak, 0, 0.37, 0);
  [[-0.85, 0, FACE.e], [0.85, 0, FACE.w]].forEach(([x, z, f]) => {
    const ch = group(kt, x, 0, z, f); add(ch, B(0.42, 0.05, 0.42), mat.oak, 0, 0.46, 0);
    [[-0.18, -0.18], [0.18, -0.18], [-0.18, 0.18], [0.18, 0.18]].forEach(([a, b]) => add(ch, B(0.04, 0.46, 0.04), mat.oak, a, 0.23, b));
    add(ch, B(0.42, 0.5, 0.04), mat.oak, 0, 0.73, -0.19);
  });
  const bowl = group(kt, 0, 0.78, 0);
  add(bowl, S(0.18, 16, 8, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), M(0x2f6aa3, { side: THREE.DoubleSide }), 0, 0.17, 0).rotation.x = Math.PI;
  [[0xd33, -0.05, 0.03], [0xfa0, 0.06, -0.02], [0x6c3, 0, 0.07]].forEach(([c, x, z]) => add(bowl, S(0.055, 10, 8), M(c), x, 0.08, z));
  swap(kt);
  // wall clock
  const clk = group(kitchen, 10, 2.3, -4.9, FACE.s);
  add(clk, C(0.25, 0.25, 0.05, 28), M(0xffffff), 0, 0, 0).rotation.x = Math.PI / 2;
  const hh = add(clk, B(0.02, 0.13, 0.01), mat.black, 0, 0.05, 0.03, false), mh = add(clk, B(0.012, 0.2, 0.01), mat.black, 0, 0.08, 0.035, false);
  updaters.push(() => {
    const d = new Date(), m = d.getMinutes() + d.getSeconds() / 60, h = (d.getHours() % 12) + m / 60;
    hh.rotation.z = -h / 12 * Math.PI * 2; hh.position.set(Math.sin(h / 12 * Math.PI * 2) * 0.05, Math.cos(h / 12 * Math.PI * 2) * 0.05, 0.03);
    mh.rotation.z = -m / 60 * Math.PI * 2; mh.position.set(Math.sin(m / 60 * Math.PI * 2) * 0.08, Math.cos(m / 60 * Math.PI * 2) * 0.08, 0.035);
  });

  // =====================================================================
  // DEN
  // =====================================================================
  const den = new THREE.Group(); scene.add(den);
  // certificate wall (west wall, facing +x)
  const certWall = group(den, -13.9, 0, 0, FACE.e);
  CERTIFICATIONS.forEach((c, i) => {
    const col = i % 3, row = Math.floor(i / 3);
    const f = group(certWall, (col - 1) * 1.05, 2.3 - row * 0.85, 0);
    add(f, B(0.82, 0.64, 0.04), mat.cherryDark);
    const cp = add(f, new THREE.PlaneGeometry(0.72, 0.54), M(0xffffff, { map: T.certificateTex(c), r: 0.7 }), 0, 0, 0.022, false);
    swap(f); f.userData.certTex = cp.material.map; refs.certFrames.push(f);
    hot(f, { id: "cert-" + i, label: c.name + (c.code ? " (" + c.code + ")" : ""), desc: c.issuer + " — click to open the trophy room record.", action: { type: "panel", panel: "accomplishments" }, focus: [0, 0, 1.3] });
  });
  add(certWall, new THREE.PlaneGeometry(1.5, 0.24), M(0xffffff, { map: T.labelTex("CERTIFICATIONS", { bg: "#3a2414", fg: "#e9c46a", font: "bold 54px Georgia", w: 600, h: 96 }) }), 0, 2.98, 0.01, false);
  // reading desk + lamp (decor)
  const dd = group(den, -8.3, 0, -4.4, FACE.s);
  add(dd, B(1.4, 0.06, 0.7), mat.cherry, 0, 0.75, 0);
  [[-0.65, -0.3], [0.65, -0.3], [-0.65, 0.3], [0.65, 0.3]].forEach(([x, z]) => add(dd, B(0.06, 0.72, 0.06), mat.cherryDark, x, 0.36, z));
  add(dd, C(0.08, 0.1, 0.03, 12), mat.brass, 0.45, 0.79, -0.15); add(dd, C(0.012, 0.012, 0.4, 6), mat.brass, 0.45, 0.99, -0.15);
  add(dd, C(0.06, 0.16, 0.16, 14, 1, true), M(0x1f5c3a, { e: 0x1f5c3a, ei: 0.3, side: THREE.DoubleSide }), 0.45, 1.2, -0.15);
  const dl = new THREE.PointLight(0xffd9a0, 1.2, 3, 2); dl.position.set(0.45, 1.1, -0.15); dd.add(dl);

  // bookshelf on north wall (front faces +z) with the Leviathan clue
  const bs = group(den, -13.72, 0, -3.5, FACE.e);
  add(bs, B(2.4, 0.06, 0.4), mat.cherryDark, 0, 2.4, 0);
  add(bs, B(0.06, 2.4, 0.4), mat.cherryDark, -1.17, 1.2, 0); add(bs, B(0.06, 2.4, 0.4), mat.cherryDark, 1.17, 1.2, 0);
  add(bs, B(2.4, 2.4, 0.02), mat.cherryDark, 0, 1.2, -0.19);
  const titles = ["PMBOK", "SQL", "Dune", "Hobbit", "Scrum", "JS", "CSS", "Atlas", "Poems", "Hades", "Myths", "IT", "Cosmos", "Data", "Zen", "Agile", "Odyssey", "Python", "Art", "Azure"];
  const cols2 = ["#7a1f1f", "#1f3f7a", "#2f6a3a", "#6a4a1f", "#4a2a6a", "#8a6a1a", "#205a5a"];
  let ti = 0;
  for (let s = 0; s < 4; s++) {
    const y = 0.08 + s * 0.58; add(bs, B(2.3, 0.04, 0.38), mat.cherryDark, 0, y, 0);
    let x = -1.08;
    while (x < 1.0) {
      const w = 0.05 + ((ti * 37) % 5) * 0.012, h = 0.32 + ((ti * 13) % 6) * 0.03;
      if (s === 2 && x > 0.1 && x < 0.2) {
        // the clue book: sticks out a little and glows faintly
        const lev = group(bs, x + 0.04, y + 0.02, 0.06);
        add(lev, B(0.08, 0.44, 0.3), M(0x2a1a0e, { r: 0.6 }), 0, 0.22, 0);
        add(lev, new THREE.PlaneGeometry(0.075, 0.42), M(0xffffff, { map: T.spineTex("LEVIATHAN", "#2a1a0e") }), 0, 0.22, 0.151, false);
        hot(lev, { id: "leviathan", label: "Leviathan — T. Hobbes, 1651", desc: "An old book that sticks out further than the rest. Someone has been reading it.", action: { type: "panel", panel: "leviathan" }, focus: [0, 0.25, 0.8] });
        x += 0.1; continue;
      }
      const b = add(bs, B(w, h, 0.28), M(0xffffff, { map: T.spineTex(titles[ti % titles.length], cols2[ti % cols2.length]) }), x + w / 2, y + 0.02 + h / 2, 0.02);
      b.rotation.z = ((ti * 7) % 9 === 0) ? 0.12 : 0;
      x += w + 0.008; ti++;
    }
  }

  // volunteering shelf on south wall (front faces -z)
  const vs = group(den, -13.65, 0, 3.45, FACE.e);
  add(vs, B(2.8, 0.85, 0.45), mat.cherry, 0, 0.425, 0);
  add(vs, B(2.9, 0.04, 0.5), mat.cherryDark, 0, 0.87, 0);
  add(vs, new THREE.PlaneGeometry(1.6, 0.26), M(0xffffff, { map: T.labelTex("GIVING BACK", { bg: "#3a2414", fg: "#e9c46a", font: "bold 54px Georgia", w: 600, h: 96 }) }), 0, 2.4, 0.2, false);
  VOLUNTEERING.forEach((v, i) => {
    const g = group(vs, -1.05 + i * 0.7, 0.89, 0);
    buildVolunteerProp(g, v.prop);
    hot(g, { id: "vol-" + v.id, label: v.name, desc: v.detail, action: { type: "panel", panel: "accomplishments" }, focus: [0, 0.35, 1.1] });
  });

  // museum case: the Archive
  const mc = group(den, -9.3, 0, 3.9, FACE.e - 0.6);
  add(mc, B(0.9, 0.95, 0.9), M(0x1c1c1c, { r: 0.4 }), 0, 0.475, 0);
  add(mc, B(0.9, 0.7, 0.9), mat.glass, 0, 1.3, 0, false).userData.keepMat = true;
  add(mc, B(0.92, 0.03, 0.92), mat.brass, 0, 1.66, 0);
  const pi = add(mc, B(0.22, 0.02, 0.15), M(0x1a7a3a, { r: 0.4 }), -0.22, 0.98, 0.1); pi.rotation.y = 0.4; // raspberry pi board
  add(mc, B(0.05, 0.02, 0.05), mat.metal, -0.2, 1.0, 0.1);
  add(mc, S(0.09, 16, 12), M(0xf28a1c, { r: 0.3, m: 0.3 }), 0.2, 1.06, -0.12); // overwatch-ish orb
  const axe = group(mc, 0.05, 0.96, 0.2); add(axe, B(0.03, 0.03, 0.3), mat.oak, 0, 0.02, 0); add(axe, B(0.08, 0.02, 0.06), mat.metal, 0, 0.02, -0.15);
  add(mc, new THREE.PlaneGeometry(0.5, 0.12), M(0xffffff, { map: T.labelTex("THE ARCHIVE", { bg: "#c9a54a", fg: "#1c1c1c", font: "bold 60px Georgia" }) }), 0, 0.8, 0.452, false);
  hot(mc, { id: "archived", label: "The Archive (museum case)", desc: "Retired apps, preserved: Overwatch Workshop Repository, Raspberry Pi Designer, Garage to Table.", action: { type: "app", app: "archived" }, focus: [0, 1.2, 1.6] });
  // leather chair


  // =====================================================================
  // REC ROOM
  // =====================================================================
  const rec = new THREE.Group(); scene.add(rec);
  const carpet = add(rec, new THREE.PlaneGeometry(6, 4.5), M(0x7a3b8c, { r: 1 }), 0, 0.012, -10.4, false); carpet.rotation.x = -Math.PI / 2;

  // arcade cabinet -> 404 gallery
  const arc = group(rec, -4.9, 0, -12.9, FACE.s + 0.35);
  const arcBody = M(0x3a2a8a, { r: 0.5 });
  add(arc, B(0.75, 1.9, 0.75), arcBody, 0, 0.95, 0);
  add(arc, B(0.75, 0.3, 0.5), arcBody, 0, 1.0, 0.45);
  const arcScreen = new T.CanvasScreen(256, 256); refs.arcScreen = arcScreen;
  const as = add(arc, new THREE.PlaneGeometry(0.58, 0.5), new THREE.MeshBasicMaterial({ map: arcScreen.texture }), 0, 1.45, 0.38, false); as.rotation.x = -0.15; as.userData.keepMat = true;
  add(arc, new THREE.PlaneGeometry(0.7, 0.18), new THREE.MeshBasicMaterial({ map: T.labelTex("404 ARCADE", { bg: "#ff2fa0", fg: "#fff", font: "bold 66px 'Courier New'" }) }), 0, 1.98, 0.376, false).userData.keepMat = true;
  add(arc, C(0.02, 0.02, 0.1, 8), mat.black, -0.15, 1.2, 0.55); add(arc, S(0.035), M(0xff2020), -0.15, 1.26, 0.55);
  [0.05, 0.15, 0.25].forEach((x, i) => add(arc, C(0.03, 0.03, 0.02, 12), M([0x2a8cff, 0xffd400, 0x20d050][i]), x, 1.16, 0.55));
  hot(arc, { id: "arcade", label: "404 Arcade cabinet", desc: "Insert coin. Every way to get lost on this site, in one machine.", action: { type: "url", url: "404.html", title: "404 Arcade" }, focus: [0, 1.4, 1.5] });

  // MGS cardboard box + codec (Kojima Name Generator)
  const kb = group(rec, -1.7, 0, -11.6, FACE.s + 0.25);
  const cardboard = M(0xb48a55, { r: 0.95 });
  const boxM = add(kb, B(0.9, 0.7, 0.7), cardboard, 0, 0.35, 0);
  add(kb, B(0.9, 0.02, 0.06), M(0xc8a16a), 0, 0.705, 0, false);
  add(kb, new THREE.PlaneGeometry(0.4, 0.2), M(0xffffff, { map: T.labelTex("FRAGILE", { bg: null, fg: "#7a1a1a", font: "bold 70px Arial" }), t: true }), 0.1, 0.4, 0.351, false);
  swap(kb);
  const codec = group(kb, -0.1, 0.71, 0.05);
  add(codec, B(0.22, 0.05, 0.14), M(0x2a2f2a, { r: 0.4 }), 0, 0.025, 0);
  add(codec, new THREE.PlaneGeometry(0.15, 0.08), M(0x0, { e: 0x38ff9a, ei: 0.7 }), 0, 0.0505, 0.0, false).rotation.x = -Math.PI / 2;
  add(codec, C(0.004, 0.004, 0.18, 4), mat.metal, 0.09, 0.12, -0.04);
  const bang = add(kb, new THREE.PlaneGeometry(0.25, 0.35), new THREE.MeshBasicMaterial({ map: T.labelTex("!", { bg: null, fg: "#ff2a2a", font: "bold 220px Impact", w: 128, h: 192 }), transparent: true, depthWrite: false }), 0, 1.35, 0, false);
  bang.visible = false; bang.userData.keepMat = true; refs.bang = bang;
  hot(kb, { id: "kojima", label: "A suspicious cardboard box", desc: "Kojima Name Generator — tune the codec and forge your true codename.", action: { type: "app", app: "kojima" }, focus: [0, 0.8, 1.6], onHover: on => { bang.visible = on; kb.position.y = on ? 0.04 : 0; } });

  // card table: Everybody is John
  const tt = group(rec, 2.0, 0, -10.6);
  add(tt, C(0.6, 0.6, 0.05, 28), M(0x1f6a3a, { r: 0.95 }), 0, 0.74, 0);
  add(tt, C(0.62, 0.62, 0.04, 28, 1, true), mat.cherryDark, 0, 0.74, 0);
  add(tt, C(0.05, 0.1, 0.72, 10), mat.cherryDark, 0, 0.36, 0);
  const dieMat = M(0xf5f1e6, { r: 0.4 });
  const d6 = add(tt, B(0.07, 0.07, 0.07), dieMat, -0.15, 0.8, 0.1); d6.rotation.set(0.2, 0.6, 0);
  const d6b = add(tt, B(0.07, 0.07, 0.07), M(0xb42020, { r: 0.4 }), -0.05, 0.8, 0.2); d6b.rotation.y = 1.1;
  const john = group(tt, 0.15, 0.765, -0.05);
  const jm = M(0x2a6ad0, { r: 0.6 });
  add(john, C(0.03, 0.05, 0.1, 10), jm, 0, 0.05, 0); add(john, S(0.03, 10, 8), jm, 0, 0.13, 0);
  add(tt, B(0.2, 0.002, 0.28), M(0xfbfaf4), 0.25, 0.768, 0.25, false).rotation.y = 0.4;
  hot(tt, { id: "john", label: "Game night table", desc: "Everybody is John — a companion app for the tabletop RPG where every player is a voice in one man's head.", action: { type: "app", app: "everybodyisjohn" }, focus: [0, 1.0, 1.25] });

  // Lost at Sea: life ring on east wall + message in a bottle
  const ls = group(rec, 5.9, 0, -9.6, FACE.w);
  const ring = add(ls, new THREE.TorusGeometry(0.3, 0.09, 12, 28), M(0xf04a2a, { r: 0.6 }), 0, 1.75, 0.08);
  for (let i = 0; i < 4; i++) { const b = add(ls, new THREE.TorusGeometry(0.3, 0.095, 6, 6, 0.35), M(0xffffff), 0, 1.75, 0.08, false); b.rotation.z = i * Math.PI / 2 + 0.6; }
  swap(ls);
  add(ls, B(0.6, 0.05, 0.3), M(0x9a8a6a, { r: 1 }), 0, 0.9, 0.15);
  const bottle = group(ls, 0, 0.93, 0.15, 0); bottle.rotation.z = Math.PI / 2;
  add(bottle, C(0.06, 0.06, 0.24, 14), M(0x5aa080, { t: true, op: 0.55, r: 0.1 }), 0, 0, 0).userData.keepMat = false;
  add(bottle, C(0.025, 0.05, 0.08, 12), M(0x5aa080, { t: true, op: 0.55, r: 0.1 }), 0, 0.16, 0);
  add(bottle, C(0.024, 0.024, 0.04, 8), M(0x9a6a3a), 0, 0.22, 0);
  add(bottle, C(0.025, 0.025, 0.14, 8), M(0xf3e7c4), 0, 0, 0);
  ring.castShadow = true;
  hot(ls, { id: "lostatsea", label: "Life ring & message in a bottle", desc: "Lost at Sea — rank 15 salvaged items before the clock runs out.", action: { type: "app", app: "lostatsea" }, focus: [0, 1.4, 1.8] });

  // Christmas tree + presents (Secret Santa)
  const xt = group(rec, 4.5, 0, -12.8);
  add(xt, C(0.08, 0.1, 0.3, 8), M(0x5a3d26), 0, 0.15, 0);
  const pine = M(0x1f5a32, { flat: true });
  [[0.75, 0.6, 0.5], [0.6, 0.55, 0.95], [0.42, 0.5, 1.35], [0.25, 0.45, 1.7]].forEach(([r, h, y]) => add(xt, new THREE.ConeGeometry(r, h, 9), pine, 0, y, 0));
  add(xt, new THREE.OctahedronGeometry(0.09), M(0xffd400, { e: 0xffb000, ei: 0.8 }), 0, 2.0, 0);
  const bulbs = [];
  for (let i = 0; i < 22; i++) {
    const a = i * 2.4, y = 0.45 + (i / 22) * 1.35, r = 0.68 * (1 - (y - 0.3) / 1.6);
    bulbs.push(add(xt, S(0.03, 8, 6), M([0xff3030, 0x30a0ff, 0xffd400, 0x30ff70][i % 4], { e: [0xff3030, 0x30a0ff, 0xffd400, 0x30ff70][i % 4], ei: 0.8 }), Math.cos(a) * r, y, Math.sin(a) * r, false));
  }
  updaters.push(t => bulbs.forEach((b, i) => { b.material.emissiveIntensity = (Math.sin(t * 3 + i) > 0) ? 1.2 : 0.15; }));
  const presents = group(xt, 0, 0, 0);
  [[0.55, 0.3, 0x2050c0, 0.3], [0.1, 0.62, 0xc02030, 0.24], [-0.5, 0.35, 0x20a060, 0.28]].forEach(([x, z, c, s]) => {
    add(presents, B(s, s * 0.8, s), M(c, { r: 0.5 }), x, s * 0.4, z);
    add(presents, B(s + 0.005, s * 0.8 + 0.005, 0.04), M(0xffd400, { r: 0.3, m: 0.4 }), x, s * 0.4, z, false);
    add(presents, B(0.04, s * 0.8 + 0.006, s + 0.005), M(0xffd400, { r: 0.3, m: 0.4 }), x, s * 0.4, z, false);
  });
  hot(xt, { id: "secretsanta", label: "Tree & presents", desc: "Secret Santa — draw names so nobody gets themselves, then reveal privately.", action: { type: "app", app: "secretsanta" }, focus: [-0.3, 1.0, 2.0] });

  // the symbols plaque (ARG)
  const sp = group(rec, 0, 2.15, -13.9, FACE.s);
  add(sp, B(2.4, 0.42, 0.06), mat.cherryDark);
  const symScreen = new T.CanvasScreen(1024, 160); refs.symScreen = symScreen;
  add(sp, new THREE.PlaneGeometry(2.25, 0.34), new THREE.MeshStandardMaterial({ map: symScreen.texture, roughness: 0.6 }), 0, 0, 0.032, false).userData.keepMat = true;
  hot(sp, { id: "symbols", label: "A plaque of strange symbols", desc: "“c u r i o s i t y is the lust of the mind”", action: { type: "symbols" }, focus: [0, -0.2, 2.2] });
  refs.symbols = sp;

  // bean bag + lava lamp
  const bb = add(rec, S(0.55, 18, 12), M(0xd07a1a, { r: 0.9 }), 1.6, 0.32, -12.6); bb.scale.set(1, 0.55, 1);
  const ll = group(rec, -3.2, 0, -13.5);
  add(ll, C(0.1, 0.14, 0.18, 12), mat.metal, 0, 0.09, 0);
  add(ll, C(0.07, 0.11, 0.42, 14), M(0xff4fa0, { e: 0xff2f80, ei: 0.5, t: true, op: 0.85 }), 0, 0.39, 0);
  add(ll, C(0.04, 0.07, 0.1, 12), mat.metal, 0, 0.65, 0);
  const lavaL = new THREE.PointLight(0xff4fa0, 1.4, 3.5, 2); lavaL.position.set(0, 0.6, 0.2); ll.add(lavaL);

  // =====================================================================
  // CATS — three family cats lounging around, plus a mysterious visitor
  // =====================================================================
  const catDefs = [
    { cat: CATS[0], parent: living, pos: [-2.85, 0.55, -0.4], face: FACE.e, pose: "loaf" },
    { cat: CATS[1], parent: rec, pos: [1.6, 0.62, -12.6], face: FACE.s + 0.6, pose: "curl" },
    { cat: CATS[2], parent: kitchen, pos: [13.3, 1.95, -4.35], face: FACE.w, pose: "loaf" }
  ];
  catDefs.forEach((d, i) => {
    const g = group(d.parent, ...d.pos, d.face);
    const parts = buildCat(g, d.cat, d.pose);
    updaters.push(t => { parts.tail.rotation.z = Math.sin(t * 1.5 + i) * 0.35; parts.body.scale.y = 1 + Math.sin(t * 2 + i) * 0.02; });
    hot(g, { id: "cat-" + i, label: d.cat.name, desc: ["Mrrp.", "…purrrrrrr.", "*slow blink*"][i], action: { type: "cat", i }, focus: [0, 0.3, 1.0] });
  });
  // the Khajiit (hidden until the ARG calls for him)
  const kj = group(living, -1.25, 0, -4.7, FACE.s + 0.4);
  const kparts = buildCat(kj, { color: "#c9a26a", stripe: "#8a6a3a" }, "sit");
  add(kj, B(0.16, 0.18, 0.08), M(0x6a3a1a), 0, 0.28, -0.14);
  const purse = group(kj, 0.22, 0, 0.12);
  add(purse, S(0.07, 12, 10), M(0x7a4a1a, { r: 0.9 }), 0, 0.06, 0).scale.set(1, 0.85, 1);
  add(purse, C(0.02, 0.035, 0.04, 8), M(0x7a4a1a), 0, 0.13, 0);
  add(purse, new THREE.TorusGeometry(0.03, 0.006, 6, 12), mat.brass, 0, 0.15, 0);
  for (let i = 0; i < 5; i++) add(purse, C(0.02, 0.02, 0.004, 12), mat.brass, (i - 2) * 0.03, 0.002 + (i % 2) * 0.004, 0.08);
  kj.visible = false; refs.khajiit = kj;
  updaters.push(t => { if (kj.visible) kparts.tail.rotation.z = Math.sin(t * 2.2) * 0.4; });
  hot(kj, { id: "khajiit", label: "A travelling merchant cat", desc: "Khajiit has wares, if you have coin.", action: { type: "khajiit" }, focus: [0, 0.5, 1.6], hidden: true });

  // doorway hotspots (light up on hover, like Navigator)
  function doorway(room, x, z, axis, label) {
    const g = group(scene, x, 1.17, z, axis === "x" ? 0 : Math.PI / 2);
    const m = new THREE.MeshBasicMaterial({ color: 0xffe9a8, transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide });
    const pl = new THREE.Mesh(new THREE.PlaneGeometry(axis === "x" ? 1.7 : 1.9, 2.3), m); pl.userData.keepMat = true; g.add(pl);
    hot(g, { id: "door-" + room + "-" + x + z, label: label, desc: "Walk through to the " + label.replace(/^→ /, "") + ".", action: { type: "room", room }, door: true, onHover: on => { m.opacity = on ? 0.22 : 0; } });
  }
  doorway("rec", 4.5, -6, "x", "→ Rec Room");
  doorway("living", 4.5, -6.02, "x", "→ Living Room");
  doorway("kitchen", 6, 0, "z", "→ Kitchen");
  doorway("living", 6.02, 0, "z", "→ Living Room");
  doorway("den", -6, 0, "z", "→ Den");
  doorway("living", -6.02, 0, "z", "→ Living Room");

  refs.g = { living, kitchen, den, rec, fp, portrait, ent, tv, ct, ballot, desk, chair, st, plant, kt, run, dd, kb, codec, ls, tt, mc, bs, vs, form, xt, arc, clk };
  refs.mat = mat;
  return { hotspots, updaters, refs, hot };
}

// ---------------------------------------------------------------- cats
function buildCat(g, cat, pose) {
  const fur = M(cat.color, { r: 0.95 }), stripe = M(cat.stripe, { r: 0.95 });
  const body = add(g, S(0.16, 14, 10), fur, 0, 0.12, 0); body.scale.set(1, pose === "sit" ? 1.3 : 0.8, pose === "curl" ? 1.2 : 1.5);
  if (pose === "sit") body.position.set(0, 0.17, -0.02);
  const head = add(g, S(0.095, 14, 10), fur, 0, pose === "sit" ? 0.38 : 0.24, pose === "curl" ? 0.14 : 0.2);
  [-1, 1].forEach(s => {
    const e = add(g, new THREE.ConeGeometry(0.035, 0.07, 4), fur, s * 0.055, head.position.y + 0.09, head.position.z); e.rotation.z = -s * 0.25;
    add(g, S(0.014, 8, 6), M(0xc9f26a, { e: 0x88aa22, ei: 0.4 }), s * 0.035, head.position.y + 0.015, head.position.z + 0.08, false);
  });
  add(g, S(0.012, 6, 4), M(0xf29bb0), 0, head.position.y - 0.02, head.position.z + 0.092, false);
  for (let k = -1; k <= 1; k++) add(g, B(0.012, 0.003, 0.05), stripe, k * 0.03, head.position.y + 0.09, head.position.z - 0.01, false);
  const tail = new THREE.Group(); tail.position.set(0, 0.1, pose === "sit" ? -0.18 : -0.22); g.add(tail);
  const tm = add(tail, C(0.022, 0.03, 0.3, 8), fur, 0.12, 0.0, 0); tm.rotation.z = Math.PI / 2.4;
  return { body, head, tail };
}

// ---------------------------------------------------------------- volunteering props
function buildVolunteerProp(g, kind) {
  if (kind === "hardhat") {
    add(g, S(0.14, 18, 10, 0, Math.PI * 2, 0, Math.PI / 2), M(0xffc400, { r: 0.4 }), 0, 0.02, 0);
    add(g, C(0.2, 0.2, 0.015, 24), M(0xffc400, { r: 0.4 }), 0, 0.02, 0.02);
    const hm = group(g, 0.12, 0.01, 0.12, 0.6);
    add(hm, B(0.03, 0.025, 0.3), M(0x9a6a3a), 0, 0.012, 0); add(hm, B(0.12, 0.04, 0.04), mat0(), 0, 0.02, -0.15);
  } else if (kind === "ladle") {
    add(g, C(0.12, 0.1, 0.22, 20, 1, true), M(0xb8bcc4, { r: 0.3, m: 0.8, side: THREE.DoubleSide }), 0, 0.11, 0);
    add(g, C(0.1, 0.1, 0.01, 20), M(0xb8bcc4, { r: 0.3, m: 0.8 }), 0, 0.005, 0);
    const l = group(g, 0.04, 0.2, 0, 0); l.rotation.z = -0.4;
    add(l, C(0.008, 0.008, 0.38, 6), M(0xb8bcc4, { r: 0.3, m: 0.8 }), 0, 0.1, 0); add(l, S(0.045, 12, 8, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), M(0xb8bcc4, { r: 0.3, m: 0.8, side: THREE.DoubleSide }), 0, -0.1, 0);
  } else if (kind === "trophy") {
    const gold = M(0xd8b030, { r: 0.25, m: 0.9 });
    add(g, B(0.16, 0.06, 0.16), M(0x2a1a0e), 0, 0.03, 0); add(g, C(0.02, 0.03, 0.14, 10), gold, 0, 0.13, 0);
    add(g, C(0.09, 0.04, 0.14, 18), gold, 0, 0.27, 0);
    [-1, 1].forEach(s => { const h = add(g, new THREE.TorusGeometry(0.04, 0.008, 6, 12, Math.PI), gold, s * 0.09, 0.28, 0); h.rotation.z = s > 0 ? -Math.PI / 2 : Math.PI / 2; });
  } else if (kind === "mug") {
    add(g, C(0.06, 0.055, 0.13, 16), M(0x0a66c2, { r: 0.4 }), 0, 0.065, 0);
    add(g, new THREE.TorusGeometry(0.035, 0.01, 6, 12), M(0x0a66c2, { r: 0.4 }), 0.07, 0.07, 0);
    add(g, C(0.055, 0.055, 0.005, 16), M(0x3a1a0a), 0, 0.12, 0);
    add(g, B(0.28, 0.2, 0.01), M(0xf3e7c4), 0.05, 0.1, -0.12).rotation.x = -0.2; // a framed thank-you note
  }
}
function mat0() { return M(0x666a70, { r: 0.4, m: 0.7 }); }

// ---------------------------------------------------------------- junk-drawer trinkets (~0.15 m)
function buildTrinket(g, shape) {
  const m = (c, o) => M(c, o);
  switch (shape) {
    case "card": add(g, B(0.086, 0.004, 0.054), m(0x1a3a8a, { r: 0.3, m: 0.3 }), 0, 0.002, 0); add(g, B(0.014, 0.0045, 0.011), m(0xd8b030, { m: 0.8, r: 0.3 }), -0.025, 0.003, -0.005, false); break;
    case "coin": add(g, C(0.035, 0.035, 0.008, 24), m(0xe0b030, { m: 0.9, r: 0.25 }), 0, 0.004, 0); add(g, new THREE.PlaneGeometry(0.04, 0.04), m(0xffffff, { map: T.labelTex("₿", { bg: null, fg: "#8a6410", font: "bold 100px Arial", w: 128, h: 128 }), t: true }), 0, 0.0085, 0, false).rotation.x = -Math.PI / 2; break;
    case "piggy": { const p = m(0xf2a0b5, { r: 0.5 }); const b = add(g, S(0.05, 14, 10), p, 0, 0.05, 0); b.scale.set(1, 0.9, 1.25); add(g, C(0.018, 0.018, 0.02, 10), p, 0, 0.05, 0.065).rotation.x = Math.PI / 2; [[-0.025, -0.03], [0.025, -0.03], [-0.025, 0.03], [0.025, 0.03]].forEach(([x, z]) => add(g, C(0.01, 0.01, 0.02, 6), p, x, 0.01, z)); add(g, B(0.02, 0.002, 0.004), m(0x333333), 0, 0.095, 0, false); break; }
    case "calculator": add(g, B(0.07, 0.012, 0.1), m(0x2a2a2a), 0, 0.006, 0); add(g, B(0.055, 0.002, 0.02), m(0x9fb48a, { e: 0x30402a }), 0, 0.013, -0.03, false); for (let i = 0; i < 12; i++) add(g, B(0.01, 0.003, 0.008), m(i % 4 === 3 ? 0xff8a20 : 0xdddddd), -0.019 + (i % 4) * 0.0127, 0.013, -0.005 + Math.floor(i / 4) * 0.015, false); break;
    case "tape": add(g, B(0.06, 0.06, 0.03), m(0xffd400, { r: 0.4 }), 0, 0.03, 0); add(g, C(0.016, 0.016, 0.032, 12), m(0x222222), 0, 0.03, 0).rotation.x = Math.PI / 2; add(g, B(0.05, 0.002, 0.015), m(0xf5f0d0), 0.05, 0.003, 0.0, false); break;
    case "envelope": add(g, B(0.1, 0.004, 0.065), m(0xf4efe2), 0, 0.002, 0); { const f = add(g, new THREE.CircleGeometry(0.05, 3), m(0xe6dfcc), 0, 0.0045, -0.012, false); f.rotation.x = -Math.PI / 2; f.rotation.z = Math.PI / 2; f.scale.set(0.7, 1, 1); } add(g, B(0.014, 0.001, 0.016), m(0xc02020), 0.035, 0.0045, -0.018, false); break;
    case "flipphone": add(g, B(0.045, 0.014, 0.09), m(0x5a6a8a, { r: 0.3, m: 0.5 }), 0, 0.007, 0); add(g, B(0.03, 0.001, 0.025), m(0x88aaff, { e: 0x2244aa }), 0, 0.0145, -0.02, false); add(g, C(0.003, 0.003, 0.03, 6), m(0x222222), 0.016, 0.02, -0.04); break;
    case "parcel": add(g, B(0.07, 0.05, 0.06), m(0xb48a55, { r: 0.95 }), 0, 0.025, 0); add(g, B(0.072, 0.051, 0.012), m(0xd8c090), 0, 0.025, 0, false); break;
    case "cookie": add(g, C(0.035, 0.035, 0.01, 16), m(0xc8904a, { r: 1 }), 0, 0.005, 0); for (let i = 0; i < 6; i++) add(g, S(0.005, 5, 4), m(0x3a1a0a), Math.cos(i * 1.7) * 0.02, 0.011, Math.sin(i * 1.7) * 0.02, false); break;
    case "usb": add(g, B(0.022, 0.009, 0.055), m(0x2a2a2a), 0, 0.0045, 0); add(g, B(0.014, 0.005, 0.016), m(0xc0c4cc, { m: 0.8, r: 0.3 }), 0, 0.004, -0.035); break;
    case "dice": { const a = add(g, B(0.03, 0.03, 0.03), m(0xf5f1e6), -0.02, 0.015, 0); a.rotation.y = 0.4; const b = add(g, B(0.03, 0.03, 0.03), m(0xf5f1e6), 0.02, 0.015, 0.015); b.rotation.y = 1.1; [a, b].forEach(d => add(d, S(0.004, 5, 4), m(0xb02020), 0, 0.016, 0, false)); break; }
    case "ticket": add(g, B(0.09, 0.002, 0.04), m(0xd23a3a), 0, 0.001, 0); add(g, B(0.002, 0.003, 0.04), m(0xf4efe2), 0.025, 0.002, 0, false); break;
    case "stopwatch": add(g, C(0.035, 0.035, 0.015, 20), m(0xc0c4cc, { m: 0.8, r: 0.3 }), 0, 0.0075, 0); add(g, C(0.03, 0.03, 0.002, 20), m(0xffffff), 0, 0.016, 0, false); add(g, C(0.006, 0.006, 0.012, 8), m(0xc0c4cc, { m: 0.8 }), 0, 0.008, -0.04).rotation.x = Math.PI / 2; break;
    case "thermometer": add(g, C(0.005, 0.005, 0.11, 8), m(0xeaf4ff, { t: true, op: 0.7 }), 0, 0.006, 0).rotation.x = Math.PI / 2; add(g, S(0.009, 8, 6), m(0xd02020), 0, 0.007, 0.055); add(g, C(0.0025, 0.0025, 0.07, 6), m(0xd02020), 0, 0.007, 0.02).rotation.x = Math.PI / 2; break;
    case "scorepad": add(g, B(0.07, 0.008, 0.1), m(0xfdf7c8), 0, 0.004, 0); for (let i = 0; i < 5; i++) add(g, B(0.06, 0.001, 0.002), m(0x7aa0d0), 0, 0.0085, -0.035 + i * 0.016, false); add(g, C(0.004, 0.004, 0.1, 6), m(0xffcc22), 0.045, 0.008, 0).rotation.x = Math.PI / 2; break;
    case "d20": add(g, new THREE.IcosahedronGeometry(0.028, 0), m(0x6a2ac0, { r: 0.3, flat: true }), 0, 0.026, 0); break;
    case "scroll": add(g, C(0.016, 0.016, 0.1, 12), m(0xe8d8a8, { r: 0.9 }), 0, 0.016, 0).rotation.z = Math.PI / 2; [-0.055, 0.055].forEach(x => add(g, C(0.006, 0.006, 0.01, 8), m(0x6a3a1a), x, 0.016, 0).rotation.z = Math.PI / 2); add(g, C(0.017, 0.017, 0.012, 12), m(0xb02020), 0, 0.016, 0).rotation.z = Math.PI / 2; break;
    case "pomegranate": add(g, S(0.035, 14, 10), m(0xa01828, { r: 0.4 }), 0, 0.035, 0); add(g, new THREE.ConeGeometry(0.012, 0.02, 6), m(0x7a1020), 0, 0.075, 0); break;
    case "cards": for (let i = 0; i < 3; i++) add(g, B(0.075, 0.002, 0.05), m(0xfafafa), i * 0.006, 0.002 + i * 0.002, i * 0.004, false).rotation.y = i * 0.15; add(g, B(0.06, 0.001, 0.002), m(0xd03030), 0.01, 0.0075, -0.012, false); break;
    case "flashlight": add(g, C(0.014, 0.014, 0.1, 12), m(0x222222, { r: 0.4 }), 0, 0.014, 0).rotation.x = Math.PI / 2; add(g, C(0.022, 0.015, 0.03, 12), m(0x222222, { r: 0.4 }), 0, 0.022, -0.06).rotation.x = Math.PI / 2; add(g, C(0.019, 0.019, 0.002, 12), m(0xfff3c0, { e: 0xffe080, ei: 0.6 }), 0, 0.022, -0.076, false).rotation.x = Math.PI / 2; break;
    case "train": add(g, B(0.05, 0.035, 0.09), m(0x2050a0, { r: 0.4 }), 0, 0.03, 0); add(g, B(0.052, 0.012, 0.092), m(0xff7a1a), 0, 0.03, 0, false); [-0.03, 0.03].forEach(z => [-0.026, 0.026].forEach(x => add(g, C(0.01, 0.01, 0.006, 10), m(0x111111), x, 0.01, z).rotation.z = Math.PI / 2)); break;
    default: add(g, B(0.05, 0.05, 0.05), m(0x888888), 0, 0.025, 0);
  }
}

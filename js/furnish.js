// =====================================================================
//  furnish.js — swaps the blocky placeholder furniture for real CC0
//  models (Poly Haven). Each room loads independently; placeholders stay
//  visible until their model arrives, so nothing ever pops out of existence.
// =====================================================================
import * as THREE from "three";
import { place, contactShadow } from "./assets.js";

const hideSwap = g => g.traverse(c => { if (c.userData.swap) c.visible = false; });

async function put(id, parent, opts = {}) {
  const g = await place(id, { ...opts, parent });
  g.traverse(o => { if (o.isMesh) o.material = Array.isArray(o.material) ? o.material.map(m => m.clone()) : o.material.clone(); });
  if (opts.shadow) { const s = g.userData.size; contactShadow(g, s.x * opts.shadow, s.z * opts.shadow, 0.5); }
  return g;
}
const setMap = (root, matName, tex, rotate = 0, mirror = false) => {
  root.traverse(o => {
    if (!o.isMesh) return;
    const ms = Array.isArray(o.material) ? o.material : [o.material];
    ms.forEach(m => {
      if (m.name && m.name.includes("glass")) { // picture-frame glass: clear, not a dark mirror
        Object.assign(m, { map: null, metalnessMap: null, roughnessMap: null, metalness: 0, roughness: 0.35, transparent: true, opacity: 0.08, depthWrite: false });
        m.color.set(0xffffff); m.needsUpdate = true;
      }
      if (m.name && m.name.includes(matName)) {
        const t = tex.clone(); t.needsUpdate = true; t.center.set(0.5, 0.5); t.rotation = rotate; t.flipY = false; // glTF UVs expect unflipped images
        if (mirror) t.repeat.set(1, -1);
        m.map = t; m.color.set(0xffffff); m.roughness = 0.9; m.metalness = 0; m.normalMap = null; m.emissive?.set(0x000000);
        m.needsUpdate = true;
      }
    });
  });
};
const safe = p => p.catch(e => console.warn("[furnish]", e.message || e));

export function furnish(refs) {
  const g = refs.g;
  const Y = Math.PI;

  // ---------------------------------------------------------------- living room
  const living = Promise.all([
    safe(put("Sofa_01", g.living, { width: 2.1, pos: [-3.2, 0, 5.45], rotY: Y, tint: 0xf0d2a8, shadow: 1.15 }).then(s =>
      put("throw_pillows_01", g.living, { width: 1.2, pos: [-3.2, 0.48, 5.5], rotY: Y }))),
    safe(put("ArmChair_01", g.living, { height: 1.05, pos: [-2.95, 0, -0.4], rotY: Math.PI / 2, tint: 0xe8c39a, shadow: 1.2 })),
    safe(put("ArmChair_01", g.living, { height: 1.05, pos: [2.95, 0, -0.4], rotY: -Math.PI / 2, tint: 0xe8c39a, shadow: 1.2 })),
    safe(put("CoffeeTable_01", g.ct, { width: 1.6, shadow: 1.1 }).then(m => { hideSwap(g.ct); g.ballot.position.y = m.userData.size.y; })),
    safe(put("Television_01", g.tv, { width: 0.95, pos: [0, 0, -0.06] }).then(m => {
      hideSwap(g.tv);
      // fit the animated screen onto the set's glass
      const glass = g.tv.children.find(c => c.isMesh && c.userData.keepMat);
      if (glass) { glass.position.set(-0.135, 0.345, 0.325); glass.scale.set(0.56 / 0.82, 0.47 / 0.6, 1); }
    })),
    safe(put("fancy_picture_frame_01", g.portrait, { width: 1.55, pos: [0, -0.6, 0.035] }).then(m => {
      const plane = g.portrait.children.find(c => c.isMesh && c.material.map && !c.userData.swap && c.geometry.type === "PlaneGeometry");
      if (plane) { setMap(m, "canvas", plane.material.map); plane.visible = false; }
      hideSwap(g.portrait);
    })),
    safe(put("mantel_clock_01", g.fp, { width: 0.36, pos: [-1.0, 1.3, 0.3] })),
    safe(put("painted_wooden_chair_01", g.chair, { height: 0.96, rotY: Y }).then(() => hideSwap(g.chair))),
    safe(put("side_table_01", g.st, { width: 0.5, shadow: 1.2 }).then(m => { hideSwap(g.st); refs.handset?.parent && (refs.handset.parent.position.y = m.userData.size.y); })),
    safe(put("potted_plant_04", g.plant, { height: 0.75 }).then(() => hideSwap(g.plant))),
    safe(put("potted_plant_04", g.living, { height: 0.32, pos: [1.0, 0.7, -5.5] })),
    safe(put("side_table_01", g.bt, { width: 0.55, shadow: 1.2 }).then(m => { hideSwap(g.bt); g.form.position.y = m.userData.size.y; })),
    safe(put("vintage_grandfather_clock_01", g.living, { height: 2.1, pos: [-5.62, 0, 3.1], rotY: Math.PI / 2, shadow: 1.1 })),
    safe(put("ceramic_vase_01", g.fp, { height: 0.32, pos: [-0.55, 1.3, 0.3] }))
  ]);

  // ---------------------------------------------------------------- kitchen
  const kitchen = () => Promise.all([
    safe(put("round_wooden_table_01", g.kt, { width: 1.15, shadow: 1.0 }).then(t => {
      hideSwap(g.kt);
      const top = t.userData.size.y;
      put("wooden_bowl_02", g.kt, { width: 0.36, pos: [0, top, 0] });
      put("jug_01", g.kt, { width: 0.22, pos: [0.3, top, -0.25], rotY: 2.4 });
      [[-0.05, 0.03], [0.06, -0.02], [0, 0.07]].forEach(([x, z], i) => put("food_apple_01", g.kt, { width: 0.09, pos: [x, top + 0.04, z], rotY: i }));
      put("painted_wooden_chair_02", g.kt, { height: 0.98, pos: [-0.85, 0, 0], rotY: Math.PI / 2, shadow: 1.1 });
      put("painted_wooden_chair_02", g.kt, { height: 0.98, pos: [0.85, 0, 0], rotY: -Math.PI / 2, shadow: 1.1 });
    })),
    safe(put("vintage_microwave", g.run, { width: 0.6, pos: [-2.7, 0.94, -0.05] })),
    safe(put("vintage_electric_kettle", g.run, { width: 0.26, pos: [0.62, 0.94, -0.02], rotY: 0.6 })),
    safe(put("electric_stove", g.run, { height: 0.94, pos: [-1.2, 0, -0.04] }).then(s => put("pot_enamel_01", g.run, { width: 0.26, pos: [-1.28, s.userData.size.y, 0.02], rotY: 0.4 }))),
    safe(put("wooden_cutting_board", g.run, { width: 0.42, pos: [2.05, 0.94, -0.02], rotY: 0.15 }).then(b => {
      [[-0.08, 0.02], [0.05, -0.04], [0.12, 0.05]].forEach(([x, z], i) => put("lemon", g.run, { height: 0.085, pos: [2.05 + x, 0.94 + b.userData.size.y, z], rotY: i * 1.3 }));
    })),
    safe(put("wicker_basket_01", g.run, { width: 0.34, pos: [-1.88, 0.94, 0.0] }).then(b => {
      [[-0.07, 0], [0.06, 0.03], [0, -0.05]].forEach(([x, z], i) => put("food_apple_01", g.run, { width: 0.085, pos: [-1.88 + x, 0.94 + 0.04, z], rotY: i * 2 }));
    }))
  ]);

  // ---------------------------------------------------------------- den
  const den = () => Promise.all([
    safe(put("Rockingchair_01", g.den, { height: 1.0, pos: [-9.9, 0, -2.9], rotY: Math.PI / 2 + 0.6, shadow: 1.0 })),
    safe(put("vintage_oil_lamp", g.dd, { height: 0.55, pos: [-0.45, 0.78, -0.15] })),
    safe(put("standing_picture_frame_01", g.dd, { height: 0.28, pos: [0.1, 0.78, -0.1], rotY: -0.3 }).then(m => setMap(m, "artwork", g.portrait.children.find(c => c.isMesh && c.material.map && c.geometry.type === "PlaneGeometry")?.material.map))),
    safe(put("vintage_suitcase", g.den, { width: 1.2, pos: [-7.4, 0, 4.4], rotY: Y + 0.2, shadow: 1.1 })),
    safe(put("GreenChair_01", g.dd, { height: 1.0, pos: [0.15, 0, 0.75], rotY: Y + 0.15, shadow: 1.1 })),
    safe(put("magnifying_glass_01", g.dd, { height: 0.2, pos: [0.15, 0.78, 0.12] }).then(m => { m.rotation.x = -Math.PI / 2; m.position.y = 0.795; })),
    safe(put("book_encyclopedia_set_01", g.bs, { width: 0.6, pos: [0.45, 2.43, -0.02] })),
    safe(put("marble_bust_01", g.bs, { height: 0.45, pos: [-0.6, 2.43, 0], rotY: 0.3 })),
    // giving-back shelf: a real stock pot & spoon for the shelter kitchen, real tools for the carpentry
    refs.vol?.ladle && safe(put("brass_pot_01", refs.vol.ladle, { width: 0.26 }).then(() => { hideSwap(refs.vol.ladle); put("wooden_spoon", refs.vol.ladle, { width: 0.26, pos: [0.16, 0.02, 0.1], rotY: 1.1 }); })),
    refs.vol?.hardhat && safe(put("hand_plane_no4", refs.vol.hardhat, { width: 0.22, pos: [0.17, 0, 0.1], rotY: -0.5 })),
    refs.vol?.hardhat && safe(put("cross_pein_hammer", refs.vol.hardhat, { height: 0.26, pos: [-0.24, 0.012, 0.12] }).then(m => { m.rotation.set(0, 0.5, Math.PI / 2); m.position.y = 0.05; })),
    ...refs.certFrames.map(f => safe(put("hanging_picture_frame_01", f, { height: 0.84 * 1.0 }).then(m => {
      // the model is a portrait frame: lay it on its side so the certificate is landscape
      m.rotation.z = -Math.PI / 2; m.position.set(-0.42, 0, 0); m.scale.multiplyScalar(0.98);
      setMap(m, "artwork", f.userData.certTex, Math.PI / 2, true);
      hideSwap(f);
    })))
  ]);

  // ---------------------------------------------------------------- rec room
  const rec = () => Promise.all([
    safe(put("cardboard_box_01", g.kb, { height: 0.7, rotY: Math.PI / 2, shadow: 1.1 }).then(() => hideSwap(g.kb))),
    safe(put("lifebuoy", g.ls, { width: 0.72, pos: [0, 1.38, 0.08] }).then(() => hideSwap(g.ls))),
    safe(put("dartboard", g.rec, { width: 0.5, pos: [-5.9, 1.4, -9.2], rotY: Math.PI / 2 })),
    safe(put("boombox", g.rec, { width: 0.6, pos: [0.4, 0, -13.5], rotY: 0.3, shadow: 1.1 })),
    safe(put("Ukulele_01", g.rec, { height: 0.6, pos: [-5.7, 0, -7.4], rotY: Math.PI / 2 })),
    safe(put("rubber_duck_toy", g.tt, { width: 0.08, pos: [0.32, 0.765, -0.25], rotY: 2.2 })),
    safe(put("football", g.rec, { width: 0.45, pos: [3.2, 0, -12.9] })),
    safe(put("baseball_01", g.rec, { width: 0.075, pos: [-0.3, 0, -8.0] })),
    safe(put("gamepad", g.rec, { width: 0.3, pos: [1.6, 0.63, -12.4], rotY: -0.4 }))
  ]);

  const kidspace = () => kidspaceFurnish(refs);
  const all = living.then(() => Promise.all([kitchen(), den(), rec(), kidspace()]));
  return { living, all };
}

// ---------------------------------------------------------------- kidspace extras
function kidspaceFurnish(refs) {
  const k = refs.kid; if (!k?.room) return Promise.resolve();
  return Promise.all([
    safe(put("treasure_chest", k.room, { width: 0.85, pos: [-4.1, 0, 1.6], rotY: Math.PI / 2 - 0.3, shadow: 1.1 })),
    safe(put("binoculars", k.desk, { width: 0.17, pos: [0.45, 0.92, 0.45], rotY: 0.8 })),
    safe(put("moon_rock_01", k.room, { width: 0.22, pos: [-1.6, 0.98, -4.0], rotY: 1 })),
    safe(put("seadogs_compass", k.desk, { height: 0.08, pos: [0.2, 0.92, 0.5], rotY: -0.4 })),
    safe(put("postcard_set_01", k.room, { width: 0.6, pos: [4.95, 1.4, 0.6], rotY: -Math.PI / 2 }))
  ]);
}

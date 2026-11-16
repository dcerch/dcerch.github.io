// =====================================================================
//  kidspace.js — Ark KidSpace, the kids' room from Packard Bell Navigator,
//  rebuilt in 3D. A space-station playroom with plasma tubes, a big window
//  (Moon / Mars / Jungle / Beach), a program shelf, labelled drawers, a
//  console desk and a surprise box with a jack-in-the-box guide.
//  All art is original and procedural.
// =====================================================================
import * as THREE from "three";
import { M, add, group, B, C, S, FACE } from "./world.js";
import * as T from "./textures.js";
import { sfx } from "./audio.js";

export const KID_Z = -60;           // room center (z); the room spans x[-5,5] z[-64,-56]
const H = 4;

function canvasTex(w, h, draw) {
  const c = document.createElement("canvas"); c.width = w; c.height = h; draw(c.getContext("2d"), w, h);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t;
}
function rng(seed) { let s = seed; return () => ((s = (s * 16807) % 2147483647) / 2147483647); }

// ---------------------------------------------------------------- window views
const VIEWS = {
  moon(g, W, Hh) {
    g.fillStyle = "#02020a"; g.fillRect(0, 0, W, Hh);
    const r = rng(7);
    for (let i = 0; i < 900; i++) { g.fillStyle = `rgba(255,255,255,${0.3 + r() * 0.7})`; const s = r() < 0.05 ? 2.4 : 1.2; g.fillRect(r() * W, r() * Hh * 0.75, s, s); }
    // lunar ridges
    [[0.62, "#6c6c74", "#2a2a30"], [0.7, "#9a9aa2", "#45454c"], [0.8, "#c8c8cc", "#5a5a60"]].forEach(([y, top, bot], k) => {
      const gr = g.createLinearGradient(0, Hh * y - 80, 0, Hh); gr.addColorStop(0, top); gr.addColorStop(1, bot);
      g.fillStyle = gr; g.beginPath(); g.moveTo(0, Hh);
      for (let x = 0; x <= W; x += 16) g.lineTo(x, Hh * y - Math.abs(Math.sin(x * 0.004 + k * 2) * 70) - Math.abs(Math.sin(x * 0.017 + k)) * 25 - r() * 6);
      g.lineTo(W, Hh); g.fill();
    });
    for (let i = 0; i < 40; i++) { const x = r() * W, y = Hh * (0.84 + r() * 0.14), rr = 6 + r() * 26; g.fillStyle = "rgba(40,40,46,.35)"; g.beginPath(); g.ellipse(x, y, rr, rr * 0.35, 0, 0, 7); g.fill(); g.strokeStyle = "rgba(255,255,255,.18)"; g.stroke(); }
  },
  mars(g, W, Hh) {
    const sky = g.createLinearGradient(0, 0, 0, Hh * 0.7); sky.addColorStop(0, "#3b2a4a"); sky.addColorStop(0.6, "#c9846a"); sky.addColorStop(1, "#f0b48a");
    g.fillStyle = sky; g.fillRect(0, 0, W, Hh);
    const r = rng(3);
    [[0.6, "#6b3a2e", "#3a1e18"], [0.7, "#8a4a32", "#4a2418"], [0.78, "#b06a40", "#6a3a22"]].forEach(([y, top, bot], k) => {
      const gr = g.createLinearGradient(0, Hh * y - 120, 0, Hh); gr.addColorStop(0, top); gr.addColorStop(1, bot);
      g.fillStyle = gr; g.beginPath(); g.moveTo(0, Hh);
      for (let x = 0; x <= W; x += 12) { const mesa = Math.sin(x * 0.006 + k * 3) > 0.55 ? 110 : 0; g.lineTo(x, Hh * y - mesa - Math.sin(x * 0.02 + k) * 14 - r() * 4); }
      g.lineTo(W, Hh); g.fill();
    });
    g.fillStyle = "#c27a4a"; g.fillRect(0, Hh * 0.86, W, Hh * 0.14);
  },
  jungle(g, W, Hh) {
    const sky = g.createLinearGradient(0, 0, 0, Hh); sky.addColorStop(0, "#cfe8a8"); sky.addColorStop(1, "#5a8a3a");
    g.fillStyle = sky; g.fillRect(0, 0, W, Hh);
    const r = rng(11);
    for (let layer = 0; layer < 4; layer++) {
      for (let i = 0; i < 26; i++) {
        const x = r() * W, w = 16 + r() * 30;
        g.fillStyle = ["#7a6a4a", "#5a4a32", "#4a3a26", "#3a2a1a"][layer]; g.fillRect(x, 0, w * (0.4 + layer * 0.2), Hh);
      }
      for (let i = 0; i < 160; i++) {
        g.fillStyle = `hsl(${90 + r() * 40},${40 + r() * 30}%,${18 + layer * 6 + r() * 14}%)`;
        g.beginPath(); g.ellipse(r() * W, r() * Hh, 20 + r() * 60, 8 + r() * 22, r() * 3, 0, 7); g.fill();
      }
    }
    g.strokeStyle = "#2a5a1a"; g.lineWidth = 4;
    for (let i = 0; i < 30; i++) { const x = r() * W; g.beginPath(); g.moveTo(x, 0); g.bezierCurveTo(x + 40, Hh * 0.3, x - 40, Hh * 0.6, x + r() * 30, Hh * (0.5 + r() * 0.5)); g.stroke(); }
  },
  beach(g, W, Hh) {
    const sky = g.createLinearGradient(0, 0, 0, Hh * 0.6); sky.addColorStop(0, "#3a8ad8"); sky.addColorStop(1, "#bfe6ff");
    g.fillStyle = sky; g.fillRect(0, 0, W, Hh);
    const r = rng(5);
    for (let i = 0; i < 14; i++) { const x = r() * W, y = 40 + r() * Hh * 0.3; g.fillStyle = "rgba(255,255,255,.9)"; for (let k = 0; k < 6; k++) { g.beginPath(); g.arc(x + k * 28, y + Math.sin(k) * 8, 26 + r() * 18, 0, 7); g.fill(); } }
    const sea = g.createLinearGradient(0, Hh * 0.6, 0, Hh * 0.8); sea.addColorStop(0, "#1a6ab8"); sea.addColorStop(1, "#3ac0d0");
    g.fillStyle = sea; g.fillRect(0, Hh * 0.6, W, Hh * 0.2);
    g.strokeStyle = "rgba(255,255,255,.6)"; g.lineWidth = 3; for (let i = 0; i < 40; i++) { const x = r() * W, y = Hh * (0.62 + r() * 0.16); g.beginPath(); g.moveTo(x, y); g.lineTo(x + 30 + r() * 40, y); g.stroke(); }
    g.fillStyle = "#f2d8a0"; g.fillRect(0, Hh * 0.8, W, Hh * 0.2);
    [0.12, 0.3, 0.74, 0.9].forEach(px => { // palm trees
      const x = W * px; g.strokeStyle = "#7a5a32"; g.lineWidth = 14; g.beginPath(); g.moveTo(x, Hh * 0.9); g.quadraticCurveTo(x + 40, Hh * 0.6, x + 20, Hh * 0.38); g.stroke();
      g.fillStyle = "#2a8a3a"; for (let k = 0; k < 7; k++) { g.save(); g.translate(x + 20, Hh * 0.38); g.rotate(k * 0.9); g.beginPath(); g.ellipse(60, 0, 70, 12, 0, 0, 7); g.fill(); g.restore(); }
    });
  }
};
const VIEW_ORDER = ["moon", "mars", "jungle", "beach"];

// ---------------------------------------------------------------- the jack-in-the-box guide (original character)
function buildGuide(parent) {
  const root = group(parent, 0, 0, 0);
  const spring = new THREE.Group(); root.add(spring);
  const coil = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(Array.from({ length: 60 }, (_, i) => new THREE.Vector3(Math.cos(i * 0.9) * 0.05, i * 0.006, Math.sin(i * 0.9) * 0.05))), 200, 0.008, 6), M(0xc0c4cc, { r: 0.25, m: 0.9 }));
  spring.add(coil);
  const head = group(root, 0, 0.42, 0);
  const face = canvasTex(256, 256, (g) => {
    g.fillStyle = "#ffd8b8"; g.fillRect(0, 0, 256, 256);
    g.fillStyle = "#fff"; g.beginPath(); g.ellipse(92, 104, 26, 32, 0, 0, 7); g.ellipse(164, 104, 26, 32, 0, 0, 7); g.fill();
    g.fillStyle = "#222"; g.beginPath(); g.arc(98, 110, 12, 0, 7); g.arc(158, 110, 12, 0, 7); g.fill();
    g.fillStyle = "#e23b3b"; g.beginPath(); g.arc(128, 140, 16, 0, 7); g.fill();
    g.fillStyle = "#7a1010"; g.beginPath(); g.moveTo(70, 168); g.quadraticCurveTo(128, 236, 186, 168); g.closePath(); g.fill();
    g.fillStyle = "#fff"; g.fillRect(96, 170, 64, 14);
    g.fillStyle = "rgba(255,120,120,.5)"; g.beginPath(); g.arc(60, 150, 16, 0, 7); g.arc(196, 150, 16, 0, 7); g.fill();
  });
  const skull = add(head, S(0.13, 24, 18), new THREE.MeshStandardMaterial({ map: face, roughness: 0.75, color: 0xd8c8c0 }), 0, 0, 0);
  skull.rotation.y = -Math.PI / 2; // put the painted face toward +z
  const ruff = add(head, new THREE.TorusGeometry(0.1, 0.035, 8, 18), M(0xffffff, { r: 0.9 }), 0, -0.13, 0); ruff.rotation.x = Math.PI / 2;
  const hatColors = [0x7a2ad0, 0xe23b3b, 0xf2c400];
  hatColors.forEach((c, i) => {
    const a = (i - 1) * 0.75, cone = add(head, new THREE.ConeGeometry(0.06, 0.22, 12), M(c, { r: 0.5 }), Math.sin(a) * 0.1, 0.17, 0);
    cone.rotation.z = -a * 1.1;
    add(head, S(0.025, 10, 8), M(0xffd400, { r: 0.2, m: 0.8 }), Math.sin(a) * 0.21, 0.26 - Math.abs(a) * 0.05, 0);
  });
  root.userData = { spring, head, out: 0, target: 0 };
  return root;
}

// ---------------------------------------------------------------- what pops out of each drawer
function buildPeek(dg, i) {
  const p = group(dg, 0.25, 0.17, -0.05); p.visible = false;
  const shiny = c => new THREE.MeshPhysicalMaterial({ color: c, roughness: 0.35, clearcoat: 0.6 });
  if (i === 0) {          // postcards
    ["#ffd94a", "#5ad1ff", "#ff7ab8"].forEach((col, k) => {
      const t = canvasTex(128, 88, g => { g.fillStyle = "#fdf8ec"; g.fillRect(0, 0, 128, 88); g.fillStyle = col; g.fillRect(6, 6, 70, 76); g.fillStyle = "#e23b3b"; g.fillRect(96, 8, 24, 28); g.strokeStyle = "#555"; for (let y = 50; y < 84; y += 10) { g.beginPath(); g.moveTo(84, y); g.lineTo(122, y); g.stroke(); } });
      const c = add(p, B(0.2, 0.14, 0.004), new THREE.MeshStandardMaterial({ map: t, roughness: 0.7 }), (k - 1) * 0.06, 0.08 + k * 0.01, 0, false); c.rotation.set(-0.5, 0, (k - 1) * 0.25);
    });
  } else if (i === 1) {   // crayons
    [0xe23b3b, 0xffa020, 0xffd400, 0x3ac04a, 0x2a6ad8, 0x8a3ad8].forEach((c, k) => {
      const cr = group(p, (k - 2.5) * 0.035, 0.05, 0); cr.rotation.z = (k - 2.5) * 0.12;
      add(cr, C(0.012, 0.012, 0.12, 10), shiny(c), 0, 0, 0, false); add(cr, new THREE.ConeGeometry(0.012, 0.03, 10), shiny(c), 0, 0.075, 0, false);
      add(cr, C(0.0125, 0.0125, 0.06, 10), M(0xf4f0e0), 0, -0.01, 0, false);
    });
  } else if (i === 2) {   // homework with a gold star
    const t = canvasTex(128, 160, g => { g.fillStyle = "#fffef6"; g.fillRect(0, 0, 128, 160); g.strokeStyle = "#9ac0f0"; for (let y = 20; y < 160; y += 14) { g.beginPath(); g.moveTo(0, y); g.lineTo(128, y); g.stroke(); } g.strokeStyle = "#f08a8a"; g.beginPath(); g.moveTo(18, 0); g.lineTo(18, 160); g.stroke(); g.fillStyle = "#333"; g.font = "16px 'Comic Sans MS', cursive"; g.fillText("3 + 4 = 7", 26, 46); g.fillText("6 x 2 = 12", 26, 74); g.fillStyle = "#e23b3b"; g.font = "bold 30px Arial"; g.fillText("A+", 70, 140); });
    const sheet = add(p, B(0.16, 0.2, 0.003), new THREE.MeshStandardMaterial({ map: t, roughness: 0.8 }), 0, 0.1, 0, false); sheet.rotation.x = -0.4;
    const star = new THREE.Shape(); for (let k = 0; k < 10; k++) { const a = k / 10 * Math.PI * 2 - Math.PI / 2, r = k % 2 ? 0.018 : 0.04; k ? star.lineTo(Math.cos(a) * r, Math.sin(a) * r) : star.moveTo(Math.cos(a) * r, Math.sin(a) * r); }
    add(p, new THREE.ExtrudeGeometry(star, { depth: 0.006, bevelEnabled: false }), M(0xffd400, { r: 0.25, m: 0.7, e: 0x553300, ei: 0.4 }), 0.05, 0.17, 0.04, false);
  } else if (i === 3) {   // diary with a padlock
    add(p, B(0.16, 0.2, 0.04), shiny(0x7a2ad0), 0, 0.1, 0, false).rotation.x = -0.25;
    add(p, B(0.03, 0.06, 0.05), M(0xd8b030, { r: 0.25, m: 0.9 }), 0.08, 0.1, 0.0, false);
    add(p, new THREE.TorusGeometry(0.014, 0.004, 8, 14, Math.PI), M(0xd8b030, { r: 0.25, m: 0.9 }), 0.08, 0.135, 0.0, false);
    add(p, new THREE.PlaneGeometry(0.1, 0.03), new THREE.MeshBasicMaterial({ map: canvasTex(128, 40, g => { g.fillStyle = "#ffd94a"; g.font = "bold 26px 'Comic Sans MS', cursive"; g.fillText("KEEP OUT", 4, 30); }), transparent: true }), -0.01, 0.15, 0.03, false).rotation.x = -0.25;
  } else {                // a stack of pogs and a slammer
    for (let k = 0; k < 7; k++) {
      const t = canvasTex(64, 64, g => { const gr = g.createRadialGradient(32, 32, 2, 32, 32, 32); gr.addColorStop(0, ["#ffd94a", "#5ad1ff", "#ff7ab8", "#7aff8a"][k % 4]); gr.addColorStop(1, ["#e23b3b", "#2a6ad8", "#8a3ad8", "#ffa020"][k % 4]); g.fillStyle = gr; g.fillRect(0, 0, 64, 64); g.fillStyle = "#fff"; g.font = "bold 22px Arial"; g.textAlign = "center"; g.fillText(["☺", "★", "☯", "♛"][k % 4], 32, 40); });
      add(p, C(0.035, 0.035, 0.004, 20), M(0xf4f0e0), 0, 0.004 + k * 0.0045, 0, false).rotation.y = k;
      add(p, new THREE.CircleGeometry(0.034, 20), new THREE.MeshStandardMaterial({ map: t }), 0, 0.0061 + k * 0.0045, 0, false).rotation.set(-Math.PI / 2, 0, k);
    }
    add(p, C(0.036, 0.036, 0.008, 24), M(0x222222, { r: 0.3, m: 0.6 }), 0.09, 0.03, 0.02, false).rotation.x = 0.6;
  }
  return p;
}

// ---------------------------------------------------------------- build
export function buildKidSpace(scene, { hot, updaters, refs }) {
  const room = group(scene, 0, 0, KID_Z);
  const kid = refs.kid = { theme: 0 };

  // ---- shell
  const floorTex = canvasTex(512, 512, (g) => {
    for (let y = 0; y < 512; y += 8) { g.fillStyle = ["#3a3a46", "#55556a", "#2a2a36", "#6a3a5a", "#46466a", "#30303c"][(y / 8) % 6]; g.fillRect(0, y, 512, 8); }
    g.fillStyle = "rgba(255,255,255,.08)"; for (let y = 0; y < 512; y += 48) g.fillRect(0, y, 512, 2);
  });
  floorTex.wrapS = floorTex.wrapT = THREE.RepeatWrapping; floorTex.repeat.set(2, 2);
  const floorMat = new THREE.MeshStandardMaterial({ map: floorTex, roughness: 0.6, metalness: 0.3 });
  const floor = add(room, new THREE.PlaneGeometry(10, 8), floorMat, 0, 0, 0, false); floor.rotation.x = -Math.PI / 2;
  const panelTex = canvasTex(256, 256, (g) => {
    const gr = g.createLinearGradient(0, 0, 256, 256); gr.addColorStop(0, "#5a5a74"); gr.addColorStop(1, "#30304a"); g.fillStyle = gr; g.fillRect(0, 0, 256, 256);
    g.strokeStyle = "rgba(0,0,0,.4)"; g.lineWidth = 4; g.strokeRect(6, 6, 244, 244);
    g.fillStyle = "#9a9ab4"; [[16, 16], [240, 16], [16, 240], [240, 240]].forEach(([x, y]) => { g.beginPath(); g.arc(x, y, 5, 0, 7); g.fill(); });
  });
  panelTex.wrapS = panelTex.wrapT = THREE.RepeatWrapping; panelTex.repeat.set(4, 2);
  const panel = new THREE.MeshStandardMaterial({ map: panelTex, roughness: 0.4, metalness: 0.6 });
  add(room, B(0.2, H, 8), panel, -5.1, H / 2, 0); add(room, B(0.2, H, 8), panel, 5.1, H / 2, 0);
  add(room, B(10.4, H, 0.2), panel, 0, H / 2, 4.1);                               // front wall (behind the camera)
  add(room, B(10.4, 0.2, 8.2), new THREE.MeshStandardMaterial({ color: 0x0a0a14, roughness: 0.6 }), 0, H + 0.1, 0);
  // the back "window": a riveted sill below and an open view above
  const sill = new THREE.MeshStandardMaterial({ color: 0xc8ccd8, roughness: 0.25, metalness: 0.9 });
  add(room, B(10, 0.9, 0.3), panel, 0, 0.45, -4);
  add(room, B(10, 0.12, 0.34), sill, 0, 0.92, -4);
  add(room, B(10, 0.08, 0.34), sill, 0, 3.55, -4);

  // ---- the view outside
  const viewCanvas = document.createElement("canvas"); viewCanvas.width = 2048; viewCanvas.height = 768;
  const viewTex = new THREE.CanvasTexture(viewCanvas); viewTex.colorSpace = THREE.SRGBColorSpace;
  const backdrop = new THREE.Mesh(new THREE.CylinderGeometry(18, 18, 16, 48, 1, true, Math.PI * 0.62, Math.PI * 0.76),
    new THREE.MeshBasicMaterial({ map: viewTex, side: THREE.BackSide, fog: false }));
  backdrop.position.set(0, 4.5, 4); room.add(backdrop);
  const earthTex = canvasTex(512, 256, (g) => {
    g.fillStyle = "#1a4a9a"; g.fillRect(0, 0, 512, 256); const r = rng(9);
    for (let i = 0; i < 26; i++) { g.fillStyle = r() > 0.3 ? "#3a8a3a" : "#c8a868"; g.beginPath(); g.ellipse(r() * 512, 40 + r() * 176, 20 + r() * 50, 10 + r() * 30, r() * 3, 0, 7); g.fill(); }
    g.fillStyle = "rgba(255,255,255,.7)"; for (let i = 0; i < 40; i++) { g.beginPath(); g.ellipse(r() * 512, r() * 256, 10 + r() * 40, 3 + r() * 6, r(), 0, 7); g.fill(); }
    g.fillStyle = "#fff"; g.fillRect(0, 0, 512, 14); g.fillRect(0, 242, 512, 14);
  });
  const planet = add(room, S(1.5, 48, 32), new THREE.MeshStandardMaterial({ map: earthTex, roughness: 0.7, emissive: 0x112244, emissiveIntensity: 0.3 }), -0.2, 4.6, -11, false);
  const moon2 = add(room, S(0.7, 32, 20), M(0xa87a5a, { r: 0.9 }), 1.6, 4.4, -11, false); moon2.visible = false;
  // a short-range light just for the planets (directional/hemisphere lights would leak into the house)
  const planetLight = new THREE.PointLight(0xffffff, 40, 7, 2); planetLight.position.set(-3.5, 6.5, -8); room.add(planetLight);
  updaters.push((t) => { planet.rotation.y = t * 0.05; });

  // ---- glowing plasma tubes (the KidSpace signature)
  const plasmaCanvas = document.createElement("canvas"); plasmaCanvas.width = 256; plasmaCanvas.height = 64;
  const pg = plasmaCanvas.getContext("2d");
  function drawPlasma(t, hue) {
    const g = pg; g.fillStyle = `hsl(${hue},90%,45%)`; g.fillRect(0, 0, 256, 64);
    for (let i = 0; i < 26; i++) {
      const x = ((i * 37 + t * 60) % 300) - 20, y = (i * 23) % 64;
      const gr = g.createRadialGradient(x, y, 0, x, y, 26); gr.addColorStop(0, `hsla(${hue - 10},100%,85%,.9)`); gr.addColorStop(1, `hsla(${hue},100%,60%,0)`);
      g.fillStyle = gr; g.beginPath(); g.ellipse(x, y, 34, 12, 0.3, 0, 7); g.fill();
    }
  }
  drawPlasma(0, 200);
  const plasmaTex = new THREE.CanvasTexture(plasmaCanvas); plasmaTex.colorSpace = THREE.SRGBColorSpace; plasmaTex.wrapS = plasmaTex.wrapT = THREE.RepeatWrapping;
  const plasmaMat = new THREE.MeshStandardMaterial({ color: 0x66aaff, emissive: 0xffffff, emissiveMap: plasmaTex, emissiveIntensity: 1.25, map: plasmaTex, roughness: 0.2, metalness: 0.1 });
  const tubes = [];
  const top = add(room, C(0.2, 0.2, 10.4, 20), plasmaMat, 0, 3.75, -3.95, false); top.rotation.z = Math.PI / 2; tubes.push(top);
  [-3.6, -0.9, 2.3].forEach(x => {
    tubes.push(add(room, C(0.2, 0.2, 2.9, 20), plasmaMat, x, 2.3, -3.95, false));
    add(room, C(0.26, 0.3, 0.14, 20), sill, x, 0.95, -3.95); add(room, C(0.26, 0.26, 0.1, 20), sill, x, 3.55, -3.95);
  });
  // the great ring overhead
  const ring = add(room, new THREE.TorusGeometry(9, 0.35, 12, 80, Math.PI * 0.7), plasmaMat, 0, 4.6, -6, false);
  ring.rotation.set(-1.2, 0, Math.PI * 0.15);
  [[-3, 3.2, -2.5], [3, 3.2, -2.5]].forEach(([x, y, z]) => { const l = new THREE.PointLight(0x5aa0ff, 6, 9, 1.6); l.position.set(x, y, z); room.add(l); });
  const key = new THREE.PointLight(0xffe0c0, 5, 12, 1.4); key.position.set(0, 3.6, 1.5); room.add(key);
  [[-3.5, 1.2, 0], [3.5, 1.2, 0], [0, 1.5, 2.5]].forEach(([x, y, z]) => { const f = new THREE.PointLight(0x9aa0ff, 2.2, 7, 1.5); f.position.set(x, y, z); room.add(f); });
  let plasmaHue = 200, lastPl = 0;
  updaters.push((t) => {
    plasmaTex.offset.x = -t * 0.08;
    if (t - lastPl > 0.08) { drawPlasma(t, plasmaHue); plasmaTex.needsUpdate = true; lastPl = t; }
  });

  // ---- program shelf (left), lavender like the original
  const lav = new THREE.MeshPhysicalMaterial({ color: 0x8a7ae0, roughness: 0.35, clearcoat: 0.6, clearcoatRoughness: 0.2 });
  const lavIn = new THREE.MeshStandardMaterial({ color: 0xd8d0f8, roughness: 0.5 });
  const shelf = group(room, -3.45, 0, -2.5, 0.35);
  // an open cabinet: back, sides, top and kick-plate (so the programs on the shelves show)
  add(shelf, B(1.5, 2.5, 0.05), lav, 0, 1.25, -0.22);
  add(shelf, B(0.07, 2.5, 0.5), lav, -0.715, 1.25, 0); add(shelf, B(0.07, 2.5, 0.5), lav, 0.715, 1.25, 0);
  add(shelf, B(1.5, 0.07, 0.52), lav, 0, 2.48, 0);
  add(shelf, B(1.36, 2.2, 0.02), lavIn, 0, 1.38, -0.19);
  [0.95, 1.55, 2.15].forEach(y => add(shelf, B(1.4, 0.05, 0.48), lav, 0, y, 0.02));
  add(shelf, B(1.36, 0.8, 0.02), new THREE.MeshStandardMaterial({ color: 0x5a4ab0, roughness: 0.4 }), 0, 0.45, 0.26);
  const progs = [
    { id: "k-paint", label: "Paint", icon: "🎨", action: { type: "url", url: "apps/win95/paint.html?embed=1", title: "Paint" } },
    { id: "k-sol", label: "Solitaire", icon: "🃏", action: { type: "url", url: "apps/win95/solitaire.html?embed=1", title: "Solitaire" } },
    { id: "k-mines", label: "Minesweeper", icon: "💣", action: { type: "url", url: "apps/win95/minesweeper.html?embed=1", title: "Minesweeper" } },
    { id: "k-pinball", label: "Space Pinball", icon: "🚀", action: { type: "url", url: "apps/win95/pinball.html?embed=1", title: "Space Pinball" } },
    { id: "k-sea", label: "Lost at Sea", icon: "⛵", action: { type: "app", app: "lostatsea" } },
    { id: "k-santa", label: "Secret Santa", icon: "🎁", action: { type: "app", app: "secretsanta" } }
  ];
  progs.forEach((p, i) => {
    const row = Math.floor(i / 2), col = i % 2;
    const tile = group(shelf, -0.33 + col * 0.66, 2.2 - row * 0.6, 0.12);
    const face = canvasTex(128, 128, (g) => {
      g.fillStyle = ["#ffd94a", "#5ad1ff", "#ff7ab8", "#7aff8a", "#ffa04a", "#c8a0ff"][i]; g.fillRect(0, 0, 128, 128);
      g.strokeStyle = "#222"; g.lineWidth = 8; g.strokeRect(4, 4, 120, 120);
      g.font = "64px 'Segoe UI Emoji', 'Apple Color Emoji', sans-serif"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(p.icon, 64, 70);
    });
    add(tile, B(0.32, 0.32, 0.06), new THREE.MeshStandardMaterial({ color: 0xffffff, map: face, roughness: 0.4 }), 0, 0.18, 0);
    tile.rotation.z = (i % 3 - 1) * 0.08;
    hot(tile, { id: p.id, label: p.label, desc: "A KidSpace program. Click to play!", action: p.action, focus: [0, 0.2, 1.1] });
  });
  // robot head + alien in a jar on top of the shelf
  const robot = group(shelf, -0.35, 2.5, 0);
  add(robot, B(0.34, 0.3, 0.3), M(0xb8bcc8, { r: 0.3, m: 0.8 }), 0, 0.15, 0);
  const eyes = [-0.08, 0.08].map(x => add(robot, S(0.04, 12, 10), M(0x111111, { e: 0x40ff60, ei: 0.2 }), x, 0.18, 0.15));
  add(robot, B(0.16, 0.03, 0.02), M(0x222222), 0, 0.08, 0.151);
  add(robot, C(0.008, 0.008, 0.16, 6), M(0x888888, { m: 0.8 }), 0, 0.38, 0); add(robot, S(0.025, 10, 8), M(0xff3030, { e: 0xff2020, ei: 0.6 }), 0, 0.47, 0);
  hot(robot, { id: "k-robot", label: "Rivet the robot", desc: "Beep boop.", action: { type: "custom", fn: () => { sfx.beep(); eyes.forEach(e => (e.material.emissiveIntensity = 2)); setTimeout(() => eyes.forEach(e => (e.material.emissiveIntensity = 0.2)), 900); say(["BEEP BOOP. I am Rivet.", "Rivet computes: you are 98.6% awesome.", "Does not compute… just kidding!"][Math.floor(Math.random() * 3)]); } } });
  const jar = group(shelf, 0.35, 2.5, 0);
  add(jar, C(0.13, 0.13, 0.34, 24), new THREE.MeshPhysicalMaterial({ color: 0xccffee, transparent: true, opacity: 0.3, roughness: 0.05, transmission: 0 }), 0, 0.17, 0).userData.keepMat = true;
  add(jar, C(0.14, 0.14, 0.04, 24), M(0x888888, { m: 0.8, r: 0.3 }), 0, 0.36, 0);
  const alien = group(jar, 0, 0.14, 0);
  add(alien, S(0.07, 16, 12), M(0xd03030, { r: 0.4 }), 0, 0.04, 0);
  for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2, leg = add(alien, C(0.012, 0.006, 0.12, 6), M(0xd03030), Math.cos(a) * 0.05, -0.04, Math.sin(a) * 0.05); leg.rotation.set(Math.sin(a) * 0.6, 0, -Math.cos(a) * 0.6); }
  [-0.025, 0.025].forEach(x => add(alien, S(0.015, 8, 6), M(0xffffff), x, 0.07, 0.055));
  let wiggle = 0;
  updaters.push((t, dt) => { wiggle = Math.max(0, wiggle - dt); alien.position.y = 0.14 + Math.sin(t * 2) * 0.01 + Math.sin(t * 30) * 0.02 * wiggle; alien.rotation.y = t * 0.4 + wiggle * Math.sin(t * 25); });
  hot(jar, { id: "k-alien", label: "Alien in a jar", desc: "It's friendly. Probably.", action: { type: "custom", fn: () => { sfx.bubble(); wiggle = 1.5; say("Glorp! (That means hello.)"); } } });

  // ---- marble filing cabinet (right) with the labelled drawers
  const marble = canvasTex(256, 512, (g) => {
    const gr = g.createLinearGradient(0, 0, 256, 512); gr.addColorStop(0, "#d8d8d0"); gr.addColorStop(0.5, "#6a6a62"); gr.addColorStop(1, "#c8c8be");
    g.fillStyle = gr; g.fillRect(0, 0, 256, 512);
    const r = rng(21); g.strokeStyle = "rgba(20,20,20,.45)";
    for (let i = 0; i < 14; i++) { g.lineWidth = 1 + r() * 4; g.beginPath(); let x = r() * 256, y = 0; g.moveTo(x, y); while (y < 512) { x += (r() - 0.5) * 40; y += 20 + r() * 30; g.lineTo(x, y); } g.stroke(); }
  });
  const marbleMat = new THREE.MeshPhysicalMaterial({ map: marble, roughness: 0.25, clearcoat: 1, clearcoatRoughness: 0.08 });
  const cab = group(room, 3.45, 0, -2.5, -0.35);
  add(cab, B(1.5, 2.9, 0.6), marbleMat, 0, 1.45, 0);
  add(cab, B(1.3, 0.5, 0.04), new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.6 }), 0, 0.55, 0.29);
  const kd = (hash, title) => ({ type: "url", url: "apps/kidspace-drawers.html?embed=1#" + hash, title });
  const drawers = [
    { label: "Friends", desc: "Postcards from pen pals all over the galaxy. Write back!", action: kd("friends", "Friends — Pen Pals") },
    { label: "Paintings", desc: "The fridge gallery, plus a crayon doodle pad.", action: kd("paintings", "Paintings — Fridge Gallery") },
    { label: "Homework", desc: "Space Math worksheet. (The dog may eat it.)", action: kd("homework", "Homework — Space Math") },
    { label: "Personal", desc: "Rivet's secret diary. It has a lock…", action: kd("personal", "Personal — Rivet's Diary") },
    { label: "Misc.", desc: "A junk drawer of wonders: pogs, a slap bracelet, a virtual pet…", action: kd("misc", "Misc. — Junk Drawer of Wonders") }
  ];
  drawers.forEach((d, i) => {
    const dg = group(cab, 0, 2.6 - i * 0.42, 0.3);
    const lbl = canvasTex(256, 64, (g) => {
      g.fillStyle = "#2a2a2a"; g.fillRect(0, 0, 256, 64); g.strokeStyle = "#c8a0a0"; g.lineWidth = 4; g.strokeRect(3, 3, 250, 58);
      g.fillStyle = "#fff"; g.font = "bold 28px Arial"; g.textBaseline = "middle"; g.fillText(d.label, 20, 34);
    });
    add(dg, B(1.25, 0.34, 0.06), new THREE.MeshPhysicalMaterial({ map: lbl, roughness: 0.3, clearcoat: 0.6 }), 0, 0, 0);
    const peek = buildPeek(dg, i);
    hot(dg, { id: "k-drawer-" + i, label: d.label + " drawer", desc: d.desc, action: { type: "custom", fn: () => { sfx.drawer(); dg.position.z = 0.5; peek.visible = true; setTimeout(() => { dg.position.z = 0.3; peek.visible = false; }, 1400); kid.activate(d.action, dg); } }, focus: [0, 0, 1.4] });
  });

  // ---- console desk with the hazard-striped screen
  const desk = group(room, 0, 0, -1.7);
  kid.room = room; kid.desk = desk;
  const metal = new THREE.MeshStandardMaterial({ color: 0x3a3a44, roughness: 0.3, metalness: 0.85 });
  add(desk, B(2.8, 0.12, 1.5), metal, 0, 0.86, 0);
  [[-1.3, -0.6], [1.3, -0.6], [-1.3, 0.6], [1.3, 0.6]].forEach(([x, z]) => add(desk, C(0.05, 0.05, 0.84, 10), metal, x, 0.42, z));
  const hazard = canvasTex(512, 256, (g) => {
    g.fillStyle = "#222"; g.fillRect(0, 0, 512, 256);
    for (let i = -10; i < 40; i++) { g.fillStyle = i % 2 ? "#4a3aa8" : "#e8e8f0"; g.beginPath(); g.moveTo(i * 24, 0); g.lineTo(i * 24 + 24, 0); g.lineTo(i * 24 - 40, 256); g.lineTo(i * 24 - 64, 256); g.fill(); }
    g.fillStyle = "#000"; g.fillRect(36, 36, 440, 184);
  });
  add(desk, new THREE.PlaneGeometry(1.7, 0.85), new THREE.MeshStandardMaterial({ map: hazard, roughness: 0.4, metalness: 0.3 }), 0, 0.925, 0.05, false).rotation.x = -Math.PI / 2;
  const screenCanvas = document.createElement("canvas"); screenCanvas.width = 512; screenCanvas.height = 256;
  const screenTex = new THREE.CanvasTexture(screenCanvas); screenTex.colorSpace = THREE.SRGBColorSpace;
  const scr = add(desk, new THREE.PlaneGeometry(1.46, 0.61), new THREE.MeshBasicMaterial({ map: screenTex }), 0, 0.928, 0.05, false); scr.rotation.x = -Math.PI / 2; scr.userData.keepMat = true;
  let lastScr = 0;
  updaters.push((t) => {
    if (t - lastScr < 0.1) return; lastScr = t;
    const g = screenCanvas.getContext("2d"); g.fillStyle = "#04081a"; g.fillRect(0, 0, 512, 256);
    for (let i = 0; i < 70; i++) { const z = ((i * 53 + t * 40) % 300) / 300, a = i * 2.4; g.fillStyle = `rgba(255,255,255,${z})`; g.fillRect(256 + Math.cos(a) * z * 260, 128 + Math.sin(a) * z * 140, 2 + z * 2, 2 + z * 2); }
    g.fillStyle = "#7affd0"; g.font = "bold 26px 'Courier New'"; g.textAlign = "center"; g.fillText("KIDSPACE COMMAND", 256, 40);
    g.font = "18px 'Courier New'"; g.fillText("pull the lever to change the view ▸", 256, 232);
    screenTex.needsUpdate = true;
  });
  // the view lever
  const lever = group(desk, 1.15, 0.92, -0.45);
  add(lever, B(0.18, 0.06, 0.26), metal, 0, 0, 0);
  const stick = group(lever, 0, 0.02, 0);
  add(stick, C(0.015, 0.015, 0.26, 8), M(0xdddddd, { m: 0.9, r: 0.2 }), 0, 0.13, 0); add(stick, S(0.04, 14, 10), M(0xe23b3b, { r: 0.3 }), 0, 0.27, 0);
  [[-0.05, 0x3aff5a], [0.05, 0xffd400]].forEach(([x, c]) => add(lever, S(0.018, 10, 8), M(c, { e: c, ei: 0.8 }), x, 0.04, 0.1));
  stick.rotation.x = -0.4;
  hot(lever, { id: "k-lever", label: "View lever", desc: "Change the view: Moon base, Mars, Jungle, Beach.", action: { type: "custom", fn: () => { sfx.click(); stick.rotation.x = 0.4; setTimeout(() => (stick.rotation.x = -0.4), 300); setTheme(kid.theme + 1); } } });

  // surprise box + guide
  const box = group(desk, -0.95, 0.92, -0.2, 0.3);
  const qTex = canvasTex(128, 128, (g) => { g.fillStyle = "#e23b5a"; g.fillRect(0, 0, 128, 128); g.fillStyle = "#fff"; g.font = "bold 46px Arial"; g.textAlign = "center"; g.fillText("?", 34, 54); g.fillText("?", 94, 110); g.fillStyle = "#ffd94a"; g.fillText("?", 94, 54); g.fillText("?", 34, 110); });
  const boxMat = new THREE.MeshPhysicalMaterial({ map: qTex, roughness: 0.35, clearcoat: 0.7 });
  add(box, B(0.26, 0.24, 0.26), boxMat, 0, 0.12, 0);
  const lid = group(box, 0, 0.24, -0.13);
  add(lid, B(0.27, 0.03, 0.27), boxMat, 0, 0.015, 0.13);
  const guide = buildGuide(box); guide.position.y = 0.1; guide.scale.setScalar(0.001);
  kid.guide = guide;
  updaters.push((t, dt) => {
    const u = guide.userData; u.out += (u.target - u.out) * Math.min(1, dt * 7);
    const o = Math.max(0.001, u.out), bob = u.target ? Math.sin(t * 5) * 0.03 : 0;
    guide.scale.setScalar(o); u.spring.scale.y = o * (1 + bob * 3); u.head.position.y = 0.42 * o + bob; u.head.rotation.z = Math.sin(t * 2.3) * 0.15 * o;
    lid.rotation.x = -1.9 * Math.min(1, u.out * 1.4);
  });
  const TIPS = [
    "Hi there! Welcome to KidSpace — the fun place to play, paint and explore!",
    "Click the programs on the purple shelf to play them.",
    "The drawers on the right are full of surprises: pen pals, a fridge gallery, even Rivet's secret diary!",
    "Pull the red lever on the desk to change the view outside.",
    "Want to go back? Click the little door sign on the pillar.",
    "Rivet the robot and the jar alien love visitors. Say hi!",
    "Psst… the rocket on the desk really works."
  ];
  let tip = 0;
  function popGuide(text) { guide.userData.target = 1; sfx.boing(); say(text || TIPS[tip++ % TIPS.length], 6000); }
  hot(box, { id: "k-surprise", label: "Surprise box", desc: "Help lives in here. Click it!", action: { type: "custom", fn: () => popGuide() } });
  kid.welcome = () => setTimeout(() => popGuide(TIPS[0]), 500);
  if (true) tip = 1;

  // rocket that launches
  const rocket = group(desk, -0.4, 0.92, -0.5);
  const rk = group(rocket, 0, 0, 0);
  add(rk, C(0.04, 0.05, 0.22, 14), M(0xf0f0f0, { r: 0.3, m: 0.4 }), 0, 0.13, 0);
  add(rk, new THREE.ConeGeometry(0.04, 0.09, 14), M(0xe23b3b, { r: 0.3 }), 0, 0.285, 0);
  [0, 2.1, 4.2].forEach(a => { const f = add(rk, B(0.004, 0.08, 0.06), M(0x2a6ad8), Math.cos(a) * 0.045, 0.05, Math.sin(a) * 0.045); f.rotation.y = -a; });
  const flame = add(rk, new THREE.ConeGeometry(0.03, 0.12, 10), M(0xffa020, { e: 0xff7a10, ei: 2 }), 0, -0.04, 0, false); flame.rotation.x = Math.PI; flame.visible = false;
  let launch = -1;
  updaters.push((t, dt) => {
    if (launch < 0) return; launch += dt;
    const k = launch;
    rk.position.set(Math.sin(k * 2.2) * k * 0.5, k * k * 1.2, -Math.cos(k * 2.2) * k * 0.2 + k * 0.1);
    rk.rotation.z = Math.sin(k * 2.2) * 0.4; flame.visible = true; flame.scale.y = 1 + Math.sin(t * 40) * 0.3;
    if (k > 2.6) { launch = -1; rk.position.set(0, 0, 0); rk.rotation.set(0, 0, 0); flame.visible = false; }
  });
  hot(rocket, { id: "k-rocket", label: "Toy rocket", desc: "3… 2… 1…", action: { type: "custom", fn: () => { if (launch < 0) { launch = 0; sfx.rocket(); } } } });

  // glasses, floppy disk, trash can
  const glasses = group(desk, 0.8, 0.93, 0.35, -0.3);
  [-0.05, 0.05].forEach(x => { const r = add(glasses, new THREE.TorusGeometry(0.035, 0.006, 8, 20), M(0x8a5a2a, { r: 0.3, m: 0.4 }), x, 0.02, 0); r.rotation.y = 0; });
  add(glasses, B(0.03, 0.006, 0.006), M(0x8a5a2a), 0, 0.025, 0);
  hot(glasses, { id: "k-glasses", label: "Funny glasses", desc: "Put them on the guide!", action: { type: "custom", fn: () => { sfx.click(); if (!guide.userData.target) popGuide("Do these make me look smart? I think they make me look SMART."); else say("Do these make me look smart?"); } } });
  const floppy = group(desk, -1.05, 0.93, 0.5, 0.2);
  add(floppy, B(0.1, 0.006, 0.1), M(0x222230, { r: 0.4 }), 0, 0, 0); add(floppy, B(0.06, 0.007, 0.035), M(0xc0c4cc, { m: 0.8, r: 0.3 }), 0, 0.001, -0.03); add(floppy, B(0.07, 0.007, 0.04), M(0xffffff), 0, 0.001, 0.025);
  hot(floppy, { id: "k-floppy", label: "Floppy disk", desc: "Dominic's README.TXT. Old school.", action: { type: "panel", panel: "about" } });
  const trash = group(room, 1.95, 0, -0.8);
  add(trash, C(0.22, 0.18, 0.5, 24, 1, true), new THREE.MeshPhysicalMaterial({ color: 0x2a6ad8, roughness: 0.25, clearcoat: 0.8, side: THREE.DoubleSide }), 0, 0.25, 0);
  add(trash, C(0.18, 0.18, 0.01, 24), M(0x1a3a8a), 0, 0.01, 0);
  hot(trash, { id: "k-trash", label: "Trash can", desc: "Crumple crumple.", action: { type: "custom", fn: () => { sfx.crumple(); say("Nothing in here but crumpled-up homework."); } } });

  // clock + exit sign on the right pillar
  const clockTex = document.createElement("canvas"); clockTex.width = clockTex.height = 128;
  const ct = new THREE.CanvasTexture(clockTex); ct.colorSpace = THREE.SRGBColorSpace;
  const clockFace = add(room, new THREE.CircleGeometry(0.18, 32), new THREE.MeshBasicMaterial({ map: ct }), 2.3, 3.15, -3.72, false); clockFace.userData.keepMat = true;
  let lastClock = -1;
  updaters.push(() => {
    const d = new Date(); if (d.getSeconds() === lastClock) return; lastClock = d.getSeconds();
    const g = clockTex.getContext("2d"); g.fillStyle = "#f8f0d8"; g.beginPath(); g.arc(64, 64, 62, 0, 7); g.fill(); g.strokeStyle = "#c9a54a"; g.lineWidth = 6; g.stroke();
    const hand = (a, l, w) => { g.lineWidth = w; g.strokeStyle = "#222"; g.beginPath(); g.moveTo(64, 64); g.lineTo(64 + Math.sin(a) * l, 64 - Math.cos(a) * l); g.stroke(); };
    hand((d.getHours() % 12 + d.getMinutes() / 60) / 12 * Math.PI * 2, 30, 6); hand(d.getMinutes() / 60 * Math.PI * 2, 46, 4); ct.needsUpdate = true;
  });
  const exit = group(room, 2.3, 2.35, -3.7);
  const exitTex = canvasTex(128, 160, (g) => {
    g.fillStyle = "#7a4a1a"; g.fillRect(0, 0, 128, 160); g.fillStyle = "#c98a3a"; g.fillRect(14, 14, 100, 132);
    g.fillStyle = "#4a2a0a"; g.fillRect(30, 30, 68, 116); g.fillStyle = "#ffd94a"; g.beginPath(); g.arc(84, 92, 6, 0, 7); g.fill();
    g.fillStyle = "#fff"; g.font = "bold 22px Arial"; g.textAlign = "center"; g.fillText("EXIT", 64, 24);
  });
  add(exit, B(0.32, 0.4, 0.04), new THREE.MeshStandardMaterial({ map: exitTex, roughness: 0.5 }), 0, 0, 0);
  exit.rotation.z = 0.12;
  hot(exit, { id: "k-exit", label: "Exit door", desc: "Leave KidSpace and go back to the Rec Room.", action: { type: "room", room: "rec" } });

  // ---- speech bubble (HTML overlay that follows the guide)
  const bubble = document.createElement("div"); bubble.id = "kidBubble"; bubble.hidden = true; document.body.appendChild(bubble);
  let bubbleUntil = 0;
  function say(text, ms = 4200) { bubble.textContent = text; bubble.hidden = false; bubbleUntil = performance.now() + ms; sfx.talk?.(); }
  kid.say = say;
  kid.bubble = bubble;
  kid.updateBubble = (camera, active) => {
    if (!active || performance.now() > bubbleUntil) { bubble.hidden = true; if (performance.now() > bubbleUntil + 4000) guide.userData.target = 0; return; }
    const p = new THREE.Vector3(); (guide.userData.target ? guide.userData.head : box).getWorldPosition(p); p.y += 0.25;
    p.project(camera);
    if (p.z > 1) { bubble.hidden = true; return; }
    bubble.hidden = false;
    bubble.style.left = ((p.x * 0.5 + 0.5) * window.innerWidth) + "px";
    bubble.style.top = ((-p.y * 0.5 + 0.5) * window.innerHeight) + "px";
  };

  // ---- themes
  function setTheme(i) {
    kid.theme = (i + VIEW_ORDER.length) % VIEW_ORDER.length;
    const name = VIEW_ORDER[kid.theme];
    const g = viewCanvas.getContext("2d"); VIEWS[name](g, viewCanvas.width, viewCanvas.height); viewTex.needsUpdate = true;
    const space = name === "moon" || name === "mars";
    planet.visible = name === "moon"; moon2.visible = name === "mars";
    ring.visible = space;
    plasmaHue = { moon: 200, mars: 18, jungle: 95, beach: 180 }[name];
    plasmaMat.color.set({ moon: 0x66aaff, mars: 0xffaa66, jungle: 0x6a8a3a, beach: 0x66ffee }[name]);
    plasmaMat.emissiveIntensity = name === "jungle" ? 0.35 : 1.25;
    floorMat.color.set({ moon: 0xffffff, mars: 0xffd0b0, jungle: 0xb08050, beach: 0xfff0c8 }[name]);
    floorMat.metalness = space ? 0.3 : 0.05;
    say({ moon: "Moon base! Look — that's Earth up there.", mars: "Welcome to Mars! Mind the red dust.", jungle: "The jungle tree house! Watch out for monkeys.", beach: "Beach day! Don't forget your sunscreen." }[name], 3000);
  }
  setTheme(0); bubble.hidden = true; bubbleUntil = 0;
  kid.setTheme = setTheme;

  // ---- the way in: a round porthole hatch in the Rec Room's west wall
  const hatch = group(scene, -5.9, 1.2, -10.8, FACE.e);
  const hatchTex = canvasTex(256, 256, (g) => {
    const gr = g.createRadialGradient(128, 128, 10, 128, 128, 128); gr.addColorStop(0, "#3a2a8a"); gr.addColorStop(1, "#05051a");
    g.fillStyle = gr; g.fillRect(0, 0, 256, 256); const r = rng(4);
    for (let i = 0; i < 120; i++) { g.fillStyle = `rgba(255,255,255,${r()})`; g.fillRect(r() * 256, r() * 256, 2, 2); }
    g.fillStyle = "#ffd94a"; g.font = "bold 30px Arial"; g.textAlign = "center"; g.fillText("KidSpace", 128, 140);
    g.font = "48px sans-serif"; g.fillText("🚀", 128, 96);
  });
  const ringMat = new THREE.MeshStandardMaterial({ color: 0xc8ccd8, roughness: 0.25, metalness: 0.9 });
  const hatchRing = add(hatch, new THREE.TorusGeometry(0.55, 0.07, 16, 40), ringMat, 0, 0, 0.02); 
  add(hatch, new THREE.CircleGeometry(0.55, 40), new THREE.MeshStandardMaterial({ map: hatchTex, emissive: 0xffffff, emissiveMap: hatchTex, emissiveIntensity: 0.6, roughness: 0.3 }), 0, 0, 0.01, false);
  for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2; add(hatch, S(0.025, 8, 6), ringMat, Math.cos(a) * 0.55, Math.sin(a) * 0.55, 0.08); }
  hot(hatch, { id: "kidspace-hatch", label: "Ark KidSpace hatch", desc: "A round hatch covered in stars. Where could it lead?", action: { type: "room", room: "kidspace" }, door: true });

  kid.activate = null; // set by main.js
  return kid;
}

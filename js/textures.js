// Procedural canvas textures — no image assets required.
import * as THREE from "three";

const cache = new Map();
function canvas(w, h) { const c = document.createElement("canvas"); c.width = w; c.height = h; return c; }
function rand(seed) { let s = seed >>> 0 || 1; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }

export function tex(c, { repeat = [1, 1], srgb = true } = {}) {
  const t = new THREE.CanvasTexture(c);
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(repeat[0], repeat[1]);
  t.anisotropy = 4;
  return t;
}
function memo(key, fn) { if (!cache.has(key)) cache.set(key, fn()); return cache.get(key); }

// ---- Cherry wood (Navigator's signature) ----------------------------
export function woodCanvas(base = "#7a2a14", seed = 7, planks = 6) {
  return memo("wood" + base + seed + planks, () => {
    const c = canvas(512, 512), g = c.getContext("2d"), r = rand(seed);
    g.fillStyle = base; g.fillRect(0, 0, 512, 512);
    const ph = 512 / planks;
    for (let p = 0; p < planks; p++) {
      const y0 = p * ph;
      g.fillStyle = `rgba(${r() > 0.5 ? "255,190,140" : "40,8,0"},${0.05 + r() * 0.12})`;
      g.fillRect(0, y0, 512, ph);
      for (let i = 0; i < 26; i++) {
        g.strokeStyle = `rgba(${r() > 0.6 ? "255,170,120" : "30,5,0"},${0.06 + r() * 0.14})`;
        g.lineWidth = 0.6 + r() * 2.2;
        g.beginPath();
        const yy = y0 + r() * ph, amp = 1 + r() * 5, f = 0.005 + r() * 0.02, ph0 = r() * 10;
        for (let x = 0; x <= 512; x += 8) g.lineTo(x, yy + Math.sin(x * f + ph0) * amp);
        g.stroke();
      }
      g.fillStyle = "rgba(20,4,0,0.55)"; g.fillRect(0, y0, 512, 2);
      const seam = r() * 512; g.fillRect(seam, y0, 2, ph);
    }
    return c;
  });
}
export function woodTex(base, seed, repeat = [1, 1], planks) { return tex(woodCanvas(base, seed, planks), { repeat }); }

// ---- Carpet / rug ----------------------------------------------------
export function rugTex() {
  return memo("rug", () => {
    const c = canvas(512, 512), g = c.getContext("2d");
    g.fillStyle = "#6b1e24"; g.fillRect(0, 0, 512, 512);
    g.strokeStyle = "#d9b26a"; g.lineWidth = 14; g.strokeRect(22, 22, 468, 468);
    g.strokeStyle = "#1f3b5a"; g.lineWidth = 10; g.strokeRect(46, 46, 420, 420);
    g.fillStyle = "#d9b26a";
    for (let i = 0; i < 4; i++) {
      g.save(); g.translate(256, 256); g.rotate(i * Math.PI / 2);
      g.beginPath(); g.moveTo(0, -150); g.lineTo(40, -60); g.lineTo(0, -20); g.lineTo(-40, -60); g.closePath(); g.fill(); g.restore();
    }
    g.fillStyle = "#1f3b5a"; g.beginPath(); g.arc(256, 256, 30, 0, 7); g.fill();
    const r = rand(3), d = g.getImageData(0, 0, 512, 512);
    for (let i = 0; i < d.data.length; i += 4) { const n = (r() - 0.5) * 30; d.data[i] += n; d.data[i + 1] += n; d.data[i + 2] += n; }
    g.putImageData(d, 0, 0);
    return tex(c);
  });
}

// ---- Rec-room rug: '90s confetti on deep teal ---------------------------
export function rugTex2() {
  return memo("rug2", () => {
    const c = canvas(512, 384), g = c.getContext("2d"), r = rand(90);
    g.fillStyle = "#1d3f4f"; g.fillRect(0, 0, 512, 384);
    g.strokeStyle = "#e9c46a"; g.lineWidth = 10; g.strokeRect(14, 14, 484, 356);
    const cols = ["#ff5fa2", "#36d6c6", "#ffd94a", "#8a6cff", "#ff8a3a"];
    for (let i = 0; i < 120; i++) {
      g.save(); g.translate(30 + r() * 452, 30 + r() * 324); g.rotate(r() * 6); g.fillStyle = g.strokeStyle = cols[i % 5]; g.lineWidth = 5;
      const k = i % 4;
      if (k === 0) { g.beginPath(); g.moveTo(-12, 0); g.quadraticCurveTo(-6, -10, 0, 0); g.quadraticCurveTo(6, 10, 12, 0); g.stroke(); }
      else if (k === 1) { g.beginPath(); g.moveTo(0, -9); g.lineTo(9, 7); g.lineTo(-9, 7); g.closePath(); g.fill(); }
      else if (k === 2) { g.beginPath(); g.arc(0, 0, 6, 0, 7); g.fill(); }
      else g.fillRect(-10, -3, 20, 6);
      g.restore();
    }
    const d = g.getImageData(0, 0, 512, 384);
    for (let i = 0; i < d.data.length; i += 4) { const n = (r() - 0.5) * 26; d.data[i] += n; d.data[i + 1] += n; d.data[i + 2] += n; }
    g.putImageData(d, 0, 0);
    return tex(c);
  });
}

// ---- Wallpaper / plaster --------------------------------------------
export function wallTex(kind) {
  return memo("wall" + kind, () => {
    const c = canvas(256, 256), g = c.getContext("2d"), r = rand(kind.length * 31);
    const pal = {
      living: ["#efe2c4", "#e5d4b0"], kitchen: ["#f3ecd2", "#e9dfbd"],
      den: ["#2f4a3a", "#284033"], rec: ["#2b3a63", "#24325a"], outside: ["#e8d9b0", "#ddc99a"]
    }[kind] || ["#eee", "#ddd"];
    g.fillStyle = pal[0]; g.fillRect(0, 0, 256, 256);
    if (kind === "den" || kind === "living") {
      g.fillStyle = pal[1];
      for (let x = 0; x < 256; x += 32) g.fillRect(x, 0, 12, 256);
    }
    if (kind === "rec") {
      g.fillStyle = "rgba(255,255,255,0.06)";
      for (let i = 0; i < 40; i++) { g.beginPath(); g.arc(r() * 256, r() * 256, 1 + r() * 2, 0, 7); g.fill(); }
    }
    const d = g.getImageData(0, 0, 256, 256);
    for (let i = 0; i < d.data.length; i += 4) { const n = (r() - 0.5) * 10; d.data[i] += n; d.data[i + 1] += n; d.data[i + 2] += n; }
    g.putImageData(d, 0, 0);
    return tex(c, { repeat: [3, 1] });
  });
}

export function tileTex() {
  return memo("tile", () => {
    const c = canvas(256, 256), g = c.getContext("2d");
    for (let y = 0; y < 4; y++) for (let x = 0; x < 4; x++) {
      g.fillStyle = (x + y) % 2 ? "#2a2a33" : "#ece6d6"; g.fillRect(x * 64, y * 64, 64, 64);
    }
    g.strokeStyle = "rgba(0,0,0,0.25)"; g.lineWidth = 2;
    for (let i = 0; i <= 256; i += 64) { g.beginPath(); g.moveTo(i, 0); g.lineTo(i, 256); g.moveTo(0, i); g.lineTo(256, i); g.stroke(); }
    return tex(c, { repeat: [4, 4] });
  });
}

export function subwayTex() {
  return memo("subway", () => {
    const c = canvas(256, 256), g = c.getContext("2d");
    g.fillStyle = "#cfc8bb"; g.fillRect(0, 0, 256, 256);
    for (let row = 0; row < 8; row++) for (let col = -1; col < 3; col++) {
      const x = col * 128 + (row % 2) * 64, y = row * 32;
      const gr = g.createLinearGradient(0, y, 0, y + 32);
      gr.addColorStop(0, "#fbfaf6"); gr.addColorStop(0.5, "#f1eee6"); gr.addColorStop(1, "#e2ddd2");
      g.fillStyle = gr; g.fillRect(x + 3, y + 3, 122, 26);
    }
    return tex(c);
  });
}

export function chalkboardTex() {
  return memo("chalk", () => {
    const c = canvas(512, 360), g = c.getContext("2d"), r = rand(5);
    g.fillStyle = "#24392d"; g.fillRect(0, 0, 512, 360);
    for (let i = 0; i < 40; i++) { g.fillStyle = `rgba(255,255,255,${0.02 + r() * 0.03})`; g.beginPath(); g.ellipse(r() * 512, r() * 360, 40 + r() * 90, 8 + r() * 20, r(), 0, 7); g.fill(); }
    g.strokeStyle = g.fillStyle = "rgba(245,245,235,0.9)"; g.lineWidth = 3; g.lineCap = "round";
    g.font = "bold 46px 'Comic Sans MS', 'Segoe Print', cursive"; g.fillText("E = mc²", 28, 70);
    g.font = "28px 'Comic Sans MS', 'Segoe Print', cursive"; g.fillText("STEM Club ✓", 300, 330);
    // atom
    g.save(); g.translate(400, 110);
    for (let k = 0; k < 3; k++) { g.save(); g.rotate(k * Math.PI / 3); g.beginPath(); g.ellipse(0, 0, 70, 24, 0, 0, 7); g.stroke(); g.restore(); }
    g.beginPath(); g.arc(0, 0, 8, 0, 7); g.fill(); g.restore();
    // gear
    g.save(); g.translate(110, 230); g.beginPath();
    for (let i = 0; i < 24; i++) { const a = i / 24 * Math.PI * 2, rr = i % 2 ? 58 : 46; g.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); }
    g.closePath(); g.stroke(); g.beginPath(); g.arc(0, 0, 16, 0, 7); g.stroke(); g.restore();
    // a little rocket trajectory + </>
    g.strokeStyle = "rgba(255,220,120,0.9)"; g.beginPath(); g.moveTo(200, 300); g.quadraticCurveTo(260, 140, 330, 200); g.stroke();
    g.fillStyle = "rgba(140,210,255,0.95)"; g.font = "bold 40px 'Courier New', monospace"; g.fillText("</>", 200, 150);
    return tex(c);
  });
}

export function needleTex() {
  return memo("needles", () => {
    const c = canvas(256, 256), g = c.getContext("2d"), r = rand(17);
    g.fillStyle = "#16442a"; g.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 1400; i++) {
      const x = r() * 256, y = r() * 256, l = 6 + r() * 12, a = Math.PI / 2 + (r() - 0.5) * 1.2;
      g.strokeStyle = `hsl(${135 + r() * 25},${40 + r() * 25}%,${14 + r() * 22}%)`; g.lineWidth = 1 + r() * 1.5;
      g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l); g.stroke();
    }
    return tex(c, { repeat: [4, 1] });
  });
}

export function arcadeSideTex() {
  return memo("arcside", () => {
    const c = canvas(256, 512), g = c.getContext("2d");
    g.clearRect(0, 0, 256, 512);
    // neon chevrons and a starfield, inset from the edges so the cabinet colour frames it
    for (let i = 0; i < 60; i++) { g.fillStyle = `rgba(255,255,255,${0.3 + Math.random() * 0.5})`; g.fillRect(20 + Math.random() * 216, 40 + Math.random() * 300, 2, 2); }
    [["#ff2fa0", 0], ["#29e6ff", 26], ["#ffd400", 52]].forEach(([col, o]) => {
      g.strokeStyle = col; g.lineWidth = 12; g.shadowColor = col; g.shadowBlur = 10;
      g.beginPath(); g.moveTo(20, 470 - o); g.lineTo(150, 300 - o); g.lineTo(236, 380 - o); g.stroke();
    });
    g.shadowBlur = 0; g.fillStyle = "#ff2fa0"; g.font = "bold 44px 'Courier New'"; g.save(); g.translate(70, 250); g.rotate(-Math.PI / 2.6); g.fillText("404", 0, 0); g.restore();
    return tex(c);
  });
}

export function brickTex() {
  return memo("brick", () => {
    const c = canvas(256, 256), g = c.getContext("2d"), r = rand(11);
    g.fillStyle = "#cfc6b8"; g.fillRect(0, 0, 256, 256);
    for (let row = 0; row < 8; row++) for (let col = -1; col < 5; col++) {
      const x = col * 64 + (row % 2) * 32, y = row * 32;
      const v = 120 + r() * 50; g.fillStyle = `rgb(${v + 40},${v * 0.55},${v * 0.4})`;
      g.fillRect(x + 2, y + 2, 60, 28);
    }
    return tex(c, { repeat: [2, 2] });
  });
}

// ---- Outside (seen through windows): trees + sky ---------------------
export function outsideTex(seed = 1) {
  return memo("outside" + seed, () => {
    const c = canvas(512, 512), g = c.getContext("2d"), r = rand(seed * 99);
    const sky = g.createLinearGradient(0, 0, 0, 512);
    sky.addColorStop(0, "#8fc1ea"); sky.addColorStop(0.6, "#dfeef7"); sky.addColorStop(0.62, "#7da35a"); sky.addColorStop(1, "#4d7a33");
    g.fillStyle = sky; g.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 14; i++) {
      const x = r() * 512, h = 150 + r() * 160, y = 320;
      g.fillStyle = "#4a3320"; g.fillRect(x - 4, y - h * 0.4, 8, h * 0.4);
      for (let k = 0; k < 6; k++) {
        g.fillStyle = `hsl(${95 + r() * 40},${35 + r() * 25}%,${25 + r() * 20}%)`;
        g.beginPath(); g.arc(x + (r() - 0.5) * 50, y - h * 0.45 - r() * h * 0.5, 22 + r() * 30, 0, 7); g.fill();
      }
    }
    return tex(c);
  });
}

// ---- Text label / sign ----------------------------------------------
export function labelTex(text, { w = 512, h = 128, bg = "#1a1a1a", fg = "#f5d27a", font = "bold 64px Georgia", border = null } = {}) {
  const c = canvas(w, h), g = c.getContext("2d");
  if (bg) { g.fillStyle = bg; g.fillRect(0, 0, w, h); }
  if (border) { g.strokeStyle = border; g.lineWidth = 8; g.strokeRect(4, 4, w - 8, h - 8); }
  g.fillStyle = fg; g.font = font; g.textAlign = "center"; g.textBaseline = "middle";
  g.fillText(text, w / 2, h / 2 + 2);
  return tex(c);
}

// ---- Family portrait: a 1990s department-store studio photo ----------
//  Laser background, back row standing, parents seated in front, cats on laps.
const shade = (hex, k) => {
  const n = parseInt(hex.slice(1), 16), f = v => Math.max(0, Math.min(255, Math.round(v * k)));
  return `rgb(${f(n >> 16)},${f((n >> 8) & 255)},${f(n & 255)})`;
};

function drawPerson(g, p, cx, headY, r, bottom) {
  const y0 = headY + 1.2 * r;                      // shoulder line
  const sw = (p.kid ? 1.5 : p.row === "front" ? 1.95 : 1.75) * r;             // half shoulder width
  const hairDark = shade(p.hair, 0.72);

  // long / volume hair falls behind the shoulders
  if (p.hairStyle === "long" || p.hairStyle === "volume") {
    const w = p.hairStyle === "volume" ? 1.45 : 1.18, len = p.hairStyle === "volume" ? 1.55 : 2.15;
    const hg = g.createLinearGradient(cx, headY - r, cx, headY + len * r);
    hg.addColorStop(0, p.hair); hg.addColorStop(1, hairDark);
    g.fillStyle = hg; g.beginPath();
    g.moveTo(cx - w * r, headY);
    g.bezierCurveTo(cx - w * r, headY - 1.5 * r, cx + w * r, headY - 1.5 * r, cx + w * r, headY);
    g.bezierCurveTo(cx + (w + 0.15) * r, headY + len * 0.6 * r, cx + (w + 0.05) * r, headY + len * r, cx + 0.7 * r, headY + len * r);
    g.lineTo(cx - 0.7 * r, headY + len * r);
    g.bezierCurveTo(cx - (w + 0.05) * r, headY + len * r, cx - (w + 0.15) * r, headY + len * 0.6 * r, cx - w * r, headY);
    g.fill();
  }

  // torso with sleeves
  const body = g.createLinearGradient(cx - sw, 0, cx + sw, 0);
  body.addColorStop(0, shade(p.shirt, 0.62)); body.addColorStop(0.35, p.shirt); body.addColorStop(0.65, p.shirt); body.addColorStop(1, shade(p.shirt, 0.55));
  const torso = () => {
    g.beginPath();
    g.moveTo(cx - 0.45 * r, y0 - 0.12 * r);
    g.bezierCurveTo(cx - 1.1 * r, y0 - 0.05 * r, cx - sw, y0 + 0.05 * r, cx - sw - 0.05 * r, y0 + 0.7 * r);
    g.lineTo(cx - sw - 0.25 * r, bottom);
    g.lineTo(cx + sw + 0.25 * r, bottom);
    g.lineTo(cx + sw + 0.05 * r, y0 + 0.7 * r);
    g.bezierCurveTo(cx + sw, y0 + 0.05 * r, cx + 1.1 * r, y0 - 0.05 * r, cx + 0.45 * r, y0 - 0.12 * r);
    g.closePath();
  };
  g.fillStyle = body; torso(); g.fill();
  // arm creases
  g.strokeStyle = shade(p.shirt, 0.6); g.lineWidth = 0.06 * r; g.lineCap = "round";
  [-1, 1].forEach(s => { g.beginPath(); g.moveTo(cx + s * (sw - 0.45 * r), y0 + 0.55 * r); g.quadraticCurveTo(cx + s * (sw - 0.55 * r), y0 + 1.6 * r, cx + s * (sw - 0.4 * r), bottom); g.stroke(); });

  // clothing details
  g.save(); torso(); g.clip();
  if (p.top === "stripes") {
    [0.9, 1.35].forEach((dy, i) => { g.fillStyle = i ? "#f2c14e" : "#e7e1d3"; g.fillRect(cx - sw - 0.3 * r, y0 + dy * r, 2 * sw + 0.6 * r, 0.22 * r); });
  } else if (p.top === "flannel") {
    g.globalAlpha = 0.28; g.fillStyle = "#3a1a0a";
    for (let x = -3; x <= 3; x++) g.fillRect(cx + x * 0.55 * r, y0, 0.16 * r, bottom - y0);
    for (let y = 0; y < 6; y++) g.fillRect(cx - sw - 0.3 * r, y0 + 0.3 * r + y * 0.55 * r, 2 * sw + 0.6 * r, 0.16 * r);
    g.globalAlpha = 1;
  } else if (p.top === "sweater") {
    g.strokeStyle = "rgba(255,255,255,0.16)"; g.lineWidth = 0.05 * r;
    for (let x = -4; x <= 4; x++) { g.beginPath(); g.moveTo(cx + x * 0.4 * r, y0 + 0.9 * r); g.lineTo(cx + x * 0.4 * r, bottom); g.stroke(); }
    g.fillStyle = "rgba(255,255,255,0.13)"; g.fillRect(cx - sw, y0 + 0.75 * r, 2 * sw, 0.12 * r);
  }
  g.restore();

  // neck
  const neckW = (p.kid ? 0.42 : 0.5) * r;
  g.fillStyle = shade(p.skin, 0.86); g.fillRect(cx - neckW, headY + 0.55 * r, 2 * neckW, 0.75 * r);
  // collars
  if (p.top === "turtleneck") {
    g.fillStyle = shade(p.shirt, 0.9); roundRectP(g, cx - 0.62 * r, headY + 0.85 * r, 1.24 * r, 0.5 * r, 0.18 * r); g.fill();
    g.strokeStyle = shade(p.shirt, 0.7); g.lineWidth = 0.04 * r;
    for (let i = 1; i < 3; i++) { g.beginPath(); g.moveTo(cx - 0.6 * r, headY + (0.85 + i * 0.15) * r); g.lineTo(cx + 0.6 * r, headY + (0.85 + i * 0.15) * r); g.stroke(); }
  } else if (p.top === "polo" || p.top === "flannel") {
    g.fillStyle = p.top === "polo" ? "#f4f1ea" : shade(p.shirt, 1.15);
    [-1, 1].forEach(s => { g.beginPath(); g.moveTo(cx, y0 + 0.25 * r); g.lineTo(cx + s * 0.62 * r, y0 - 0.2 * r); g.lineTo(cx + s * 0.42 * r, y0 + 0.42 * r); g.closePath(); g.fill(); });
    g.fillStyle = shade(p.shirt, 0.7); g.beginPath(); g.arc(cx, y0 + 0.55 * r, 0.05 * r, 0, 7); g.arc(cx, y0 + 0.85 * r, 0.05 * r, 0, 7); g.fill();
  } else {
    g.fillStyle = shade(p.shirt, 0.78); g.beginPath(); g.ellipse(cx, y0 - 0.02 * r, 0.62 * r, 0.24 * r, 0, 0, Math.PI); g.fill();
    if (p.top === "sweater") { g.fillStyle = "#f4f1ea"; [-1, 1].forEach(s => { g.beginPath(); g.moveTo(cx, y0 + 0.1 * r); g.lineTo(cx + s * 0.4 * r, y0 - 0.18 * r); g.lineTo(cx + s * 0.18 * r, y0 + 0.22 * r); g.closePath(); g.fill(); }); }
  }

  // ears + face
  g.fillStyle = shade(p.skin, 0.92);
  g.beginPath(); g.ellipse(cx - 0.9 * r, headY + 0.05 * r, 0.17 * r, 0.26 * r, 0, 0, 7); g.ellipse(cx + 0.9 * r, headY + 0.05 * r, 0.17 * r, 0.26 * r, 0, 0, 7); g.fill();
  const face = g.createRadialGradient(cx - 0.25 * r, headY - 0.3 * r, 0.1 * r, cx, headY, 1.15 * r);
  face.addColorStop(0, shade(p.skin, 1.06)); face.addColorStop(1, shade(p.skin, 0.88));
  g.fillStyle = face; g.beginPath();
  g.moveTo(cx - 0.88 * r, headY - 0.2 * r);
  g.bezierCurveTo(cx - 0.9 * r, headY - 1.25 * r, cx + 0.9 * r, headY - 1.25 * r, cx + 0.88 * r, headY - 0.2 * r);
  g.bezierCurveTo(cx + 0.86 * r, headY + 0.55 * r, cx + 0.45 * r, headY + 1.0 * r, cx, headY + 1.02 * r);
  g.bezierCurveTo(cx - 0.45 * r, headY + 1.0 * r, cx - 0.86 * r, headY + 0.55 * r, cx - 0.88 * r, headY - 0.2 * r);
  g.fill();

  // features
  g.fillStyle = "rgba(240,110,110,0.22)"; g.beginPath(); g.ellipse(cx - 0.5 * r, headY + 0.32 * r, 0.2 * r, 0.13 * r, 0, 0, 7); g.ellipse(cx + 0.5 * r, headY + 0.32 * r, 0.2 * r, 0.13 * r, 0, 0, 7); g.fill();
  g.strokeStyle = shade(p.hair, 0.8); g.lineWidth = 0.08 * r; g.lineCap = "round";
  [-1, 1].forEach(s => { g.beginPath(); g.moveTo(cx + s * 0.18 * r, headY - 0.3 * r); g.quadraticCurveTo(cx + s * 0.38 * r, headY - 0.42 * r, cx + s * 0.58 * r, headY - 0.3 * r); g.stroke(); });
  [-1, 1].forEach(s => {
    g.fillStyle = "#fff"; g.beginPath(); g.ellipse(cx + s * 0.37 * r, headY - 0.06 * r, 0.15 * r, 0.1 * r, 0, 0, 7); g.fill();
    g.fillStyle = "#3a2516"; g.beginPath(); g.arc(cx + s * 0.37 * r, headY - 0.06 * r, 0.085 * r, 0, 7); g.fill();
    g.fillStyle = "#fff"; g.beginPath(); g.arc(cx + s * 0.37 * r + 0.03 * r, headY - 0.09 * r, 0.025 * r, 0, 7); g.fill();
  });
  g.strokeStyle = shade(p.skin, 0.72); g.lineWidth = 0.05 * r;
  g.beginPath(); g.moveTo(cx - 0.02 * r, headY - 0.02 * r); g.quadraticCurveTo(cx - 0.14 * r, headY + 0.3 * r, cx + 0.06 * r, headY + 0.33 * r); g.stroke();
  // smile with teeth
  g.fillStyle = "#7a2b2b"; g.beginPath(); g.moveTo(cx - 0.32 * r, headY + 0.52 * r); g.quadraticCurveTo(cx, headY + 0.86 * r, cx + 0.32 * r, headY + 0.52 * r); g.quadraticCurveTo(cx, headY + 0.62 * r, cx - 0.32 * r, headY + 0.52 * r); g.fill();
  g.fillStyle = "#fbf6ee"; g.beginPath(); g.moveTo(cx - 0.26 * r, headY + 0.55 * r); g.quadraticCurveTo(cx, headY + 0.66 * r, cx + 0.26 * r, headY + 0.55 * r); g.quadraticCurveTo(cx, headY + 0.7 * r, cx - 0.26 * r, headY + 0.55 * r); g.fill();

  if (p.glasses) {
    g.strokeStyle = "#5a3b22"; g.lineWidth = 0.06 * r;
    [-1, 1].forEach(s => { roundRectP(g, cx + s * 0.37 * r - 0.27 * r, headY - 0.27 * r, 0.54 * r, 0.42 * r, 0.12 * r); g.stroke(); });
    g.beginPath(); g.moveTo(cx - 0.1 * r, headY - 0.1 * r); g.lineTo(cx + 0.1 * r, headY - 0.1 * r); g.stroke();
    g.fillStyle = "rgba(255,255,255,0.12)"; [-1, 1].forEach(s => { roundRectP(g, cx + s * 0.37 * r - 0.25 * r, headY - 0.25 * r, 0.5 * r, 0.38 * r, 0.1 * r); g.fill(); });
  }

  // hair (front)
  const hg = g.createLinearGradient(cx, headY - 1.2 * r, cx, headY);
  hg.addColorStop(0, shade(p.hair, 1.18)); hg.addColorStop(1, p.hair);
  g.fillStyle = hg; g.beginPath();
  const top = (bulge = 1) => { g.moveTo(cx - 0.95 * r, headY - 0.1 * r); g.bezierCurveTo(cx - 1.0 * r * bulge, headY - 1.45 * r * bulge, cx + 1.0 * r * bulge, headY - 1.45 * r * bulge, cx + 0.95 * r, headY - 0.1 * r); };
  switch (p.hairStyle) {
    case "bowl":
      top(1.02); g.lineTo(cx + 0.9 * r, headY - 0.32 * r); g.lineTo(cx - 0.9 * r, headY - 0.32 * r); g.closePath(); g.fill();
      g.strokeStyle = hairDark; g.lineWidth = 0.03 * r; for (let i = -6; i <= 6; i++) { g.beginPath(); g.moveTo(cx + i * 0.13 * r, headY - 0.34 * r); g.lineTo(cx + i * 0.12 * r, headY - 0.6 * r); g.stroke(); }
      break;
    case "curtains":
      top(1.05); g.lineTo(cx + 0.85 * r, headY - 0.25 * r);
      g.quadraticCurveTo(cx + 0.35 * r, headY - 0.45 * r, cx + 0.04 * r, headY - 0.85 * r);
      g.quadraticCurveTo(cx - 0.35 * r, headY - 0.45 * r, cx - 0.85 * r, headY - 0.25 * r); g.closePath(); g.fill();
      break;
    case "gray":
      g.moveTo(cx - 0.95 * r, headY - 0.05 * r); g.bezierCurveTo(cx - 1.0 * r, headY - 1.35 * r, cx + 1.0 * r, headY - 1.35 * r, cx + 0.95 * r, headY - 0.05 * r);
      g.lineTo(cx + 0.82 * r, headY - 0.5 * r); g.quadraticCurveTo(cx + 0.55 * r, headY - 0.8 * r, cx + 0.2 * r, headY - 0.78 * r);
      g.quadraticCurveTo(cx - 0.2 * r, headY - 0.95 * r, cx - 0.82 * r, headY - 0.5 * r); g.closePath(); g.fill();
      break;
    case "volume":
      g.moveTo(cx - 1.1 * r, headY + 0.2 * r); g.bezierCurveTo(cx - 1.45 * r, headY - 1.7 * r, cx + 1.45 * r, headY - 1.7 * r, cx + 1.1 * r, headY + 0.2 * r);
      g.quadraticCurveTo(cx + 0.95 * r, headY - 0.45 * r, cx + 0.35 * r, headY - 0.62 * r);
      g.quadraticCurveTo(cx - 0.4 * r, headY - 0.75 * r, cx - 0.85 * r, headY - 0.3 * r);
      g.quadraticCurveTo(cx - 0.95 * r, headY - 0.1 * r, cx - 1.1 * r, headY + 0.2 * r); g.fill();
      g.strokeStyle = shade(p.hair, 1.22); g.lineWidth = 0.045 * r;
      [[-0.75, -0.75, 0.9], [-0.35, -1.05, 0.5], [0.3, -1.05, 2.6], [0.72, -0.72, 2.2]].forEach(([dx, dy, a0]) => { g.beginPath(); g.arc(cx + dx * r, headY + dy * r, 0.2 * r, a0, a0 + 2.2); g.stroke(); });
      break;
    case "long":
      top(1.03); g.lineTo(cx + 0.9 * r, headY - 0.2 * r);
      g.quadraticCurveTo(cx + 0.55 * r, headY - 0.5 * r, cx - 0.2 * r, headY - 0.62 * r);
      g.quadraticCurveTo(cx - 0.7 * r, headY - 0.5 * r, cx - 0.9 * r, headY - 0.2 * r); g.closePath(); g.fill();
      break;
    default: // short with a side part
      top(1.0); g.lineTo(cx + 0.88 * r, headY - 0.4 * r);
      g.quadraticCurveTo(cx + 0.3 * r, headY - 0.62 * r, cx - 0.3 * r, headY - 0.78 * r);
      g.quadraticCurveTo(cx - 0.72 * r, headY - 0.62 * r, cx - 0.88 * r, headY - 0.4 * r); g.closePath(); g.fill();
      g.strokeStyle = shade(p.hair, 1.4); g.lineWidth = 0.04 * r; g.beginPath(); g.moveTo(cx - 0.35 * r, headY - 1.05 * r); g.quadraticCurveTo(cx - 0.2 * r, headY - 0.9 * r, cx - 0.3 * r, headY - 0.78 * r); g.stroke();
  }
  // soft hair sheen
  g.fillStyle = "rgba(255,255,255,0.10)"; g.beginPath(); g.ellipse(cx - 0.3 * r, headY - 0.95 * r, 0.35 * r, 0.12 * r, -0.4, 0, 7); g.fill();
}

function drawCat(g, cat, cx, by, s, { tabby = false } = {}) {
  const fur = cat.color, dark = cat.stripe, belly = cat.belly || shade(cat.color, 1.2);
  // tail
  g.strokeStyle = fur; g.lineWidth = 16 * s; g.lineCap = "round";
  g.beginPath(); g.moveTo(cx + 50 * s, by - 18 * s); g.bezierCurveTo(cx + 120 * s, by - 10 * s, cx + 112 * s, by - 90 * s, cx + 84 * s, by - 110 * s); g.stroke();
  // body (sitting, pear-shaped)
  const bg = g.createRadialGradient(cx - 20 * s, by - 90 * s, 10 * s, cx, by - 50 * s, 95 * s);
  bg.addColorStop(0, shade(fur, 1.08)); bg.addColorStop(1, shade(fur, 0.82));
  g.fillStyle = bg; g.beginPath();
  g.moveTo(cx - 34 * s, by - 120 * s);
  g.bezierCurveTo(cx - 70 * s, by - 80 * s, cx - 78 * s, by, cx - 30 * s, by);
  g.lineTo(cx + 30 * s, by);
  g.bezierCurveTo(cx + 78 * s, by, cx + 70 * s, by - 80 * s, cx + 34 * s, by - 120 * s);
  g.closePath(); g.fill();
  g.fillStyle = belly; g.beginPath(); g.ellipse(cx, by - 52 * s, 26 * s, 44 * s, 0, 0, 7); g.fill();
  // front paws
  g.fillStyle = shade(fur, 1.05); [-1, 1].forEach(k => { g.beginPath(); g.ellipse(cx + k * 18 * s, by - 6 * s, 15 * s, 9 * s, 0, 0, 7); g.fill(); });
  if (tabby) { g.strokeStyle = dark; g.lineWidth = 7 * s; [[-56, -70], [-60, -45], [52, -70], [58, -45]].forEach(([x, y]) => { g.beginPath(); g.moveTo(cx + x * s, by + y * s); g.quadraticCurveTo(cx + x * 0.8 * s, by + (y - 6) * s, cx + x * 0.62 * s, by + (y - 2) * s); g.stroke(); }); }
  // head
  const hy = by - 140 * s;
  g.fillStyle = fur;
  [-1, 1].forEach(k => { g.beginPath(); g.moveTo(cx + k * 40 * s, hy - 10 * s); g.lineTo(cx + k * 40 * s, hy - 62 * s); g.lineTo(cx + k * 10 * s, hy - 34 * s); g.closePath(); g.fill(); });
  g.fillStyle = "#f2a7b4"; [-1, 1].forEach(k => { g.beginPath(); g.moveTo(cx + k * 35 * s, hy - 18 * s); g.lineTo(cx + k * 37 * s, hy - 50 * s); g.lineTo(cx + k * 17 * s, hy - 32 * s); g.closePath(); g.fill(); });
  const hgd = g.createRadialGradient(cx - 12 * s, hy - 14 * s, 4 * s, cx, hy, 50 * s);
  hgd.addColorStop(0, shade(fur, 1.1)); hgd.addColorStop(1, shade(fur, 0.9));
  g.fillStyle = hgd; g.beginPath(); g.ellipse(cx, hy, 46 * s, 38 * s, 0, 0, 7); g.fill();
  if (tabby || cat.stripe) {
    g.strokeStyle = dark; g.lineWidth = (tabby ? 5 : 3.5) * s; g.lineCap = "round";
    for (let k = -1; k <= 1; k++) { g.beginPath(); g.moveTo(cx + k * 11 * s, hy - 34 * s); g.lineTo(cx + k * 8 * s, hy - 18 * s); g.stroke(); }
    if (tabby) [-1, 1].forEach(k => { g.beginPath(); g.moveTo(cx + k * 44 * s, hy + 2 * s); g.lineTo(cx + k * 28 * s, hy + 4 * s); g.stroke(); });
  }
  g.fillStyle = belly; g.beginPath(); g.ellipse(cx - 11 * s, hy + 16 * s, 14 * s, 11 * s, 0, 0, 7); g.ellipse(cx + 11 * s, hy + 16 * s, 14 * s, 11 * s, 0, 0, 7); g.fill();
  // eyes
  [-1, 1].forEach(k => {
    g.fillStyle = "#b9d84a"; g.beginPath(); g.ellipse(cx + k * 18 * s, hy - 4 * s, 9 * s, 10 * s, 0, 0, 7); g.fill();
    g.fillStyle = "#151515"; g.beginPath(); g.ellipse(cx + k * 18 * s, hy - 4 * s, 3.2 * s, 8.5 * s, 0, 0, 7); g.fill();
    g.fillStyle = "#fff"; g.beginPath(); g.arc(cx + k * 18 * s + 3 * s, hy - 8 * s, 2 * s, 0, 7); g.fill();
  });
  g.fillStyle = "#e07f93"; g.beginPath(); g.moveTo(cx - 6 * s, hy + 8 * s); g.lineTo(cx + 6 * s, hy + 8 * s); g.lineTo(cx, hy + 14 * s); g.closePath(); g.fill();
  g.strokeStyle = "rgba(255,255,255,0.75)"; g.lineWidth = 1.4 * s;
  [-1, 1].forEach(k => [-4, 2, 8].forEach(d => { g.beginPath(); g.moveTo(cx + k * 20 * s, hy + 16 * s); g.lineTo(cx + k * 62 * s, hy + (14 + d) * s); g.stroke(); }));
}

function roundRectP(g, x, y, w, h, r) {
  g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r);
  g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath();
}

export function portraitCanvas(family, cats) {
  const W = 1280, H = 960, c = canvas(W, H), g = c.getContext("2d");
  // laser background
  const bg = g.createRadialGradient(W / 2, H * 0.38, 30, W / 2, H * 0.45, 820);
  bg.addColorStop(0, "#9ff3ff"); bg.addColorStop(0.18, "#3f8fe0"); bg.addColorStop(0.55, "#2a2f9e"); bg.addColorStop(1, "#120a36");
  g.fillStyle = bg; g.fillRect(0, 0, W, H);
  g.globalCompositeOperation = "lighter";
  for (let i = 0; i < 36; i++) {
    const a = (i / 36) * Math.PI * 2 + 0.04, col = ["rgba(255,90,220,0.32)", "rgba(110,255,255,0.30)", "rgba(255,255,140,0.18)"][i % 3];
    g.strokeStyle = col; g.lineWidth = 2 + (i % 4);
    g.beginPath(); g.moveTo(W / 2, H * 0.36); g.lineTo(W / 2 + Math.cos(a) * 1200, H * 0.36 + Math.sin(a) * 1200); g.stroke();
  }
  const glow = g.createRadialGradient(W / 2, H * 0.36, 0, W / 2, H * 0.36, 260);
  glow.addColorStop(0, "rgba(255,255,255,0.55)"); glow.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = glow; g.fillRect(0, 0, W, H);
  g.globalCompositeOperation = "source-over";

  // back row (standing), then front row (seated)
  const back = family.filter(p => p.row !== "front"), front = family.filter(p => p.row === "front");
  back.forEach((p, i) => {
    const r = p.kid ? 66 : 74, cx = W * (0.5 + (i - (back.length - 1) / 2) * 0.205);
    drawPerson(g, p, cx, (p.kid ? 335 : 300) + (i % 2) * 14, r, H);
  });
  front.forEach((p, i) => {
    const cx = W * (0.5 + (i - (front.length - 1) / 2) * 0.33);
    drawPerson(g, p, cx, 545, 80, H + 40);
  });
  // cats: one on each lap, one in front
  const [c0, c1, c2] = cats;
  if (c2) drawCat(g, c2, W * 0.5 - W * 0.165, H - 10, 1.05, { tabby: /tabby/i.test(c2.look || "") });
  if (c1) drawCat(g, c1, W * 0.5 + W * 0.165, H - 10, 1.0);
  if (c0) drawCat(g, c0, W * 0.5, H - 4, 1.2);

  // studio softness: oval vignette, warm grade and grain
  const vig = g.createRadialGradient(W / 2, H * 0.48, 330, W / 2, H * 0.5, 820);
  vig.addColorStop(0, "rgba(0,0,0,0)"); vig.addColorStop(1, "rgba(5,0,25,0.62)");
  g.fillStyle = vig; g.fillRect(0, 0, W, H);
  g.fillStyle = "rgba(255,200,140,0.06)"; g.fillRect(0, 0, W, H);
  const r = rand(96), d = g.getImageData(0, 0, W, H);
  for (let i = 0; i < d.data.length; i += 4) { const n = (r() - 0.5) * 14; d.data[i] += n; d.data[i + 1] += n; d.data[i + 2] += n; }
  g.putImageData(d, 0, 0);
  g.fillStyle = "rgba(255,240,215,0.82)"; g.font = "italic 30px Georgia"; g.textAlign = "right";
  g.fillText("The Cerchios · Picture Day ’96", W - 30, H - 26);
  return c;
}

// ---- Certificate -----------------------------------------------------
export function certificateTex(cert) {
  const c = canvas(512, 384), g = c.getContext("2d");
  g.fillStyle = "#fbf6e6"; g.fillRect(0, 0, 512, 384);
  g.strokeStyle = cert.color; g.lineWidth = 12; g.strokeRect(14, 14, 484, 356);
  g.strokeStyle = "#c9a54a"; g.lineWidth = 3; g.strokeRect(32, 32, 448, 320);
  g.fillStyle = "#333"; g.textAlign = "center";
  g.font = "italic 22px Georgia"; g.fillText("Certificate of Achievement", 256, 80);
  g.fillStyle = cert.color; g.font = "bold 30px Georgia";
  wrap(g, cert.name, 256, 140, 420, 34);
  g.fillStyle = "#555"; g.font = "20px Georgia"; g.fillText(cert.issuer, 256, 250);
  g.fillStyle = "#333"; g.font = "italic 24px 'Brush Script MT', cursive"; g.fillText("Dominic Cerchio", 256, 300);
  g.fillStyle = "#c9a54a"; g.beginPath(); g.arc(420, 310, 30, 0, 7); g.fill();
  g.fillStyle = "#fff"; g.font = "bold 12px Arial"; g.fillText(cert.code.slice(0, 10), 420, 314);
  return tex(c);
}
function wrap(g, text, x, y, maxW, lh) {
  const words = text.split(" "); let line = "", yy = y;
  for (const w of words) {
    const t = line ? line + " " + w : w;
    if (g.measureText(t).width > maxW && line) { g.fillText(line, x, yy); line = w; yy += lh; } else line = t;
  }
  g.fillText(line, x, yy);
}

// ---- LinkedIn pin ----------------------------------------------------
export function linkedinTex() {
  return memo("li", () => {
    const c = canvas(128, 128), g = c.getContext("2d");
    g.fillStyle = "#0a66c2"; roundRect(g, 4, 4, 120, 120, 18); g.fill();
    g.fillStyle = "#fff"; g.font = "bold 84px Arial"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("in", 64, 70);
    return tex(c);
  });
}
export function roundRect(g, x, y, w, h, r) {
  g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r);
  g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath();
}

// ---- Book spines -----------------------------------------------------
export function spineTex(title, color) {
  const c = canvas(64, 256), g = c.getContext("2d");
  g.fillStyle = color; g.fillRect(0, 0, 64, 256);
  g.fillStyle = "rgba(255,255,255,0.15)"; g.fillRect(0, 20, 64, 6); g.fillRect(0, 230, 64, 6);
  g.save(); g.translate(32, 128); g.rotate(Math.PI / 2);
  g.fillStyle = "#f3d98b"; g.font = "bold 22px Georgia"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(title, 0, 0);
  g.restore();
  return tex(c);
}

// ---- Dynamic screens (TV, PC, fridge, symbols) -----------------------
export class CanvasScreen {
  constructor(w, h) { this.c = canvas(w, h); this.g = this.c.getContext("2d"); this.texture = tex(this.c); }
  update() { this.texture.needsUpdate = true; }
}

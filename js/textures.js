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

// ---- Family portrait: a 1990s "laser background" studio photo -------
export function portraitCanvas(family, cats) {
  const W = 1024, H = 768, c = canvas(W, H), g = c.getContext("2d");
  const bg = g.createRadialGradient(W / 2, H / 2, 40, W / 2, H / 2, 620);
  bg.addColorStop(0, "#5ad1ff"); bg.addColorStop(0.45, "#2c4fb3"); bg.addColorStop(1, "#140b3a");
  g.fillStyle = bg; g.fillRect(0, 0, W, H);
  g.globalAlpha = 0.35;
  for (let i = 0; i < 28; i++) {
    g.strokeStyle = i % 2 ? "#ff66e0" : "#7ffcff"; g.lineWidth = 3;
    g.beginPath(); g.moveTo(W / 2, H * 0.32); const a = (i / 28) * Math.PI * 2; g.lineTo(W / 2 + Math.cos(a) * 900, H * 0.32 + Math.sin(a) * 900); g.stroke();
  }
  g.globalAlpha = 1;
  const n = family.length, slot = W / (n + 0.6), baseY = H * 0.93;
  const order = family.map((_, i) => i);
  order.forEach((idx, k) => {
    const p = family[idx], cx = slot * (k + 0.8), s = p.h;
    const headR = 46 * s, headY = baseY - 420 * s;
    g.fillStyle = p.shirt; g.beginPath();
    g.moveTo(cx - 92 * s, baseY); g.quadraticCurveTo(cx - 95 * s, headY + 90 * s, cx - 30 * s, headY + 62 * s);
    g.lineTo(cx + 30 * s, headY + 62 * s); g.quadraticCurveTo(cx + 95 * s, headY + 90 * s, cx + 92 * s, baseY); g.closePath(); g.fill();
    g.fillStyle = "rgba(255,255,255,0.18)"; g.beginPath(); g.moveTo(cx - 18 * s, headY + 62 * s); g.lineTo(cx, headY + 100 * s); g.lineTo(cx + 18 * s, headY + 62 * s); g.fill();
    g.fillStyle = p.skin; g.fillRect(cx - 14 * s, headY + 30 * s, 28 * s, 36 * s);
    if (p.hairStyle === "long") { g.fillStyle = p.hair; g.beginPath(); g.ellipse(cx, headY + 30 * s, headR * 1.25, headR * 1.7, 0, 0, 7); g.fill(); }
    g.fillStyle = p.skin; g.beginPath(); g.ellipse(cx, headY, headR * 0.92, headR * 1.08, 0, 0, 7); g.fill();
    g.fillStyle = p.hair; g.beginPath();
    if (p.hairStyle === "spiky") {
      g.moveTo(cx - headR, headY - 6 * s);
      for (let i = 0; i <= 6; i++) g.lineTo(cx - headR + (i * headR * 2) / 6, headY - headR * (i % 2 ? 1.45 : 1.05));
      g.lineTo(cx + headR, headY - 6 * s); g.closePath();
    } else { g.ellipse(cx, headY - headR * 0.45, headR * 1.0, headR * 0.7, 0, Math.PI, 0); }
    g.fill();
    g.fillStyle = "#1b1b1b";
    g.beginPath(); g.arc(cx - 16 * s, headY - 4 * s, 4.5 * s, 0, 7); g.arc(cx + 16 * s, headY - 4 * s, 4.5 * s, 0, 7); g.fill();
    g.strokeStyle = "#7a2e2e"; g.lineWidth = 4 * s; g.beginPath(); g.arc(cx, headY + 14 * s, 15 * s, 0.15 * Math.PI, 0.85 * Math.PI); g.stroke();
    g.fillStyle = "rgba(255,120,120,0.25)"; g.beginPath(); g.arc(cx - 27 * s, headY + 10 * s, 9 * s, 0, 7); g.arc(cx + 27 * s, headY + 10 * s, 9 * s, 0, 7); g.fill();
  });
  cats.forEach((cat, i) => {
    const cx = W * (0.24 + i * 0.26), cy = H * 0.92, s = 1.05;
    g.fillStyle = cat.color;
    g.beginPath(); g.ellipse(cx, cy - 40 * s, 62 * s, 46 * s, 0, 0, 7); g.fill();
    g.beginPath(); g.arc(cx, cy - 102 * s, 40 * s, 0, 7); g.fill();
    g.beginPath(); g.moveTo(cx - 36 * s, cy - 118 * s); g.lineTo(cx - 28 * s, cy - 160 * s); g.lineTo(cx - 6 * s, cy - 136 * s); g.fill();
    g.beginPath(); g.moveTo(cx + 36 * s, cy - 118 * s); g.lineTo(cx + 28 * s, cy - 160 * s); g.lineTo(cx + 6 * s, cy - 136 * s); g.fill();
    g.strokeStyle = cat.color; g.lineWidth = 14 * s; g.lineCap = "round";
    g.beginPath(); g.moveTo(cx + 55 * s, cy - 30 * s); g.quadraticCurveTo(cx + 110 * s, cy - 40 * s, cx + 96 * s, cy - 110 * s); g.stroke();
    g.strokeStyle = cat.stripe; g.lineWidth = 6 * s;
    for (let k = -1; k <= 1; k++) { g.beginPath(); g.moveTo(cx + k * 18 * s, cy - 140 * s); g.lineTo(cx + k * 14 * s, cy - 122 * s); g.stroke(); }
    g.fillStyle = "#c9f26a"; g.beginPath(); g.ellipse(cx - 14 * s, cy - 106 * s, 7 * s, 9 * s, 0, 0, 7); g.ellipse(cx + 14 * s, cy - 106 * s, 7 * s, 9 * s, 0, 0, 7); g.fill();
    g.fillStyle = "#111"; g.fillRect(cx - 16 * s, cy - 113 * s, 4 * s, 14 * s); g.fillRect(cx + 12 * s, cy - 113 * s, 4 * s, 14 * s);
    g.fillStyle = "#f29bb0"; g.beginPath(); g.moveTo(cx - 6 * s, cy - 92 * s); g.lineTo(cx + 6 * s, cy - 92 * s); g.lineTo(cx, cy - 85 * s); g.fill();
  });
  g.fillStyle = "rgba(255,255,255,0.85)"; g.font = "italic 26px Georgia"; g.textAlign = "right";
  g.fillText("The Cerchios · Picture Day ’96", W - 24, 40);
  const vig = g.createRadialGradient(W / 2, H / 2, 300, W / 2, H / 2, 700);
  vig.addColorStop(0, "rgba(0,0,0,0)"); vig.addColorStop(1, "rgba(0,0,0,0.45)");
  g.fillStyle = vig; g.fillRect(0, 0, W, H);
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

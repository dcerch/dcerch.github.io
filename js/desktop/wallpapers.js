// =====================================================================
//  wallpapers.js — the Display Properties library: desktop wallpapers and
//  8×8 patterns "in the spirit of" each Windows era, 3.1 through XP.
//  Every one is painted procedurally in the browser. No Microsoft images.
//
//  kind "tile"  → draw(g, s) paints one seamless s×s tile (CSS px)
//  kind "scene" → draw(g, W, H, k) paints the whole screen (k = px per CSS px)
//  kind "solid" → color
// =====================================================================
import { paintHills } from "./wallpaper.js";

const rng = seed => { let s = seed % 2147483647 || 1; return () => ((s = (s * 16807) % 2147483647) / 2147483647); };
const TAU = Math.PI * 2;

// periodic value noise, so tiles wrap seamlessly
function noise2(period, seed) {
  const r = rng(seed), v = Array.from({ length: period * period }, r);
  const at = (x, y) => v[((y % period) + period) % period * period + ((x % period) + period) % period];
  const sm = t => t * t * (3 - 2 * t);
  return (x, y) => {
    const xi = Math.floor(x), yi = Math.floor(y), fx = sm(x - xi), fy = sm(y - yi);
    const a = at(xi, yi), b = at(xi + 1, yi), c = at(xi, yi + 1), d = at(xi + 1, yi + 1);
    return a + (b - a) * fx + (c - a) * fy + (a - b - c + d) * fx * fy;
  };
}
function fbm(n, x, y, oct = 4) { let s = 0, a = 0.5, f = 1; for (let i = 0; i < oct; i++) { s += a * n(x * f, y * f); a /= 2; f *= 2; } return s; }
// paint a tile pixel-by-pixel from a function returning [r,g,b]
function pixels(g, s, fn) {
  const c = g.canvas, k = c.width / s, W = c.width, img = g.createImageData(W, W), d = img.data;
  for (let y = 0; y < W; y++) for (let x = 0; x < W; x++) { const [r, gg, b] = fn(x / k, y / k), i = (y * W + x) * 4; d[i] = r; d[i + 1] = gg; d[i + 2] = b; d[i + 3] = 255; }
  g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.putImageData(img, 0, 0); g.restore();
}
// draw something at every wrap offset so it crosses tile edges cleanly
const wrap9 = (s, f) => { for (const dx of [-s, 0, s]) for (const dy of [-s, 0, s]) f(dx, dy); };
const mix = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t));

// ---------------------------------------------------------------- shared sky + clouds
function sky(g, W, H, stops) { const gr = g.createLinearGradient(0, 0, 0, H); stops.forEach(([t, c]) => gr.addColorStop(t, c)); g.fillStyle = gr; g.fillRect(0, 0, W, H); }
function puffCloud(g, cx, cy, w, h, n, r, bright = 1) {
  for (let i = 0; i < n; i++) {
    const t = r(), x = cx + (t - 0.5) * w, edge = 1 - Math.abs(t - 0.5) * 2, rad = h * (0.35 + r() * 0.45) * (0.55 + edge * 0.6), y = cy - edge * h * 0.45 * r() + rad * 0.15;
    const gr = g.createRadialGradient(x - rad * 0.3, y - rad * 0.45, rad * 0.05, x, y, rad);
    gr.addColorStop(0, `rgba(255,255,255,${0.95 * bright})`); gr.addColorStop(0.5, `rgba(248,251,255,${0.8 * bright})`); gr.addColorStop(0.85, `rgba(200,218,240,${0.35 * bright})`); gr.addColorStop(1, "rgba(190,210,240,0)");
    g.fillStyle = gr; g.beginPath(); g.arc(x, y, rad, 0, TAU); g.fill();
  }
}
function blurred(g, W, H, k, px, paint) {
  const c = document.createElement("canvas"); c.width = W; c.height = H; paint(c.getContext("2d"));
  g.save(); g.filter = `blur(${Math.max(0.5, px * k)}px)`; g.drawImage(c, 0, 0); g.restore();
}

// ---------------------------------------------------------------- scenes
const SCENES = {
  // the famous blue-sky-and-clouds look of a mid-90s boot screen
  clouds(g, W, H, k) {
    sky(g, W, H, [[0, "#2f6ccf"], [0.55, "#5b95e2"], [1, "#9cc6f2"]]);
    const r = rng(95), S = Math.min(W, H * 1.6);
    blurred(g, W, H, k, 3, c => {
      for (let i = 0; i < 16; i++) puffCloud(c, r() * W, H * (0.08 + r() * 0.88), S * (0.16 + r() * 0.3), S * (0.05 + r() * 0.08), 26 + (r() * 30 | 0), r, 0.85 + r() * 0.15);
    });
  },
  setup(g, W, H) { sky(g, W, H, [[0, "#0000b0"], [1, "#000010"]]); },
  hills(g, W, H, k) { paintHills(g.canvas, W, H, k); },
  space(g, W, H, k) {
    sky(g, W, H, [[0, "#02020c"], [1, "#0a0a2a"]]);
    const r = rng(1998);
    [["#6a2aa0", 0.2, 0.3, 0.5], ["#1a6aa0", 0.75, 0.25, 0.4], ["#a02a5a", 0.55, 0.7, 0.35]].forEach(([c, x, y, rad]) => {
      const gr = g.createRadialGradient(W * x, H * y, 0, W * x, H * y, Math.max(W, H) * rad); gr.addColorStop(0, c + "66"); gr.addColorStop(1, c + "00"); g.fillStyle = gr; g.fillRect(0, 0, W, H);
    });
    for (let i = 0, n = (W * H) / (900 * k * k); i < n; i++) { const b = r(); g.fillStyle = `rgba(255,${230 + r() * 25 | 0},${200 + r() * 55 | 0},${0.3 + b * 0.7})`; g.beginPath(); g.arc(r() * W, r() * H, (b > 0.97 ? 1.6 : 0.6) * k, 0, TAU); g.fill(); }
    // ringed planet, lower right
    const px = W * 0.78, py = H * 0.72, pr = Math.min(W, H) * 0.2;
    g.save(); g.translate(px, py); g.rotate(-0.35);
    g.strokeStyle = "rgba(230,200,150,.55)"; g.lineWidth = pr * 0.08; g.beginPath(); g.ellipse(0, 0, pr * 1.8, pr * 0.42, 0, Math.PI, TAU); g.stroke();
    g.restore();
    const pg = g.createRadialGradient(px - pr * 0.4, py - pr * 0.4, pr * 0.1, px, py, pr); pg.addColorStop(0, "#f2c88a"); pg.addColorStop(0.6, "#b0703a"); pg.addColorStop(1, "#2a1408");
    g.fillStyle = pg; g.beginPath(); g.arc(px, py, pr, 0, TAU); g.fill();
    g.save(); g.beginPath(); g.arc(px, py, pr, 0, TAU); g.clip(); g.globalAlpha = 0.18; for (let i = -5; i < 6; i++) { g.fillStyle = i % 2 ? "#5a2a10" : "#ffe0b0"; g.fillRect(px - pr, py + i * pr * 0.17, pr * 2, pr * 0.08); } g.restore();
    g.save(); g.translate(px, py); g.rotate(-0.35); g.strokeStyle = "rgba(240,215,170,.7)"; g.lineWidth = pr * 0.08; g.beginPath(); g.ellipse(0, 0, pr * 1.8, pr * 0.42, 0, 0, Math.PI); g.stroke(); g.restore();
  },
  underwater(g, W, H, k) {
    sky(g, W, H, [[0, "#1d8fb8"], [0.5, "#0a5a86"], [1, "#032640"]]);
    const r = rng(77);
    g.save(); g.globalCompositeOperation = "lighter";
    for (let i = 0; i < 9; i++) { const x = r() * W, w = W * (0.03 + r() * 0.06), sk = (r() - 0.5) * W * 0.3; const gr = g.createLinearGradient(0, 0, 0, H * 0.9); gr.addColorStop(0, "rgba(180,240,255,.18)"); gr.addColorStop(1, "rgba(180,240,255,0)"); g.fillStyle = gr; g.beginPath(); g.moveTo(x, 0); g.lineTo(x + w, 0); g.lineTo(x + w * 3 + sk, H * 0.9); g.lineTo(x + sk, H * 0.9); g.fill(); }
    g.restore();
    const sand = g.createLinearGradient(0, H * 0.82, 0, H); sand.addColorStop(0, "#c8b27a"); sand.addColorStop(1, "#6e5a32");
    g.fillStyle = sand; g.beginPath(); g.moveTo(0, H); for (let x = 0; x <= W; x += 8 * k) g.lineTo(x, H * (0.86 + 0.02 * Math.sin(x / W * 9) + 0.015 * Math.sin(x / W * 23))); g.lineTo(W, H); g.fill();
    for (let i = 0; i < 14; i++) { // kelp
      const x = r() * W, hh = H * (0.25 + r() * 0.4); g.strokeStyle = `rgba(${20 + r() * 30 | 0},${90 + r() * 60 | 0},${50 + r() * 30 | 0},.85)`; g.lineWidth = (4 + r() * 6) * k; g.lineCap = "round";
      g.beginPath(); g.moveTo(x, H * 0.9); for (let t = 0; t <= 1; t += 0.05) g.lineTo(x + Math.sin(t * 6 + i) * 14 * k * t * 2, H * 0.9 - hh * t); g.stroke();
    }
    for (let i = 0; i < 60; i++) { const x = r() * W, y = r() * H * 0.85, rad = (2 + r() * 9) * k; g.strokeStyle = "rgba(220,250,255,.55)"; g.lineWidth = k; g.beginPath(); g.arc(x, y, rad, 0, TAU); g.stroke(); g.fillStyle = "rgba(255,255,255,.6)"; g.beginPath(); g.arc(x - rad * 0.35, y - rad * 0.35, rad * 0.25, 0, TAU); g.fill(); }
  },
  circuit(g, W, H, k) {
    g.fillStyle = "#0d4a28"; g.fillRect(0, 0, W, H);
    const r = rng(486), step = 16 * k;
    g.lineCap = "round";
    for (let i = 0, n = (W * H) / (9000 * k * k); i < n; i++) {
      let x = Math.round(r() * W / step) * step, y = Math.round(r() * H / step) * step;
      g.strokeStyle = r() > 0.25 ? "#c9a24a" : "#7fd08a"; g.lineWidth = (r() > 0.7 ? 3 : 1.6) * k;
      g.beginPath(); g.moveTo(x, y);
      for (let s = 0, m = 2 + r() * 5 | 0; s < m; s++) { const d = r() * 4 | 0, len = step * (1 + r() * 5 | 0); if (d === 0) x += len; else if (d === 1) x -= len; else if (d === 2) y += len; else { x += len; y += len; } g.lineTo(x, y); }
      g.stroke(); g.fillStyle = "#e8c860"; g.beginPath(); g.arc(x, y, 3 * k, 0, TAU); g.fill(); g.fillStyle = "#0d4a28"; g.beginPath(); g.arc(x, y, 1.2 * k, 0, TAU); g.fill();
    }
    for (let i = 0, n = (W * H) / (90000 * k * k); i < n; i++) { // chips
      const cw = (40 + r() * 70) * k, ch = (24 + r() * 30) * k, x = r() * W, y = r() * H;
      g.fillStyle = "#c0c0c0"; for (let p = 6 * k; p < cw - 4 * k; p += 8 * k) { g.fillRect(x + p, y - 4 * k, 3 * k, ch + 8 * k); }
      g.fillStyle = "#151515"; g.fillRect(x, y, cw, ch); g.fillStyle = "#333"; g.fillRect(x, y, cw, 2 * k);
      g.fillStyle = "#777"; g.font = `${8 * k}px monospace`; g.fillText("DC-" + (r() * 900 + 100 | 0), x + 4 * k, y + ch / 2 + 3 * k);
    }
  },
  mystery(g, W, H, k) {
    sky(g, W, H, [[0, "#1a0b2e"], [0.6, "#3a1e5a"], [1, "#0b0614"]]);
    const mx = W * 0.72, my = H * 0.28, mr = Math.min(W, H) * 0.09;
    const glow = g.createRadialGradient(mx, my, mr, mx, my, mr * 5); glow.addColorStop(0, "rgba(220,210,255,.35)"); glow.addColorStop(1, "rgba(220,210,255,0)"); g.fillStyle = glow; g.fillRect(0, 0, W, H);
    g.fillStyle = "#efeaff"; g.beginPath(); g.arc(mx, my, mr, 0, TAU); g.fill();
    const r = rng(13);
    blurred(g, W, H, k, 18, c => { for (let i = 0; i < 24; i++) { c.fillStyle = `rgba(${150 + r() * 60 | 0},${120 + r() * 60 | 0},${200 + r() * 55 | 0},.18)`; c.beginPath(); c.ellipse(r() * W, H * (0.5 + r() * 0.5), W * (0.1 + r() * 0.25), H * (0.03 + r() * 0.06), 0, 0, TAU); c.fill(); } });
    g.fillStyle = "#07030d"; g.beginPath(); g.moveTo(0, H); for (let x = 0; x <= W; x += 6 * k) g.lineTo(x, H * (0.86 - 0.05 * Math.sin(x / W * 4 + 1) - 0.02 * Math.sin(x / W * 17))); g.lineTo(W, H); g.fill();
  },
  prairie(g, W, H, k) {
    sky(g, W, H, [[0, "#3b2a6a"], [0.35, "#c45a6a"], [0.58, "#f4a35a"], [0.62, "#ffd890"]]);
    const sun = g.createRadialGradient(W * 0.3, H * 0.6, 0, W * 0.3, H * 0.6, H * 0.3); sun.addColorStop(0, "rgba(255,240,190,.9)"); sun.addColorStop(1, "rgba(255,200,120,0)"); g.fillStyle = sun; g.fillRect(0, 0, W, H);
    const fld = g.createLinearGradient(0, H * 0.6, 0, H); fld.addColorStop(0, "#b8762e"); fld.addColorStop(1, "#4a2a0e"); g.fillStyle = fld; g.fillRect(0, H * 0.6, W, H * 0.4);
    const r = rng(2000);
    g.fillStyle = "#2a1a20"; // lone tree on the horizon
    const tx = W * 0.8, ty = H * 0.6; g.fillRect(tx - 2 * k, ty - 30 * k, 4 * k, 30 * k); for (let i = 0; i < 18; i++) { g.beginPath(); g.arc(tx + (r() - 0.5) * 50 * k, ty - 34 * k - r() * 22 * k, (8 + r() * 10) * k, 0, TAU); g.fill(); }
    for (let i = 0, n = (W * H) / (60 * k * k); i < n; i++) {
      const x = r() * W, y = H * 0.6 + Math.pow(r(), 0.7) * H * 0.4, d = (y - H * 0.6) / (H * 0.4), len = (3 + d * 26) * k;
      g.strokeStyle = `hsla(${32 + r() * 14},${60 + r() * 25}%,${35 + r() * 35 - d * 10}%,${0.25 + d * 0.5})`; g.lineWidth = (0.5 + d * 1.6) * k;
      g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + 2 * k, y - len * 0.6, x + (4 + r() * 6) * k * d, y - len); g.stroke();
    }
  },
  redmaple(g, W, H, k) {
    sky(g, W, H, [[0, "#2a1810"], [1, "#120a06"]]);
    const r = rng(316);
    const leaf = (x, y, s, rot, col) => {
      g.save(); g.translate(x, y); g.rotate(rot); g.fillStyle = col; g.beginPath();
      for (let i = 0; i <= 200; i++) { const t = i / 200 * TAU, lobes = Math.abs(Math.sin(t * 2.5)), rr = s * (0.45 + 0.55 * lobes) * (1 + 0.12 * Math.sin(t * 15)) * (t > Math.PI * 0.8 && t < Math.PI * 1.2 ? 0.55 : 1); const px = Math.sin(t) * rr, py = -Math.cos(t) * rr; i ? g.lineTo(px, py) : g.moveTo(px, py); }
      g.fill(); g.strokeStyle = "rgba(60,10,0,.6)"; g.lineWidth = Math.max(1, s * 0.04); g.beginPath(); g.moveTo(0, s * 0.9); g.lineTo(0, -s * 0.8); g.moveTo(0, 0); g.lineTo(-s * 0.7, -s * 0.4); g.moveTo(0, 0); g.lineTo(s * 0.7, -s * 0.4); g.stroke(); g.restore();
    };
    for (let i = 0, n = (W * H) / (2600 * k * k); i < n; i++) leaf(r() * W, r() * H, (18 + r() * 34) * k, r() * TAU, `hsl(${r() * 38},${70 + r() * 25}%,${28 + r() * 22}%)`);
  },
  snowtrees(g, W, H, k) {
    sky(g, W, H, [[0, "#1a2a5a"], [0.6, "#5a7ab8"], [0.75, "#a8bce0"]]);
    g.fillStyle = "#e8f0ff"; g.fillRect(0, H * 0.75, W, H * 0.25);
    const r = rng(1999);
    const tree = (x, base, hgt, dark) => {
      g.fillStyle = dark; const w = hgt * 0.42;
      for (let t = 0; t < 4; t++) { const y0 = base - hgt * t * 0.22, ww = w * (1 - t * 0.2); g.beginPath(); g.moveTo(x, y0 - hgt * 0.4); g.lineTo(x - ww / 2, y0); g.lineTo(x + ww / 2, y0); g.fill(); g.fillStyle = "rgba(255,255,255,.85)"; g.beginPath(); g.moveTo(x, y0 - hgt * 0.4); g.lineTo(x - ww * 0.18, y0 - hgt * 0.28); g.lineTo(x + ww * 0.2, y0 - hgt * 0.3); g.fill(); g.fillStyle = dark; }
    };
    for (let row = 0; row < 3; row++) for (let i = 0; i < 16 + row * 6; i++) tree(r() * W, H * (0.76 + row * 0.08), (40 + r() * 40) * k * (1 + row * 0.6), ["#3a5a7a", "#1f3a50", "#0f2030"][row]);
    for (let i = 0, n = (W * H) / (1400 * k * k); i < n; i++) { g.fillStyle = "rgba(255,255,255,.8)"; g.beginPath(); g.arc(r() * W, r() * H, (0.6 + r() * 1.6) * k, 0, TAU); g.fill(); }
  },
  azul(g, W, H, k) {
    sky(g, W, H, [[0, "#001a6a"], [0.5, "#0a4ac0"], [1, "#002a8a"]]);
    blurred(g, W, H, k, 22, c => {
      c.globalCompositeOperation = "lighter";
      [[0.0, 0.7, "rgba(120,200,255,.5)", 80], [0.1, 0.55, "rgba(255,255,255,.35)", 26], [0.2, 0.85, "rgba(80,160,255,.45)", 60]].forEach(([y0, y1, col, wdt]) => {
        c.strokeStyle = col; c.lineWidth = wdt * k; c.beginPath(); c.moveTo(-W * 0.1, H * y1); c.bezierCurveTo(W * 0.3, H * (y0 + 0.2), W * 0.6, H * (y1 + 0.1), W * 1.1, H * y0); c.stroke();
      });
    });
    g.save(); g.globalCompositeOperation = "lighter"; g.strokeStyle = "rgba(220,240,255,.7)"; g.lineWidth = 2 * k;
    g.beginPath(); g.moveTo(-W * 0.1, H * 0.6); g.bezierCurveTo(W * 0.3, H * 0.25, W * 0.6, H * 0.7, W * 1.1, H * 0.12); g.stroke(); g.restore();
  },
  redmoon(g, W, H, k) {
    sky(g, W, H, [[0, "#2a0a0a"], [0.45, "#8a2a14"], [0.62, "#e0703a"]]);
    const mx = W * 0.3, my = H * 0.22, mr = Math.min(W, H) * 0.06;
    g.fillStyle = "rgba(255,230,200,.95)"; g.beginPath(); g.arc(mx, my, mr, 0, TAU); g.fill();
    const glow = g.createRadialGradient(mx, my, mr, mx, my, mr * 4); glow.addColorStop(0, "rgba(255,200,160,.3)"); glow.addColorStop(1, "rgba(255,200,160,0)"); g.fillStyle = glow; g.fillRect(0, 0, W, H);
    [[0.6, "#c0502a", "#7a2410", 0.03, 3], [0.7, "#a03a1c", "#5a1808", 0.05, 2.1], [0.82, "#7a2812", "#3a0e04", 0.06, 1.4]].forEach(([b, c1, c2, amp, f], i) => {
      const gr = g.createLinearGradient(0, H * (b - amp), 0, H); gr.addColorStop(0, c1); gr.addColorStop(1, c2); g.fillStyle = gr;
      g.beginPath(); g.moveTo(0, H); for (let x = 0; x <= W; x += 4 * k) g.lineTo(x, H * (b - amp * Math.sin(x / W * Math.PI * f + i * 1.7) - amp * 0.4 * Math.sin(x / W * 11 + i))); g.lineTo(W, H); g.fill();
    });
  },
  vortec(g, W, H, k) {
    g.fillStyle = "#000"; g.fillRect(0, 0, W, H);
    const r = rng(2001), cx = W * 0.5, cy = H * 0.5, R = Math.max(W, H) * 0.6;
    const core = g.createRadialGradient(cx, cy, 0, cx, cy, R * 0.35); core.addColorStop(0, "rgba(220,230,255,.9)"); core.addColorStop(0.3, "rgba(90,120,255,.35)"); core.addColorStop(1, "rgba(40,0,120,0)"); g.fillStyle = core; g.fillRect(0, 0, W, H);
    g.save(); g.globalCompositeOperation = "lighter";
    for (let i = 0, n = (W * H) / (40 * k * k); i < n; i++) {
      const arm = r() * 3 | 0, d = Math.pow(r(), 0.6), a = arm * TAU / 3 + d * 5.5 + (r() - 0.5) * 0.6 * (1 - d * 0.5);
      const x = cx + Math.cos(a) * d * R, y = cy + Math.sin(a) * d * R * 0.62;
      g.fillStyle = `hsla(${210 + r() * 70},90%,${55 + r() * 35}%,${0.15 + (1 - d) * 0.5})`; g.fillRect(x, y, k * (r() > 0.98 ? 2 : 1), k * (r() > 0.98 ? 2 : 1));
    }
    g.restore();
  }
};

// ---------------------------------------------------------------- tiles
const TILES = {
  // ---- Windows 3.1-ish
  argyle(g, s) {
    g.fillStyle = "#6a1428"; g.fillRect(0, 0, s, s);
    g.fillStyle = "#1a2a5a"; g.beginPath(); g.moveTo(s / 2, 0); g.lineTo(s, s / 2); g.lineTo(s / 2, s); g.lineTo(0, s / 2); g.fill();
    g.strokeStyle = "#d8c890"; g.lineWidth = 1; g.setLineDash([3, 2]); g.beginPath(); g.moveTo(0, 0); g.lineTo(s, s); g.moveTo(s, 0); g.lineTo(0, s); g.stroke(); g.setLineDash([]);
  },
  honey(g, s) {
    g.fillStyle = "#7a4a08"; g.fillRect(0, 0, s, s);
    const R = s / 3 / Math.sqrt(3) * 1.0, w = s / 3, hh = s / 3; // 3×3 hexes per tile, offset rows
    for (let row = -1; row <= 3; row++) for (let col = -1; col <= 3; col++) {
      const cx = col * w + (row % 2 ? w / 2 : 0), cy = row * hh;
      const gr = g.createRadialGradient(cx - R * 0.3, cy - R * 0.3, 1, cx, cy, R); gr.addColorStop(0, "#ffe27a"); gr.addColorStop(1, "#d89a18");
      g.fillStyle = gr; g.beginPath(); for (let i = 0; i < 6; i++) { const a = Math.PI / 6 + i * Math.PI / 3; g.lineTo(cx + Math.cos(a) * w * 0.55, cy + Math.sin(a) * hh * 0.62); } g.closePath(); g.fill();
      g.strokeStyle = "#5a3404"; g.lineWidth = 1.5; g.stroke();
    }
  },
  redbrick(g, s) {
    g.fillStyle = "#b8b0a0"; g.fillRect(0, 0, s, s);
    const r = rng(9), bh = s / 4, bw = s / 2;
    for (let row = 0; row < 4; row++) for (let i = -1; i < 3; i++) {
      const x = i * bw + (row % 2 ? bw / 2 : 0) + 1, y = row * bh + 1, c = 120 + r() * 50 | 0;
      g.fillStyle = `rgb(${c + 30},${c * 0.35 | 0},${c * 0.25 | 0})`; g.fillRect(x, y, bw - 2, bh - 2);
      g.fillStyle = "rgba(255,255,255,.12)"; g.fillRect(x, y, bw - 2, 2); g.fillStyle = "rgba(0,0,0,.18)"; g.fillRect(x, y + bh - 4, bw - 2, 2);
    }
  },
  tartan(g, s) {
    g.fillStyle = "#1a4a2a"; g.fillRect(0, 0, s, s);
    const bands = [[0, 0.28, "rgba(20,30,90,.75)"], [0.4, 0.06, "rgba(200,30,30,.8)"], [0.55, 0.22, "rgba(20,30,90,.6)"], [0.86, 0.03, "rgba(240,220,90,.8)"]];
    bands.forEach(([p, w, c]) => { g.fillStyle = c; g.fillRect(p * s, 0, w * s, s); g.fillRect(0, p * s, s, w * s); });
    g.fillStyle = "rgba(0,0,0,.12)"; for (let i = 0; i < s; i += 2) g.fillRect(i, 0, 1, s);
  },
  zigzag(g, s) {
    const cols = ["#d84a1a", "#f0c020", "#1a8aa0", "#2a2a6a"];
    for (let b = 0; b < 4; b++) { g.fillStyle = cols[b]; g.beginPath(); const y = b * s / 4; g.moveTo(0, y); g.lineTo(s / 2, y + s / 8); g.lineTo(s, y); g.lineTo(s, y + s / 4 + 1); g.lineTo(s / 2, y + s / 4 + s / 8 + 1); g.lineTo(0, y + s / 4 + 1); g.fill(); }
    g.fillStyle = cols[3]; g.beginPath(); g.moveTo(0, 0); g.lineTo(s / 2, s / 8); g.lineTo(s, 0); g.fill();
  },
  marble(g, s) {
    const n = noise2(8, 31), A = [236, 232, 226], B = [120, 116, 130];
    pixels(g, s, (x, y) => { const v = Math.sin((x / s + y / s) * TAU * 2 + fbm(n, x / s * 8, y / s * 8) * 7); const t = Math.pow(Math.abs(v), 0.35); return mix(B, A, t); });
  },
  castle(g, s) {
    const n = noise2(16, 5); pixels(g, s, (x, y) => { const v = 110 + fbm(n, x / s * 16, y / s * 16) * 60; return [v, v, v + 6]; });
    const r = rng(4); g.strokeStyle = "#3a3a40"; g.lineWidth = 2;
    for (let row = 0; row < 3; row++) { const y = row * s / 3; g.beginPath(); g.moveTo(0, y); g.lineTo(s, y); g.stroke(); const off = row % 2 ? s / 4 : 0; for (let i = 0; i < 2; i++) { const x = off + i * s / 2; g.beginPath(); g.moveTo(x, y); g.lineTo(x, y + s / 3); g.stroke(); } }
    g.strokeStyle = "rgba(255,255,255,.18)"; g.lineWidth = 1; for (let row = 0; row < 3; row++) { g.beginPath(); g.moveTo(0, row * s / 3 + 2); g.lineTo(s, row * s / 3 + 2); g.stroke(); }
    void r;
  },
  // ---- Windows 95-ish
  blackthatch(g, s) {
    g.fillStyle = "#0c0c0c"; g.fillRect(0, 0, s, s);
    const q = s / 2;
    for (let cy = 0; cy < 2; cy++) for (let cx = 0; cx < 2; cx++) {
      const vert = (cx + cy) % 2 === 0;
      for (let i = 1; i < 8; i++) { const t = i / 8 * q; g.strokeStyle = i % 2 ? "#4a4a4a" : "#2a2a2a"; g.lineWidth = 2; g.beginPath(); if (vert) { g.moveTo(cx * q + t, cy * q + 1); g.lineTo(cx * q + t, cy * q + q - 1); } else { g.moveTo(cx * q + 1, cy * q + t); g.lineTo(cx * q + q - 1, cy * q + t); } g.stroke(); }
    }
  },
  bluerivets(g, s) {
    const gr = g.createLinearGradient(0, 0, s, s); gr.addColorStop(0, "#3a5a9a"); gr.addColorStop(1, "#203a6a"); g.fillStyle = gr; g.fillRect(0, 0, s, s);
    g.fillStyle = "rgba(255,255,255,.25)"; g.fillRect(0, 0, s, 1); g.fillRect(0, 0, 1, s); g.fillStyle = "rgba(0,0,0,.4)"; g.fillRect(0, s - 1, s, 1); g.fillRect(s - 1, 0, 1, s);
    [[6, 6], [s - 6, 6], [6, s - 6], [s - 6, s - 6]].forEach(([x, y]) => { const rg = g.createRadialGradient(x - 1, y - 1, 0.5, x, y, 4); rg.addColorStop(0, "#d8e4ff"); rg.addColorStop(0.5, "#7a90c0"); rg.addColorStop(1, "#18284a"); g.fillStyle = rg; g.beginPath(); g.arc(x, y, 3.5, 0, TAU); g.fill(); });
  },
  bubbles(g, s) {
    g.fillStyle = "#7ab8e8"; g.fillRect(0, 0, s, s);
    const r = rng(21);
    for (let i = 0; i < 18; i++) { const x = r() * s, y = r() * s, rad = 4 + r() * 14; wrap9(s, (dx, dy) => { const gr = g.createRadialGradient(x + dx - rad * 0.3, y + dy - rad * 0.3, 0.5, x + dx, y + dy, rad); gr.addColorStop(0, "rgba(255,255,255,.85)"); gr.addColorStop(0.5, "rgba(200,235,255,.25)"); gr.addColorStop(0.95, "rgba(40,90,170,.55)"); gr.addColorStop(1, "rgba(40,90,170,0)"); g.fillStyle = gr; g.beginPath(); g.arc(x + dx, y + dy, rad, 0, TAU); g.fill(); }); }
  },
  carvedstone(g, s) {
    const n = noise2(8, 77); pixels(g, s, (x, y) => { const v = 128 + fbm(n, x / s * 8, y / s * 8) * 50 - 25; return [v + 4, v, v - 6]; });
    const carve = (path, off, col) => { g.save(); g.translate(off, off); g.strokeStyle = col; g.lineWidth = 2; g.beginPath(); path(); g.stroke(); g.restore(); };
    const knot = () => { g.moveTo(s * 0.5, s * 0.1); g.lineTo(s * 0.9, s * 0.5); g.lineTo(s * 0.5, s * 0.9); g.lineTo(s * 0.1, s * 0.5); g.closePath(); g.moveTo(s * 0.5, s * 0.3); g.arc(s * 0.5, s * 0.5, s * 0.2, -Math.PI / 2, Math.PI * 1.5); };
    carve(knot, 1, "rgba(255,255,255,.35)"); carve(knot, -1, "rgba(0,0,0,.45)");
  },
  circles(g, s) {
    g.fillStyle = "#c0c0c0"; g.fillRect(0, 0, s, s);
    wrap9(s, (dx, dy) => { for (let i = 5; i > 0; i--) { g.strokeStyle = i % 2 ? "#008080" : "#004060"; g.lineWidth = 2; g.beginPath(); g.arc(s / 2 + dx, s / 2 + dy, i * s / 10, 0, TAU); g.stroke(); } });
  },
  houndstooth(g, s) {
    const bits = [0xF1, 0xF2, 0xF4, 0xF8, 0x1F, 0x2F, 0x4F, 0x8F]; // checks with diagonal "teeth"
    g.fillStyle = "#f2efe6"; g.fillRect(0, 0, s, s); g.fillStyle = "#1a1a1a"; const p = s / 8;
    bits.forEach((b, y) => { for (let x = 0; x < 8; x++) if (b & (0x80 >> x)) g.fillRect(x * p, y * p, p, p); });
  },
  pinstripe(g, s) { g.fillStyle = "#1a2a4a"; g.fillRect(0, 0, s, s); g.fillStyle = "#6a7aa0"; g.fillRect(s / 2, 0, 1, s); g.fillStyle = "rgba(255,255,255,.05)"; g.fillRect(0, 0, s / 4, s); },
  redblocks(g, s) {
    const b = s / 2;
    for (let y = 0; y < 2; y++) for (let x = 0; x < 2; x++) {
      const X = x * b, Y = y * b;
      g.fillStyle = (x + y) % 2 ? "#b01010" : "#d02020"; g.fillRect(X, Y, b, b);
      g.fillStyle = "#ff6a5a"; g.beginPath(); g.moveTo(X, Y); g.lineTo(X + b, Y); g.lineTo(X + b - 4, Y + 4); g.lineTo(X + 4, Y + 4); g.lineTo(X + 4, Y + b - 4); g.lineTo(X, Y + b); g.fill();
      g.fillStyle = "#5a0000"; g.beginPath(); g.moveTo(X + b, Y + b); g.lineTo(X + b, Y); g.lineTo(X + b - 4, Y + 4); g.lineTo(X + b - 4, Y + b - 4); g.lineTo(X + 4, Y + b - 4); g.lineTo(X, Y + b); g.fill();
    }
  },
  sandstone(g, s) {
    const n = noise2(16, 8), r = rng(3);
    pixels(g, s, (x, y) => { const v = fbm(n, x / s * 16, y / s * 16), sp = r() > 0.97 ? -40 : r() > 0.97 ? 30 : 0; return [200 + v * 40 + sp, 168 + v * 34 + sp, 120 + v * 28 + sp]; });
  },
  strawmat(g, s) {
    g.fillStyle = "#8a6a30"; g.fillRect(0, 0, s, s); const q = s / 4;
    for (let y = 0; y < 4; y++) for (let x = 0; x < 4; x++) {
      const vert = (x + y) % 2 === 0, gr = vert ? g.createLinearGradient(x * q, 0, x * q + q, 0) : g.createLinearGradient(0, y * q, 0, y * q + q);
      gr.addColorStop(0, "#a07a36"); gr.addColorStop(0.5, "#f0d48a"); gr.addColorStop(1, "#a07a36"); g.fillStyle = gr; g.fillRect(x * q + 1, y * q + 1, q - 2, q - 2);
    }
  },
  triangles(g, s) {
    const cols = ["#2a3a8a", "#4a6ad0", "#a03a6a", "#e07a3a"], q = s / 2;
    for (let y = 0; y < 2; y++) for (let x = 0; x < 2; x++) { g.fillStyle = cols[(x + y * 2) % 4]; g.fillRect(x * q, y * q, q, q); g.fillStyle = cols[(x + y * 2 + 1) % 4]; g.beginPath(); g.moveTo(x * q, y * q + q); g.lineTo(x * q + q / 2, y * q); g.lineTo(x * q + q, y * q + q); g.fill(); }
  },
  waves(g, s) {
    for (let b = 0; b < 6; b++) { g.fillStyle = ["#0a3a7a", "#1a5aa0", "#3a8ad0", "#7ab8e8", "#3a8ad0", "#1a5aa0"][b]; g.beginPath(); g.moveTo(0, s); for (let x = 0; x <= s; x++) g.lineTo(x, b * s / 6 + Math.sin(x / s * TAU) * s / 14); g.lineTo(s, s); g.fill(); }
  },
  tiles(g, s) {
    g.fillStyle = "#e8e4d8"; g.fillRect(0, 0, s, s); const q = s / 2;
    for (let y = 0; y < 2; y++) for (let x = 0; x < 2; x++) { const gr = g.createLinearGradient(x * q, y * q, x * q + q, y * q + q); gr.addColorStop(0, "#ffffff"); gr.addColorStop(1, (x + y) % 2 ? "#a8c8d8" : "#d8e8f0"); g.fillStyle = gr; g.fillRect(x * q + 1, y * q + 1, q - 2, q - 2); }
  },
  // ---- Windows 98 Plus!-ish
  sixties(g, s) {
    g.fillStyle = "#f08a1a"; g.fillRect(0, 0, s, s);
    const flower = (x, y, rad, pc, cc) => { for (let i = 0; i < 5; i++) { const a = i * TAU / 5; g.fillStyle = pc; g.beginPath(); g.ellipse(x + Math.cos(a) * rad * 0.55, y + Math.sin(a) * rad * 0.55, rad * 0.5, rad * 0.32, a, 0, TAU); g.fill(); } g.fillStyle = cc; g.beginPath(); g.arc(x, y, rad * 0.28, 0, TAU); g.fill(); };
    wrap9(s, (dx, dy) => { flower(s * 0.25 + dx, s * 0.25 + dy, s * 0.24, "#e83a8a", "#ffe23a"); flower(s * 0.75 + dx, s * 0.7 + dy, s * 0.2, "#ffe23a", "#3aa04a"); flower(s * 0.8 + dx, s * 0.15 + dy, s * 0.1, "#3aa04a", "#ffffff"); flower(s * 0.2 + dx, s * 0.8 + dy, s * 0.12, "#ffffff", "#e83a8a"); });
  }
};

// ---------------------------------------------------------------- the catalogue
export const WALLPAPERS = [
  { id: "none", name: "(None)", era: "All", kind: "solid", color: "#008080" },
  { id: "argyle", name: "Argyle", era: "Windows 3.1", kind: "tile", size: 48 },
  { id: "castle", name: "Castle", era: "Windows 3.1", kind: "tile", size: 96 },
  { id: "honey", name: "Honey", era: "Windows 3.1", kind: "tile", size: 72 },
  { id: "marble", name: "Marble", era: "Windows 3.1", kind: "tile", size: 128 },
  { id: "redbrick", name: "Red Brick", era: "Windows 3.1", kind: "tile", size: 64 },
  { id: "tartan", name: "Tartan", era: "Windows 3.1", kind: "tile", size: 64 },
  { id: "zigzag", name: "Zig Zag", era: "Windows 3.1", kind: "tile", size: 32 },
  { id: "setup", name: "Setup", era: "Windows 95", kind: "scene" },
  { id: "clouds", name: "Clouds", era: "Windows 95", kind: "scene" },
  { id: "blackthatch", name: "Black Thatch", era: "Windows 95", kind: "tile", size: 32 },
  { id: "bluerivets", name: "Blue Rivets", era: "Windows 95", kind: "tile", size: 48 },
  { id: "bubbles", name: "Bubbles", era: "Windows 95", kind: "tile", size: 96 },
  { id: "carvedstone", name: "Carved Stone", era: "Windows 95", kind: "tile", size: 64 },
  { id: "circles", name: "Circles", era: "Windows 95", kind: "tile", size: 40 },
  { id: "houndstooth", name: "Houndstooth", era: "Windows 95", kind: "tile", size: 16 },
  { id: "pinstripe", name: "Pinstripe", era: "Windows 95", kind: "tile", size: 8 },
  { id: "redblocks", name: "Red Blocks", era: "Windows 95", kind: "tile", size: 48 },
  { id: "sandstone", name: "Sandstone", era: "Windows 95", kind: "tile", size: 96 },
  { id: "strawmat", name: "Straw Mat", era: "Windows 95", kind: "tile", size: 48 },
  { id: "tiles", name: "Tiles", era: "Windows 95", kind: "tile", size: 40 },
  { id: "triangles", name: "Triangles", era: "Windows 95", kind: "tile", size: 48 },
  { id: "waves", name: "Waves", era: "Windows 95", kind: "tile", size: 64 },
  { id: "circuit", name: "Inside Your Computer", era: "Windows 98", kind: "scene" },
  { id: "mystery", name: "Mystery", era: "Windows 98", kind: "scene" },
  { id: "sixties", name: "The 60s", era: "Windows 98", kind: "tile", size: 120 },
  { id: "space", name: "Space", era: "Windows 98", kind: "scene" },
  { id: "underwater", name: "Underwater", era: "Windows 98", kind: "scene" },
  { id: "win2k", name: "Slate Blue", era: "Windows 2000", kind: "solid", color: "#3a6ea5" },
  { id: "prairie", name: "Prairie Wind", era: "Windows 2000", kind: "scene" },
  { id: "redmaple", name: "Red Maple", era: "Windows 2000", kind: "scene" },
  { id: "snowtrees", name: "Snow Trees", era: "Windows 2000", kind: "scene" },
  { id: "hills", name: "Green Hills", era: "Windows XP", kind: "scene" },
  { id: "azul", name: "Azul", era: "Windows XP", kind: "scene" },
  { id: "redmoon", name: "Red Moon Desert", era: "Windows XP", kind: "scene" },
  { id: "vortec", name: "Vortec Space", era: "Windows XP", kind: "scene" }
];
export const ERAS = ["Windows 3.1", "Windows 95", "Windows 98", "Windows 2000", "Windows XP"];

// 8×8 one-bit desktop patterns, drawn in black over the desktop colour (original bitmaps)
export const PATTERNS = {
  "(None)": null,
  "50% Gray": [0xAA, 0x55, 0xAA, 0x55, 0xAA, 0x55, 0xAA, 0x55],
  "Boxes": [0x7F, 0x41, 0x41, 0x41, 0x41, 0x41, 0x7F, 0x00],
  "Bricks": [0xFF, 0x80, 0x80, 0x80, 0xFF, 0x08, 0x08, 0x08],
  "Critters": [0x00, 0x50, 0x72, 0x20, 0x00, 0x05, 0x27, 0x02],
  "Diamonds": [0x10, 0x28, 0x44, 0x82, 0x44, 0x28, 0x10, 0x00],
  "Paisley": [0x02, 0x07, 0x07, 0x02, 0x20, 0x50, 0x50, 0x20],
  "Quilt": [0x82, 0x44, 0x39, 0x44, 0x82, 0x01, 0x01, 0x01],
  "Scottie": [0x40, 0xC0, 0xC8, 0x78, 0x78, 0x48, 0x00, 0x00],
  "Spinner": [0x14, 0x0C, 0xC8, 0x79, 0x9E, 0x13, 0x30, 0x28],
  "Thatches": [0xF8, 0x74, 0x22, 0x47, 0x8F, 0x17, 0x22, 0x71],
  "Tulip": [0x00, 0x00, 0x54, 0x7C, 0x7C, 0x38, 0x92, 0x7C],
  "Waffle": [0x00, 0x00, 0x00, 0x00, 0x80, 0x80, 0x80, 0xF0],
  "Weave": [0x88, 0x54, 0x22, 0x45, 0x88, 0x15, 0x22, 0x51]
};

const byId = id => WALLPAPERS.find(w => w.id === id) || WALLPAPERS[0];

// paint wallpaper `id` (+ optional pattern, used when there's no wallpaper) onto a canvas of W×H device px.
// `k` is device px per CSS px: the real screen uses devicePixelRatio, the preview monitor uses its shrink factor.
export function paint(canvas, id, pattern, W, H, k) {
  canvas.width = W; canvas.height = H;
  const g = canvas.getContext("2d"), wp = byId(id);
  if (wp.kind === "solid") {
    g.fillStyle = wp.color; g.fillRect(0, 0, W, H);
    const bits = PATTERNS[pattern];
    if (bits) {
      const px = Math.max(1, Math.round(k)), t = document.createElement("canvas"); t.width = t.height = 8 * px;
      const tg = t.getContext("2d"); tg.fillStyle = "#000";
      bits.forEach((b, y) => { for (let x = 0; x < 8; x++) if (b & (0x80 >> x)) tg.fillRect(x * px, y * px, px, px); });
      g.fillStyle = g.createPattern(t, "repeat"); g.fillRect(0, 0, W, H);
    }
  } else if (wp.kind === "tile") {
    const sz = Math.max(2, Math.round(wp.size * k)), t = document.createElement("canvas"); t.width = t.height = sz;
    const tg = t.getContext("2d"); tg.scale(sz / wp.size, sz / wp.size); TILES[wp.id](tg, wp.size);
    g.fillStyle = g.createPattern(t, "repeat"); g.fillRect(0, 0, W, H);
  } else {
    SCENES[wp.id](g, W, H, k);
  }
  return wp;
}
export const isDark = id => !["none", "win2k"].includes(byId(id).id);

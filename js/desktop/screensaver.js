// Screen savers and colour schemes for dom 95. Everything is drawn procedurally.

// ------------------------------------------------------------------ colour schemes
// Colours approximate the classic Windows 95 "Appearance" schemes (just colour values, no artwork).
const S = (face, shadow, light, title, sel, desk, extra = {}) => ({ face, shadow, light, title, sel, desk, ...extra });
export const SCHEMES = {
  "Windows Standard": S("#c0c0c0", "#808080", "#dfdfdf", "linear-gradient(90deg, #000080, #1084d0)", "#000080", "#008080"),
  "Windows Classic (solid)": S("#c0c0c0", "#808080", "#dfdfdf", "#000080", "#000080", "#008080"),
  "Brick": S("#c2bfa5", "#8d896a", "#e1dfd2", "#800000", "#800000", "#400000"),
  "Desert": S("#d5ccbb", "#a28d68", "#ebe5da", "#008080", "#008080", "#a28d68"),
  "Eggplant": S("#90b0a8", "#588078", "#c8d8d4", "#584078", "#584078", "#400040"),
  "Lilac": S("#aea8d9", "#5a4e9b", "#d7d3ec", "#5a4e9b", "#5a4e9b", "#51468f"),
  "Maple": S("#e6c8a0", "#a87c48", "#f2e3cf", "#800000", "#800000", "#c08040"),
  "Marine": S("#88c0b8", "#448078", "#c4e0dc", "#000080", "#000080", "#004040"),
  "Plum": S("#a89890", "#504040", "#d4ccc8", "#402040", "#402040", "#402040"),
  "Pumpkin": S("#e8c890", "#a07830", "#f4e4c8", "#c06000", "#c06000", "#000000"),
  "Rainy Day": S("#8399b1", "#4f6582", "#b6c3d1", "#4f6582", "#4f6582", "#000000"),
  "Red, White, and Blue": S("#c0c0c0", "#808080", "#ffffff", "#000080", "#800000", "#000080"),
  "Rose": S("#cfafb7", "#9f6070", "#e7d7db", "#9f6070", "#9f6070", "#806070"),
  "Slate": S("#9eb4c2", "#5c7a8a", "#ced9e0", "#3a5a6a", "#3a5a6a", "#3a5a6a"),
  "Spruce": S("#a2c8a9", "#5f8f68", "#d0e4d4", "#004000", "#5f8f68", "#5f8f68"),
  "Storm": S("#c0c0c0", "#808080", "#dfdfdf", "#800080", "#800080", "#000000"),
  "Teal": S("#c0c0c0", "#808080", "#dfdfdf", "#008080", "#008080", "#004040"),
  "Wheat": S("#d7d29c", "#a09c5c", "#ebe8ce", "#808000", "#808000", "#c0c080"),
  "Hot Dog Stand": S("#ffff00", "#808000", "#ffff80", "#ff0000", "#ff0000", "#ff0000")
};
export const curScheme = () => { const v = localStorage.getItem("w95.scheme"); return v && SCHEMES[v] ? v : "Windows Standard"; };
export function applyScheme(name = curScheme(), root = document.documentElement) {
  const s = SCHEMES[name] || SCHEMES["Windows Standard"], st = root.style;
  st.setProperty("--face", s.face); st.setProperty("--shadow", s.shadow); st.setProperty("--light", s.light);
  st.setProperty("--title", s.title); st.setProperty("--sel", s.sel); st.setProperty("--desk", s.desk);
}

// ------------------------------------------------------------------ screen savers
export const SAVERS = [
  { id: "none", name: "(None)" },
  { id: "blank", name: "Blank Screen" },
  { id: "space", name: "Flying Through Space" },
  { id: "houses", name: "Flying Houses" },
  { id: "mystify", name: "Mystify Your Mind" },
  { id: "pipes", name: "Pipes" },
  { id: "curves", name: "Curves and Colors" },
  { id: "marquee", name: "Scrolling Marquee" }
];
export const curSaver = () => { const v = localStorage.getItem("w95.saver"); return SAVERS.some(s => s.id === v) ? v : "houses"; };
export const curWait = () => Math.max(1, Math.min(60, +localStorage.getItem("w95.saverWait") || 5));

// run(canvas, id) starts an animation on a canvas, returns stop()
export function runSaver(cv, id) {
  const g = cv.getContext("2d");
  let W = cv.width, H = cv.height, raf = 0, alive = true, t0 = performance.now();
  const sizeK = W / 800;
  const clear = (a = 1) => { g.fillStyle = `rgba(0,0,0,${a})`; g.fillRect(0, 0, W, H); };
  clear();
  const rnd = (a, b) => a + Math.random() * (b - a);
  let step = () => {};

  if (id === "space") {
    const N = 260, st = Array.from({ length: N }, () => ({ x: rnd(-1, 1), y: rnd(-1, 1), z: rnd(0.05, 1) }));
    step = () => {
      clear(1);
      for (const s of st) {
        s.z -= 0.006; if (s.z <= 0.02) { s.x = rnd(-1, 1); s.y = rnd(-1, 1); s.z = 1; }
        const px = W / 2 + (s.x / s.z) * W / 2, py = H / 2 + (s.y / s.z) * H / 2;
        if (px < 0 || px > W || py < 0 || py > H) { s.z = 1; s.x = rnd(-1, 1); s.y = rnd(-1, 1); continue; }
        const r = Math.max(0.6, (1 - s.z) * 2.6 * sizeK + 0.4), c = Math.floor(120 + (1 - s.z) * 135);
        g.fillStyle = `rgb(${c},${c},${c})`; g.fillRect(px, py, r, r);
      }
    };
  } else if (id === "houses") {
    // like the old flying-logos saver, but with little Navigator houses
    const COLORS = [["#e8402a", "#2a6ad8"], ["#f2c400", "#3aa43a"], ["#2a6ad8", "#e8402a"], ["#3aa43a", "#f2c400"]];
    const hs = Array.from({ length: 60 }, () => ({ x: rnd(-1, 1), y: rnd(-1, 1), z: rnd(0.1, 1), c: COLORS[Math.floor(Math.random() * 4)], f: Math.random() * 6 }));
    const house = (x, y, s, c, flap) => {
      const w = s * (0.85 + 0.15 * Math.sin(flap));
      g.fillStyle = c[0]; g.beginPath(); g.moveTo(x - w * 0.6, y); g.lineTo(x, y - s * 0.55); g.lineTo(x + w * 0.6, y); g.closePath(); g.fill();
      g.fillStyle = c[1]; g.fillRect(x - w * 0.45, y, w * 0.9, s * 0.6);
      g.fillStyle = "#ffe680"; g.fillRect(x - w * 0.3, y + s * 0.12, w * 0.2, s * 0.18); g.fillRect(x + w * 0.1, y + s * 0.12, w * 0.2, s * 0.18);
    };
    step = () => {
      clear(1);
      hs.sort((a, b) => b.z - a.z);
      for (const o of hs) {
        o.z -= 0.0045; o.f += 0.2;
        if (o.z <= 0.03) { o.x = rnd(-1, 1); o.y = rnd(-1, 1); o.z = 1; }
        const px = W / 2 + (o.x / o.z) * W / 3, py = H / 2 + (o.y / o.z) * H / 3, s = (34 * sizeK + 4) / o.z * 0.35;
        if (px < -s || px > W + s || py < -s || py > H + s) { o.z = 1; continue; }
        house(px, py, s, o.c, o.f);
      }
    };
  } else if (id === "mystify") {
    const mk = (hue) => ({ hue, pts: Array.from({ length: 4 }, () => ({ x: rnd(0, W), y: rnd(0, H), vx: rnd(-3, 3) * sizeK + 0.5, vy: rnd(-3, 3) * sizeK + 0.5 })), trail: [] });
    const shapes = [mk(rnd(0, 360)), mk(rnd(0, 360))];
    step = () => {
      clear(1);
      for (const s of shapes) {
        s.hue = (s.hue + 0.4) % 360;
        for (const p of s.pts) { p.x += p.vx; p.y += p.vy; if (p.x < 0 || p.x > W) p.vx *= -1; if (p.y < 0 || p.y > H) p.vy *= -1; }
        s.trail.push(s.pts.map(p => [p.x, p.y])); if (s.trail.length > 8) s.trail.shift();
        s.trail.forEach((tr, i) => {
          g.strokeStyle = `hsla(${s.hue},100%,60%,${(i + 1) / s.trail.length})`; g.lineWidth = Math.max(1, sizeK);
          g.beginPath(); tr.forEach(([x, y], k) => (k ? g.lineTo(x, y) : g.moveTo(x, y))); g.closePath(); g.stroke();
        });
      }
    };
  } else if (id === "pipes") {
    // isometric pipes growing on a 3D grid, with ball joints
    const N = 14, cell = Math.min(W, H) / (N * 1.9), seen = new Set();
    const proj = (x, y, z) => [W / 2 + (x - z) * cell * 0.87, H / 2 + (x + z) * cell * 0.5 - y * cell];
    const DIRS = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]];
    let pipe = null, count = 0, frames = 0;
    const newPipe = () => {
      const p = [Math.floor(rnd(-N / 2, N / 2)), Math.floor(rnd(-N / 2, N / 2)), Math.floor(rnd(-N / 2, N / 2))];
      pipe = { p, d: DIRS[Math.floor(Math.random() * 6)], hue: Math.floor(rnd(0, 360)), len: 0 };
      seen.add(p.join());
    };
    const seg = (a, b, hue) => {
      const [x1, y1] = proj(...a), [x2, y2] = proj(...b), wd = cell * 0.38;
      g.lineCap = "round";
      g.strokeStyle = `hsl(${hue},70%,22%)`; g.lineWidth = wd + 2; g.beginPath(); g.moveTo(x1, y1); g.lineTo(x2, y2); g.stroke();
      g.strokeStyle = `hsl(${hue},75%,45%)`; g.lineWidth = wd; g.beginPath(); g.moveTo(x1, y1); g.lineTo(x2, y2); g.stroke();
      g.strokeStyle = `hsl(${hue},90%,75%)`; g.lineWidth = wd * 0.3; g.beginPath(); g.moveTo(x1 - wd * 0.2, y1 - wd * 0.2); g.lineTo(x2 - wd * 0.2, y2 - wd * 0.2); g.stroke();
    };
    const ball = (p, hue) => { const [x, y] = proj(...p), r = cell * 0.3; const gr = g.createRadialGradient(x - r / 3, y - r / 3, 1, x, y, r); gr.addColorStop(0, `hsl(${hue},90%,80%)`); gr.addColorStop(1, `hsl(${hue},70%,30%)`); g.fillStyle = gr; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); };
    newPipe();
    step = () => {
      frames++;
      if (count > 1100) { clear(1); seen.clear(); count = 0; newPipe(); }
      const turn = pipe.len > 1 && Math.random() < 0.3;
      let d = pipe.d;
      const opts = DIRS.filter(dd => { const q = pipe.p.map((v, i) => v + dd[i]); return !seen.has(q.join()) && q.every(v => Math.abs(v) <= N / 2); });
      if (!opts.length) { ball(pipe.p, pipe.hue); newPipe(); return; }
      const fwdOk = opts.some(o => o === d);
      if (turn || !fwdOk) { d = opts[Math.floor(Math.random() * opts.length)]; if (d !== pipe.d) { ball(pipe.p, pipe.hue); pipe.len = 0; } }
      const q = pipe.p.map((v, i) => v + d[i]);
      seg(pipe.p, q, pipe.hue); seen.add(q.join()); pipe.p = q; pipe.d = d; pipe.len++; count++;
      if (Math.random() < 0.01) { ball(pipe.p, pipe.hue); newPipe(); }
    };
  } else if (id === "curves") {
    let a = 0, hue = rnd(0, 360);
    step = () => {
      g.fillStyle = "rgba(0,0,0,0.04)"; g.fillRect(0, 0, W, H);
      a += 0.012; hue = (hue + 0.3) % 360;
      g.strokeStyle = `hsl(${hue},100%,60%)`; g.lineWidth = Math.max(1, sizeK * 1.5); g.beginPath();
      for (let k = 0; k <= 200; k++) {
        const t = k / 200 * Math.PI * 2;
        const x = W / 2 + Math.sin(3 * t + a) * W * 0.4, y = H / 2 + Math.sin(4 * t + a * 1.3) * H * 0.4;
        k ? g.lineTo(x, y) : g.moveTo(x, y);
      }
      g.stroke();
    };
  } else if (id === "marquee") {
    const msg = "dom 95  ·  Thanks for visiting  ·  Move the mouse to come back  ·  ";
    let x = W, y = H / 2, vy = 0.4 * sizeK, hue = 50;
    const fs = Math.max(12, 48 * sizeK);
    step = () => {
      clear(1); g.font = `bold ${fs}px "Times New Roman", serif`; g.textBaseline = "middle";
      const tw = g.measureText(msg).width;
      x -= 2.4 * sizeK + 0.6; if (x < -tw) { x = W; y = rnd(fs, H - fs); hue = rnd(0, 360); }
      y += vy; if (y < fs || y > H - fs) vy *= -1;
      g.fillStyle = `hsl(${hue},100%,60%)`; g.fillText(msg, x, y);
    };
  }
  const loop = () => { if (!alive) return; step(); raf = requestAnimationFrame(loop); };
  if (id !== "blank" && id !== "none") loop();
  return () => { alive = false; cancelAnimationFrame(raf); };
}

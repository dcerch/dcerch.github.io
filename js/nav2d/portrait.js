// Family portrait painter (2D canvas), lifted from the 3D Navigator so the 2D rooms can hang it on the wall.
function canvas(w, h) { const c = document.createElement("canvas"); c.width = w; c.height = h; return c; }
function rand(seed) { let s = seed >>> 0 || 1; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }
export function roundRect(g, x, y, w, h, r) {
  g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r);
  g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath();
}

// ---- Book spines -----------------------------------------------------
// ---- Family portrait: a 1990s department-store studio photo ----------
//  Laser background, back row standing, parents seated in front, cats on laps.
const shade = (hex, k) => {
  const n = parseInt(hex.slice(1), 16), f = v => Math.max(0, Math.min(255, Math.round(v * k)));
  return `rgb(${f(n >> 16)},${f((n >> 8) & 255)},${f(n & 255)})`;
};

// Cartoon style: flat colours, chunky dark outlines, big round heads, bean eyes.
const INK = "#2b1a12";
function ink(g, path, fill, w) {
  g.fillStyle = fill; path(); g.fill();
  g.strokeStyle = INK; g.lineWidth = w; g.lineJoin = "round"; g.lineCap = "round"; path(); g.stroke();
}
function drawPerson(g, p, cx, headY, r, bottom) {
  const lw = Math.max(3, 0.075 * r);
  const y0 = headY + 0.95 * r;                                   // shoulder line (short neck, big head)
  const sw = (p.kid ? 1.15 : p.row === "front" ? 1.45 : 1.3) * r;  // half shoulder width
  const hairCol = p.hair;

  // long / volume hair sits behind everything
  if (p.hairStyle === "long" || p.hairStyle === "volume") {
    const w = p.hairStyle === "volume" ? 1.25 : 1.08, len = p.hairStyle === "volume" ? 1.0 : 1.75;
    ink(g, () => {
      g.beginPath(); g.moveTo(cx - w * r, headY - 0.1 * r);
      g.bezierCurveTo(cx - w * r, headY - 1.45 * r, cx + w * r, headY - 1.45 * r, cx + w * r, headY - 0.1 * r);
      g.quadraticCurveTo(cx + (w + 0.1) * r, headY + len * r, cx + 0.75 * r, headY + len * r);
      g.lineTo(cx - 0.75 * r, headY + len * r);
      g.quadraticCurveTo(cx - (w + 0.1) * r, headY + len * r, cx - w * r, headY - 0.1 * r); g.closePath();
    }, hairCol, lw);
  }

  // body: a soft rounded block
  const torso = () => {
    g.beginPath();
    g.moveTo(cx - 0.5 * r, y0 - 0.05 * r);
    g.quadraticCurveTo(cx - sw, y0 - 0.02 * r, cx - sw, y0 + 0.6 * r);
    g.lineTo(cx - sw - 0.08 * r, bottom + 20);
    g.lineTo(cx + sw + 0.08 * r, bottom + 20);
    g.lineTo(cx + sw, y0 + 0.6 * r);
    g.quadraticCurveTo(cx + sw, y0 - 0.02 * r, cx + 0.5 * r, y0 - 0.05 * r);
    g.closePath();
  };
  ink(g, torso, p.shirt, lw);
  g.save(); torso(); g.clip();
  if (p.top === "stripes") {
    [0.75, 1.15].forEach((dy, i) => { g.fillStyle = i ? "#f2c14e" : "#f4efe2"; g.fillRect(cx - sw - r, y0 + dy * r, 2 * sw + 2 * r, 0.22 * r); });
  } else if (p.top === "flannel") {
    g.fillStyle = "rgba(60,20,5,0.28)";
    for (let x = -3; x <= 3; x++) g.fillRect(cx + x * 0.5 * r - 0.08 * r, y0, 0.16 * r, bottom - y0 + 30);
    for (let y = 0; y < 6; y++) g.fillRect(cx - sw - r, y0 + 0.35 * r + y * 0.5 * r, 2 * sw + 2 * r, 0.16 * r);
  } else if (p.top === "sweater") {
    g.fillStyle = "rgba(255,255,255,0.18)";
    for (let k = -3; k <= 3; k++) { g.beginPath(); g.moveTo(cx + k * 0.42 * r, y0 + 0.75 * r); g.lineTo(cx + k * 0.42 * r + 0.14 * r, y0 + 0.95 * r); g.lineTo(cx + k * 0.42 * r, y0 + 1.15 * r); g.lineTo(cx + k * 0.42 * r - 0.14 * r, y0 + 0.95 * r); g.fill(); }
  }
  // a simple arm line on each side
  g.strokeStyle = INK; g.lineWidth = lw * 0.7;
  [-1, 1].forEach(s => { g.beginPath(); g.moveTo(cx + s * (sw - 0.32 * r), y0 + 0.7 * r); g.quadraticCurveTo(cx + s * (sw - 0.38 * r), y0 + 1.4 * r, cx + s * (sw - 0.3 * r), bottom + 20); g.stroke(); });
  g.restore();

  // collars
  if (p.top === "turtleneck") {
    ink(g, () => { roundRectP(g, cx - 0.5 * r, y0 - 0.32 * r, r, 0.42 * r, 0.16 * r); }, shade(p.shirt, 1.12), lw);
  } else if (p.top === "polo" || p.top === "flannel" || p.top === "sweater") {
    const col = p.top === "flannel" ? shade(p.shirt, 1.2) : "#fbf8f0";
    [-1, 1].forEach(s => ink(g, () => { g.beginPath(); g.moveTo(cx, y0 + 0.22 * r); g.lineTo(cx + s * 0.55 * r, y0 - 0.12 * r); g.lineTo(cx + s * 0.38 * r, y0 + 0.36 * r); g.closePath(); }, col, lw * 0.8));
  }

  // ears + head (a big, slightly squashed circle)
  [-1, 1].forEach(s => ink(g, () => { g.beginPath(); g.ellipse(cx + s * 0.92 * r, headY + 0.05 * r, 0.18 * r, 0.24 * r, 0, 0, 7); }, p.skin, lw));
  ink(g, () => { g.beginPath(); g.ellipse(cx, headY - 0.05 * r, 0.95 * r, 0.98 * r, 0, 0, 7); }, p.skin, lw);

  // rosy cheeks
  g.fillStyle = "rgba(255,120,120,0.35)";
  [-1, 1].forEach(s => { g.beginPath(); g.arc(cx + s * 0.55 * r, headY + 0.3 * r, 0.16 * r, 0, 7); g.fill(); });
  // bean eyes with a sparkle
  [-1, 1].forEach(s => {
    g.fillStyle = INK; g.beginPath(); g.ellipse(cx + s * 0.34 * r, headY - 0.02 * r, 0.11 * r, 0.16 * r, 0, 0, 7); g.fill();
    g.fillStyle = "#fff"; g.beginPath(); g.arc(cx + s * 0.34 * r + 0.035 * r, headY - 0.08 * r, 0.04 * r, 0, 7); g.fill();
  });
  // eyebrows: little arcs
  g.strokeStyle = shade(p.hair, 0.6); g.lineWidth = lw * 0.8;
  [-1, 1].forEach(s => { g.beginPath(); g.arc(cx + s * 0.34 * r, headY - 0.18 * r, 0.16 * r, Math.PI * 1.2, Math.PI * 1.8); g.stroke(); });
  // tiny nose and a big open grin
  g.strokeStyle = INK; g.lineWidth = lw * 0.7;
  g.beginPath(); g.arc(cx, headY + 0.18 * r, 0.07 * r, 0.2 * Math.PI, 0.8 * Math.PI); g.stroke();
  ink(g, () => { g.beginPath(); g.moveTo(cx - 0.3 * r, headY + 0.4 * r); g.quadraticCurveTo(cx, headY + 0.42 * r, cx + 0.3 * r, headY + 0.4 * r); g.quadraticCurveTo(cx + 0.24 * r, headY + 0.78 * r, cx, headY + 0.78 * r); g.quadraticCurveTo(cx - 0.24 * r, headY + 0.78 * r, cx - 0.3 * r, headY + 0.4 * r); g.closePath(); }, "#8a2b2b", lw * 0.8);
  g.fillStyle = "#ff8a8a"; g.beginPath(); g.ellipse(cx, headY + 0.68 * r, 0.13 * r, 0.07 * r, 0, 0, 7); g.fill();
  g.fillStyle = "#fff"; g.fillRect(cx - 0.2 * r, headY + 0.43 * r, 0.4 * r, 0.09 * r);

  if (p.glasses) {
    g.strokeStyle = INK; g.lineWidth = lw * 0.9;
    [-1, 1].forEach(s => { g.beginPath(); g.arc(cx + s * 0.36 * r, headY - 0.02 * r, 0.25 * r, 0, 7); g.stroke(); });
    g.beginPath(); g.moveTo(cx - 0.11 * r, headY - 0.06 * r); g.quadraticCurveTo(cx, headY - 0.14 * r, cx + 0.11 * r, headY - 0.06 * r); g.stroke();
  }

  // hair on top
  const top = () => {
    switch (p.hairStyle) {
      case "bowl":
        g.beginPath(); g.moveTo(cx - 1.0 * r, headY - 0.1 * r);
        g.bezierCurveTo(cx - 1.05 * r, headY - 1.4 * r, cx + 1.05 * r, headY - 1.4 * r, cx + 1.0 * r, headY - 0.1 * r);
        g.lineTo(cx + 0.8 * r, headY - 0.38 * r); g.lineTo(cx - 0.8 * r, headY - 0.38 * r); g.closePath(); break;
      case "curtains":
        g.beginPath(); g.moveTo(cx - 0.98 * r, headY - 0.05 * r);
        g.bezierCurveTo(cx - 1.05 * r, headY - 1.42 * r, cx + 1.05 * r, headY - 1.42 * r, cx + 0.98 * r, headY - 0.05 * r);
        g.quadraticCurveTo(cx + 0.55 * r, headY - 0.35 * r, cx + 0.05 * r, headY - 0.75 * r);
        g.quadraticCurveTo(cx - 0.45 * r, headY - 0.35 * r, cx - 0.98 * r, headY - 0.05 * r); g.closePath(); break;
      case "gray":
        g.beginPath(); g.moveTo(cx - 0.98 * r, headY - 0.05 * r);
        g.bezierCurveTo(cx - 1.0 * r, headY - 0.75 * r, cx - 0.75 * r, headY - 0.85 * r, cx - 0.55 * r, headY - 0.8 * r);
        g.quadraticCurveTo(cx - 0.75 * r, headY - 0.45 * r, cx - 0.8 * r, headY - 0.05 * r); g.closePath();
        g.moveTo(cx + 0.98 * r, headY - 0.05 * r);
        g.bezierCurveTo(cx + 1.0 * r, headY - 0.75 * r, cx + 0.75 * r, headY - 0.85 * r, cx + 0.55 * r, headY - 0.8 * r);
        g.quadraticCurveTo(cx + 0.75 * r, headY - 0.45 * r, cx + 0.8 * r, headY - 0.05 * r); g.closePath();
        g.moveTo(cx - 0.5 * r, headY - 0.88 * r); g.quadraticCurveTo(cx, headY - 1.12 * r, cx + 0.5 * r, headY - 0.88 * r); g.quadraticCurveTo(cx, headY - 0.98 * r, cx - 0.5 * r, headY - 0.88 * r); g.closePath(); break;
      case "volume":
        g.beginPath(); g.moveTo(cx - 1.15 * r, headY + 0.1 * r);
        g.bezierCurveTo(cx - 1.5 * r, headY - 1.75 * r, cx + 1.5 * r, headY - 1.75 * r, cx + 1.15 * r, headY + 0.1 * r);
        g.quadraticCurveTo(cx + 0.9 * r, headY - 0.5 * r, cx + 0.2 * r, headY - 0.62 * r);
        g.quadraticCurveTo(cx - 0.6 * r, headY - 0.62 * r, cx - 1.15 * r, headY + 0.1 * r); g.closePath(); break;
      case "long":
        g.beginPath(); g.moveTo(cx - 1.02 * r, headY);
        g.bezierCurveTo(cx - 1.05 * r, headY - 1.42 * r, cx + 1.05 * r, headY - 1.42 * r, cx + 1.02 * r, headY);
        g.quadraticCurveTo(cx + 0.7 * r, headY - 0.5 * r, cx - 0.15 * r, headY - 0.6 * r);
        g.quadraticCurveTo(cx - 0.7 * r, headY - 0.45 * r, cx - 1.02 * r, headY); g.closePath(); break;
      default: // short with a side part and a little cowlick
        g.beginPath(); g.moveTo(cx - 0.98 * r, headY - 0.2 * r);
        g.bezierCurveTo(cx - 1.05 * r, headY - 1.4 * r, cx + 1.05 * r, headY - 1.4 * r, cx + 0.98 * r, headY - 0.2 * r);
        g.quadraticCurveTo(cx + 0.4 * r, headY - 0.55 * r, cx - 0.3 * r, headY - 0.7 * r);
        g.quadraticCurveTo(cx - 0.75 * r, headY - 0.55 * r, cx - 0.98 * r, headY - 0.2 * r); g.closePath();
        g.moveTo(cx + 0.1 * r, headY - 1.0 * r); g.quadraticCurveTo(cx + 0.25 * r, headY - 1.35 * r, cx + 0.45 * r, headY - 1.25 * r); g.quadraticCurveTo(cx + 0.3 * r, headY - 1.1 * r, cx + 0.3 * r, headY - 0.98 * r); g.closePath();
    }
  };
  ink(g, top, p.hairStyle === "gray" ? "#c8c6c2" : hairCol, lw);
  // one shiny highlight on the hair
  g.fillStyle = "rgba(255,255,255,0.28)"; g.beginPath(); g.ellipse(cx - 0.35 * r, headY - 0.98 * r, 0.25 * r, 0.08 * r, -0.35, 0, 7); g.fill();
}

function drawCat(g, cat, cx, by, s, { tabby = false } = {}) {
  const fur = cat.color, dark = cat.stripe, belly = cat.belly || shade(cat.color, 1.2);
  // tail
  g.strokeStyle = INK; g.lineWidth = 22 * s; g.lineCap = "round";
  g.beginPath(); g.moveTo(cx + 50 * s, by - 18 * s); g.bezierCurveTo(cx + 120 * s, by - 10 * s, cx + 112 * s, by - 90 * s, cx + 84 * s, by - 110 * s); g.stroke();
  g.strokeStyle = fur; g.lineWidth = 16 * s;
  g.beginPath(); g.moveTo(cx + 50 * s, by - 18 * s); g.bezierCurveTo(cx + 120 * s, by - 10 * s, cx + 112 * s, by - 90 * s, cx + 84 * s, by - 110 * s); g.stroke();
  // body (sitting, pear-shaped)
  const bg = g.createRadialGradient(cx - 20 * s, by - 90 * s, 10 * s, cx, by - 50 * s, 95 * s);
  bg.addColorStop(0, shade(fur, 1.08)); bg.addColorStop(1, shade(fur, 0.82));
  g.fillStyle = bg; g.beginPath();
  g.moveTo(cx - 34 * s, by - 120 * s);
  g.bezierCurveTo(cx - 70 * s, by - 80 * s, cx - 78 * s, by, cx - 30 * s, by);
  g.lineTo(cx + 30 * s, by);
  g.bezierCurveTo(cx + 78 * s, by, cx + 70 * s, by - 80 * s, cx + 34 * s, by - 120 * s);
  g.closePath(); g.fill(); g.strokeStyle = INK; g.lineWidth = 6 * s; g.lineJoin = "round"; g.stroke();
  g.fillStyle = belly; g.beginPath(); g.ellipse(cx, by - 52 * s, 26 * s, 44 * s, 0, 0, 7); g.fill();
  // front paws
  g.fillStyle = shade(fur, 1.05); [-1, 1].forEach(k => { g.beginPath(); g.ellipse(cx + k * 18 * s, by - 6 * s, 15 * s, 9 * s, 0, 0, 7); g.fill(); });
  if (tabby) { g.strokeStyle = dark; g.lineWidth = 7 * s; [[-56, -70], [-60, -45], [52, -70], [58, -45]].forEach(([x, y]) => { g.beginPath(); g.moveTo(cx + x * s, by + y * s); g.quadraticCurveTo(cx + x * 0.8 * s, by + (y - 6) * s, cx + x * 0.62 * s, by + (y - 2) * s); g.stroke(); }); }
  // head
  const hy = by - 140 * s;
  g.fillStyle = fur;
  [-1, 1].forEach(k => { g.beginPath(); g.moveTo(cx + k * 40 * s, hy - 10 * s); g.lineTo(cx + k * 40 * s, hy - 62 * s); g.lineTo(cx + k * 10 * s, hy - 34 * s); g.closePath(); g.fill(); g.strokeStyle = INK; g.lineWidth = 6 * s; g.stroke(); });
  g.fillStyle = "#f2a7b4"; [-1, 1].forEach(k => { g.beginPath(); g.moveTo(cx + k * 35 * s, hy - 18 * s); g.lineTo(cx + k * 37 * s, hy - 50 * s); g.lineTo(cx + k * 17 * s, hy - 32 * s); g.closePath(); g.fill(); });
  const hgd = g.createRadialGradient(cx - 12 * s, hy - 14 * s, 4 * s, cx, hy, 50 * s);
  hgd.addColorStop(0, shade(fur, 1.1)); hgd.addColorStop(1, shade(fur, 0.9));
  g.fillStyle = hgd; g.beginPath(); g.ellipse(cx, hy, 46 * s, 38 * s, 0, 0, 7); g.fill(); g.strokeStyle = INK; g.lineWidth = 6 * s; g.stroke();
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
    const r = p.kid ? 76 : 84, cx = W * (0.5 + (i - (back.length - 1) / 2) * 0.215);
    drawPerson(g, p, cx, (p.kid ? 330 : 280) + (i % 2) * 12, r, H);
  });
  front.forEach((p, i) => {
    const cx = W * (0.5 + (i - (front.length - 1) / 2) * 0.33);
    drawPerson(g, p, cx, 545, 92, H + 40);
  });
  // cats: one on each lap, one in front
  const [c0, c1, c2] = cats;
  if (c2) drawCat(g, c2, W * 0.5 - W * 0.165, H - 10, 1.05, { tabby: /tabby/i.test(c2.look || "") });
  if (c1) drawCat(g, c1, W * 0.5 + W * 0.165, H - 10, 1.0);
  if (c0) drawCat(g, c0, W * 0.5, H - 4, 1.2);

  // studio softness: oval vignette, warm grade and grain
  const vig = g.createRadialGradient(W / 2, H * 0.48, 330, W / 2, H * 0.5, 820);
  vig.addColorStop(0, "rgba(0,0,0,0)"); vig.addColorStop(1, "rgba(5,0,25,0.45)");
  g.fillStyle = vig; g.fillRect(0, 0, W, H);
  g.fillStyle = "rgba(255,200,140,0.06)"; g.fillRect(0, 0, W, H);
  g.fillStyle = "rgba(255,240,215,0.82)"; g.font = "italic 30px Georgia"; g.textAlign = "right";
  g.fillText("The Cerchios · Picture Day ’96", W - 30, H - 26);
  return c;
}

// ---- Certificate -----------------------------------------------------

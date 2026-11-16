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

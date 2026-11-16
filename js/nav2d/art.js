// =====================================================================
//  art.js — SVG drawing kit for the 2D Navigator rooms.
//  Rooms are drawn through a tiny one-point camera so walls, shelves and
//  furniture share one consistent perspective, like a pre-rendered 1995
//  3D scene. Everything here is original artwork made of SVG shapes.
// =====================================================================
export const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const n = v => Math.round(v * 10) / 10;
let uid = 0;
export const id = p => (p || "u") + ++uid;

// ---------------------------------------------------------------- camera
// x: left/right (m), y: up from the floor (m), z: depth from the front plane (m)
export function camera({ cx, hy, K, f, eye }) {
  const p = (x, y, z) => [n(cx + x * K / (z + f)), n(hy - (y - eye) * K / (z + f))];
  p.scale = z => K / (z + f);
  p.eye = eye;
  return p;
}
export const pts = list => list.map(q => q.join(",")).join(" ");
export const poly = (list, fill, extra = "") => `<polygon points="${pts(list)}" fill="${fill}" ${extra}/>`;

// a solid box; faces get their own fills: { front, top, side, bottom }
export function box(c, x0, x1, y0, y1, z0, z1, f, extra = "") {
  const out = [];
  const face = (q, fill) => fill && out.push(poly(q, fill, `stroke="${f.stroke || "none"}" stroke-width="${f.sw || 0.6}" stroke-linejoin="round"`));
  if (y0 > c.eye && f.bottom) face([c(x0, y0, z0), c(x1, y0, z0), c(x1, y0, z1), c(x0, y0, z1)], f.bottom);
  if (y1 < c.eye) face([c(x0, y1, z0), c(x1, y1, z0), c(x1, y1, z1), c(x0, y1, z1)], f.top || f.front);
  if (x0 > 0) face([c(x0, y0, z0), c(x0, y1, z0), c(x0, y1, z1), c(x0, y0, z1)], f.side || f.front);
  if (x1 < 0) face([c(x1, y0, z0), c(x1, y1, z0), c(x1, y1, z1), c(x1, y0, z1)], f.side || f.front);
  face([c(x0, y0, z0), c(x1, y0, z0), c(x1, y1, z0), c(x0, y1, z0)], f.front);
  return `<g ${extra}>${out.join("")}</g>`;
}
// rectangle lying in the plane z (a picture, a screen, a door)
export const quadZ = (c, x0, x1, y0, y1, z, fill, extra = "") => poly([c(x0, y0, z), c(x1, y0, z), c(x1, y1, z), c(x0, y1, z)], fill, extra);
// rectangle lying flat at height y (a rug, a table top)
export const quadY = (c, x0, x1, z0, z1, y, fill, extra = "") => poly([c(x0, y, z0), c(x1, y, z0), c(x1, y, z1), c(x0, y, z1)], fill, extra);
// rectangle in a side wall plane x
export const quadX = (c, x, z0, z1, y0, y1, fill, extra = "") => poly([c(x, y0, z0), c(x, y0, z1), c(x, y1, z1), c(x, y1, z0)], fill, extra);
// soft contact shadow on the floor
export function shadow(c, x0, x1, z0, z1, op = 0.45, y = 0.002) {
  const [ax, ay] = c((x0 + x1) / 2, y, (z0 + z1) / 2), w = Math.abs(c(x1, y, z0)[0] - c(x0, y, z0)[0]) / 2 * 1.08, hh = Math.abs(c(x0, y, z1)[1] - c(x0, y, z0)[1]) / 2 + 3;
  return `<ellipse cx="${ax}" cy="${ay}" rx="${n(w)}" ry="${n(hh)}" fill="#000" opacity="${op}" filter="url(#soft)"/>`;
}
// text painted onto a z-plane (scaled to the depth, not skewed: fine for front-facing labels)
export function label(c, x, y, z, text, { size = 0.08, fill = "#fff", weight = "bold", anchor = "middle", family = "Arial, Helvetica, sans-serif", extra = "" } = {}) {
  const [sx, sy] = c(x, y, z);
  return `<text x="${sx}" y="${sy}" font-size="${n(size * c.scale(z))}" font-family="${family}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}" ${extra}>${esc(text)}</text>`;
}

// ---------------------------------------------------------------- shared <defs>
const rng = s => () => ((s = (s * 16807) % 2147483647) / 2147483647);
function grainPattern(pid, base, dark, light, w = 120, h = 40, seed = 3) {
  const r = rng(seed); let lines = "";
  for (let i = 0; i < 26; i++) {
    const y = r() * h, a = 1 + r() * 3, ph = r() * 6, col = r() > 0.5 ? dark : light, op = 0.18 + r() * 0.3;
    let d = `M0 ${n(y)}`; for (let x = 10; x <= w; x += 10) d += ` L${x} ${n(y + Math.sin(x / 18 + ph) * a)}`;
    lines += `<path d="${d}" stroke="${col}" stroke-width="${n(0.4 + r() * 0.9)}" fill="none" opacity="${n(op)}"/>`;
  }
  return `<pattern id="${pid}" width="${w}" height="${h}" patternUnits="userSpaceOnUse"><rect width="${w}" height="${h}" fill="${base}"/>${lines}</pattern>`;
}
export function defs(extra = "") {
  return `<defs>
    <filter id="soft" x="-30%" y="-60%" width="160%" height="220%"><feGaussianBlur stdDeviation="4"/></filter>
    <filter id="blur2"><feGaussianBlur stdDeviation="2"/></filter>
    <filter id="glow" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="6"/></filter>
    <filter id="hl" x="-15%" y="-15%" width="130%" height="130%" color-interpolation-filters="sRGB">
      <feComponentTransfer><feFuncR type="linear" slope="1.28" intercept=".04"/><feFuncG type="linear" slope="1.28" intercept=".04"/><feFuncB type="linear" slope="1.12" intercept=".02"/></feComponentTransfer>
      <feMorphology operator="dilate" radius="2" in="SourceAlpha" result="d"/><feFlood flood-color="#fff2a0"/><feComposite in2="d" operator="in" result="o"/>
            <feGaussianBlur in="o" stdDeviation="2.6" result="ob"/><feMerge><feMergeNode in="ob"/><feMergeNode in="ob"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    ${grainPattern("cherry", "#7a2414", "#3a0c04", "#b8502a", 140, 46, 7)}
    ${grainPattern("cherryV", "#7a2414", "#3a0c04", "#b8502a", 46, 140, 9).replace(/M0 ([\d.]+)/g, "M$1 0")}
    ${grainPattern("oak", "#b07a3e", "#6a4218", "#e0b070", 140, 46, 11)}
    ${grainPattern("walnut", "#4a2c18", "#22120a", "#7a5030", 140, 46, 13)}
    ${grainPattern("pine", "#d8b47a", "#9a7040", "#f2d8a8", 140, 46, 17)}
    <pattern id="carpetStars" width="60" height="60" patternUnits="userSpaceOnUse"><rect width="60" height="60" fill="#1a2a8a"/>
      <path d="M15 8l2 5 5 .5-4 3 1.5 5-4.5-3-4.5 3 1.5-5-4-3 5-.5z" fill="#e8d040"/><path d="M45 36l1.5 3.5 3.5.4-2.8 2.2 1 3.6-3.2-2-3.2 2 1-3.6-2.8-2.2 3.5-.4z" fill="#7ad0e8"/>
      <circle cx="40" cy="12" r="2" fill="#e85a8a"/><circle cx="12" cy="45" r="1.6" fill="#8ae86a"/></pattern>
    <pattern id="persian" width="40" height="40" patternUnits="userSpaceOnUse"><rect width="40" height="40" fill="#6a1418"/>
      <path d="M20 4l16 16-16 16L4 20z" fill="none" stroke="#c8963a" stroke-width="2"/><circle cx="20" cy="20" r="5" fill="#1a3a5a"/><circle cx="0" cy="0" r="4" fill="#1a3a5a"/><circle cx="40" cy="40" r="4" fill="#1a3a5a"/><circle cx="40" cy="0" r="4" fill="#1a3a5a"/><circle cx="0" cy="40" r="4" fill="#1a3a5a"/></pattern>
    <linearGradient id="glass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#cfe8ff" stop-opacity=".55"/><stop offset=".5" stop-color="#7aa8d0" stop-opacity=".25"/><stop offset="1" stop-color="#cfe8ff" stop-opacity=".45"/></linearGradient>
    <linearGradient id="screenOff" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3a4a52"/><stop offset=".45" stop-color="#10181c"/><stop offset="1" stop-color="#05080a"/></linearGradient>
    <linearGradient id="metal" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e8e8ec"/><stop offset=".5" stop-color="#a0a4ac"/><stop offset="1" stop-color="#5a5e66"/></linearGradient>
    <linearGradient id="blackPlastic" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4a4a50"/><stop offset="1" stop-color="#121214"/></linearGradient>
    <linearGradient id="beige" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f0ead8"/><stop offset="1" stop-color="#bdb49a"/></linearGradient>
    <radialGradient id="spot" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff2c8" stop-opacity=".55"/><stop offset="1" stop-color="#fff2c8" stop-opacity="0"/></radialGradient>
    <radialGradient id="globeG" cx=".38" cy=".35" r=".7"><stop offset="0" stop-color="#9fd4ff"/><stop offset=".55" stop-color="#2a6ac8"/><stop offset="1" stop-color="#0a1a5a"/></radialGradient>
    ${extra}</defs>`;
}

// ---------------------------------------------------------------- room shell
// walls/floor/ceiling of the box [-W..W] × [0..H] × [0..D], drawn from the inside
export function shell(c, { W, H, D, back, left, right, floor, ceil, floorLines = 0, floorJoints = 0, plankColor = "rgba(40,14,4,.35)" }) {
  let s = "";
  const BL = c(-W, 0, D), BR = c(W, 0, D), TL = c(-W, H, D), TR = c(W, H, D);
  const fl = c(-W, 0, -1.5), fr = c(W, 0, -1.5), cl = c(-W, H, -1.5), cr = c(W, H, -1.5);
  s += poly([cl, cr, TR, TL], ceil);
  s += poly([cl, TL, BL, fl], left);
  s += poly([cr, TR, BR, fr], right);
  s += poly([fl, BL, BR, fr], floor);
  // planks run toward the vanishing point; joints step back in depth
  for (let i = 1; i < floorLines; i++) { const x = -W + (2 * W * i) / floorLines; s += `<line x1="${c(x, 0, D)[0]}" y1="${c(x, 0, D)[1]}" x2="${c(x, 0, -1.5)[0]}" y2="${c(x, 0, -1.5)[1]}" stroke="${plankColor}" stroke-width=".8"/>`; }
  for (let j = 0; j < floorJoints; j++) {
    const z = D - (j + 0.5) * (D + 1.5) / floorJoints;
    for (let i = 0; i < floorLines; i++) { if ((i + j) % 3) continue; const x0 = -W + (2 * W * i) / floorLines, x1 = x0 + 2 * W / floorLines; s += `<line x1="${c(x0, 0, z)[0]}" y1="${c(x0, 0, z)[1]}" x2="${c(x1, 0, z)[0]}" y2="${c(x1, 0, z)[1]}" stroke="${plankColor}" stroke-width=".7"/>`; }
  }
  s += poly([TL, TR, BR, BL], back);
  return s;
}
// a floor reflection sheen and a light pool, to sell the glossy pre-rendered look
export function pool(c, x, z, rx, rz, color = "#fff2c8", op = 0.35) {
  const [px, py] = c(x, 0.001, z), w = Math.abs(c(x + rx, 0, z)[0] - px), hgt = Math.abs(c(x, 0, z + rz)[1] - py);
  const gid = id("pool");
  return `<radialGradient id="${gid}"><stop offset="0" stop-color="${color}" stop-opacity="${op}"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></radialGradient><ellipse cx="${px}" cy="${py}" rx="${n(w)}" ry="${n(Math.max(hgt, 4))}" fill="url(#${gid})"/>`;
}
export function wallGlow(x, y, rx, ry, color = "#fff2c8", op = 0.4) {
  const gid = id("wg");
  return `<radialGradient id="${gid}"><stop offset="0" stop-color="${color}" stop-opacity="${op}"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></radialGradient><ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="url(#${gid})"/>`;
}
export function lingrad(stops, x2 = 0, y2 = 1) {
  const gid = id("lg");
  return { id: `url(#${gid})`, def: `<linearGradient id="${gid}" x1="0" y1="0" x2="${x2}" y2="${y2}">${stops.map(([o, col, op = 1]) => `<stop offset="${o}" stop-color="${col}" stop-opacity="${op}"/>`).join("")}</linearGradient>` };
}

// ---------------------------------------------------------------- props
export function doorway(c, x0, x1, z, h, { inside = "#f2d8a0", inside2 = "#b88a50", frame = "url(#cherryV)", floorIn = "#8a5a30" } = {}) {
  const gr = lingrad([[0, inside], [1, inside2]]);
  // the far room seen through the opening: its back wall + floor
  const zb = z + 2.2;
  return gr.def + quadZ(c, x0, x1, 0, h, z, gr.id) +
    poly([c(x0, 0, z), c(x1, 0, z), c(x1 - 0.1, 0, zb), c(x0 + 0.1, 0, zb)], floorIn) +
    quadZ(c, x0 + 0.1, x1 - 0.1, 0, h * 0.95, zb, inside2, 'opacity=".85"') +
    `<g fill="${frame}" stroke="#2a0a02" stroke-width=".6">` +
    quadZ(c, x0 - 0.08, x0, 0, h + 0.08, z - 0.001, frame) + quadZ(c, x1, x1 + 0.08, 0, h + 0.08, z - 0.001, frame) + quadZ(c, x0 - 0.08, x1 + 0.08, h, h + 0.1, z - 0.001, frame) + `</g>`;
}
export function windowZ(c, x0, x1, y0, y1, z, { sky = ["#5a9ae0", "#cfe6ff"], trees = true, mullions = 2 } = {}) {
  const g = lingrad([[0, sky[0]], [1, sky[1]]]);
  const [ax, ay] = c(x0, y1, z), [bx, by] = c(x1, y0, z);
  let s = g.def + quadZ(c, x0, x1, y0, y1, z, g.id);
  if (trees) {
    const r = rng(Math.round(x0 * 100 + 7) || 5), cid = id("clip");
    s += `<clipPath id="${cid}"><rect x="${ax}" y="${ay}" width="${n(bx - ax)}" height="${n(by - ay)}"/></clipPath><g clip-path="url(#${cid})">`;
    s += `<rect x="${ax}" y="${n(by - (by - ay) * 0.22)}" width="${n(bx - ax)}" height="${n((by - ay) * 0.22)}" fill="#4a8a3a"/>`;
    for (let i = 0; i < 9; i++) { const tx = ax + r() * (bx - ax), ty = by - (by - ay) * (0.25 + r() * 0.25), rr = (bx - ax) * (0.12 + r() * 0.12); s += `<circle cx="${n(tx)}" cy="${n(ty)}" r="${n(rr)}" fill="${["#2f6a2a", "#3f7f30", "#5a9a3a", "#25552a"][i % 4]}"/>`; }
    s += `</g>`;
  }
  // frame + mullions
  s += `<g stroke="#f4efe4" stroke-width="${n(c.scale(z) * 0.05)}" fill="none"><rect x="${ax}" y="${ay}" width="${n(bx - ax)}" height="${n(by - ay)}"/>`;
  for (let i = 1; i < mullions; i++) { const x = ax + (bx - ax) * i / mullions; s += `<line x1="${n(x)}" y1="${ay}" x2="${n(x)}" y2="${by}"/>`; }
  s += `<line x1="${ax}" y1="${n((ay + by) / 2)}" x2="${bx}" y2="${n((ay + by) / 2)}"/></g>`;
  s += `<polygon points="${ax},${ay} ${n(ax + (bx - ax) * 0.35)},${ay} ${ax},${n(ay + (by - ay) * 0.5)}" fill="#fff" opacity=".18"/>`;
  return s;
}
export function clock(c, x, y, z, r, { face = "#f8f4e8", rim = "#3a2a1a" } = {}) {
  const [cx, cy] = c(x, y, z), R = n(r * c.scale(z));
  let ticks = ""; for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; ticks += `<line x1="${n(cx + Math.sin(a) * R * 0.78)}" y1="${n(cy - Math.cos(a) * R * 0.78)}" x2="${n(cx + Math.sin(a) * R * 0.9)}" y2="${n(cy - Math.cos(a) * R * 0.9)}" stroke="#222" stroke-width="${i % 3 ? 0.6 : 1.4}"/>`; }
  return `<circle cx="${cx}" cy="${cy}" r="${R}" fill="${face}" stroke="${rim}" stroke-width="${n(R * 0.14)}"/>${ticks}
    <g class="clock" data-cx="${cx}" data-cy="${cy}" data-r="${R}"><line class="hh" stroke="#111" stroke-width="${n(R * 0.1)}" stroke-linecap="round"/><line class="mh" stroke="#111" stroke-width="${n(R * 0.07)}" stroke-linecap="round"/><line class="sh" stroke="#b01010" stroke-width="${n(R * 0.03)}"/></g>
    <circle cx="${cx}" cy="${cy}" r="${n(R * 0.06)}" fill="#111"/><ellipse cx="${n(cx - R * 0.3)}" cy="${n(cy - R * 0.45)}" rx="${n(R * 0.45)}" ry="${n(R * 0.2)}" fill="#fff" opacity=".35"/>`;
}
export function tv(c, x0, x1, y0, y1, z, d = 0.45, { body = "url(#blackPlastic)", screenId = "" } = {}) {
  const pad = (x1 - x0) * 0.07;
  return box(c, x0, x1, y0, y1, z, z + d, { front: body, top: "#2a2a2e", side: "#18181a" }) +
    quadZ(c, x0 + pad, x1 - pad * 2.4, y0 + pad * 1.1, y1 - pad, z - 0.001, "url(#screenOff)", screenId ? `id="${screenId}"` : "") +
    quadZ(c, x1 - pad * 1.9, x1 - pad * 0.6, y0 + pad, y1 - pad, z - 0.001, "#222") +
    [0, 1, 2, 3].map(i => { const [bx, by] = c(x1 - pad * 1.25, y1 - pad * 1.6 - i * (y1 - y0) * 0.12, z - 0.002); return `<circle cx="${bx}" cy="${by}" r="${n(c.scale(z) * 0.018)}" fill="${i ? "#666" : "#3c3"}"/>`; }).join("");
}
export function stereo(c, x0, x1, y0, y1, z) {
  const h = (y1 - y0) / 3; let s = "";
  for (let i = 0; i < 3; i++) {
    const a = y0 + i * h, b = a + h * 0.94;
    s += box(c, x0, x1, a, b, z, z + 0.35, { front: "url(#blackPlastic)", top: "#38383c", side: "#141416" });
    s += quadZ(c, x0 + 0.04, x0 + (x1 - x0) * 0.42, a + h * 0.3, b - h * 0.25, z - 0.001, i === 1 ? "#0a2a20" : "#111");
    if (i === 1) s += label(c, x0 + (x1 - x0) * 0.23, a + h * 0.38, z - 0.002, "88:88", { size: 0.06, fill: "#4f6", family: "monospace" });
    for (let k = 0; k < 4; k++) { const [bx, by] = c(x0 + (x1 - x0) * (0.55 + k * 0.1), a + h * 0.45, z - 0.002); s += `<rect x="${n(bx - 2)}" y="${n(by - 1.2)}" width="4" height="2.4" fill="#888"/>`; }
    if (i === 2) { const [kx, ky] = c(x1 - 0.08, a + h * 0.5, z - 0.002); s += `<circle cx="${kx}" cy="${ky}" r="${n(c.scale(z) * 0.035)}" fill="#999" stroke="#333"/>`; }
  }
  return s;
}
export function speaker(c, x0, x1, y0, y1, z, d = 0.3) {
  const w = x1 - x0, [cx, cy] = c((x0 + x1) / 2, y0 + (y1 - y0) * 0.3, z - 0.001), [tx, ty] = c((x0 + x1) / 2, y0 + (y1 - y0) * 0.72, z - 0.001), s = c.scale(z);
  return box(c, x0, x1, y0, y1, z, z + d, { front: "url(#walnut)", top: "#3a2010", side: "#1e0e06" }) +
    quadZ(c, x0 + w * 0.08, x1 - w * 0.08, y0 + 0.05, y1 - 0.05, z - 0.0005, "#1a1a1c", 'opacity=".92"') +
    `<circle cx="${cx}" cy="${cy}" r="${n(w * 0.32 * s)}" fill="#2a2a2e" stroke="#555" stroke-width=".8"/><circle cx="${cx}" cy="${cy}" r="${n(w * 0.1 * s)}" fill="#444"/>` +
    `<circle cx="${tx}" cy="${ty}" r="${n(w * 0.16 * s)}" fill="#2a2a2e" stroke="#555" stroke-width=".8"/>`;
}
export function book(c, x0, x1, y0, y1, z, color, title = "", { d = 0.2, txt = "#f0e0b0" } = {}) {
  const [tx, ty] = c((x0 + x1) / 2, (y0 + y1) / 2, z - 0.001);
  const fs = n(Math.min((x1 - x0) * 0.7, 0.05) * c.scale(z));
  return box(c, x0, x1, y0, y1, z, z + d, { front: color, top: "#efe6cc", side: "rgba(0,0,0,.35)", stroke: "rgba(0,0,0,.35)", sw: 0.4 }) +
    quadZ(c, x0, x1, y1 - (y1 - y0) * 0.1, y1 - (y1 - y0) * 0.06, z - 0.0005, "rgba(255,220,120,.6)") +
    (title ? `<text x="${tx}" y="${ty}" font-size="${fs}" font-family="Arial" font-weight="bold" fill="${txt}" text-anchor="middle" dominant-baseline="middle" transform="rotate(-90 ${tx} ${ty})">${esc(title)}</text>` : "");
}
// boxed software, front-facing: a coloured box with a title, an emblem and a spine
export function softbox(c, x0, x1, y0, y1, z, { color = "#2a5aa0", color2 = "#0a2a60", title = "", glyph = "", d = 0.12, ink = "#fff" }) {
  const gr = lingrad([[0, color], [1, color2]], 1, 1);
  const [cx] = c((x0 + x1) / 2, 0, z), s = c.scale(z), [, ty] = c(0, y0 + (y1 - y0) * 0.2, z), [, gy] = c(0, y0 + (y1 - y0) * 0.68, z);
  const words = String(title).split(" "), lines = []; words.forEach(w => { const l = lines[lines.length - 1]; if (l && (l + " " + w).length <= 11) lines[lines.length - 1] = l + " " + w; else lines.push(w); });
  const fs = n((x1 - x0) * s * 0.13);
  return gr.def + box(c, x0, x1, y0, y1, z, z + d, { front: gr.id, top: "#ddd", side: color2, stroke: "rgba(0,0,0,.5)", sw: 0.5 }) +
    quadZ(c, x0, x1, y1 - (y1 - y0) * 0.14, y1, z - 0.0005, "rgba(255,255,255,.18)") +
    `<text x="${cx}" y="${n(gy)}" font-size="${n((x1 - x0) * s * 0.34)}" text-anchor="middle" dominant-baseline="middle">${glyph}</text>` +
    lines.slice(0, 3).map((l, i) => `<text x="${cx}" y="${n(ty + (i - (Math.min(lines.length, 3) - 1)) * fs * 1.05)}" font-size="${fs}" font-family="Arial Black, Arial" font-weight="900" fill="${ink}" text-anchor="middle" stroke="rgba(0,0,0,.35)" stroke-width=".4">${esc(l)}</text>`).join("");
}
export function phone(c, x, y, z, { body = "#e8e2d0", dark = "#b8b09a" } = {}) {
  const w = 0.22, d = 0.2, h = 0.07;
  let s = box(c, x - w / 2, x + w / 2, y, y + h, z, z + d, { front: dark, top: body, side: dark, stroke: "#6a6450", sw: 0.4 });
  s += box(c, x - w / 2 - 0.01, x + w / 2 + 0.01, y + h, y + h + 0.05, z + 0.03, z + 0.08, { front: dark, top: body, side: dark, stroke: "#6a6450", sw: 0.4 });
  for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) { const [px, py] = c(x - 0.06 + j * 0.06, y + h + 0.001, z + 0.1 + i * 0.03); s += `<rect x="${n(px - 1.6)}" y="${n(py - 1)}" width="3.2" height="2" fill="#555"/>`; }
  return s;
}
export function fax(c, x, y, z) {
  const w = 0.36, d = 0.28;
  return box(c, x - w / 2, x + w / 2, y, y + 0.1, z, z + d, { front: "#d8d4c8", top: "#f4f0e6", side: "#a8a498", stroke: "#6a6658", sw: 0.4 }) +
    box(c, x - w / 2 + 0.03, x - 0.02, y + 0.1, y + 0.13, z + 0.04, z + 0.14, { front: "#bbb", top: "#ddd", side: "#999" }) +
    poly([c(x - 0.1, y + 0.1, z + d - 0.02), c(x + 0.12, y + 0.1, z + d - 0.02), c(x + 0.1, y + 0.2, z + d + 0.03), c(x - 0.08, y + 0.2, z + d + 0.03)], "#fff", 'stroke="#aaa" stroke-width=".4"') +
    box(c, x + 0.04, x + 0.16, y + 0.1, y + 0.11, z + 0.05, z + 0.17, { front: "#555", top: "#666", side: "#444" });
}
export function laptop(c, x, y, z, { screen = "#103a6a" } = {}) {
  const w = 0.36, d = 0.26;
  return box(c, x - w / 2, x + w / 2, y, y + 0.03, z, z + d, { front: "#2a2a2e", top: "#3a3a40", side: "#1a1a1c" }) +
    poly([c(x - w / 2, y + 0.03, z + d), c(x + w / 2, y + 0.03, z + d), c(x + w / 2, y + 0.27, z + d + 0.05), c(x - w / 2, y + 0.27, z + d + 0.05)], "#2a2a2e") +
    poly([c(x - w / 2 + 0.025, y + 0.05, z + d + 0.003), c(x + w / 2 - 0.025, y + 0.05, z + d + 0.003), c(x + w / 2 - 0.025, y + 0.25, z + d + 0.045), c(x - w / 2 + 0.025, y + 0.25, z + d + 0.045)], screen) +
    quadY(c, x - w / 2 + 0.03, x + w / 2 - 0.03, z + 0.05, z + d - 0.04, y + 0.031, "#4a4a52");
}
export function remote(c, x, y, z) { return box(c, x - 0.04, x + 0.04, y, y + 0.025, z, z + 0.2, { front: "#111", top: "#2a2a2e", side: "#111" }) + quadY(c, x - 0.025, x + 0.025, z + 0.02, z + 0.05, y + 0.026, "#c33"); }
export function globe(c, x, y, z, r, { stand = "#c9a54a", text = "" } = {}) {
  const [cx, cy] = c(x, y + r, z), R = n(r * c.scale(z)), [bx, by] = c(x, y, z);
  return `<line x1="${cx}" y1="${cy}" x2="${bx}" y2="${by}" stroke="${stand}" stroke-width="${n(R * 0.12)}"/><ellipse cx="${bx}" cy="${by}" rx="${n(R * 0.55)}" ry="${n(R * 0.14)}" fill="${stand}"/>
    <circle cx="${cx}" cy="${cy}" r="${R}" fill="url(#globeG)"/>
    <path d="M${n(cx - R * 0.5)} ${n(cy - R * 0.3)} q${n(R * 0.3)} ${n(-R * 0.25)} ${n(R * 0.55)} ${n(R * 0.05)} t${n(R * 0.2)} ${n(R * 0.45)} q${n(-R * 0.3)} ${n(R * 0.2)} ${n(-R * 0.5)} ${n(-R * 0.1)}z M${n(cx + R * 0.15)} ${n(cy + R * 0.25)} q${n(R * 0.3)} 0 ${n(R * 0.45)} ${n(R * 0.3)} q${n(-R * 0.25)} ${n(R * 0.15)} ${n(-R * 0.45)} ${n(-R * 0.3)}z" fill="#3a9a3a" opacity=".9"/>
    <path d="M${n(cx - R * 1.1)} ${cy} a${n(R * 1.1)} ${n(R * 1.1)} 0 0 0 ${n(R * 2.2)} 0" fill="none" stroke="${stand}" stroke-width="${n(R * 0.08)}"/>
    ${text ? `<text x="${cx}" y="${n(cy + R * 0.12)}" font-size="${n(R * 0.36)}" font-family="Arial Black,Arial" font-weight="900" fill="#fff" text-anchor="middle" stroke="#0a1a5a" stroke-width=".6" transform="rotate(-8 ${cx} ${cy})">${esc(text)}</text>` : ""}
    <ellipse cx="${n(cx - R * 0.35)}" cy="${n(cy - R * 0.45)}" rx="${n(R * 0.3)}" ry="${n(R * 0.15)}" fill="#fff" opacity=".45"/>`;
}
export function plant(c, x, z, h = 1.1, { pot = "#a0502a" } = {}) {
  const r = rng(Math.round(x * 1000) + 99); let s = box(c, x - 0.16, x + 0.16, 0, 0.32, z, z + 0.3, { front: pot, top: "#3a2010", side: "#6a3018" });
  for (let i = 0; i < 16; i++) {
    const a = -Math.PI / 2 + (r() - 0.5) * 2.4, len = h * (0.45 + r() * 0.55), [bx, by] = c(x, 0.32, z + 0.15), s2 = c.scale(z);
    const ex = bx + Math.cos(a) * len * s2 * 0.6, ey = by + Math.sin(a) * len * s2;
    s += `<path d="M${bx} ${by} Q${n((bx + ex) / 2 + (r() - 0.5) * 20)} ${n((by + ey) / 2)} ${n(ex)} ${n(ey)}" stroke="${["#2f6a2a", "#3f8a34", "#5aa040"][i % 3]}" stroke-width="${n(2 + r() * 3)}" fill="none" stroke-linecap="round"/>`;
  }
  return s;
}
export function frame(c, x0, x1, y0, y1, z, inner, { color = "#c9a54a", w = 0.06 } = {}) {
  return quadZ(c, x0 - w, x1 + w, y0 - w, y1 + w, z, color, 'stroke="#5a4010" stroke-width=".6"') + inner;
}
export function trashcan(c, x, z, { color = "#3a4a5a", h = 0.45, r = 0.18 } = {}) {
  const [lx, ly] = c(x - r, h, z), [rx] = c(x + r, h, z), [bx, by] = c(x - r * 0.8, 0, z), [cx] = c(x + r * 0.8, 0, z), [, ry] = c(x, h, z + r);
  const g = lingrad([[0, "#000", 0.35], [0.4, "#fff", 0.15], [1, "#000", 0.45]], 1, 0);
  return g.def + `<ellipse cx="${n((bx + cx) / 2)}" cy="${by}" rx="${n((cx - bx) / 2 * 1.2)}" ry="4" fill="#000" opacity=".4" filter="url(#soft)"/>
    <path d="M${lx} ${ly} L${bx} ${by} L${cx} ${by} L${rx} ${ly} Z" fill="${color}"/><path d="M${lx} ${ly} L${bx} ${by} L${cx} ${by} L${rx} ${ly} Z" fill="${g.id}"/>
    <ellipse cx="${n((lx + rx) / 2)}" cy="${ly}" rx="${n((rx - lx) / 2)}" ry="${n(Math.max(3, ly - ry))}" fill="#111" stroke="${color}" stroke-width="1.4"/>`;
}
export function envelope(x, y, w = 34) {
  const h = w * 0.62;
  return `<g transform="translate(${x} ${y}) rotate(-8)"><rect x="${n(-w / 2)}" y="${n(-h / 2)}" width="${w}" height="${n(h)}" fill="#fbf6e2" stroke="#7a6a40"/><path d="M${n(-w / 2)} ${n(-h / 2)} L0 ${n(h * 0.12)} L${n(w / 2)} ${n(-h / 2)}" fill="none" stroke="#7a6a40"/><circle cx="0" cy="${n(h * 0.12)}" r="${n(w * 0.09)}" fill="#b01818"/><rect x="${n(w / 2 - w * 0.28)}" y="${n(-h / 2 + 2)}" width="${n(w * 0.22)}" height="${n(h * 0.3)}" fill="#3a6ad0"/></g>`;
}
// a curled-up cat seen from the front, for the rug
export function cat(x, y, s, { color = "#e0802e", stripe = "#9e4a12", belly = "#f6d2a6" } = {}) {
  return `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cx="0" cy="6" rx="34" ry="5" fill="#000" opacity=".35" filter="url(#blur2)"/>
    <ellipse cx="0" cy="-6" rx="30" ry="14" fill="${color}"/><path d="M-26 -4 q20 -16 46 -6" stroke="${stripe}" stroke-width="3" fill="none"/><path d="M-20 -14 q4 10 0 18 M-8 -19 q4 12 0 22 M6 -19 q4 12 0 22" stroke="${stripe}" stroke-width="2.4" fill="none" opacity=".8"/>
    <path d="M24 -2 q14 4 8 12 q-14 2 -38 -2" fill="${color}" stroke="${stripe}" stroke-width="1"/>
    <ellipse cx="-22" cy="-10" rx="12" ry="10" fill="${color}"/><path d="M-32 -16 l-2 -10 l8 5z M-16 -18 l2 -10 l-8 5z" fill="${color}" stroke="${stripe}" stroke-width=".8"/>
    <ellipse cx="-22" cy="-6" rx="7" ry="4" fill="${belly}"/><path d="M-27 -11 q2 1.5 4 0 M-20 -11 q2 1.5 4 0" stroke="#222" stroke-width="1" fill="none"/><circle cx="-22" cy="-7.5" r="1" fill="#c56"/></g>`;
}

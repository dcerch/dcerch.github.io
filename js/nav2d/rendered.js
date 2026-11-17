// Pre-rendered rooms: a still image from the Blender scenes (tools/nav3d), with invisible hotspot
// polygons on top, just like the original Navigator. Hovering lights up the object under the pointer.
import { RENDERS } from "./renders.js";

const n = v => Math.round(v * 10) / 10;
const pts = p => p.map(([x, y]) => `${n(x)},${n(y)}`).join(" ");

export const has = room => !!RENDERS[room];
export const anchor = (room, name) => (RENDERS[room] && RENDERS[room].anchors[name]) || null;

// Affine transform mapping the unit square onto an anchor quad [BL, BR, TR, TL].
export function quadMatrix(q) {
  const [bl, , tr, tl] = q;
  return `matrix(${n(tr[0] - tl[0])} ${n(tr[1] - tl[1])} ${n(bl[0] - tl[0])} ${n(bl[1] - tl[1])} ${n(tl[0])} ${n(tl[1])})`;
}
// An image (or any SVG drawn in a 0..1 box) stretched onto an anchor quad.
export function onQuad(q, inner) {
  return q ? `<g transform="${quadMatrix(q)}">${inner}</g>` : "";
}
export function imageOnQuad(q, href, extra = "") {
  return onQuad(q, `<image href="${href}" x="0" y="0" width="1" height="1" preserveAspectRatio="none" ${extra}/>`);
}
// Centre and size of an anchor quad.
export function quadBox(q) {
  const xs = q.map(p => p[0]), ys = q.map(p => p[1]);
  const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
  return { x: x0, y: y0, w: x1 - x0, h: y1 - y0, cx: (x0 + x1) / 2, cy: (y0 + y1) / 2 };
}
// Live hands for a clock face anchor (main.js turns any .clock group every second).
export function clockHands(q) {
  if (!q) return "";
  const b = quadBox(q), r = Math.min(b.w, b.h) / 2;
  return `<g class="clock" data-cx="${n(b.cx)}" data-cy="${n(b.cy)}" data-r="${n(r)}" pointer-events="none"><line class="hh" stroke="#111" stroke-width="${n(r * 0.12)}" stroke-linecap="round"/><line class="mh" stroke="#111" stroke-width="${n(r * 0.08)}" stroke-linecap="round"/><line class="sh" stroke="#b01010" stroke-width="${n(Math.max(0.8, r * 0.03))}"/></g><circle cx="${n(b.cx)}" cy="${n(b.cy)}" r="${n(r * 0.07)}" fill="#111" pointer-events="none"/>`;
}

// A software box drawn on a slot anchor: shaded front, a sliver of side and top, glyph and title.
export function softbox(q, it, uid) {
  if (!q) return "";
  const b = quadBox(q), d = Math.max(4, b.w * 0.12), gid = "sb" + uid;
  const lines = it.title.split(" ").reduce((a, w) => { const l = a[a.length - 1]; if (l && (l + " " + w).length <= 11) a[a.length - 1] = l + " " + w; else a.push(w); return a; }, []).slice(0, 2);
  const fs = Math.max(6, b.w * 0.13);
  return `<linearGradient id="${gid}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${it.color}"/><stop offset="1" stop-color="${it.color2}"/></linearGradient>
    <ellipse cx="${n(b.cx + d / 2)}" cy="${n(b.y + b.h)}" rx="${n(b.w * 0.62)}" ry="${n(d * 0.5)}" fill="#000" opacity=".35"/>
    <path d="M${n(b.x + b.w)} ${n(b.y)} l${n(d)} ${n(-d * 0.6)} v${n(b.h)} l${n(-d)} ${n(d * 0.6)}z" fill="${it.color2}"/>
    <path d="M${n(b.x)} ${n(b.y)} l${n(d)} ${n(-d * 0.6)} h${n(b.w)} l${n(-d)} ${n(d * 0.6)}z" fill="${it.color}" opacity=".85"/>
    <rect x="${n(b.x)}" y="${n(b.y)}" width="${n(b.w)}" height="${n(b.h)}" fill="url(#${gid})" stroke="#000" stroke-width=".6"/>
    <rect x="${n(b.x)}" y="${n(b.y)}" width="${n(b.w)}" height="${n(b.h * 0.14)}" fill="#fff" opacity=".22"/>
    <rect x="${n(b.x + b.w * 0.06)}" y="${n(b.y)}" width="${n(b.w * 0.08)}" height="${n(b.h)}" fill="#fff" opacity=".1"/>
    <text x="${n(b.cx)}" y="${n(b.y + b.h * 0.44)}" font-size="${n(b.w * 0.42)}" text-anchor="middle" dominant-baseline="middle">${it.glyph}</text>
    ${lines.map((l, k) => `<text x="${n(b.cx)}" y="${n(b.y + b.h * 0.78 + k * fs * 1.1)}" font-size="${n(fs)}" font-family="Arial Black,Arial" text-anchor="middle" fill="${it.ink || "#fff"}">${l.replace(/&/g, "&amp;").replace(/</g, "&lt;")}</text>`).join("")}`;
}

/**
 * The room as SVG markup: background image, overlays, then one hotspot group per key.
 * opts.overlays: SVG drawn over the picture (portrait, TV text, live clock…); opts.hidden: keys to leave out;
 * opts.extraHots: [{ k, svg }] hand-drawn hotspots (sprites like the cat) placed above the rendered ones.
 */
export function scene(room, { overlays = "", hidden = [], extraHots = [], under = "" } = {}) {
  const R = RENDERS[room];
  const W = R.W, H = R.H, id = "bg-" + room;
  // one group per key, ordered by its nearest polygon so closer objects win the pointer
  const byKey = new Map();
  R.hots.forEach((h, i) => {
    if (hidden.includes(h.k)) return;
    const e = byKey.get(h.k) || { k: h.k, polys: [], order: i };
    e.polys.push(h.p); e.order = i; byKey.set(h.k, e);
  });
  const groups = [...byKey.values()].sort((a, b) => a.order - b.order);
  let clips = "", hots = "";
  groups.forEach((g, i) => {
    const cid = `hc-${room}-${i}`, poly = g.polys.map(p => `<polygon points="${pts(p)}"/>`).join("");
    clips += `<clipPath id="${cid}">${poly}</clipPath>`;
    hots += `<g class="hot rh" data-hot="${g.k}"><g class="lit" clip-path="url(#${cid})"><use href="#${id}"/></g>${g.polys.map(p => `<polygon class="hit" points="${pts(p)}"/>`).join("")}</g>`;
  });
  extraHots.forEach(e => (hots += `<g class="hot" data-hot="${e.k}">${e.svg}</g>`));
  return `<defs>${clips}</defs>${under}<g id="${id}"><image href="img/nav/${room}.png" x="0" y="0" width="${W}" height="${H}" preserveAspectRatio="none" class="render"/>${overlays}</g>${hots}`;
}

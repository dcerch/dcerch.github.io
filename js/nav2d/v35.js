// =====================================================================
//  v35.js — Navigator 3.5 (1995): 640×480, warm cherry-wood rooms.
//  Living Room (home) · Info Room · Software Room · Map · Electronic
//  Documents, and Ark KidSpace. Toolbar across the top, house-icon Map
//  button top-left, InfoGuide + caption bar + Menu along the bottom.
// =====================================================================
import * as A from "./art.js";
import { SOFTWARE, CATS35, CAT_INFO } from "./catalog.js";
import { CERTIFICATIONS, VOLUNTEERING, PROFILE, ARCHIVE, CATS } from "../data.js";
import { kidspace } from "./kidspace.js";
import { manualsRoomContent, manualViewer } from "./manuals.js";
import * as R from "./rendered.js";

const W = 640, H = 480;
const svg = (body, extraDefs = "") => `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">${A.defs(extraDefs)}${body}</svg>`;
const hot = (k, inner) => `<g class="hot" data-hot="${k}">${inner}</g>`;
const cam = () => A.camera({ cx: 320, hy: 205, K: 430, f: 2.5, eye: 1.45 });

// ---------------------------------------------------------------- Living Room
function living(api) {
  if (R.has("v35_living")) {
    const ov = R.imageOnQuad(R.anchor("v35_living", "portrait"), api.portrait()) + R.clockHands(R.anchor("v35_living", "clock")) + tvClue(api, R.anchor("v35_living", "tvScreen"));
    const extra = [{ k: "cat", svg: A.cat(150, 452, 1.05, CATS[2] || {}) }];
    if (api.arg.step >= 3) extra.push({ k: "khajiit", svg: merchantCat(86, 300) });
    return svg(R.scene("v35_living", { overlays: ov, extraHots: extra }));
  }
  return livingSVG(api);
}
function tvClue(api, q) {
  if (!q || api.arg.step !== 2) return "";
  const b = R.quadBox(q);
  return `<rect x="${b.x}" y="${b.y}" width="${b.w}" height="${b.h}" fill="#0a1a10"/><text x="${b.cx}" y="${b.cy}" font-size="${Math.max(6, b.w / 22)}" font-family="monospace" fill="#5f5" text-anchor="middle">You decide to click the symbols.</text>`;
}
function livingSVG(api) {
  const c = cam(), Wd = 3, D = 3.5, Hh = 2.8;
  const back = A.lingrad([[0, "#efe4cc"], [1, "#cdb994"]]), side = A.lingrad([[0, "#d8c8a8"], [1, "#b09a74"]], 1, 0), sideR = A.lingrad([[0, "#b09a74"], [1, "#d8c8a8"]], 1, 0);
  const ceil = A.lingrad([[0, "#c8bca0"], [1, "#efe6d0"]]), floor = A.lingrad([[0, "#8a4a22"], [1, "#5a2a10"]]);
  let s = back.def + side.def + sideR.def + ceil.def + floor.def;
  s += A.shell(c, { W: Wd, H: Hh, D, back: back.id, left: side.id, right: sideR.id, floor: floor.id, ceil: ceil.id, floorLines: 14, floorJoints: 6 });
  s += A.poly([c(-Wd, 0, D), c(Wd, 0, D), c(Wd, 0.12, D), c(-Wd, 0.12, D)], "#f4ecd8"); // baseboard
  s += A.pool(c, 0, 2.2, 2.4, 1.2, "#ffe8b0", 0.28);
  // crown light from the ceiling cans
  s += A.wallGlow(320, 150, 170, 70, "#fff4d0", 0.45) + A.wallGlow(165, 150, 50, 60, "#fff4d0", 0.3) + A.wallGlow(475, 150, 50, 60, "#fff4d0", 0.3);
  // left doorway → Info Room, right doorway → Software Room (in the side walls)
  const doorL = [c(-Wd, 0, 1.95), c(-Wd, 2.15, 1.95), c(-Wd, 2.15, 2.95), c(-Wd, 0, 2.95)], doorR = [c(Wd, 0, 1.95), c(Wd, 2.15, 1.95), c(Wd, 2.15, 2.95), c(Wd, 0, 2.95)];
  const dl = A.lingrad([[0, "#7a1a0a"], [1, "#3a0a04"]], 1, 0), dr = A.lingrad([[0, "#2a3a6a"], [1, "#6a7ab0"]], 1, 0);
  s += dl.def + dr.def;
  s += hot("door-info", A.poly(doorL, dl.id) + A.poly([c(-Wd, 0, 1.95), c(-Wd, 0, 2.95), c(-Wd - 1, 0, 2.95), c(-Wd - 1, 0, 1.95)], "#3a1a0a") +
    `<polyline points="${A.pts(doorL)}" fill="none" stroke="#f4ecd8" stroke-width="3"/>` + A.label(c, -Wd + 0.01, 1.2, 2.45, "", {}) +
    A.poly([c(-Wd, 1.1, 2.2), c(-Wd, 1.7, 2.2), c(-Wd, 1.7, 2.7), c(-Wd, 1.1, 2.7)], "#c9a54a", 'opacity=".55"'));
  s += hot("door-software", A.poly(doorR, dr.id) + `<polyline points="${A.pts(doorR)}" fill="none" stroke="#f4ecd8" stroke-width="3"/>` +
    [0, 1, 2].map(i => A.poly([c(Wd, 0.5 + i * 0.5, 2.1), c(Wd, 0.5 + i * 0.5, 2.8), c(Wd, 0.54 + i * 0.5, 2.8), c(Wd, 0.54 + i * 0.5, 2.1)], "#c9a54a")).join("") +
    [0, 1, 2].map(i => A.poly([c(Wd, 0.56 + i * 0.5, 2.2), c(Wd, 0.56 + i * 0.5, 2.35), c(Wd, 0.85 + i * 0.5, 2.35), c(Wd, 0.85 + i * 0.5, 2.2)], ["#c83a2a", "#2a6ad0", "#3aa03a"][i])).join(""));
  // back-wall window with trees
  s += A.windowZ(c, -2.75, -1.85, 0.95, 2.2, D, { mullions: 2 });
  s += A.box(c, -2.82, -1.78, 0.88, 0.95, D - 0.12, D, { front: "#f4ecd8", top: "#fffaf0" });
  // family portrait (right of the wall unit)
  const [px0, py0] = c(1.9, 1.98, D - 0.02), [px1, py1] = c(2.62, 1.32, D - 0.02);
  s += hot("portrait", A.quadZ(c, 1.84, 2.68, 1.26, 2.04, D - 0.01, "#a8822a", 'stroke="#4a3008"') + A.quadZ(c, 1.9, 2.62, 1.32, 1.98, D - 0.02, "#2a2f9e") +
    `<image href="${api.portrait()}" x="${px0}" y="${py0}" width="${px1 - px0}" height="${py1 - py0}" preserveAspectRatio="xMidYMid slice"/>`);
  // side table + memorial candle under the portrait
  s += A.shadow(c, 2.0, 2.5, 3.0, 3.35) + A.box(c, 2.0, 2.5, 0, 0.62, 3.0, 3.4, { front: "url(#cherry)", top: "#9a3a1c", side: "#4a1408" });
  s += hot("candle", A.box(c, 2.18, 2.3, 0.62, 0.8, 3.12, 3.22, { front: "#f8f0e0", top: "#fffaf0", side: "#e0d4bc" }) +
    (() => { const [fx, fy] = c(2.24, 0.86, 3.17); return `<ellipse class="flame" cx="${fx}" cy="${fy}" rx="2.4" ry="5" fill="#ffcc40"/><ellipse cx="${fx}" cy="${fy}" rx="14" ry="14" fill="#ffd060" opacity=".25" filter="url(#glow)"/>`; })());
  // speakers
  s += A.shadow(c, -1.9, -1.6, 2.95, 3.3) + hot("speakers", A.speaker(c, -1.9, -1.6, 0, 1.0, 2.98) + A.speaker(c, 1.6, 1.9, 0, 1.0, 2.98));
  // the cherry wall unit
  const zU = 3.05;
  s += A.shadow(c, -1.5, 1.5, 3.0, 3.5, 0.5);
  s += A.box(c, -1.45, 1.45, 2.22, 2.4, zU, D, { front: "url(#cherry)", top: "#8a2a14", side: "#4a1408", bottom: "#3a0a04" });
  s += A.box(c, -1.45, -0.62, 0, 2.22, zU, D, { front: "url(#cherryV)", side: "#4a1408" });
  s += A.box(c, 0.62, 1.45, 0, 2.22, zU, D, { front: "url(#cherryV)", side: "#4a1408" });
  s += A.quadZ(c, -0.62, 0.62, 0, 2.22, D - 0.01, "#3a0c04");
  // glass shelves in the side towers, with books and keepsakes
  [-1.04, 1.04].forEach((xc, side) => {
    s += A.quadZ(c, xc - 0.34, xc + 0.34, 0.95, 2.1, zU - 0.001, "#2a0804");
    s += A.wallGlow(c(xc, 1.9, zU)[0], c(xc, 1.9, zU)[1], 22, 14, "#fff2c8", 0.35);
    [1.0, 1.55].forEach(y => (s += A.box(c, xc - 0.34, xc + 0.34, y, y + 0.025, zU - 0.02, zU + 0.25, { front: "url(#glass)", top: "rgba(200,230,255,.4)" })));
    for (let b = 0; b < 6; b++) s += A.book(c, xc - 0.3 + b * 0.075, xc - 0.235 + b * 0.075, 1.025, 1.32 + (b % 3) * 0.04, zU + 0.04, ["#1a3a6a", "#7a1a1a", "#2a5a2a", "#c8a030", "#3a2a5a", "#8a5a2a"][(b + side * 2) % 6]);
    s += side ? A.globe(c, xc + 0.1, 1.575, zU + 0.1, 0.13) : `<g>${A.box(c, xc - 0.12, xc + 0.06, 1.575, 1.9, zU + 0.06, zU + 0.18, { front: "#1a5a8a", top: "#3a8aba", side: "#0a3a5a" })}</g>`;
    s += A.box(c, xc - 0.34, xc + 0.34, 0.12, 0.85, zU - 0.002, zU + 0.01, { front: "url(#cherry)" });
    s += A.quadZ(c, xc - 0.3, xc + 0.3, 0.16, 0.81, zU - 0.012, "rgba(0,0,0,.15)", 'stroke="#c88a50" stroke-width=".6"');
  });
  // stereo + TV in the centre niche
  s += hot("stereo", A.stereo(c, -0.45, 0.45, 0.22, 0.86, zU + 0.05));
  s += hot("tv", A.tv(c, -0.58, 0.58, 0.98, 1.92, zU + 0.02, 0.4, { screenId: "tvScreen" }) + tvOverlay(api, c, zU));
  // clock on the wall above the unit
  s += hot("clock", A.clock(c, 0, 2.58, D - 0.01, 0.15));
  // rug, coffee table and everything on it
  s += A.quadY(c, -1.7, 1.7, 0.55, 2.55, 0.003, "url(#persian)", 'opacity=".95"') + A.quadY(c, -1.7, 1.7, 0.55, 2.55, 0.004, "none", 'stroke="#c8963a" stroke-width="2"');
  s += A.shadow(c, -1.05, 1.05, 0.95, 1.75, 0.5);
  [[-0.95, 0.95], [0.9, 0.95], [-0.95, 1.65], [0.9, 1.65]].forEach(([x, z]) => (s += A.box(c, x, x + 0.06, 0, 0.4, z, z + 0.06, { front: "#3a0c04", side: "#2a0802" })));
  s += A.box(c, -1.0, 1.0, 0.4, 0.46, 0.9, 1.75, { front: "url(#cherry)", top: "url(#cherry)", side: "#4a1408" });
  s += A.quadY(c, -0.98, 0.98, 0.92, 1.73, 0.461, "rgba(255,230,200,.12)");
  s += hot("fax", A.fax(c, -0.6, 0.46, 1.05));
  s += hot("phone", A.phone(c, -0.12, 0.46, 1.2));
  s += hot("remote", A.remote(c, 0.22, 0.46, 1.0));
  s += hot("task", A.laptop(c, 0.62, 0.46, 1.05, { screen: "#0a4a8a" }) + (() => { const [x, y] = c(0.62, 0.62, 1.33); return `<text x="${x}" y="${y}" font-size="9" font-family="Arial" font-weight="bold" fill="#fff" text-anchor="middle">TASK</text>`; })());
  // registration box on the floor, front right
  s += A.shadow(c, 1.55, 2.3, 0.6, 1.15, 0.5);
  s += hot("register", A.box(c, 1.55, 2.3, 0, 0.55, 0.6, 1.1, { front: "url(#beige)", top: "#f4eedc", side: "#a89e84", stroke: "#6a6450", sw: 0.6 }) +
    A.quadZ(c, 1.62, 1.95, 0.08, 0.47, 0.599, "#0a66c2") + A.label(c, 1.785, 0.22, 0.598, "in", { size: 0.22, fill: "#fff", family: "Arial Black, Arial" }) +
    A.label(c, 2.12, 0.38, 0.598, "REGISTER", { size: 0.06, fill: "#3a3628" }) + A.label(c, 2.12, 0.28, 0.598, "with Dom", { size: 0.055, fill: "#3a3628", weight: "normal" }) +
    A.quadY(c, 1.9, 1.95, 0.6, 1.1, 0.552, "#c8b88a"));
  // the cat on the rug, and (after the symbols) a travelling merchant by the Info Room door
  s += hot("cat", A.cat(150, 420, 0.95, CATS[2] || {}));
  if (api.arg.step >= 3) s += hot("khajiit", merchantCat(70, 392));
  return svg(s, `<radialGradient id="laser" cx=".5" cy=".4" r=".7"><stop offset="0" stop-color="#9ff3ff"/><stop offset=".35" stop-color="#3f8fe0"/><stop offset="1" stop-color="#120a36"/></radialGradient>`);
}
function tvOverlay(api, c, zU) {
  const [x0, y0] = c(-0.52, 1.86, zU + 0.015), [x1, y1] = c(0.42, 1.04, zU + 0.015);
  const msg = api.arg.step === 2 ? "You decide to click the symbols." : "";
  return `<g id="tvText" pointer-events="none">${msg ? `<rect x="${x0}" y="${y0}" width="${x1 - x0}" height="${y1 - y0}" fill="#0a1a10"/><text x="${(x0 + x1) / 2}" y="${(y0 + y1) / 2}" font-size="8" font-family="monospace" fill="#5f5" text-anchor="middle">${msg}</text>` : ""}</g>`;
}
function merchantCat(x, y) {
  return `<g transform="translate(${x} ${y})"><ellipse cx="0" cy="28" rx="26" ry="5" fill="#000" opacity=".35" filter="url(#blur2)"/><path d="M-16 26 q-4 -30 16 -34 q20 4 16 34z" fill="#c8a070"/><circle cx="0" cy="-14" r="12" fill="#c8a070"/><path d="M-11 -20 l-3 -12 9 7z M11 -20 l3 -12 -9 7z" fill="#c8a070" stroke="#7a5a3a" stroke-width=".8"/>
    <circle cx="-4.5" cy="-15" r="2" fill="#2a6a2a"/><circle cx="4.5" cy="-15" r="2" fill="#2a6a2a"/><path d="M-14 -4 q14 10 28 0 v8 q-14 8 -28 0z" fill="#6a2a8a"/><path d="M-16 4 h32 v4 h-32z" fill="#c9a54a"/><circle cx="14" cy="16" r="6" fill="#8a5a1a" stroke="#c9a54a"/><text x="14" y="19" font-size="7" text-anchor="middle" fill="#ffd700">$</text></g>`;
}

// ---------------------------------------------------------------- Info Room
function info(api) {
  if (R.has("v35_info")) {
    const sq = R.anchor("v35_info", "symbols"), sb = sq && R.quadBox(sq);
    const sym = api.arg.step >= 3 && sb ? `<rect x="${sb.x}" y="${sb.y}" width="${sb.w}" height="${sb.h}" fill="#0a3a1a"/><text x="${sb.cx}" y="${sb.cy + sb.h * 0.25}" font-size="${sb.h * 0.7}" text-anchor="middle" fill="#5f5" font-family="serif">☉ ☽ ♄ ♃ ☿</text>` : "";
    return svg(R.scene("v35_info", { overlays: R.clockHands(R.anchor("v35_info", "clock")) + sym }));
  }
  return infoSVG(api);
}
function infoSVG(api) {
  const c = cam(), Wd = 3, D = 3.5, Hh = 2.8;
  const back = A.lingrad([[0, "#e8e2d4"], [1, "#c4baa4"]]), side = A.lingrad([[0, "#d8d0bc"], [1, "#a89e88"]], 1, 0), sideR = A.lingrad([[0, "#a89e88"], [1, "#d8d0bc"]], 1, 0);
  const ceil = A.lingrad([[0, "#bcb4a0"], [1, "#ece6d8"]]), floor = A.lingrad([[0, "#9a5a2a"], [1, "#5a2a10"]]);
  let s = back.def + side.def + sideR.def + ceil.def + floor.def;
  s += A.shell(c, { W: Wd, H: Hh, D, back: back.id, left: side.id, right: sideR.id, floor: floor.id, ceil: ceil.id, floorLines: 16, floorJoints: 5 });
  // left: a hallway lined with framed tutorials, leading back to the Living Room
  const hall = [c(-Wd, 0, 1.6), c(-Wd, 2.3, 1.6), c(-Wd, 2.3, 3.4), c(-Wd, 0, 3.4)];
  s += hot("door-living", A.poly(hall, "#f0e6cc") + A.poly([c(-Wd, 0, 1.6), c(-Wd, 0, 3.4), c(-Wd - 3, 0, 3.4), c(-Wd - 3, 0, 1.6)], "#8a4a20") +
    `<polyline points="${A.pts(hall)}" fill="none" stroke="#5a1a08" stroke-width="3"/>` + A.wallGlow(c(-Wd, 1.2, 2.5)[0] + 8, c(-Wd, 1.2, 2.5)[1], 30, 70, "#fff", 0.5));
  // tutorial gallery on the back wall, left of the cherry unit
  const tuts = [["tut-mouse", "🖱️"], ["tut-overview", "🎞️"], ["tut-about", "📄"], ["tut-media", "🎵"]];
  tuts.forEach(([k, g], i) => {
    const x = -2.6 + (i % 2) * 0.5, y = 1.55 - Math.floor(i / 2) * 0.62;
    const [tx, ty] = c(x + 0.2, y + 0.24, D - 0.02);
    s += hot(k, A.quadZ(c, x, x + 0.4, y, y + 0.5, D - 0.01, "#1a1a1a", 'stroke="#c9a54a" stroke-width="1.5"') + A.quadZ(c, x + 0.04, x + 0.36, y + 0.04, y + 0.46, D - 0.015, "#f4f0e4") +
      `<text x="${tx}" y="${ty}" font-size="17" text-anchor="middle" dominant-baseline="middle">${g}</text>`);
  });
  s += A.label(c, -2.2, 2.25, D - 0.02, "TUTORIALS", { size: 0.1, fill: "#5a1a08", family: "Georgia, serif" });
  // the ARG plaque of symbols, in the hall gallery
  const sy = A.quadZ(c, -2.5, -1.9, 0.35, 0.6, D - 0.01, api.arg.step >= 3 ? "#0a3a1a" : "#2a2418", 'stroke="#8a7a50" stroke-width="1.2"');
  const [sx, syy] = c(-2.2, 0.45, D - 0.02);
  s += hot("symbols", sy + `<text x="${sx}" y="${syy}" font-size="11" text-anchor="middle" fill="${api.arg.step >= 3 ? "#5f5" : "#c8b87a"}" font-family="serif">☉ ☽ ♄ ♃ ☿</text>`);
  // centre: the cherry-red display wall of online services, clock on top
  const zW = 3.15;
  s += A.shadow(c, -1.5, 1.5, 3.1, 3.5, 0.5) + A.box(c, -1.5, 1.5, 0, 2.6, zW, D, { front: "url(#cherryV)", side: "#4a1408" });
  s += A.wallGlow(c(0, 2.1, zW)[0], c(0, 2.1, zW)[1], 120, 60, "#ffd8a0", 0.25);
  s += hot("clock", A.clock(c, 0, 2.32, zW - 0.01, 0.17));
  const ON = [
    ["svc-linkedin", { color: "#0a66c2", color2: "#02284a", title: "LinkedIn Online", glyph: "💼" }], ["svc-github", { color: "#24292e", color2: "#000", title: "GitHub Service", glyph: "🐙" }], ["svc-mail", { color: "#c8a01a", color2: "#5a4000", title: "Mail Dom", glyph: "✉️" }],
    ["svc-oldsite", { color: "#0a3a0a", color2: "#000", title: "Old Homepage", glyph: "📟" }], ["svc-net", { color: "#1a5ab8", color2: "#0a1a4a", title: "Internet in a Box", glyph: "🌐" }], ["svc-arcade", { color: "#5a0a8a", color2: "#1a0030", title: "404 Arcade", glyph: "👾" }]
  ];
  [1.55, 0.85].forEach((y, row) => {
    s += A.box(c, -1.35, 1.35, y - 0.04, y, zW - 0.18, zW, { front: "#f4f0e6", top: "#fffaf0" });
    for (let i = 0; i < 3; i++) { const [k, o] = ON[row * 3 + i], x = -1.1 + i * 0.8; s += hot(k, A.softbox(c, x, x + 0.5, y, y + 0.58, zW - 0.12, { ...o, d: 0.08 })); }
  });
  s += hot("reel", (() => { const [x, y] = c(-0.95, 0.48, zW - 0.05), R = 18; return `<circle cx="${x}" cy="${y}" r="${R}" fill="#555" stroke="#222" stroke-width="2"/>${[0, 1, 2, 3, 4].map(i => `<circle cx="${x + Math.cos(i * 1.256) * R * 0.55}" cy="${y + Math.sin(i * 1.256) * R * 0.55}" r="${R * 0.22}" fill="#222"/>`).join("")}<circle cx="${x}" cy="${y}" r="3" fill="#ddd"/>`; })());
  s += A.box(c, -1.35, 1.35, 0.25, 0.29, zW - 0.18, zW, { front: "#f4f0e6", top: "#fffaf0" });
  // doorway to the Software Room (right wall)
  const doorR = [c(Wd, 0, 1.75), c(Wd, 2.15, 1.75), c(Wd, 2.15, 2.65), c(Wd, 0, 2.65)];
  s += hot("door-software", A.poly(doorR, "#3a4a7a") + A.poly([c(Wd, 0.6, 1.95), c(Wd, 0.6, 2.45), c(Wd, 1.6, 2.45), c(Wd, 1.6, 1.95)], "#c9a54a", 'opacity=".5"') + `<polyline points="${A.pts(doorR)}" fill="none" stroke="#5a1a08" stroke-width="3"/>`);
  // right: the bookcase of manuals, against the back wall → Electronic Documents
  const zB = 3.0;
  s += A.shadow(c, 1.62, 2.92, 2.95, 3.45, 0.5);
  s += hot("manuals", A.box(c, 1.62, 2.92, 0, 2.45, zB, D, { front: "url(#cherryV)", side: "#4a1408", top: "#5a1a08" }) +
    [0.15, 0.75, 1.35, 1.95].map((y, r) => A.quadZ(c, 1.7, 2.84, y, y + 0.48, zB - 0.001, "#2a0804") + Array.from({ length: 11 }, (_, b) => A.book(c, 1.72 + b * 0.1, 1.81 + b * 0.1, y, y + 0.38 + ((b * 7 + r) % 3) * 0.03, zB + 0.05, ["#1a3a8a", "#2a4aa0", "#3a5ab8", "#0a2a6a", "#7a1a1a"][(b + r) % 5], "", { d: 0.25 })).join("")).join("") +
    A.label(c, 2.27, 2.5, zB - 0.01, "MANUALS", { size: 0.09, fill: "#5a1a08", family: "Georgia, serif" }));
  // rug of stars, glass table, the QUESTIONS book and the notebook
  s += A.quadY(c, -1.8, 1.6, 0.4, 2.6, 0.003, "url(#carpetStars)");
  s += A.shadow(c, -0.9, 0.9, 0.9, 1.6, 0.35);
  [[-0.85, 0.95], [0.8, 0.95], [-0.85, 1.55], [0.8, 1.55]].forEach(([x, z]) => (s += A.box(c, x, x + 0.05, 0, 0.42, z, z + 0.05, { front: "#8a2a14", side: "#5a1408" })));
  s += A.box(c, -0.92, 0.92, 0.42, 0.45, 0.9, 1.65, { front: "url(#glass)", top: "url(#glass)" });
  s += hot("questions", A.box(c, -0.6, -0.15, 0.45, 0.52, 1.05, 1.4, { front: "#2a3a8a", top: "#3a4aa0", side: "#1a2a6a" }) + A.label(c, -0.375, 0.53, 1.2, "QUESTIONS", { size: 0.055, fill: "#f0e090" }));
  s += hot("task", A.laptop(c, 0.45, 0.45, 1.05, { screen: "#3a6a9a" }));
  return svg(s);
}

// ---------------------------------------------------------------- Software Room
const PER35 = () => (R.has("v35_software") ? 12 : 9);
function software(api) {
  if (!R.has("v35_software")) return softwareSVG(api);
  const st = api.state.sw || (api.state.sw = { cat: CATS35[0], page: 0 });
  const items = SOFTWARE.filter(x => x.c35 === st.cat), per = 12, pages = Math.max(1, Math.ceil(items.length / per));
  st.page = Math.min(st.page, pages - 1);
  const room = "v35_software", an = k => R.anchor(room, k);
  let ov = "";
  CATS35.forEach((cat, i) => {
    const q = an("cat" + i); if (!q) return;
    const b = R.quadBox(q), on = cat === st.cat;
    ov += `${on ? `<rect x="${b.x - 3}" y="${b.y - 2}" width="${b.w * 1.2}" height="${b.h + 4}" fill="#f8e8a0" opacity=".22"/>` : ""}<text x="${b.x + 4}" y="${b.cy + 4}" font-size="${Math.min(12, b.h * 0.42, b.w / (cat.length * 0.58))}" font-family="Arial" font-weight="bold" fill="${on ? "#fff4c0" : "#f2dcc0"}" stroke="#2a0802" stroke-width=".6" paint-order="stroke">${A.esc(cat)}</text>
      <circle cx="${b.x + b.w * 1.109}" cy="${b.cy}" r="3.4" fill="${on ? "#ff3030" : "#4a0a0a"}"/>${on ? `<circle cx="${b.x + b.w * 1.109}" cy="${b.cy}" r="8" fill="#ff4040" opacity=".35" filter="url(#blur2)"/>` : ""}`;
  });
  const shown = items.slice(st.page * per, st.page * per + per);
  const extra = shown.map((it, i) => ({ k: "sw-" + SOFTWARE.indexOf(it), svg: R.softbox(an("slot" + i), it, i) }));
  const pl = an("pageLbl"), pb = pl && R.quadBox(pl);
  if (pb) ov += `<text x="${pb.cx}" y="${pb.cy + 4}" font-size="10" fill="#f0d8a0" text-anchor="middle" font-family="Arial">page ${st.page + 1} of ${pages}</text>`;
  const hidden = [];
  if (st.page === 0) hidden.push("prev");
  if (st.page >= pages - 1) hidden.push("next");
  return svg(R.scene(room, { overlays: ov, extraHots: extra, hidden }));
}
function softwareSVG(api) {
  const st = api.state.sw || (api.state.sw = { cat: CATS35[0], page: 0 });
  const items = SOFTWARE.filter(x => x.c35 === st.cat), per = 9, pages = Math.max(1, Math.ceil(items.length / per));
  st.page = Math.min(st.page, pages - 1);
  const c = cam(), Wd = 3, D = 3.5, Hh = 2.8;
  const back = A.lingrad([[0, "#dfe4ea"], [1, "#b4bcc8"]]), side = A.lingrad([[0, "#cdd4de"], [1, "#9aa2b0"]], 1, 0), sideR = A.lingrad([[0, "#9aa2b0"], [1, "#cdd4de"]], 1, 0);
  const ceil = A.lingrad([[0, "#b8bcc4"], [1, "#e6e8ec"]]), floor = A.lingrad([[0, "#a06a3a"], [1, "#5a3218"]]);
  let s = back.def + side.def + sideR.def + ceil.def + floor.def;
  s += A.shell(c, { W: Wd, H: Hh, D, back: back.id, left: side.id, right: sideR.id, floor: floor.id, ceil: ceil.id, floorLines: 16, floorJoints: 6 });
  s += A.wallGlow(330, 170, 200, 90, "#fff8e0", 0.4);
  // doorways: left → Info Room, right → Living Room
  const doorL = [c(-Wd, 0, 2.2), c(-Wd, 2.15, 2.2), c(-Wd, 2.15, 3.2), c(-Wd, 0, 3.2)], doorR = [c(Wd, 0, 2.2), c(Wd, 2.15, 2.2), c(Wd, 2.15, 3.2), c(Wd, 0, 3.2)];
  s += hot("door-info", A.poly(doorL, "#7a1a0a") + `<polyline points="${A.pts(doorL)}" fill="none" stroke="#f4f4f4" stroke-width="3"/>`);
  s += hot("door-living", A.poly(doorR, "#d8c4a0") + `<polyline points="${A.pts(doorR)}" fill="none" stroke="#f4f4f4" stroke-width="3"/>`);
  // category drawers (a tall oak chest, left)
  const zC = 2.25;
  s += A.shadow(c, -2.8, -1.5, zC, zC + 0.55) + A.box(c, -2.8, -1.5, 0, 2.38, zC, zC + 0.55, { front: "url(#oak)", top: "#c89a5a", side: "#7a5428" });
  CATS35.forEach((cat, i) => {
    const y1 = 2.3 - i * 0.32, y0 = y1 - 0.28, on = cat === st.cat;
    const [lx, ly] = c(-2.72, (y0 + y1) / 2, zC - 0.01);
    s += hot("cat-" + i, A.quadZ(c, -2.76, -1.54, y0, y1, zC - 0.005, on ? "#f8e8a0" : "url(#oak)", `stroke="#5a3a18" stroke-width="1"`) +
      `<text x="${lx}" y="${ly + 4}" font-size="10.5" font-family="Arial" font-weight="bold" fill="${on ? "#5a1a08" : "#2a1a08"}">${A.esc(cat)}</text>` +
      A.box(c, -1.66, -1.6, (y0 + y1) / 2 - 0.05, (y0 + y1) / 2 + 0.05, zC - 0.04, zC - 0.005, { front: "#c9a54a", side: "#8a6a20" }));
  });
  // the shelves on the back wall
  const zS = 3.0, X0 = -1.3, X1 = 1.75;
  s += A.quadY(c, -1.6, 1.9, 0.6, 2.7, 0.003, "#3a4a6a", 'opacity=".55"');
  s += A.shadow(c, X0, X1, 2.95, 3.5, 0.5);
  s += A.box(c, X0 - 0.08, X1 + 0.08, 0, 2.45, zS, D, { front: "url(#walnut)", side: "#22120a", top: "#3a2010" });
  s += A.quadZ(c, X0, X1, 0.32, 2.35, zS - 0.001, "#1a0c06");
  s += A.wallGlow(c(0.2, 2.1, zS)[0], c(0.2, 2.1, zS)[1], 130, 30, "#fff2c8", 0.35);
  const rows = [1.7, 1.06, 0.42];
  rows.forEach(y => (s += A.box(c, X0, X1, y - 0.04, y, zS - 0.05, D, { front: "#5a3a20", top: "#7a5030" })));
  items.slice(st.page * per, st.page * per + per).forEach((it, i) => {
    const r = Math.floor(i / 3), col = i % 3, x = X0 + 0.12 + col * 1.0, y = rows[r];
    s += hot("sw-" + SOFTWARE.indexOf(it), A.softbox(c, x, x + 0.78, y, y + 0.58, zS + 0.04, { color: it.color, color2: it.color2, title: it.title, glyph: it.glyph }));
  });
  s += A.label(c, 0.22, 2.33, zS - 0.01, st.cat.toUpperCase(), { size: 0.1, fill: "#f0d890", family: "Georgia, serif" });
  s += A.plant(c, 2.3, 3.05, 1.2);  // prev · + · next along the bottom of the shelves
  const btn = (k, x, txt, dis) => { const [bx, by] = c(x, 0.17, zS - 0.01); return hot(k, `<rect x="${bx - 13}" y="${by - 9}" width="26" height="18" rx="3" fill="${dis ? "#4a3a2a" : "#c9a54a"}" stroke="#2a1a08"/><text x="${bx}" y="${by + 5}" font-size="13" font-weight="bold" text-anchor="middle" fill="${dis ? "#7a6a5a" : "#2a1a08"}">${txt}</text>`); };
  s += btn("prev", -0.35, "◀", st.page === 0) + btn("install", 0.2, "+", false) + btn("next", 0.75, "▶", st.page >= pages - 1);
  const [pgx, pgy] = c(1.5, 0.15, zS - 0.01);
  s += `<text x="${pgx}" y="${pgy}" font-size="8" fill="#c8b890" text-anchor="middle" font-family="Arial">page ${st.page + 1} of ${pages}</text>`;
  // the trash can (retired software lives here)
  s += hot("trash", A.trashcan(c, 2.35, 1.7, { color: "#5a6a7a", h: 0.55, r: 0.2 }));
  return svg(s);
}

// ---------------------------------------------------------------- Map: a dollhouse cut-away
function map(api) {
  const room = (k, x, y, w, hh, fill, name, deco = "") => hot("map-" + k, `<rect x="${x}" y="${y}" width="${w}" height="${hh}" fill="${fill}" stroke="#3a2a1a" stroke-width="3"/>${deco}<rect x="${x}" y="${y + hh - 10}" width="${w}" height="10" fill="#8a5a2a"/><text x="${x + w / 2}" y="${y + 22}" font-family="Georgia,serif" font-size="15" font-weight="bold" text-anchor="middle" fill="#2a1a08">${name}</text>` + (api.current === k ? "" : ""));
  let s = `<rect width="640" height="480" fill="url(#mapSky)"/><circle cx="560" cy="80" r="26" fill="#fff6c0" opacity=".9"/>`;
  s += `<path d="M0 400 Q160 380 320 392 T640 386 V480 H0Z" fill="#4a8a3a"/><path d="M0 420 Q200 405 400 415 T640 410 V480 H0Z" fill="#3a7a2a"/>`;
  s += `<path d="M90 190 L320 70 L550 190 Z" fill="#a83a2a" stroke="#3a1a0a" stroke-width="4"/><rect x="430" y="88" width="34" height="60" fill="#8a4a3a" stroke="#3a1a0a" stroke-width="3"/>`;
  s += room("kidspace", 230, 128, 180, 70, "#2a1a5a", "", `<text x="320" y="160" font-family="Georgia,serif" font-size="15" font-weight="bold" text-anchor="middle" fill="#ffd8ff">Ark KidSpace</text><text x="320" y="182" font-size="14" text-anchor="middle">🚀 ⭐ 🪐</text>`);
  s += `<rect x="100" y="200" width="440" height="200" fill="#e8dcc0" stroke="#3a2a1a" stroke-width="4"/>`;
  s += room("info", 108, 208, 140, 184, "#e8c8a0", "Info Room", `<rect x="140" y="250" width="76" height="80" fill="#8a2a14"/>${[0, 1, 2].map(i => `<rect x="${148 + i * 22}" y="262" width="16" height="22" fill="${["#0a66c2", "#24292e", "#c8a01a"][i]}"/>`).join("")}<rect x="130" y="350" width="96" height="24" fill="#1a2a8a" opacity=".8"/>`);
  s += room("living", 252, 208, 140, 184, "#f2e6cc", "Living Room", `<rect x="282" y="250" width="80" height="90" fill="#7a2414"/><rect x="298" y="262" width="48" height="34" fill="#111"/><rect x="290" y="355" width="64" height="16" fill="#9a3a1c"/><circle cx="322" cy="242" r="7" fill="#fff" stroke="#3a2a1a"/>`);
  s += room("software", 396, 208, 136, 184, "#d8dce4", "Software Room", `<rect x="414" y="245" width="100" height="100" fill="#3a2010"/>${[0, 1, 2].map(r => [0, 1, 2].map(cc => `<rect x="${422 + cc * 32}" y="${252 + r * 32}" width="22" height="26" fill="${["#c83a2a", "#2a6ad0", "#3aa03a", "#e8a01a", "#8a3ad0"][(r * 3 + cc) % 5]}"/>`).join("")).join("")}`);
  s += hot("map-manuals", `<rect x="196" y="290" width="40" height="70" fill="#5a1a08" stroke="#2a0a02" stroke-width="2"/>${[0, 1, 2].map(r => `<rect x="200" y="${296 + r * 21}" width="32" height="16" fill="#2a4aa0"/>`).join("")}`);
  s += `<text x="320" y="432" font-family="Georgia,serif" font-size="16" text-anchor="middle" fill="#fff" stroke="#1a3a1a" stroke-width=".6">Click a room to go there.</text>`;
  return `<svg viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">${A.defs(`<linearGradient id="mapSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a6ac8"/><stop offset="1" stop-color="#bfe0ff"/></linearGradient>`)}${s}</svg>`;
}

// ---------------------------------------------------------------- the version
const hots = {
  living: {
    "door-info": { cap: "Doorway to the Info Room", info: "This doorway leads to Navigator's Info Room, where the tutorials, manuals and online services are kept. Click the doorway to go there.", act: { room: "info" } },
    "door-software": { cap: "Doorway to the Software Room", info: "This doorway leads to the Software Room. Its shelves hold every program on this computer.", act: { room: "software" } },
    tv: { cap: "Television", info: "Turns on the TV. Channel 3 is a short program about Dominic.", act: api => (api.arg.step === 2 ? api.caption("The screen reads: “You decide to click the symbols.”", 6000) : api.panel("about")) },
    stereo: { cap: "Stereo: CD and MIDI player", info: "Plays music. Click to open the Media Controller and pick a track.", act: api => api.mediaController() },
    speakers: { cap: "Speakers", info: "Click the speakers to turn the sound on or off.", act: api => api.toggleSound() },
    clock: { cap: "Clock", info: "Shows the time. Click it to see today's date.", act: api => api.caption("Today is " + new Date().toLocaleDateString([], { weekday: "long", year: "numeric", month: "long", day: "numeric" }) + ".", 5000) },
    task: { cap: "Notebook computer (Task Jumper)", info: "The notebook computer opens the Task Jumper: a quick list of everything you can do, grouped by category.", act: api => api.taskJumper() },
    fax: { cap: "Fax machine", info: "Send Dom a message. Opens the mail composer.", act: { open: "tk-mailto" } },
    phone: { cap: "Phone", info: "Click here to go to the phone. You can dial numbers… or words.", act: { panel: "phone" } },
    remote: { cap: "Remote control", info: "The remote control gives access to the home electronics: the stereo, the TV and the speakers.", act: api => api.mediaController() },
    register: { cap: "Registration box: register with Dom (LinkedIn)", info: "Register with Dominic to receive service and support. (It opens his LinkedIn profile.)", act: { open: "linkedin" } },
    portrait: { cap: "Family portrait", info: "Picture day, 1996. Dad, Mom, the big sister, two big brothers, Dominic — and the cats who ran the house.", act: { panel: "family" } },
    candle: { cap: "Memorial candle", info: "A candle that's always lit. In loving memory.", act: { panel: "remembrance" } },
    cat: { cap: (CATS[2] || {}).name || "The cat", info: "Purrrr. She's asleep. Mostly.", act: api => { api.sfx.purr(); api.caption("…purrrrrrr.", 2500); } },
    khajiit: { cap: "A travelling merchant cat", info: "Khajiit has wares, if you have coin.", act: { panel: "khajiit" }, hidden: api => api.arg.step < 3 }
  },
  info: {
    "door-living": { cap: "Hallway to the Living Room", info: "You can click on this doorway to enter Navigator's Living Room.", act: { room: "living" } },
    "door-software": { cap: "Doorway to the Software Room", info: "This doorway leads to the Software Room.", act: { room: "software" } },
    "tut-mouse": { cap: "Tutorial: Using Your Mouse", info: "A two-minute lesson on moving, clicking, double-clicking and dragging.", act: api => api.mouseTutorial() },
    "tut-overview": { cap: "Tutorial: Navigator Overview", info: "A short tour of the house and what's in each room.", act: api => api.overview() },
    "tut-about": { cap: "Tutorial: Getting Started (About Dom)", info: "Why this site exists — the note Dom left on the desktop.", act: { open: "about" } },
    "tut-media": { cap: "Tutorial: Using Your Home Electronics", info: "Opens the Media Controller, which runs the stereo.", act: api => api.mediaController() },
    symbols: { cap: "A plaque of strange symbols", info: "“c u r i o s i t y is the lust of the mind”", act: api => symbolsClick(api) },
    clock: { cap: "Clock", info: "Shows the time.", act: api => api.caption("It's " + new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }) + ".", 4000) },
    "svc-linkedin": { cap: "LinkedIn Online", info: "Join Dom's professional network. Opens his LinkedIn profile.", act: { open: "linkedin" } },
    "svc-github": { cap: "GitHub Service", info: "Dom's code, out in the open.", act: api => window.open(PROFILE.github, "_blank", "noopener") },
    "svc-mail": { cap: "Mail Dom", info: "Write an email. Opens the mail composer tool.", act: { open: "tk-mailto" } },
    "svc-oldsite": { cap: "The old homepage", info: "The green-screen homepage this site used to be.", act: { open: "oldsite" } },
    "svc-net": { cap: "Internet in a Box", info: "Get on the Internet: LinkedIn, GitHub and more.", act: api => api.internet() },
    "svc-arcade": { cap: "404 Arcade", info: "Every way to get lost on this site, in one machine.", act: { open: "arcade" } },
    reel: { cap: "Navigator Overview (film reel)", info: "Plays the Navigator overview.", act: api => api.overview() },
    manuals: { cap: "Electronic Documents: the manuals", info: "Holds the manuals: certifications, volunteering, career, and some additional reading.", act: { room: "manuals" } },
    questions: { cap: "QUESTIONS", info: "Answers to common questions about this house.", act: api => faq(api) },
    task: { cap: "Notebook computer (Task Jumper)", info: "Opens the Task Jumper.", act: api => api.taskJumper() }
  },
  software: {
    "door-info": { cap: "Doorway to the Info Room", info: "This doorway leads to the Info Room.", act: { room: "info" } },
    "door-living": { cap: "Doorway to the Living Room", info: "This doorway leads back to the Living Room.", act: { room: "living" } },
    prev: { cap: "Previous shelves", info: "Returns you to the previous set of software shelves.", act: api => { const s = api.state.sw; if (s.page > 0) { s.page--; api.go("software", { quiet: true }); } } },
    next: { cap: "More shelves", info: "This button lets you see additional shelves in this category.", act: api => { const s = api.state.sw, n = SOFTWARE.filter(x => x.c35 === s.cat).length; if ((s.page + 1) * PER35() < n) { s.page++; api.go("software", { quiet: true }); } } },
    install: { cap: "Add software", info: "To install new software, click the + button, then follow the simple instructions.", act: api => install(api) },
    trash: { cap: "Trash can: retired software", info: "Holding retired software. Click to read what used to be on these shelves.", act: api => retired(api) }
  },
  map: {
    "map-living": { cap: "This room is Navigator's Living Room, where the home electronics are kept. Click to enter.", act: { room: "living" } },
    "map-info": { cap: "Click here to go to the Navigator's Info Room.", act: { room: "info" } },
    "map-software": { cap: "Click here to go to Navigator's Software Room.", act: { room: "software" } },
    "map-kidspace": { cap: "Click here to go to Kidspace.", act: { room: "kidspace" } },
    "map-manuals": { cap: "The bookcase of Electronic Documents.", act: { room: "manuals" } }
  }
};
CATS35.forEach((cat, i) => (hots.software["cat-" + i] = { cap: cat, info: CAT_INFO[cat], act: api => { api.state.sw = { cat, page: 0 }; api.sfx.drawer(); api.go("software", { quiet: true }); } }));
SOFTWARE.forEach((it, i) => (hots.software["sw-" + i] = { cap: it.title, info: it.info, act: api => (it.open === "kidspace" ? api.go("kidspace") : api.launch(it.open)) }));

export function symbolsClick(api) {
  api.sfx.click();
  if (api.arg.step < 2) return api.caption("Strange symbols. They don't seem to do anything… yet.", 3500);
  if (api.arg.step >= 3) return api.caption("The symbols glow a calm green.", 3000);
  api.state.sym = (api.state.sym || 0) + 1;
  api.caption("The symbols flicker… (" + api.state.sym + ")", 1500);
  if (api.state.sym >= 10) { api.state.sym = 0; api.arg.symbolsDone(); api.go(api.current, { quiet: true }); }
}
export function faq(api) {
  const qs = [
    ["What is this?", "Dominic's personal website, dressed up as a 1990s family computer. This house is a tribute to Packard Bell Navigator, the friendly 'house' that came on family PCs in the mid-'90s."],
    ["How do I get around?", "Point at things to see what they are in the black bar at the bottom. Click to use them. Doorways take you to other rooms, and the house icon (3.5) or the room buttons take you anywhere."],
    ["What's the 'i' button?", "The InfoGuide. Turn it on, then click anything to hear what it does."],
    ["Where are Dom's apps?", "In the Software Room, on the shelves. Pick a category from the drawers on the left."],
    ["Is this the real Navigator?", "No. It's a fan-made homage with all-original artwork. Navigator was made by Ark Interface and Packard Bell; this site isn't affiliated with either."]
  ];
  const el = api.win({ title: "QUESTIONS", icon: "❓", w: 460, cls: "pan", html: `<div class="panel faq">${qs.map(([q, a]) => `<details><summary>${A.esc(q)}</summary><p>${A.esc(a)}</p></details>`).join("")}</div>` });
  void el;
}
function install(api) {
  api.msg("Add Software", "How would you like to add software to Navigator?<br><br><b>Add already installed software</b> lists everything on the dom 95 Start menu.<br><b>Install new software from disk</b> asks for Disk 1.", ["Already installed", "From disk…", "Cancel"], { icon: `<span class="mi">💿</span>`, w: 420 }).then(r => {
    if (r === 0) api.launch("toolbox");
    if (r === 1) api.msg("Install", "Please insert Disk 1 of 47 into drive A: and click OK.<br><br><i>(There's no disk. Everything Dom has made is already on the shelves.)</i>", ["OK"], { icon: `<span class="mi">💾</span>` });
  });
}
export function retired(api) {
  const el = api.win({ title: "Trash Can — retired software", icon: "🗑️", w: 480, h: 380, cls: "pan", html: `<div class="panel"><p class="hint">Apps Dom has retired. The programs are gone; these notes are all that's left. (They're also in the Recycle Bin on the desktop.)</p>${ARCHIVE.map(a => `<h3>${A.esc(a.title)} <small>· ${A.esc(a.cat)}</small></h3><p>${A.esc(a.desc)}</p><p class="hint">Built with ${a.stack.map(A.esc).join(", ")}</p>`).join("")}</div>` });
  void el;
}

export const V35 = {
  id: "3.5", cls: "v35", W, H, home: "living", manuals: "manuals", smartTips: true, rightClickInfo: false, multiUser: false,
  roomKeys: ["living", "info", "software", "map", "kidspace"],
  rooms: {
    living: { name: "Living Room", caption: "The Living Room, where the home electronics are kept.", render: living, hots: hots.living, tipSpots: [[250, 352], [380, 360], [470, 420]] },
    info: { name: "Info Room", caption: "The Info Room holds tutorials, electronic manuals and online services.", render: info, hots: hots.info, tipSpots: [[300, 360], [200, 420]] },
    software: { name: "Software Room", caption: "The Software Room's shelves hold all of this computer's software.", render: software, hots: hots.software, tipSpots: [[520, 420]] },
    map: { name: "Map", caption: "The Map gives a quick view of the rooms in Navigator.", render: map, hots: hots.map, noTips: true },
    manuals: { name: "Electronic Documents", caption: "Just click on the book you need.", render: api => manualsRoomContent(api, "3.5"), get hots() { return manualViewer.hots; }, tipSpots: [[120, 420]] },
    kidspace: { ...kidspace, name: "Ark KidSpace" }
  },
  topHTML: I => `<div class="tb35"><button class="maptile" data-tool="map" data-label="Map">${I.map}</button><div class="ttl"><b>Navigator</b><span id="roomName"></span></div>
    <div class="tools">${["media", "windows", "exit", "key", "docs", "prefs", "phone", "run"].map(k => `<button class="tool" data-tool="${k}" data-label="${k}">${I[{ media: "media", windows: "windows", exit: "exit", key: "key", docs: "docs", prefs: "prefs", phone: "phone", run: "run" }[k]]}</button>`).join("")}</div></div>`,
  botHTML: I => `<div class="bb35"><button id="infoBtn" aria-label="InfoGuide">${I.info}</button><div id="caption" aria-live="polite"></div><button id="menuBtn">Menu</button></div>`,
  splashHTML: `<div class="spl35"><div class="logo"><svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="44" fill="#f8f4e8" stroke="#c9a54a" stroke-width="5"/><path d="M50 8 L58 50 L50 92 L42 50 Z" fill="#b5121b"/><path d="M8 50 L50 42 L92 50 L50 58 Z" fill="#1a2a6a"/><circle cx="50" cy="50" r="6" fill="#c9a54a"/></svg><div><b>Navigator</b><span>Version 3.5</span></div></div><p>A fan-made homage to the 1995 family-PC house. Click to begin.</p></div>`,
  welcomeLine: "Welcome to Navigator. To get started, choose one of the three options on the screen.",
  welcome(api, h) {
    return h(`<div class="welcome w35"><div class="wbox"><h2>Welcome to Navigator</h2><p>The simple way to learn and use this computer, and to find everything Dom has made. Choose one:</p>
      <button class="wopt" data-w="mouse" data-key="1"><span class="num">1</span><span><b>I'm new to computers.</b> Show me how to use the mouse.</span></button>
      <button class="wopt" data-w="overview" data-key="2"><span class="num">2</span><span><b>Show me around Navigator.</b> A short tour of the house.</span></button>
      <button class="wopt" data-w="nav" data-key="3"><span class="num">3</span><span><b>I know my way around.</b> Take me straight to the Living Room.</span></button>
      <label class="wchk"><input type="checkbox" id="wIntro" ${api.prefs.intro ? "checked" : ""}> Show this screen when Navigator starts</label></div></div>`);
  },
  envelope: (x, y) => A.envelope(x, y, 30),
  tips: [
    "Turn on the InfoGuide (the red “i” in the corner) and click anything to hear what it does.",
    "The Software Room's drawers sort Dom's programs into categories. Click a drawer to change the shelves.",
    "The house icon in the top-left corner is the Map. It's the fastest way to any room.",
    "Click the notebook computer on the coffee table for the Task Jumper: everything you can do, in one list.",
    "Navigator 3.9 is on the desktop too. Same house, two years later.",
    "Somebody has been reading one of the manuals in the Info Room a lot more than the others…",
    "Press the number keys 1–5 to jump between rooms.",
    "The stereo really plays. Try the Media Controller on the toolbar."
  ],
  overview: [
    { h: "Welcome to Navigator", p: "Navigator turns this computer into a house. Every room holds something different, and everything in a room does something when you click it.", glyph: "🏠" },
    { room: "living", h: "The Living Room", p: "Home base. The TV, stereo, phone and fax all work, the notebook computer opens the Task Jumper, and the box on the floor registers you with Dom (LinkedIn)." },
    { room: "info", h: "The Info Room", p: "Tutorials hang on the wall, online services sit on the shelves, and the bookcase holds the manuals: Dom's certifications, volunteering and more." },
    { room: "software", h: "The Software Room", p: "Every program Dom has made, boxed and shelved. Pick a category from the drawers, then click a box to start it." },
    { room: "map", h: "The Map", p: "Click the house icon in the top-left corner any time to see the whole house and jump to a room." },
    { room: "kidspace", h: "Ark KidSpace", p: "Upstairs is KidSpace, the fun place to work and play. Click the striped box for help." },
    { h: "The InfoGuide", p: "Not sure what something does? Turn on the InfoGuide with the red “i” in the bottom-left corner, then click on it.", glyph: "ℹ️" }
  ],
  tvClue(api) { if (api.current === "living") api.go("living", { quiet: true }); }
};

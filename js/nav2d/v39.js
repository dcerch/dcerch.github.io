// =====================================================================
//  v39.js — Navigator 3.9 (1997): 800×600, a bright modern loft.
//  The Living Room is the hub: every room is reached from an object or
//  doorway in it. Rooms: Living Room · Info Room · Software Library ·
//  Manuals · WorkSpace · MySpace (with My Crypt and My Lab) · GameRoom ·
//  KidSpace. Toolbar of framed tiles top-right, khaki dialogs, InfoGuide
//  tile bottom-left (right-click anything for its InfoGuide too).
// =====================================================================
import * as A from "./art.js";
import { SOFTWARE, CATS39, CAT_INFO } from "./catalog.js";
import { PROFILE, CATS, CERTIFICATIONS, APPS, TRINKETS } from "../data.js";
import { kidspace, drawerWin } from "./kidspace.js";
import { manualsRoomContent, manualViewer } from "./manuals.js";
import { symbolsClick, faq, retired } from "./v35.js";
import * as R from "./rendered.js";

const W = 800, H = 600;
const svg = (body, extraDefs = "") => `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">${A.defs(extraDefs)}${body}</svg>`;
const hot = (k, inner) => `<g class="hot" data-hot="${k}">${inner}</g>`;
const cam = () => A.camera({ cx: 400, hy: 250, K: 560, f: 2.5, eye: 1.55 });
const DOOR = (c, x0, x1, y0, y1, z, inside, frame = "#e8e4dc") => A.quadZ(c, x0 - 0.06, x1 + 0.06, y0, y1 + 0.06, z - 0.002, frame) + A.quadZ(c, x0, x1, y0, y1, z - 0.004, inside);
const at = (c, x, y, z, fn) => { const [px, py] = c(x, y, z); return fn(px, py); };

// ---------------------------------------------------------------- Living Room (the hub)
function living(api) {
  if (R.has("v39_living")) {
    const tq = R.anchor("v39_living", "tvScreen"), tb = tq && R.quadBox(tq);
    const clue = api.arg.step === 2 && tb ? `<rect x="${tb.x}" y="${tb.y}" width="${tb.w}" height="${tb.h}" fill="#0a1a10"/><text x="${tb.cx}" y="${tb.cy}" font-size="${Math.max(6, tb.w / 14)}" font-family="monospace" fill="#5f5" text-anchor="middle">click the symbols</text>` : "";
    const ov = R.imageOnQuad(R.anchor("v39_living", "portrait"), api.portrait()) + clue;
    const extra = api.arg.step >= 3 ? [{ k: "khajiit", svg: `<g transform="translate(262 470) scale(1.2)">${merchant()}</g>` }] : [];
    return svg(R.scene("v39_living", { overlays: ov, extraHots: extra }));
  }
  return livingSVG(api);
}
function livingSVG(api) {
  const c = cam(), Wd = 3.2, D = 4.2, Hh = 3.8;
  const back = A.lingrad([[0, "#f4f2ee"], [0.6, "#e2ddd4"], [1, "#c9c0b0"]]), right = A.lingrad([[0, "#b8b0a2"], [1, "#e6e0d6"]], 1, 0);
  const ceil = A.lingrad([[0, "#d8d4cc"], [1, "#f4f2ee"]]), floor = A.lingrad([[0, "#d8a868"], [1, "#9a6630"]]), sky = A.lingrad([[0, "#1a3a8a"], [0.6, "#6a9ae0"], [1, "#cfe0f8"]]);
  let s = back.def + right.def + ceil.def + floor.def + sky.def;
  // the left wall is a two-storey window: sky, a little skyline and the garden
  s += A.shell(c, { W: Wd, H: Hh, D, back: back.id, left: sky.id, right: right.id, floor: floor.id, ceil: ceil.id, floorLines: 18, floorJoints: 7, plankColor: "rgba(90,50,10,.28)" });
  const gx = (z, y) => c(-Wd, y, z);
  s += A.poly([gx(1.5, 0), gx(1.5, 0.9), gx(4.2, 0.9), gx(4.2, 0)], "#4a7a3a") + A.poly([gx(2.6, 0.9), gx(2.6, 1.3), gx(3.0, 1.3), gx(3.0, 1.6), gx(3.3, 1.6), gx(3.3, 1.2), gx(3.7, 1.45), gx(4.2, 1.3), gx(4.2, 0.9)], "#5a6a7a");
  for (let i = 0; i < 6; i++) { const z = 1.5 + i * 0.54; s += `<line x1="${gx(z, 0)[0]}" y1="${gx(z, 0)[1]}" x2="${gx(z, Hh)[0]}" y2="${gx(z, Hh)[1]}" stroke="#e8e4dc" stroke-width="${Math.max(1.5, 4 - i * 0.5)}"/>`; }
  [1.2, 2.4].forEach(y => (s += `<line x1="${gx(1.3, y)[0]}" y1="${gx(1.3, y)[1]}" x2="${gx(4.2, y)[0]}" y2="${gx(4.2, y)[1]}" stroke="#e8e4dc" stroke-width="2.5"/>`));
  s += A.wallGlow(400, 300, 260, 120, "#fff8e8", 0.35) + A.pool(c, -1.6, 2.6, 1.6, 1.2, "#fff6e0", 0.35);
  // the mezzanine, with the GameRoom and WorkSpace doors upstairs
  s += A.box(c, -0.25, Wd, 2.1, 2.28, 3.25, D, { front: "#e8e4dc", bottom: "#c8c2b6", top: "#d8a868" });
  s += hot("gameroom", DOOR(c, 0.25, 1.15, 2.28, 3.35, D, "#5a2a6a") + A.quadZ(c, 0.38, 1.02, 2.5, 3.2, D - 0.006, "#f4f0e4") +
    at(c, 0.7, 2.85, D, (x, y) => `<text x="${x}" y="${y}" font-size="26" text-anchor="middle" dominant-baseline="middle">🂡</text><text x="${x}" y="${y + 24}" font-size="9" font-family="Arial" font-weight="bold" text-anchor="middle" fill="#5a2a6a">GAMEROOM</text>`));
  s += hot("workspace", DOOR(c, 1.75, 2.65, 2.28, 3.35, D, "#2a4a6a") + A.quadZ(c, 1.88, 2.52, 2.5, 3.2, D - 0.006, "#f4f0e4") +
    at(c, 2.2, 2.85, D, (x, y) => `<text x="${x}" y="${y}" font-size="24" text-anchor="middle" dominant-baseline="middle">🗂️</text><text x="${x}" y="${y + 24}" font-size="9" font-family="Arial" font-weight="bold" text-anchor="middle" fill="#2a4a6a">WORKSPACE</text>`));
  s += A.poly([c(-0.25, 2.28, 3.25), c(Wd, 2.28, 3.25), c(Wd, 2.78, 3.25), c(-0.25, 2.78, 3.25)], "url(#glass)") + `<line x1="${c(-0.25, 2.78, 3.25)[0]}" y1="${c(-0.25, 2.78, 3.25)[1]}" x2="${c(Wd, 2.78, 3.25)[0]}" y2="${c(Wd, 2.78, 3.25)[1]}" stroke="#9aa0a8" stroke-width="3"/>`;
  // staircase rising to the mezzanine
  for (let i = 0; i < 10; i++) { const x0 = -1.65 + i * 0.14; s += A.box(c, x0, x0 + 0.14, 0, (i + 1) * 0.21, 3.3, D, { front: i % 2 ? "#e2ddd4" : "#ebe6de", top: "#c89a5a", side: "#b8b0a2" }); }
  // under the mezzanine: the KidSpace and MySpace doorways
  s += hot("kidspace", DOOR(c, 0.2, 1.1, 0, 1.95, D, "url(#ksGlow)") + at(c, 0.65, 1.0, D, (x, y) => `<text x="${x}" y="${y}" font-size="22" text-anchor="middle">🚀</text><text x="${x}" y="${y + 18}" font-size="9" font-family="Arial Black,Arial" text-anchor="middle" fill="#fff">KIDSPACE</text>`));
  s += hot("myspace", DOOR(c, 1.65, 2.55, 0, 1.95, D, "url(#msGlow)") + at(c, 2.1, 1.0, D, (x, y) => `<text x="${x}" y="${y}" font-size="20" text-anchor="middle">🌙</text><text x="${x}" y="${y + 18}" font-size="9" font-family="Arial Black,Arial" text-anchor="middle" fill="#d8c8ff">MYSPACE</text>`));
  // the TV wall, left of the stairs, with the family portrait above
  s += hot("portrait", A.quadZ(c, -2.95, -2.05, 2.15, 2.85, D - 0.01, "#a8822a", 'stroke="#4a3008"') + (() => { const [x0, y0] = c(-2.9, 2.8, D - 0.02), [x1, y1] = c(-2.1, 2.2, D - 0.02); return `<image href="${api.portrait()}" x="${x0}" y="${y0}" width="${x1 - x0}" height="${y1 - y0}" preserveAspectRatio="xMidYMid slice"/>`; })());
  s += hot("speakers", A.box(c, -3.12, -2.98, 1.0, 1.55, D - 0.15, D, { front: "#2a2a2e", side: "#111" }) + A.box(c, -1.92, -1.78, 1.0, 1.55, D - 0.15, D, { front: "#2a2a2e", side: "#111" }));
  s += hot("tv", A.tv(c, -2.9, -2.0, 1.0, 1.75, D - 0.12, 0.1, { body: "#1a1a1e" }) + tvClueSVG(api, c, D - 0.125, -2.84, -2.12, 1.06, 1.68));
  s += A.shadow(c, -3.1, -1.85, 3.8, D) + A.box(c, -3.1, -1.85, 0, 0.5, 3.75, D, { front: "url(#walnut)", top: "#5a3a20", side: "#2a1a0a" });
  s += hot("stereo", A.stereo(c, -2.95, -2.35, 0.5, 0.82, 3.82));
  s += hot("radio", A.box(c, -2.25, -1.95, 0.5, 0.66, 3.82, 4.05, { front: "#c0c0c8", top: "#e0e0e8", side: "#8a8a90" }) + A.label(c, -2.1, 0.55, 3.815, "FM 101.9", { size: 0.04, fill: "#0a0", family: "monospace" }));
  // right wall: doorway into the Info Room, red bookcases glimpsed inside
  const dR = [c(Wd, 0, 2.4), c(Wd, 2.3, 2.4), c(Wd, 2.3, 3.8), c(Wd, 0, 3.8)];
  s += hot("info", A.poly(dR, "#8a2a14") + [0.3, 0.8, 1.3, 1.8].map(y => A.poly([c(Wd, y, 2.6), c(Wd, y, 3.6), c(Wd, y + 0.04, 3.6), c(Wd, y + 0.04, 2.6)], "#c9a54a")).join("") +
    [0.34, 0.84, 1.34].map((y, r) => Array.from({ length: 6 }, (_, b) => A.poly([c(Wd, y, 2.65 + b * 0.15), c(Wd, y, 2.76 + b * 0.15), c(Wd, y + 0.36, 2.76 + b * 0.15), c(Wd, y + 0.36, 2.65 + b * 0.15)], ["#b01818", "#1a3a8a", "#2a6a2a", "#c8a030"][(b + r) % 4])).join("")).join("") +
    `<polyline points="${A.pts(dR)}" fill="none" stroke="#e8e4dc" stroke-width="5"/>`);
  // the desk with fax, phone, scanner and remote
  s += A.shadow(c, -2.7, -0.9, 1.0, 1.9, 0.45);
  [[-2.65, 1.05], [-1.0, 1.05], [-2.65, 1.8], [-1.0, 1.8]].forEach(([x, z]) => (s += A.box(c, x, x + 0.06, 0, 0.72, z, z + 0.06, { front: "#6a3a1a", side: "#4a2410" })));
  s += A.box(c, -2.7, -0.9, 0.72, 0.78, 1.0, 1.9, { front: "url(#oak)", top: "url(#oak)", side: "#7a5428" });
  s += hot("fax", A.fax(c, -2.3, 0.78, 1.15));
  s += hot("phone", A.phone(c, -1.75, 0.78, 1.2, { body: "#3a3a40", dark: "#18181c" }));
  s += hot("scanner", A.box(c, -1.45, -1.0, 0.78, 0.86, 1.4, 1.8, { front: "#d8d8dc", top: "#f0f0f4", side: "#a8a8ac" }) + A.quadY(c, -1.4, -1.05, 1.45, 1.75, 0.861, "#3a4a5a"));
  s += hot("remote", A.remote(c, -1.45, 0.78, 1.05));
  // the printer on a little cart
  s += A.shadow(c, -0.75, -0.15, 1.6, 2.1) + A.box(c, -0.75, -0.15, 0, 0.45, 1.6, 2.1, { front: "#9a9aa2", top: "#b8b8c0", side: "#6a6a72" });
  s += hot("printer", A.box(c, -0.72, -0.18, 0.45, 0.66, 1.65, 2.05, { front: "url(#beige)", top: "#f4eedc", side: "#a89e84" }) + A.poly([c(-0.6, 0.66, 1.95), c(-0.3, 0.66, 1.95), c(-0.32, 0.86, 2.05), c(-0.58, 0.86, 2.05)], "#fff", 'stroke="#aaa"'));
  // the box on the floor: register with Dom (LinkedIn)
  s += A.shadow(c, -0.15, 0.55, 0.75, 1.15, 0.5);
  s += hot("register", A.box(c, -0.15, 0.55, 0, 0.45, 0.75, 1.15, { front: "url(#beige)", top: "#f4eedc", side: "#a89e84", stroke: "#6a6450", sw: 0.6 }) + A.quadZ(c, -0.1, 0.2, 0.07, 0.38, 0.749, "#0a66c2") + A.label(c, 0.05, 0.18, 0.748, "in", { size: 0.18, fill: "#fff", family: "Arial Black, Arial" }) + A.label(c, 0.38, 0.27, 0.748, "REGISTER", { size: 0.05, fill: "#3a3628" }));
  // the red Software Library cabinet, front right, with the INTERNET globe on top
  s += A.shadow(c, 0.95, 2.45, 1.0, 1.6, 0.5);
  s += hot("software", A.box(c, 0.95, 2.45, 0, 0.95, 1.05, 1.6, { front: "url(#cherry)", top: "#9a3a1c", side: "#4a1408" }) +
    [0.1, 0.5].map(y => A.quadZ(c, 1.02, 2.38, y, y + 0.34, 1.049, "#2a0804") + Array.from({ length: 6 }, (_, b) => A.softbox(c, 1.06 + b * 0.22, 1.25 + b * 0.22, y + 0.02, y + 0.3, 1.1, { color: ["#1a5ab8", "#c83a2a", "#3aa03a", "#e8a01a", "#8a3ad0", "#2a8a8a", "#d86a9a"][(b + (y > 0.3 ? 3 : 0)) % 7], color2: "#111", d: 0.05 })).join("")).join("") +
    A.label(c, 1.7, 0.88, 1.045, "SOFTWARE LIBRARY", { size: 0.055, fill: "#f0d890" }));
  s += hot("globe", A.globe(c, 2.0, 0.95, 1.33, 0.25, { text: "INTERNET" }));
  if (api.arg.step >= 3) s += hot("khajiit", `<g transform="translate(250 512) scale(1.1)">${merchant()}</g>`);
  s += hot("cat", A.cat(560, 560, 0.9, CATS[0] || {}));
  const defs = `<linearGradient id="ksGlow" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1a0a4a"/><stop offset=".6" stop-color="#4a2aa0"/><stop offset="1" stop-color="#e83a8a"/></linearGradient>
    <linearGradient id="msGlow" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0a0a14"/><stop offset="1" stop-color="#3a1a4a"/></linearGradient>`;
  return svg(s, defs);
}
function tvClueSVG(api, c, z, x0, x1, y0, y1) {
  if (api.arg.step !== 2) return "";
  const [a, b] = c(x0, y1, z), [d, e] = c(x1, y0, z);
  return `<rect x="${a}" y="${b}" width="${d - a}" height="${e - b}" fill="#0a1a10"/><text x="${(a + d) / 2}" y="${(b + e) / 2}" font-size="7" font-family="monospace" fill="#5f5" text-anchor="middle">click the symbols</text>`;
}
function merchant() {
  return `<ellipse cx="0" cy="28" rx="26" ry="5" fill="#000" opacity=".35" filter="url(#blur2)"/><path d="M-16 26 q-4 -30 16 -34 q20 4 16 34z" fill="#c8a070"/><circle cx="0" cy="-14" r="12" fill="#c8a070"/><path d="M-11 -20 l-3 -12 9 7z M11 -20 l3 -12 -9 7z" fill="#c8a070" stroke="#7a5a3a" stroke-width=".8"/><circle cx="-4.5" cy="-15" r="2" fill="#2a6a2a"/><circle cx="4.5" cy="-15" r="2" fill="#2a6a2a"/><path d="M-14 -4 q14 10 28 0 v8 q-14 8 -28 0z" fill="#6a2a8a"/><circle cx="14" cy="16" r="6" fill="#8a5a1a" stroke="#c9a54a"/>`;
}

// ---------------------------------------------------------------- Info Room
function info(api) {
  if (R.has("v39_info")) return svg(R.scene("v39_info", { overlays: R.clockHands(R.anchor("v39_info", "clock")) }));
  return infoSVG(api);
}
function infoSVG(api) {
  const c = A.camera({ cx: 400, hy: 260, K: 600, f: 2.5, eye: 1.6 }), Wd = 3.3, D = 3.6, Hh = 3.0;
  const back = A.lingrad([[0, "#5a5450"], [1, "#a89c90"]]), left = A.lingrad([[0, "#4a4440"], [1, "#8a8078"]], 1, 0), right = A.lingrad([[0, "#9a9088"], [1, "#d8d0c4"]], 1, 0);
  const ceil = A.lingrad([[0, "#3a3634"], [1, "#6a6460"]]), floor = A.lingrad([[0, "#c87a3a"], [1, "#8a4a1a"]]);
  let s = back.def + left.def + right.def + ceil.def + floor.def;
  s += A.shell(c, { W: Wd, H: Hh, D, back: back.id, left: left.id, right: right.id, floor: floor.id, ceil: ceil.id, floorLines: 16, floorJoints: 5 });
  [-1.6, 0.2, 1.6].forEach(x => at(c, x, Hh - 0.02, 2.4, (a, b) => (s += `<rect x="${a - 2}" y="${b}" width="4" height="22" fill="#222"/><path d="M${a - 7} ${b + 22} h14 l-4 10 h-6z" fill="#333"/>`)));
  s += A.wallGlow(250, 300, 170, 150, "#ffb860", 0.45) + A.wallGlow(520, 270, 170, 120, "#ffd090", 0.3);
  // left: the orange-lit tutorial wall
  const zT = 2.2;
  s += A.box(c, -3.25, -1.25, 0, 2.3, zT, zT + 0.4, { front: "#e88a3a", top: "#f0a050", side: "#a85a1a" });
  s += A.quadZ(c, -3.1, -1.4, 0.3, 1.95, zT - 0.002, "#8a3a10");
  s += A.label(c, -2.25, 2.05, zT - 0.01, "TUTORIALS", { size: 0.11, fill: "#2a1404" });
  const TUT = [["t-mouse", "🖱️"], ["t-overview", "🎞️"], ["t-about", "📄"], ["t-media", "🎵"], ["t-software", "💿"], ["t-info", "📚"], ["t-kidspace", "🚀"], ["t-internet", "🌐"], ["t-faq", "❓"]];
  TUT.forEach(([k, g], i) => { const col = i % 3, r = Math.floor(i / 3), x = -3.02 + col * 0.55, y = 1.4 - r * 0.53; s += hot(k, A.quadZ(c, x, x + 0.5, y, y + 0.46, zT - 0.006, "#fff4e0", 'stroke="#5a2a08" stroke-width="2"') + at(c, x + 0.25, y + 0.22, zT - 0.01, (tx, ty) => `<text x="${tx}" y="${ty}" font-size="30" text-anchor="middle" dominant-baseline="middle">${g}</text>`)); });
  s += hot("clock", A.clock(c, -2.2, 2.6, D - 0.01, 0.17, { rim: "#5a2a08" }));
  // centre: bookshelf of manuals (red binders)
  const zB = 3.0;
  s += hot("manuals", A.box(c, -1.1, 0.25, 0, 2.4, zB, D, { front: "url(#cherryV)", side: "#4a1408" }) + [0.15, 0.78, 1.41].map((y, r) => A.quadZ(c, -1.02, 0.17, y, y + 0.55, zB - 0.001, "#2a0804") + Array.from({ length: 10 }, (_, b) => A.book(c, -1.0 + b * 0.115, -0.9 + b * 0.115, y, y + 0.45 + ((b + r) % 3) * 0.03, zB + 0.04, ["#b01818", "#c83a2a", "#8a1010", "#f0e6d0"][(b + r) % 4], "", { d: 0.3 })).join("")).join("") +
    A.label(c, -0.42, 2.25, zB - 0.01, "MANUALS", { size: 0.1, fill: "#f0d890", family: "Georgia, serif" }));
  // right of centre: the online shelf
  const zO = 3.2;
  s += A.box(c, 0.45, 2.6, 0, 2.2, zO, D, { front: "url(#cherry)", side: "#4a1408" });
  const ON = [["o-linkedin", { color: "#0a66c2", color2: "#02284a", title: "LinkedIn", glyph: "💼" }], ["o-github", { color: "#24292e", color2: "#000", title: "GitHub", glyph: "🐙" }], ["o-mail", { color: "#c8a01a", color2: "#5a4000", title: "Mail Dom", glyph: "✉️" }],
    ["o-oldsite", { color: "#0a3a0a", color2: "#000", title: "Old Homepage", glyph: "📟" }], ["o-net", { color: "#1a5ab8", color2: "#0a1a4a", title: "Internet", glyph: "🌐" }], ["o-phone", { color: "#e8e8e8", color2: "#888", title: "Internet Phone", glyph: "☎️", ink: "#1a2a5a" }]];
  [1.55, 0.7].forEach((y, row) => { s += A.box(c, 0.5, 2.55, y - 0.04, y, zO - 0.2, zO, { front: "#5a1a08", top: "#7a2a10" }); for (let i = 0; i < 3; i++) { const [k, o] = ON[row * 3 + i], x = 0.62 + i * 0.66; s += hot(k, A.softbox(c, x, x + 0.5, y, y + 0.56, zO - 0.12, { ...o, d: 0.08 })); } });
  // rug, and the way back to the Living Room (right)
  s += A.quadY(c, -1.3, 1.9, 0.8, 2.6, 0.003, "#b8ae9c", 'opacity=".9"');
  const dR = [c(Wd, 0, 2.55), c(Wd, 2.3, 2.55), c(Wd, 2.3, 3.5), c(Wd, 0, 3.5)];
  s += hot("living", A.poly(dR, "#f4f0e8") + A.poly([c(Wd, 0.9, 2.7), c(Wd, 0.9, 3.35), c(Wd, 1.8, 3.35), c(Wd, 1.8, 2.7)], "#9ac0e8") + `<polyline points="${A.pts(dR)}" fill="none" stroke="#3a3430" stroke-width="4"/>`);
  return svg(s);
}

// ---------------------------------------------------------------- Software Library (straight on, like a cabinet)
function software(api) {
  if (!R.has("v39_software")) return softwareSVG(api);
  const st = api.state.sl || (api.state.sl = { cat: CATS39[0], page: 0 });
  const items = SOFTWARE.filter(x => x.c39 === st.cat), per = 9, pages = Math.max(1, Math.ceil(items.length / per));
  st.page = Math.min(st.page, pages - 1);
  const room = "v39_software", an = k => R.anchor(room, k);
  let ov = "";
  CATS39.forEach((cat, i) => {
    const q = an("cat" + i); if (!q) return;
    const b = R.quadBox(q), on = cat === st.cat;
    ov += `${on ? `<rect x="${b.x - 3}" y="${b.y - 2}" width="${b.w * 1.2}" height="${b.h + 4}" fill="#f8e8a0" opacity=".2"/>` : ""}<text x="${b.x + 4}" y="${b.cy + 4}" font-size="${Math.min(12, b.h * 0.45, b.w / (cat.length * 0.56))}" font-family="Arial" font-weight="bold" fill="${on ? "#fff4c0" : "#f2dcc0"}" stroke="#2a0802" stroke-width=".6" paint-order="stroke">${A.esc(cat)}</text>
      <circle cx="${b.x + b.w * 1.109}" cy="${b.cy}" r="3.6" fill="${on ? "#ff3030" : "#4a0a0a"}"/>${on ? `<circle cx="${b.x + b.w * 1.109}" cy="${b.cy}" r="8" fill="#ff4040" opacity=".35" filter="url(#blur2)"/>` : ""}`;
  });
  const shown = items.slice(st.page * per, st.page * per + per);
  const extra = shown.map((it, i) => ({ k: "sw-" + SOFTWARE.indexOf(it), svg: R.softbox(an("slot" + i), it, "l" + i) }));
  const pl = an("pageLbl"), pb = pl && R.quadBox(pl);
  if (pb) ov += `<text x="${pb.cx}" y="${pb.cy + 4}" font-size="11" fill="#f0d8a0" text-anchor="middle" font-family="Arial">${st.page + 1} / ${pages}</text>`;
  const hidden = [];
  if (st.page === 0) hidden.push("prev");
  if (st.page >= pages - 1) hidden.push("next");
  return svg(R.scene(room, { overlays: ov, extraHots: extra, hidden }));
}
function softwareSVG(api) {
  const st = api.state.sl || (api.state.sl = { cat: CATS39[0], page: 0 });
  const items = SOFTWARE.filter(x => x.c39 === st.cat), per = 9, pages = Math.max(1, Math.ceil(items.length / per));
  st.page = Math.min(st.page, pages - 1);
  let s = `<rect width="800" height="600" fill="url(#slBg)"/><path d="M0 440 L800 440 L800 600 L0 600Z" fill="url(#slFloor)"/>`;
  s += hot("living", `<rect x="650" y="80" width="110" height="250" fill="#e8e0d0" opacity=".9"/><rect x="650" y="80" width="110" height="250" fill="none" stroke="#2a2420" stroke-width="5"/><text x="705" y="210" font-size="12" font-family="Arial" font-weight="bold" text-anchor="middle" fill="#3a2a1a">Living Room ▸</text>`);
  s += `<ellipse cx="380" cy="530" rx="320" ry="26" fill="#000" opacity=".45" filter="url(#soft)"/>`;
  s += `<rect x="115" y="134" width="515" height="384" fill="url(#cherry)" stroke="#3a0c04" stroke-width="2"/><rect x="128" y="518" width="500" height="14" fill="#5a1a08"/>`;
  s += `<rect x="268" y="150" width="346" height="345" fill="#120402"/><rect x="268" y="150" width="346" height="60" fill="url(#slShade)"/>`;
  [262, 374].forEach(y => (s += `<rect x="268" y="${y}" width="346" height="9" fill="url(#cherry)"/>`)); s += `<rect x="256" y="483" width="370" height="12" fill="url(#cherry)"/>`;
  CATS39.forEach((cat, i) => {
    const y = 169 + i * 38, on = cat === st.cat, words = cat.split(" "), two = cat.length > 14;
    const l1 = two ? words.slice(0, Math.ceil(words.length / 2)).join(" ") : cat, l2 = two ? words.slice(Math.ceil(words.length / 2)).join(" ") : "";
    s += hot("cat-" + i, `<rect x="139" y="${y}" width="107" height="31" fill="${on ? "#c84a2a" : "#8a2414"}" stroke="#3a0804" stroke-width="2"/><rect x="141" y="${y + 2}" width="103" height="2" fill="#fff" opacity=".25"/>` +
      `<text x="192" y="${y + (two ? 13 : 20)}" font-size="10" font-family="Arial" font-weight="bold" text-anchor="middle" fill="#fff">${A.esc(l1)}</text>${two ? `<text x="192" y="${y + 25}" font-size="10" font-family="Arial" font-weight="bold" text-anchor="middle" fill="#fff">${A.esc(l2)}</text>` : ""}<circle cx="257" cy="${y + 16}" r="3" fill="${on ? "#ff4040" : "#5a0a0a"}"/>`);
  });
  items.slice(st.page * per, st.page * per + per).forEach((it, i) => {
    const r = Math.floor(i / 3), col = i % 3, x = 290 + col * 112, y = 172 + r * 112;
    const g = A.lingrad([[0, it.color], [1, it.color2]], 1, 1);
    const lines = it.title.split(" ").reduce((a, w) => { const l = a[a.length - 1]; if (l && (l + " " + w).length <= 11) a[a.length - 1] = l + " " + w; else a.push(w); return a; }, []).slice(0, 2);
    s += hot("sw-" + SOFTWARE.indexOf(it), g.def + `<rect x="${x}" y="${y}" width="64" height="80" fill="${g.id}" stroke="#000" stroke-width=".8"/><rect x="${x + 64}" y="${y + 3}" width="5" height="80" fill="${it.color2}"/><rect x="${x}" y="${y}" width="64" height="12" fill="#fff" opacity=".2"/>` +
      `<text x="${x + 32}" y="${y + 36}" font-size="26" text-anchor="middle" dominant-baseline="middle">${it.glyph}</text>` + lines.map((l, k) => `<text x="${x + 32}" y="${y + 62 + k * 10}" font-size="9" font-family="Arial Black,Arial" text-anchor="middle" fill="${it.ink || "#fff"}">${A.esc(l)}</text>`).join(""));
  });
  const b = (k, inner, dis) => hot(k, `<g opacity="${dis ? 0.4 : 1}">${inner}</g>`);
  s += b("prev", `<path d="M410 507 l14 -9 v18z" fill="#c8b890" stroke="#3a1a08"/>`, st.page === 0);
  s += b("install", `<rect x="433" y="499" width="18" height="17" fill="#c84a2a" stroke="#3a0804"/><text x="442" y="513" font-size="15" font-weight="bold" text-anchor="middle" fill="#ffd">+</text>`, false);
  s += b("next", `<path d="M476 507 l-14 -9 v18z" fill="#c8b890" stroke="#3a1a08"/>`, st.page >= pages - 1);
  s += `<text x="560" y="512" font-size="10" font-family="Arial" fill="#f0d8a0">${st.page + 1} / ${pages}</text>`;
  s += hot("trash", `<path d="M642 438 L736 438 L728 528 L650 528Z" fill="url(#wicker)" stroke="#1a2a2a" stroke-width="2"/><path d="M642 438 L736 438 L742 430 L636 430Z" fill="#2a3a3a"/>`);
  const defs = `<linearGradient id="slBg" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#2a2624"/><stop offset=".6" stop-color="#4a4440"/><stop offset="1" stop-color="#2a2624"/></linearGradient>
    <linearGradient id="slFloor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c88a5a"/><stop offset="1" stop-color="#8a5a32"/></linearGradient>
    <linearGradient id="slShade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity=".6"/><stop offset="1" stop-color="#000" stop-opacity="0"/></linearGradient>
    <pattern id="wicker" width="8" height="8" patternUnits="userSpaceOnUse"><rect width="8" height="8" fill="#1a3a3a"/><path d="M0 4 h8 M4 0 v8" stroke="#3a6a6a" stroke-width="1.6"/></pattern>`;
  return svg(s, defs);
}

// ---------------------------------------------------------------- WorkSpace
function workspace(api) {
  if (!R.has("v39_workspace")) return workspaceSVG(api);
  const room = "v39_workspace", an = k => R.anchor(room, k);
  let ov = "";
  CERTIFICATIONS.slice(0, 6).forEach((cert, i) => {
    const q = an("cert" + i); if (!q) return;
    const b = R.quadBox(q);
    ov += `<rect x="${b.x}" y="${b.y + b.h * 0.78}" width="${b.w}" height="${b.h * 0.22}" fill="${cert.color}"/><text x="${b.cx}" y="${b.y + b.h * 0.34}" font-size="${b.h * 0.2}" font-family="Georgia,serif" font-weight="bold" fill="#3a2a10" text-anchor="middle">${A.esc(cert.code.length > 10 ? cert.code.slice(0, 10) : cert.code)}</text><text x="${b.cx}" y="${b.y + b.h * 0.62}" font-size="${b.h * 0.11}" font-family="Arial" fill="#5a4a30" text-anchor="middle">${A.esc(cert.issuer.slice(0, 22))}</text>`;
  });
  const cq = an("calendar"), cb = cq && R.quadBox(cq);
  if (cb) { const d = new Date(); ov += `<text x="${cb.cx}" y="${cb.y + cb.h * 0.17}" font-size="${cb.h * 0.13}" font-family="Arial" font-weight="bold" fill="#fff" text-anchor="middle">${d.toLocaleString([], { month: "short" }).toUpperCase()}</text><text x="${cb.cx}" y="${cb.y + cb.h * 0.72}" font-size="${cb.h * 0.42}" font-family="Arial Black,Arial" fill="#222" text-anchor="middle">${d.getDate()}</text>`; }
  ["Forms", "Personal Docs", "Business"].forEach((t, i) => { const q = an("fileLbl" + i), b = q && R.quadBox(q); if (b) ov += `<text x="${b.cx}" y="${b.cy + b.h * 0.3}" font-size="${Math.min(b.h * 0.8, b.w / (t.length * 0.55))}" font-family="Arial" font-weight="bold" fill="#222" text-anchor="middle">${t}</text>`; });
  return svg(R.scene(room, { overlays: ov }));
}
function workspaceSVG(api) {
  const c = A.camera({ cx: 400, hy: 250, K: 600, f: 2.5, eye: 1.5 }), Wd = 3.0, D = 3.4, Hh = 2.8;
  const back = A.lingrad([[0, "#d8e0e8"], [1, "#a8b4c4"]]), side = A.lingrad([[0, "#c0c8d4"], [1, "#8a96a8"]], 1, 0), sideR = A.lingrad([[0, "#8a96a8"], [1, "#c0c8d4"]], 1, 0);
  const ceil = A.lingrad([[0, "#a8b0bc"], [1, "#e0e4ea"]]), floor = A.lingrad([[0, "#5a6a7a"], [1, "#2a3440"]]);
  let s = back.def + side.def + sideR.def + ceil.def + floor.def;
  s += A.shell(c, { W: Wd, H: Hh, D, back: back.id, left: side.id, right: sideR.id, floor: floor.id, ceil: ceil.id });
  s += A.windowZ(c, -2.7, -1.3, 1.0, 2.3, D, { sky: ["#2a5ac0", "#bfe0ff"], mullions: 3 });
  CERTIFICATIONS.slice(0, 6).forEach((cert, i) => { const x = 0.0 + (i % 3) * 0.62, y = 1.95 - Math.floor(i / 3) * 0.55; s += hot("cert-" + i, A.quadZ(c, x, x + 0.5, y, y + 0.38, D - 0.01, "#3a2a10") + A.quadZ(c, x + 0.04, x + 0.46, y + 0.04, y + 0.34, D - 0.015, "#fbf6e6") + A.quadZ(c, x + 0.04, x + 0.46, y + 0.27, y + 0.34, D - 0.016, cert.color) + A.label(c, x + 0.25, y + 0.11, D - 0.02, cert.code.length > 10 ? cert.code.slice(0, 10) : cert.code, { size: 0.05, fill: "#2a2a2a" })); });
  s += hot("calendar", A.quadZ(c, 1.95, 2.55, 1.2, 1.9, D - 0.01, "#fff", 'stroke="#555"') + A.quadZ(c, 1.95, 2.55, 1.72, 1.9, D - 0.012, "#c82a2a") + (() => { const d = new Date(), [x, y] = c(2.25, 1.32, D - 0.02), [mx, my] = c(2.25, 1.77, D - 0.02); return `<text x="${mx}" y="${my}" font-size="9" font-family="Arial" font-weight="bold" fill="#fff" text-anchor="middle">${d.toLocaleString([], { month: "short" }).toUpperCase()}</text><text x="${x}" y="${y}" font-size="26" font-family="Arial Black,Arial" fill="#222" text-anchor="middle">${d.getDate()}</text>`; })());
  const fc = [["file-forms", "Forms"], ["file-personal", "Personal Docs"], ["file-business", "Business"]];
  s += A.shadow(c, -2.85, -2.15, 2.4, 2.95) + A.box(c, -2.85, -2.15, 0, 1.35, 2.4, 2.95, { front: "url(#metal)", top: "#c8ccd4", side: "#6a6e76" });
  fc.forEach(([k, name], i) => { const y0 = 0.9 - i * 0.44; s += hot(k, A.quadZ(c, -2.8, -2.2, y0, y0 + 0.4, 2.395, "#b8bcc4", 'stroke="#555"') + A.quadZ(c, -2.66, -2.34, y0 + 0.24, y0 + 0.34, 2.39, "#fff", 'stroke="#555" stroke-width=".5"') + A.label(c, -2.5, y0 + 0.27, 2.385, name, { size: 0.045, fill: "#222" }) + A.box(c, -2.58, -2.42, y0 + 0.1, y0 + 0.15, 2.36, 2.39, { front: "#444" })); });
  s += A.shadow(c, -1.4, 1.6, 1.2, 2.2, 0.5);
  [[-1.35, 1.25], [1.5, 1.25], [-1.35, 2.1], [1.5, 2.1]].forEach(([x, z]) => (s += A.box(c, x, x + 0.06, 0, 0.74, z, z + 0.06, { front: "#2a2a2e" })));
  s += A.box(c, -1.4, 1.6, 0.74, 0.8, 1.2, 2.2, { front: "url(#walnut)", top: "url(#walnut)", side: "#22120a" });
  s += hot("computer", A.box(c, -0.55, 0.35, 0.8, 1.45, 1.75, 2.15, { front: "url(#beige)", top: "#f4eedc", side: "#a89e84" }) + A.quadZ(c, -0.47, 0.27, 0.9, 1.37, 1.749, "#0a3a6a") + at(c, -0.1, 1.1, 1.748, (x, y) => `<text x="${x}" y="${y}" font-size="11" font-family="Arial" font-weight="bold" fill="#bfe8ff" text-anchor="middle">LinkedIn</text>`) + A.box(c, -0.6, 0.4, 0.8, 0.83, 1.3, 1.6, { front: "#d8d0bc", top: "#ece6d6" }));
  PROFILE.career.forEach((job, i) => { const x = -1.3 + i * 0.32; s += hot("job-" + i, A.box(c, x, x + 0.28, 0.8, 1.02, 1.25, 1.36, { front: ["#6a3a1a", "#2a2a2a", "#7a1a1a", "#3a2a1a"][i % 4], top: "#8a5a3a", side: "#3a1a0a" }) + A.box(c, x + 0.1, x + 0.18, 1.02, 1.06, 1.29, 1.32, { front: "#c9a54a" })); });
  s += hot("report", A.box(c, 0.65, 1.15, 0.8, 0.82, 1.35, 1.75, { front: "#8a6a3a", top: "#fbf6e6" }) + A.quadY(c, 0.7, 1.1, 1.4, 1.7, 0.821, "#fff", 'stroke="#aaa"'));
  s += hot("lamp", (() => { const [bx, by] = c(1.35, 0.8, 1.9), [tx, ty] = c(1.2, 1.45, 1.85); return `<line x1="${bx}" y1="${by}" x2="${tx}" y2="${ty}" stroke="#222" stroke-width="3"/><ellipse cx="${bx}" cy="${by}" rx="12" ry="4" fill="#222"/><path d="M${tx - 14} ${ty + 8} l14 -16 l14 16z" fill="#2a6a3a"/><ellipse cx="${tx}" cy="${ty + 30}" rx="40" ry="16" fill="#fff6c0" opacity=".25" filter="url(#glow)"/>`; })());
  const dR = [c(Wd, 0, 1.7), c(Wd, 2.2, 1.7), c(Wd, 2.2, 2.7), c(Wd, 0, 2.7)];
  s += hot("living", A.poly(dR, "#e8e4dc") + `<polyline points="${A.pts(dR)}" fill="none" stroke="#3a4a5a" stroke-width="4"/>`);
  return svg(s);
}

// ---------------------------------------------------------------- MySpace (spooky, for older kids; no toolbar)
function myspace(api) {
  if (!R.has("v39_myspace")) return myspaceSVG(api);
  const room = "v39_myspace", an = k => R.anchor(room, k);
  let ov = "";
  ["Friends", "Paintings", "Homework", "Personal", "Misc."].forEach((t, i) => { const q = an("drawer" + i), b = q && R.quadBox(q); if (b) ov += `<text x="${b.x + 2}" y="${b.cy + b.h * 0.3}" font-size="${Math.min(b.h * 0.85, 13)}" font-family="Arial" font-weight="bold" fill="#e8d8ff">${t}</text>`; });
  const sq = an("symbols"), sb = sq && R.quadBox(sq);
  if (sb && api.arg.step >= 3) ov += `<rect x="${sb.x}" y="${sb.y}" width="${sb.w}" height="${sb.h}" fill="#0a3a1a"/><text x="${sb.cx}" y="${sb.cy + sb.h * 0.25}" font-size="${sb.h * 0.7}" text-anchor="middle" fill="#5f5" font-family="serif">☉ ☽ ♄ ♃ ☿</text>`;
  const wq = an("window"), wb = wq && R.quadBox(wq);
  if (wb && api.state.msLever) ov += `<radialGradient id="msNet2" cx=".5" cy=".5" r=".55"><stop offset="0" stop-color="#7affd0"/><stop offset=".55" stop-color="#2a8ad0"/><stop offset="1" stop-color="#1a0a4a"/></radialGradient><circle cx="${wb.cx}" cy="${wb.cy}" r="${wb.w * 0.47}" fill="url(#msNet2)"/><text x="${wb.cx}" y="${wb.cy + wb.h * 0.12}" font-size="${wb.h * 0.36}" text-anchor="middle">🌐</text>`;
  return svg(R.scene(room, { overlays: ov }));
}
function myspaceSVG(api) {
  let s = `<rect width="800" height="600" fill="url(#msWall)"/>`;
  s += `<rect x="40" y="250" width="220" height="250" fill="url(#msStone)"/><rect x="40" y="236" width="230" height="18" fill="#3a2a1a"/>`;
  s += `<rect x="85" y="330" width="130" height="170" fill="#0a0404"/><ellipse cx="150" cy="490" rx="50" ry="12" fill="#ff7a1a" opacity=".6" filter="url(#glow)"/>${[0, 1, 2].map(i => `<path class="flame" d="M${120 + i * 30} 490 q-12 -30 0 -60 q12 30 0 60z" fill="${["#ffb020", "#ff7a1a", "#ffd060"][i]}"/>`).join("")}`;
  s += hot("symbols", `<rect x="90" y="258" width="120" height="30" fill="${api.arg.step >= 3 ? "#0a3a1a" : "#2a2418"}" stroke="#8a7a50"/><text x="150" y="279" font-size="14" text-anchor="middle" fill="${api.arg.step >= 3 ? "#5f5" : "#c8b87a"}" font-family="serif">☉ ☽ ♄ ♃ ☿</text>`);
  s += hot("poker", `<line x1="262" y1="500" x2="292" y2="330" stroke="#2a2a2a" stroke-width="5"/><path d="M290 332 l12 -8 -4 14z" fill="#2a2a2a"/><circle cx="262" cy="502" r="6" fill="#5a4a2a"/>`);
  const lit = api.state.msLever;
  s += hot("window", `<rect x="320" y="70" width="220" height="200" fill="${lit ? "url(#msNet)" : "url(#msNight)"}" stroke="#2a1a3a" stroke-width="8"/>${lit ? `<text x="430" y="180" font-size="40" text-anchor="middle">🌐</text>` : `<circle cx="480" cy="120" r="22" fill="#efe6ff"/>`}<line x1="430" y1="70" x2="430" y2="270" stroke="#2a1a3a" stroke-width="5"/><line x1="320" y1="170" x2="540" y2="170" stroke="#2a1a3a" stroke-width="5"/>`);
  s += `<path d="M300 60 q30 110 0 230 h40 q-16 -120 6 -230z" fill="#5a0a2a"/><path d="M560 60 q-30 110 0 230 h-40 q16 -120 -6 -230z" fill="#5a0a2a"/>`;
  s += hot("lever", `<rect x="420" y="282" width="22" height="16" fill="#555" stroke="#222"/><rect x="428" y="${lit ? 290 : 252}" width="6" height="40" fill="#999"/><circle cx="431" cy="${lit ? 332 : 250}" r="9" fill="#c82a2a" stroke="#5a0a0a"/>`);
  s += `<rect x="300" y="380" width="300" height="20" fill="url(#walnut)"/><rect x="310" y="400" width="14" height="140" fill="#2a1a0a"/><rect x="576" y="400" width="14" height="140" fill="#2a1a0a"/>`;
  s += hot("help", `<rect x="330" y="340" width="56" height="40" fill="#e8e0c8" stroke="#3a2a1a" stroke-width="2"/><text x="358" y="367" font-size="20" text-anchor="middle">❔</text>`);
  s += hot("cup", `<path d="M400 352 h26 l-3 28 h-20z" fill="#e8e8f0" stroke="#555"/><path d="M426 358 q10 2 0 12" fill="none" stroke="#555" stroke-width="2"/><path d="M408 345 q4 -8 0 -12 M416 345 q4 -8 0 -12" stroke="#aaa" fill="none" opacity=".7"/>`);
  s += hot("disk", `<rect x="450" y="352" width="60" height="28" fill="#c8c0b0" stroke="#555"/><rect x="460" y="364" width="40" height="4" fill="#222"/>`);
  s += hot("crystal", `<ellipse cx="560" cy="378" rx="22" ry="6" fill="#3a2a1a"/><circle cx="560" cy="352" r="24" fill="url(#crystal)"/><ellipse cx="552" cy="344" rx="7" ry="4" fill="#fff" opacity=".6"/>`);
  const D5 = ["Friends", "Paintings", "Homework", "Personal", "Misc."];
  s += `<rect x="640" y="200" width="140" height="330" fill="#2a1a2a" stroke="#0a040a" stroke-width="3"/>`;
  D5.forEach((n, i) => (s += hot("drawer-" + i, `<rect x="650" y="${212 + i * 62}" width="120" height="52" fill="#4a2a4a" stroke="#0a040a" stroke-width="2"/><circle cx="755" cy="${238 + i * 62}" r="4" fill="#c9a54a"/><text x="662" y="${243 + i * 62}" font-size="13" font-family="Arial" font-weight="bold" fill="#e8d8ff">${n}</text>`)));
  s += `<rect x="620" y="40" width="170" height="150" fill="#3a2a1a"/>${[0, 1].map(r => `<rect x="628" y="${48 + r * 70}" width="154" height="62" fill="#120a06"/>`).join("")}`;
  MS_GAMES.forEach(([, g], i) => (s += hot("g-" + i, `<rect x="${636 + (i % 3) * 50}" y="${56 + Math.floor(i / 3) * 70}" width="40" height="50" fill="#5a3a6a" stroke="#000"/><text x="${656 + (i % 3) * 50}" y="${90 + Math.floor(i / 3) * 70}" font-size="22" text-anchor="middle">${g}</text>`)));
  s += hot("crypt", `<path d="M80 508 L250 508 L270 558 L60 558Z" fill="#3a2010" stroke="#1a0a04" stroke-width="3"/><circle cx="165" cy="526" r="6" fill="none" stroke="#c9a54a" stroke-width="3"/><text x="165" y="550" font-size="10" fill="#c9a54a" text-anchor="middle" font-family="Georgia">MY CRYPT</text>`);
  s += hot("lab", `<rect x="400" y="430" width="70" height="140" fill="#1a3a2a" stroke="#0a1a10" stroke-width="3"/><circle cx="455" cy="505" r="4" fill="#c9a54a"/><text x="435" y="465" font-size="22" text-anchor="middle">⚗️</text><text x="435" y="488" font-size="10" fill="#9fe8bf" text-anchor="middle" font-family="Georgia">MY LAB</text>`);
  s += hot("bin", `<path d="M700 534 h44 l-5 30 h-34z" fill="#3a3a3a" stroke="#111"/><ellipse cx="722" cy="534" rx="22" ry="5" fill="#111"/>`);
  s += hot("exit", `<rect x="0" y="40" width="30" height="190" fill="#1a0a1a" stroke="#5a3a6a"/><text x="15" y="135" font-size="11" fill="#c8b8e8" text-anchor="middle" transform="rotate(-90 15 135)" font-family="Arial" font-weight="bold">◀ LIVING ROOM</text>`);
  const defs = `<linearGradient id="msWall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1a0e24"/><stop offset=".7" stop-color="#3a2040"/><stop offset=".71" stop-color="#2a1810"/><stop offset="1" stop-color="#140a06"/></linearGradient>
    <pattern id="msStone" width="40" height="24" patternUnits="userSpaceOnUse"><rect width="40" height="24" fill="#5a5450"/><path d="M0 12 h40 M20 0 v12 M0 12 v12 M40 12 v12" stroke="#2a2420" stroke-width="2"/></pattern>
    <linearGradient id="msNight" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0a0a2a"/><stop offset="1" stop-color="#3a2a6a"/></linearGradient>
    <radialGradient id="msNet" cx=".5" cy=".5" r=".7"><stop offset="0" stop-color="#7affd0"/><stop offset=".5" stop-color="#2a8ad0"/><stop offset="1" stop-color="#1a0a4a"/></radialGradient>
    <radialGradient id="crystal" cx=".4" cy=".4" r=".6"><stop offset="0" stop-color="#e8d8ff"/><stop offset=".6" stop-color="#8a5ad0"/><stop offset="1" stop-color="#2a0a5a"/></radialGradient>`;
  return svg(s, defs);
}
const MS_GAMES = [["doom", "👹"], ["minesweeper", "💣"], ["app-kojima", "📦"], ["pinball", "🚀"], ["app-lostatsea", "🛟"], ["tk-oneshot", "🐉"]];

// ---------------------------------------------------------------- GameRoom
const GR_GAMES = [["solitaire", "🂡"], ["minesweeper", "💣"], ["pinball", "🚀"], ["doom", "👹"], ["app-kojima", "📦"], ["app-lostatsea", "🛟"], ["app-everybodyisjohn", "🎲"], ["tk-pointkeeper", "📝"], ["tk-oneshot", "🐉"]];
function gameroom(api) {
  if (!R.has("v39_gameroom")) return gameroomSVG(api);
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const sail = still ? "" : `<animateTransform attributeName="transform" type="translate" from="-0.35 0" to="1.35 0" dur="16s" repeatCount="indefinite"/>`;
  const boat = `<clipPath id="portClip" clipPathUnits="userSpaceOnUse"><circle cx=".5" cy=".5" r=".47"/></clipPath><g clip-path="url(#portClip)" pointer-events="none"><g>${sail}<path d="M-.12 .56 h.2 l-.04 .05 h-.12z" fill="#fff"/><path d="M-.03 .55 v-.17 l.1 .16z" fill="#f4f4fa"/><path d="M-.04 .55 v-.12 l-.06 .11z" fill="#e8e0d0"/></g></g>`;
  return svg(R.scene("v39_gameroom", { overlays: R.onQuad(R.anchor("v39_gameroom", "port"), boat) }));
}
function gameroomSVG(api) {
  const c =  A.camera({ cx: 400, hy: 250, K: 600, f: 2.5, eye: 1.5 }), Wd = 3.0, D = 3.4, Hh = 2.8;
  const back = A.lingrad([[0, "#2a4a3a"], [1, "#1a2a22"]]), side = A.lingrad([[0, "#1a3a2a"], [1, "#2a4a3a"]], 1, 0), sideR = A.lingrad([[0, "#2a4a3a"], [1, "#1a3a2a"]], 1, 0);
  const ceil = A.lingrad([[0, "#0a1a12"], [1, "#2a3a32"]]), floor = A.lingrad([[0, "#7a2a2a"], [1, "#3a0a0a"]]);
  let s = back.def + side.def + sideR.def + ceil.def + floor.def;
  s += A.shell(c, { W: Wd, H: Hh, D, back: back.id, left: side.id, right: sideR.id, floor: floor.id, ceil: ceil.id });
  const [wx, wy] = c(-1.9, 1.75, D - 0.01), R = 46;
  s += `<clipPath id="port"><circle cx="${wx}" cy="${wy}" r="${R}"/></clipPath><g clip-path="url(#port)"><rect x="${wx - R}" y="${wy - R}" width="${R * 2}" height="${R * 2}" fill="#7ab8e8"/><rect x="${wx - R}" y="${wy + 6}" width="${R * 2}" height="${R}" fill="#1a5aa0"/><g class="boat"><path d="M${wx - 20} ${wy + 6} h30 l-6 8 h-18z" fill="#fff"/><path d="M${wx - 6} ${wy + 4} v-22 l14 20z" fill="#e8e8f0"/></g></g><circle cx="${wx}" cy="${wy}" r="${R}" fill="none" stroke="#c9a54a" stroke-width="8"/>`;
  s += A.box(c, -0.6, 2.3, 0.0, 2.35, 3.0, D, { front: "url(#walnut)", side: "#22120a" }) + A.quadZ(c, -0.52, 2.22, 0.3, 2.25, 2.999, "#0a0604");
  [1.6, 0.95, 0.3].forEach(y => (s += A.box(c, -0.52, 2.22, y - 0.04, y, 2.95, D, { front: "#5a3a20", top: "#7a5030" })));
  GR_GAMES.forEach(([id, g], i) => { const it = SOFTWARE.find(x => x.open === id); const r = Math.floor(i / 3), col = i % 3, x = -0.4 + col * 0.88, y = [1.6, 0.95, 0.3][r]; s += hot("g-" + i, A.softbox(c, x, x + 0.6, y, y + 0.55, 3.0, { color: it.color, color2: it.color2, title: it.title, glyph: g })); });
  s += A.shadow(c, -2.8, -2.0, 2.2, 2.9) + hot("arcade", A.box(c, -2.8, -2.05, 0, 1.9, 2.2, 2.9, { front: "#3a0a6a", top: "#5a2a8a", side: "#1a0430" }) + A.quadZ(c, -2.72, -2.13, 1.05, 1.6, 2.199, "#000") + A.label(c, -2.425, 1.25, 2.198, "404", { size: 0.18, fill: "#5f5", family: "monospace" }) + A.label(c, -2.425, 1.72, 2.198, "ARCADE", { size: 0.09, fill: "#ff0" }) + A.box(c, -2.8, -2.05, 0.85, 0.95, 1.95, 2.2, { front: "#2a0a4a", top: "#4a2a6a" }));
  s += A.quadY(c, 0.2, 1.8, 0.8, 2.0, 0.003, "#c8a050", 'opacity=".8"');
  s += hot("dog", `<g transform="translate(470 470)"><ellipse cx="0" cy="22" rx="60" ry="9" fill="#000" opacity=".3" filter="url(#blur2)"/><ellipse cx="0" cy="4" rx="48" ry="20" fill="#a8743a"/><ellipse cx="-40" cy="-2" rx="20" ry="16" fill="#a8743a"/><ellipse cx="-52" cy="4" rx="9" ry="6" fill="#7a4a1a"/><path d="M-36 -14 q8 -2 10 12 q-10 4 -12 -12z" fill="#6a3a12"/><path d="M-46 -4 q3 2 6 0" stroke="#222" stroke-width="1.6" fill="none"/><circle cx="-60" cy="2" r="2.6" fill="#222"/><path class="tail" d="M46 0 q22 -10 26 -26" stroke="#a8743a" stroke-width="7" stroke-linecap="round" fill="none"/><text x="10" y="-26" font-size="12" fill="#fff" opacity=".7">z z</text></g>`);
  s += hot("install", at(c, 2.6, 0.3, 3.0, (x, y) => `<rect x="${x - 20}" y="${y - 14}" width="40" height="28" rx="4" fill="#c9a54a" stroke="#3a2a08"/><text x="${x}" y="${y + 6}" font-size="18" font-weight="bold" text-anchor="middle">+</text>`));
  const dR = [c(Wd, 0, 1.7), c(Wd, 2.2, 1.7), c(Wd, 2.2, 2.7), c(Wd, 0, 2.7)];
  s += hot("living", A.poly(dR, "#f4f2ee") + `<polyline points="${A.pts(dR)}" fill="none" stroke="#c9a54a" stroke-width="4"/>`);
  return svg(s);
}

// ---------------------------------------------------------------- MySpace mini-games
function memoryGame(api) {
  const faces = ["🦇", "💀", "🕷️", "🕯️", "🔮", "🧛", "👻", "🗝️"], deck = [...faces, ...faces].sort(() => Math.random() - 0.5);
  const el = api.win({ title: "My Crypt — match the pairs", icon: "💀", w: 330, cls: "game", html: `<div class="memgrid">${deck.map((f, i) => `<button data-i="${i}" aria-label="card">${f}</button>`).join("")}</div><p class="hint" id="memS">Find all eight pairs.</p>` });
  let first = null, lock = false, found = 0, tries = 0;
  el.querySelectorAll(".memgrid button").forEach(b => b.addEventListener("click", () => {
    if (lock || b.classList.contains("up") || b.classList.contains("done")) return;
    b.classList.add("up"); api.sfx.click();
    if (!first) { first = b; return; }
    tries++; const a = first; first = null;
    if (a.textContent === b.textContent) { a.classList.add("done"); b.classList.add("done"); found++; api.sfx.coin(); if (found === 8) { el.querySelector("#memS").textContent = `You escaped the crypt in ${tries} tries!`; api.sfx.secret(); } }
    else { lock = true; setTimeout(() => { a.classList.remove("up"); b.classList.remove("up"); lock = false; }, 700); }
  }));
}
function simonGame(api) {
  const el = api.win({ title: "My Lab — repeat the pattern", icon: "⚗️", w: 300, cls: "game", html: `<div class="simon">${[0, 1, 2, 3].map(i => `<button data-i="${i}" aria-label="pad ${i + 1}"></button>`).join("")}</div><p class="hint" id="siS">Watch, then repeat.</p><div class="nbtns"><button class="nb" id="siGo">Start</button></div>`, onClose: () => { try { C && C.close(); } catch (e) {} } });
  const pads = [...el.querySelectorAll(".simon button")], freqs = [330, 392, 494, 587];
  let seq = [], pos = 0, input = false, C = null;
  const beep = f => { if (api.isMuted()) return; try { C = C || new (window.AudioContext || window.webkitAudioContext)(); const o = C.createOscillator(), g = C.createGain(); o.frequency.value = f; g.gain.setValueAtTime(0.08, C.currentTime); g.gain.exponentialRampToValueAtTime(0.0001, C.currentTime + 0.3); o.connect(g); g.connect(C.destination); o.start(); o.stop(C.currentTime + 0.3); } catch (e) {} };
  const flash = i => { pads[i].classList.add("lit"); beep(freqs[i]); setTimeout(() => pads[i].classList.remove("lit"), 300); };
  const play = () => { input = false; seq.forEach((p, k) => setTimeout(() => flash(p), 500 + k * 520)); setTimeout(() => { input = true; pos = 0; }, 500 + seq.length * 520); };
  const next = () => { seq.push(Math.floor(Math.random() * 4)); el.querySelector("#siS").textContent = "Watch… level " + seq.length + "."; play(); };
  el.querySelector("#siGo").addEventListener("click", () => { seq = []; next(); });
  pads.forEach((p, i) => p.addEventListener("click", () => {
    if (!input) return; flash(i);
    if (seq[pos] !== i) { input = false; el.querySelector("#siS").textContent = `Kaboom! You reached level ${seq.length}. Press Start to try again.`; api.sfx.static(); return; }
    if (++pos === seq.length) { input = false; el.querySelector("#siS").textContent = "Correct!"; setTimeout(next, 700); }
  }));
}

// ---------------------------------------------------------------- hotspots
const swAct = (api, it) => (it.open === "kidspace" ? api.go("kidspace") : api.launch(it.open));
function fileDrawer(api, name, ids) {
  api.sfx.drawer();
  const el = api.win({ title: "WorkSpace — " + name, icon: "🗂️", w: 320, cls: "kdrawer", html: `<ul class="kfiles">${ids.map(id => { const it = SOFTWARE.find(x => x.open === id); return `<li><button data-id="${id}"><span>📄</span>${A.esc(it ? it.title : id === "about" ? "ABOUT.TXT" : id)}</button></li>`; }).join("")}</ul>` });
  el.querySelectorAll("[data-id]").forEach(b => b.addEventListener("click", () => { api.closeWin(el); api.launch(b.dataset.id); }));
}
const hots = {
  living: {
    info: { cap: "The Info Room. Access tutorials, electronic manuals and online services here.", act: { room: "info" } },
    workspace: { cap: "WorkSpace: Dom's work, super-organized.", info: "The WorkSpace is Dom's office: his career, his certifications and the work tools he made.", act: { room: "workspace" } },
    software: { cap: "The Software Library, where you will find the installed software titles.", act: { room: "software" } },
    myspace: { cap: "Click here to go to MySpace.", info: "MySpace is the cool place to work and play, for older kids. Mind the crypt.", act: { room: "myspace" } },
    kidspace: { cap: "Click here to go to KidSpace.", act: { room: "kidspace" } },
    gameroom: { cap: "Click here to enter the GameRoom.", act: { room: "gameroom" } },
    stereo: { cap: "Access the CD and MIDI sound player.", act: api => api.mediaController() },
    radio: { cap: "Accesses the FM tuner.", info: "Plays the radio. (It's the Media Controller with better reception.)", act: api => { api.music.play(Math.floor(Math.random() * api.music.tracks.length)); api.caption(api.isMuted() ? "The radio is quiet. (Sound is off.)" : "♪ Now playing on FM 101.9: " + api.music.tracks[api.music.current].name, 5000); } },
    speakers: { cap: "Click here to change the volume on your speakers.", act: api => api.toggleSound() },
    tv: { cap: "Turns on the TV and accesses control functions.", info: "Channel 3 is a short program about Dominic.", act: api => (api.arg.step === 2 ? api.caption("The screen reads: “You decide to click the symbols.”", 6000) : api.panel("about")) },
    printer: { cap: "Sets up printing options.", info: "Prints Dom's ABOUT.TXT. (It opens it, anyway. Paper's expensive.)", act: { open: "about" } },
    scanner: { cap: "Launches the document scanning function.", info: "Scan a picture… into Paint.", act: { open: "paint" } },
    phone: { cap: "Click here to go to the phone.", act: { panel: "phone" } },
    fax: { cap: "Click to access the Fax Machine functions.", info: "Send Dom a message with the mail composer.", act: { open: "tk-mailto" } },
    remote: { cap: "Media Controller: gives access to the remote control and the home electronics.", act: api => api.mediaController() },
    register: { cap: "Register with Dom to receive service and support (LinkedIn).", act: { open: "linkedin" } },
    globe: { cap: "Click here to access the Internet.", act: api => api.internet() },
    portrait: { cap: "Family portrait", info: "Picture day, 1996.", act: { panel: "family" } },
    cat: { cap: (CATS[0] || {}).name || "The cat", info: "Purrrr.", act: api => { api.sfx.meow(); api.caption("Mrrp.", 2000); } },
    khajiit: { cap: "A travelling merchant cat", info: "Khajiit has wares, if you have coin.", act: { panel: "khajiit" }, hidden: api => api.arg.step < 3 }
  },
  info: {
    living: { cap: "Living Room: entrance to Navigator. From here you can use your home electronics and the Software Library, and go to all the rooms in the home.", act: { room: "living" } },
    manuals: { cap: "Holds electronic manuals: certifications, volunteering, career and more.", act: { room: "manuals" } },
    clock: { cap: "Changes clock settings.", info: "Shows the time.", act: api => api.caption("It's " + new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }) + ".", 4000) },
    "t-mouse": { cap: "Tutorial: Using Your Mouse", act: api => api.mouseTutorial() }, "t-overview": { cap: "Tutorial: Navigator Overview", act: api => api.overview() },
    "t-about": { cap: "Tutorial: Getting Started (About Dom)", act: { open: "about" } }, "t-media": { cap: "Tutorial: Using Your Home Electronics", act: api => api.mediaController() },
    "t-software": { cap: "Tutorial: Software Library Basics", act: { room: "software" } }, "t-info": { cap: "Tutorial: Info Room Basics", act: api => api.caption("You're in it! Tutorials on the left, manuals in the middle, online services on the right.", 6000) },
    "t-kidspace": { cap: "Tutorial: KidSpace", act: { room: "kidspace" } }, "t-internet": { cap: "Tutorial: The Internet", act: api => api.internet() }, "t-faq": { cap: "Tutorial: Questions & Answers", act: api => faq(api) },
    "o-linkedin": { cap: "LinkedIn: Dom's professional network.", act: { open: "linkedin" } }, "o-github": { cap: "GitHub: Dom's code.", act: () => window.open(PROFILE.github, "_blank", "noopener") },
    "o-mail": { cap: "Internet Mail. Write Dom an email.", act: { open: "tk-mailto" } }, "o-oldsite": { cap: "The old green-screen homepage.", act: { open: "oldsite" } },
    "o-net": { cap: "Explore the Internet.", act: api => api.internet() }, "o-phone": { cap: "Internet Phone. (It's the regular phone.)", act: { panel: "phone" } }
  },
  software: {
    living: { cap: "Click here to go to the Living Room.", act: { room: "living" } },
    prev: { cap: "Previous shelf", act: api => { const s = api.state.sl; if (s.page > 0) { s.page--; api.go("software", { quiet: true }); } } },
    next: { cap: "Next shelf", act: api => { const s = api.state.sl, n = SOFTWARE.filter(x => x.c39 === s.cat).length; if ((s.page + 1) * 9 < n) { s.page++; api.go("software", { quiet: true }); } } },
    install: { cap: "Click here to add a software program to the shelves.", act: api => api.msg("Install", "Please insert the Navigator CD and click OK.<br><br><i>(Everything Dom has made is already on the shelves.)</i>", ["OK"], { icon: `<span class="mi">💿</span>` }) },
    trash: { cap: "Use the Trash Can to throw away files or applications.", info: "Retired software lives in here.", act: api => retired(api) }
  },
  workspace: {
    living: { cap: "Back to the Living Room", act: { room: "living" } },
    computer: { cap: "Dom's computer: LinkedIn", act: { open: "linkedin" } },
    calendar: { cap: "Calendar", act: api => api.caption("Today is " + new Date().toLocaleDateString([], { weekday: "long", month: "long", day: "numeric", year: "numeric" }) + ".", 5000) },
    report: { cap: "Usage report", info: "How much is in this house.", act: api => api.msg("Usage Report", `<b>Programs:</b> ${Object.keys(APPS).length} apps, ${TRINKETS.length} tools, 4 games<br><b>Rooms:</b> 8<br><b>Certifications:</b> ${CERTIFICATIONS.length}<br><b>Cats:</b> ${CATS.length} (in charge)`, ["OK"], { icon: `<span class="mi">📊</span>` }) },
    lamp: { cap: "Desk lamp", act: api => { api.sfx.click(); api.caption("Click.", 1200); } },
    "file-forms": { cap: "Forms: tickets, timers and mail", act: api => fileDrawer(api, "Forms", ["tk-ticketgenerator", "tk-timewrap", "tk-mailto", "tk-package"]) },
    "file-personal": { cap: "Personal Docs", act: api => fileDrawer(api, "Personal Docs", ["about", "tk-incomesavings", "tk-bankrewards", "tk-crypto"]) },
    "file-business": { cap: "Business: voting, PMP and planning", act: api => fileDrawer(api, "Business", ["app-rankedchoicevoting", "tk-pmpcalc", "tk-pmpref", "tk-picturespacer"]) }
  },
  myspace: {
    exit: { cap: "Exit to the Living Room", act: api => api.msg("CONFIRMATION", "Where would you like to go?", ["Go back to the Living Room", "Stay in MySpace"], { icon: `<span class="mi">🚪</span>` }).then(r => { if (r === 0) api.go("living"); }) },
    symbols: { cap: "Strange symbols carved in the mantel", info: "“c u r i o s i t y is the lust of the mind”", act: api => symbolsClick(api) },
    poker: { cap: "Fireplace poker", act: api => { api.sfx.crumple(); api.caption("You poke the fire. It pokes back.", 3000); } },
    window: { cap: "The window", info: "Pull down the lever under the window, then click the window to be transported to the Internet.", act: api => (api.state.msLever ? api.internet() : api.caption("The window is dark. Maybe that lever does something…", 3500)) },
    lever: { cap: "The lever", act: api => { api.state.msLever = !api.state.msLever; api.sfx.drawer(); api.go("myspace", { quiet: true }); api.caption(api.state.msLever ? "Ka-chunk. The window flickers with a strange online glow. Click it!" : "The lever snaps back up.", 4000); } },
    help: { cap: "The desktop box: help", act: api => { const t = ["Pull the lever under the window, then click the window for the Internet.", "Keep your games on the shelves, top right.", "There's a trapdoor in the floor. And a lab. Go on.", "The drawers on the right hold your files."][Math.floor(Math.random() * 4)]; api.caption(t, 6000); api.say(t); } },
    cup: { cap: "A cup of something", act: api => api.caption("It's cocoa. It's always cocoa.", 2500) },
    disk: { cap: "Disk drive", act: { open: "about" } },
    crystal: { cap: "Crystal ball", act: api => { const f = ["The ball says: try the Software Library.", "The ball says: Dom's favorite app is whichever one you're using.", "The ball says: reply hazy, try KidSpace.", "The ball says: you will click something soon."][Math.floor(Math.random() * 4)]; api.sfx.secret(); api.caption(f, 4000); } },
    crypt: { cap: "A trapdoor: My Crypt", info: "A memory game. Match the spooky pairs.", act: api => memoryGame(api) },
    lab: { cap: "A door: My Lab", info: "A pattern game. How far can you get?", act: api => simonGame(api) },
    bin: { cap: "Recycle bin", act: api => retired(api) }
  },
  gameroom: {
    living: { cap: "Back to the Living Room", act: { room: "living" } },
    arcade: { cap: "404 Arcade", info: "Every way to get lost on this site, in one machine.", act: { open: "arcade" } },
    dog: { cap: "The dog", info: "Asleep on the job.", act: api => { api.sfx.boing(); api.caption("Woof? …zzz.", 2000); } },
    install: { cap: "Install a game", act: api => api.msg("Install", "Insert the game CD and click OK.<br><br><i>(All the games are already here.)</i>", ["OK"], { icon: `<span class="mi">🎮</span>` }) }
  }
};
CATS39.forEach((cat, i) => (hots.software["cat-" + i] = { cap: cat, info: CAT_INFO[cat], act: api => { api.state.sl = { cat, page: 0 }; api.sfx.click(); api.go("software", { quiet: true }); } }));
SOFTWARE.forEach((it, i) => (hots.software["sw-" + i] = { cap: it.title, info: it.info, act: api => swAct(api, it) }));
MS_GAMES.forEach(([id], i) => { const it = SOFTWARE.find(x => x.open === id); hots.myspace["g-" + i] = { cap: it.title, info: it.info, act: { open: id } }; });
["Friends", "Paintings", "Homework", "Personal", "Misc."].forEach((n, i) => (hots.myspace["drawer-" + i] = { cap: n + " drawer", info: "Keep your files in the drawers.", act: api => drawerWin(api, i) }));
GR_GAMES.forEach(([id], i) => { const it = SOFTWARE.find(x => x.open === id); hots.gameroom["g-" + i] = { cap: it.title, info: it.info, act: { open: id } }; });
CERTIFICATIONS.forEach((c, i) => (hots.workspace["cert-" + i] = { cap: c.name, info: c.issuer, act: api => { api.state.mcat = "Certifications"; api.go("manuals"); } }));
PROFILE.career.forEach((j, i) => (hots.workspace["job-" + i] = { cap: "Briefcase: " + j.org, info: j.role + " (" + j.when + ")", act: api => api.msg(j.org, `<b>${A.esc(j.role)}</b><br>${A.esc(j.when)}<br><br>The rest of the story is on LinkedIn.`, ["Open LinkedIn", "Close"], { icon: `<span class="mi">💼</span>` }).then(r => r === 0 && api.launch("linkedin")) }));

export const V39 = {
  id: "3.9", cls: "v39", W, H, home: "living", manuals: "manuals", smartTips: false, rightClickInfo: true, multiUser: true,
  roomKeys: ["living", "info", "software", "workspace", "kidspace", "myspace", "gameroom"],
  rooms: {
    living: { name: "Living Room", caption: "Living Room: entrance to Navigator. Point at anything to see what it does.", render: living, hots: hots.living },
    info: { name: "Info Room", caption: "The Info Room: tutorials, electronic manuals and online services.", render: info, hots: hots.info },
    software: { name: "Software Library", caption: "The Software Library, where you will find the installed software titles.", render: software, hots: hots.software },
    manuals: { name: "Manuals", caption: "Choose a category, then click the manual you need.", render: api => manualsRoomContent(api, "3.9"), hots: manualViewer.hots },
    workspace: { name: "WorkSpace", caption: "WorkSpace: turn your computer into a super-organized work manager.", render: workspace, hots: hots.workspace },
    myspace: { name: "MySpace", caption: "MySpace: the cool place to work and play.", render: myspace, hots: hots.myspace, noToolbar: true },
    gameroom: { name: "GameRoom", caption: "The GameRoom. Click a game to play.", render: gameroom, hots: hots.gameroom },
    kidspace: { ...kidspace, name: "KidSpace" }
  },
  topHTML: I => `<div class="tb39"><button class="tile39 sec" data-tool="users" data-label="Security">${I.users}</button><div class="ttl"><b>Navigator</b><span id="roomName"></span></div>
    <div class="tools"><button class="tile39 round" data-tool="globe" data-label="Internet">${I.globe}</button>${["task", "voice", "phone", "media", "prefs", "run", "windows"].map(k => `<button class="tile39" data-tool="${k}" data-label="${k}">${I[k]}</button>`).join("")}<button class="tile39" data-tool="exit" data-label="Exit">${I.power}</button></div></div>`,
  botHTML: I => `<div class="bb39"><button id="infoBtn" aria-label="InfoGuide">${I.info}</button><div id="caption" aria-live="polite"></div></div>`,
  splashHTML: `<div class="spl39"><div class="orb"></div><b>Navigator</b><span>Version 3.9</span><p>A fan-made homage to the 1997 family-PC house. Click to begin.</p></div>`,
  welcomeLine: "Welcome to Navigator. Choose one of the four buttons to get started.",
  welcome(api, h) {
    const mini = api.V.rooms.living.render(api).replace("<svg ", '<svg preserveAspectRatio="xMidYMid slice" style="position:absolute;inset:0;width:100%;height:100%" ');
    return h(`<div class="welcome w39"><div class="wbox">
      <svg class="wlogo" viewBox="0 0 48 48"><circle cx="24" cy="24" r="20" fill="none" stroke="#2a3a6a" stroke-width="4" stroke-dasharray="10 5"/><circle cx="24" cy="24" r="10" fill="#c83a3a"/></svg>
      <h2>Welcome to Navigator.</h2>
      <button class="wnet" data-w="net"><div class="orb"></div><b>Internet</b>Press this button to go straight to the Internet.</button>
      <div class="wgrid">
        <button class="wbig" data-w="nav" data-key="1"><span class="pic">${mini}<span class="n">1</span></span><b>Navigator</b><small>This button takes you directly to Navigator.</small></button>
        <button class="wbig" data-w="windows" data-key="2"><span class="pic" style="background:#008080"><svg viewBox="0 0 110 82" style="position:absolute;inset:0"><rect x="8" y="8" width="10" height="9" fill="#c0c0c0"/><rect x="8" y="24" width="10" height="9" fill="#ff0"/><rect x="40" y="18" width="56" height="40" fill="#c0c0c0"/><rect x="40" y="18" width="56" height="7" fill="#000080"/><rect x="0" y="72" width="110" height="10" fill="#c0c0c0"/></svg><span class="n">2</span></span><b>dom 95 desktop</b><small>This button takes you directly to Windows.</small></button>
        <button class="wbig" data-w="overview" data-key="3"><span class="pic" style="background:#111"><svg viewBox="0 0 110 82" style="position:absolute;inset:0"><rect x="22" y="6" width="62" height="74" fill="#fff6a0" transform="rotate(-8 55 43)"/><path d="M30 20h40M30 30h40M30 40h34" stroke="#aac" transform="rotate(-8 55 43)"/><path d="M60 60 L96 20" stroke="#222" stroke-width="5"/></svg><span class="n">3</span></span><b>Overview</b><small>A brief overview of Navigator and the house.</small></button>
        <button class="wbig" data-w="users" data-key="4"><span class="pic" style="background:linear-gradient(#cfd8e0,#8a96a8)"><svg viewBox="0 0 110 82" style="position:absolute;inset:0"><circle cx="40" cy="34" r="12" fill="#e8a0a0"/><path d="M20 82 q0 -30 20 -30 q20 0 20 30z" fill="#c84a4a"/><circle cx="72" cy="38" r="12" fill="#a0c0e8"/><path d="M52 82 q0 -28 20 -28 q20 0 20 28z" fill="#2a8aa0"/></svg><span class="n">4</span></span><b>Customize for Multiple Users</b><small>Tell Navigator who's using the computer.</small></button>
      </div>
      <label class="wchk"><input type="checkbox" id="wIntro" ${api.prefs.intro ? "checked" : ""}> Show this screen when Navigator starts</label></div></div>`);
  },
  overview: [
    { h: "Dom's house: bringing technology home", p: "Welcome to Navigator, the fun and easy way to find everything Dom has made. Point at anything to see what it does in the black bar at the bottom, and click to use it.", glyph: "🏠" },
    { room: "living", h: "The Living Room", p: "The Navigator experience starts in the Living Room, where you can reach every special place in the home: the Info Room, Software Library, WorkSpace, KidSpace, MySpace and the GameRoom." },
    { room: "software", h: "The Software Library", p: "Every program, boxed and shelved. Pick a category on the left; use the arrows for more shelves." },
    { room: "info", h: "The Info Room", p: "Tutorials, manuals (certifications, volunteering, career) and online services like LinkedIn and GitHub." },
    { room: "workspace", h: "WorkSpace", p: "Dom's office: briefcases for every job, certificates on the wall, and the work tools in the filing cabinet." },
    { room: "myspace", h: "MySpace", p: "The cool place for older kids. Pull the lever under the window for the Internet. There's a crypt under the floor and a lab behind the door." },
    { h: "The toolbar", p: "The toolbar is always visible at the top of the screen: the Internet, the Task Jumper, narration, the phone, the Media Controller, preferences, running programs, Windows and Exit.", glyph: "🧰" },
    { h: "So have fun…", p: "…and if you're ever unsure, turn on the InfoGuide in the bottom-left corner, or right-click anything.", glyph: "ℹ️" }
  ],
  tips: [],
  tvClue(api) { if (api.current === "living") api.go("living", { quiet: true }); }
};

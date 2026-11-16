// =====================================================================
//  manuals.js — Electronic Documents (3.5) / Manuals (3.9): a shelf of
//  manuals with category buttons. Each book opens in a manual viewer.
// =====================================================================
import * as A from "./art.js";
import { CERTIFICATIONS, VOLUNTEERING, PROFILE, ARCHIVE, REMEMBRANCE } from "../data.js";

const CATS = ["Certifications", "Giving Back", "Career", "Additional Information"];
const BOOKS = [
  ...CERTIFICATIONS.map(c => ({ cat: "Certifications", title: c.code && c.code !== c.name ? c.code : c.name, color: c.color, page: () => `<h2>${A.esc(c.name)}</h2><p class="sub">${A.esc(c.code)} · ${A.esc(c.issuer)}</p><p>This certifies that <b>${A.esc(PROFILE.name)}</b> has completed the requirements for <b>${A.esc(c.name)}</b>.</p><p class="seal">★ ${A.esc(c.issuer)} ★</p>` })),
  ...VOLUNTEERING.map(v => ({ cat: "Giving Back", title: v.name.split(" — ")[0], color: "#2a6a3a", page: () => `<h2>${A.esc(v.name)}</h2><p>${A.esc(v.detail)}</p>` })),
  ...PROFILE.career.map(c => ({ cat: "Career", title: c.org, color: { Microsoft: "#0a5aa0", "UBS Wealth Management Americas": "#b01818", "Marist College": "#8a1010" }[c.org] || "#3a3a5a", page: () => `<h2>${A.esc(c.org)}</h2><p class="sub">${A.esc(c.role)}</p><p>${A.esc(c.when)}</p><p class="hint">The full story is on LinkedIn.</p>` })),
  { cat: "Additional Information", title: "Leviathan", color: "#5a3a1a", leviathan: true },
  { cat: "Additional Information", title: "ABOUT.TXT", color: "#e8e0c8", ink: "#2a2a2a", page: () => `<h2>About this computer</h2>${PROFILE.note.map(p => `<p>${A.esc(p)}</p>`).join("")}` },
  { cat: "Additional Information", title: "In Memoriam", color: "#1a1a1a", page: () => `<h2>In loving memory</h2><p>${REMEMBRANCE.map(r => `<a href="${r.url}" target="_blank" rel="noopener">${A.esc(r.name)}</a>`).join(" · ")}</p>` },
  ...ARCHIVE.map(a => ({ cat: "Additional Information", title: a.title.replace(/ \(.*\)/, ""), color: "#6a6a6a", page: () => `<h2>${A.esc(a.title)}</h2><p class="sub">RETIRED · ${A.esc(a.cat)}</p><p>${A.esc(a.desc)}</p><p class="hint">Built with ${a.stack.map(A.esc).join(", ")}</p>` }))
];

function open(api, b) {
  if (b.leviathan) return api.panel("leviathan");
  api.win({ title: "Manual — " + b.title, icon: "📘", w: 460, h: 360, cls: "manual", html: `<div class="mpage">${b.page()}</div>` });
}

export const manualViewer = { hots: {} };
CATS.forEach((c, i) => (manualViewer.hots["mcat-" + i] = { cap: c, info: { Certifications: "Manuals for Dom's certifications and degree.", "Giving Back": "Where Dom volunteers.", Career: "Where Dom has worked.", "Additional Information": "Everything else: some reading, a note, and the retired apps." }[c], act: api => { api.state.mcat = c; api.sfx.click(); api.go(api.current, { quiet: true }); } }));
BOOKS.forEach((b, i) => (manualViewer.hots["book-" + i] = { cap: b.leviathan ? "Leviathan — T. Hobbes, 1651 (well-thumbed)" : b.title, info: b.leviathan ? "An old book that sticks out further than the rest. Someone has been reading it." : "Click to open this manual.", act: api => open(api, b) }));
manualViewer.hots.back = { cap: "Back to the Info Room", info: "Returns to the Info Room.", act: api => api.go("info") };

export function manualsRoomContent(api, ver) {
  const big = ver === "3.9", W = big ? 800 : 640, H = big ? 600 : 480, k = W / 800;
  const cat = api.state.mcat || CATS[0], books = BOOKS.map((b, i) => ({ ...b, i })).filter(b => b.cat === cat);
  const hot = (key, inner) => `<g class="hot" data-hot="${key}">${inner}</g>`;
  // a straight-on wall of shelving, like looking right at the bookcase
  let s = `<rect width="800" height="600" fill="url(#mbg)"/>`;
  s += `<rect x="0" y="120" width="250" height="300" fill="url(#mwin)"/><rect x="0" y="120" width="250" height="300" fill="none" stroke="#1a1a1a" stroke-width="6"/><line x1="125" y1="120" x2="125" y2="420" stroke="#1a1a1a" stroke-width="5"/>`;
  s += `<rect x="0" y="420" width="250" height="180" fill="url(#oak)" opacity=".7"/>`;
  s += `<rect x="232" y="0" width="568" height="600" fill="url(#cherryV)"/><rect x="232" y="0" width="40" height="600" fill="#5a1408"/>`;
  s += `<rect x="300" y="40" width="490" height="460" fill="#2a0804"/><rect x="300" y="40" width="490" height="460" fill="url(#mshade)"/>`;
  s += `<rect x="290" y="505" width="510" height="26" fill="url(#cherry)"/><rect x="290" y="505" width="510" height="5" fill="#b8502a" opacity=".5"/>`;
  // category buttons on the left upright
  CATS.forEach((c, i) => {
    const y = 120 + i * 80, on = c === cat;
    s += hot("mcat-" + i, `<rect x="244" y="${y}" width="64" height="62" rx="3" fill="${on ? "#c8a050" : "#6a1a0a"}" stroke="#2a0602" stroke-width="2"/>` +
      `<rect x="250" y="${y + 6}" width="52" height="38" fill="#2a0804"/>${[0, 1, 2, 3, 4].map(j => `<rect x="${253 + j * 9.6}" y="${y + 12}" width="8" height="30" fill="${["#1a3a8a", "#8a1a1a", "#2a5a2a", "#c8a030", "#3a2a5a"][(j + i) % 5]}"/>`).join("")}` +
      `<text x="276" y="${y + 56}" font-size="${c.length > 12 ? 7 : 8.5}" font-family="Arial" font-weight="bold" text-anchor="middle" fill="${on ? "#2a0a02" : "#f0d8a0"}">${A.esc(c.length > 14 ? "Additional Info" : c)}</text>`);
  });
  // the books, spine-out
  const n = Math.max(books.length, 1), bw = Math.min(64, 470 / n);
  books.forEach((b, j) => {
    const x = 310 + j * bw, lean = b.leviathan ? -10 : 0, hgt = b.leviathan ? 330 : 300 + (j % 3) * 6, y = 500 - hgt;
    const ink = b.ink || (b.color === "#e8e0c8" ? "#2a2a2a" : "#fff");
    s += hot("book-" + b.i, `<g ${lean ? `transform="rotate(${lean} ${x + bw / 2} 500)"` : ""}><rect x="${x + 2}" y="${y}" width="${bw - 4}" height="${hgt}" fill="${b.leviathan ? "url(#leather)" : "#f8f4ea"}" stroke="#bbb"/>` +
      (b.leviathan ? "" : `<rect x="${x + 2}" y="${y}" width="${bw - 4}" height="${hgt}" fill="${b.color}" opacity=".92"/>`) +
      `<rect x="${x + 2}" y="${y + hgt - 70}" width="${bw - 4}" height="10" fill="#c9a54a" opacity=".8"/><rect x="${x + 2}" y="${y + 18}" width="${bw - 4}" height="4" fill="#c9a54a" opacity=".6"/>` +
      `<text x="${x + bw / 2}" y="${y + 30}" font-size="${Math.min(15, bw * 0.38)}" font-family="${b.leviathan ? "Georgia, serif" : "Arial"}" font-weight="bold" fill="${ink}" transform="rotate(90 ${x + bw / 2} ${y + 30})">${A.esc(b.title.length > 26 ? b.title.slice(0, 25) + "…" : b.title)}</text></g>`);
  });
  if (!big) s += hot("back", `<rect x="14" y="440" width="150" height="34" rx="4" fill="#5a1a08" stroke="#c9a54a" stroke-width="2"/><text x="89" y="462" font-size="14" font-family="Arial" font-weight="bold" fill="#f0d8a0" text-anchor="middle">◀ Info Room</text>`);
  else s += hot("back", `<rect x="20" y="470" width="190" height="40" rx="4" fill="#5a1a08" stroke="#c9a54a" stroke-width="2"/><text x="115" y="496" font-size="16" font-family="Arial" font-weight="bold" fill="#f0d8a0" text-anchor="middle">◀ Info Room</text>`);
  const defs = `<linearGradient id="mbg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a3a3a"/><stop offset="1" stop-color="#1a1a1a"/></linearGradient>
    <linearGradient id="mwin" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5a7a5a"/><stop offset=".6" stop-color="#2a4a2a"/><stop offset="1" stop-color="#1a2a1a"/></linearGradient>
    <linearGradient id="mshade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity=".5"/><stop offset=".3" stop-color="#000" stop-opacity="0"/></linearGradient>
    <linearGradient id="leather" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#3a2410"/><stop offset=".5" stop-color="#7a5028"/><stop offset="1" stop-color="#3a2410"/></linearGradient>`;
  void k;
  return `<svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" width="${W}" height="${H}">${A.defs(defs)}${s}</svg>`;
}

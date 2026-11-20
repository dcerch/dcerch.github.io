// =====================================================================
//  kidspace.js — Ark KidSpace, the kids' room (shared by 3.5 and 3.9).
//  Two rooms (Space, Treehouse), two views each (Moon/Mars, Jungle/Beach).
//  Bookcase of programs, five dresser drawers, a striped help box, a
//  guide who stands on the desk and talks in speech balloons, levers to
//  change room and view, a magnifier to show names, and things flying by.
//  All artwork and the guide ("Pip") are original.
// =====================================================================
import * as A from "./art.js";

const VIEWS = { space: ["Moon base", "Mars"], tree: ["Jungle", "Beach"] };
const SHELF = [
  ["paint", "🎨", "Paint"], ["minesweeper", "💣", "Minesweeper"], ["solitaire", "🂡", "Solitaire"], ["pinball", "🚀", "Space Pinball"],
  ["drawers", "🗄️", "KidSpace Drawers"], ["app-kojima", "📦", "Kojima Names"], ["app-lostatsea", "🛟", "Lost at Sea"], ["tk-randomizer", "🎲", "Randomizer"], ["app-secretsanta", "🎁", "Secret Santa"]
];
const DRAWERS = [
  ["Friends", [["app-secretsanta", "Secret Santa list"], ["app-everybodyisjohn", "Game night: Everybody is John"], ["tk-pointkeeper", "Score pad"]]],
  ["Paintings", [["paint", "New painting"]]],
  ["Homework", [["tk-pmpref", "PMP study sheet"], ["tk-pmpcalc", "Project hours worksheet"], ["tk-picturespacer", "Math: spacing pictures"]]],
  ["Personal", [["about", "ABOUT.TXT"], ["@family", "Family picture"], ["@journal", "My journal"]]],
  ["Misc.", [["toolbox", "The whole toolbox"], ["tk-strobe", "Flashlight"], ["tk-cookie", "A cookie"]]]
];
const INTRO = [
  "Hi! Welcome to KidSpace, the fun place to work and play!",
  "Your games and programs live on the bookcase. Click one, or drag it onto the desk where I'm standing.",
  "Keep your files in the dresser drawers. The bottom one is for Mom and Dad.",
  "Watch out for things flying around!",
  "If you ever need help, click the striped box. Have fun!"
];
const HELP = [
  "Click a program on the bookcase to start it. Or drag it onto the desk!",
  "The levers on the desk change the room and the view outside.",
  "Click the magnifying glass to show the name of everything.",
  "The dresser drawers open and close. Try one!",
  "To leave KidSpace, click the door on the pillar.",
  "The skull and the jar on top of the bookcase make noises. Don't tell anyone."
];

const hot = (k, inner, extra = "") => `<g class="hot" data-hot="${k}" ${extra}>${inner}</g>`;
const tag = (x, y, t) => `<g class="kname"><rect x="${x - t.length * 3.6 - 6}" y="${y - 11}" width="${t.length * 7.2 + 12}" height="16" rx="3" fill="#ffffe0" stroke="#333"/><text x="${x}" y="${y + 1}" font-size="11" font-family="Arial" font-weight="bold" text-anchor="middle">${A.esc(t)}</text></g>`;

// ---------------------------------------------------------------- backdrops
function outside(theme, view) {
  if (theme === "space") {
    let s = `<rect width="800" height="600" fill="#02020e"/>`;
    for (let i = 0; i < 140; i++) s += `<circle cx="${(i * 197) % 800}" cy="${(i * 89) % 420}" r="${i % 9 ? 0.8 : 1.6}" fill="#fff" opacity="${0.4 + (i % 5) / 8}"/>`;
    s += `<path d="M60 -40 Q400 120 760 -40" fill="none" stroke="#2a5aa0" stroke-width="60" opacity=".35"/>`;
    if (view === 0) {
      s += `<circle cx="560" cy="230" r="48" fill="url(#earth)"/><path d="M530 210 q20 -12 36 0 t20 22 q-24 6 -36 -8z M560 250 q18 -2 26 12 q-16 8 -26 -12z" fill="#3a9a4a" opacity=".85"/><ellipse cx="545" cy="215" rx="16" ry="7" fill="#fff" opacity=".35"/>`;
      s += `<path d="M0 330 L90 300 140 318 230 290 300 320 380 300 470 325 560 296 640 322 720 302 800 320 V420 H0Z" fill="#c8c8cc"/><path d="M0 360 Q200 340 400 356 T800 350 V420 H0Z" fill="#9a9aa2"/>`;
      s += [[120, 345, 26], [330, 360, 18], [610, 350, 30]].map(([x, y, r]) => `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * 0.3}" fill="#7a7a84"/><ellipse cx="${x}" cy="${y - 2}" rx="${r * 0.8}" ry="${r * 0.2}" fill="#5a5a64"/>`).join("");
    } else {
      s += `<circle cx="210" cy="190" r="22" fill="#f0d0a0" opacity=".8"/><circle cx="600" cy="140" r="9" fill="#c8a080"/>`;
      s += `<path d="M0 320 L120 280 200 300 300 260 420 300 520 270 640 305 800 280 V420 H0Z" fill="#b8502a"/><path d="M0 350 Q220 320 420 345 T800 335 V420 H0Z" fill="#8a3418"/>`;
      s += `<rect x="470" y="300" width="70" height="36" fill="#d8d8e0"/><path d="M462 300 Q505 260 548 300Z" fill="#e8e8f0"/><rect x="520" y="270" width="4" height="30" fill="#aaa"/><rect x="524" y="270" width="18" height="10" fill="#c83a2a"/>`;
    }
    return s;
  }
  // treehouse
  if (view === 0) {
    let s = `<rect width="800" height="600" fill="#9ad08a"/><rect width="800" height="420" fill="url(#jungle)"/>`;
    for (let i = 0; i < 14; i++) { const x = (i * 71) % 800; s += `<rect x="${x}" y="${60 + (i % 3) * 20}" width="${10 + (i % 4) * 4}" height="400" fill="${["#7a5a3a", "#5a3a20", "#8a6a40"][i % 3]}" opacity=".85"/>`; }
    for (let i = 0; i < 40; i++) s += `<ellipse cx="${(i * 137) % 800}" cy="${(i * 53) % 380}" rx="${30 + (i % 5) * 8}" ry="${14 + (i % 3) * 5}" fill="${["#2f7a2a", "#4a9a3a", "#1f5a20", "#6ab04a"][i % 4]}" opacity=".85" transform="rotate(${(i * 37) % 60 - 30} ${(i * 137) % 800} ${(i * 53) % 380})"/>`;
    for (let i = 0; i < 8; i++) s += `<path d="M${40 + i * 100} 0 q${(i % 2 ? 20 : -20)} 150 ${(i % 2 ? -10 : 10)} 320" stroke="#3a6a20" stroke-width="3" fill="none"/>`;
    return s;
  }
  return `<rect width="800" height="600" fill="url(#beachSky)"/><circle cx="640" cy="120" r="34" fill="#fff6b0"/><rect y="250" width="800" height="90" fill="url(#sea)"/>
    ${[0, 1, 2, 3, 4].map(i => `<path d="M${i * 170} ${270 + i * 12} q30 -6 60 0" stroke="#fff" stroke-width="2" fill="none" opacity=".6"/>`).join("")}
    <path d="M0 330 Q400 300 800 335 V420 H0Z" fill="#f0d898"/><path d="M120 330 q-10 -90 20 -150" stroke="#8a5a2a" stroke-width="10" fill="none"/>
    ${[0, 1, 2, 3, 4].map(i => `<path d="M140 182 q${-60 + i * 30} ${-20 + Math.abs(i - 2) * 10} ${-80 + i * 40} ${20 + Math.abs(i - 2) * 12}" stroke="#2f8a2a" stroke-width="8" fill="none" stroke-linecap="round"/>`).join("")}
    <path d="M600 280 l40 -2 -6 -18z" fill="#fff"/><path d="M598 282 h46 l-6 8 h-34z" fill="#c83a2a"/>`;
}
function roomShell(theme) {
  if (theme === "space") return `
    <rect x="0" y="0" width="800" height="70" fill="#0a0a1a"/>
    <rect x="0" y="118" width="800" height="26" rx="13" fill="url(#plasma)"/><rect x="0" y="122" width="800" height="5" fill="#bfe8ff" opacity=".6"/>
    ${[170, 390, 650].map(x => `<rect x="${x}" y="118" width="30" height="330" fill="url(#plasmaV)"/><rect x="${x + 8}" y="118" width="5" height="330" fill="#bfe8ff" opacity=".5"/><ellipse cx="${x + 15}" cy="450" rx="22" ry="8" fill="#5a1a2a"/>`).join("")}
    <rect x="0" y="140" width="800" height="8" fill="#9a9aaa"/>${Array.from({ length: 40 }, (_, i) => `<circle cx="${10 + i * 20}" cy="144" r="1.8" fill="#555"/>`).join("")}
    <rect x="0" y="400" width="800" height="12" fill="#8a8a9a"/>
    <rect x="0" y="412" width="800" height="188" fill="url(#deck)"/>
    ${Array.from({ length: 14 }, (_, i) => `<line x1="0" y1="${420 + i * i * 1.1 + i * 6}" x2="800" y2="${420 + i * i * 1.1 + i * 6}" stroke="#2a2a3a" stroke-width="${1 + i * 0.15}" opacity=".7"/>`).join("")}`;
  return `
    <path d="M0 0 H800 V110 Q400 160 0 110Z" fill="url(#thatch)"/>${Array.from({ length: 60 }, (_, i) => `<line x1="${i * 14}" y1="0" x2="${i * 14 + 6}" y2="${118 + Math.sin(i) * 8}" stroke="#4a3a1a" stroke-width="1.4" opacity=".6"/>`).join("")}
    <rect x="70" y="128" width="660" height="12" rx="6" fill="#8a5a2a" stroke="#3a2010"/>
    ${[160, 390, 660].map(x => `<path d="M${x} 130 q-8 160 6 320 h28 q-10 -160 -4 -320z" fill="#7a4a24" stroke="#3a2010"/>`).join("")}
    <rect x="0" y="412" width="800" height="188" fill="url(#planks)"/>
    ${Array.from({ length: 10 }, (_, i) => `<line x1="0" y1="${420 + i * 18 + i * i}" x2="800" y2="${420 + i * 18 + i * i}" stroke="#3a2010" stroke-width="1.5" opacity=".7"/>`).join("")}`;
}
function guideSVG(pose = 0) {
  // Pip: propeller beanie, striped shirt, big sneakers. Original character.
  const arm = pose % 2 ? "M-14 -2 q-14 -12 -18 -26" : "M-14 -2 q-16 4 -20 18";
  return `<g class="guide"><ellipse cx="0" cy="62" rx="26" ry="6" fill="#000" opacity=".35"/>
    <path d="M-8 40 v16 h-10 q-6 0 -6 6 h18z M8 40 v16 h10 q6 0 6 6 h-18z" fill="#2a2a8a"/><ellipse cx="-14" cy="62" rx="12" ry="5" fill="#e83a2a"/><ellipse cx="14" cy="62" rx="12" ry="5" fill="#e83a2a"/>
    <path d="M-16 -6 h32 l4 48 h-40z" fill="#f4f4f4"/><path d="M-16 4 h33 M-17 16 h35 M-18 28 h37" stroke="#2a8ae8" stroke-width="5"/>
    <path d="${arm}" stroke="#f0c090" stroke-width="7" stroke-linecap="round" fill="none"/><path d="M14 -2 q16 4 20 18" stroke="#f0c090" stroke-width="7" stroke-linecap="round" fill="none"/>
    <circle cx="0" cy="-22" r="18" fill="#f0c090"/><circle cx="-6" cy="-24" r="3.2" fill="#fff"/><circle cx="7" cy="-24" r="3.2" fill="#fff"/><circle cx="-5.4" cy="-23.6" r="1.6" fill="#111"/><circle cx="7.6" cy="-23.6" r="1.6" fill="#111"/>
    <path d="M-8 -14 q8 8 16 0" stroke="#7a2a1a" stroke-width="2.2" fill="#c83a3a"/><circle cx="-12" cy="-17" r="3" fill="#f08a7a" opacity=".6"/><circle cx="12" cy="-17" r="3" fill="#f08a7a" opacity=".6"/>
    <path d="M-18 -30 q18 -22 36 0z" fill="#e8c020"/><path d="M-18 -30 q9 -14 18 -16 v16z" fill="#e83a2a"/><path d="M18 -30 q-9 -14 -18 -16 v16z" fill="#2a6ae8"/><rect x="-1.5" y="-50" width="3" height="6" fill="#333"/>
    <g class="prop"><ellipse cx="0" cy="-51" rx="14" ry="3" fill="#e83a2a"/></g></g>`;
}

// ---------------------------------------------------------------- render
function render(api) {
  const st = api.state.ks || (api.state.ks = { theme: "space", view: 0, names: false });
  const space = st.theme === "space";
  // The room itself is a pre-rendered still (tools/nav3d/rooms/kidspace.py); the SVG only adds the interactive
  // sprites on top, as in the original. Set R = false to fall back to the old flat-drawn room.
  const R = true, bg = `kid_${st.theme}${st.view}`;
  let s = R ? `<image href="img/nav/${bg}.png" x="0" y="0" width="800" height="600" preserveAspectRatio="none"/>` : outside(st.theme, st.view) + roomShell(st.theme);
  // pillar clock + exit door
  s += hot("k-clock", `<circle cx="665" cy="195" r="15" fill="#f8f4e8" stroke="#8a6a2a" stroke-width="3"/><g class="clock" data-cx="665" data-cy="195" data-r="13"><line class="hh" stroke="#111" stroke-width="2"/><line class="mh" stroke="#111" stroke-width="1.4"/><line class="sh" stroke="#b01010" stroke-width=".6"/></g>`);
  s += hot("k-exit", `<g transform="translate(652 268) rotate(-6)"><rect x="0" y="0" width="34" height="46" rx="2" fill="#6a4a1a" stroke="#2a1a08" stroke-width="2"/><rect x="5" y="5" width="24" height="36" fill="#8a2a1a"/><circle cx="24" cy="24" r="2.4" fill="#e8c020"/><text x="17" y="-4" font-size="9" font-family="Arial" font-weight="bold" fill="#fff" text-anchor="middle">EXIT</text></g>`);
  // the bookcase, with programs on its shelves
  const bc = space ? ["#9a8ad8", "#6a5aa8", "#4a3a88"] : ["#a87a4a", "#7a5428", "#5a3a18"];
  if (!R) {
    s += `<path d="M120 238 L270 238 L290 250 L290 600 L120 600Z" fill="${bc[1]}"/><rect x="120" y="238" width="160" height="362" fill="${bc[0]}"/><rect x="132" y="252" width="136" height="230" fill="${bc[2]}"/>`;
    [322, 400, 478].forEach(y => (s += `<rect x="132" y="${y}" width="136" height="7" fill="${bc[0]}"/>`));
    s += `<rect x="132" y="490" width="64" height="100" fill="${bc[2]}" stroke="${bc[0]}" stroke-width="3"/><rect x="204" y="490" width="64" height="100" fill="${bc[2]}" stroke="${bc[0]}" stroke-width="3"/><circle cx="188" cy="540" r="3" fill="#e8c020"/><circle cx="212" cy="540" r="3" fill="#e8c020"/>`;
  }
  SHELF.forEach(([id, g, name], i) => {
    const r = Math.floor(i / 3), c = i % 3, x = 150 + c * 42, y = 286 + r * 78;
    s += hot("k-app-" + i, `<g class="kapp" data-app="${i}"><rect x="${x - 2}" y="${y - 2}" width="36" height="36" rx="5" fill="#fff" opacity=".18"/><text x="${x + 16}" y="${y + 26}" font-size="26" text-anchor="middle">${g}</text></g>` + tag(x + 16, y - 8, name));
  });
  // skull + jar on top of the bookcase
  s += hot("k-skull", `<g transform="translate(160 214)"><ellipse cx="0" cy="0" rx="18" ry="20" fill="#e8e4d8" stroke="#8a8478" stroke-width="1.5"/><ellipse cx="-7" cy="-2" rx="5" ry="6" fill="#222"/><ellipse cx="7" cy="-2" rx="5" ry="6" fill="#222"/><path d="M-3 8 h6 l-3 -5z" fill="#222"/><rect x="-9" y="14" width="18" height="8" fill="#e8e4d8" stroke="#8a8478"/><path d="M-5 14 v8 M0 14 v8 M5 14 v8" stroke="#8a8478"/></g>`);
  s += hot("k-jar", `<g transform="translate(210 196)"><rect x="-17" y="0" width="34" height="42" rx="6" fill="#bfe0f0" opacity=".55" stroke="#8ab0c0"/><rect x="-19" y="-6" width="38" height="8" rx="2" fill="#c83a2a"/><path class="critter" d="M0 30 q-12 -2 -10 -14 q2 -10 10 -10 q8 0 10 10 q2 12 -10 14z M-6 30 l-6 8 M0 30 v8 M6 30 l6 8" fill="#c83a7a" stroke="#7a1a4a"/><circle cx="-3" cy="16" r="2" fill="#fff"/><circle cx="4" cy="16" r="2" fill="#fff"/></g>`);
  // the dresser with five drawers + the parents' cubby
  const dr = space ? ["#c8c8d0", "#7a7a88", "#3a3a48", "#1a1a24"] : ["#c86a4a", "#8a3a20", "#5a2010", "#3a1408"];
  if (!R) s += `<path d="M700 196 L716 186 L800 186 L800 600 L700 600Z" fill="${dr[1]}"/><rect x="706" y="196" width="94" height="404" fill="${dr[0]}" opacity=".9"/>`;
  DRAWERS.forEach(([name], i) => {
    const y = 206 + i * 56, open = st.open === i, x = open ? 690 : 714, w = open ? 110 : 86;
    // closed drawers are part of the render: just an engraved label (and an invisible hit area)
    const face = open || !R ? `<rect x="${x}" y="${y}" width="${w}" height="46" fill="${dr[2]}" stroke="${dr[3]}" stroke-width="2"/><rect x="${x + 4}" y="${y + 4}" width="${w - 8}" height="38" fill="none" stroke="${dr[0]}" stroke-width="1" opacity=".6"/>`
      : `<rect x="${x}" y="${y}" width="${w}" height="46" fill="#fff" opacity="0"/>`;
    s += hot("k-drawer-" + i, `<g class="drawer${open ? " open" : ""}">${face}<text x="${x + 18}" y="${y + 28}" font-size="12" font-family="Arial" font-weight="bold" fill="#fff" stroke="#000" stroke-width="2.4" paint-order="stroke">${A.esc(name)}</text></g>`);
  });
  s += hot("k-prefs", `<rect x="714" y="490" width="86" height="72" fill="${dr[3]}" opacity="${R ? 0 : 1}" stroke="${dr[0]}" stroke-width="2"/><text x="735" y="530" font-size="20">🔧</text><text x="770" y="530" font-size="20">📋</text>` + tag(757, 484, "For Mom & Dad"));
  // the desk: hazard-striped mat, help box, floppy, glasses, levers, online sign
  if (!R) {
    s += `<path d="M230 476 L640 476 L700 560 L170 560Z" fill="${space ? "#3a3a44" : "#7a5430"}"/><rect x="170" y="560" width="530" height="18" fill="${space ? "#22222a" : "#4a3018"}"/><rect x="196" y="578" width="14" height="22" fill="#222"/><rect x="660" y="578" width="14" height="22" fill="#222"/>`;
    s += `<path d="M300 486 L560 486 L596 548 L262 548Z" fill="url(#hazard)"/><path d="M318 494 L544 494 L572 540 L288 540Z" fill="${space ? "#5a5a66" : "#b88a54"}"/>`;
  }
  s += hot("k-help", `<g transform="translate(250 520)"><path d="M-16 -16 h32 v28 h-32z" fill="url(#candy)" stroke="#5a0a0a" stroke-width="1.5"/><path d="M-16 -16 l6 -7 h32 l-6 7z" fill="#f04a4a" stroke="#5a0a0a"/><path d="M16 -16 l6 -7 v28 l-6 7z" fill="#a01a1a" stroke="#5a0a0a"/><text x="0" y="5" font-size="16" font-weight="bold" text-anchor="middle" fill="#fff" stroke="#5a0a0a" stroke-width=".6">?</text></g>` + tag(250, 492, "Help"));
  s += hot("k-floppy", `<g transform="translate(220 552) rotate(-8)"><rect x="-11" y="-11" width="22" height="22" fill="#222"/><rect x="-6" y="-11" width="12" height="8" fill="#bbb"/><rect x="-7" y="2" width="14" height="9" fill="#fff"/></g>` + tag(220, 535, "Drive A"));
  s += hot("k-names", `<g transform="translate(618 530)"><circle cx="0" cy="0" r="11" fill="#bfe0ff" opacity=".6" stroke="#5a3a1a" stroke-width="3"/><path d="M8 8 l12 12" stroke="#5a3a1a" stroke-width="5" stroke-linecap="round"/></g>` + tag(618, 510, st.names ? "Hide Names" : "Show Names"));
  s += hot("k-room", `<g transform="translate(600 486)"><rect x="-6" y="0" width="12" height="20" fill="#555"/><rect x="-3" y="-22" width="6" height="24" fill="#999" transform="rotate(${space ? -20 : 20} 0 0)"/><circle cx="${space ? -8 : 8}" cy="-21" r="6" fill="#e83a2a"/></g>` + tag(600, 470, "Change Room"));
  s += hot("k-view", `<g transform="translate(560 486)"><rect x="-6" y="0" width="12" height="20" fill="#555"/><rect x="-3" y="-22" width="6" height="24" fill="#999" transform="rotate(${st.view ? 20 : -20} 0 0)"/><circle cx="${st.view ? 8 : -8}" cy="-21" r="6" fill="#3a8ae8"/></g>` + tag(560, 470, "Change View"));
  s += hot("k-online", `<g transform="translate(360 470)"><circle cx="0" cy="0" r="13" fill="url(#earth)" stroke="#222"/><rect x="-3" y="13" width="6" height="12" fill="#888"/></g>` + tag(360, 448, "Online"));
  // trash + the rocket that lives on the floor
  s += hot("k-trash", `<g transform="translate(748 572)"><path d="M-22 -36 L22 -36 L17 22 L-17 22Z" fill="${space ? "#2a6ad0" : "#4a6a3a"}" stroke="#111" stroke-width="1.5"/><ellipse cx="0" cy="-36" rx="22" ry="6" fill="#111" stroke="${space ? "#2a6ad0" : "#4a6a3a"}" stroke-width="2"/></g>` + tag(748, 524, "Trash"));
  s += hot("k-rocket", `<g class="krocket" transform="translate(66 548)"><path d="M0 -36 q10 12 8 30 h-16 q-2 -18 8 -30z" fill="#e8e8f0" stroke="#555"/><circle cx="0" cy="-18" r="4" fill="#3a8ae8"/><path d="M-8 -6 l-6 10 h6z M8 -6 l6 10 h-6z" fill="#e83a2a"/></g>`);
  // the guide's spot (drop target) + the guide himself
  s += `<g id="guideSpot" transform="translate(430 470)">${guideSVG(0)}</g>`;
  s += `<g id="bubble" transform="translate(430 330)" opacity="0"><path d="M-130 -70 h260 q14 0 14 14 v84 q0 14 -14 14 h-110 l-20 26 -2 -26 h-128 q-14 0 -14 -14 v-84 q0 -14 14 -14z" fill="#fff" stroke="#222" stroke-width="2"/><foreignObject x="-128" y="-66" width="256" height="94"><div xmlns="http://www.w3.org/1999/xhtml" class="ksay"></div></foreignObject></g>`;
  s += `<g id="flyer"></g>`;
  const defs = `<radialGradient id="earth" cx=".35" cy=".35" r=".7"><stop offset="0" stop-color="#bfe8ff"/><stop offset=".6" stop-color="#2a6ac8"/><stop offset="1" stop-color="#0a1a4a"/></radialGradient>
    <linearGradient id="plasma" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1a6ae8"/><stop offset=".5" stop-color="#7ad0ff"/><stop offset="1" stop-color="#0a3aa0"/></linearGradient>
    <linearGradient id="plasmaV" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#0a3aa0"/><stop offset=".5" stop-color="#7ad0ff"/><stop offset="1" stop-color="#0a3aa0"/></linearGradient>
    <linearGradient id="deck" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7a7a8a"/><stop offset=".5" stop-color="#9a6a7a"/><stop offset="1" stop-color="#5a4a5a"/></linearGradient>
    <linearGradient id="planks" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8a5a30"/><stop offset="1" stop-color="#4a2a12"/></linearGradient>
    <linearGradient id="thatch" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5a4a24"/><stop offset="1" stop-color="#9a8040"/></linearGradient>
    <linearGradient id="jungle" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cfe8b0"/><stop offset="1" stop-color="#5a9a4a"/></linearGradient>
    <linearGradient id="beachSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a8ae8"/><stop offset="1" stop-color="#bfe8ff"/></linearGradient>
    <linearGradient id="sea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1a6ac8"/><stop offset="1" stop-color="#3ac0d0"/></linearGradient>
    <pattern id="hazard" width="24" height="24" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="24" height="24" fill="#222"/><rect width="12" height="24" fill="#5a5ad0"/></pattern>
    <pattern id="candy" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="10" height="10" fill="#e83a3a"/><rect width="5" height="10" fill="#fff"/></pattern>`;
  return `<svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" class="ks${st.names ? " names" : ""}">${A.defs(defs)}${s}</svg>`;
}

// ---------------------------------------------------------------- behaviour
let sayTimer = 0;
function say(root, api, text, ms = 5200) {
  const b = root.querySelector("#bubble"); if (!b) return;
  b.querySelector(".ksay").textContent = text; b.setAttribute("opacity", "1"); api.sfx.talk();
  const g = root.querySelector("#guideSpot .guide"); g && g.classList.add("talk");
  clearTimeout(sayTimer); sayTimer = setTimeout(() => { b.setAttribute("opacity", "0"); g && g.classList.remove("talk"); }, ms);
}
function launchApp(api, root, i) {
  const [id, , name] = SHELF[i];
  say(root, api, "Here we go: " + name + "!", 2400);
  const g = root.querySelector("#guideSpot .guide"); g && g.classList.add("hop"); setTimeout(() => g && g.classList.remove("hop"), 700);
  api.sfx.boing(); setTimeout(() => api.launch(id), 450);
}
function enter(api, root) {
  const st = api.state.ks, timers = [];
  // first visit: Pip walks in and introduces the room
  const guide = root.querySelector("#guideSpot");
  if (!api.state.ksIntro) {
    api.state.ksIntro = true;
    guide.style.transition = "none"; guide.setAttribute("transform", "translate(900 470)");
    requestAnimationFrame(() => { guide.style.transition = "transform 1.4s ease-out"; guide.setAttribute("transform", "translate(430 470)"); });
    let k = 0; const next = () => { if (k >= INTRO.length || !root.isConnected) return; say(root, api, INTRO[k], 4300); api.say(INTRO[k]); k++; timers.push(setTimeout(next, 4600)); };
    timers.push(setTimeout(next, 1500));
  }
  // things flying around
  const fly = () => {
    const f = root.querySelector("#flyer"); if (!f) return;
    const kind = Math.random(), y = 160 + Math.random() * 120;
    f.innerHTML = kind < 0.5 ? `<g><path d="M0 0 l30 -6 l6 6 l-6 6z" fill="#e8e8f0" stroke="#555"/><path d="M-8 0 l8 -4 v8z" fill="#ff8a2a"/></g>` : `<g><ellipse cx="0" cy="0" rx="26" ry="8" fill="#9aa"/><ellipse cx="0" cy="-5" rx="10" ry="7" fill="#bfe8ff"/>${[-16, 0, 16].map(x => `<circle cx="${x}" cy="3" r="2" fill="#ff0"/>`).join("")}</g>`;
    f.style.transition = "none"; f.setAttribute("transform", `translate(-80 ${y})`);
    requestAnimationFrame(() => requestAnimationFrame(() => { f.style.transition = "transform 4.5s linear"; f.setAttribute("transform", `translate(900 ${y - 40})`); }));
    api.sfx.whoosh();
  };
  timers.push(setInterval(() => { if (Math.random() < 0.6) fly(); }, 14000));
  // drag a program onto the desk to start it
  root.querySelectorAll(".kapp").forEach(app => {
    app.addEventListener("pointerdown", e => {
      const i = +app.dataset.app, svg = root.querySelector("svg"), pt = svg.createSVGPoint();
      const toSvg = ev => { pt.x = ev.clientX; pt.y = ev.clientY; return pt.matrixTransform(svg.getScreenCTM().inverse()); };
      const start = toSvg(e); let moved = false;
      const mv = ev => { const p = toSvg(ev); if (!moved && Math.hypot(p.x - start.x, p.y - start.y) < 6) return; moved = true; app.setAttribute("transform", `translate(${p.x - start.x} ${p.y - start.y})`); };
      const up = ev => {
        window.removeEventListener("pointermove", mv); window.removeEventListener("pointerup", up);
        if (!moved) return; const p = toSvg(ev); app.removeAttribute("transform");
        app.closest(".hot")._dragged = true; setTimeout(() => { const hh = app.closest(".hot"); if (hh) hh._dragged = false; }, 50);
        if (p.x > 280 && p.x < 600 && p.y > 380 && p.y < 560) launchApp(api, root, i); else say(root, api, "Drag it onto the desk where I'm standing!", 2600);
      };
      window.addEventListener("pointermove", mv); window.addEventListener("pointerup", up);
    });
  });
  // so actions can talk
  api.state.ksRoot = root;
  return () => { timers.forEach(t => { clearTimeout(t); clearInterval(t); }); clearTimeout(sayTimer); };
}

const hots = {
  "k-exit": { cap: "Exit", info: "Leave KidSpace.", act: api => api.msg("CONFIRMATION", "Where would you like to go?", ["Go back to the Living Room", "Exit to Windows", "Stay in KidSpace"], { icon: `<span class="mi">🚪</span>`, w: 420 }).then(r => { if (r === 0) api.go(api.V.home); if (r === 1) { if (window.parent !== window) window.parent.postMessage({ type: "win95:close" }, location.origin); else location.href = "index.html"; } }) },
  "k-clock": { cap: "Clock", info: "What time is it?", act: api => say(api.state.ksRoot, api, "It's " + new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }) + "!") },
  "k-skull": { cap: "Skull", info: "It makes animal noises. Nobody knows why.", act: api => { const n = ["Ribbit!", "Ooh ooh aah aah!", "Hissss…", "Moooo!", "Tweet tweet!"][Math.floor(Math.random() * 5)]; api.sfx.boing(); say(api.state.ksRoot, api, "The skull says: " + n, 2400); } },
  "k-jar": { cap: "Critter in a jar", info: "It's friendly. Probably.", act: api => { api.sfx.bubble(); const c = api.state.ksRoot.querySelector(".critter"); c && c.classList.add("wiggle"); setTimeout(() => c && c.classList.remove("wiggle"), 1500); say(api.state.ksRoot, api, "Glorp! (That means hello.)", 2600); } },
  "k-help": { cap: "Help (the striped box)", info: "Click the striped box for help.", act: api => { api.state.ksTip = ((api.state.ksTip || 0) + 1) % HELP.length; const t = HELP[api.state.ksTip]; say(api.state.ksRoot, api, t, 5500); api.say(t); } },
  "k-floppy": { cap: "Drive A", info: "Dom's ABOUT.TXT, on a floppy. Old school.", act: { open: "about" } },
  "k-names": { cap: "Show/Hide Names", info: "Shows the name of everything in the room.", act: api => { const st = api.state.ks; st.names = !st.names; api.sfx[st.names ? "secret" : "click"](); api.state.ksRoot.querySelector("svg").classList.toggle("names", st.names); } },
  "k-room": { cap: "Change Room", info: "Switch between the Space room and the Treehouse.", act: api => { const st = api.state.ks; st.theme = st.theme === "space" ? "tree" : "space"; st.view = 0; api.sfx.whoosh(); api.go("kidspace", { quiet: true }); say(api.state.ksRoot, api, st.theme === "space" ? "Blast off! Back to the space station." : "Welcome to the treehouse!", 2600); } },
  "k-view": { cap: "Change View", info: "Change the view out of the window.", act: api => { const st = api.state.ks; st.view = 1 - st.view; api.sfx.click(); api.go("kidspace", { quiet: true }); say(api.state.ksRoot, api, "Now we're looking at the " + VIEWS[st.theme][st.view] + "!", 2400); } },
  "k-online": { cap: "Online", info: "Go online (with a grown-up).", act: api => api.internet() },
  "k-trash": { cap: "Trash", info: "Throw things away.", act: api => { api.sfx.crumple(); say(api.state.ksRoot, api, "Nothing in here but crumpled-up homework.", 2600); } },
  "k-rocket": { cap: "Toy rocket", info: "3… 2… 1…", act: api => { api.sfx.rocket(); const r = api.state.ksRoot.querySelector(".krocket"); r && r.classList.add("launch"); setTimeout(() => r && r.classList.remove("launch"), 2200); } },
  "k-prefs": { cap: "For Mom & Dad (Preferences)", info: "The bottom drawer lets Mom and Dad organize the room.", act: api => api.msg("Parents Only", "This drawer is for Mom and Dad.<br><br>Add or change applications, add documents, or change the room settings. (In this house, Dom keeps it tidy for you.)", ["Done"], { icon: `<span class="mi">🔧</span>` }).then(() => api.sfx.click()) }
};
SHELF.forEach(([id, , name], i) => (hots["k-app-" + i] = { cap: name, info: "A KidSpace program. Click it, or drag it to the desk!", act: api => { const h = api.state.ksRoot.querySelector(`[data-hot="k-app-${i}"]`); if (h && h._dragged) return; launchApp(api, api.state.ksRoot, i); } }));
export function drawerWin(api, i, onClose) {
  const [name, items] = DRAWERS[i];
  api.sfx.drawer();
  const el = api.win({ title: name, icon: "🗄️", w: 300, cls: "kdrawer", html: `<ul class="kfiles">${items.map(([id, label], k) => `<li><button data-k="${k}"><span>${id.startsWith("@") || id === "about" ? "📄" : id === "paint" ? "🖍️" : "📁"}</span>${A.esc(label)}</button></li>`).join("")}</ul>`, onClose: () => { api.sfx.drawer(); onClose && onClose(); } });
  el.querySelectorAll("[data-k]").forEach(b => b.addEventListener("click", () => { const id = items[+b.dataset.k][0]; api.closeWin(el); if (id === "@family") api.panel("family"); else if (id === "@journal") api.journal(); else api.launch(id); }));
}
DRAWERS.forEach(([name], i) => (hots["k-drawer-" + i] = { cap: name + " drawer", info: "Keep your files and letters in the dresser drawers.", act: api => {
  const st = api.state.ks;
  st.open = i; api.state.ksRoot.querySelectorAll(".drawer").forEach((d, j) => d.classList.toggle("open", j === i));
  drawerWin(api, i, () => { st.open = null; const r = api.state.ksRoot; r && r.querySelectorAll(".drawer").forEach(d => d.classList.remove("open")); });
} }));

export const kidspace = { name: "Ark KidSpace", caption: "KidSpace: the fun place to work and play! Click the striped box for help.", render, enter, hots, noToolbar: true, noTips: true };

// Original 32×32 icons drawn as SVG in a chunky Win95-ish style (no Microsoft artwork).
const svg = (body, vb = 32) =>
  `<svg viewBox="0 0 ${vb} ${vb}" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges" aria-hidden="true">${body}</svg>`;

export const ICONS = {
  computer: svg(`
    <rect x="4" y="3" width="24" height="18" fill="#c0c0c0" stroke="#000"/>
    <rect x="7" y="6" width="18" height="12" fill="#008080" stroke="#404040"/>
    <rect x="8" y="7" width="8" height="2" fill="#5fd" opacity=".5"/>
    <rect x="12" y="21" width="8" height="3" fill="#808080" stroke="#000"/>
    <rect x="3" y="24" width="26" height="5" fill="#c0c0c0" stroke="#000"/>
    <rect x="22" y="26" width="4" height="1" fill="#0a0"/>`),
  navigator: svg(`
    <path d="M3 15 L16 4 L29 15 Z" fill="#a33" stroke="#000" shape-rendering="geometricPrecision"/>
    <rect x="6" y="15" width="20" height="13" fill="#f2e2b8" stroke="#000"/>
    <rect x="9" y="18" width="5" height="5" fill="#8fd0ff" stroke="#000"/>
    <rect x="18" y="19" width="5" height="9" fill="#7a2a14" stroke="#000"/>
    <circle cx="25" cy="7" r="5" fill="#fff" stroke="#c9a54a" stroke-width="1.5" shape-rendering="geometricPrecision"/>
    <path d="M25 3 L26.2 7 L25 11 L23.8 7 Z" fill="#b5121b" shape-rendering="geometricPrecision"/>`),
  navigator39: svg(`
    <path d="M3 15 L16 4 L29 15 Z" fill="#2d5a8a" stroke="#000" shape-rendering="geometricPrecision"/>
    <rect x="6" y="15" width="20" height="13" fill="#e6dcc8" stroke="#000"/>
    <rect x="9" y="18" width="5" height="5" fill="#ffe680" stroke="#000"/>
    <rect x="18" y="19" width="5" height="9" fill="#3a5a2a" stroke="#000"/>
    <rect x="18" y="1" width="13" height="10" fill="#000080" stroke="#000"/>
    <text x="24.5" y="9" text-anchor="middle" font-family="Arial" font-weight="bold" font-size="7.5" fill="#ff0" shape-rendering="geometricPrecision">3.9</text>`),
  textfile: svg(`
    <path d="M7 2 H21 L26 7 V30 H7 Z" fill="#fff" stroke="#000"/>
    <path d="M21 2 V7 H26" fill="#c0c0c0" stroke="#000"/>
    <rect x="10" y="10" width="13" height="1" fill="#000080"/><rect x="10" y="13" width="11" height="1" fill="#000080"/>
    <rect x="10" y="16" width="13" height="1" fill="#000080"/><rect x="10" y="19" width="9" height="1" fill="#000080"/>
    <rect x="10" y="22" width="12" height="1" fill="#000080"/>`),
  linkedin: svg(`
    <path d="M12 9 V6 H20 V9" fill="none" stroke="#000" stroke-width="2" shape-rendering="geometricPrecision"/>
    <rect x="3" y="9" width="26" height="18" rx="2" fill="#8a5a36" stroke="#000"/>
    <rect x="3" y="14" width="26" height="1" fill="#4a2c18"/>
    <rect x="8" y="13" width="3" height="3" fill="#d8b030" stroke="#000"/><rect x="21" y="13" width="3" height="3" fill="#d8b030" stroke="#000"/>
    <rect x="12" y="17" width="8" height="8" rx="1" fill="#0a66c2" stroke="#000"/>
    <text x="16" y="23.5" font-family="Arial" font-weight="bold" font-size="6.5" fill="#fff" text-anchor="middle">in</text>`),
  juice: svg(`
    <path d="M9 8 H23 L21 29 H11 Z" fill="#e8f6ff" stroke="#000"/>
    <path d="M10 14 H22 L21 28 H11 Z" fill="#ff9a1a"/>
    <path d="M10 14 H22 L21.6 18 H10.4 Z" fill="#ffc04a"/>
    <path d="M17 3 L15 20" stroke="#e23b5a" stroke-width="2" shape-rendering="geometricPrecision"/>
    <circle cx="23" cy="9" r="4.5" fill="#7ac943" stroke="#000" shape-rendering="geometricPrecision"/>
    <path d="M23 5 V13 M19 9 H27" stroke="#d8f0a0" stroke-width="1"/>`),
  solitaire: svg(`
    <rect x="4" y="5" width="15" height="21" fill="#fff" stroke="#000" transform="rotate(-10 11 15)"/>
    <rect x="12" y="6" width="15" height="21" fill="#fff" stroke="#000"/>
    <text x="14" y="13" font-family="Arial" font-weight="bold" font-size="7" fill="#c00">A</text>
    <path d="M19.5 15 C17 12 14.5 15 19.5 21 C24.5 15 22 12 19.5 15 Z" fill="#c00" shape-rendering="geometricPrecision"/>
    <rect x="5" y="9" width="5" height="9" fill="#3a5fbf" transform="rotate(-10 11 15)"/>`),
  minesweeper: svg(`
    <rect x="2" y="2" width="28" height="28" fill="#c0c0c0"/>
    <path d="M2 2h28v2H4v26H2z" fill="#fff"/><path d="M30 30H2v-2h26V2h2z" fill="#808080"/>
    <g stroke="#000" stroke-width="2"><line x1="16" y1="6" x2="16" y2="26"/><line x1="6" y1="16" x2="26" y2="16"/><line x1="9" y1="9" x2="23" y2="23"/><line x1="23" y1="9" x2="9" y2="23"/></g>
    <circle cx="16" cy="16" r="7" fill="#000" shape-rendering="geometricPrecision"/>
    <rect x="12" y="12" width="3" height="3" fill="#fff"/>`),
  pinball: svg(`
    <rect x="3" y="3" width="26" height="26" fill="#120a3a" stroke="#000"/>
    <circle cx="23" cy="9" r="4" fill="#3a7bd5" shape-rendering="geometricPrecision"/><path d="M18 10 Q23 7 29 9" stroke="#e8c" fill="none"/>
    <path d="M10 24 L15 27" stroke="#ff8a00" stroke-width="3" stroke-linecap="round" shape-rendering="geometricPrecision"/>
    <path d="M22 24 L17 27" stroke="#ff8a00" stroke-width="3" stroke-linecap="round" shape-rendering="geometricPrecision"/>
    <circle cx="13" cy="15" r="3.5" fill="#ddd" stroke="#555" shape-rendering="geometricPrecision"/><rect x="11.5" y="13" width="1.5" height="1.5" fill="#fff"/>
    <rect x="6" y="6" width="2" height="2" fill="#ff0"/><rect x="9" y="5" width="2" height="2" fill="#0ff"/>`),
  paint: svg(`
    <path d="M4 20 C2 10 12 3 20 5 C30 8 30 18 24 20 C20 21 22 26 17 28 C10 30 5 26 4 20 Z" fill="#e8d3a0" stroke="#000" shape-rendering="geometricPrecision"/>
    <circle cx="10" cy="15" r="2.5" fill="#d22" shape-rendering="geometricPrecision"/><circle cx="14" cy="9" r="2.5" fill="#2a5fd2" shape-rendering="geometricPrecision"/>
    <circle cx="21" cy="9" r="2.5" fill="#1a1" shape-rendering="geometricPrecision"/><circle cx="24" cy="15" r="2.5" fill="#fc0" shape-rendering="geometricPrecision"/>
    <circle cx="11" cy="22" r="2.5" fill="#fff" stroke="#888" shape-rendering="geometricPrecision"/>
    <path d="M17 23 L29 3" stroke="#7a4a1a" stroke-width="2.5" shape-rendering="geometricPrecision"/><path d="M16 26 L18 22 L20 23 Z" fill="#000"/>`),
  doom: svg(`
    <rect x="2" y="2" width="28" height="28" fill="#2a0a00" stroke="#000"/>
    <path d="M7 10 L4 3 L11 8 Z M25 10 L28 3 L21 8 Z" fill="#d8c8a8" stroke="#000" shape-rendering="geometricPrecision"/>
    <path d="M8 9 Q16 4 24 9 L24 19 Q16 27 8 19 Z" fill="#b5651d" stroke="#000" shape-rendering="geometricPrecision"/>
    <rect x="10" y="12" width="4" height="3" fill="#f00"/><rect x="18" y="12" width="4" height="3" fill="#f00"/>
    <path d="M11 20 L13 18 L15 20 L17 18 L19 20 L21 18" stroke="#fff" fill="none" shape-rendering="geometricPrecision"/>
    <rect x="2" y="26" width="28" height="4" fill="#600"/>`),
  notepad: svg(`
    <rect x="6" y="4" width="20" height="25" fill="#fff" stroke="#000"/>
    <rect x="6" y="4" width="20" height="4" fill="#00a"/>
    <g fill="#666"><rect x="9" y="11" width="14" height="1"/><rect x="9" y="14" width="12" height="1"/><rect x="9" y="17" width="14" height="1"/><rect x="9" y="20" width="10" height="1"/><rect x="9" y="23" width="13" height="1"/></g>
    <g fill="#888"><rect x="9" y="2" width="2" height="4"/><rect x="15" y="2" width="2" height="4"/><rect x="21" y="2" width="2" height="4"/></g>`),
  folder: svg(`
    <path d="M2 8 L11 8 L13 10 L29 10 L29 27 L2 27 Z" fill="#ffd94a" stroke="#000"/>
    <path d="M2 12 L29 12" stroke="#c9a400"/><rect x="3" y="13" width="25" height="1" fill="#fff6c0"/>`),
  apps: svg(`
    <path d="M2 8 L11 8 L13 10 L29 10 L29 27 L2 27 Z" fill="#ffd94a" stroke="#000"/>
    <rect x="9" y="14" width="14" height="10" fill="#c0c0c0" stroke="#000"/><rect x="9" y="14" width="14" height="2" fill="#000080"/>`),
  toolbox: svg(`
    <rect x="3" y="12" width="26" height="15" fill="#c8241c" stroke="#000"/>
    <rect x="3" y="12" width="26" height="4" fill="#e04030" stroke="#000"/>
    <path d="M11 12 L11 7 L21 7 L21 12" fill="none" stroke="#000" stroke-width="2"/>
    <rect x="14" y="15" width="4" height="3" fill="#c0c0c0" stroke="#000"/>
    <path d="M24 9 L28 4" stroke="#888" stroke-width="2" shape-rendering="geometricPrecision"/>`),
  recycle: svg(`
    <path d="M7 9 L25 9 L23 29 L9 29 Z" fill="#d8e8e8" stroke="#000"/>
    <rect x="5" y="6" width="22" height="3" fill="#b0c8c8" stroke="#000"/>
    <g stroke="#7a9a9a"><line x1="12" y1="12" x2="12" y2="26"/><line x1="16" y1="12" x2="16" y2="26"/><line x1="20" y1="12" x2="20" y2="26"/></g>
    <path d="M13 3 L19 3 L19 6 L13 6 Z" fill="#fff" stroke="#000"/>`),
  terminal: svg(`
    <rect x="2" y="4" width="28" height="23" fill="#c0c0c0" stroke="#000"/>
    <rect x="2" y="4" width="28" height="4" fill="#000080"/>
    <rect x="4" y="10" width="24" height="15" fill="#000"/>
    <text x="5" y="17" font-family="Courier New, monospace" font-weight="bold" font-size="6" fill="#3dff7a">C:\\&gt;_</text>`),
  readme: svg(`
    <path d="M7 3 L21 3 L26 8 L26 29 L7 29 Z" fill="#fff" stroke="#000"/><path d="M21 3 L21 8 L26 8" fill="#ddd" stroke="#000"/>
    <g fill="#000080"><rect x="10" y="11" width="12" height="1"/><rect x="10" y="14" width="13" height="1"/><rect x="10" y="17" width="10" height="1"/><rect x="10" y="20" width="13" height="1"/><rect x="10" y="23" width="8" height="1"/></g>`),
  help: svg(`
    <rect x="6" y="3" width="20" height="26" fill="#2a5fd2" stroke="#000"/><rect x="8" y="3" width="2" height="26" fill="#1a3f9a"/>
    <text x="17" y="22" font-family="Georgia, serif" font-weight="bold" font-size="17" fill="#ff0" text-anchor="middle">?</text>`),
  run: svg(`
    <rect x="3" y="8" width="26" height="18" fill="#c0c0c0" stroke="#000"/><rect x="3" y="8" width="26" height="4" fill="#000080"/>
    <rect x="6" y="16" width="20" height="5" fill="#fff" stroke="#808080"/><rect x="8" y="17" width="1" height="3" fill="#000"/>`),
  shutdown: svg(`
    <rect x="5" y="4" width="22" height="16" fill="#c0c0c0" stroke="#000"/><rect x="8" y="7" width="16" height="10" fill="#000"/>
    <rect x="3" y="22" width="26" height="6" fill="#c0c0c0" stroke="#000"/>
    <circle cx="16" cy="12" r="3" fill="none" stroke="#ff4040" stroke-width="1.5" shape-rendering="geometricPrecision"/><rect x="15.3" y="7.5" width="1.4" height="4" fill="#ff4040"/>`),
  settings: svg(`
    <rect x="4" y="6" width="24" height="20" fill="#c0c0c0" stroke="#000"/>
    <rect x="8" y="10" width="2" height="12" fill="#404040"/><rect x="6" y="12" width="6" height="3" fill="#ff8040" stroke="#000"/>
    <rect x="15" y="10" width="2" height="12" fill="#404040"/><rect x="13" y="16" width="6" height="3" fill="#40c040" stroke="#000"/>
    <rect x="22" y="10" width="2" height="12" fill="#404040"/><rect x="20" y="11" width="6" height="3" fill="#4080ff" stroke="#000"/>`),
  find: svg(`
    <circle cx="13" cy="13" r="8" fill="#bfe3ff" stroke="#000" stroke-width="2" shape-rendering="geometricPrecision"/>
    <path d="M19 19 L28 28" stroke="#7a4a1a" stroke-width="4" shape-rendering="geometricPrecision"/>`),
  documents: svg(`
    <path d="M2 8 L11 8 L13 10 L29 10 L29 27 L2 27 Z" fill="#ffd94a" stroke="#000"/>
    <rect x="10" y="12" width="12" height="13" fill="#fff" stroke="#000"/>`),
  floppy: svg(`
    <rect x="4" y="4" width="24" height="24" fill="#303040" stroke="#000"/>
    <rect x="9" y="4" width="14" height="9" fill="#c0c0c0" stroke="#000"/><rect x="18" y="5" width="3" height="7" fill="#303040"/>
    <rect x="8" y="17" width="16" height="10" fill="#fff" stroke="#000"/>`),
  globe: svg(`
    <circle cx="16" cy="16" r="12" fill="#2a7fd4" stroke="#000" shape-rendering="geometricPrecision"/>
    <path d="M9 10 C13 8 15 12 12 15 C10 17 13 20 10 23 C7 20 6 14 9 10 Z M18 6 C22 8 25 12 22 14 C19 15 21 19 25 20 C24 24 20 27 17 27 C19 22 15 20 16 16 C17 12 15 9 18 6 Z" fill="#3aa43a" shape-rendering="geometricPrecision"/>`),
  kidspace: svg(`
    <rect x="3" y="6" width="26" height="22" fill="#2a1a5a" stroke="#000"/>
    <circle cx="22" cy="12" r="4" fill="#ffd94a" shape-rendering="geometricPrecision"/>
    <path d="M3 28 C10 20 16 24 22 18 C25 16 28 18 29 19 L29 28 Z" fill="#3aa43a" shape-rendering="geometricPrecision"/>
    <path d="M8 10 l1 2 2 0 -1.6 1.4 .6 2 -2-1.2 -2 1.2 .6-2 L4 12 l2 0 Z" fill="#fff" shape-rendering="geometricPrecision"/>`),
  start: svg(`
    <path d="M2 15 L16 3 L30 15 Z" fill="#e8402a" stroke="#000" shape-rendering="geometricPrecision"/>
    <rect x="5" y="15" width="22" height="14" fill="#2a6ad8" stroke="#000"/>
    <rect x="8" y="18" width="6" height="5" fill="#f2c400" stroke="#000"/>
    <rect x="18" y="19" width="6" height="10" fill="#3aa43a" stroke="#000"/>`),
  speaker: svg(`<path d="M3 11 L9 11 L16 5 L16 27 L9 21 L3 21 Z" fill="#c0c0c0" stroke="#000"/><path d="M20 11 Q24 16 20 21 M23 8 Q29 16 23 24" stroke="#000" fill="none" stroke-width="2" shape-rendering="geometricPrecision"/>`),
  // an original "browser" icon: a globe with a page behind it (no IE logo)
  iexplore: svg(`
    <rect x="3" y="3" width="20" height="24" fill="#fff" stroke="#000"/><path d="M6 8h14M6 11h10" stroke="#808080"/>
    <circle cx="20" cy="19" r="9" fill="#1e6fd8" stroke="#000" shape-rendering="geometricPrecision"/>
    <path d="M11.5 16h17M11.5 22h17M20 10c-4 5-4 13 0 18M20 10c4 5 4 13 0 18" stroke="#9fd2ff" fill="none" shape-rendering="geometricPrecision"/>
    <path d="M10 22 Q20 12 31 15" stroke="#ffd84a" stroke-width="2" fill="none" shape-rendering="geometricPrecision"/>`),
  domonline: svg(`
    <circle cx="16" cy="16" r="13" fill="#ffd84a" stroke="#0a3d7a" stroke-width="2" shape-rendering="geometricPrecision"/>
    <path d="M7 17 L16 8 L25 17 Z" fill="#0a3d7a"/><rect x="10" y="17" width="12" height="8" fill="#e8402a"/><rect x="14" y="20" width="4" height="5" fill="#ffd84a"/>
    <ellipse cx="16" cy="16" rx="15" ry="5" fill="none" stroke="#2a8ad8" stroke-width="1.6" stroke-dasharray="4 2" transform="rotate(-18 16 16)" shape-rendering="geometricPrecision"/>`),
  inbox: svg(`
    <path d="M3 16 L7 6 H25 L29 16 V27 H3 Z" fill="#ffd84a" stroke="#806000"/>
    <path d="M3 16 H10 L12 19 H20 L22 16 H29" fill="none" stroke="#806000"/>
    <rect x="9" y="8" width="14" height="9" fill="#fff" stroke="#000"/><path d="M9 8 l7 5 7-5" fill="none" stroke="#000"/>`),
  dialup: svg(`
    <rect x="2" y="14" width="13" height="10" fill="#c0c0c0" stroke="#000"/><rect x="4" y="16" width="9" height="6" fill="#008080"/>
    <rect x="17" y="6" width="13" height="10" fill="#c0c0c0" stroke="#000"/><rect x="19" y="8" width="9" height="6" fill="#008080"/>
    <path d="M9 24 Q12 30 23 16" stroke="#000" fill="none" shape-rendering="geometricPrecision"/>`),
  freecell: svg(`
    <rect x="4" y="5" width="14" height="20" fill="#fff" stroke="#000"/><text x="7" y="13" font-size="7" font-family="Arial" font-weight="bold" fill="#d00">A</text>
    <rect x="13" y="8" width="14" height="20" fill="#fff" stroke="#000"/><text x="16" y="16" font-size="7" font-family="Arial" font-weight="bold">K</text>
    <path d="M20 19 l3 5 h-6 z" fill="#000" shape-rendering="geometricPrecision"/>`),
  hearts: svg(`
    <rect x="5" y="4" width="16" height="22" fill="#fff" stroke="#000" transform="rotate(-10 13 15)"/>
    <rect x="11" y="6" width="16" height="22" fill="#fff" stroke="#000"/>
    <path d="M19 24 C12 18 13 13 16 13 C18 13 19 15 19 16 C19 15 20 13 22 13 C25 13 26 18 19 24 Z" fill="#d00" shape-rendering="geometricPrecision"/>`),
  ski: svg(`
    <rect x="0" y="0" width="32" height="32" fill="#fff"/>
    <path d="M4 26 L9 14 L14 26 Z M22 12 L26 4 L30 12 Z" fill="#1a7a2a" stroke="#0a400a"/>
    <circle cx="17" cy="11" r="2.5" fill="#e8b080" stroke="#000" shape-rendering="geometricPrecision"/><rect x="15" y="13" width="4" height="7" fill="#d82020" stroke="#000"/>
    <path d="M12 23 L22 19 M13 25 L23 21" stroke="#000" stroke-width="1.5"/>`),
  calc: svg(`
    <rect x="6" y="2" width="20" height="28" fill="#c0c0c0" stroke="#000"/><rect x="9" y="5" width="14" height="6" fill="#d8f0d0" stroke="#000"/>
    <g fill="#fff" stroke="#000"><rect x="9" y="14" width="4" height="3"/><rect x="14" y="14" width="4" height="3"/><rect x="9" y="19" width="4" height="3"/><rect x="14" y="19" width="4" height="3"/><rect x="9" y="24" width="4" height="3"/><rect x="14" y="24" width="4" height="3"/></g>
    <g fill="#e0a0a0" stroke="#000"><rect x="19" y="14" width="4" height="3"/><rect x="19" y="19" width="4" height="8"/></g>`),
  wordpad: svg(`
    <rect x="5" y="3" width="20" height="26" fill="#fff" stroke="#000"/>
    <path d="M8 8h14M8 11h14M8 14h10M8 17h14M8 20h8" stroke="#000080"/>
    <path d="M17 27 L28 12 L30 14 L19 29 Z" fill="#ffd84a" stroke="#000"/><path d="M17 27 L19 29 L16 30 Z" fill="#000"/>`),
  screensaver: svg(`
    <rect x="3" y="4" width="26" height="19" fill="#c0c0c0" stroke="#000"/><rect x="6" y="7" width="20" height="13" fill="#000"/>
    <g fill="#fff"><rect x="9" y="9" width="1" height="1"/><rect x="20" y="10" width="2" height="2"/><rect x="14" y="15" width="1" height="1"/><rect x="11" y="17" width="2" height="2"/></g>
    <rect x="12" y="23" width="8" height="3" fill="#808080" stroke="#000"/><rect x="8" y="26" width="16" height="3" fill="#c0c0c0" stroke="#000"/>`),
  // ---- arcade games (original pixel icons, no game artwork)
  keen: svg(`
    <rect x="2" y="2" width="28" height="28" fill="#5555ff" stroke="#000"/>
    <path d="M9 13 Q9 5 16 5 Q23 5 23 13 Z" fill="#ffff55" stroke="#000" shape-rendering="geometricPrecision"/>
    <rect x="15" y="2" width="2" height="4" fill="#ff5555"/>
    <rect x="10" y="13" width="12" height="9" fill="#ffccaa" stroke="#000"/>
    <rect x="12" y="15" width="2" height="2" fill="#000"/><rect x="18" y="15" width="2" height="2" fill="#000"/>
    <rect x="14" y="19" width="4" height="1" fill="#a00"/>
    <rect x="11" y="22" width="10" height="5" fill="#55ff55" stroke="#000"/>
    <rect x="3" y="27" width="26" height="2" fill="#00aa00"/>`),
  ontherun: svg(`
    <rect x="2" y="2" width="28" height="28" fill="#1a1a2a" stroke="#000"/>
    <path d="M2 30 L13 12 H19 L30 30 Z" fill="#555"/>
    <path d="M15.5 14 V17 M15.5 20 V24 M15.5 27 V30" stroke="#ff0"/>
    <rect x="10" y="20" width="12" height="6" fill="#d22" stroke="#000"/><rect x="12" y="17" width="8" height="4" fill="#8cf" stroke="#000"/>
    <rect x="9" y="25" width="3" height="3" fill="#000"/><rect x="20" y="25" width="3" height="3" fill="#000"/>
    <rect x="4" y="4" width="4" height="3" fill="#f00"/><rect x="8" y="4" width="4" height="3" fill="#00f"/>`),
  robotrage: svg(`
    <rect x="2" y="2" width="28" height="28" fill="#2a2a2a" stroke="#000"/>
    <rect x="8" y="7" width="16" height="11" fill="#9ab" stroke="#000"/>
    <rect x="10" y="10" width="4" height="3" fill="#f22"/><rect x="18" y="10" width="4" height="3" fill="#f22"/>
    <path d="M10 15 L12 16 L14 15 L16 16 L18 15 L20 16 L22 15" stroke="#000" fill="none"/>
    <rect x="15" y="3" width="2" height="4" fill="#666"/><rect x="14" y="2" width="4" height="2" fill="#fc0"/>
    <rect x="5" y="19" width="22" height="6" fill="#678" stroke="#000"/>
    <circle cx="9" cy="27" r="2.5" fill="#111" stroke="#888" shape-rendering="geometricPrecision"/><circle cx="23" cy="27" r="2.5" fill="#111" stroke="#888" shape-rendering="geometricPrecision"/>`),
  victorvector: svg(`
    <rect x="2" y="2" width="28" height="28" fill="#0b2a10" stroke="#000"/>
    <circle cx="16" cy="16" r="11" fill="none" stroke="#9cff3a" stroke-width="2" shape-rendering="geometricPrecision"/>
    <path d="M9 10 L16 24 L23 10" fill="none" stroke="#fff" stroke-width="3" shape-rendering="geometricPrecision"/>
    <path d="M9 10 L16 24 L23 10" fill="none" stroke="#3ad0ff" stroke-width="1.5" shape-rendering="geometricPrecision"/>
    <rect x="22" y="22" width="6" height="4" fill="#c8a060" stroke="#000"/><rect x="26" y="20" width="2" height="2" fill="#c8a060"/>`),
  arkanoid: svg(`
    <rect x="2" y="2" width="28" height="28" fill="#000" stroke="#000"/>
    <rect x="2" y="2" width="28" height="2" fill="#aaa"/><rect x="2" y="2" width="2" height="28" fill="#aaa"/><rect x="28" y="2" width="2" height="28" fill="#aaa"/>
    <g stroke="#000"><rect x="5" y="6" width="5" height="3" fill="#ccc"/><rect x="10" y="6" width="6" height="3" fill="#ccc"/><rect x="16" y="6" width="6" height="3" fill="#ccc"/><rect x="22" y="6" width="5" height="3" fill="#ccc"/>
    <rect x="5" y="9" width="5" height="3" fill="#e33"/><rect x="10" y="9" width="6" height="3" fill="#e33"/><rect x="16" y="9" width="6" height="3" fill="#fd3"/><rect x="22" y="9" width="5" height="3" fill="#fd3"/>
    <rect x="5" y="12" width="5" height="3" fill="#36f"/><rect x="16" y="12" width="6" height="3" fill="#f3c"/><rect x="22" y="12" width="5" height="3" fill="#3d3"/></g>
    <rect x="15" y="19" width="2" height="2" fill="#fff"/>
    <rect x="10" y="25" width="12" height="3" fill="#ccc" stroke="#000"/><rect x="10" y="25" width="2" height="3" fill="#e33"/><rect x="20" y="25" width="2" height="3" fill="#e33"/>`),
  arena: svg(`
    <path d="M6 4 H26 V15 Q26 25 16 29 Q6 25 6 15 Z" fill="#7a1a10" stroke="#000" shape-rendering="geometricPrecision"/>
    <path d="M9 7 H23 V15 Q23 22 16 25 Q9 22 9 15 Z" fill="#d8b030" stroke="#000" shape-rendering="geometricPrecision"/>
    <path d="M11 9 L21 21 M21 9 L11 21" stroke="#e8e8e8" stroke-width="2.5" shape-rendering="geometricPrecision"/>
    <path d="M11 9 L21 21 M21 9 L11 21" stroke="#555" stroke-width="1" shape-rendering="geometricPrecision"/>`),
  daggerfall: svg(`
    <rect x="2" y="2" width="28" height="28" fill="#1a1630" stroke="#000"/>
    <circle cx="23" cy="8" r="3.5" fill="#eee" shape-rendering="geometricPrecision"/>
    <path d="M15 3 L18 3 L17.5 19 L15.5 19 Z" fill="#ddd" stroke="#000" shape-rendering="geometricPrecision"/>
    <rect x="11" y="19" width="11" height="2" fill="#c9a54a" stroke="#000"/>
    <rect x="15" y="21" width="3" height="6" fill="#6a3a1a" stroke="#000"/><rect x="14.5" y="27" width="4" height="2" fill="#c9a54a" stroke="#000"/>`)
};

// Generic per-app icon for tools that live in the toolbox folder.
export function iconFor(id) { return ICONS[id] || ICONS.readme; }

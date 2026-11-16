// =====================================================================
//  desktop.js — a small Windows 95-style shell: icons, windows, taskbar,
//  Start menu, dialogs. Programs are iframes or little built-in views.
// =====================================================================
import { ICONS } from "./icons.js";
import { paintWallpaper } from "./wallpaper.js";
import { PROFILE, APPS, TRINKETS, CERTIFICATIONS, VOLUNTEERING } from "../data.js";
import { sfx, isMuted, setMuted } from "../audio.js";

const $ = (s, r = document) => r.querySelector(s);
const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const h = html => { const t = document.createElement("template"); t.innerHTML = html.trim(); return t.content.firstElementChild; };
const small = () => window.innerWidth <= 700;
const TB = 30;

// ---------------------------------------------------------------- programs
const README = `README.TXT
==========

Hi, I'm ${PROFILE.name}.
${PROFILE.title}

${PROFILE.about.join("\n\n")}

CERTIFICATIONS
--------------
${CERTIFICATIONS.map(c => "  * " + c.name + (c.code && !c.name.includes(c.code) ? " (" + c.code + ")" : "")).join("\n")}

GIVING BACK
-----------
${VOLUNTEERING.map(v => "  * " + v.name).join("\n")}

WHAT'S ON THIS COMPUTER
-----------------------
  Navigator ........ a 3D house tour of everything I've built
                     (an homage to Packard Bell Navigator, 1995)
  LinkedIn ......... my professional side
  My Apps .......... full apps: Ranked Choice Voting, Secret Santa,
                     Kojima Name Generator, Lost at Sea, Squeeze Play
                     (cold-press juice recipes) and more
  Toolbox .......... 21 tiny web tools (the junk drawer)
  Games ............ Solitaire, Minesweeper, Space Pinball, DOOM
  Paint ............ go on, draw something
  Recycle Bin ...... my old green-screen homepage. I couldn't
                     bring myself to empty it.

TIPS
----
  * Double-click icons. On a phone, a single tap works.
  * Windows drag by the title bar and resize from the corner.
  * Start > Run... understands a few commands. Try "help".
  * Something about the Navigator house is... curious.
`;

const P = {
  mycomputer: { title: "My Computer", icon: "computer", folder: ["navigator", "apps", "games", "toolbox", "floppy", "controlpanel", "recycle"], w: 440, h: 300 },
  navigator: { title: "Navigator", icon: "navigator", url: "navigator.html", w: 1000, h: 680, max: true },
  linkedin: { title: "Dominic Cerchio — LinkedIn", icon: "linkedin", view: "linkedin", w: 480, h: 560, label: "LinkedIn" },
  readme: { title: "README.TXT - Notepad", icon: "notepad", view: "notepad", text: README, w: 560, h: 420, label: "README.TXT" },
  notepad: { title: "Untitled - Notepad", icon: "notepad", view: "notepad", text: "", w: 480, h: 340 },
  solitaire: { title: "Solitaire", icon: "solitaire", url: "apps/win95/solitaire.html?embed=1", w: 720, h: 540 },
  minesweeper: { title: "Minesweeper", icon: "minesweeper", url: "apps/win95/minesweeper.html?embed=1", w: 260, h: 360 },
  pinball: { title: "Space Pinball", icon: "pinball", url: "apps/win95/pinball.html?embed=1", w: 820, h: 640, label: "3D Pinball" },
  paint: { title: "untitled - Paint", icon: "paint", url: "apps/win95/paint.html?embed=1", w: 820, h: 600, label: "Paint" },
  doom: { title: "DOOM", icon: "doom", url: "apps/doom/index.html", w: 660, h: 470 },
  apps: { title: "My Apps", icon: "apps", folder: [], w: 480, h: 300 },
  games: { title: "Games", icon: "folder", folder: ["solitaire", "minesweeper", "pinball", "doom", "app-kojima", "app-lostatsea", "app-everybodyisjohn"], w: 480, h: 280 },
  toolbox: { title: "Toolbox", icon: "toolbox", folder: [], w: 560, h: 380 },
  recycle: { title: "Recycle Bin", icon: "recycle", folder: ["oldsite"], w: 380, h: 240 },
  oldsite: { title: "dominiccerchio — the old homepage", icon: "terminal", url: "terminal.html", w: 760, h: 560, label: "old_homepage.htm" },
  terminal: { title: "MS-DOS Prompt", icon: "terminal", url: "terminal.html", w: 760, h: 560, label: "MS-DOS Prompt" },
  floppy: { title: "3½ Floppy (A:)", icon: "floppy", folder: ["oldsite"], w: 380, h: 240 },
  controlpanel: { title: "Display Properties", icon: "settings", view: "display", w: 360, h: 300, label: "Display" },
  help: { title: "Help", icon: "help", view: "help", w: 460, h: 380 },
  run: { title: "Run", icon: "run", view: "run", w: 360, h: 170, dialog: true },
  find: { title: "Find: All Files", icon: "find", view: "find", w: 420, h: 360 },
  welcome: { title: "Welcome", icon: "computer", view: "welcome", w: 520, h: 300, dialog: true }
};
Object.entries(APPS).forEach(([id, a]) => {
  const icon = { rankedchoicevoting: "apps", secretsanta: "apps", kojima: "apps", lostatsea: "apps", everybodyisjohn: "apps", juicer: "juice", archived: "folder" }[id] || "apps";
  P["app-" + id] = { title: a.title, icon, url: a.url, w: 900, h: 640, desc: a.desc };
  P.apps.folder.push("app-" + id);
});
TRINKETS.forEach(t => {
  P["tk-" + t.id] = { title: t.name + " — " + t.id, icon: "readme", url: "toolbox.html?embed=1#" + t.id, w: 760, h: 560, label: t.id, desc: t.desc };
  P.toolbox.folder.push("tk-" + t.id);
});
P.apps.folder.push("toolbox", "navigator");

const DESKTOP = ["mycomputer", "navigator", "linkedin", "readme", "solitaire", "minesweeper", "pinball", "paint", "doom", "app-juicer", "apps", "toolbox", "recycle"];

// ---------------------------------------------------------------- wallpaper
const wp = $("#wallpaper");
function applyWallpaper() {
  const mode = localStorage.getItem("w95.wallpaper") || "hills";
  document.body.classList.toggle("wp-teal", mode === "teal");
  if (mode !== "teal") paintWallpaper(wp);
}
let rz; window.addEventListener("resize", () => { clearTimeout(rz); rz = setTimeout(applyWallpaper, 150); });
applyWallpaper();

// ---------------------------------------------------------------- desktop icons
function iconEl(id, inFolder) {
  const p = P[id];
  const b = h(`<button class="dicon" data-id="${id}" title="${esc(p.desc || p.title)}"><span class="ico">${ICONS[p.icon]}</span><span class="lbl">${esc(p.label || p.title)}</span></button>`);
  b.addEventListener("click", e => {
    document.querySelectorAll(".dicon.sel").forEach(x => x.classList.remove("sel"));
    b.classList.add("sel");
    if (e.pointerType === "touch" || matchMedia("(pointer: coarse)").matches) open(id);
  });
  b.addEventListener("dblclick", () => open(id));
  b.addEventListener("keydown", e => { if (e.key === "Enter") open(id); });
  return b;
}
const iconsHost = $("#icons");
DESKTOP.forEach(id => iconsHost.appendChild(iconEl(id)));
$("#desktop").addEventListener("pointerdown", e => { if (e.target.id === "icons" || e.target.id === "desktop") document.querySelectorAll(".dicon.sel").forEach(x => x.classList.remove("sel")); });

// ---------------------------------------------------------------- window manager
const wins = new Map();   // id -> win
let zTop = 10, cascade = 0, active = null;

const TB_BTN = {
  min: `<svg viewBox="0 0 8 7"><rect x="1" y="5" width="6" height="2"/></svg>`,
  max: `<svg viewBox="0 0 8 7"><path d="M0 0h8v7H0z M1 2v4h6V2z" fill-rule="evenodd"/></svg>`,
  restore: `<svg viewBox="0 0 8 7"><path d="M2 0h6v5H6V2H2z M0 2h6v5H0z M1 4v2h4V4z" fill-rule="evenodd"/></svg>`,
  close: `<svg viewBox="0 0 8 7"><path d="M0 0h2l2 2 2-2h2v1L6 3.5 8 6v1H6L4 5 2 7H0V6l2-2.5L0 1z"/></svg>`
};

const has = id => typeof id === "string" && Object.prototype.hasOwnProperty.call(P, id);
function open(id, opts = {}) {
  if (!has(id)) return null;
  const p = P[id];
  sfx.unlock();
  if (wins.has(id)) { const w = wins.get(id); if (w.minimized) restore(w); focus(w); return w; }
  closeStart();
  const vw = window.innerWidth, vh = window.innerHeight - TB;
  const w = Math.min(p.w, vw - 8), hgt = Math.min(p.h + 24, vh - 8);
  const x = Math.max(4, Math.min(vw - w - 4, 40 + (cascade % 8) * 26)), y = Math.max(4, Math.min(vh - hgt - 4, 24 + (cascade % 8) * 26));
  cascade++;
  const el = h(`<section class="window raised" role="dialog" aria-label="${esc(p.title)}" style="left:${x}px;top:${y}px;width:${w}px;height:${hgt}px">
    <div class="titlebar"><span class="ticon">${ICONS[p.icon]}</span><span class="ttext">${esc(p.title)}</span>
      ${p.dialog ? "" : `<button class="tbtn" data-a="min" aria-label="Minimize">${TB_BTN.min}</button><button class="tbtn" data-a="max" aria-label="Maximize">${TB_BTN.max}</button>`}
      <button class="tbtn close" data-a="close" aria-label="Close">${TB_BTN.close}</button></div>
    <div class="wbody"></div>${p.dialog ? "" : `<div class="grip"></div>`}</section>`);
  $("#desktop").appendChild(el);
  const win = { id, p, el, body: $(".wbody", el), minimized: false, maximized: false, rect: null };
  wins.set(id, win);
  // contents
  if (p.url) {
    const f = document.createElement("iframe");
    f.src = p.url; f.title = p.title; f.allow = "autoplay; fullscreen; clipboard-write"; f.loading = "eager";
    win.body.appendChild(f); win.frame = f;
  } else if (p.folder) folderView(win);
  else VIEWS[p.view](win, opts);
  // taskbar button
  if (!p.dialog) {
    win.task = h(`<button class="task btn" title="${esc(p.title)}">${ICONS[p.icon]}<span>${esc(p.title)}</span></button>`);
    win.task.addEventListener("click", () => { if (active === win && !win.minimized) minimize(win); else { restore(win); focus(win); } });
    $("#tasks").appendChild(win.task);
  }
  wireWindow(win);
  if ((p.max || small()) && !p.dialog) maximize(win);
  focus(win);
  return win;
}
function focus(win) {
  if (!win) return;
  win.el.style.zIndex = ++zTop;
  wins.forEach(w => { w.el.classList.toggle("active", w === win); w.task && w.task.classList.toggle("active", w === win && !w.minimized); });
  active = win;
  if (win.frame) { try { win.frame.contentWindow.focus(); } catch (e) {} }
}
function close(win) {
  win.el.remove(); win.task && win.task.remove(); wins.delete(win.id);
  if (active === win) { active = null; const top = [...wins.values()].filter(w => !w.minimized).sort((a, b) => b.el.style.zIndex - a.el.style.zIndex)[0]; if (top) focus(top); }
}
function minimize(win) { win.minimized = true; win.el.hidden = true; win.task && win.task.classList.remove("active"); if (active === win) active = null; }
function restore(win) { win.minimized = false; win.el.hidden = false; }
function maximize(win) {
  const btn = $('[data-a="max"]', win.el);
  if (!win.maximized) {
    win.rect = { left: win.el.style.left, top: win.el.style.top, width: win.el.style.width, height: win.el.style.height };
    Object.assign(win.el.style, { left: "0px", top: "0px", width: "100vw", height: `calc(100vh - ${TB}px)` });
    win.maximized = true; win.el.classList.add("maximized"); if (btn) btn.innerHTML = TB_BTN.restore;
  } else {
    Object.assign(win.el.style, win.rect); win.maximized = false; win.el.classList.remove("maximized"); if (btn) btn.innerHTML = TB_BTN.max;
  }
}
function wireWindow(win) {
  const el = win.el, tb = $(".titlebar", el);
  el.addEventListener("pointerdown", () => { if (active !== win) focus(win); }, true);
  tb.addEventListener("click", e => {
    const a = e.target.closest("[data-a]"); if (!a) return;
    if (a.dataset.a === "close") close(win); else if (a.dataset.a === "min") minimize(win); else maximize(win);
  });
  tb.addEventListener("dblclick", e => { if (!e.target.closest("[data-a]") && !win.p.dialog) maximize(win); });
  // drag
  tb.addEventListener("pointerdown", e => {
    if (e.target.closest("[data-a]") || win.maximized || small()) return;
    const sx = e.clientX, sy = e.clientY, ox = el.offsetLeft, oy = el.offsetTop;
    document.body.classList.add("dragging"); tb.setPointerCapture(e.pointerId);
    const mv = ev => {
      el.style.left = Math.min(window.innerWidth - 40, Math.max(-el.offsetWidth + 60, ox + ev.clientX - sx)) + "px";
      el.style.top = Math.min(window.innerHeight - TB - 20, Math.max(0, oy + ev.clientY - sy)) + "px";
    };
    const up = () => { document.body.classList.remove("dragging"); tb.removeEventListener("pointermove", mv); tb.removeEventListener("pointerup", up); tb.removeEventListener("pointercancel", up); };
    tb.addEventListener("pointermove", mv); tb.addEventListener("pointerup", up); tb.addEventListener("pointercancel", up);
  });
  // resize
  const grip = $(".grip", el);
  if (grip) grip.addEventListener("pointerdown", e => {
    e.preventDefault(); const sx = e.clientX, sy = e.clientY, ow = el.offsetWidth, oh = el.offsetHeight; win.userSized = true;
    document.body.classList.add("dragging"); grip.setPointerCapture(e.pointerId);
    const mv = ev => { el.style.width = Math.max(200, ow + ev.clientX - sx) + "px"; el.style.height = Math.max(120, oh + ev.clientY - sy) + "px"; };
    const up = () => { document.body.classList.remove("dragging"); grip.removeEventListener("pointermove", mv); grip.removeEventListener("pointerup", up); grip.removeEventListener("pointercancel", up); };
    grip.addEventListener("pointermove", mv); grip.addEventListener("pointerup", up); grip.addEventListener("pointercancel", up);
  });
}
// clicking into an iframe doesn't bubble to us; notice when focus moves into one
window.addEventListener("blur", () => setTimeout(() => {
  const a = document.activeElement;
  if (a && a.tagName === "IFRAME") { const w = [...wins.values()].find(w => w.frame === a); if (w && active !== w) focus(w); }
}, 0));
// child pages can ask to close their own window or retitle it
window.addEventListener("message", e => {
  if (e.origin !== location.origin || !e.data) return;
  const w = [...wins.values()].find(w => w.frame && w.frame.contentWindow === e.source);
  if (!w) return;
  if (e.data.type === "nav-close" || e.data.type === "win-close" || e.data.type === "win95:close") close(w);
  if (e.data.type === "win95:app-size" && !w.maximized && !w.userSized && Number.isFinite(e.data.width) && Number.isFinite(e.data.height)) {
    // content asked for a size (e.g. Minesweeper changing levels): fit the window around it
    const cw = Math.min(window.innerWidth - 8, e.data.width + 6), ch = Math.min(window.innerHeight - TB - 8, e.data.height + 26);
    w.el.style.width = cw + "px"; w.el.style.height = ch + "px";
    w.el.style.left = Math.min(parseFloat(w.el.style.left), window.innerWidth - cw - 4) + "px";
  }
  if (e.data.type === "win-title" && typeof e.data.title === "string") { $(".ttext", w.el).textContent = e.data.title.slice(0, 80); }
  if (e.data.type === "win-open" && has(e.data.id)) open(e.data.id);
});

// ---------------------------------------------------------------- menus inside windows
function menubar(win, menus) {
  const bar = h(`<div class="menubar"></div>`);
  Object.entries(menus).forEach(([name, items]) => {
    const b = h(`<button>${esc(name)}</button>`);
    b.addEventListener("click", e => {
      e.stopPropagation(); closeMenus();
      const m = h(`<div class="menu raised"></div>`);
      items.forEach(it => {
        if (it === "-") return m.appendChild(document.createElement("hr"));
        const mi = h(`<button>${esc(it[0])}</button>`); mi.addEventListener("click", () => { closeMenus(); it[1](); }); m.appendChild(mi);
      });
      const r = b.getBoundingClientRect(); m.style.left = r.left + "px"; m.style.top = r.bottom + "px"; m.style.zIndex = 99999;
      document.body.appendChild(m); b.classList.add("open"); m.dataset.menu = "1";
    });
    bar.appendChild(b);
  });
  win.body.prepend(bar);
}
function closeMenus() { document.querySelectorAll("[data-menu]").forEach(m => m.remove()); document.querySelectorAll(".menubar .open").forEach(b => b.classList.remove("open")); }
document.addEventListener("pointerdown", e => { if (!e.target.closest(".menu")) closeMenus(); });

// ---------------------------------------------------------------- message box
export function msgbox(title, text, { icon = "info", buttons = ["OK"] } = {}) {
  return new Promise(resolve => {
    const id = "msg-" + Math.random().toString(36).slice(2);
    P[id] = { title, icon: "help", view: "msg", w: 340, h: 130, dialog: true };
    const win = open(id, { text, icon, buttons, resolve });
    sfx.click();
    // center it
    const r = win.el.getBoundingClientRect();
    win.el.style.left = (window.innerWidth - r.width) / 2 + "px"; win.el.style.top = (window.innerHeight - TB - r.height) / 2.4 + "px";
  });
}
const MSG_ICON = {
  info: `<svg viewBox="0 0 32 32"><circle cx="16" cy="16" r="14" fill="#fff" stroke="#000"/><circle cx="16" cy="9" r="2.5" fill="#00f"/><rect x="13.5" y="13" width="5" height="12" fill="#00f"/></svg>`,
  warn: `<svg viewBox="0 0 32 32"><path d="M16 2 L31 29 H1 Z" fill="#ff0" stroke="#000"/><rect x="14.5" y="10" width="3" height="11" fill="#000"/><rect x="14.5" y="23" width="3" height="3" fill="#000"/></svg>`,
  q: `<svg viewBox="0 0 32 32"><circle cx="16" cy="16" r="14" fill="#fff" stroke="#000"/><text x="16" y="23" text-anchor="middle" font-family="Times New Roman" font-weight="bold" font-size="20" fill="#00f">?</text></svg>`
};

// ---------------------------------------------------------------- views
const VIEWS = {
  msg(win, { text, icon, buttons, resolve }) {
    win.body.innerHTML = `<div class="dlg"><div class="row"><span class="big">${MSG_ICON[icon]}</span><div>${text}</div></div><div class="btns center">${buttons.map((b, i) => `<button class="btn${i ? "" : " default"}" data-i="${i}">${esc(b)}</button>`).join("")}</div></div>`;
    win.body.querySelectorAll("[data-i]").forEach(b => b.addEventListener("click", () => { close(win); delete P[win.id]; resolve(+b.dataset.i); }));
    $(".tbtn.close", win.el).addEventListener("click", () => { delete P[win.id]; resolve(-1); });
    setTimeout(() => $(".btn", win.body).focus(), 0);
    // size to content
    requestAnimationFrame(() => { win.el.style.height = "auto"; win.el.style.width = Math.min(window.innerWidth - 20, Math.max(300, $(".dlg", win.body).scrollWidth + 10)) + "px"; });
  },
  notepad(win) {
    menubar(win, {
      File: [["New", () => { ta.value = ""; }], ["Save", () => download(win.p.label || "untitled.txt", ta.value)], "-", ["Exit", () => close(win)]],
      Edit: [["Select All", () => { ta.focus(); ta.select(); }], ["Time/Date", () => { ta.setRangeText(new Date().toLocaleString(), ta.selectionStart, ta.selectionEnd, "end"); }]],
      Help: [["About Notepad", () => msgbox("About Notepad", "Notepad<br>A tribute recreation for dominiccerchio.com")]]
    });
    const ta = h(`<textarea class="notepad field" spellcheck="false"></textarea>`); ta.value = win.p.text || ""; win.body.appendChild(ta);
  },
  linkedin(win) {
    win.body.innerHTML = `<div class="profile sunken"><div class="card"><div class="badge">in</div><div><h2>${esc(PROFILE.name)}</h2><div>${esc(PROFILE.title)}</div></div></div>
      <p>Relationship builder with a front-end developer's toolkit and a passion for empowering people through technology.</p>
      <b>Experience</b><ul>${PROFILE.career.map(c => `<li><b>${esc(c.org)}</b> — ${esc(c.role)} <i>(${esc(c.when)})</i></li>`).join("")}</ul>
      <b>Certifications</b><ul>${CERTIFICATIONS.map(c => `<li>${esc(c.name)} <i>(${esc(c.code)})</i></li>`).join("")}</ul>
      <b>Volunteering</b><ul>${VOLUNTEERING.map(v => `<li>${esc(v.name)}</li>`).join("")}</ul>
      <div class="btns" style="display:flex;gap:6px;flex-wrap:wrap"><a class="btn default" style="text-decoration:none;color:#000;display:inline-flex;align-items:center" href="${PROFILE.linkedin}" target="_blank" rel="noopener">Open LinkedIn profile ↗</a>
      <a class="btn" style="text-decoration:none;color:#000;display:inline-flex;align-items:center" href="${PROFILE.github}" target="_blank" rel="noopener">GitHub ↗</a>
      <button class="btn" data-open="navigator">Tour my house →</button></div></div>`;
    win.body.querySelectorAll("[data-open]").forEach(b => b.addEventListener("click", () => open(b.dataset.open)));
  },
  display(win) {
    const cur = localStorage.getItem("w95.wallpaper") || "hills";
    win.body.innerHTML = `<div class="dlg"><fieldset><legend>Wallpaper</legend>
      <label><input type="radio" name="wp" value="hills" ${cur === "hills" ? "checked" : ""}> Green Hills</label>
      <label><input type="radio" name="wp" value="teal" ${cur === "teal" ? "checked" : ""}> (None) — classic teal</label></fieldset>
      <fieldset><legend>Sound</legend><label><input type="checkbox" id="snd" ${isMuted() ? "" : "checked"}> Play sounds</label></fieldset>
      <div class="btns"><button class="btn default" data-ok>OK</button><button class="btn" data-x>Cancel</button></div></div>`;
    $("[data-ok]", win.body).addEventListener("click", () => {
      localStorage.setItem("w95.wallpaper", $("input[name=wp]:checked", win.body).value); setMuted(!$("#snd", win.body).checked); syncSound(); applyWallpaper(); close(win);
    });
    $("[data-x]", win.body).addEventListener("click", () => close(win));
  },
  help(win) {
    win.body.innerHTML = `<div class="profile sunken"><h2>dominiccerchio 95 Help</h2>
      <p><b>Getting around.</b> Double-click a desktop icon to open it (tap on phones). Drag windows by their title bars; resize from the bottom-right corner. Use the taskbar to switch between windows.</p>
      <p><b>The Start menu</b> has everything: Programs, Documents, Settings, Run… and Shut Down.</p>
      <p><b>Navigator</b> is a 3D tour of a house that holds all my projects. Inside, you'll find Ark KidSpace too.</p>
      <p><b>Games.</b> Solitaire, Minesweeper and Space Pinball are original recreations written for this site. DOOM is the freely-distributable shareware episode running on <a href="https://github.com/jacobenget/doom.wasm" target="_blank" rel="noopener">doom.wasm</a>.</p>
      <p><b>Run commands:</b> help, navigator, kidspace, notepad, paint, doom, pinball, solitaire, winmine, linkedin, juice, dos, about.</p>
      <p style="color:#555">A fan-made homage. Windows is a trademark of Microsoft; Packard Bell Navigator was made by Ark Interface/Packard Bell. Not affiliated. All artwork here is original.</p></div>`;
  },
  run(win) {
    win.body.innerHTML = `<div class="dlg"><div class="row"><span class="big">${ICONS.run}</span><p>Type the name of a program, folder, or document, and dominiccerchio 95 will open it for you.</p></div>
      <label>Open: <input class="field" style="flex:1" id="runIn" value="${esc(localStorage.getItem("w95.run") || "")}" autocomplete="off" spellcheck="false"></label>
      <div class="btns"><button class="btn default" data-ok>OK</button><button class="btn" data-x>Cancel</button></div></div>`;
    const inp = $("#runIn", win.body); setTimeout(() => { inp.focus(); inp.select(); }, 0);
    const go = () => { const v = inp.value.trim(); localStorage.setItem("w95.run", v); close(win); runCommand(v); };
    $("[data-ok]", win.body).addEventListener("click", go); inp.addEventListener("keydown", e => { if (e.key === "Enter") go(); if (e.key === "Escape") close(win); });
    $("[data-x]", win.body).addEventListener("click", () => close(win));
  },
  find(win) {
    win.body.innerHTML = `<div class="dlg" style="padding-bottom:4px"><label>Named: <input class="field" style="flex:1" id="findIn" placeholder="e.g. pinball, vote, timer" spellcheck="false"></label></div>
      <div class="folder sunken" id="findRes" style="margin:0 6px"></div><div class="statusbar"><span id="findStat"></span></div>`;
    const inp = $("#findIn", win.body), res = $("#findRes", win.body), stat = $("#findStat", win.body);
    const all = Object.keys(P).filter(k => !P[k].dialog && !/^msg-/.test(k) && k !== "find");
    const draw = () => {
      const q = inp.value.trim().toLowerCase(); res.innerHTML = "";
      const hits = all.filter(k => !q || (P[k].title + " " + (P[k].label || "") + " " + (P[k].desc || "") + " " + k).toLowerCase().includes(q));
      hits.forEach(k => res.appendChild(iconEl(k, true))); stat.textContent = hits.length + " file(s) found";
    };
    inp.addEventListener("input", draw); draw(); setTimeout(() => inp.focus(), 0);
  },
  welcome(win) {
    const tips = [
      "Navigator is a 3D house. Every app I've built is a real object somewhere inside it — try the ballot box on the coffee table.",
      "The junk drawer in Navigator's kitchen holds 21 tiny web tools. So does the Toolbox folder, if you're in a hurry.",
      "Start > Run… understands a few commands. Try typing kidspace.",
      "My old green-screen homepage is in the Recycle Bin. I couldn't bring myself to empty it.",
      "Minesweeper: right-click to flag. Click a number with both buttons to chord. Good luck on Expert.",
      "Something about the Navigator house is… curious. Keep a journal."
    ];
    let i = Math.floor(Math.random() * tips.length);
    win.body.innerHTML = `<div class="welcome"><div class="main"><h1>Welcome to <b>dominiccerchio</b><span>95</span></h1>
      <div class="tip sunken"><span class="bulb">💡</span><div><b>Did you know…</b><p id="tipText">${esc(tips[i])}</p></div></div>
      <label><input type="checkbox" id="showNext" ${localStorage.getItem("w95.welcome") === "off" ? "" : "checked"}> Show this Welcome Screen next time you start</label></div>
      <div class="side"><button class="btn" data-open="navigator">Navigator</button><button class="btn" data-open="readme">What's New</button><button class="btn" data-next>Next Tip</button><hr style="width:100%"><button class="btn default" data-x>Close</button></div></div>`;
    $("[data-next]", win.body).addEventListener("click", () => { i = (i + 1) % tips.length; $("#tipText", win.body).textContent = tips[i]; });
    win.body.querySelectorAll("[data-open]").forEach(b => b.addEventListener("click", () => { close(win); open(b.dataset.open); }));
    $("[data-x]", win.body).addEventListener("click", () => close(win));
    $("#showNext", win.body).addEventListener("change", e => localStorage.setItem("w95.welcome", e.target.checked ? "on" : "off"));
    const r = () => { win.el.style.left = Math.max(0, (window.innerWidth - win.el.offsetWidth) / 2) + "px"; win.el.style.top = Math.max(0, (window.innerHeight - TB - win.el.offsetHeight) / 3) + "px"; };
    requestAnimationFrame(r);
  }
};
function folderView(win) {
  const host = h(`<div class="folder sunken"></div>`);
  win.p.folder.forEach(id => P[id] && host.appendChild(iconEl(id, true)));
  win.body.appendChild(host);
  win.body.appendChild(h(`<div class="statusbar"><span>${win.p.folder.length} object(s)</span></div>`));
}
function download(name, text) {
  const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([text], { type: "text/plain" })); a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

// ---------------------------------------------------------------- Run command
const ALIASES = { winmine: "minesweeper", mines: "minesweeper", sol: "solitaire", mspaint: "paint", pbrush: "paint", paintbrush: "paint", cmd: "terminal", command: "terminal", dos: "terminal", explorer: "mycomputer", control: "controlpanel", kidspace: "navigator#kidspace", nav: "navigator", "doom.exe": "doom", pinball: "pinball", about: "readme", "readme.txt": "readme", linkedin: "linkedin", calc: "tk-pmpcalc", juice: "app-juicer", juicer: "app-juicer", nama: "app-juicer" };
function runCommand(v) {
  const c = v.toLowerCase().replace(/\.exe$/, "");
  if (!c) return;
  if (c === "help") return open("help");
  if (c === "curiosity") return msgbox("Navigator", "The house is listening.<br>Go and say that again inside Navigator.", { icon: "info" }).then(() => open("navigator"));
  if (c === "iddqd") return msgbox("DOOM", "Degreelessness mode on.<br>(You have to type it inside DOOM, though.)", { icon: "warn" });
  if (c === "shutdown") return shutdownDialog();
  const target = Object.prototype.hasOwnProperty.call(ALIASES, c) ? ALIASES[c] : c;
  if (target === "navigator#kidspace") { P.navigator.url = "navigator.html#kidspace"; const w = open("navigator"); P.navigator.url = "navigator.html"; if (w && w.frame && !w.frame.src.endsWith("#kidspace")) w.frame.contentWindow.location.hash = "kidspace"; return; }
  if (has(target)) return open(target);
  if (/^https?:\/\//.test(v)) return window.open(v, "_blank", "noopener");
  msgbox(v, `Cannot find the file '${esc(v)}' (or one of its components). Make sure the path and filename are correct and that all required libraries are available.`, { icon: "warn" });
}

// ---------------------------------------------------------------- Start menu
const startBtn = $("#startBtn"), startMenu = $("#startMenu");
const START = [
  { label: "Programs", icon: "apps", sub: [
    { label: "Accessories", icon: "folder", sub: ["paint", "notepad", "find"] },
    { label: "Games", icon: "folder", sub: ["solitaire", "minesweeper", "pinball", "doom"] },
    { label: "My Apps", icon: "folder", sub: Object.keys(APPS).map(k => "app-" + k) },
    "navigator", "linkedin", "toolbox", "terminal"] },
  { label: "Documents", icon: "documents", sub: ["readme"] },
  { label: "Settings", icon: "settings", sub: ["controlpanel"] },
  { label: "Find", icon: "find", id: "find" },
  { label: "Help", icon: "help", id: "help" },
  { label: "Run...", icon: "run", id: "run" },
  "-",
  { label: "Shut Down...", icon: "shutdown", fn: () => shutdownDialog() }
];
function menuItem(it, sub) {
  if (it === "-") return document.createElement("hr");
  const o = typeof it === "string" ? { label: P[it].label || P[it].title.replace(/ - Notepad$/, ""), icon: P[it].icon, id: it } : it;
  const b = h(`<button class="${o.sub ? "has-sub" : ""}">${ICONS[o.icon]}<span>${esc(o.label)}</span></button>`);
  if (o.sub) {
    const show = () => {
      const level = sub ? +sub.dataset.level + 1 : 1;
      document.querySelectorAll(".flyout").forEach(f => { if (+f.dataset.level >= level) f.remove(); });
      b.parentElement.querySelectorAll(".open").forEach(x => x.classList.remove("open")); b.classList.add("open");
      const fl = h(`<div class="flyout raised"><div class="smenu sub"></div></div>`); fl.dataset.level = level;
      o.sub.forEach(s => $(".smenu", fl).appendChild(menuItem(s, fl)));
      document.body.appendChild(fl);
      const r = b.getBoundingClientRect(), fr = fl.getBoundingClientRect();
      let left = r.right - 2, top = r.top - 3;
      if (left + fr.width > window.innerWidth) left = Math.max(0, r.left - fr.width + 2);
      if (top + fr.height > window.innerHeight - TB) top = Math.max(0, window.innerHeight - TB - fr.height);
      fl.style.left = left + "px"; fl.style.top = top + "px";
    };
    b.addEventListener("mouseenter", () => { clearTimeout(b._t); b._t = setTimeout(show, 120); });
    b.addEventListener("mouseleave", () => clearTimeout(b._t));
    b.addEventListener("click", e => { e.stopPropagation(); show(); });
  } else {
    b.addEventListener("mouseenter", () => {
      const level = sub ? +sub.dataset.level + 1 : 1;
      document.querySelectorAll(".flyout").forEach(f => { if (+f.dataset.level >= level) f.remove(); });
      b.parentElement.querySelectorAll(".open").forEach(x => x.classList.remove("open"));
    });
    b.addEventListener("click", () => { closeStart(); o.fn ? o.fn() : open(o.id); });
  }
  return b;
}
function buildStart() {
  const m = $(".smenu", startMenu); m.innerHTML = "";
  START.forEach(it => m.appendChild(menuItem(it)));
}
function toggleStart() { startMenu.hidden ? openStart() : closeStart(); }
function openStart() { sfx.unlock(); buildStart(); startMenu.hidden = false; startBtn.classList.add("pressed"); }
function closeStart() { startMenu.hidden = true; startBtn.classList.remove("pressed"); document.querySelectorAll(".flyout").forEach(f => f.remove()); }
startBtn.addEventListener("click", e => { e.stopPropagation(); toggleStart(); });
document.addEventListener("pointerdown", e => { if (!startMenu.hidden && !e.target.closest("#startMenu,.flyout,#startBtn")) closeStart(); });
document.addEventListener("keydown", e => {
  if (e.key === "Escape") closeStart();
  if ((e.key === "Meta" || (e.ctrlKey && e.key === "Escape")) && !e.repeat) { e.preventDefault(); toggleStart(); }
});

// ---------------------------------------------------------------- shut down
function shutdownDialog() {
  P.shutdownDlg = { title: "Shut Down dominiccerchio 95", icon: "shutdown", view: "shutdown", w: 380, h: 200, dialog: true };
  const dim = h(`<div id="dim"></div>`); dim.style.zIndex = ++zTop; $("#desktop").appendChild(dim);
  const win = open("shutdownDlg"); win.el.style.zIndex = ++zTop;
  const onKey = e => { if (e.key === "Escape") { close(win); done(); } };
  document.addEventListener("keydown", onKey);
  const r = () => { win.el.style.left = (window.innerWidth - win.el.offsetWidth) / 2 + "px"; win.el.style.top = (window.innerHeight - TB - win.el.offsetHeight) / 2.5 + "px"; };
  requestAnimationFrame(r);
  const done = () => { dim.remove(); document.removeEventListener("keydown", onKey); };
  $(".tbtn.close", win.el).addEventListener("click", done);
  win.body.querySelector("[data-x]").addEventListener("click", () => { close(win); done(); });
  win.body.querySelector("[data-ok]").addEventListener("click", () => {
    const v = $("input[name=sd]:checked", win.body).value; close(win); done();
    if (v === "restart") location.reload();
    else if (v === "dos") location.href = "terminal.html";
    else { const s = h(`<div id="shutdown"><p>It's now safe to turn off<br>your computer.</p></div>`); document.body.appendChild(s); s.addEventListener("click", () => location.reload()); }
  });
}
VIEWS.shutdown = win => {
  win.body.innerHTML = `<div class="dlg"><div class="row"><span class="big">${ICONS.shutdown}</span><div><p>Are you sure you want to:</p>
    <label><input type="radio" name="sd" value="off" checked> Shut down the computer?</label>
    <label><input type="radio" name="sd" value="restart"> Restart the computer?</label>
    <label><input type="radio" name="sd" value="dos"> Restart the computer in MS-DOS mode?</label></div></div>
    <div class="btns center"><button class="btn default" data-ok>Yes</button><button class="btn" data-x>No</button></div></div>`;
};

// ---------------------------------------------------------------- tray
const clock = $("#clock");
function tick() { const d = new Date(); clock.textContent = d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }); clock.title = d.toLocaleDateString([], { weekday: "long", year: "numeric", month: "long", day: "numeric" }); }
tick(); setInterval(tick, 10000);
const soundBtn = $("#soundTray");
function syncSound() { soundBtn.style.opacity = isMuted() ? 0.4 : 1; soundBtn.title = isMuted() ? "Sound is off" : "Volume"; }
soundBtn.innerHTML = ICONS.speaker; syncSound();
soundBtn.addEventListener("click", () => { setMuted(!isMuted()); syncSound(); sfx.click(); });
startBtn.insertAdjacentHTML("afterbegin", ICONS.start);

// startup chime on the first interaction (browsers block audio before that)
let chimed = sessionStorage.getItem("w95.chimed") === "1";
document.addEventListener("pointerdown", () => { if (!chimed) { chimed = true; sessionStorage.setItem("w95.chimed", "1"); sfx.unlock(); sfx.startup(); } }, { once: true, capture: true });

// ---------------------------------------------------------------- boot
const want = decodeURIComponent((location.hash || "").slice(1));
if (has(want)) open(want);
else if (["living", "kitchen", "den", "rec", "kidspace"].includes(want)) { P.navigator.url = "navigator.html#" + want; open("navigator"); P.navigator.url = "navigator.html"; }
else if (localStorage.getItem("w95.welcome") !== "off") open("welcome");
window.__w95 = { open, P, wins };

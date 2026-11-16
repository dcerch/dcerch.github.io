// =====================================================================
//  main.js — the 2D Navigator engine (3.5 and 3.9 share it).
//  A fixed-size "pre-rendered" stage (640×480 or 800×600) scaled to fit,
//  with Navigator's toolbar on top, the black caption bar and InfoGuide at
//  the bottom, and rooms full of clickable objects in between.
// =====================================================================
import { PROFILE, APPS, TRINKETS, FAMILY, CATS } from "../data.js";
import { sfx, isMuted, setMuted } from "../audio.js";
import { panels } from "../ui.js";
import { createARG } from "../arg.js";
import { portraitCanvas } from "./portrait.js";
import { esc } from "./art.js";
import { TB_ICONS } from "./icons.js";
import { V35 } from "./v35.js";
import { V39 } from "./v39.js";
import { music } from "./music.js";

const $ = (s, r = document) => r.querySelector(s);
const h = html => { const t = document.createElement("template"); t.innerHTML = html.trim(); return t.content.firstElementChild; };
const params = new URLSearchParams(location.search);
const V = params.get("v") === "3.9" ? V39 : V35;
const embedded = (() => { try { return window.parent !== window && !!window.parent.__w95; } catch (e) { return false; } })();
document.body.classList.add(V.cls);
document.title = "Navigator " + V.id;

// ---------------------------------------------------------------- preferences
const PREF_KEY = "nav2d.prefs";
const prefs = Object.assign({ intro: true, tips: true, voice: true, start: "home", last: null, users: [], user: "" }, (() => { try { return JSON.parse(localStorage.getItem(PREF_KEY) || "{}"); } catch (e) { return {}; } })());
const savePrefs = () => localStorage.setItem(PREF_KEY, JSON.stringify(prefs));

// ---------------------------------------------------------------- stage
const stage = $("#stage"), roomEl = $("#room"), top = $("#top"), bot = $("#bot"), layer = $("#layer");
stage.style.width = V.W + "px"; stage.style.height = V.H + "px";
function fit() {
  const s = Math.min(window.innerWidth / V.W, window.innerHeight / V.H);
  stage.style.transform = `translate(-50%, -50%) scale(${s})`;
}
window.addEventListener("resize", fit); fit();
const toStage = (x, y) => { const r = stage.getBoundingClientRect(), s = r.width / V.W; return [(x - r.left) / s, (y - r.top) / s]; };

// ---------------------------------------------------------------- launching programs
const LAUNCH = {
  solitaire: ["Solitaire", "apps/win95/solitaire.html?embed=1"], minesweeper: ["Minesweeper", "apps/win95/minesweeper.html?embed=1"],
  pinball: ["Space Pinball", "apps/win95/pinball.html?embed=1"], paint: ["Paint", "apps/win95/paint.html?embed=1"], doom: ["DOOM", "apps/doom/index.html"],
  terminal: ["MS-DOS Prompt", "terminal.html"], oldsite: ["The old homepage", "terminal.html"], toolbox: ["Toolbox", "toolbox.html"], arcade: ["404 Arcade", "404.html"],
  drawers: ["KidSpace Drawers", "apps/kidspace-drawers.html"]
};
Object.entries(APPS).forEach(([k, a]) => (LAUNCH["app-" + k] = [a.title, a.url]));
TRINKETS.forEach(t => (LAUNCH["tk-" + t.id] = [t.name, "toolbox.html?embed=1#" + t.id]));
function launch(pid) {
  sfx.click();
  if (V.rooms[pid]) return go(pid);
  if (pid === "about" || pid === "linkedin") { if (embedded) { window.parent.__w95.open(pid); return; } return panel(pid === "about" ? "about" : "linkedin"); }
  if (embedded && window.parent.__w95.P[pid]) { window.parent.__w95.open(pid); caption("Starting " + (window.parent.__w95.P[pid].title || pid) + "…", 2500); return; }
  const L = LAUNCH[pid]; if (!L) return;
  if (embedded) { window.open(L[1], "_blank"); return; }
  win({ title: L[0], html: `<iframe src="${esc(L[1])}" title="${esc(L[0])}"></iframe>`, w: V.W - 40, h: V.H - 80, cls: "frame" });
}

// ---------------------------------------------------------------- caption bar + InfoGuide
const capEl = () => $("#caption");
let defaultCap = "", capTimer = 0;
function caption(t, ms) { clearTimeout(capTimer); capEl().textContent = t || defaultCap; if (ms) capTimer = setTimeout(() => (capEl().textContent = defaultCap), ms); }
let infoMode = false;
function setInfoMode(on) { infoMode = on; document.body.classList.toggle("infomode", on); $("#infoBtn").classList.toggle("on", on); caption(on ? "InfoGuide is on. Click anything to hear what it does. Click the InfoGuide again to turn it off." : ""); sfx.click(); }
let voice = null;
function say(text) {
  if (!prefs.voice || isMuted() || !("speechSynthesis" in window)) return;
  try {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text.replace(/<[^>]+>/g, ""));
    if (!voice) { const vs = speechSynthesis.getVoices(); voice = vs.find(v => /en-US/.test(v.lang) && /David|Mark|Guy|Male|Daniel/i.test(v.name)) || vs.find(v => /^en/.test(v.lang)) || null; }
    if (voice) u.voice = voice; u.rate = 0.98; u.pitch = 0.95; speechSynthesis.speak(u);
  } catch (e) {}
}
const hush = () => { try { speechSynthesis.cancel(); } catch (e) {} };
function infoGuide(title, text, goLabel, go) {
  say(text);
  const w = win({ title: "InfoGuide — " + title, cls: "info", w: 380,
    html: `<div class="ig"><div class="igicon">i</div><p>${esc(text)}</p></div><div class="nbtns">${go ? `<button class="nb" data-go>${esc(goLabel || "Go there")}</button>` : ""}<button class="nb" data-x>Close</button></div>`,
    onClose: hush });
  $("[data-x]", w).addEventListener("click", () => closeWin(w));
  const g = $("[data-go]", w); if (g) g.addEventListener("click", () => { closeWin(w); go(); });
}

// ---------------------------------------------------------------- windows inside the stage
let zWin = 50;
function win({ title, html, w = 420, h: ht = null, cls = "", onClose, modal = true, icon = "" }) {
  sfx.open();
  const scrim = modal ? h_(`<div class="scrim"></div>`) : null;
  const el = h(`<section class="nwin ${cls}" role="dialog" aria-label="${esc(title)}"><div class="ntitle">${icon ? `<span class="nico">${icon}</span>` : ""}<span>${esc(title)}</span><button class="nx" aria-label="Close">✕</button></div><div class="nbody">${html}</div></section>`);
  el.style.width = Math.min(w, V.W - 16) + "px"; if (ht) el.style.height = Math.min(ht, V.H - 16) + "px";
  el._onClose = onClose; el._scrim = scrim;
  if (scrim) { scrim.style.zIndex = ++zWin; layer.appendChild(scrim); scrim.addEventListener("click", () => closeWin(el)); }
  el.style.zIndex = ++zWin; layer.appendChild(el);
  requestAnimationFrame(() => { el.style.left = Math.max(4, (V.W - el.offsetWidth) / 2) + "px"; el.style.top = Math.max(4, (V.H - el.offsetHeight) / 2.3) + "px"; });
  $(".nx", el).addEventListener("click", () => closeWin(el));
  // drag by the title bar
  $(".ntitle", el).addEventListener("pointerdown", e => {
    if (e.target.closest(".nx")) return;
    const [sx, sy] = toStage(e.clientX, e.clientY), ox = el.offsetLeft, oy = el.offsetTop; $(".ntitle", el).setPointerCapture(e.pointerId);
    const mv = ev => { const [x, y] = toStage(ev.clientX, ev.clientY); el.style.left = Math.max(-el.offsetWidth + 60, Math.min(V.W - 40, ox + x - sx)) + "px"; el.style.top = Math.max(0, Math.min(V.H - 30, oy + y - sy)) + "px"; };
    const up = () => { $(".ntitle", el).removeEventListener("pointermove", mv); $(".ntitle", el).removeEventListener("pointerup", up); };
    $(".ntitle", el).addEventListener("pointermove", mv); $(".ntitle", el).addEventListener("pointerup", up);
  });
  setTimeout(() => { const f = el.querySelector("[autofocus], .nb, button:not(.nx)"); f && f.focus(); }, 30);
  return el;
}
function h_(html) { return h(html); }
function closeWin(el) { if (!el.isConnected) return; el.remove(); el._scrim && el._scrim.remove(); sfx.close(); el._onClose && el._onClose(); }
function closeAll() { layer.querySelectorAll(".nwin").forEach(closeWin); }
function msg(title, text, buttons = ["OK"], opts = {}) {
  return new Promise(res => {
    const w = win({ title, w: opts.w || 360, cls: "msg", html: `<div class="mrow">${opts.icon || '<span class="mi">!</span>'}<div>${text}</div></div><div class="nbtns">${buttons.map((b, i) => `<button class="nb" data-i="${i}">${esc(b)}</button>`).join("")}</div>`, onClose: () => res(-1) });
    w.querySelectorAll("[data-i]").forEach(b => b.addEventListener("click", () => { w._onClose = null; closeWin(w); res(+b.dataset.i); }));
  });
}

// ---------------------------------------------------------------- content panels (shared with the old house)
let portraitURL = "";
const portrait = () => (portraitURL ||= portraitCanvas(FAMILY, CATS).toDataURL("image/jpeg", 0.85));
function panel(name) {
  let p;
  if (name === "family") p = panels.family(portrait());
  else p = panels[name]();
  const el = win({ title: p.title, html: `<div class="panel">${p.html}</div>`, w: p.wide ? 560 : 440, h: Math.min(V.H - 40, 420), cls: "pan", icon: p.icon });
  if (name === "leviathan") arg.readBook();
  if (name === "phone") wirePhone(el);
  if (name === "khajiit") { arg.metMerchant(); const k = $("#kjWares", el); k && k.addEventListener("click", () => launch("tk-elderscrolls")); }
  el.querySelectorAll("[data-go]").forEach(b => b.addEventListener("click", () => { closeWin(el); go(V.manuals); }));
  return el;
}
function wirePhone(el) {
  const disp = $("#phDisplay", el); let digits = "";
  const show = () => (disp.textContent = digits || "Dial a number…");
  el.querySelectorAll(".pkey").forEach(k => k.addEventListener("click", () => { digits += k.dataset.k; sfx.dial(Math.max(1, +k.dataset.k || 10)); show(); }));
  $("#phClear", el).addEventListener("click", () => { digits = ""; show(); sfx.click(); });
  $("#phCall", el).addEventListener("click", () => {
    if (!digits) return; sfx.ring();
    setTimeout(() => {
      if (arg.dialed(digits)) disp.textContent = "…click. Somewhere in the house, a television turns on.";
      else if (digits.replace(/\D/g, "") === "8675309") disp.textContent = "Jenny? …Jenny? (She doesn't live here anymore.)";
      else if (digits === "0") disp.textContent = "Operator: “This house only answers to curiosity.”";
      else if (digits.replace(/\D/g, "") === "18007225") disp.textContent = "You've reached Packard Bell support. All of our technicians are busy helping 1996. Please hold.";
      else disp.textContent = "The number you have dialed is not in service. Please hang up and try again.";
      digits = "";
    }, 1700);
  });
}

// ---------------------------------------------------------------- the ARG
const arg = createARG({
  onSpoken() { V.tvClue && V.tvClue(api, true); sfx.static(); caption("📺 Somewhere in the house, a television switches itself on…", 6000); },
  onStep(step) {
    refreshJournalBadge();
    if (step === 1) caption("📓 Something went into your journal.", 5000);
    if (step === 3) { sfx.secret(); caption("✨ The symbols blaze green. Something rustles in the Living Room…", 7000); if (current === V.home) go(V.home); }
    if (step === 4) { sfx.secret(); caption("🏆 You solved the Curiosity Protocol!", 6000); }
  },
  onReset() { refreshJournalBadge(); if (current === V.home) go(V.home); }
});
function refreshJournalBadge() { document.body.dataset.arg = arg.step; }
function journal() {
  const el = win({ title: "Journal", icon: "📓", w: 420, cls: "pan", html: `<div class="panel journal"><p class="hint">Curious things you've noticed. (${Math.min(arg.step, 4)} of 4 solved)</p><ol>${arg.journal().map(j => `<li>${esc(j.text)}</li>`).join("")}</ol>${arg.step >= 4 ? `<p><button class="nb" id="argReset">Forget everything &amp; start over</button></p>` : ""}</div>` });
  const r = $("#argReset", el); r && r.addEventListener("click", () => { arg.reset(); closeWin(el); caption("The house forgets. Everything is… ordinary again.", 4000); });
}

// ---------------------------------------------------------------- toolbar tools
function taskJumper() {
  const CATS_ = {
    "Personal Data": [["About me (ABOUT.TXT)", () => launch("about")], ["LinkedIn", () => panel("linkedin")], ["Family portrait", () => panel("family")], ["Journal", journal]],
    "Personal Finances": TRINKETS.filter(t => ["bankrewards", "crypto", "incomesavings"].includes(t.id)).map(t => [t.name + " — " + t.id, () => launch("tk-" + t.id)]),
    "Games": [["Solitaire", () => launch("solitaire")], ["Minesweeper", () => launch("minesweeper")], ["3D Pinball", () => launch("pinball")], ["DOOM", () => launch("doom")], ["Kojima Name Generator", () => launch("app-kojima")], ["Lost at Sea", () => launch("app-lostatsea")]],
    "Home Electronics": [["Media Controller", mediaController], ["Call Center (phone)", () => panel("phone")], ["Volume", toggleSound]],
    "Tutorials": [["Using Your Mouse", mouseTutorial], ["Navigator Overview", overview]],
    "Business": [["Ranked Choice Voting", () => launch("app-rankedchoicevoting")], ["PMP hours calculator", () => launch("tk-pmpcalc")], ["PMP study sheet", () => launch("tk-pmpref")], ["Time Wrap timers", () => launch("tk-timewrap")]]
  };
  let cat = Object.keys(CATS_)[0];
  const el = win({ title: "Task Jumper", icon: TB_ICONS.task, w: 470, cls: "tj", html: `<p class="hint">Pick a category, then double-click a task to jump to it.</p><div class="tjcols"><ul class="tjl sunk" id="tjCats">${Object.keys(CATS_).map(c => `<li tabindex="0" data-c="${esc(c)}">${esc(c)}</li>`).join("")}</ul><ul class="tjl sunk" id="tjTasks"></ul></div><div class="nbtns"><button class="nb" id="tjGo">Jump</button><button class="nb" data-x>Close</button></div>` });
  const draw = () => {
    el.querySelectorAll("#tjCats li").forEach(li => li.classList.toggle("sel", li.dataset.c === cat));
    $("#tjTasks", el).innerHTML = CATS_[cat].map((t, i) => `<li tabindex="0" data-i="${i}">${esc(t[0])}</li>`).join("");
    el.querySelectorAll("#tjTasks li").forEach(li => {
      li.addEventListener("click", () => { el.querySelectorAll("#tjTasks li").forEach(x => x.classList.toggle("sel", x === li)); });
      li.addEventListener("dblclick", () => { closeWin(el); CATS_[cat][+li.dataset.i][1](); });
      li.addEventListener("keydown", e => { if (e.key === "Enter") { closeWin(el); CATS_[cat][+li.dataset.i][1](); } });
    });
  };
  el.querySelectorAll("#tjCats li").forEach(li => { li.addEventListener("click", () => { cat = li.dataset.c; draw(); }); li.addEventListener("keydown", e => { if (e.key === "Enter") { cat = li.dataset.c; draw(); } }); });
  $("#tjGo", el).addEventListener("click", () => { const s = $("#tjTasks .sel", el); if (s) { closeWin(el); CATS_[cat][+s.dataset.i][1](); } });
  $("[data-x]", el).addEventListener("click", () => closeWin(el));
  draw();
}
function mediaController() {
  const el = win({ title: "Media Controller", icon: TB_ICONS.media, w: 400, cls: "media", html: `<div class="cd"><div class="lcd"><span id="mcTrack">--</span><span id="mcTime">00:00</span><span id="mcName">Insert a disc… or just press Play.</span></div>
    <div class="cdbtns"><button class="nb" data-a="prev" title="Previous">⏮</button><button class="nb" data-a="play" title="Play">▶</button><button class="nb" data-a="stop" title="Stop">■</button><button class="nb" data-a="next" title="Next">⏭</button></div>
    <ol class="tracks">${music.tracks.map((t, i) => `<li data-i="${i}">${esc(t.name)}</li>`).join("")}</ol><p class="hint">Original tunes, synthesized live. Mute is on the Preferences wrench.</p></div>`, onClose: () => { clearInterval(tick); } });
  let i = music.current >= 0 ? music.current : 0, tick = 0;
  const show = () => { $("#mcTrack", el).textContent = String(i + 1).padStart(2, "0"); $("#mcName", el).textContent = music.tracks[i].name; el.querySelectorAll(".tracks li").forEach(li => li.classList.toggle("sel", +li.dataset.i === i && music.playing)); };
  tick = setInterval(() => { const s = music.elapsed(); $("#mcTime", el).textContent = String(Math.floor(s / 60)).padStart(2, "0") + ":" + String(Math.floor(s % 60)).padStart(2, "0"); show(); }, 250);
  el.querySelectorAll("[data-a]").forEach(b => b.addEventListener("click", () => {
    const a = b.dataset.a;
    if (a === "play") music.play(i); if (a === "stop") music.stop();
    if (a === "next") { i = (i + 1) % music.tracks.length; if (music.playing) music.play(i); }
    if (a === "prev") { i = (i + music.tracks.length - 1) % music.tracks.length; if (music.playing) music.play(i); }
    show();
  }));
  el.querySelectorAll(".tracks li").forEach(li => li.addEventListener("click", () => { i = +li.dataset.i; music.play(i); show(); }));
  show();
}
function runningMan() {
  let list = [];
  try { if (embedded) list = [...window.parent.__w95.wins.values()].filter(w => !w.p.dialog).map(w => ({ id: w.id, title: w.p.title })); } catch (e) {}
  const el = win({ title: "Running Applications", icon: TB_ICONS.run, w: 420, cls: "run", html: `<div class="runrow"><ul class="tjl sunk" id="runList">${list.length ? list.map(w => `<li tabindex="0" data-id="${esc(w.id)}">${esc(w.title)}</li>`).join("") : `<li class="dim">Only Navigator is running.</li>`}</ul>
    <div class="runbtns"><button class="nb" id="runFront">Bring to Front</button><button class="nb" id="runEnd">End Task</button><button class="nb" data-x>Cancel</button></div></div>` });
  el.querySelectorAll("#runList li[data-id]").forEach(li => li.addEventListener("click", () => el.querySelectorAll("#runList li").forEach(x => x.classList.toggle("sel", x === li))));
  const sel = () => $("#runList li.sel", el);
  $("#runFront", el).addEventListener("click", () => { const s = sel(); if (s) { closeWin(el); window.parent.__w95.open(s.dataset.id); } });
  $("#runEnd", el).addEventListener("click", () => { const s = sel(); if (!s) return; const w = window.parent.__w95.wins.get(s.dataset.id); if (w) { w.el.querySelector('[data-a="close"]').click(); s.remove(); } });
  $("[data-x]", el).addEventListener("click", () => closeWin(el));
}
function preferences() {
  const rooms = Object.entries(V.rooms).filter(([, r]) => !r.hidden);
  const el = win({ title: "Navigator Preferences", icon: TB_ICONS.prefs, w: 420, cls: "prefs", html: `
    <fieldset><legend>Sound</legend><label><input type="checkbox" id="pSnd" ${isMuted() ? "" : "checked"}> Navigator sounds and music</label><label><input type="checkbox" id="pVoice" ${prefs.voice ? "checked" : ""}> InfoGuide narration (spoken aloud)</label></fieldset>
    <fieldset><legend>Start up</legend><label>Start up with: <select id="pStart"><option value="home">${esc(V.rooms[V.home].name)}</option>${rooms.filter(([k]) => k !== V.home).map(([k, r]) => `<option value="${k}" ${prefs.start === k ? "selected" : ""}>${esc(r.name)}</option>`).join("")}<option value="last" ${prefs.start === "last" ? "selected" : ""}>The last room I was in</option></select></label>
      <label><input type="checkbox" id="pIntro" ${prefs.intro ? "checked" : ""}> Show introduction screen at startup</label>
      ${V.smartTips ? `<label><input type="checkbox" id="pTips" ${prefs.tips ? "checked" : ""}> Deliver Smart Tips during idle time</label>` : ""}</fieldset>
    <div class="nbtns"><button class="nb" id="pOk">OK</button><button class="nb" data-x>Cancel</button></div>` });
  $("#pOk", el).addEventListener("click", () => {
    setMuted(!$("#pSnd", el).checked); prefs.voice = $("#pVoice", el).checked; prefs.start = $("#pStart", el).value; prefs.intro = $("#pIntro", el).checked;
    if ($("#pTips", el)) prefs.tips = $("#pTips", el).checked; savePrefs(); if (isMuted()) { music.stop(); hush(); } closeWin(el);
  });
  $("[data-x]", el).addEventListener("click", () => closeWin(el));
}
function security() {
  const el = win({ title: "Navigator Security", icon: TB_ICONS.key, w: 400, cls: "sec", html: `<p>Security mode lets you lock parts of Navigator behind a password. Choose what to protect, then type the password.</p>
    <fieldset><legend>Protect</legend><label><input type="checkbox" checked> Software</label><label><input type="checkbox"> Toolbar</label><label><input type="checkbox"> General access</label>${V.multiUser ? `<label><input type="checkbox" id="sMU" ${prefs.users.length ? "checked" : ""}> Multi-user mode</label>` : ""}</fieldset>
    ${V.multiUser ? `<label class="lrow">Who's using the computer? <input class="nfield" id="sUser" value="${esc(prefs.user)}" placeholder="Your name" maxlength="20"></label>` : ""}
    <label class="lrow">Password: <input class="nfield" id="sPw" type="password" autocomplete="off"></label>
    <div class="nbtns"><button class="nb" id="sOk">OK</button><button class="nb" data-x>Cancel</button></div>` });
  $("#sOk", el).addEventListener("click", () => {
    const pw = $("#sPw", el).value.trim();
    if (V.multiUser) { prefs.user = $("#sUser", el).value.trim(); savePrefs(); greet(); }
    closeWin(el);
    if (arg.dialedWord(pw)) caption("The house heard you.", 4000);
    else if (pw) msg("Navigator Security", "Password saved. (Don't worry — it's only kept on this computer. Also, it's not really protecting anything.)", ["OK"], { icon: `<span class="mi">🔑</span>` });
  });
  $("[data-x]", el).addEventListener("click", () => closeWin(el));
}
function greet() { if (prefs.user) caption("Welcome back, " + prefs.user + ".", 4000); }
function toggleSound() { setMuted(!isMuted()); if (isMuted()) { music.stop(); hush(); } caption(isMuted() ? "Sound is off." : "Sound is on.", 2500); sfx.click(); }
async function exitToWindows() {
  const r = await msg("Navigator", `Do you want to exit Navigator and return to ${embedded ? "dom 95" : "the desktop"}?`, ["OK", "Cancel"], { icon: `<span class="mi">${TB_ICONS.windows}</span>` });
  if (r !== 0) return; music.stop(); hush();
  if (embedded) window.parent.postMessage({ type: "win95:close" }, location.origin); else location.href = "index.html";
}
async function exitShutdown() {
  const r = await msg("Exit Navigator", `Do you want to exit Navigator and shut down your computer?`, ["Shut Down", "Return to Windows", "Cancel"], { icon: `<span class="mi">${TB_ICONS.exit}</span>`, w: 420 });
  if (r === 0) { music.stop(); hush(); if (embedded) window.parent.postMessage({ type: "win-shutdown" }, location.origin); else location.href = "index.html"; }
  if (r === 1) { music.stop(); hush(); if (embedded) window.parent.postMessage({ type: "win95:close" }, location.origin); else location.href = "index.html"; }
}
function internet() {
  const el = win({ title: "Internet", icon: TB_ICONS.globe, w: 420, cls: "net", html: `<p>Where to? (These open in a new browser window. Dial-up not required.)</p>
    <ul class="netl"><li><a href="${PROFILE.linkedin}" target="_blank" rel="noopener">LinkedIn — Dominic Cerchio</a></li><li><a href="${PROFILE.github}" target="_blank" rel="noopener">GitHub — dcerch</a></li><li><button class="linkish" data-l="oldsite">dominiccerchio.com — the old green-screen homepage</button></li><li><button class="linkish" data-l="arcade">The 404 Arcade</button></li></ul>
    <div class="nbtns"><button class="nb" data-x>Close</button></div>` });
  el.querySelectorAll("[data-l]").forEach(b => b.addEventListener("click", () => { closeWin(el); launch(b.dataset.l); }));
  $("[data-x]", el).addEventListener("click", () => closeWin(el));
}

// ---------------------------------------------------------------- tutorials
function mouseTutorial() {
  const steps = [
    ["Moving the mouse", "Slide your mouse and watch the arrow on the screen follow it. Move the arrow onto the yellow star.", "hover"],
    ["Clicking", "Press and release the left mouse button once. That's a click. Click the red button.", "click"],
    ["Double-clicking", "Click twice, quickly, without moving. That's how you open things on the desktop. Double-click the folder.", "dbl"],
    ["Dragging", "Press and hold the button, move the mouse, then let go. Drag the floppy disk onto the computer.", "drag"]
  ];
  let i = 0;
  const el = win({ title: "Tutorial — Using Your Mouse", icon: "🖱️", w: Math.min(520, V.W - 30), cls: "tut", html: `<div class="tutbox"><h3 id="tH"></h3><p id="tP"></p><div class="arena sunk" id="tA"></div><p class="hint" id="tS"></p></div><div class="nbtns"><button class="nb" id="tSkip">Next ›</button><button class="nb" data-x>Close</button></div>` });
  const A = $("#tA", el);
  const done = () => { sfx.secret(); $("#tS", el).textContent = "Well done!"; setTimeout(() => { i++; i < steps.length ? draw() : finish(); }, 900); };
  const finish = () => { $("#tH", el).textContent = "You're ready!"; $("#tP", el).textContent = "That's everything you need. In Navigator, just point at things to see what they are and click to use them."; A.innerHTML = `<div class="tgt big">🏠</div>`; $("#tSkip", el).textContent = "Enter the house"; $("#tSkip", el).onclick = () => closeWin(el); say("You're ready! In Navigator, just point at things to see what they are, and click to use them."); };
  function draw() {
    const [t, p, kind] = steps[i]; $("#tH", el).textContent = `Lesson ${i + 1} of ${steps.length}: ${t}`; $("#tP", el).textContent = p; $("#tS", el).textContent = ""; say(p);
    if (kind === "hover") { A.innerHTML = `<div class="tgt" style="left:65%;top:40%">⭐</div>`; $(".tgt", A).addEventListener("pointerenter", done, { once: true }); }
    if (kind === "click") { A.innerHTML = `<button class="tgt rbtn" style="left:40%;top:35%">Click me</button>`; $(".tgt", A).addEventListener("click", done, { once: true }); }
    if (kind === "dbl") { A.innerHTML = `<div class="tgt" style="left:30%;top:30%">📁</div>`; const f = $(".tgt", A); f.addEventListener("click", () => sfx.click()); f.addEventListener("dblclick", () => { f.textContent = "📂"; done(); }, { once: true }); }
    if (kind === "drag") {
      A.innerHTML = `<div class="tgt drag" style="left:12%;top:40%">💾</div><div class="tgt drop" style="left:70%;top:30%">🖥️</div>`;
      const d = $(".drag", A), t2 = $(".drop", A);
      d.addEventListener("pointerdown", e => {
        d.setPointerCapture(e.pointerId); const ar = A.getBoundingClientRect(), s = ar.width / A.offsetWidth;
        const mv = ev => { d.style.left = ((ev.clientX - ar.left) / s - 18) + "px"; d.style.top = ((ev.clientY - ar.top) / s - 18) + "px"; };
        const up = ev => { d.removeEventListener("pointermove", mv); d.removeEventListener("pointerup", up); const r = t2.getBoundingClientRect(); if (ev.clientX > r.left - 10 && ev.clientX < r.right + 10 && ev.clientY > r.top - 10 && ev.clientY < r.bottom + 10) { d.remove(); t2.textContent = "✅"; done(); } };
        d.addEventListener("pointermove", mv); d.addEventListener("pointerup", up);
      });
    }
  }
  $("#tSkip", el).addEventListener("click", () => { if (i < steps.length) { i++; i < steps.length ? draw() : finish(); } });
  $("[data-x]", el).addEventListener("click", () => closeWin(el));
  el._onClose = hush;
  draw();
}
function overview() {
  const slides = V.overview;
  let i = 0;
  const el = win({ title: "Navigator Overview", icon: "🎞️", w: Math.min(560, V.W - 30), cls: "ovw", html: `<div class="slide"><div class="sthumb sunk" id="oT"></div><div class="stext"><h3 id="oH"></h3><p id="oP"></p></div></div><div class="nbtns"><span class="hint" id="oN"></span><button class="nb" id="oPrev">‹ Back</button><button class="nb" id="oNext">Next ›</button><button class="nb" data-x>Close</button></div>`, onClose: hush });
  const draw = () => {
    const s = slides[i]; $("#oH", el).textContent = s.h; $("#oP", el).textContent = s.p; $("#oN", el).textContent = `${i + 1} of ${slides.length}`; say(s.h + ". " + s.p);
    $("#oT", el).innerHTML = s.room ? V.rooms[s.room].render(api).replace(/<svg /, '<svg preserveAspectRatio="xMidYMid slice" ') : `<div class="sbig">${s.glyph || "🏠"}</div>`;
    $("#oNext", el).textContent = i === slides.length - 1 ? "Finish" : "Next ›";
  };
  $("#oPrev", el).addEventListener("click", () => { if (i > 0) { i--; draw(); } });
  $("#oNext", el).addEventListener("click", () => { if (i < slides.length - 1) { i++; draw(); } else closeWin(el); });
  $("[data-x]", el).addEventListener("click", () => closeWin(el));
  draw();
}

// ---------------------------------------------------------------- toolbar + bars
const TOOLS = {
  map: { tip: "The Map is a quick way to go to any room in Navigator. Click it, then click the room you want to be in.", fn: () => go("map") },
  media: { tip: "The Media Controller plays music on the stereo. Click here to quick-launch it.", fn: mediaController },
  windows: { tip: "Provides an exit to the dom 95 desktop.", fn: exitToWindows },
  exit: { tip: "The Exit icon takes you to where you can safely shut down your computer.", fn: exitShutdown },
  key: { tip: "The Security icon accesses Navigator's security mode.", fn: security },
  docs: { tip: "Electronic Documentation: jumps straight to the shelf of manuals.", fn: () => go(V.manuals) },
  prefs: { tip: "The Preferences icon accesses settings for Navigator's volume and other user preferences.", fn: preferences },
  phone: { tip: "The Call Center gives you quick access to the phone.", fn: () => panel("phone") },
  run: { tip: "The Running Man icon controls open applications.", fn: runningMan },
  globe: { tip: "Click here to visit the Internet: LinkedIn, GitHub and the old homepage.", fn: internet },
  task: { tip: "Task Jumper: quick access to tasks and computer functions.", fn: taskJumper },
  voice: { tip: () => `Narration is currently ${prefs.voice ? "on" : "off"}. Click to turn it ${prefs.voice ? "off" : "on"}.`, fn: () => { prefs.voice = !prefs.voice; savePrefs(); $('[data-tool="voice"]').classList.toggle("lit", prefs.voice); caption("Narration is now " + (prefs.voice ? "on." : "off."), 2500); if (prefs.voice) say("Narration is on."); else hush(); } },
  users: { tip: "The Security icon accesses Navigator's security and multi-user mode.", fn: security }
};
function buildChrome() {
  top.innerHTML = V.topHTML(TB_ICONS);
  top.querySelectorAll("[data-tool]").forEach(b => {
    const t = TOOLS[b.dataset.tool]; const tip = () => typeof t.tip === "function" ? t.tip() : t.tip;
    b.setAttribute("aria-label", tip()); if (b.dataset.tool === "voice") b.classList.toggle("lit", prefs.voice);
    b.addEventListener("pointerenter", () => { caption(tip()); sfx.hover(); });
    b.addEventListener("pointerleave", () => caption());
    b.addEventListener("click", () => { if (infoMode) return infoGuide(b.dataset.label || "Toolbar", tip()); sfx.click(); t.fn(); });
  });
  bot.innerHTML = V.botHTML(TB_ICONS);
  $("#infoBtn").addEventListener("click", () => setInfoMode(!infoMode));
  $("#infoBtn").addEventListener("pointerenter", () => caption("Click here to turn on the InfoGuide, which tells you about anything on the screen."));
  $("#infoBtn").addEventListener("pointerleave", () => caption());
  const mb = $("#menuBtn"); if (mb) mb.addEventListener("click", e => { e.stopPropagation(); navMenu(mb); });
}
function navMenu(anchor) {
  closeMenu();
  const items = [
    ...Object.entries(V.rooms).filter(([, r]) => !r.hidden).map(([k, r]) => [(current === k ? "• " : "") + r.name, () => go(k)]), "-",
    ["Task Jumper…", taskJumper], ["Media Controller…", mediaController], ["Journal…", journal], ["Tutorial: Using Your Mouse", mouseTutorial], ["Overview", overview], "-",
    ["Everything in this room…", roomDirectory], ["Preferences…", preferences], ["Exit to Windows", exitToWindows]
  ];
  const m = h(`<div class="nmenu"></div>`);
  items.forEach(it => { if (it === "-") return m.appendChild(document.createElement("hr")); const b = h(`<button>${esc(it[0])}</button>`); b.addEventListener("click", () => { closeMenu(); it[1](); }); m.appendChild(b); });
  layer.appendChild(m); m.style.zIndex = 9999;
  m.style.left = Math.max(2, V.W - m.offsetWidth - 4) + "px"; m.style.top = Math.max(2, V.H - m.offsetHeight - 30) + "px";
}
function closeMenu() { layer.querySelectorAll(".nmenu").forEach(m => m.remove()); }
document.addEventListener("pointerdown", e => { if (!e.target.closest(".nmenu")) closeMenu(); });
function roomDirectory() {
  const R = V.rooms[current]; const list = Object.entries(R.hots || {}).filter(([k, d]) => !d.hidden || (d.hidden && d.hidden(api) === false));
  const el = win({ title: R.name + " — everything here", w: 460, cls: "pan", html: `<ul class="dirl">${list.map(([k, d]) => `<li><button class="linkish" data-k="${esc(k)}">${esc(d.cap)}</button><span>${esc(d.info || "")}</span></li>`).join("")}</ul>` });
  el.querySelectorAll("[data-k]").forEach(b => b.addEventListener("click", () => { closeWin(el); activate(b.dataset.k); }));
}

// ---------------------------------------------------------------- rooms
let current = null, roomCleanup = null;
function hotDef(k) { const R = V.rooms[current]; return R.hots && R.hots[k]; }
function activate(k) {
  const d = hotDef(k); if (!d) return;
  if (infoMode) return infoGuide(d.cap, d.info || d.cap, d.act ? "Use it" : null, d.act ? () => runAct(d) : null);
  runAct(d);
}
function runAct(d) {
  const a = d.act; if (!a) return;
  if (typeof a === "function") return a(api);
  if (a.room) return go(a.room);
  if (a.open) return launch(a.open);
  if (a.panel) return panel(a.panel);
}
function go(room, { quiet = false } = {}) {
  const R = V.rooms[room]; if (!R) return;
  closeMenu(); setInfoModeQuiet(false);
  if (roomCleanup) { try { roomCleanup(); } catch (e) {} roomCleanup = null; }
  const fade = $("#fade"); fade.classList.add("on");
  if (!quiet) sfx.whoosh();
  setTimeout(() => {
    current = room; if (!R.hidden) { prefs.last = room; savePrefs(); }
    document.body.dataset.room = room;
    document.body.classList.toggle("notool", !!R.noToolbar);
    roomEl.innerHTML = R.render(api);
    $("#roomName") && ($("#roomName").textContent = R.name);
    defaultCap = R.caption || R.name; caption();
    wireRoom();
    roomCleanup = R.enter ? R.enter(api, roomEl) : null;
    if (history.replaceState) history.replaceState(null, "", location.pathname + location.search + "#" + room);
    fade.classList.remove("on");
  }, quiet ? 0 : 220);
}
function setInfoModeQuiet(on) { infoMode = on; document.body.classList.toggle("infomode", on); const b = $("#infoBtn"); b && b.classList.toggle("on", on); }
function wireRoom() {
  roomEl.querySelectorAll(".hot").forEach(g => {
    const k = g.dataset.hot, d = hotDef(k); if (!d) return;
    g.setAttribute("tabindex", "0"); g.setAttribute("role", "button"); g.setAttribute("aria-label", d.cap);
    g.addEventListener("pointerenter", () => { g.classList.add("on"); caption(d.cap); sfx.hover(); });
    g.addEventListener("pointerleave", () => { g.classList.remove("on"); caption(); });
    g.addEventListener("focus", () => { g.classList.add("on"); caption(d.cap); });
    g.addEventListener("blur", () => { g.classList.remove("on"); caption(); });
    g.addEventListener("click", e => { e.stopPropagation(); activate(k); });
    g.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); activate(k); } });
    if (V.rightClickInfo) g.addEventListener("contextmenu", e => { e.preventDefault(); infoGuide(d.cap, d.info || d.cap, d.act ? "Use it" : null, d.act ? () => runAct(d) : null); });
  });
}

// live clocks in any room
setInterval(() => {
  const d = new Date(), hh = d.getHours() % 12 + d.getMinutes() / 60, mm = d.getMinutes() + d.getSeconds() / 60, ss = d.getSeconds();
  roomEl.querySelectorAll(".clock").forEach(c => {
    const cx = +c.dataset.cx, cy = +c.dataset.cy, r = +c.dataset.r;
    const set = (cls, ang, len) => { const l = c.querySelector(cls); if (!l) return; l.setAttribute("x1", cx); l.setAttribute("y1", cy); l.setAttribute("x2", cx + Math.sin(ang) * r * len); l.setAttribute("y2", cy - Math.cos(ang) * r * len); };
    set(".hh", hh / 12 * Math.PI * 2, 0.5); set(".mh", mm / 60 * Math.PI * 2, 0.72); set(".sh", ss / 60 * Math.PI * 2, 0.8);
  });
}, 1000);

// ---------------------------------------------------------------- smart tips (3.5): an envelope appears now and then
let lastAct = Date.now();
["pointerdown", "keydown"].forEach(ev => document.addEventListener(ev, () => (lastAct = Date.now()), true));
if (V.smartTips) setInterval(() => {
  if (!prefs.tips || !current || V.rooms[current].noTips || layer.querySelector(".nwin") || roomEl.querySelector(".smarttip") || Date.now() - lastAct < 25000) return;
  const spots = V.rooms[current].tipSpots || [[V.W * 0.5, V.H * 0.75]];
  const [x, y] = spots[Math.floor(Math.random() * spots.length)];
  const svg = roomEl.querySelector("svg"); if (!svg) return;
  const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
  g.setAttribute("class", "hot smarttip"); g.setAttribute("tabindex", "0"); g.innerHTML = V.envelope(x, y);
  svg.appendChild(g); sfx.coin(); caption("You have a Smart Tip! Click the envelope.", 6000);
  g.addEventListener("pointerenter", () => { g.classList.add("on"); caption("A Smart Tip. Click to open it."); });
  g.addEventListener("pointerleave", () => { g.classList.remove("on"); caption(); });
  g.addEventListener("click", () => {
    const tip = V.tips[Math.floor(Math.random() * V.tips.length)];
    g.remove();
    const el = win({ title: "Smart Tip", icon: "✉️", w: 360, cls: "tipcard", html: `<div class="tipbody"><p>${esc(tip)}</p></div><div class="nbtns"><button class="nb" data-x>Done</button></div>` });
    say(tip); $("[data-x]", el).addEventListener("click", () => closeWin(el)); el._onClose = hush;
  });
}, 8000);

// ---------------------------------------------------------------- boot + welcome
function welcome() {
  const el = V.welcome(api, h);
  layer.appendChild(el); el.style.zIndex = ++zWin;
  say(V.welcomeLine);
  const close = () => { el.remove(); hush(); };
  el.querySelectorAll("[data-w]").forEach(b => {
    b.addEventListener("pointerenter", () => sfx.hover());
    b.addEventListener("click", () => {
      const w = b.dataset.w; close(); sfx.click();
      if (w === "nav") greet();
      if (w === "windows") exitToWindows();
      if (w === "mouse") mouseTutorial();
      if (w === "overview") overview();
      if (w === "users") security();
      if (w === "net") internet();
    });
  });
  const cb = el.querySelector("#wIntro"); cb && cb.addEventListener("change", () => { prefs.intro = cb.checked; savePrefs(); });
  document.addEventListener("keydown", function k(e) { const b = el.querySelector(`[data-key="${e.key}"]`); if (b && el.isConnected) { b.click(); document.removeEventListener("keydown", k); } });
}
const api = {
  V, prefs, arg, go, launch, panel, msg, win, closeWin, caption, say, journal, taskJumper, mediaController, internet, mouseTutorial, overview, toggleSound, portrait, sfx, music, h, state: {},
  get current() { return current; }, isMuted, esc
};

function boot() {
  buildChrome(); refreshJournalBadge();
  const want = decodeURIComponent((location.hash || "").slice(1));
  const start = V.rooms[want] ? want : prefs.start === "last" && V.rooms[prefs.last] ? prefs.last : V.rooms[prefs.start] ? prefs.start : V.home;
  const splash = $("#splash"); splash.innerHTML = V.splashHTML; splash.hidden = false;
  let started = false;
  const begin = () => {
    if (started) return; started = true; splash.classList.add("gone"); setTimeout(() => (splash.hidden = true), 500);
    go(start, { quiet: true });
    if (prefs.intro && !want) welcome(); else greet();
  };
  splash.addEventListener("click", () => { sfx.unlock(); if (!isMuted()) sfx.startup(); begin(); });
  setTimeout(begin, want ? 200 : 2600);
}
document.addEventListener("pointerdown", () => sfx.unlock(), { once: true, capture: true });
document.addEventListener("keydown", e => {
  if (e.key === "Escape") { const ws = layer.querySelectorAll(".nwin"); if (ws.length) closeWin(ws[ws.length - 1]); else if (infoMode) setInfoMode(false); closeMenu(); }
  if (/^[1-9]$/.test(e.key) && !e.target.closest("input,textarea,select") && !layer.querySelector(".nwin,.welcome")) { const k = V.roomKeys[+e.key - 1]; if (k) go(k); }
});
window.addEventListener("hashchange", () => { const w = location.hash.slice(1); if (V.rooms[w] && w !== current) go(w); });
window.__nav = api;
boot();

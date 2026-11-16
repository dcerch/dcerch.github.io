// =====================================================================
//  ui.js — Navigator chrome (top bar, status bar), windows and panels.
// =====================================================================
import { PROFILE, CERTIFICATIONS, VOLUNTEERING, APPS, FAMILY, CATS, REMEMBRANCE, TRINKETS, ROOMS } from "./data.js";
import { sfx } from "./audio.js";

const $ = s => document.querySelector(s);
export const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

// ---------------------------------------------------------------- status bar + tooltip
const statusText = () => $("#statusText");
let defaultStatus = "";
export function setDefaultStatus(t) { defaultStatus = t; statusText().textContent = t; }
export function setStatus(t) { statusText().textContent = t || defaultStatus; }
export function setRoomTitle(name) { $("#roomName").textContent = name; }
export function tooltip(text, x, y) {
  const tt = $("#tooltip");
  if (!text) { tt.hidden = true; return; }
  tt.hidden = false; tt.textContent = text;
  const w = tt.offsetWidth, h = tt.offsetHeight;
  tt.style.left = Math.min(window.innerWidth - w - 8, x + 16) + "px";
  tt.style.top = Math.max(8, y - h - 10) + "px";
}
export function toast(msg, ms = 3600) {
  const t = $("#toast"); t.textContent = msg; t.hidden = false; t.classList.remove("show"); void t.offsetWidth; t.classList.add("show");
  clearTimeout(toast._t); toast._t = setTimeout(() => { t.classList.remove("show"); setTimeout(() => (t.hidden = true), 400); }, ms);
}

// ---------------------------------------------------------------- windows
let onCloseCb = null;
export function isWindowOpen() { return !$("#win").hidden; }
export function openWindow({ title, html, url, wide, onClose, icon = "🗔" }) {
  const w = $("#win"), body = $("#winBody");
  $("#winTitle").innerHTML = `<span aria-hidden="true">${icon}</span> ${esc(title)}`;
  w.classList.toggle("wide", !!(url || wide));
  const ext = $("#winExternal");
  if (url) {
    body.innerHTML = `<iframe src="${esc(url)}" title="${esc(title)}" allow="clipboard-write"></iframe>`;
    body.classList.add("has-frame");
    ext.hidden = false; ext.href = url.replace("?embed=1", "");
  } else {
    body.innerHTML = html; body.classList.remove("has-frame"); ext.hidden = true; body.scrollTop = 0;
  }
  onCloseCb = onClose || null;
  w.hidden = false; $("#scrim").hidden = false;
  requestAnimationFrame(() => w.classList.add("open"));
  sfx.open();
  setTimeout(() => $("#winClose").focus(), 30);
  return body;
}
export function closeWindow(opts = {}) {
  const w = $("#win"); if (w.hidden) return;
  w.classList.remove("open"); w.hidden = true; $("#scrim").hidden = true; $("#winBody").innerHTML = "";
  sfx.close();
  const cb = onCloseCb; onCloseCb = null; if (cb && !opts.silent) cb();
}
export function initChrome() {
  $("#winClose").addEventListener("click", closeWindow);
  $("#scrim").addEventListener("click", closeWindow);
  window.addEventListener("message", e => { if (e.origin === location.origin && e.data && e.data.type === "nav-close") closeWindow(); });
}

// ---------------------------------------------------------------- panel content
export const panels = {
  about() {
    return {
      title: "Channel 3 — Meet Dominic", icon: "📺",
      html: `<div class="tvcard"><div class="tvcard-head"><span class="tv-ch">CH 03</span><h2>${esc(PROFILE.name)}</h2><p class="tv-sub">${esc(PROFILE.title)}</p></div>
        ${PROFILE.about.map(p => `<p>${esc(p)}</p>`).join("")}
        <h3>Where I've been</h3><ul class="timeline">${PROFILE.career.map(c => `<li><b>${esc(c.org)}</b> — ${esc(c.role)} <span>${esc(c.when)}</span></li>`).join("")}</ul>
        <p class="hint">Tip: everything in this house is clickable. Wander around — some things are more curious than they look.</p></div>`
    };
  },
  linkedin() {
    return {
      title: "The Interview Suit", icon: "👔",
      html: `<div class="li-card"><div class="li-badge">in</div><div><h2>${esc(PROFILE.name)}</h2><p class="li-title">${esc(PROFILE.title)}</p></div></div>
        <p>Relationship builder with a front-end developer's toolkit and a passion for empowering people through technology.</p>
        <ul class="timeline">${PROFILE.career.map(c => `<li><b>${esc(c.org)}</b> — ${esc(c.role)} <span>${esc(c.when)}</span></li>`).join("")}</ul>
        <p class="btns"><a class="nbtn primary" href="${PROFILE.linkedin}" target="_blank" rel="noopener">Connect on LinkedIn ↗</a>
        <a class="nbtn" href="${PROFILE.github}" target="_blank" rel="noopener">GitHub ↗</a>
        <button class="nbtn" data-go="den">See my certifications →</button></p>`
    };
  },
  family(portraitURL) {
    return {
      title: "Family Portrait", icon: "🖼️", wide: true,
      html: `<figure class="portrait"><img src="${portraitURL}" alt="An illustrated 1990s studio family portrait: four siblings standing, Mom and Dad seated, and three cats, in front of a laser background"><figcaption>Picture day, ’96. Back row: ${FAMILY.filter(f => f.row !== "front").map(f => esc(f.who)).join(", ")}. Front: ${FAMILY.filter(f => f.row === "front").map(f => esc(f.who)).join(" and ")} — with the real bosses of the house, ${CATS.map(c => `${esc(c.name)} <i>(${esc(c.look)})</i>`).join(", ")}.</figcaption></figure>
        <p class="hint">The cats are somewhere in this house right now. Go say hi.</p>`
    };
  },
  remembrance() {
    return {
      title: "Remembrance", icon: "🕯️",
      html: `<div class="remember"><div class="flame" aria-hidden="true"></div><p>In loving memory.</p>
        <p class="names">${REMEMBRANCE.map(r => `<a href="${r.url}" target="_blank" rel="noopener">${esc(r.name)}</a>`).join(" · ")}</p></div>`
    };
  },
  accomplishments() {
    return {
      title: "The Den — Trophy Room", icon: "🏆",
      html: `<h3>Certifications & education</h3><div class="cert-grid">${CERTIFICATIONS.map(c => `<div class="cert" style="--c:${c.color}"><b>${esc(c.name)}</b><span>${esc(c.code)} · ${esc(c.issuer)}</span></div>`).join("")}</div>
        <h3>Giving back</h3><ul class="vol">${VOLUNTEERING.map(v => `<li><b>${esc(v.name)}</b><span>${esc(v.detail)}</span></li>`).join("")}</ul>
        <p class="btns"><a class="nbtn primary" href="${PROFILE.linkedin}" target="_blank" rel="noopener">Full details on LinkedIn ↗</a></p>`
    };
  },
  leviathan() {
    return {
      title: "Leviathan, Chapter VI (1651)", icon: "📖",
      html: `<div class="book"><p class="book-page">“Desire, to know why, and how, <span class="redact" title="Something has been scratched out here">█████████</span>; such as is in no living creature but <i>Man</i>: so that Man is distinguished, not onely by his Reason; but also by this singular Passion from other <i>Animals</i>… which is a <b>Lust of the mind</b>, that by a perseverance of delight in the continuall and indefatigable generation of Knowledge, exceedeth the short vehemence of any carnall Pleasure.”</p>
        <p class="book-note">✎ <i>pencilled in the margin:</i> “Say the missing word to the house. It's listening — type it anywhere, or dial it on the phone.”</p></div>`
    };
  },
  phone() {
    const keys = [["1", ""], ["2", "ABC"], ["3", "DEF"], ["4", "GHI"], ["5", "JKL"], ["6", "MNO"], ["7", "PQRS"], ["8", "TUV"], ["9", "WXYZ"], ["*", ""], ["0", "OPER"], ["#", ""]];
    return {
      title: "Rotary Phone", icon: "☎️",
      html: `<div class="phone"><div class="phone-display" id="phDisplay" aria-live="polite">Dial a number…</div>
        <div class="phone-pad">${keys.map(([k, l]) => `<button class="pkey" data-k="${k}" data-l="${l}"><b>${k}</b><small>${l}</small></button>`).join("")}</div>
        <p class="btns"><button class="nbtn primary" id="phCall">Call</button><button class="nbtn" id="phClear">Hang up</button></p>
        <p class="hint">Some words have numbers. Try spelling one.</p></div>`
    };
  },
  khajiit() {
    return {
      title: "A travelling merchant", icon: "💰",
      html: `<div class="khajiit"><p class="big">“Khajiit has wares, if you have coin.”</p>
        <p>The cat pats a bulging coin purse and slides you a weathered scroll — a guide to the weapons of the Elder Scrolls.</p>
        <p class="btns"><button class="nbtn primary" id="kjWares">💰 Browse the wares</button></p></div>`
    };
  },
  help() {
    return {
      title: "InfoGuide", icon: "ℹ️",
      html: `<h3>Welcome to Navigator</h3>
        <ul class="help">
          <li><b>Look around</b> — drag anywhere (or use ← →). Scroll or pinch to zoom.</li>
          <li><b>Hover</b> over anything; the status bar tells you what it is.</li>
          <li><b>Click</b> an object to walk up to it and open it.</li>
          <li><b>Doorways</b> light up when you hover — click to walk through. The room buttons up top work too (keys 1–4).</li>
          <li><b>🏠 Map</b> shows the whole house from above. <b>📓 Journal</b> tracks anything curious you find.</li>
          <li><b>☰ Menu</b> lists every object in the house — handy on phones or with a screen reader.</li>
          <li><b>🚀 KidSpace</b> is Ark KidSpace, the kids' room. It's also behind the starry hatch in the Rec Room. Pull the lever on the desk to change the view.</li>
          <li><b>EXIT</b> goes back to the Windows desktop.</li>
        </ul>
        <p class="hint">Inspired by Packard Bell Navigator 3.5 (1995), the house-shaped desktop that shipped on family PCs in the mid-’90s. This is a fan-made homage, not affiliated with Packard Bell.</p>`
    };
  },
  directory(hotspots) {
    const byRoom = {};
    hotspots.forEach(h => { const d = h.userData.hot; if (d.door || d.hidden && !d.revealed) return; (byRoom[d.room] = byRoom[d.room] || []).push(d); });
    const order = ["living", "kitchen", "den", "rec", "kidspace"];
    return {
      title: "Menu — everything in the house", icon: "☰",
      html: order.map(r => `<h3>${esc(ROOMS[r].name)}</h3><ul class="dir">${(byRoom[r] || []).map(d => `<li><button data-hot="${esc(d.id)}">${esc(d.label)}</button><span>${esc(d.desc)}</span></li>`).join("")}</ul>`).join("") +
        `<h3>Elsewhere</h3><ul class="dir"><li><a href="index.html" target="_top">Windows desktop</a><span>Back to dom 95.</span></li><li><a href="terminal.html">Classic terminal site</a><span>The previous green-screen version of dominiccerchio.com.</span></li><li><a href="apps.html">All apps (list view)</a><span></span></li><li><a href="toolbox.html">Toolbox (list view)</a><span></span></li></ul>`
    };
  },
  drawerList() {
    return TRINKETS.map(t => `<button data-tk="${esc(t.id)}" title="${esc(t.desc)}">${esc(t.name)}</button>`).join("");
  },
  app(id) { const a = APPS[id]; return { title: a.title, url: a.url, icon: "🗔" }; }
};

export function portraitDataURL(canvas) { try { return canvas.toDataURL("image/jpeg", 0.9); } catch (e) { return ""; } }

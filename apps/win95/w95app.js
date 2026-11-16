// Shared helpers for the dom 95 accessory apps: embedding, menus, dialogs.
(function () {
  const qs = new URLSearchParams(location.search);
  const EMBEDDED = (() => { try { return window.parent !== window; } catch (_) { return true; } })();
  if (!qs.has("embed") && !EMBEDDED) document.documentElement.classList.add("standalone-doc");
  const ready = fn => (document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", fn) : fn());
  ready(() => { if (!qs.has("embed") && !EMBEDDED) document.body.classList.add("standalone"); });

  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const h = html => { const t = document.createElement("template"); t.innerHTML = html.trim(); return t.content.firstElementChild; };

  // menus: { File: [ ["New", fn, "Ctrl+N"], "-", {head:"..."}, ["Disabled", null] ] }  — items may also be functions returning arrays (rebuilt on open)
  function menubar(el, menus) {
    el.classList.add("menubar"); el.innerHTML = "";
    Object.entries(menus).forEach(([name, items]) => {
      const top = h(`<div class="mtop"><span>${name.replace(/^(.)/, "<u>$1</u>")}</span><div class="drop"></div></div>`), drop = top.querySelector(".drop");
      const build = () => {
        drop.innerHTML = "";
        (typeof items === "function" ? items() : items).forEach(it => {
          if (it === "-") return drop.appendChild(h(`<div class="msep"></div>`));
          if (it.head) return drop.appendChild(h(`<div class="mhead">${esc(it.head)}</div>`));
          const mi = h(`<div class="mi${it[1] ? "" : " off"}">${it[3] || ""}<span>${esc(it[0])}</span>${it[2] ? `<span class="k">${esc(it[2])}</span>` : ""}</div>`);
          if (it[1]) mi.addEventListener("click", e => { e.stopPropagation(); closeMenus(); it[1](); });
          drop.appendChild(mi);
        });
      };
      top.addEventListener("pointerdown", e => {
        if (e.target.closest(".drop")) return;
        e.stopPropagation(); const was = top.classList.contains("open"); closeMenus();
        if (!was) { build(); top.classList.add("open"); }
      });
      top.addEventListener("pointerenter", () => { if (el.querySelector(".mtop.open") && !top.classList.contains("open")) { closeMenus(); build(); top.classList.add("open"); } });
      el.appendChild(top);
    });
  }
  function closeMenus() { document.querySelectorAll(".mtop.open").forEach(m => m.classList.remove("open")); }
  document.addEventListener("pointerdown", e => { if (!e.target.closest(".mtop")) closeMenus(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeMenus(); });

  const ICON = {
    info: `<svg class="ico32" viewBox="0 0 32 32"><circle cx="16" cy="16" r="14" fill="#fff" stroke="#000"/><circle cx="16" cy="9" r="2.5" fill="#00f"/><rect x="13.5" y="13" width="5" height="12" fill="#00f"/></svg>`,
    warn: `<svg class="ico32" viewBox="0 0 32 32"><path d="M16 2 L31 29 H1 Z" fill="#ff0" stroke="#000"/><rect x="14.5" y="10" width="3" height="11"/><rect x="14.5" y="23" width="3" height="3"/></svg>`,
    err: `<svg class="ico32" viewBox="0 0 32 32"><circle cx="16" cy="16" r="14" fill="#f00" stroke="#800"/><path d="M10 10 L22 22 M22 10 L10 22" stroke="#fff" stroke-width="3.5"/></svg>`
  };
  // dialog(title, bodyHtml, {buttons:["OK"], icon, width}) -> Promise<index> ; returns {el, close} via .handle
  function dialog(title, body, { buttons = ["OK"], icon = "", width = 0, center = false } = {}) {
    let close, el;
    const p = new Promise(res => {
      const v = h(`<div class="veil"><div class="dlg" role="dialog" aria-label="${esc(title)}"${width ? ` style="width:${width}px"` : ""}>
        <div class="dt"><span>${esc(title)}</span><button class="btn x" aria-label="Close">×</button></div>
        <div class="db"><div class="row">${icon ? ICON[icon] || icon : ""}<div class="dc" style="flex:1">${body}</div></div>
        ${buttons.length ? `<div class="btns${center ? " c" : ""}">${buttons.map((b, i) => `<button class="btn${i ? "" : " def"}" data-i="${i}">${esc(b)}</button>`).join("")}</div>` : ""}</div></div></div>`);
      document.body.appendChild(v);
      close = i => { v.remove(); document.removeEventListener("keydown", key); res(i); };
      const key = e => { if (e.key === "Escape") close(-1); if (e.key === "Enter" && !e.target.matches("textarea")) { e.preventDefault(); close(0); } };
      document.addEventListener("keydown", key);
      v.querySelectorAll("[data-i]").forEach(b => b.addEventListener("click", () => close(+b.dataset.i)));
      v.querySelector(".x").addEventListener("click", () => close(-1));
      el = v;
      setTimeout(() => { const f = v.querySelector("input,textarea,select") || v.querySelector(".btn.def"); f && f.focus(); }, 0);
    });
    p.close = i => close && close(i);
    p.el = el;
    return p;
  }
  const post = msg => { if (EMBEDDED) try { window.parent.postMessage(msg, location.origin); } catch (_) {} };

  window.W95 = {
    EMBEDDED, qs, esc, h, menubar, closeMenus, dialog, ICON,
    exit: () => post({ type: "win95:close" }),
    title: t => { post({ type: "win-title", title: t }); const tt = document.querySelector("#titlebar .tt"); if (tt) tt.textContent = t; document.title = t; },
    // ask the dom 95 desktop to open one of its programs (falls back to a new tab of the desktop)
    openApp: id => { if (EMBEDDED) post({ type: "win-open", id }); else window.open(new URL("../../index.html#" + id, location.href).href, "_blank"); },
    muted: () => localStorage.getItem("nav.muted") === "1"
  };
})();

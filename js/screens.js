// Animated in-world screens: TV, family PC, fridge magnets, symbols plaque, arcade.
import { SLOGANS } from "./data.js";

export function makeScreens(refs) {
  const S = {
    tvMode: "welcome", tvMsg: "", slogan: SLOGANS[Math.floor(Math.random() * SLOGANS.length)],
    symbols: randomSymbols(), symClicks: 0, lastTv: 0, lastPc: 0, lastArc: 0
  };

  function drawTV(t) {
    const { g, c } = refs.tvScreen, W = c.width, H = c.height;
    if (S.tvMode === "static" || S.tvMode === "clue") {
      const img = g.createImageData(W, H);
      for (let i = 0; i < img.data.length; i += 4) { const v = Math.random() * 255; img.data[i] = img.data[i + 1] = img.data[i + 2] = v; img.data[i + 3] = 255; }
      g.putImageData(img, 0, 0);
      if (S.tvMode === "clue") {
        g.fillStyle = "rgba(0,0,0,0.75)"; g.fillRect(20, H / 2 - 50, W - 40, 100);
        g.fillStyle = "#3dff7a"; g.font = "bold 26px 'Courier New'"; g.textAlign = "center";
        g.fillText(S.tvMsg, W / 2, H / 2 + 9);
      }
    } else {
      const bars = ["#c0c0c0", "#c0c000", "#00c0c0", "#00c000", "#c000c0", "#c00000", "#0000c0"];
      const phase = Math.floor(t / 7) % 2;
      if (phase === 0) {
        const grd = g.createLinearGradient(0, 0, 0, H); grd.addColorStop(0, "#14306e"); grd.addColorStop(1, "#5a1f6e");
        g.fillStyle = grd; g.fillRect(0, 0, W, H);
        g.fillStyle = "#f5d27a"; g.font = "italic bold 44px Georgia"; g.textAlign = "center"; g.fillText("Meet Dominic", W / 2, 120);
        g.fillStyle = "#fff"; g.font = "22px Arial"; g.fillText("Program Manager · Data & AI", W / 2, 165);
        g.fillStyle = "#9fd8ff"; g.font = "italic 24px Georgia"; g.fillText("“" + S.slogan + "”", W / 2, 240);
        g.fillStyle = "rgba(255,255,255," + (0.5 + 0.5 * Math.sin(t * 4)) + ")"; g.font = "bold 18px Arial"; g.fillText("▶ CLICK TO WATCH", W / 2, 320);
      } else {
        bars.forEach((b, i) => { g.fillStyle = b; g.fillRect(i * W / 7, 0, W / 7 + 1, H * 0.72); });
        g.fillStyle = "#111"; g.fillRect(0, H * 0.72, W, H * 0.28);
        g.fillStyle = "#fff"; g.font = "bold 30px 'Courier New'"; g.textAlign = "center"; g.fillText("dominiccerchio · CH 03", W / 2, H * 0.86);
      }
      g.fillStyle = "#3dff7a"; g.font = "bold 28px 'Courier New'"; g.textAlign = "left"; g.fillText("CH 03", 24, 44);
    }
    // scanlines
    g.fillStyle = "rgba(0,0,0,0.18)"; for (let y = 0; y < H; y += 4) g.fillRect(0, y, W, 2);
    refs.tvScreen.update();
  }

  function drawPC(t) {
    const { g, c } = refs.pcScreen, W = c.width, H = c.height;
    g.fillStyle = "#050a05"; g.fillRect(0, 0, W, H);
    g.fillStyle = "#3dff7a"; g.font = "16px 'Courier New'"; g.textAlign = "left";
    const lines = ["dominic@home:~$ whoami", "Dominic Cerchio", "dominic@home:~$ ls", "toolbox  apps  about", "dominic@home:~$ ./classic"];
    lines.forEach((l, i) => g.fillText(l, 12, 30 + i * 24));
    if (Math.floor(t * 2) % 2) g.fillRect(12 + g.measureText(lines[4]).width + 4, 30 + 4 * 24 - 13, 9, 15);
    g.fillStyle = "rgba(0,0,0,0.25)"; for (let y = 0; y < H; y += 3) g.fillRect(0, y, W, 1);
    refs.pcScreen.update();
  }

  function drawFridge() {
    const { g, c } = refs.fridgeScreen, W = c.width;
    g.clearRect(0, 0, W, W);
    const words = S.slogan.toUpperCase().split(/\s+/);
    const colors = ["#e23b3b", "#2a6ad0", "#f2b400", "#2aa04a", "#9a3ad0", "#f07a1a"];
    let y = 120; let k = 0;
    words.forEach((wd, wi) => {
      g.font = "bold 50px 'Arial Rounded MT Bold', Arial";
      const totalW = wd.length * 42; let x = (W - totalW) / 2 + ((wi % 2) ? 14 : -10);
      for (const ch of wd) {
        g.save(); g.translate(x + 20, y); g.rotate(((k * 37) % 11 - 5) * 0.02);
        g.fillStyle = colors[k % colors.length]; g.shadowColor = "rgba(0,0,0,0.35)"; g.shadowOffsetY = 3; g.shadowBlur = 3;
        g.fillText(ch, -16, 18); g.restore(); x += 42; k++;
      }
      y += 80;
    });
    // a kid's drawing + a photo strip in the corner
    g.fillStyle = "#fff"; g.fillRect(20, 400, 120, 92); g.strokeStyle = "#2a6ad0"; g.lineWidth = 4;
    g.beginPath(); g.moveTo(40, 470); g.lineTo(80, 420); g.lineTo(120, 470); g.closePath(); g.stroke();
    g.fillStyle = "#f2b400"; g.beginPath(); g.arc(120, 420, 12, 0, 7); g.fill();
    g.fillStyle = "#e23b3b"; g.beginPath(); g.arc(80, 404, 12, 0, 7); g.fill();
    refs.fridgeScreen.update();
  }

  function drawSymbols() {
    const { g, c } = refs.symScreen, W = c.width, H = c.height;
    const grd = g.createLinearGradient(0, 0, 0, H); grd.addColorStop(0, "#3b2412"); grd.addColorStop(1, "#24160b");
    g.fillStyle = grd; g.fillRect(0, 0, W, H);
    g.textAlign = "center"; g.textBaseline = "middle"; g.font = "bold 92px 'Segoe UI Symbol', 'Noto Sans Symbols', 'DejaVu Sans', serif";
    S.symbols.forEach((s, i) => {
      const lit = i < S.symClicks;
      g.fillStyle = lit ? "#7dffb0" : "#e9c46a";
      g.shadowColor = lit ? "#3dff7a" : "transparent"; g.shadowBlur = lit ? 24 : 0;
      g.fillText(s, 60 + i * 100, H / 2 + 4);
    });
    g.shadowBlur = 0;
    refs.symScreen.update();
  }

  function drawArcade(t) {
    const { g, c } = refs.arcScreen, W = c.width, H = c.height;
    g.fillStyle = "#000"; g.fillRect(0, 0, W, H);
    g.fillStyle = "#ffd400"; g.font = "bold 64px 'Courier New'"; g.textAlign = "center"; g.fillText("404", W / 2, 90);
    const x = (t * 60) % (W + 80) - 40;
    g.fillStyle = "#ffd400"; g.beginPath(); const m = Math.abs(Math.sin(t * 8)) * 0.7; g.moveTo(x, 160); g.arc(x, 160, 22, m, Math.PI * 2 - m); g.fill();
    g.fillStyle = "#ff3a3a"; g.beginPath(); g.arc(x - 60, 156, 20, Math.PI, 0); g.lineTo(x - 40, 182); g.lineTo(x - 80, 182); g.fill();
    for (let i = 0; i < 8; i++) if (40 + i * 30 > x + 20) { g.fillStyle = "#fff"; g.fillRect(40 + i * 30, 158, 5, 5); }
    if (Math.floor(t * 2) % 2) { g.fillStyle = "#fff"; g.font = "bold 18px 'Courier New'"; g.fillText("INSERT COIN", W / 2, 230); }
    refs.arcScreen.update();
  }

  drawFridge(); drawSymbols();
  return {
    state: S,
    tick(t) {
      if (t - S.lastTv > 1 / 12) { drawTV(t); S.lastTv = t; }
      if (t - S.lastPc > 0.25) { drawPC(t); S.lastPc = t; }
      if (t - S.lastArc > 1 / 15) { drawArcade(t); S.lastArc = t; }
    },
    newSlogan() { let s; do { s = SLOGANS[Math.floor(Math.random() * SLOGANS.length)]; } while (s === S.slogan); S.slogan = s; drawFridge(); return s; },
    tvClue(msg) { S.tvMode = "clue"; S.tvMsg = msg; },
    tvStatic(ms = 600) { const prev = S.tvMode; S.tvMode = "static"; setTimeout(() => { if (S.tvMode === "static") S.tvMode = prev; }, ms); },
    tvNormal() { S.tvMode = "welcome"; },
    symbolClick() { S.symClicks = Math.min(S.symbols.length, S.symClicks + 1); drawSymbols(); return S.symClicks; },
    symbolsReset() { S.symbols = randomSymbols(); S.symClicks = 0; drawSymbols(); }
  };
}

function randomSymbols() {
  const out = [];
  while (out.length < 10) {
    const cp = 9728 + Math.floor(Math.random() * 256);
    if (cp >= 9984 || cp === 0x262D) continue; out.push(String.fromCodePoint(cp));
  }
  return out;
}

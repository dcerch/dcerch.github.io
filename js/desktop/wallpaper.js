// Original painted wallpaper in the spirit of the classic "green hill, blue sky" XP desktop.
// Painted procedurally in the browser (no photo is used): a cobalt sky, big cumulus clouds,
// and one smooth, saturated green hill lit from the upper left.
export function paintWallpaper(canvas) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const W = Math.round(window.innerWidth * dpr), H = Math.round(window.innerHeight * dpr);
  canvas.width = W; canvas.height = H;
  const g0 = canvas.getContext("2d");
  let g = g0;
  let seed = 2001;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const S = Math.min(W, H * 1.6);                    // scale reference for clouds

  // ---- sky: deep cobalt overhead, paler toward the horizon
  const sky = g.createLinearGradient(0, 0, 0, H * 0.72);
  sky.addColorStop(0, "#1a4fbf"); sky.addColorStop(0.35, "#2f6fd6"); sky.addColorStop(0.75, "#6ea6ea"); sky.addColorStop(1, "#b7d6f4");
  g.fillStyle = sky; g.fillRect(0, 0, W, H);
  const haze = g.createRadialGradient(W * 0.25, H * 0.15, 0, W * 0.25, H * 0.15, W * 0.8);
  haze.addColorStop(0, "rgba(140,190,255,0.25)"); haze.addColorStop(1, "rgba(140,190,255,0)");
  g.fillStyle = haze; g.fillRect(0, 0, W, H);

  // ---- clouds: shaded puffs (bright tops, cool grey bellies) plus thin wisps
  function puff(x, y, r, bright = 1) {
    const gr = g.createRadialGradient(x - r * 0.3, y - r * 0.45, r * 0.05, x, y, r);
    gr.addColorStop(0, `rgba(255,255,255,${0.97 * bright})`);
    gr.addColorStop(0.45, `rgba(250,252,255,${0.85 * bright})`);
    gr.addColorStop(0.8, `rgba(205,220,240,${0.45 * bright})`);
    gr.addColorStop(1, "rgba(190,210,240,0)");
    g.fillStyle = gr; g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fill();
  }
  function cloud(cx, cy, w, h, n, bright = 1) {
    // flat-ish base, billowing top
    for (let i = 0; i < n; i++) {
      const t = rnd(), x = cx + (t - 0.5) * w, edge = 1 - Math.abs(t - 0.5) * 2;
      const r = h * (0.35 + rnd() * 0.45) * (0.55 + edge * 0.6);
      const y = cy - edge * h * 0.45 * rnd() + r * 0.15;
      puff(x, y, r, bright);
    }
    // soft grey underside
    const base = g.createLinearGradient(0, cy, 0, cy + h * 0.5);
    base.addColorStop(0, "rgba(170,190,220,0.0)"); base.addColorStop(0.5, "rgba(170,190,220,0.16)"); base.addColorStop(1, "rgba(170,190,220,0)");
    g.fillStyle = base; g.beginPath(); g.ellipse(cx, cy + h * 0.2, w * 0.48, h * 0.28, 0, 0, Math.PI * 2); g.fill();
  }
  // clouds are painted on their own layer, then softened with a blur so no puff edges show
  const cl = document.createElement("canvas"); cl.width = W; cl.height = H; g = cl.getContext("2d");
  // wispy stratocumulus streaks high up
  g.save(); g.globalAlpha = 0.5;
  for (let i = 0; i < 26; i++) {
    const x = rnd() * W, y = H * (0.04 + rnd() * 0.3), l = S * (0.08 + rnd() * 0.22), th = S * (0.006 + rnd() * 0.016);
    const gr = g.createLinearGradient(x, 0, x + l, 0);
    gr.addColorStop(0, "rgba(255,255,255,0)"); gr.addColorStop(0.5, "rgba(255,255,255,0.55)"); gr.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = gr; g.beginPath(); g.ellipse(x + l / 2, y, l / 2, th, -0.04, 0, Math.PI * 2); g.fill();
  }
  g.restore();
  // the big billowing cloud bank on the left, smaller ones drifting right
  cloud(W * 0.22, H * 0.24, S * 0.42, S * 0.13, 70);
  cloud(W * 0.42, H * 0.17, S * 0.22, S * 0.07, 34, 0.9);
  cloud(W * 0.66, H * 0.3, S * 0.26, S * 0.07, 36, 0.92);
  cloud(W * 0.88, H * 0.16, S * 0.3, S * 0.09, 44, 0.95);
  cloud(W * 0.05, H * 0.42, S * 0.2, S * 0.05, 24, 0.85);
  cloud(W * 0.55, H * 0.45, S * 0.3, S * 0.04, 26, 0.75);
  cloud(W * 0.92, H * 0.47, S * 0.18, S * 0.035, 18, 0.7);
  g = g0;
  g.save(); g.filter = `blur(${Math.round(5 * dpr)}px)`; g.drawImage(cl, 0, 0); g.restore();
  g.save(); g.globalAlpha = 0.12; g.drawImage(cl, 0, 0); g.restore();

  // ---- hills
  const crest = x => {                            // y of the main hill top at x
    const t = x / W;
    const dome = Math.exp(-Math.pow((t - 0.4) / 0.46, 2));   // broad rounded top a little left of centre
    return H * (0.75 - 0.2 * dome + 0.07 * t + 0.02 * Math.sin(t * 5.1 + 0.6));
  };
  const backCrest = x => { const t = x / W; return H * (0.68 - 0.06 * Math.exp(-Math.pow((t - 0.88) / 0.18, 2)) + 0.01 * Math.sin(t * 9)); };

  // distant hill behind, on the right, hazy
  let gr = g.createLinearGradient(0, H * 0.6, 0, H * 0.8);
  gr.addColorStop(0, "#6aa63c"); gr.addColorStop(1, "#3f7d26");
  g.fillStyle = gr; g.beginPath(); g.moveTo(0, H);
  for (let x = 0; x <= W + 4 * dpr; x += 4 * dpr) g.lineTo(x, backCrest(x)); g.lineTo(W, H); g.closePath(); g.fill();
  g.fillStyle = "rgba(180,215,240,0.18)"; g.fill();

  // main hill body
  const hillPath = () => { g.beginPath(); g.moveTo(0, H); for (let x = 0; x <= W + 4 * dpr; x += 4 * dpr) g.lineTo(x, crest(x)); g.lineTo(W, H); g.closePath(); };
  gr = g.createLinearGradient(0, H * 0.55, 0, H);
  gr.addColorStop(0, "#9fd83c"); gr.addColorStop(0.22, "#6fbf2a"); gr.addColorStop(0.6, "#3f9a1e"); gr.addColorStop(1, "#246b13");
  g.fillStyle = gr; hillPath(); g.fill();

  g.save(); hillPath(); g.clip();
  // sunlit crest glow, upper-left key light
  const sun = g.createRadialGradient(W * 0.36, H * 0.6, 0, W * 0.36, H * 0.6, W * 0.55);
  sun.addColorStop(0, "rgba(230,255,120,0.38)"); sun.addColorStop(0.5, "rgba(200,240,90,0.12)"); sun.addColorStop(1, "rgba(200,240,90,0)");
  g.fillStyle = sun; g.fillRect(0, 0, W, H);
  // shadowed lower-right flank
  const shadowR = g.createLinearGradient(W * 0.45, H * 0.7, W, H);
  shadowR.addColorStop(0, "rgba(10,50,10,0)"); shadowR.addColorStop(1, "rgba(10,50,10,0.38)");
  g.fillStyle = shadowR; g.fillRect(0, 0, W, H);
  // broad soft undulations in the turf
  for (let i = 0; i < 14; i++) {
    const x = rnd() * W, y = crest(x) + rnd() * (H - crest(x)), rx = W * (0.08 + rnd() * 0.2), ry = H * (0.02 + rnd() * 0.05);
    const u = g.createRadialGradient(x, y, 0, x, y, rx);
    const light = rnd() > 0.5;
    u.addColorStop(0, light ? "rgba(190,240,90,0.14)" : "rgba(20,70,10,0.14)"); u.addColorStop(1, "rgba(0,0,0,0)");
    g.fillStyle = u; g.save(); g.translate(x, y); g.scale(1, ry / rx); g.translate(-x, -y); g.beginPath(); g.arc(x, y, rx, 0, Math.PI * 2); g.fill(); g.restore();
  }
  // grass: short strokes, denser and longer toward the viewer
  const blades = Math.round((W * H) / (520 * dpr * dpr));
  for (let i = 0; i < blades; i++) {
    const x = rnd() * W, top = crest(x), y = top + Math.pow(rnd(), 0.75) * (H - top);
    const depth = (y - top) / (H - top + 1), len = (1.5 + depth * 7) * dpr;
    const hue = 85 + rnd() * 25, lit = 25 + rnd() * 30 + (1 - depth) * 12;
    g.strokeStyle = `hsla(${hue},70%,${lit}%,${0.12 + depth * 0.22})`;
    g.lineWidth = dpr * (0.5 + depth * 1.1);
    g.beginPath(); g.moveTo(x, y); g.lineTo(x + (rnd() - 0.4) * len * 0.5, y - len); g.stroke();
  }
  g.restore();
  // bright rim where the crest meets the sky
  g.strokeStyle = "rgba(225,255,150,0.55)"; g.lineWidth = 2.2 * dpr; g.beginPath();
  for (let x = 0; x <= W; x += 4 * dpr) (x ? g.lineTo(x, crest(x) + 1.2 * dpr) : g.moveTo(x, crest(x) + 1.2 * dpr)); g.stroke();

  // gentle vignette like a wide-angle lens
  const vig = g.createRadialGradient(W / 2, H * 0.45, Math.min(W, H) * 0.4, W / 2, H * 0.5, Math.max(W, H) * 0.85);
  vig.addColorStop(0, "rgba(0,0,30,0)"); vig.addColorStop(1, "rgba(0,0,30,0.22)");
  g.fillStyle = vig; g.fillRect(0, 0, W, H);
}

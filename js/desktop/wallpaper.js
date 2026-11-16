// Original painted wallpaper: rolling green hills under a blue sky.
// (An homage to the classic "green hill, blue sky" look — painted procedurally, no photo.)
export function paintWallpaper(canvas) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const W = Math.round(window.innerWidth * dpr), H = Math.round(window.innerHeight * dpr);
  canvas.width = W; canvas.height = H;
  const g = canvas.getContext("2d");
  let seed = 1995;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);

  // sky
  const sky = g.createLinearGradient(0, 0, 0, H * 0.75);
  sky.addColorStop(0, "#1f5fc4"); sky.addColorStop(0.45, "#4f8fe0"); sky.addColorStop(1, "#b9d9f6");
  g.fillStyle = sky; g.fillRect(0, 0, W, H);

  // clouds: clusters of soft puffs
  const clouds = Math.max(5, Math.round(W / (260 * dpr)));
  for (let c = 0; c < clouds; c++) {
    const cx = rnd() * W, cy = H * (0.06 + rnd() * 0.36), s = (60 + rnd() * 110) * dpr * (W / (1600 * dpr) + 0.5);
    const puffs = 7 + Math.floor(rnd() * 7);
    for (let p = 0; p < puffs; p++) {
      const px = cx + (rnd() - 0.5) * s * 2.6, py = cy + (rnd() - 0.6) * s * 0.55, r = s * (0.35 + rnd() * 0.45);
      const gr = g.createRadialGradient(px, py - r * 0.35, r * 0.1, px, py, r);
      gr.addColorStop(0, "rgba(255,255,255,0.95)"); gr.addColorStop(0.55, "rgba(255,255,255,0.65)");
      gr.addColorStop(0.85, "rgba(220,234,250,0.25)"); gr.addColorStop(1, "rgba(220,234,250,0)");
      g.fillStyle = gr; g.beginPath(); g.ellipse(px, py, r * 1.35, r * 0.8, 0, 0, Math.PI * 2); g.fill();
    }
  }
  // thin high cirrus streaks
  g.globalAlpha = 0.18; g.strokeStyle = "#fff"; g.lineCap = "round";
  for (let i = 0; i < 10; i++) {
    g.lineWidth = (2 + rnd() * 5) * dpr; const y = H * (0.05 + rnd() * 0.25), x = rnd() * W, l = (120 + rnd() * 300) * dpr;
    g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + l / 2, y - 12 * dpr, x + l, y + 4 * dpr); g.stroke();
  }
  g.globalAlpha = 1;

  // a hill is a smooth curve across the width; we fill below it
  function hill(baseY, amp, phase, freq, top, bottom, rim) {
    const pts = [];
    for (let x = 0; x <= W + 8 * dpr; x += 8 * dpr) {
      const t = x / W;
      pts.push([x, baseY - Math.sin(t * Math.PI * freq + phase) * amp - Math.sin(t * Math.PI * 2.7 + phase * 1.7) * amp * 0.18]);
    }
    const minY = Math.min(...pts.map(p => p[1]));
    const gr = g.createLinearGradient(0, minY, 0, H);
    gr.addColorStop(0, top); gr.addColorStop(1, bottom);
    g.fillStyle = gr; g.beginPath(); g.moveTo(0, H);
    pts.forEach(([x, y]) => g.lineTo(x, y)); g.lineTo(W, H); g.closePath(); g.fill();
    if (rim) {
      g.strokeStyle = rim; g.lineWidth = 3 * dpr; g.globalAlpha = 0.5; g.beginPath();
      pts.forEach(([x, y], i) => (i ? g.lineTo(x, y + 2 * dpr) : g.moveTo(x, y + 2 * dpr))); g.stroke(); g.globalAlpha = 1;
    }
    return pts;
  }
  hill(H * 0.74, H * 0.06, 2.2, 1.6, "#4f8a3a", "#2f6a2a");
  const main = hill(H * 0.86, H * 0.2, 0.15, 1.05, "#8fd24a", "#2f7d21", "#d8f58a");

  // grass texture
  const blades = Math.round((W * H) / (900 * dpr * dpr));
  for (let i = 0; i < blades; i++) {
    const x = rnd() * W, col = main[Math.min(main.length - 1, Math.round(x / (8 * dpr)))];
    const yTop = col ? col[1] : H * 0.7;
    const y = yTop + Math.pow(rnd(), 0.8) * (H - yTop);
    const depth = (y - yTop) / (H - yTop + 1);
    g.strokeStyle = rnd() > 0.5 ? `rgba(30,90,20,${0.08 + depth * 0.18})` : `rgba(200,240,120,${0.06 + (1 - depth) * 0.1})`;
    g.lineWidth = dpr * (0.6 + depth); g.beginPath(); g.moveTo(x, y); g.lineTo(x + (rnd() - 0.5) * 3 * dpr, y - (2 + depth * 5) * dpr); g.stroke();
  }
  const light = g.createRadialGradient(W * 0.2, H * 0.2, 0, W * 0.2, H * 0.2, W * 0.9);
  light.addColorStop(0, "rgba(255,250,220,0.18)"); light.addColorStop(1, "rgba(255,250,220,0)");
  g.fillStyle = light; g.fillRect(0, 0, W, H);
}

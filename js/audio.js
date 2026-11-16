// Tiny WebAudio synth — every sound is generated, no audio files.
let ctx = null, master = null;
let muted = localStorage.getItem("nav.muted") === "1";

function ac() {
  if (!ctx) {
    const A = window.AudioContext || window.webkitAudioContext; if (!A) return null;
    ctx = new A(); master = ctx.createGain(); master.gain.value = muted ? 0 : 0.5; master.connect(ctx.destination);
  }
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}
export function isMuted() { return muted; }
export function setMuted(m) { muted = m; localStorage.setItem("nav.muted", m ? "1" : "0"); if (master) master.gain.value = m ? 0 : 0.5; }

function tone(freq, dur, { type = "sine", vol = 0.3, at = 0, slide = 0, attack = 0.005 } = {}) {
  const c = ac(); if (!c || muted) return;
  const t = c.currentTime + at, o = c.createOscillator(), g = c.createGain();
  o.type = type; o.frequency.setValueAtTime(freq, t);
  if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(20, freq * slide), t + dur);
  g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + attack); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g); g.connect(master); o.start(t); o.stop(t + dur + 0.05);
}
function noise(dur, { vol = 0.2, at = 0, freq = 1200, q = 0.8, type = "bandpass" } = {}) {
  const c = ac(); if (!c || muted) return;
  const t = c.currentTime + at, len = Math.floor(c.sampleRate * dur), buf = c.createBuffer(1, len, c.sampleRate), d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
  const s = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain();
  s.buffer = buf; f.type = type; f.frequency.value = freq; f.Q.value = q;
  g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  s.connect(f); f.connect(g); g.connect(master); s.start(t);
}

export const sfx = {
  unlock() { ac(); },
  hover() { tone(1320, 0.05, { type: "triangle", vol: 0.05 }); },
  click() { tone(660, 0.07, { type: "square", vol: 0.08 }); tone(990, 0.08, { type: "square", vol: 0.06, at: 0.04 }); },
  open() { [523, 659, 784].forEach((f, i) => tone(f, 0.18, { type: "triangle", vol: 0.12, at: i * 0.05 })); },
  close() { [784, 587, 440].forEach((f, i) => tone(f, 0.14, { type: "triangle", vol: 0.1, at: i * 0.04 })); },
  whoosh() { noise(0.7, { vol: 0.16, freq: 500, q: 0.6, type: "lowpass" }); },
  drawer() { noise(0.35, { vol: 0.25, freq: 260, q: 3 }); tone(90, 0.2, { type: "sawtooth", vol: 0.05, at: 0.25 }); },
  meow() { tone(700, 0.45, { type: "sawtooth", vol: 0.06, slide: 0.6, attack: 0.08 }); tone(1050, 0.4, { type: "sine", vol: 0.05, slide: 0.65, attack: 0.08 }); },
  purr() { for (let i = 0; i < 8; i++) noise(0.09, { vol: 0.12, freq: 120, q: 4, at: i * 0.11 }); },
  dial(n) { for (let i = 0; i < (n || 10); i++) noise(0.02, { vol: 0.2, freq: 2500, q: 2, at: i * 0.06 }); },
  ring() { for (let r = 0; r < 2; r++) for (let i = 0; i < 12; i++) tone(i % 2 ? 480 : 440, 0.05, { type: "square", vol: 0.05, at: r * 0.8 + i * 0.05 }); },
  static() { noise(0.6, { vol: 0.15, freq: 3000, q: 0.3 }); },
  coin() { tone(988, 0.08, { type: "square", vol: 0.08 }); tone(1319, 0.3, { type: "square", vol: 0.08, at: 0.08 }); },
  secret() { [392, 523, 659, 784, 1047].forEach((f, i) => tone(f, 0.35, { type: "triangle", vol: 0.12, at: i * 0.09 })); },
  beep() { [880, 660, 990, 520].forEach((f, i) => tone(f, 0.09, { type: "square", vol: 0.07, at: i * 0.1 })); },
  bubble() { for (let i = 0; i < 6; i++) tone(300 + Math.random() * 500, 0.12, { type: "sine", vol: 0.08, at: i * 0.07, slide: 1.8 }); },
  boing() { tone(180, 0.5, { type: "sine", vol: 0.16, slide: 3.2 }); tone(360, 0.35, { type: "triangle", vol: 0.06, slide: 2.4, at: 0.05 }); },
  rocket() { noise(1.6, { vol: 0.2, freq: 400, q: 0.5, type: "lowpass" }); tone(120, 1.4, { type: "sawtooth", vol: 0.05, slide: 4 }); },
  crumple() { for (let i = 0; i < 7; i++) noise(0.05, { vol: 0.18, freq: 1800 + Math.random() * 2000, q: 1, at: i * 0.05 + Math.random() * 0.03 }); },
  talk() { for (let i = 0; i < 5; i++) tone(420 + Math.random() * 260, 0.06, { type: "square", vol: 0.035, at: i * 0.07 }); },
  // A short, original "welcome home" jingle in a mid-90s multimedia style.
  startup() {
    const notes = [[523, 0], [659, 0.18], [784, 0.36], [1047, 0.54], [988, 0.9], [784, 1.08], [880, 1.26], [1047, 1.6]];
    notes.forEach(([f, at]) => { tone(f, 0.55, { type: "triangle", vol: 0.13, at }); tone(f / 2, 0.6, { type: "sine", vol: 0.08, at }); });
    [262, 330, 392].forEach(f => tone(f, 2.4, { type: "sine", vol: 0.05, at: 1.6, attack: 0.3 }));
  }
};

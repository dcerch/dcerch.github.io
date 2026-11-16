// A tiny WebAudio sequencer for the stereo / Media Controller. All tunes are original.
import { isMuted } from "../audio.js";

const N = { C: 0, "C#": 1, D: 2, "D#": 3, E: 4, F: 5, "F#": 6, G: 7, "G#": 8, A: 9, "A#": 10, B: 11 };
const hz = note => { const m = /^([A-G]#?)(\d)$/.exec(note); return m ? 440 * Math.pow(2, (N[m[1]] + (+m[2] + 1) * 12 - 69) / 12) : 0; };
// "E4:1 G4:1 -:2" → [[freq, beats], …]   ("-" is a rest)
const parse = s => s.trim().split(/\s+/).map(t => { const [n, b] = t.split(":"); return [n === "-" ? 0 : hz(n), +b || 1]; });

const TRACKS = [
  { name: "Welcome Home (Living Room theme)", bpm: 104, wave: "triangle",
    lead: "E5:1 G5:1 C6:2 B5:1 G5:1 A5:2 G5:1 E5:1 F5:1 D5:1 E5:4 C5:1 E5:1 G5:2 F5:1 D5:1 B4:2 C5:1 D5:1 E5:1 D5:1 C5:4",
    bass: "C3:4 A2:4 F2:4 G2:4 C3:4 G2:4 F2:2 G2:2 C3:4" },
  { name: "Software Shelf Shuffle", bpm: 128, wave: "square",
    lead: "C5:1 -:1 E5:1 G5:1 A5:1 G5:1 E5:1 -:1 D5:1 -:1 F5:1 A5:1 G5:2 -:2 C5:1 -:1 E5:1 G5:1 C6:1 B5:1 A5:1 G5:1 F5:1 E5:1 D5:1 E5:1 C5:4",
    bass: "C3:2 G2:2 C3:2 G2:2 D3:2 A2:2 G2:4 C3:2 G2:2 F2:2 G2:2 C3:4" },
  { name: "Dial-Up Daydream", bpm: 84, wave: "sine",
    lead: "A4:2 C5:1 E5:1 D5:2 C5:2 B4:2 G4:1 B4:1 A4:4 F4:2 A4:1 C5:1 B4:2 A4:2 G#4:2 B4:2 A4:4",
    bass: "A2:4 F2:4 G2:4 A2:4 D2:4 F2:4 E2:4 A2:4" },
  { name: "KidSpace Countdown", bpm: 150, wave: "square",
    lead: "G5:1 E5:1 C5:1 E5:1 G5:1 C6:2 -:1 A5:1 F5:1 D5:1 F5:1 A5:1 D6:2 -:1 B5:1 G5:1 E5:1 G5:1 B5:1 E6:2 D6:1 C6:4",
    bass: "C3:2 C3:2 C3:2 G2:2 D3:2 D3:2 D3:2 A2:2 E3:2 E3:2 G2:2 G2:2 C3:4" }
];

let ctx = null, gain = null, timers = [], startedAt = 0;
function ac() { if (!ctx) { const A = window.AudioContext || window.webkitAudioContext; if (!A) return null; ctx = new A(); gain = ctx.createGain(); gain.gain.value = 0.18; gain.connect(ctx.destination); } if (ctx.state === "suspended") ctx.resume(); return ctx; }
function voice(c, f, t, d, wave, vol) {
  if (!f) return; const o = c.createOscillator(), g = c.createGain();
  o.type = wave; o.frequency.value = f; g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + d * 0.95);
  o.connect(g); g.connect(gain); o.start(t); o.stop(t + d);
}
export const music = {
  tracks: TRACKS, current: -1, playing: false,
  play(i) {
    this.stop(); if (isMuted()) return; const c = ac(); if (!c) return;
    const T = TRACKS[i], beat = 60 / T.bpm; this.current = i; this.playing = true; startedAt = c.currentTime;
    const sched = (seq, wave, vol, oct = 1) => { let t = c.currentTime + 0.05; parse(seq).forEach(([f, b]) => { voice(c, f * oct, t, b * beat, wave, vol); t += b * beat; }); return t; };
    const end = Math.max(sched(T.lead, T.wave, 0.5), sched(T.bass, "triangle", 0.55));
    timers.push(setTimeout(() => { if (this.current === i && this.playing) this.play((i + 1) % TRACKS.length); }, (end - c.currentTime) * 1000 + 600));
  },
  stop() { timers.forEach(clearTimeout); timers = []; this.playing = false; if (ctx) { gain.disconnect(); gain = ctx.createGain(); gain.gain.value = 0.18; gain.connect(ctx.destination); } },
  elapsed() { return this.playing && ctx ? ctx.currentTime - startedAt : 0; }
};

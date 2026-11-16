// A 28.8k modem handshake, synthesised with WebAudio (no recordings).
// Dial tone -> DTMF -> ring -> answer tone with phase flips -> V.8/V.34 probing -> the screech -> scrambled hiss.
// window.Modem.play(number) resolves when the handshake finishes; Modem.stop() cuts it off.
(function () {
  let ctx = null, out = null, nodes = [], timers = [], pending = null;
  const muted = () => localStorage.getItem("nav.muted") === "1";
  function ac() {
    if (!ctx) { const A = window.AudioContext || window.webkitAudioContext; if (!A) return null; ctx = new A(); }
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  }
  const DTMF = { 1: [697, 1209], 2: [697, 1336], 3: [697, 1477], 4: [770, 1209], 5: [770, 1336], 6: [770, 1477], 7: [852, 1209], 8: [852, 1336], 9: [852, 1477], 0: [941, 1336], "*": [941, 1209], "#": [941, 1477] };

  function osc(f, t0, t1, vol, type = "sine") {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type; o.frequency.setValueAtTime(f, t0);
    g.gain.setValueAtTime(0, t0); g.gain.linearRampToValueAtTime(vol, t0 + 0.008); g.gain.setValueAtTime(vol, t1 - 0.01); g.gain.linearRampToValueAtTime(0, t1);
    o.connect(g); g.connect(out); o.start(t0); o.stop(t1 + 0.02); nodes.push(o);
    return o;
  }
  function hiss(t0, t1, vol, freq, q) {
    const len = Math.ceil(ctx.sampleRate * (t1 - t0)), b = ctx.createBuffer(1, len, ctx.sampleRate), d = b.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    const s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
    s.buffer = b; f.type = "bandpass"; f.frequency.value = freq; f.Q.value = q;
    g.gain.setValueAtTime(0, t0); g.gain.linearRampToValueAtTime(vol, t0 + 0.02); g.gain.setValueAtTime(vol, t1 - 0.03); g.gain.linearRampToValueAtTime(0, t1);
    s.connect(f); f.connect(g); g.connect(out); s.start(t0); s.stop(t1 + 0.02); nodes.push(s);
  }

  function schedule(number) {
    let t = ctx.currentTime + 0.05;
    // off-hook click + dial tone
    hiss(t, t + 0.04, 0.4, 900, 0.5); t += 0.15;
    osc(350, t, t + 1.1, 0.12); osc(440, t, t + 1.1, 0.12); t += 1.2;
    // DTMF
    for (const ch of String(number).replace(/[^0-9*#]/g, "")) {
      const [lo, hi] = DTMF[ch]; osc(lo, t, t + 0.09, 0.14); osc(hi, t, t + 0.09, 0.14); t += 0.16;
    }
    t += 0.4;
    // one ring (440+480, 2s on) — shortened
    osc(440, t, t + 1.2, 0.07); osc(480, t, t + 1.2, 0.07); t += 1.5;
    // answer tone 2100 Hz with 180-degree phase flips every 450 ms (heard as little clicks)
    for (let i = 0; i < 5; i++) { osc(2100, t, t + 0.44, 0.1); t += 0.45; }
    // V.8 call menu / joint menu: short FSK bursts both directions
    for (let i = 0; i < 6; i++) {
      const o = osc(1650, t, t + 0.18, 0.08, "square");
      for (let k = 0; k < 8; k++) o.frequency.setValueAtTime(Math.random() < 0.5 ? 1650 : 1850, t + k * 0.022);
      t += 0.2;
    }
    // line probing "bong bong": two-tone chords
    const chord = (fs, d, v) => { fs.forEach(f => osc(f, t, t + d, v)); t += d + 0.04; };
    chord([1200, 2400], 0.45, 0.05); chord([600, 1800, 3000], 0.45, 0.04);
    // the screech: chirpy warbles over band noise
    const s0 = t;
    for (let i = 0; i < 14; i++) {
      const o = osc(900 + Math.random() * 1400, t, t + 0.12, 0.06, "sawtooth");
      o.frequency.exponentialRampToValueAtTime(600 + Math.random() * 2400, t + 0.12); t += 0.11;
    }
    hiss(s0, t, 0.18, 1800, 1.4);
    // training: a burst of scrambled white noise that settles into the carrier hiss
    hiss(t, t + 2.2, 0.28, 1700, 0.6); osc(1800, t, t + 2.2, 0.025); t += 2.2;
    hiss(t, t + 0.25, 0.08, 1700, 0.6); t += 0.3;
    return t - ctx.currentTime;
  }

  window.Modem = {
    // resolves after the handshake. If audio is unavailable or muted, still waits a sensible time.
    // onPhase(text, index) is called as the call progresses. Resolves true when connected, false if stopped.
    // Muted (or no audio): the same steps play silently in about 4 seconds.
    play(number = "5550195", onPhase = () => {}) {
      window.Modem.stop();
      return new Promise(res => {
        let dur = 4;
        if (!muted() && ac()) {
          out = ctx.createGain(); out.gain.value = 0.55; out.connect(ctx.destination);
          dur = schedule(number);
        }
        const P = window.Modem.phases, k = dur / 12.5;
        timers = P.map(([at, txt], i) => setTimeout(() => onPhase(txt, i), at * k * 1000));
        timers.push(setTimeout(() => { pending = null; res(true); }, dur * 1000));
        pending = res;
      });
    },
    // the timeline points (seconds of a 12.5s call) where the UI text should change
    phases: [[0, "Dialing..."], [3.6, "Waiting for answer..."], [5.2, "Connecting..."], [9.4, "Verifying user name and password..."], [11.4, "Logging on to network..."]],
    stop() {
      nodes.forEach(n => { try { n.stop(); } catch (e) {} }); nodes = [];
      if (out) { try { out.disconnect(); } catch (e) {} out = null; }
      timers.forEach(clearTimeout); timers = [];
      if (pending) { const r = pending; pending = null; r(false); }
    }
  };
})();

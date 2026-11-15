// =====================================================================
//  arg.js — "The Curiosity Protocol": the site's alternate-reality game,
//  reimagined as an in-world clue hunt. Progress is saved locally.
//
//  0. Something is curious about the house  →  read Leviathan in the Den
//  1. A word is redacted                    →  type it, or dial it on the phone
//  2. The TV speaks                         →  click the symbols (Rec Room) 10×
//  3. Something rustles by the fireplace    →  talk to the merchant cat
//  4. Khajiit has wares                     →  …if you have coin
// =====================================================================
const KEY = "nav.arg.v1";
const SECRET = "curiosity";
const SECRET_DIGITS = "287467489"; // C-U-R-I-O-S-I-T-Y on a phone keypad

const JOURNAL = [
  { step: 0, text: "Something about this house feels… curious. A book in the Den looks like it's been read a lot." },
  { step: 1, text: "Hobbes, Leviathan: a word has been scratched out — “____ is the lust of the mind.” The margin says to say it to the house. Type it anywhere, or dial it on the phone." },
  { step: 2, text: "The TV crackled to life: “You decide to click the symbols.” Where in this house are there symbols?" },
  { step: 3, text: "The symbols blazed green. Then — a rustle by the living-room fireplace. Someone has come to visit." },
  { step: 4, text: "A travelling merchant cat: “Khajiit has wares, if you have coin.” You've solved the Curiosity Protocol. 💰" }
];

export function createARG(hooks) {
  let state = { step: 0 };
  try { state = Object.assign(state, JSON.parse(localStorage.getItem(KEY) || "{}")); } catch (e) {}
  const save = () => localStorage.setItem(KEY, JSON.stringify(state));

  function advance(to) {
    if (to <= state.step) return false;
    state.step = to; save(); hooks.onStep(to); return true;
  }

  // keyboard listener: type "curiosity" anywhere
  let typed = "";
  window.addEventListener("keydown", e => {
    if (e.target && /input|textarea|select/i.test(e.target.tagName)) return;
    if (e.key && e.key.length === 1) {
      typed = (typed + e.key.toLowerCase()).slice(-SECRET.length);
      if (typed === SECRET) { typed = ""; speak(); }
    }
  });

  function speak() { hooks.onSpoken(); advance(2); }

  return {
    get step() { return state.step; },
    journal() { return JOURNAL.filter(j => j.step <= state.step); },
    total: JOURNAL.length,
    readBook() { advance(1); },
    dialed(digits) { if (digits.replace(/\D/g, "").endsWith(SECRET_DIGITS)) { speak(); return true; } return false; },
    dialedWord(word) { if (word.toLowerCase() === SECRET) { speak(); return true; } return false; },
    symbolsDone() { advance(3); },
    metMerchant() { if (state.step >= 3) advance(4); },
    reset() { state = { step: 0 }; save(); hooks.onReset(); }
  };
}

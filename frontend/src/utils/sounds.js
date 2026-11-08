const LS_SOUND = 'urukais_klick_sound';

let ctx = null;
function getCtx() {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
  return ctx;
}

export function isSoundEnabled() {
  return localStorage.getItem(LS_SOUND) !== 'off';
}

export function setSoundEnabled(v) {
  localStorage.setItem(LS_SOUND, v ? 'on' : 'off');
}

function tone({ freq = 440, type = 'sine', duration = 0.15, gain = 0.15, slideTo = null, delay = 0 }) {
  if (!isSoundEnabled()) return;
  try {
    const ac = getCtx();
    const t0 = ac.currentTime + delay;
    const osc = ac.createOscillator();
    const g = ac.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t0 + duration);
    g.gain.setValueAtTime(0, t0);
    g.gain.linearRampToValueAtTime(gain, t0 + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
    osc.connect(g);
    g.connect(ac.destination);
    osc.start(t0);
    osc.stop(t0 + duration + 0.02);
  } catch {}
}

function noise({ duration = 0.2, gain = 0.1, lowpass = 800 }) {
  if (!isSoundEnabled()) return;
  try {
    const ac = getCtx();
    const bufferSize = Math.floor(ac.sampleRate * duration);
    const buffer = ac.createBuffer(1, bufferSize, ac.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    const src = ac.createBufferSource();
    src.buffer = buffer;
    const filter = ac.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = lowpass;
    const g = ac.createGain();
    g.gain.setValueAtTime(gain, ac.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + duration);
    src.connect(filter);
    filter.connect(g);
    g.connect(ac.destination);
    src.start();
  } catch {}
}

export function playClick() {
  tone({ freq: 220, type: 'square', duration: 0.08, gain: 0.04 });
}

export function playSlash() {
  noise({ duration: 0.12, gain: 0.12, lowpass: 4000 });
  tone({ freq: 880, type: 'triangle', duration: 0.15, gain: 0.07, slideTo: 220 });
}

export function playGrowl() {
  tone({ freq: 80, type: 'sawtooth', duration: 0.45, gain: 0.12, slideTo: 55 });
  tone({ freq: 120, type: 'sawtooth', duration: 0.4, gain: 0.07, slideTo: 80 });
}

export function playVictory() {
  [0, 0.1, 0.25].forEach((d, i) => {
    tone({ freq: [330, 392, 523][i], type: 'triangle', duration: 0.4, gain: 0.07, delay: d });
  });
}

export function playBlood() {
  noise({ duration: 0.35, gain: 0.15, lowpass: 400 });
  tone({ freq: 60, type: 'sine', duration: 0.6, gain: 0.1, slideTo: 28 });
}
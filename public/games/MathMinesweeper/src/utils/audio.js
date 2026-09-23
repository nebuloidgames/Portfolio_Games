// Web Audio API Sound Effects Generator (Lightweight, responsive, 0-latency)

let audioCtx = null;
let soundEnabled = true;

function getAudioContext() {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export const toggleSound = () => {
  soundEnabled = !soundEnabled;
  if (soundEnabled) {
    playChime();
  }
  return soundEnabled;
};

export const isSoundEnabled = () => soundEnabled;

export const playClick = () => {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(480, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(160, ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.08);
  } catch {
    // Ignore audio autoplay restrictions gracefully
  }
};

export const playPop = () => {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(320, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(740, ctx.currentTime + 0.12);

    gain.gain.setValueAtTime(0.18, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.12);
  } catch {
    // Ignore audio restrictions
  }
};

export const playChime = () => {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const freqs = [523.25, 659.25, 783.99, 1046.50]; // C, E, G, High C
    freqs.forEach((f, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, ctx.currentTime + idx * 0.05);

      gain.gain.setValueAtTime(0.1, ctx.currentTime + idx * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.05 + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + idx * 0.05);
      osc.stop(ctx.currentTime + idx * 0.05 + 0.35);
    });
  } catch {
    // Ignore
  }
};

export const playExplosion = () => {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    // 1. Initial transient crack (detonator shockwave)
    const crackOsc = ctx.createOscillator();
    const crackGain = ctx.createGain();
    crackOsc.type = 'triangle';
    crackOsc.frequency.setValueAtTime(450, ctx.currentTime);
    crackOsc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.1);
    crackGain.gain.setValueAtTime(0.6, ctx.currentTime);
    crackGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
    crackOsc.connect(crackGain);
    crackGain.connect(ctx.destination);
    crackOsc.start();
    crackOsc.stop(ctx.currentTime + 0.1);

    // 2. White noise fireball roar
    const bufferSize = ctx.sampleRate * 0.9;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1000, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.85);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.65, ctx.currentTime);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.85);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noise.start();
    noise.stop(ctx.currentTime + 0.85);

    // 3. Deep sub-bass thunder boom
    const subOsc = ctx.createOscillator();
    const subGain = ctx.createGain();
    subOsc.type = 'sawtooth';
    subOsc.frequency.setValueAtTime(160, ctx.currentTime);
    subOsc.frequency.exponentialRampToValueAtTime(25, ctx.currentTime + 0.75);

    subGain.gain.setValueAtTime(0.5, ctx.currentTime);
    subGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.75);

    subOsc.connect(subGain);
    subGain.connect(ctx.destination);
    subOsc.start();
    subOsc.stop(ctx.currentTime + 0.75);

    // 4. Secondary chain crackles (debris / mine chain reactions)
    [0.12, 0.22, 0.35].forEach((delay) => {
      const popOsc = ctx.createOscillator();
      const popGain = ctx.createGain();
      popOsc.type = 'square';
      popOsc.frequency.setValueAtTime(200, ctx.currentTime + delay);
      popOsc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + delay + 0.08);
      popGain.gain.setValueAtTime(0.2, ctx.currentTime + delay);
      popGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.08);
      popOsc.connect(popGain);
      popGain.connect(ctx.destination);
      popOsc.start(ctx.currentTime + delay);
      popOsc.stop(ctx.currentTime + delay + 0.08);
    });
  } catch {
    // Ignore
  }
};

export const playVictory = () => {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.1);
      gain.gain.setValueAtTime(0.2, ctx.currentTime + idx * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.1 + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + idx * 0.1);
      osc.stop(ctx.currentTime + idx * 0.1 + 0.4);
    });
  } catch {
    // Ignore
  }
};


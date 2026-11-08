// Synthesizes assets/audio/tap.wav — a short percussive "tock" played when
// the learner taps an answer option, before the correct/wrong result is
// known. Matches the format of the existing sound effects (mono, 44.1kHz,
// 16-bit PCM) so it plays through the same expo-audio player setup.
// Run with `node scripts/generateTapSound.js`.
'use strict';
const fs = require('fs');
const path = require('path');

const SAMPLE_RATE = 44100;
const DURATION_S = 0.075;
const N = Math.floor(SAMPLE_RATE * DURATION_S);

const samples = new Float32Array(N);
for (let i = 0; i < N; i += 1) {
  const t = i / SAMPLE_RATE;
  // A quick pitch-down sine ("tock") body...
  const freq = 1000 - 350 * (t / DURATION_S);
  const tone = Math.sin(2 * Math.PI * freq * t);
  // ...plus a few milliseconds of filtered noise right at the attack, for a
  // tactile "click" rather than a pure beep.
  const clickWindow = Math.max(0, 1 - t / 0.006);
  const click = (Math.random() * 2 - 1) * clickWindow * 0.5;
  // Fast attack, exponential decay envelope so it feels snappy, not ringy.
  const envelope = Math.exp(-t * 55);
  samples[i] = (tone * 0.6 + click) * envelope * 0.5;
}

const dataSize = N * 2;
const buf = Buffer.alloc(44 + dataSize);
buf.write('RIFF', 0);
buf.writeUInt32LE(36 + dataSize, 4);
buf.write('WAVE', 8);
buf.write('fmt ', 12);
buf.writeUInt32LE(16, 16);
buf.writeUInt16LE(1, 20); // PCM
buf.writeUInt16LE(1, 22); // mono
buf.writeUInt32LE(SAMPLE_RATE, 24);
buf.writeUInt32LE(SAMPLE_RATE * 2, 28); // byte rate
buf.writeUInt16LE(2, 32); // block align
buf.writeUInt16LE(16, 34); // bits per sample
buf.write('data', 36);
buf.writeUInt32LE(dataSize, 40);
for (let i = 0; i < N; i += 1) {
  const clamped = Math.max(-1, Math.min(1, samples[i]));
  buf.writeInt16LE(Math.round(clamped * 32767), 44 + i * 2);
}

const outPath = path.join(__dirname, '..', 'assets', 'audio', 'tap.wav');
fs.writeFileSync(outPath, buf);
console.log(`Wrote ${outPath} (${DURATION_S * 1000}ms, ${dataSize} bytes)`);

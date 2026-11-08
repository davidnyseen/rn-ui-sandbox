// Pregenerates a Google Cloud Text-to-Speech (Neural) mp3 for every unique
// Thai string tested/taught anywhere in scripts/courseContent/*.js, bundles
// them under assets/audio/thai/, and writes src/generated/thaiAudioMap.ts —
// a literal Thai-text -> require(...) lookup table consumed by src/tts.ts.
// Bundling pregenerated audio (rather than calling the TTS API live from the
// app) means no network dependency or latency at speak-time, and no
// per-play cost — this is a one-time content-build step, run again only
// when course content changes (already-generated files are skipped, so
// re-running after adding a few new lessons only synthesizes the new text).
//
// Usage: node scripts/generateThaiAudio.js
// Requires GOOGLE_CLOUD_TTS_API_KEY in .env (see .env.example).
'use strict';
const fs = require('fs');
const path = require('path');
const { hashStr } = require('./lib/courseBuilder');

const ROOT = path.join(__dirname, '..');
const AUDIO_DIR = path.join(ROOT, 'assets', 'audio', 'thai');
const MAP_PATH = path.join(ROOT, 'src', 'generated', 'thaiAudioMap.ts');

function loadEnvKey(name) {
  const envPath = path.join(ROOT, '.env');
  const text = fs.readFileSync(envPath, 'utf8');
  const line = text.split(/\r?\n/).find((l) => l.startsWith(`${name}=`));
  if (!line) throw new Error(`${name} not found in .env — see .env.example`);
  return line.slice(name.length + 1).trim();
}

function collectUniqueThaiStrings() {
  const files = ['restaurant', 'greetings', 'basics', 'family', 'numbers', 'travel'];
  const set = new Set();
  for (const f of files) {
    const mod = require(`./courseContent/${f}`);
    // Most courseContent files export a single subject object; greetings.js
    // exports an array of subjects (greetingsSubjects, one per unit) —
    // normalize to an array either way so both shapes iterate the same.
    const val = Object.values(mod)[0];
    const subjects = Array.isArray(val) ? val : [val];
    for (const subj of subjects) {
    for (const les of subj.lessons) {
      if (les.kind === 'dialogue') {
        // Dialogue steps (intro/comprehension/translate/blank/speak) hold no
        // Thai text of their own — they reference lineIndex into les.lines,
        // which is what actually needs audio.
        for (const line of les.lines) set.add(line.thai);
        continue;
      }
      for (const step of les.steps) {
        if (step.type === 'wordIntro') set.add(step.word.thai);
        else if (step.type === 'wordIntroGroup') {
          for (const w of step.words) set.add(w.thai);
        } else if (step.type === 'translationChoice' || step.type === 'speak') set.add(step.thai);
        else if (step.type === 'sentenceOrder') {
          for (const tile of Object.values(step.words)) set.add(tile.thai);
        } else if (step.type === 'reply') {
          // Every context/option line needs a female-voice entry — not just
          // the 'F'-speaker ones. It's the fallback thaiAudioMapMale[text]
          // ?? thaiAudioMap[text] in src/tts.ts falls back to if a male
          // clip is ever missing, and it's what plays outright for any
          // line spoken by 'F'. Male-speaker lines get their own
          // additional entry from generateThaiAudioMale.js.
          for (const line of step.context) set.add(line.thai);
          for (const opt of step.options) set.add(opt.thai);
        }
      }
    }
    }
  }
  return [...set];
}

async function pickVoice(apiKey) {
  const res = await fetch(`https://texttospeech.googleapis.com/v1/voices?languageCode=th-TH&key=${apiKey}`);
  if (!res.ok) throw new Error(`voices.list failed: ${res.status} ${await res.text()}`);
  const { voices } = await res.json();
  const rank = (name) =>
    name.includes('Neural2') ? 0 : name.includes('Studio') ? 1 : name.includes('Wavenet') ? 2 : 3;
  voices.sort((a, b) => rank(a.name) - rank(b.name));
  if (voices.length === 0) throw new Error('No th-TH voices returned by the API');
  return voices[0].name;
}

async function synthesize(apiKey, voiceName, text) {
  const res = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      input: { text },
      voice: { languageCode: 'th-TH', name: voiceName },
      audioConfig: { audioEncoding: 'MP3', speakingRate: 0.92 },
    }),
  });
  if (!res.ok) throw new Error(`synthesize failed for "${text}": ${res.status} ${await res.text()}`);
  const { audioContent } = await res.json();
  return Buffer.from(audioContent, 'base64');
}

async function main() {
  const apiKey = loadEnvKey('GOOGLE_CLOUD_TTS_API_KEY');
  const strings = collectUniqueThaiStrings();
  console.log(`Found ${strings.length} unique Thai strings across all subjects.`);

  fs.mkdirSync(AUDIO_DIR, { recursive: true });
  fs.mkdirSync(path.dirname(MAP_PATH), { recursive: true });

  const voiceName = await pickVoice(apiKey);
  console.log(`Using voice: ${voiceName}`);

  const entries = []; // { text, id }
  let generated = 0;
  let skipped = 0;
  for (const text of strings) {
    const id = hashStr(text).toString(36);
    const filePath = path.join(AUDIO_DIR, `${id}.mp3`);
    entries.push({ text, id });
    if (fs.existsSync(filePath)) {
      skipped += 1;
      continue;
    }
    const audio = await synthesize(apiKey, voiceName, text);
    fs.writeFileSync(filePath, audio);
    generated += 1;
    if (generated % 25 === 0) console.log(`  ...${generated} generated so far`);
  }

  const lines = [];
  lines.push('// AUTO-GENERATED by scripts/generateThaiAudio.js — do not edit by hand.');
  lines.push("// Literal Thai text -> bundled mp3 asset, consumed by src/tts.ts's speakThai().");
  lines.push('const thaiAudioMap: Record<string, number> = {');
  for (const { text, id } of entries) {
    lines.push(`  ${JSON.stringify(text)}: require(${JSON.stringify(`../../assets/audio/thai/${id}.mp3`)}),`);
  }
  lines.push('};');
  lines.push('export default thaiAudioMap;');
  lines.push('');
  fs.writeFileSync(MAP_PATH, lines.join('\n'));

  console.log(`Done. ${generated} newly generated, ${skipped} already cached, ${entries.length} total mapped.`);
  console.log(`Wrote ${MAP_PATH}`);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});

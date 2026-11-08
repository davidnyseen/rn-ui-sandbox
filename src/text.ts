// Thai script has no spaces between words, and speech recognizers disagree
// on where to insert them — so comparisons strip whitespace entirely rather
// than relying on word boundaries.
function normalizeThai(text: string): string {
  return text.replace(/\s+/g, '').trim();
}

// Tone marks and the repetition/short-vowel marks are the things a learner (or the recogniser) most often gets slightly
// off, so they're ignored; beyond that a near miss — about one character in four — still counts. Strict exact matching
// failed users who said the phrase fine (heard ภายใน for ไปไหน, 2026-11-08).
const MINOR_MARKS = /[็-๎]/g;

function editDistance(a: string, b: string): number {
  const prev = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    let diag = prev[0];
    prev[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const up = prev[j];
      prev[j] = Math.min(prev[j] + 1, prev[j - 1] + 1, diag + (a[i - 1] === b[j - 1] ? 0 : 1));
      diag = up;
    }
  }
  return prev[b.length];
}

export function matchesSpokenThai(heard: string, target: string): boolean {
  const h = normalizeThai(heard).replace(MINOR_MARKS, '');
  const t = normalizeThai(target).replace(MINOR_MARKS, '');
  if (!h) return false;
  if (h === t || h.includes(t) || t.includes(h)) return true;
  return editDistance(h, t) <= Math.max(1, Math.round(t.length / 4));
}

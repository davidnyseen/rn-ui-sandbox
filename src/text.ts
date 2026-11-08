// Thai script has no spaces between words, and speech recognizers disagree
// on where to insert them — so comparisons strip whitespace entirely rather
// than relying on word boundaries.
function normalizeThai(text: string): string {
  return text.replace(/\s+/g, '').trim();
}

export function matchesSpokenThai(heard: string, target: string): boolean {
  const h = normalizeThai(heard);
  const t = normalizeThai(target);
  if (!h) return false;
  return h === t || h.includes(t) || t.includes(h);
}

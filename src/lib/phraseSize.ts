// Heading size for the big romanized phrase at the top of a question (choice screen, speaking screen): a single word
// stays big, a whole sentence shrinks so it doesn't fill the screen (user, 2026-11-10: "isn't text a bit big",
// "confusing a bit"). One rule for every screen that shows a phrase heading.
export function phraseSize(roman: string) {
  if (roman.length <= 14) return { fontSize: 44, lineHeight: 46 };
  if (roman.length <= 28) return { fontSize: 32, lineHeight: 36 };
  return { fontSize: 26, lineHeight: 31 };
}

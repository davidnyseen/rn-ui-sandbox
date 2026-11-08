# Lesson Authoring Guide

Rules for writing/editing lessons in `scripts/courseContent/*.js` (the DB-backed
course system — greetings, basics, family, numbers, restaurant, travel).
Read this before touching any lesson content. It exists because these rules
got established, violated, and re-established more than once — this is the
version to trust.

## 1. Five new words per lesson, maximum

Each `lesson(...)` block introduces at most 5 new `wordIntro`/`wordIntroGroup`
words. Fewer is fine (some good lessons teach 2-3 words). More than 5 means
split the lesson.

Check this with a quick script whenever you're not sure:

```js
node -e "
const { XSubject } = require('./scripts/courseContent/X');
for (const les of XSubject.lessons) {
  if (les.kind === 'dialogue') continue;
  const words = les.steps.filter(s => s.type==='wordIntro' || s.type==='wordIntroGroup')
    .flatMap(s => s.type==='wordIntro' ? [s.word.thai] : s.words.map(w=>w.thai));
  console.log(les.id, words.length, words.join(','));
}
"
```

## 2. Sentences should get LONGER as a subject progresses — not shorter

This is the rule most likely to get over-corrected into the wrong shape, so
read it twice.

- Lesson 1-3 of a subject: short, 1-2 word items — that's normal, there's
  barely any vocabulary yet.
- By lesson 4-5: at least one exercise (an `order()` or `speak()`) should
  chain together **4-7 words pulled from at least two different earlier
  lessons**, not just the words this lesson itself just introduced.
- Keep building from there — later lessons in the same subject should have
  the longest, most natural sentences, reusing vocabulary from across the
  whole subject so far.

Every lesson still gets its own short word-level checks too (`mc`/`speak` on
individual words) — the longer cumulative sentence is *in addition to* those,
not a replacement for them.

**What this is not:** permission to staple two unrelated real phrases
together with a connector (กับ/แล้วก็) just to hit a word-reuse quota. That
produces nonsense like "ขอบคุณมากกับสวยมาก" — "thanks a lot, AND it's very
beautiful" — two different topics that have no business being one sentence.
The bad thing was never *length*, it was *sentences that don't make sense*.

## 3. Where sentences come from, in priority order

1. **An exact sentence from the cited textbook.** Every `SRC.*` constant
   points at a real page. Go find what that page actually says before
   inventing anything.
2. **A natural extension of a pattern the book demonstrates**, built only
   from words/phrases the book itself already uses. Example: the book gives
   you "pai gin kao" (going to eat) and "glap ban" (go home) as separate real
   phrases, plus "pai thîao láew-gɔ̂ɔ glàp" (go out, then come back) showing
   how láew-gɔ̂ɔ chains two of its own real verb phrases — from those three
   real fragments, "ไปกินข้าวแล้วก็กลับบ้าน" (go eat, then go home) is a
   legitimate extension, not a guess.
3. **Never**: a sentence that only exists because you needed something N
   words long. If you can't ground it in (1) or (2), the lesson doesn't get
   that exercise yet — wait for a later lesson where the vocabulary supports
   a real sentence.

### Where the textbook text actually is

`scripts/extracted/` holds OCR text pulled from the reference PDFs
(`scripts/ocr_index.sh` is the script that made them, in case a book needs
re-extracting or a new book gets added):

- `essential.index.txt` — **use this one.** Full page-by-page OCR of
  *Essential Thai* (Higbie), ~8500 lines, `--- PAGE NNN (essential) ---`
  markers. Has real Thai script alongside romanization.
- `essential-text.txt` — a smaller, earlier extraction attempt. **Turned out
  blank for pp.10-40** (the exact pages most early greetings content cites) —
  don't trust it without checking `essential.index.txt` first.
- `fsi.txt` / `fsi.index.txt` — FSI Thai Basic Course. `fsi.txt` is a failed
  extraction (just repeated "Hosted for free..." boilerplate, no real
  content) — use `fsi.index.txt` instead.
- `sawasdee.index.txt` — Sawasdee Thai course, OCR quality is rougher (lots
  of garbled characters) but usable with care.

`grep -n -i "<romanized word>" scripts/extracted/essential.index.txt` is the
fastest way to find every place a word/phrase actually appears in context.

## 4. Every lesson auto-gets a matching-cards game

`lesson()` in `scripts/lib/courseBuilder.js` automatically appends a `match`
step built from that lesson's own `wordIntro`/`wordIntroGroup` words, if it
has 2 or more. **Don't hand-author these** — if a lesson doesn't have one, the
fix is almost always that it has fewer than 2 new words, not that you need to
add a `match()` call yourself. This applies to every subject automatically;
there's nothing subject-specific to do.

## 5. Regenerate, validate, apply — every time

After editing any `scripts/courseContent/*.js` file:

```bash
node scripts/generateSeedSql<Subject>.js   # or generateSeedSql.js for restaurant
```

This runs `checkDictionary` (throws if any exercise uses a word before its
`wordIntro`) and rewrites the matching `supabase/seed_*.sql` file. A clean
run with no thrown error means the content is internally consistent — it
does **not** mean the sentences are good Thai; that's still on you (see
rules 2-3).

To see the change on a phone connected to the local dev Supabase (check
`.env.local`'s `EXPO_PUBLIC_SUPABASE_URL` — if it's a `192.168.x.x`/
`localhost` address, this is what the phone is actually using, not the
production `.env` URL):

```bash
docker exec -i supabase_db_learn_thai psql -U postgres -d postgres -v ON_ERROR_STOP=1 < "supabase/seed_<subject>.sql"
```

This reseeds `course_subjects`/`course_lessons` for that one subject only —
safe, idempotent, local-only. **Never** run a seed file against the
production Supabase URL without being asked to.

## 6. Downstream dictionary chaining

`generateSeedSqlGreetings.js` chains `greetings-hello` → `greetings-names`:
words the first subject teaches are available to the second without
re-teaching. If you rename/remove a word from an earlier lesson, check
whether a later lesson (in this file or chained after it) still uses it —
`checkDictionary` will throw and tell you exactly where, so trust the error
over guessing.

## Worked example

`scripts/courseContent/greetings.js`, `greetings-hello` subject (`gh01`-`gh08`)
is the reference implementation of all the rules above: ≤4 new words per
lesson, word-level checks in every lesson, and a real, cumulative,
longer-each-time sentence starting around `gh05` (6 words: "ไปกินข้าวแล้วก็กลับบ้าน")
through `gh07` (6 words: "ไปเที่ยวสนุกมากขอบคุณค่ะ") — every word in those
sentences was taught in an earlier lesson within the subject, and every piece
of them traces back to something the textbook actually says on pp.22-25.

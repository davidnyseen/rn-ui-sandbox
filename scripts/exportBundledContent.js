// Rebuilds src/generated/courseContent.json (the lesson content bundled into the app) straight from the generated
// supabase/seed_*.sql files — the same rows the database is loaded from — so content can be re-bundled without a
// running local Supabase. Run after the generateSeedSql*.js scripts.
'use strict';
const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, '..', 'supabase');
const subjects = [];
const lessons = [];
for (const f of fs.readdirSync(dir).filter((n) => /^seed.*\.sql$/.test(n))) {
  const sql = fs.readFileSync(path.join(dir, f), 'utf8');
  for (const m of sql.matchAll(/\(\$q\$(.*?)\$q\$, \$q\$(.*?)\$q\$, \$q\$(.*?)\$q\$, \$q\$([\s\S]*?)\$q\$, (\d+)\)/g)) {
    subjects.push({ id: m[1], title: m[2], roman: m[3], description: m[4], sort_order: Number(m[5]) });
  }
  for (const m of sql.matchAll(/\(\$q\$(.*?)\$q\$, \$q\$(.*?)\$q\$, (\d+), \$q\$(.*?)\$q\$, \$j\$([\s\S]*?)\$j\$::jsonb\)/g)) {
    lessons.push({ id: m[1], subject_id: m[2], sort_order: Number(m[3]), title: m[4], steps: JSON.parse(m[5]) });
  }
}
subjects.sort((a, b) => a.sort_order - b.sort_order);
lessons.sort((a, b) => a.subject_id.localeCompare(b.subject_id) || a.sort_order - b.sort_order);
const out = path.join(__dirname, '..', 'src', 'generated', 'courseContent.json');
const arg = process.argv[2];
const json = JSON.stringify({ subjects, lessons }, null, 2) + '\n';
if (arg === '--check') {
  const cur = JSON.parse(fs.readFileSync(out, 'utf8'));
  const norm = (o) => JSON.stringify({ subjects: [...o.subjects].sort((a, b) => a.id.localeCompare(b.id)), lessons: [...o.lessons].sort((a, b) => a.id.localeCompare(b.id)) });
  console.log(norm(cur) === norm({ subjects, lessons }) ? 'IDENTICAL to bundled content' : 'DIFFERS from bundled content');
} else {
  fs.writeFileSync(out, json);
  console.log(`Wrote ${out}: ${subjects.length} subjects, ${lessons.length} lessons`);
}

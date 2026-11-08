import { supabase, isSupabaseConfigured } from './supabase';
import { CourseLesson, CourseSubject, CourseStep, CourseDialogueLesson } from '../courseTypes';

interface SubjectRow {
  id: string;
  title: string;
  roman: string;
  description: string;
  sort_order: number;
}

// `steps` is schemaless jsonb: a plain vocab lesson stores a bare
// CourseStep[] array there, while a dialogue lesson (see
// scripts/lib/courseBuilder.js's dialogue()) stores the whole
// {kind:'dialogue', scene, lines, steps} object as that column's value
// instead — no DB migration needed since jsonb doesn't care which shape it
// holds.
interface LessonRow {
  id: string;
  subject_id: string;
  sort_order: number;
  title: string;
  steps: CourseStep[] | Omit<CourseDialogueLesson, 'id' | 'title'>;
}

// Loads every course_subjects row plus its course_lessons, assembled into
// the shape the app renders (CourseSubject[]). Content is publicly
// readable (see supabase/schema.sql) so this works even signed-out — same
// local-first spirit as the rest of the app: an unconfigured/offline
// backend just means no DB-backed courses show up, not a crash.
// A copy of every subject and lesson ships inside the app (src/generated/courseContent.json, exported from the
// database after the 2026-11-07 word fixes), so a phone with no backend configured, or offline, still has the
// whole course. Re-export it after changing scripts/courseContent/ and reloading the seeds.
const bundled = require('../generated/courseContent.json') as { subjects: SubjectRow[]; lessons: LessonRow[] };

export async function fetchCourseSubjects(): Promise<CourseSubject[]> {
  if (!isSupabaseConfigured) return assemble(bundled.subjects, bundled.lessons);
  const [{ data: subjectRows, error: subjectError }, { data: lessonRows, error: lessonError }] = await Promise.all([
    supabase.from('course_subjects').select('*').order('sort_order', { ascending: true }),
    supabase.from('course_lessons').select('*').order('sort_order', { ascending: true }),
  ]);
  if (subjectError || lessonError || !subjectRows?.length) return assemble(bundled.subjects, bundled.lessons);
  return assemble(subjectRows as SubjectRow[], (lessonRows ?? []) as LessonRow[]);
}

function assemble(subjectRows: SubjectRow[], lessonRows: LessonRow[]): CourseSubject[] {
  const lessonsBySubject = new Map<string, CourseLesson[]>();
  for (const row of [...lessonRows].sort((a, b) => a.sort_order - b.sort_order)) {
    const list = lessonsBySubject.get(row.subject_id) ?? [];
    const lesson: CourseLesson = Array.isArray(row.steps)
      ? { id: row.id, title: row.title, steps: row.steps }
      : { ...row.steps, id: row.id, title: row.title };
    list.push(lesson);
    lessonsBySubject.set(row.subject_id, list);
  }

  return [...subjectRows].sort((a, b) => a.sort_order - b.sort_order).map((row) => ({
    id: row.id,
    title: row.title,
    roman: row.roman,
    description: row.description,
    lessons: lessonsBySubject.get(row.id) ?? [],
  }));
}

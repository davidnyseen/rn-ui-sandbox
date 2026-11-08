import { supabase } from './supabase';
import { AppState, PersistedState } from '../state';

interface ProfileRow {
  goal: number;
  current_unit_index: number;
  current_lesson_index: number;
  streak: number;
  xp: number;
  last_active_date: string | null;
  has_onboarded: boolean;
}

interface CourseProgressRow {
  subject_id: string;
  unlocked_lesson_index: number;
  stars: Record<string, number>;
}

function fromRow(row: ProfileRow): PersistedState {
  return {
    goal: row.goal,
    currentUnitIndex: row.current_unit_index,
    currentLessonIndex: row.current_lesson_index,
    streak: row.streak,
    xp: row.xp,
    lastActiveDate: row.last_active_date,
    hasOnboarded: row.has_onboarded,
    // Per-unit star ratings for the legacy static UNITS path, and
    // onboarding reason, aren't in the remote schema — local-only.
    // courseProgress *is* synced, but separately (see
    // fetchRemoteCourseProgress) — the caller merges it in rather than
    // taking whatever's here, since this row never carries it.
    unitStars: {},
    courseProgress: {},
    reason: null,
  };
}

export async function fetchRemoteProfile(userId: string): Promise<PersistedState | null> {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();
  if (error || !data) return null;
  return fromRow(data as ProfileRow);
}

export async function pushRemoteProfile(userId: string, state: PersistedState): Promise<void> {
  await supabase.from('profiles').upsert({
    id: userId,
    goal: state.goal,
    current_unit_index: state.currentUnitIndex,
    current_lesson_index: state.currentLessonIndex,
    streak: state.streak,
    xp: state.xp,
    last_active_date: state.lastActiveDate,
    has_onboarded: state.hasOnboarded,
    updated_at: new Date().toISOString(),
  });
}

// Per-lesson course completion (see supabase/schema.sql's course_progress
// table) syncs separately from the profile row above — one row per
// subject, keyed on (user_id, subject_id), so a lesson cleared on one
// device shows up on another instead of being stranded in that device's
// local storage.
export async function fetchRemoteCourseProgress(userId: string): Promise<AppState['courseProgress']> {
  const { data, error } = await supabase.from('course_progress').select('*').eq('user_id', userId);
  if (error || !data) return {};
  const out: AppState['courseProgress'] = {};
  for (const row of data as CourseProgressRow[]) {
    out[row.subject_id] = { unlockedLessonIndex: row.unlocked_lesson_index, stars: row.stars ?? {} };
  }
  return out;
}

export async function pushRemoteCourseProgress(
  userId: string,
  subjectId: string,
  progress: { unlockedLessonIndex: number; stars: Record<number, number> }
): Promise<void> {
  await supabase.from('course_progress').upsert({
    user_id: userId,
    subject_id: subjectId,
    unlocked_lesson_index: progress.unlockedLessonIndex,
    stars: progress.stars,
    updated_at: new Date().toISOString(),
  });
}

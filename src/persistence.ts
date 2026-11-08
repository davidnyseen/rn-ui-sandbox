import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState, PersistedState, toPersisted } from './state';

const STORAGE_KEY = 'thai-path-progress-v1';

export async function loadProgress(): Promise<PersistedState | null> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PersistedState;
  } catch {
    return null;
  }
}

export async function saveProgress(state: AppState): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toPersisted(state)));
  } catch {
    // best-effort — losing local progress persistence isn't fatal
  }
}

// Local calendar date as YYYY-MM-DD, so a streak advances on the learner's
// own day boundary rather than UTC's.
export function todayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function daysBetween(a: string, b: string): number {
  const da = new Date(`${a}T00:00:00`);
  const db = new Date(`${b}T00:00:00`);
  return Math.round((db.getTime() - da.getTime()) / 86400000);
}

export function nextStreak(lastActiveDate: string | null, currentStreak: number, today: string): number {
  if (lastActiveDate === today) return currentStreak;
  if (lastActiveDate && daysBetween(lastActiveDate, today) === 1) return currentStreak + 1;
  return 1;
}

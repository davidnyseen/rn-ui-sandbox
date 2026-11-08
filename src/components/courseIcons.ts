import { BookIcon, GraduationCapIcon, HelloIcon, NameTagIcon, NumbersIcon, PlaneIcon, UsersIcon, UtensilsIcon } from './icons';

// Icon per DB-backed course subject id — falls back to a generic book icon
// for subjects added later that aren't in this list yet. Shared between
// PathScreen (map nodes) and LessonSheet (launch sheet) so a subject only
// needs its icon defined once.
export const COURSE_ICONS: Record<string, typeof BookIcon> = {
  restaurant: UtensilsIcon,
  // the greetings content is two units (ids greetings-hello / greetings-names) — a bare 'greetings' key never matched,
  // so both showed the fallback book on every map stop (fixed 2026-11-08)
  'greetings-hello': HelloIcon,
  'greetings-names': NameTagIcon,
  basics: GraduationCapIcon,
  family: UsersIcon,
  numbers: NumbersIcon,
  travel: PlaneIcon,
};

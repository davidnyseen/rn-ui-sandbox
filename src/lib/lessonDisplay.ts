import { ComponentType } from 'react';
import { CourseSubject, isDialogueCourseLesson } from '../courseTypes';
import { BookIcon, ConversationIcon, IconProps, QuizIcon } from '../components/icons';
import { COURSE_ICONS } from '../components/courseIcons';

// "Quiz" is a path-only relabeling of a subject's last non-dialogue lesson
// (once there are enough lessons for a review to make sense) — not a
// distinct content type, so this is the one place that mapping happens.
// Shared by PathScreen (map nodes) and LessonSheet (launch sheet) so a
// lesson's displayed name/icon can never drift between the two.
export function lessonDisplayInfo(
  subject: CourseSubject,
  lessonIndex: number
): { title: string; Icon: ComponentType<IconProps> } {
  const lesson = subject.lessons[lessonIndex];
  const isDialogue = isDialogueCourseLesson(lesson);
  const nonDialogueCount = subject.lessons.filter((l) => !isDialogueCourseLesson(l)).length;
  let lastNonDialogueIndex = -1;
  subject.lessons.forEach((l, i) => {
    if (!isDialogueCourseLesson(l)) lastNonDialogueIndex = i;
  });
  const isQuiz = !isDialogue && lessonIndex === lastNonDialogueIndex && nonDialogueCount >= 3;
  const title = isDialogue ? 'Conversation' : isQuiz ? 'Quiz' : lesson.title;
  const Icon = isDialogue ? ConversationIcon : isQuiz ? QuizIcon : (COURSE_ICONS[subject.id] ?? BookIcon);
  return { title, Icon };
}

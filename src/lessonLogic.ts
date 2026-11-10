import { Platform } from 'react-native';
import { bankBuiltMatches, VocabLesson, listenScriptOptions } from './data';
import { AppState } from './state';

// TEMPORARY: see CourseLessonScreen.tsx's speakSkippedOnWeb — browser
// speech recognition is unreliable enough in this dev setup that speak
// steps can leave the learner stuck with no way to continue, so they're
// auto-passed on web instead of gated on actually recording.
const SKIP_SPEAK_ON_WEB = Platform.OS === 'web';

// Duolingo/Ling-style hearts: three mistakes in a single lesson attempt
// ends it early (screen: 'failed'); clearing a lesson with fewer mistakes
// earns more stars. Shared with DialogueLessonScreen's own step machine.
export const MAX_MISTAKES = 3;

export function starsForMistakes(mistakes: number): number {
  return Math.max(1, 3 - mistakes);
}

export function stepStatus(s: AppState, lesson: VocabLesson): { answered: boolean; correct: boolean } {
  const [word1, word2] = lesson.words;
  switch (s.stepIndex) {
    case 0:
      return { answered: s.mc1Answered, correct: s.mc1Answered && s.mc1Selected !== null && word1.options[s.mc1Selected].correct };
    case 1: {
      const options = listenScriptOptions(lesson, word1);
      return {
        answered: s.listenScript1Answered,
        correct: s.listenScript1Answered && s.listenScript1Selected !== null && options[s.listenScript1Selected].correct,
      };
    }
    case 2:
      return {
        answered: s.meaning1Answered,
        correct: s.meaning1Answered && s.meaning1Selected !== null && word1.options[s.meaning1Selected].correct,
      };
    case 3:
      return { answered: s.mc2Answered, correct: s.mc2Answered && s.mc2Selected !== null && word2.options[s.mc2Selected].correct };
    case 4: {
      const options = listenScriptOptions(lesson, word2);
      return {
        answered: s.listenScript2Answered,
        correct: s.listenScript2Answered && s.listenScript2Selected !== null && options[s.listenScript2Selected].correct,
      };
    }
    case 5:
      return {
        answered: s.meaning2Answered,
        correct: s.meaning2Answered && s.meaning2Selected !== null && word2.options[s.meaning2Selected].correct,
      };
    case 6:
      return { answered: s.matchedPairs.length === lesson.tiles.length / 2, correct: true };
    case 7:
    case 8:
      return SKIP_SPEAK_ON_WEB
        ? { answered: true, correct: true }
        : { answered: s.speakState === 'done', correct: s.speakCorrect };
    case 9:
      return { answered: s.bankChecked, correct: bankBuiltMatches(lesson.bank.words, s.bankBuilt, lesson.bank.correctOrder) };
    default:
      return { answered: false, correct: false };
  }
}

export function feedbackLabel(s: AppState, lesson: VocabLesson, correct: boolean): string {
  const [word1, word2] = lesson.words;
  switch (s.stepIndex) {
    case 0:
      return correct ? 'Correct!' : `Correct answer: ${word1.options.find((o) => o.correct)!.text}`;
    case 1:
      return correct ? 'Correct!' : `Correct answer: ${listenScriptOptions(lesson, word1).find((o) => o.correct)!.thai}`;
    case 2:
      return correct ? 'Correct!' : `Correct answer: ${word1.options.find((o) => o.correct)!.text}`;
    case 3:
      return correct ? 'Correct!' : `Correct answer: ${word2.options.find((o) => o.correct)!.text}`;
    case 4:
      return correct ? 'Correct!' : `Correct answer: ${listenScriptOptions(lesson, word2).find((o) => o.correct)!.thai}`;
    case 5:
      return correct ? 'Correct!' : `Correct answer: ${word2.options.find((o) => o.correct)!.text}`;
    case 6:
      return 'All matched!';
    case 7:
    case 8:
      if (SKIP_SPEAK_ON_WEB) return 'Skipped — voice practice isn\'t available in this browser';
      if (correct) return 'Nice pronunciation!';
      return s.speakHeardText ? `We heard "${s.speakHeardText}" — try again` : 'Try again';
    case 9: {
      if (correct) return 'Correct!';
      const order = lesson.bank.correctOrder.map((k) => lesson.bank.words[k].roman).join(' · ');
      return `Correct order: ${order}`;
    }
    default:
      return '';
  }
}

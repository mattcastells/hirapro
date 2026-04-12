import {
  DemonstrativesQuestion,
  getDemonstrativesQuestions,
} from '../../data/demonstratives';
import { AnswerState, GameStats } from './gameEngine';

export type DemonstrativesSessionState = {
  questions: DemonstrativesQuestion[];
  currentIndex: number;
  answerState: AnswerState;
  selectedOptionId: string | null;
  stats: GameStats;
};

export function createInitialDemonstrativesState(): DemonstrativesSessionState {
  return {
    questions: getDemonstrativesQuestions(),
    currentIndex: 0,
    answerState: 'idle',
    selectedOptionId: null,
    stats: { correct: 0, incorrect: 0, streak: 0, answered: 0 },
  };
}

export function submitDemonstrativesAnswer(
  state: DemonstrativesSessionState,
  optionId: string,
): DemonstrativesSessionState {
  if (state.answerState !== 'idle') return state;

  const question = state.questions[state.currentIndex];
  if (!question) return state;

  const isCorrect = optionId === question.correctOptionId;

  return {
    ...state,
    answerState: isCorrect ? 'correct' : 'incorrect',
    selectedOptionId: optionId,
    stats: {
      correct: state.stats.correct + (isCorrect ? 1 : 0),
      incorrect: state.stats.incorrect + (isCorrect ? 0 : 1),
      streak: isCorrect ? state.stats.streak + 1 : 0,
      answered: state.stats.answered + 1,
    },
  };
}

export function moveToNextDemonstrativesQuestion(
  state: DemonstrativesSessionState,
): DemonstrativesSessionState {
  const nextIndex = state.currentIndex + 1;

  // Reshuffle when all questions are answered
  if (nextIndex >= state.questions.length) {
    return {
      ...state,
      questions: getDemonstrativesQuestions(),
      currentIndex: 0,
      answerState: 'idle',
      selectedOptionId: null,
    };
  }

  return {
    ...state,
    currentIndex: nextIndex,
    answerState: 'idle',
    selectedOptionId: null,
  };
}

export function getCurrentQuestion(
  state: DemonstrativesSessionState,
): DemonstrativesQuestion | undefined {
  return state.questions[state.currentIndex];
}

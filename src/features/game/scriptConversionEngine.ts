import { HiraganaCharacter } from '../../types/hiragana';
import { AnswerState, GameStats } from './gameEngine';

export type ScriptConversionRound = {
  prompt: HiraganaCharacter;
  options: HiraganaCharacter[];
  correctOptionId: string;
};

export type ScriptConversionSessionState = {
  round: ScriptConversionRound;
  answerState: AnswerState;
  selectedOptionId: string | null;
  stats: GameStats;
};

function shuffle<T>(items: T[]) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function pickRandom<T>(items: T[]) {
  return items[Math.floor(Math.random() * items.length)];
}

export function createScriptConversionRound(
  sourcePool: HiraganaCharacter[],
  targetPool: HiraganaCharacter[],
  previousPromptId?: string,
): ScriptConversionRound {
  const promptPool =
    previousPromptId && sourcePool.length > 1
      ? sourcePool.filter((c) => c.id !== previousPromptId)
      : sourcePool;

  const prompt = pickRandom(promptPool);
  const correctTarget = targetPool.find((c) => c.romaji === prompt.romaji);

  if (!correctTarget) {
    const fallback = pickRandom(targetPool);
    const distractors = shuffle(
      targetPool.filter((c) => c.id !== fallback.id),
    ).slice(0, Math.min(3, targetPool.length - 1));
    return {
      prompt,
      options: shuffle([fallback, ...distractors]),
      correctOptionId: fallback.id,
    };
  }

  const optionCount = targetPool.length >= 4 ? 4 : Math.min(3, targetPool.length);
  const distractors = shuffle(
    targetPool.filter((c) => c.romaji !== prompt.romaji),
  ).slice(0, optionCount - 1);

  return {
    prompt,
    options: shuffle([correctTarget, ...distractors]),
    correctOptionId: correctTarget.id,
  };
}

export function createInitialScriptConversionState(
  sourcePool: HiraganaCharacter[],
  targetPool: HiraganaCharacter[],
): ScriptConversionSessionState {
  return {
    round: createScriptConversionRound(sourcePool, targetPool),
    answerState: 'idle',
    selectedOptionId: null,
    stats: { correct: 0, incorrect: 0, streak: 0, answered: 0 },
  };
}

export function submitScriptConversionAnswer(
  state: ScriptConversionSessionState,
  optionId: string,
): ScriptConversionSessionState {
  if (state.answerState !== 'idle') return state;

  const isCorrect = optionId === state.round.correctOptionId;

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

export function moveToNextScriptConversionRound(
  state: ScriptConversionSessionState,
  sourcePool: HiraganaCharacter[],
  targetPool: HiraganaCharacter[],
): ScriptConversionSessionState {
  return {
    ...state,
    round: createScriptConversionRound(
      sourcePool,
      targetPool,
      state.round.prompt.id,
    ),
    answerState: 'idle',
    selectedOptionId: null,
  };
}

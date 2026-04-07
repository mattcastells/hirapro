import { HiraganaCharacter } from '../../types/hiragana';
import { AnswerState, GameStats } from './gameEngine';
import { CharacterStroke, getStrokeGuide } from '../../data/hiraganaStrokes';

export type DrawingPoint = { x: number; y: number };

export type DrawingRound = {
  character: HiraganaCharacter;
  guideStrokes: CharacterStroke[];
  expectedStrokeCount: number;
  roundKey: string;
};

export type DrawingGameSessionState = {
  round: DrawingRound;
  userStrokes: DrawingPoint[][];
  currentStroke: DrawingPoint[];
  answerState: AnswerState;
  stats: GameStats;
};

function shuffle<T>(items: T[]) {
  const result = [...items];

  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }

  return result;
}

function pickRandom<T>(items: T[]) {
  return items[Math.floor(Math.random() * items.length)];
}

/**
 * Filter pool to characters that have stroke guide data.
 */
export function filterDrawableCharacters(
  pool: HiraganaCharacter[],
): HiraganaCharacter[] {
  return pool.filter(
    (character) => character.kana.length === 1 && getStrokeGuide(character.kana) !== null,
  );
}

export function createDrawingRound(
  pool: HiraganaCharacter[],
  previousRoundKey?: string,
): DrawingRound {
  const candidates =
    previousRoundKey && pool.length > 1
      ? pool.filter((c) => c.id !== previousRoundKey)
      : pool;

  const character = pickRandom(candidates.length > 0 ? candidates : pool);
  const guideStrokes = getStrokeGuide(character.kana) ?? [];

  return {
    character,
    guideStrokes,
    expectedStrokeCount: guideStrokes.length,
    roundKey: character.id,
  };
}

export function createInitialDrawingGameState(
  pool: HiraganaCharacter[],
): DrawingGameSessionState {
  return {
    round: createDrawingRound(pool),
    userStrokes: [],
    currentStroke: [],
    answerState: 'idle',
    stats: {
      correct: 0,
      incorrect: 0,
      streak: 0,
      answered: 0,
    },
  };
}

export function addStrokePoint(
  state: DrawingGameSessionState,
  point: DrawingPoint,
): DrawingGameSessionState {
  if (state.answerState !== 'idle') {
    return state;
  }

  return {
    ...state,
    currentStroke: [...state.currentStroke, point],
  };
}

export function beginStroke(
  state: DrawingGameSessionState,
  point: DrawingPoint,
): DrawingGameSessionState {
  if (state.answerState !== 'idle') {
    return state;
  }

  return {
    ...state,
    currentStroke: [point],
  };
}

export function finishStroke(
  state: DrawingGameSessionState,
): DrawingGameSessionState {
  if (state.answerState !== 'idle' || state.currentStroke.length < 2) {
    return {
      ...state,
      currentStroke: [],
    };
  }

  return {
    ...state,
    userStrokes: [...state.userStrokes, state.currentStroke],
    currentStroke: [],
  };
}

export function clearDrawing(
  state: DrawingGameSessionState,
): DrawingGameSessionState {
  if (state.answerState !== 'idle') {
    return state;
  }

  return {
    ...state,
    userStrokes: [],
    currentStroke: [],
  };
}

export function submitDrawing(
  state: DrawingGameSessionState,
): DrawingGameSessionState {
  if (state.answerState !== 'idle') {
    return state;
  }

  if (state.userStrokes.length === 0) {
    return state;
  }

  const isCorrect = state.userStrokes.length === state.round.expectedStrokeCount;

  return {
    ...state,
    currentStroke: [],
    answerState: isCorrect ? 'correct' : 'incorrect',
    stats: {
      correct: state.stats.correct + (isCorrect ? 1 : 0),
      incorrect: state.stats.incorrect + (isCorrect ? 0 : 1),
      streak: isCorrect ? state.stats.streak + 1 : 0,
      answered: state.stats.answered + 1,
    },
  };
}

export function moveToNextDrawingRound(
  state: DrawingGameSessionState,
  pool: HiraganaCharacter[],
): DrawingGameSessionState {
  return {
    ...state,
    round: createDrawingRound(pool, state.round.roundKey),
    userStrokes: [],
    currentStroke: [],
    answerState: 'idle',
  };
}

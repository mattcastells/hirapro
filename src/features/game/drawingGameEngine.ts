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

/**
 * Evaluate whether a single user stroke (in normalized 0-100 space) matches
 * the corresponding guide stroke closely enough to be considered correct.
 *
 * Checks:
 *  1. Start position is within ~25% of canvas from the guide start.
 *  2. Direction (angle from first to last point) is within 50° of the guide direction.
 *     Very short guide strokes (dots/marks) only require the position check.
 */
function evaluateStroke(
  userStroke: DrawingPoint[],
  guideStroke: CharacterStroke,
): boolean {
  if (userStroke.length < 2 || guideStroke.length < 2) return false;

  const uStart = userStroke[0];
  const uEnd = userStroke[userStroke.length - 1];
  const [gStartX, gStartY] = guideStroke[0];
  const [gEndX, gEndY] = guideStroke[guideStroke.length - 1];

  // 1. Start position must be within 25 units (25% of canvas width) of guide start
  const startDist = Math.sqrt((uStart.x - gStartX) ** 2 + (uStart.y - gStartY) ** 2);
  if (startDist > 25) return false;

  // For very short guide strokes (dots, tiny marks) only check position
  const guideLen = Math.sqrt((gEndX - gStartX) ** 2 + (gEndY - gStartY) ** 2);
  if (guideLen < 12) return true;

  // 2. Direction must be within 50° of the guide direction
  const uAngle = Math.atan2(uEnd.y - uStart.y, uEnd.x - uStart.x);
  const gAngle = Math.atan2(gEndY - gStartY, gEndX - gStartX);
  let angleDiff = Math.abs((uAngle - gAngle) * (180 / Math.PI));
  if (angleDiff > 180) angleDiff = 360 - angleDiff;
  if (angleDiff > 50) return false;

  return true;
}

export type DrawingSubmitResult = {
  isCorrect: boolean;
  strokeCountCorrect: boolean;
  matchedStrokes: number;
};

export function evaluateDrawing(
  userStrokes: DrawingPoint[][],
  guideStrokes: CharacterStroke[],
): DrawingSubmitResult {
  const strokeCountCorrect = userStrokes.length === guideStrokes.length;

  if (!strokeCountCorrect) {
    return { isCorrect: false, strokeCountCorrect: false, matchedStrokes: 0 };
  }

  const matched = userStrokes.filter((stroke, i) =>
    evaluateStroke(stroke, guideStrokes[i]),
  ).length;

  return {
    isCorrect: matched === guideStrokes.length,
    strokeCountCorrect: true,
    matchedStrokes: matched,
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

  const { isCorrect } = evaluateDrawing(
    state.userStrokes,
    state.round.guideStrokes,
  );

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

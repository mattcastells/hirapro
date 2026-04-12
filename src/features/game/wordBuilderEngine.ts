import { WordPracticeEntry } from '../../data/wordVocabulary';
import { AnswerState, GameStats } from './gameEngine';

export type WordBuilderTile = {
  id: string;
  kana: string;
};

export type WordBuilderRound = {
  word: WordPracticeEntry;
  promptText: string;
  tiles: WordBuilderTile[];
  answer: string;
  syllableCount: number;
  roundKey: string;
};

export type WordBuilderSessionState = {
  round: WordBuilderRound;
  placedTileIds: string[];
  answerState: AnswerState;
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

function collectDistractorSyllables(
  pool: WordPracticeEntry[],
  exclude: Set<string>,
  count: number,
): string[] {
  const all: string[] = [];
  pool.forEach((entry) => {
    entry.syllables.forEach((s) => {
      if (!exclude.has(s)) all.push(s);
    });
  });
  return shuffle(all).slice(0, count);
}

export function createWordBuilderRound(
  pool: WordPracticeEntry[],
  previousRoundKey?: string,
): WordBuilderRound {
  const promptPool =
    previousRoundKey && pool.length > 1
      ? pool.filter((e) => e.id !== previousRoundKey)
      : pool;

  const word = pickRandom(promptPool);
  const primaryTranslation = word.translations[0] ?? '';

  const correctTiles: WordBuilderTile[] = word.syllables.map((kana, i) => ({
    id: `correct-${i}-${kana}`,
    kana,
  }));

  const distractorKana = collectDistractorSyllables(
    pool,
    new Set(word.syllables),
    2,
  );
  const distractorTiles: WordBuilderTile[] = distractorKana.map((kana, i) => ({
    id: `distractor-${i}-${kana}`,
    kana,
  }));

  return {
    word,
    promptText: primaryTranslation,
    tiles: shuffle([...correctTiles, ...distractorTiles]),
    answer: word.kana,
    syllableCount: word.syllables.length,
    roundKey: word.id,
  };
}

export function createInitialWordBuilderState(
  pool: WordPracticeEntry[],
): WordBuilderSessionState {
  return {
    round: createWordBuilderRound(pool),
    placedTileIds: [],
    answerState: 'idle',
    stats: { correct: 0, incorrect: 0, streak: 0, answered: 0 },
  };
}

export function placeTile(
  state: WordBuilderSessionState,
  tileId: string,
): WordBuilderSessionState {
  if (state.answerState !== 'idle') return state;
  if (state.placedTileIds.includes(tileId)) return state;
  return { ...state, placedTileIds: [...state.placedTileIds, tileId] };
}

export function removeTile(
  state: WordBuilderSessionState,
  tileId: string,
): WordBuilderSessionState {
  if (state.answerState !== 'idle') return state;
  return {
    ...state,
    placedTileIds: state.placedTileIds.filter((id) => id !== tileId),
  };
}

export function clearPlacedTiles(
  state: WordBuilderSessionState,
): WordBuilderSessionState {
  if (state.answerState !== 'idle') return state;
  return { ...state, placedTileIds: [] };
}

export function submitWordBuilder(
  state: WordBuilderSessionState,
): WordBuilderSessionState {
  if (state.answerState !== 'idle') return state;
  if (state.placedTileIds.length !== state.round.syllableCount) return state;

  const placedKana = state.placedTileIds
    .map((id) => state.round.tiles.find((t) => t.id === id)?.kana ?? '')
    .join('');

  const isCorrect = placedKana === state.round.answer;

  return {
    ...state,
    answerState: isCorrect ? 'correct' : 'incorrect',
    stats: {
      correct: state.stats.correct + (isCorrect ? 1 : 0),
      incorrect: state.stats.incorrect + (isCorrect ? 0 : 1),
      streak: isCorrect ? state.stats.streak + 1 : 0,
      answered: state.stats.answered + 1,
    },
  };
}

export function moveToNextWordBuilderRound(
  state: WordBuilderSessionState,
  pool: WordPracticeEntry[],
): WordBuilderSessionState {
  return {
    ...state,
    round: createWordBuilderRound(pool, state.round.roundKey),
    placedTileIds: [],
    answerState: 'idle',
  };
}

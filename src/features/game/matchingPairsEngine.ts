import { HiraganaCharacter } from '../../types/hiragana';
import { GameStats } from './gameEngine';

export type MatchCard = {
  id: string;
  pairId: string;
  text: string;
  kind: 'kana' | 'romaji';
};

export type MatchingPairsSessionState = {
  cards: MatchCard[];
  flippedIds: string[];
  matchedPairIds: string[];
  isLocked: boolean;
  stats: GameStats;
  roundKey: string;
};

const PAIRS_PER_ROUND = 4;

function shuffle<T>(items: T[]) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function createMatchingPairsRound(
  pool: HiraganaCharacter[],
  roundIndex = 0,
): { cards: MatchCard[]; roundKey: string } {
  const count = Math.min(PAIRS_PER_ROUND, pool.length);
  const selected = shuffle([...pool]).slice(0, count);

  const cards: MatchCard[] = [];
  selected.forEach((char) => {
    cards.push({
      id: `kana-${char.id}`,
      pairId: char.id,
      text: char.kana,
      kind: 'kana',
    });
    cards.push({
      id: `romaji-${char.id}`,
      pairId: char.id,
      text: char.romaji,
      kind: 'romaji',
    });
  });

  return {
    cards: shuffle(cards),
    roundKey: `round-${roundIndex}-${selected.map((c) => c.id).join('')}`,
  };
}

export function createInitialMatchingPairsState(
  pool: HiraganaCharacter[],
): MatchingPairsSessionState {
  const { cards, roundKey } = createMatchingPairsRound(pool, 0);
  return {
    cards,
    flippedIds: [],
    matchedPairIds: [],
    isLocked: false,
    stats: { correct: 0, incorrect: 0, streak: 0, answered: 0 },
    roundKey,
  };
}

export function flipCard(
  state: MatchingPairsSessionState,
  cardId: string,
): MatchingPairsSessionState {
  if (state.isLocked) return state;
  if (state.flippedIds.includes(cardId)) return state;
  if (state.matchedPairIds.some((pid) => {
    const card = state.cards.find((c) => c.id === cardId);
    return card?.pairId === pid;
  })) return state;
  if (state.flippedIds.length >= 2) return state;

  return { ...state, flippedIds: [...state.flippedIds, cardId] };
}

export type FlipResult = 'need-more' | 'matched' | 'mismatch';

export function evaluateFlip(state: MatchingPairsSessionState): {
  result: FlipResult;
  matchedPairId?: string;
} {
  if (state.flippedIds.length < 2) return { result: 'need-more' };

  const [idA, idB] = state.flippedIds;
  const cardA = state.cards.find((c) => c.id === idA);
  const cardB = state.cards.find((c) => c.id === idB);

  if (!cardA || !cardB) return { result: 'need-more' };

  if (cardA.pairId === cardB.pairId && cardA.kind !== cardB.kind) {
    return { result: 'matched', matchedPairId: cardA.pairId };
  }

  return { result: 'mismatch' };
}

export function applyMatch(
  state: MatchingPairsSessionState,
  pairId: string,
): MatchingPairsSessionState {
  return {
    ...state,
    flippedIds: [],
    matchedPairIds: [...state.matchedPairIds, pairId],
    isLocked: false,
    stats: {
      ...state.stats,
      correct: state.stats.correct + 1,
      streak: state.stats.streak + 1,
      answered: state.stats.answered + 1,
    },
  };
}

export function applyMismatch(
  state: MatchingPairsSessionState,
): MatchingPairsSessionState {
  return {
    ...state,
    isLocked: true,
    stats: {
      ...state.stats,
      incorrect: state.stats.incorrect + 1,
      streak: 0,
      answered: state.stats.answered + 1,
    },
  };
}

export function clearFlipped(
  state: MatchingPairsSessionState,
): MatchingPairsSessionState {
  return { ...state, flippedIds: [], isLocked: false };
}

export function startNewMatchingPairsRound(
  state: MatchingPairsSessionState,
  pool: HiraganaCharacter[],
  roundIndex: number,
): MatchingPairsSessionState {
  const { cards, roundKey } = createMatchingPairsRound(pool, roundIndex);
  return {
    ...state,
    cards,
    flippedIds: [],
    matchedPairIds: [],
    isLocked: false,
    roundKey,
  };
}

export function isRoundComplete(state: MatchingPairsSessionState): boolean {
  const pairCount = state.cards.length / 2;
  return state.matchedPairIds.length >= pairCount;
}

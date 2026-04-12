import { useEffect, useRef, useState } from 'react';
import * as Haptics from 'expo-haptics';

import { useAppSettings } from '../../settings/AppSettingsProvider';
import { HiraganaCharacter } from '../../types/hiragana';
import {
  applyMatch,
  applyMismatch,
  clearFlipped,
  createInitialMatchingPairsState,
  evaluateFlip,
  flipCard,
  isRoundComplete,
  MatchingPairsSessionState,
  startNewMatchingPairsRound,
} from './matchingPairsEngine';

export function useMatchingPairsGame(
  pool: HiraganaCharacter[],
  resetKey: string,
) {
  const {
    settings: { hapticsEnabled },
  } = useAppSettings();

  const [state, setState] = useState<MatchingPairsSessionState>(() =>
    createInitialMatchingPairsState(pool),
  );

  const roundIndexRef = useRef(0);
  const mismatchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const nextRoundTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (mismatchTimeoutRef.current) clearTimeout(mismatchTimeoutRef.current);
    if (nextRoundTimeoutRef.current) clearTimeout(nextRoundTimeoutRef.current);
    mismatchTimeoutRef.current = null;
    nextRoundTimeoutRef.current = null;
    roundIndexRef.current = 0;
    setState(createInitialMatchingPairsState(pool));
  }, [pool, resetKey]);

  useEffect(
    () => () => {
      if (mismatchTimeoutRef.current) clearTimeout(mismatchTimeoutRef.current);
      if (nextRoundTimeoutRef.current) clearTimeout(nextRoundTimeoutRef.current);
    },
    [],
  );

  const tapCard = (cardId: string) => {
    setState((current) => {
      if (current.isLocked) return current;

      // Already flipped 2 (but not locked) - do nothing
      if (current.flippedIds.length >= 2) return current;

      const next = flipCard(current, cardId);

      if (next.flippedIds.length < 2) return next;

      // Evaluate the pair
      const { result, matchedPairId } = evaluateFlip(next);

      if (result === 'matched' && matchedPairId) {
        if (hapticsEnabled) {
          void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }

        const matched = applyMatch(next, matchedPairId);

        if (isRoundComplete(matched)) {
          // Start next round after short delay
          if (nextRoundTimeoutRef.current) clearTimeout(nextRoundTimeoutRef.current);
          nextRoundTimeoutRef.current = setTimeout(() => {
            roundIndexRef.current += 1;
            setState((s) => startNewMatchingPairsRound(s, pool, roundIndexRef.current));
            nextRoundTimeoutRef.current = null;
          }, 800);
        }

        return matched;
      }

      // Mismatch
      if (hapticsEnabled) {
        void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }

      const mismatched = applyMismatch(next);

      if (mismatchTimeoutRef.current) clearTimeout(mismatchTimeoutRef.current);
      mismatchTimeoutRef.current = setTimeout(() => {
        setState((s) => clearFlipped(s));
        mismatchTimeoutRef.current = null;
      }, 900);

      return mismatched;
    });
  };

  return { state, tapCard };
}

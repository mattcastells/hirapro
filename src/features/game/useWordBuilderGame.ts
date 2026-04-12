import { useEffect, useRef, useState } from 'react';
import * as Haptics from 'expo-haptics';

import { WordPracticeEntry } from '../../data/wordVocabulary';
import { useAppSettings } from '../../settings/AppSettingsProvider';
import {
  clearPlacedTiles,
  createInitialWordBuilderState,
  moveToNextWordBuilderRound,
  placeTile,
  removeTile,
  submitWordBuilder,
  WordBuilderSessionState,
} from './wordBuilderEngine';

export function useWordBuilderGame(pool: WordPracticeEntry[], resetKey: string) {
  const {
    settings: { hapticsEnabled },
  } = useAppSettings();

  const [state, setState] = useState<WordBuilderSessionState>(() =>
    createInitialWordBuilderState(pool),
  );
  const [lastFeedback, setLastFeedback] = useState<{
    status: WordBuilderSessionState['answerState'];
    correctText: string;
  }>({ status: 'idle', correctText: '' });

  const nextRoundTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const retryTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (nextRoundTimeoutRef.current) clearTimeout(nextRoundTimeoutRef.current);
    if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current);
    nextRoundTimeoutRef.current = null;
    retryTimeoutRef.current = null;
    setState(createInitialWordBuilderState(pool));
    setLastFeedback({ status: 'idle', correctText: '' });
  }, [pool, resetKey]);

  useEffect(
    () => () => {
      if (nextRoundTimeoutRef.current) clearTimeout(nextRoundTimeoutRef.current);
      if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current);
    },
    [],
  );

  const tapTile = (tileId: string) => {
    setState((current) => {
      if (current.answerState !== 'idle') return current;

      const alreadyPlaced = current.placedTileIds.includes(tileId);
      if (alreadyPlaced) {
        return removeTile(current, tileId);
      }

      const next = placeTile(current, tileId);

      // Auto-submit when all positions filled
      if (next.placedTileIds.length === next.round.syllableCount) {
        const submitted = submitWordBuilder(next);
        const correctAnswer = submitted.round.answer;

        setLastFeedback({
          status: submitted.answerState,
          correctText: correctAnswer,
        });

        if (hapticsEnabled) {
          if (submitted.answerState === 'correct') {
            void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          } else {
            void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          }
        }

        if (submitted.answerState === 'correct') {
          if (nextRoundTimeoutRef.current) clearTimeout(nextRoundTimeoutRef.current);
          nextRoundTimeoutRef.current = setTimeout(() => {
            setState((s) => moveToNextWordBuilderRound(s, pool));
            setLastFeedback({ status: 'idle', correctText: '' });
            nextRoundTimeoutRef.current = null;
          }, 700);
        } else {
          // Show error then clear tiles for retry
          if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current);
          retryTimeoutRef.current = setTimeout(() => {
            setState((s) => ({
              ...clearPlacedTiles({ ...s, answerState: 'idle' }),
            }));
            setLastFeedback({ status: 'idle', correctText: '' });
            retryTimeoutRef.current = null;
          }, 1100);
        }

        return submitted;
      }

      return next;
    });
  };

  const clear = () => {
    setState((current) => clearPlacedTiles(current));
  };

  return { state, tapTile, clear, lastFeedback };
}

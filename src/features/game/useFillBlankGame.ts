import { useEffect, useRef, useState } from 'react';
import * as Haptics from 'expo-haptics';

import { WordPracticeEntry } from '../../data/wordVocabulary';
import { useAppSettings } from '../../settings/AppSettingsProvider';
import {
  createInitialFillBlankState,
  FillBlankSessionState,
  moveToNextFillBlankRound,
  submitFillBlankAnswer,
} from './fillBlankEngine';

export function useFillBlankGame(pool: WordPracticeEntry[], resetKey: string) {
  const {
    settings: { hapticsEnabled },
  } = useAppSettings();

  const [state, setState] = useState<FillBlankSessionState>(() =>
    createInitialFillBlankState(pool),
  );
  const [lastFeedback, setLastFeedback] = useState<{
    status: FillBlankSessionState['answerState'];
    promptText?: string;
    correctText: string;
    selectedText?: string | null;
  }>({ status: 'idle', promptText: '', correctText: '', selectedText: null });

  const nextRoundTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (nextRoundTimeoutRef.current) {
      clearTimeout(nextRoundTimeoutRef.current);
      nextRoundTimeoutRef.current = null;
    }
    setState(createInitialFillBlankState(pool));
    setLastFeedback({ status: 'idle', promptText: '', correctText: '', selectedText: null });
  }, [pool, resetKey]);

  useEffect(
    () => () => {
      if (nextRoundTimeoutRef.current) clearTimeout(nextRoundTimeoutRef.current);
    },
    [],
  );

  const answer = (optionId: string) => {
    let nextAnswerState: FillBlankSessionState['answerState'] = 'idle';
    let promptText = '';
    let correctText = '';
    let selectedText: string | null = null;

    setState((current) => {
      const updated = submitFillBlankAnswer(current, optionId);
      const selectedOption = current.round.options.find((o) => o.id === optionId);
      const correctOption = current.round.options.find(
        (o) => o.id === current.round.correctOptionId,
      );

      nextAnswerState = updated.answerState;
      promptText = current.round.word.kana;
      correctText = correctOption?.text ?? '';
      selectedText = selectedOption?.text ?? null;
      return updated;
    });

    if (nextAnswerState === 'idle') return;

    setLastFeedback({ status: nextAnswerState, promptText, correctText, selectedText });

    if (hapticsEnabled) {
      if (nextAnswerState === 'correct') {
        void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else {
        void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    }

    if (nextRoundTimeoutRef.current) clearTimeout(nextRoundTimeoutRef.current);
    nextRoundTimeoutRef.current = setTimeout(() => {
      setState((current) => moveToNextFillBlankRound(current, pool));
      nextRoundTimeoutRef.current = null;
    }, nextAnswerState === 'correct' ? 200 : 300);
  };

  return { state, answer, lastFeedback };
}

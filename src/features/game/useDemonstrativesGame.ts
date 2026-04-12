import { useEffect, useRef, useState } from 'react';
import * as Haptics from 'expo-haptics';

import { useAppSettings } from '../../settings/AppSettingsProvider';
import {
  createInitialDemonstrativesState,
  DemonstrativesSessionState,
  getCurrentQuestion,
  moveToNextDemonstrativesQuestion,
  submitDemonstrativesAnswer,
} from './demonstrativesEngine';

export function useDemonstrativesGame(resetKey: string) {
  const {
    settings: { hapticsEnabled },
  } = useAppSettings();

  const [state, setState] = useState<DemonstrativesSessionState>(() =>
    createInitialDemonstrativesState(),
  );
  const [lastFeedback, setLastFeedback] = useState<{
    status: DemonstrativesSessionState['answerState'];
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
    setState(createInitialDemonstrativesState());
    setLastFeedback({ status: 'idle', promptText: '', correctText: '', selectedText: null });
  }, [resetKey]);

  useEffect(
    () => () => {
      if (nextRoundTimeoutRef.current) clearTimeout(nextRoundTimeoutRef.current);
    },
    [],
  );

  const answer = (optionId: string) => {
    let nextAnswerState: DemonstrativesSessionState['answerState'] = 'idle';
    let correctText = '';
    let selectedText: string | null = null;

    setState((current) => {
      const question = getCurrentQuestion(current);
      if (!question) return current;

      const updated = submitDemonstrativesAnswer(current, optionId);
      const selectedOption = question.options.find((o) => o.id === optionId);
      const correctOption = question.options.find(
        (o) => o.id === question.correctOptionId,
      );

      nextAnswerState = updated.answerState;
      correctText = correctOption?.text ?? '';
      selectedText = selectedOption?.text ?? null;
      return updated;
    });

    if (nextAnswerState === 'idle') return;

    setLastFeedback({ status: nextAnswerState, correctText, selectedText });

    if (hapticsEnabled) {
      if (nextAnswerState === 'correct') {
        void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else {
        void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    }

    if (nextRoundTimeoutRef.current) clearTimeout(nextRoundTimeoutRef.current);
    nextRoundTimeoutRef.current = setTimeout(() => {
      setState((current) => moveToNextDemonstrativesQuestion(current));
      setLastFeedback({ status: 'idle', correctText: '', selectedText: null });
      nextRoundTimeoutRef.current = null;
    }, nextAnswerState === 'correct' ? 180 : 300);
  };

  return { state, answer, lastFeedback, currentQuestion: getCurrentQuestion(state) };
}

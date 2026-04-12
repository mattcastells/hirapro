import { useEffect, useRef, useState } from 'react';
import * as Haptics from 'expo-haptics';

import { useAppSettings } from '../../settings/AppSettingsProvider';
import { KanjiEntry, KanjiPracticeMode } from '../../types/kanji';
import {
  createInitialKanjiState,
  KanjiGameSessionState,
  moveToNextKanjiRound,
  submitKanjiAnswer,
} from './kanjiGameEngine';

export function useKanjiGame(
  pool: KanjiEntry[],
  mode: KanjiPracticeMode,
  resetKey: string,
) {
  const {
    settings: { hapticsEnabled },
  } = useAppSettings();

  const [state, setState] = useState<KanjiGameSessionState>(() =>
    createInitialKanjiState(pool, mode),
  );
  const [lastFeedback, setLastFeedback] = useState<{
    status: KanjiGameSessionState['answerState'];
    promptText: string;
    correctText: string;
    selectedText: string | null;
  }>({ status: 'idle', promptText: '', correctText: '', selectedText: null });

  const nextRoundRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (nextRoundRef.current) {
      clearTimeout(nextRoundRef.current);
      nextRoundRef.current = null;
    }
    setState(createInitialKanjiState(pool, mode));
    setLastFeedback({ status: 'idle', promptText: '', correctText: '', selectedText: null });
  }, [pool, mode, resetKey]);

  useEffect(
    () => () => {
      if (nextRoundRef.current) clearTimeout(nextRoundRef.current);
    },
    [],
  );

  const answer = (optionId: string) => {
    let nextAnswerState: KanjiGameSessionState['answerState'] = 'idle';
    let promptText = '';
    let correctText = '';
    let selectedText: string | null = null;

    setState((current) => {
      const updated = submitKanjiAnswer(current, optionId);
      const selectedOption = current.round.options.find((o) => o.id === optionId);
      const correctOption = current.round.options.find(
        (o) => o.id === current.round.correctOptionId,
      );

      nextAnswerState = updated.answerState;
      promptText = current.round.promptText;
      correctText = correctOption?.text ?? '';
      selectedText = selectedOption?.text ?? null;

      return updated;
    });

    if (nextAnswerState === 'idle') return;

    setLastFeedback({ status: nextAnswerState, promptText, correctText, selectedText });

    if (hapticsEnabled) {
      if (nextAnswerState === 'correct') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    }

    const delay = nextAnswerState === 'correct' ? 180 : 260;
    nextRoundRef.current = setTimeout(() => {
      setState((current) => moveToNextKanjiRound(current, pool, mode));
      setLastFeedback({ status: 'idle', promptText: '', correctText: '', selectedText: null });
    }, delay);
  };

  return { state, answer, lastFeedback };
}

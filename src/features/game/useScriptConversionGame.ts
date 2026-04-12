import { useEffect, useRef, useState } from 'react';
import * as Haptics from 'expo-haptics';

import { useAppSettings } from '../../settings/AppSettingsProvider';
import { HiraganaCharacter } from '../../types/hiragana';
import {
  createInitialScriptConversionState,
  moveToNextScriptConversionRound,
  ScriptConversionSessionState,
  submitScriptConversionAnswer,
} from './scriptConversionEngine';

export function useScriptConversionGame(
  sourcePool: HiraganaCharacter[],
  targetPool: HiraganaCharacter[],
  resetKey: string,
) {
  const {
    settings: { hapticsEnabled },
  } = useAppSettings();

  const [state, setState] = useState<ScriptConversionSessionState>(() =>
    createInitialScriptConversionState(sourcePool, targetPool),
  );
  const [lastFeedback, setLastFeedback] = useState<{
    status: ScriptConversionSessionState['answerState'];
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
    setState(createInitialScriptConversionState(sourcePool, targetPool));
    setLastFeedback({ status: 'idle', promptText: '', correctText: '', selectedText: null });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetKey]);

  useEffect(
    () => () => {
      if (nextRoundTimeoutRef.current) clearTimeout(nextRoundTimeoutRef.current);
    },
    [],
  );

  const answer = (optionId: string) => {
    let nextAnswerState: ScriptConversionSessionState['answerState'] = 'idle';
    let promptText = '';
    let correctText = '';
    let selectedText: string | null = null;

    setState((current) => {
      const updated = submitScriptConversionAnswer(current, optionId);
      const selectedOption = current.round.options.find((o) => o.id === optionId);
      const correctOption = current.round.options.find(
        (o) => o.id === current.round.correctOptionId,
      );

      nextAnswerState = updated.answerState;
      promptText = current.round.prompt.kana;
      correctText = correctOption?.kana ?? '';
      selectedText = selectedOption?.kana ?? null;
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
      setState((current) =>
        moveToNextScriptConversionRound(current, sourcePool, targetPool),
      );
      nextRoundTimeoutRef.current = null;
    }, nextAnswerState === 'correct' ? 180 : 260);
  };

  return { state, answer, lastFeedback };
}

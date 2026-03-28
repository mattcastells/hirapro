import { useEffect, useRef, useState } from 'react';
import * as Haptics from 'expo-haptics';

import { useAppSettings } from '../../settings/AppSettingsProvider';
import { HiraganaCharacter } from '../../types/hiragana';
import {
  createInitialGameState,
  GameSessionState,
  moveToNextRound,
  submitAnswer,
} from './gameEngine';

export function useHiraganaGame(
  pool: HiraganaCharacter[],
  resetKey: string,
  inverted = false,
) {
  const {
    settings: { hapticsEnabled },
  } = useAppSettings();
  const [state, setState] = useState<GameSessionState>(() =>
    createInitialGameState(pool),
  );
  const [lastFeedback, setLastFeedback] = useState<{
    status: GameSessionState['answerState'];
    promptText?: string;
    correctText: string;
    selectedText?: string | null;
  }>({
    status: 'idle',
    promptText: '',
    correctText: '',
    selectedText: null,
  });
  const nextRoundTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (nextRoundTimeoutRef.current) {
      clearTimeout(nextRoundTimeoutRef.current);
      nextRoundTimeoutRef.current = null;
    }

    setState(createInitialGameState(pool));
    setLastFeedback({
      status: 'idle',
      promptText: '',
      correctText: '',
      selectedText: null,
    });
  }, [pool, resetKey]);

  useEffect(
    () => () => {
      if (nextRoundTimeoutRef.current) {
        clearTimeout(nextRoundTimeoutRef.current);
      }
    },
    [],
  );

  const answer = (optionId: string) => {
    let nextAnswerState: GameSessionState['answerState'] = 'idle';
    let promptText = '';
    let correctText = '';
    let selectedText: string | null = null;

    setState((currentState) => {
      const updatedState = submitAnswer(currentState, optionId);
      const selectedOption = currentState.round.options.find(
        (option) => option.id === optionId,
      );

      nextAnswerState = updatedState.answerState;
      promptText = inverted
        ? currentState.round.prompt.romaji
        : currentState.round.prompt.kana;
      correctText = inverted
        ? currentState.round.prompt.kana
        : currentState.round.prompt.romaji;
      selectedText = selectedOption
        ? inverted
          ? selectedOption.kana
          : selectedOption.romaji
        : null;
      return updatedState;
    });

    if (nextAnswerState === 'idle') {
      return;
    }

    setLastFeedback({
      status: nextAnswerState,
      promptText,
      correctText,
      selectedText,
    });

    if (hapticsEnabled) {
      if (nextAnswerState === 'correct') {
        void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else {
        void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    }

    if (nextRoundTimeoutRef.current) {
      clearTimeout(nextRoundTimeoutRef.current);
    }

    nextRoundTimeoutRef.current = setTimeout(() => {
      setState((currentState) => moveToNextRound(currentState, pool));
      nextRoundTimeoutRef.current = null;
    }, nextAnswerState === 'correct' ? 180 : 260);
  };

  const next = () => {
    if (nextRoundTimeoutRef.current) {
      clearTimeout(nextRoundTimeoutRef.current);
      nextRoundTimeoutRef.current = null;
    }

    setState((currentState) => moveToNextRound(currentState, pool));
  };

  return {
    state,
    answer,
    next,
    lastFeedback,
  };
}

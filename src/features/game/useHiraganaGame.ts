import { useEffect, useRef, useState } from 'react';
import * as Haptics from 'expo-haptics';

import { HiraganaCharacter } from '../../types/hiragana';
import {
  createInitialGameState,
  GameSessionState,
  moveToNextRound,
  submitAnswer,
} from './gameEngine';

export function useHiraganaGame(pool: HiraganaCharacter[], resetKey: string) {
  const [state, setState] = useState<GameSessionState>(() =>
    createInitialGameState(pool),
  );
  const [lastFeedback, setLastFeedback] = useState<{
    status: GameSessionState['answerState'];
    correctRomaji: string;
    selectedRomaji?: string | null;
  }>({
    status: 'idle',
    correctRomaji: '',
    selectedRomaji: null,
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
      correctRomaji: '',
      selectedRomaji: null,
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
    let correctRomaji = '';
    let selectedRomaji: string | null = null;

    setState((currentState) => {
      const updatedState = submitAnswer(currentState, optionId);
      nextAnswerState = updatedState.answerState;
      correctRomaji = currentState.round.prompt.romaji;
      selectedRomaji =
        currentState.round.options.find((option) => option.id === optionId)?.romaji ?? null;
      return updatedState;
    });

    if (nextAnswerState === 'idle') {
      return;
    }

    setLastFeedback({
      status: nextAnswerState,
      correctRomaji,
      selectedRomaji,
    });

    if (nextAnswerState === 'correct') {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
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

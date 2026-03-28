import { useEffect, useRef, useState } from 'react';
import * as Haptics from 'expo-haptics';

import { HiraganaCharacter } from '../../types/hiragana';
import { GameSessionState } from './gameEngine';
import {
  createInitialWritingGameState,
  moveToNextWritingRound,
  sanitizeWritingInput,
  submitWritingAnswer,
  updateWritingInput,
  WritingGameSessionState,
} from './writingGameEngine';

export function useWritingHiraganaGame(pool: HiraganaCharacter[], resetKey: string) {
  const [state, setState] = useState<WritingGameSessionState>(() =>
    createInitialWritingGameState(pool),
  );
  const stateRef = useRef(state);
  const [lastFeedback, setLastFeedback] = useState<{
    status: GameSessionState['answerState'];
    promptText?: string;
    correctRomaji: string;
    selectedRomaji?: string | null;
  }>({
    status: 'idle',
    promptText: '',
    correctRomaji: '',
    selectedRomaji: null,
  });
  const nextRoundTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    if (nextRoundTimeoutRef.current) {
      clearTimeout(nextRoundTimeoutRef.current);
      nextRoundTimeoutRef.current = null;
    }

    const initialState = createInitialWritingGameState(pool);
    stateRef.current = initialState;
    setState(initialState);
    setLastFeedback({
      status: 'idle',
      promptText: '',
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

  useEffect(() => {
    if (state.answerState === 'idle') {
      return;
    }

    if (nextRoundTimeoutRef.current) {
      clearTimeout(nextRoundTimeoutRef.current);
    }

    nextRoundTimeoutRef.current = setTimeout(() => {
      setState((currentState) => {
        const nextState = moveToNextWritingRound(currentState, pool);
        stateRef.current = nextState;
        return nextState;
      });
      nextRoundTimeoutRef.current = null;
    }, state.answerState === 'correct' ? 220 : 340);

    return () => {
      if (nextRoundTimeoutRef.current) {
        clearTimeout(nextRoundTimeoutRef.current);
        nextRoundTimeoutRef.current = null;
      }
    };
  }, [pool, state.answerState, state.round.roundKey]);

  const setInputValue = (value: string) => {
    setState((currentState) => {
      const updatedState = updateWritingInput(currentState, value);
      stateRef.current = updatedState;
      return updatedState;
    });
  };

  const submit = (rawInput?: string) => {
    const currentState = stateRef.current;
    const updatedState = submitWritingAnswer(currentState, rawInput);

    if (updatedState === currentState) {
      return;
    }

    const selectedRomaji = sanitizeWritingInput(rawInput ?? currentState.inputValue);
    const nextAnswerState = updatedState.answerState;

    stateRef.current = updatedState;
    setState(updatedState);
    setLastFeedback({
      status: nextAnswerState,
      promptText: currentState.round.promptText,
      correctRomaji: currentState.round.answer,
      selectedRomaji,
    });

    if (nextAnswerState === 'correct') {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  return {
    state,
    setInputValue,
    submit,
    lastFeedback,
  };
}

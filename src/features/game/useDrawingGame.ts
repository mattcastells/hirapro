import { useCallback, useEffect, useRef, useState } from 'react';
import * as Haptics from 'expo-haptics';

import { useAppSettings } from '../../settings/AppSettingsProvider';
import { HiraganaCharacter } from '../../types/hiragana';
import { GameSessionState } from './gameEngine';
import {
  addStrokePoint,
  beginStroke,
  clearDrawing,
  createInitialDrawingGameState,
  DrawingGameSessionState,
  DrawingPoint,
  finishStroke,
  moveToNextDrawingRound,
  submitDrawing,
} from './drawingGameEngine';

export function useDrawingGame(
  pool: HiraganaCharacter[],
  resetKey: string,
) {
  const {
    settings: { hapticsEnabled },
  } = useAppSettings();
  const [state, setState] = useState<DrawingGameSessionState>(() =>
    createInitialDrawingGameState(pool),
  );
  const stateRef = useRef(state);
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
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    if (nextRoundTimeoutRef.current) {
      clearTimeout(nextRoundTimeoutRef.current);
      nextRoundTimeoutRef.current = null;
    }

    const initialState = createInitialDrawingGameState(pool);
    stateRef.current = initialState;
    setState(initialState);
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

  useEffect(() => {
    if (state.answerState === 'idle') {
      return;
    }

    if (nextRoundTimeoutRef.current) {
      clearTimeout(nextRoundTimeoutRef.current);
    }

    nextRoundTimeoutRef.current = setTimeout(() => {
      setState((currentState) => {
        const nextState = moveToNextDrawingRound(currentState, pool);
        stateRef.current = nextState;
        return nextState;
      });
      nextRoundTimeoutRef.current = null;
    }, state.answerState === 'correct' ? 900 : 1400);

    return () => {
      if (nextRoundTimeoutRef.current) {
        clearTimeout(nextRoundTimeoutRef.current);
        nextRoundTimeoutRef.current = null;
      }
    };
  }, [pool, state.answerState, state.round.roundKey]);

  const strokeStart = useCallback((point: DrawingPoint) => {
    setState((current) => {
      const next = beginStroke(current, point);
      stateRef.current = next;
      return next;
    });
  }, []);

  const strokeUpdate = useCallback((point: DrawingPoint) => {
    setState((current) => {
      const next = addStrokePoint(current, point);
      stateRef.current = next;
      return next;
    });
  }, []);

  const strokeEnd = useCallback(() => {
    setState((current) => {
      const next = finishStroke(current);
      stateRef.current = next;
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    setState((current) => {
      const next = clearDrawing(current);
      stateRef.current = next;
      return next;
    });
  }, []);

  const submit = useCallback(() => {
    const currentState = stateRef.current;
    const updatedState = submitDrawing(currentState);

    if (updatedState === currentState) {
      return;
    }

    const userCount = currentState.userStrokes.length;
    const expectedCount = currentState.round.expectedStrokeCount;
    const nextAnswerState = updatedState.answerState;

    stateRef.current = updatedState;
    setState(updatedState);
    setLastFeedback({
      status: nextAnswerState,
      promptText: currentState.round.character.kana,
      correctText: `${expectedCount} trazos`,
      selectedText: nextAnswerState === 'incorrect' ? `${userCount} trazos` : null,
    });

    if (hapticsEnabled) {
      if (nextAnswerState === 'correct') {
        void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else {
        void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    }
  }, [hapticsEnabled]);

  return {
    state,
    strokeStart,
    strokeUpdate,
    strokeEnd,
    clear,
    submit,
    lastFeedback,
  };
}

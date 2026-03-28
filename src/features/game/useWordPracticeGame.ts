import { useEffect, useRef, useState } from 'react';
import * as Haptics from 'expo-haptics';

import { WordPracticeEntry } from '../../data/wordVocabulary';
import { useAppSettings } from '../../settings/AppSettingsProvider';
import { PracticeMode } from '../../types/game';
import { GameSessionState } from './gameEngine';
import {
  createInitialWordGameState,
  getWordAnswerKind,
  moveToNextWordRound,
  submitWordAnswer,
  updateWordInput,
  WordGameSessionState,
} from './wordGameEngine';

export function useWordPracticeGame(
  pool: WordPracticeEntry[],
  resetKey: string,
  mode: Extract<PracticeMode, 'words' | 'syllables'>,
  inverted = false,
) {
  const {
    settings: { hapticsEnabled },
  } = useAppSettings();
  const answerKind = getWordAnswerKind(mode, inverted);
  const [state, setState] = useState<WordGameSessionState>(() =>
    createInitialWordGameState(pool, mode, inverted),
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

    const initialState = createInitialWordGameState(pool, mode, inverted);
    stateRef.current = initialState;
    setState(initialState);
    setLastFeedback({
      status: 'idle',
      promptText: '',
      correctText: '',
      selectedText: null,
    });
  }, [inverted, mode, pool, resetKey]);

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

    const nextRoundDelay =
      mode === 'syllables'
        ? state.answerState === 'correct'
          ? 1100
          : 1450
        : state.answerState === 'correct'
          ? 300
          : 420;

    nextRoundTimeoutRef.current = setTimeout(() => {
      setState((currentState) => {
        const nextState = moveToNextWordRound(currentState, pool, mode, inverted);
        stateRef.current = nextState;
        return nextState;
      });
      nextRoundTimeoutRef.current = null;
    }, nextRoundDelay);

    return () => {
      if (nextRoundTimeoutRef.current) {
        clearTimeout(nextRoundTimeoutRef.current);
        nextRoundTimeoutRef.current = null;
      }
    };
  }, [inverted, mode, pool, state.answerState, state.round.roundKey]);

  const setInputValue = (value: string) => {
    setState((currentState) => {
      const updatedState = updateWordInput(currentState, value);
      stateRef.current = updatedState;
      return updatedState;
    });
  };

  const submit = (rawInput?: string) => {
    const currentState = stateRef.current;
    const updatedState = submitWordAnswer(currentState, rawInput, answerKind);

    if (updatedState === currentState) {
      return;
    }

    const selectedText = (rawInput ?? currentState.inputValue).trim();
    const nextAnswerState = updatedState.answerState;

    stateRef.current = updatedState;
    setState(updatedState);
    setLastFeedback({
      status: nextAnswerState,
      promptText: currentState.round.feedbackPromptText,
      correctText: currentState.round.feedbackText,
      selectedText,
    });

    if (hapticsEnabled) {
      if (nextAnswerState === 'correct') {
        void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else {
        void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    }
  };

  return {
    state,
    setInputValue,
    submit,
    lastFeedback,
  };
}

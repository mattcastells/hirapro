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

const TIMER_DURATION_MS = 5000;

export function useSpeedReadingGame(
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
  }>({ status: 'idle', promptText: '', correctText: '', selectedText: null });

  // Timer: fraction remaining (1 → 0)
  const [timerFraction, setTimerFraction] = useState(1);

  const nextRoundTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const timerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timerStartRef = useRef<number>(Date.now());
  const lockedRef = useRef(false);

  const clearTimer = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  };

  const startTimer = () => {
    clearTimer();
    timerStartRef.current = Date.now();
    setTimerFraction(1);

    timerIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - timerStartRef.current;
      const remaining = Math.max(0, 1 - elapsed / TIMER_DURATION_MS);
      setTimerFraction(remaining);

      if (remaining <= 0) {
        clearTimer();
        // Auto-fail if still idle
        if (!lockedRef.current) {
          handleTimeout();
        }
      }
    }, 50);
  };

  const handleTimeout = () => {
    lockedRef.current = true;
    let correctText = '';

    setState((current) => {
      if (current.answerState !== 'idle') return current;
      const correctOption = current.round.options.find(
        (o) => o.id === current.round.correctOptionId,
      );
      correctText = inverted
        ? current.round.prompt.kana
        : current.round.prompt.romaji;

      const timeoutFeedbackText = correctOption
        ? inverted
          ? correctOption.kana
          : correctOption.romaji
        : '';
      void timeoutFeedbackText;

      if (hapticsEnabled) {
        void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }

      setLastFeedback({
        status: 'incorrect',
        promptText: inverted
          ? current.round.prompt.romaji
          : current.round.prompt.kana,
        correctText,
        selectedText: null,
      });

      return {
        ...current,
        answerState: 'incorrect' as const,
        selectedOptionId: null,
        stats: {
          ...current.stats,
          incorrect: current.stats.incorrect + 1,
          streak: 0,
          answered: current.stats.answered + 1,
        },
      };
    });

    if (nextRoundTimeoutRef.current) clearTimeout(nextRoundTimeoutRef.current);
    nextRoundTimeoutRef.current = setTimeout(() => {
      lockedRef.current = false;
      setState((current) => moveToNextRound(current, pool));
      nextRoundTimeoutRef.current = null;
      startTimer();
    }, 1200);
  };

  useEffect(() => {
    lockedRef.current = false;
    if (nextRoundTimeoutRef.current) {
      clearTimeout(nextRoundTimeoutRef.current);
      nextRoundTimeoutRef.current = null;
    }
    setState(createInitialGameState(pool));
    setLastFeedback({ status: 'idle', promptText: '', correctText: '', selectedText: null });
    startTimer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pool, resetKey]);

  useEffect(
    () => () => {
      if (nextRoundTimeoutRef.current) clearTimeout(nextRoundTimeoutRef.current);
      clearTimer();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const answer = (optionId: string) => {
    if (lockedRef.current) return;

    let nextAnswerState: GameSessionState['answerState'] = 'idle';
    let promptText = '';
    let correctText = '';
    let selectedText: string | null = null;

    setState((current) => {
      const updated = submitAnswer(current, optionId);
      const selectedOption = current.round.options.find((o) => o.id === optionId);

      nextAnswerState = updated.answerState;
      promptText = inverted ? current.round.prompt.romaji : current.round.prompt.kana;
      correctText = inverted ? current.round.prompt.kana : current.round.prompt.romaji;
      selectedText = selectedOption
        ? inverted
          ? selectedOption.kana
          : selectedOption.romaji
        : null;
      return updated;
    });

    if (nextAnswerState === 'idle') return;

    clearTimer();
    lockedRef.current = true;
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
      lockedRef.current = false;
      setState((current) => moveToNextRound(current, pool));
      nextRoundTimeoutRef.current = null;
      startTimer();
    }, nextAnswerState === 'correct' ? 180 : 300);
  };

  return { state, answer, lastFeedback, timerFraction };
}

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

import {
  AnswerOptionButton,
  AnswerOptionVisualState,
} from '../components/game/AnswerOptionButton';
import { FeedbackBanner } from '../components/game/FeedbackBanner';
import { AppText } from '../components/ui/AppText';
import { GlassCard } from '../components/ui/GlassCard';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { ScreenBackground } from '../components/ui/ScreenBackground';
import { ScreenHeader } from '../components/ui/ScreenHeader';
import { StatPill } from '../components/ui/StatPill';
import { getCharactersForGroupIds } from '../data/hiragana';
import { GameSessionState, GameStats } from '../features/game/gameEngine';
import { useHiraganaGame } from '../features/game/useHiraganaGame';
import { useWritingHiraganaGame } from '../features/game/useWritingHiraganaGame';
import { sanitizeWritingInput } from '../features/game/writingGameEngine';
import { useAppTheme } from '../theme/AppThemeProvider';
import { hexToRgba, theme } from '../theme/theme';
import { HiraganaCharacter } from '../types/hiragana';
import { RootStackScreenProps } from '../types/navigation';

const GAME_SUCCESS_COLOR = '#59F271';
const GAME_ERROR_COLOR = '#FF6B5B';
const GAME_INFO_COLOR = '#14B7FF';

export function GameScreen({
  route,
}: RootStackScreenProps<'HiraganaGame'>) {
  const pool = useMemo(
    () => getCharactersForGroupIds(route.params.selectedGroupIds),
    [route.params.selectedGroupIds],
  );
  const resetKey = `${route.params.mode}:${route.params.selectedGroupIds.join('|')}`;

  if (!pool.length) {
    return (
      <ScreenBackground scrollable={false}>
        <ScreenHeader
          title="No hay contenido para practicar."
          subtitle="Volve a la seleccion y activa al menos un grupo de Hiragana."
        />
      </ScreenBackground>
    );
  }

  return (
    <ScreenBackground scrollable={false}>
      {route.params.mode === 'writing' ? (
        <WritingGameView pool={pool} resetKey={resetKey} />
      ) : (
        <ReadingGameView pool={pool} resetKey={resetKey} />
      )}
    </ScreenBackground>
  );
}

function ReadingGameView({
  pool,
  resetKey,
}: {
  pool: HiraganaCharacter[];
  resetKey: string;
}) {
  const { state, answer, lastFeedback } = useHiraganaGame(pool, resetKey);
  const kanaTransition = useRef(new Animated.Value(1)).current;
  const answersTransition = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    kanaTransition.setValue(0);
    answersTransition.setValue(0);

    Animated.parallel([
      Animated.timing(kanaTransition, {
        toValue: 1,
        duration: 120,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(answersTransition, {
        toValue: 1,
        duration: 140,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [answersTransition, kanaTransition, state.round.prompt.id]);

  const kanaTextAnimatedStyle = {
    opacity: kanaTransition,
    transform: [
      {
        translateY: kanaTransition.interpolate({
          inputRange: [0, 1],
          outputRange: [10, 0],
        }),
      },
      {
        scale: kanaTransition.interpolate({
          inputRange: [0, 1],
          outputRange: [0.97, 1],
        }),
      },
    ],
  };

  const optionTextAnimatedStyle = {
    opacity: answersTransition,
    transform: [
      {
        translateY: answersTransition.interpolate({
          inputRange: [0, 1],
          outputRange: [10, 0],
        }),
      },
    ],
  };

  return (
    <View style={styles.screen}>
      <GameTopBlock
        title="Lectura"
        stats={state.stats}
        lastFeedback={lastFeedback}
      />

      <GlassCard style={styles.questionCard} contentStyle={styles.questionCardContent}>
        <View style={styles.kanaWrap}>
          <Animated.View style={kanaTextAnimatedStyle}>
            <AppText variant="kana" style={styles.kana}>
              {state.round.prompt.kana}
            </AppText>
          </Animated.View>
        </View>
      </GlassCard>

      <View style={styles.answersGrid}>
        {state.round.options.map((option) => (
          <AnswerOptionButton
            key={option.id}
            label={option.romaji}
            disabled={state.answerState !== 'idle'}
            visualState={getOptionState(option.id, state)}
            onPress={() => answer(option.id)}
            labelWrapStyle={optionTextAnimatedStyle}
          />
        ))}
      </View>
    </View>
  );
}

function WritingGameView({
  pool,
  resetKey,
}: {
  pool: HiraganaCharacter[];
  resetKey: string;
}) {
  const { theme: activeTheme } = useAppTheme();
  const { state, setInputValue, submit, lastFeedback } = useWritingHiraganaGame(
    pool,
    resetKey,
  );
  const promptTransition = useRef(new Animated.Value(1)).current;
  const inputLineTransition = useRef(new Animated.Value(0)).current;
  const inputLineResetTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<TextInput>(null);
  const [inputFeedbackTone, setInputFeedbackTone] = useState<string | null>(null);

  useEffect(() => {
    promptTransition.setValue(0);

    Animated.timing(promptTransition, {
      toValue: 1,
      duration: 130,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();

    const focusTimeout = setTimeout(() => {
      inputRef.current?.focus();
    }, 90);

    return () => {
      clearTimeout(focusTimeout);
    };
  }, [promptTransition, state.round.roundKey]);

  useEffect(() => {
    if (state.answerState === 'idle') {
      return;
    }

    const nextTone =
      state.answerState === 'correct' ? GAME_SUCCESS_COLOR : GAME_ERROR_COLOR;

    if (inputLineResetTimeoutRef.current) {
      clearTimeout(inputLineResetTimeoutRef.current);
      inputLineResetTimeoutRef.current = null;
    }

    setInputFeedbackTone(nextTone);
    inputLineTransition.stopAnimation();
    inputLineTransition.setValue(0);

    Animated.sequence([
      Animated.timing(inputLineTransition, {
        toValue: 1,
        duration: 120,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }),
      Animated.delay(680),
      Animated.timing(inputLineTransition, {
        toValue: 0,
        duration: 220,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }),
    ]).start();

    inputLineResetTimeoutRef.current = setTimeout(() => {
      setInputFeedbackTone(null);
      inputLineResetTimeoutRef.current = null;
    }, 1000);
  }, [inputLineTransition, state.answerState]);

  useEffect(
    () => () => {
      if (inputLineResetTimeoutRef.current) {
        clearTimeout(inputLineResetTimeoutRef.current);
      }

      inputLineTransition.stopAnimation();
    },
    [inputLineTransition],
  );

  const promptAnimatedStyle = {
    opacity: promptTransition,
    transform: [
      {
        translateY: promptTransition.interpolate({
          inputRange: [0, 1],
          outputRange: [10, 0],
        }),
      },
      {
        scale: promptTransition.interpolate({
          inputRange: [0, 1],
          outputRange: [0.975, 1],
        }),
      },
    ],
  };

  const canSubmit =
    state.answerState === 'idle' && sanitizeWritingInput(state.inputValue).length > 0;

  const neutralInputLineColor = hexToRgba(activeTheme.colors.white, 0.38);
  const inputLineColor = inputLineTransition.interpolate({
    inputRange: [0, 1],
    outputRange: [
      neutralInputLineColor,
      inputFeedbackTone ?? neutralInputLineColor,
    ],
  });

  const handleChangeText = (value: string) => {
    setInputValue(value);
  };

  return (
    <View style={styles.screen}>
      <GameTopBlock
        title="Escritura"
        stats={state.stats}
        lastFeedback={lastFeedback}
      />

      <GlassCard style={styles.questionCard} contentStyle={styles.writingCardContent}>
        <View style={styles.writingPromptWrap}>
          <Animated.View style={promptAnimatedStyle}>
            <AppText variant="kana" style={styles.writingKana}>
              {state.round.promptText}
            </AppText>
          </Animated.View>
        </View>
      </GlassCard>

      <View style={styles.inputSection}>
        <Animated.View
          style={[
            styles.inputUnderline,
            {
              borderBottomColor: inputFeedbackTone
                ? inputLineColor
                : neutralInputLineColor,
            },
          ]}
        >
          <TextInput
            ref={inputRef}
            value={state.inputValue}
            onChangeText={handleChangeText}
            onSubmitEditing={(event) => submit(event.nativeEvent.text)}
            editable={state.answerState === 'idle'}
            autoCapitalize="none"
            autoCorrect={false}
            blurOnSubmit={false}
            returnKeyType="done"
            maxLength={12}
            placeholder="Escribi en romaji"
            placeholderTextColor={activeTheme.colors.textMuted}
            selectionColor={activeTheme.colors.accentBlue}
            style={[
              styles.input,
              {
                color: activeTheme.colors.white,
              },
            ]}
          />
        </Animated.View>

        <PrimaryButton
          title="ENVIAR"
          variant="primary"
          size="compact"
          disabled={!canSubmit}
          onPress={() => submit(state.inputValue)}
          style={styles.submitButton}
        />
      </View>
    </View>
  );
}

function GameTopBlock({
  title,
  stats,
  lastFeedback,
}: {
  title: string;
  stats: GameStats;
  lastFeedback: {
    status: GameSessionState['answerState'];
    promptText?: string;
    correctRomaji: string;
    selectedRomaji?: string | null;
  };
}) {
  return (
    <View style={styles.topBlock}>
      <AppText variant="title" style={styles.title}>
        {title}
      </AppText>

      <View style={styles.statsRow}>
        <StatPill
          label="Aciertos"
          value={stats.correct}
          accentColor={GAME_SUCCESS_COLOR}
        />
        <StatPill
          label="Fallidos"
          value={stats.incorrect}
          accentColor={GAME_ERROR_COLOR}
        />
        <StatPill
          label="Racha"
          value={stats.streak}
          accentColor={GAME_INFO_COLOR}
        />
      </View>

      <View style={styles.feedbackSlot}>
        <FeedbackBanner
          status={lastFeedback.status}
          promptText={lastFeedback.promptText}
          correctRomaji={lastFeedback.correctRomaji}
          selectedRomaji={lastFeedback.selectedRomaji}
        />
      </View>
    </View>
  );
}

function getOptionState(
  optionId: string,
  state: GameSessionState,
): AnswerOptionVisualState {
  if (state.answerState === 'idle') {
    return 'idle';
  }

  if (optionId === state.round.correctOptionId) {
    return 'correct';
  }

  if (optionId === state.selectedOptionId && state.answerState === 'incorrect') {
    return 'incorrect';
  }

  return 'muted';
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  topBlock: {
    marginBottom: theme.spacing.xs,
  },
  title: {
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  statsRow: {
    flexDirection: 'row',
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.xs,
  },
  feedbackSlot: {
    minHeight: 44,
    marginBottom: theme.spacing.xs,
  },
  questionCard: {
    marginBottom: theme.spacing.sm,
  },
  questionCardContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
  },
  writingCardContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  kanaWrap: {
    minHeight: 148,
    alignItems: 'center',
    justifyContent: 'center',
  },
  kana: {
    fontSize: 78,
    lineHeight: 82,
  },
  writingPromptWrap: {
    minHeight: 160,
    alignItems: 'center',
    justifyContent: 'center',
  },
  writingKana: {
    fontSize: 61,
    lineHeight: 69,
    letterSpacing: 1,
  },
  answersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
  },
  inputSection: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    alignItems: 'center',
  },
  inputUnderline: {
    minWidth: 180,
    maxWidth: '88%',
    borderBottomWidth: 1,
    paddingBottom: 6,
  },
  input: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 22,
    lineHeight: 28,
    textAlign: 'center',
    paddingVertical: 0,
    minHeight: 36,
  },
  submitButton: {
    marginTop: theme.spacing.md,
    minWidth: 180,
  },
});

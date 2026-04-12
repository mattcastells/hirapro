import { useState } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';

import { AnswerOptionButton } from '../components/game/AnswerOptionButton';
import { FeedbackBanner } from '../components/game/FeedbackBanner';
import { AppText } from '../components/ui/AppText';
import { ScreenBackground } from '../components/ui/ScreenBackground';
import { ScreenHeader } from '../components/ui/ScreenHeader';
import { StatPill } from '../components/ui/StatPill';
import { useNumbersGame } from '../features/game/useNumbersGame';
import { NumbersGameMode } from '../features/game/numbersGameEngine';
import { useAppTheme } from '../theme/AppThemeProvider';
import { hexToRgba, theme } from '../theme/theme';
import { RootStackScreenProps } from '../types/navigation';

type ModeTab = { mode: NumbersGameMode; label: string };

const MODES: ModeTab[] = [
  { mode: 'num-to-reading', label: '1 → よみ' },
  { mode: 'reading-to-num', label: 'よみ → 1' },
  { mode: 'kanji-to-reading', label: '一 → よみ' },
  { mode: 'reading-to-kanji', label: 'よみ → 一' },
];

export function NumbersGameScreen({ navigation }: RootStackScreenProps<'NumbersGame'>) {
  const { theme: activeTheme } = useAppTheme();
  const [selectedMode, setSelectedMode] = useState<NumbersGameMode>('num-to-reading');
  const [modeKey, setModeKey] = useState('num-to-reading');

  const handleModeChange = (m: NumbersGameMode) => {
    setSelectedMode(m);
    setModeKey(m);
  };

  const { state, answer, lastFeedback } = useNumbersGame(selectedMode, modeKey);
  const { round, answerState, selectedOptionId, stats } = state;

  const isKanjiOrNumPrompt =
    selectedMode === 'num-to-reading' || selectedMode === 'kanji-to-reading';

  const getOptionState = (optionId: string) => {
    if (answerState === 'idle') return 'idle' as const;
    if (optionId === round.correctOptionId) return 'correct' as const;
    if (optionId === selectedOptionId) return 'incorrect' as const;
    return 'muted' as const;
  };

  const accent = activeTheme.colors.accentCyan;

  return (
    <ScreenBackground scrollable={false} bottomNavActive="home">
      <ScreenHeader
        title="Números"
        eyebrow="Práctica"
        onBack={() => navigation.goBack()}
      />

      {/* Mode tabs */}
      <View style={styles.tabs}>
        {MODES.map((m) => {
          const active = selectedMode === m.mode;
          return (
            <Pressable
              key={m.mode}
              onPress={() => handleModeChange(m.mode)}
              style={[
                styles.tab,
                {
                  borderColor: active
                    ? hexToRgba(accent, 0.8)
                    : activeTheme.colors.line,
                  backgroundColor: active
                    ? hexToRgba(accent, Platform.OS === 'android' ? 0.18 : 0.1)
                    : 'transparent',
                },
              ]}
            >
              <AppText
                variant="label"
                color={active ? accent : activeTheme.colors.textMuted}
              >
                {m.label}
              </AppText>
            </Pressable>
          );
        })}
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <StatPill label="✓" value={stats.correct} accentColor={activeTheme.colors.accentGreen} />
        <StatPill label="✗" value={stats.incorrect} accentColor={activeTheme.colors.error} />
        <StatPill label="🔥" value={stats.streak} accentColor={activeTheme.colors.accentOrange} />
      </View>

      {/* Prompt card */}
      <View
        style={[
          styles.promptCard,
          {
            borderColor: hexToRgba(accent, 0.22),
            backgroundColor:
              Platform.OS === 'android'
                ? hexToRgba(activeTheme.colors.backgroundSecondary, 0.94)
                : hexToRgba(activeTheme.colors.black, 0.18),
            shadowColor: accent,
          },
        ]}
      >
        <AppText variant="overline" color={activeTheme.colors.textMuted} style={styles.promptLabel}>
          {round.promptLabel}
        </AppText>
        <AppText
          style={[
            styles.promptText,
            isKanjiOrNumPrompt && styles.promptLarge,
            { color: activeTheme.colors.textPrimary },
          ]}
        >
          {round.promptText}
        </AppText>
      </View>

      {/* Options */}
      <View style={styles.options}>
        {round.options.map((option) => (
          <AnswerOptionButton
            key={option.id}
            label={option.text}
            visualState={getOptionState(option.id)}
            disabled={answerState !== 'idle'}
            onPress={() => answer(option.id)}
          />
        ))}
      </View>

      {/* Feedback */}
      <FeedbackBanner
        status={lastFeedback.status}
        promptText={lastFeedback.promptText}
        correctText={lastFeedback.correctText}
        selectedText={lastFeedback.selectedText}
      />
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  tabs: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.md,
  },
  tab: {
    flexGrow: 1,
    borderWidth: 1,
    borderRadius: theme.radii.pill,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 7,
    alignItems: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  promptCard: {
    borderWidth: 1,
    borderRadius: theme.radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.xxl,
    paddingHorizontal: theme.spacing.xl,
    marginBottom: theme.spacing.lg,
    minHeight: 140,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.14,
    shadowRadius: 16,
    elevation: 5,
    gap: theme.spacing.xs,
  },
  promptLabel: {
    opacity: 0.6,
  },
  promptText: {
    fontFamily: 'Sora_600SemiBold',
    fontSize: 22,
    lineHeight: 30,
    textAlign: 'center',
  },
  promptLarge: {
    fontSize: 64,
    lineHeight: 72,
    fontFamily: 'Sora_700Bold',
  },
  options: {
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
});

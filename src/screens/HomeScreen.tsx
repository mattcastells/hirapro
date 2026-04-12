import { Platform, Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '../components/ui/AppText';
import { ScreenBackground } from '../components/ui/ScreenBackground';
import { useAppTheme } from '../theme/AppThemeProvider';
import { hexToRgba, theme } from '../theme/theme';
import { RootStackScreenProps } from '../types/navigation';

export function HomeScreen({ navigation }: RootStackScreenProps<'Home'>) {
  const { theme: activeTheme } = useAppTheme();

  return (
    <ScreenBackground scrollable bottomNavActive="home">
      <View style={styles.root}>
        {/* Sección: Práctica */}
        <View style={styles.section}>
          <AppText variant="overline" color={activeTheme.colors.textMuted} style={styles.sectionLabel}>
            Práctica
          </AppText>
          <View style={styles.entries}>
            <ScriptEntryButton
              label="HIRAGANA"
              accentColor={activeTheme.colors.accentBlue}
              onPress={() => navigation.navigate('KanaGroups', { script: 'hiragana' })}
            />
            <ScriptEntryButton
              label="KATAKANA"
              accentColor={activeTheme.colors.accentPink}
              onPress={() => navigation.navigate('KanaGroups', { script: 'katakana' })}
            />
            <ScriptEntryButton
              label="KANJI"
              accentColor={activeTheme.colors.accentOrange}
              onPress={() => navigation.navigate('KanjiHub')}
            />
            <ScriptEntryButton
              label="KYARY"
              accentColor={activeTheme.colors.accentGreen}
              onPress={() => navigation.navigate('Kyary')}
            />
          </View>
        </View>

        {/* Sección: Teoría */}
        <View style={styles.section}>
          <AppText variant="overline" color={activeTheme.colors.textMuted} style={styles.sectionLabel}>
            Teoría
          </AppText>
          <View style={styles.entries}>
            <ScriptEntryButton
              label="PARTÍCULAS"
              accentColor={activeTheme.colors.accentCyan}
              onPress={() => navigation.navigate('TheoryParticles')}
            />
            <ScriptEntryButton
              label="PREGUNTAS"
              accentColor={activeTheme.colors.accentOrange}
              onPress={() => navigation.navigate('TheoryQuestions')}
            />
            <ScriptEntryButton
              label="DEMOSTRATIVOS"
              accentColor={activeTheme.colors.accentGreen}
              onPress={() => navigation.navigate('TheoryDemonstratives')}
            />
            <ScriptEntryButton
              label="PRESENTACIONES"
              accentColor={activeTheme.colors.accentPink}
              onPress={() => navigation.navigate('TheoryPresentations')}
            />
            <ScriptEntryButton
              label="NÚMEROS"
              accentColor={activeTheme.colors.accentBlue}
              onPress={() => navigation.navigate('TheoryNumbers')}
            />
          </View>
        </View>
      </View>
    </ScreenBackground>
  );
}

function ScriptEntryButton({
  label,
  accentColor,
  onPress,
}: {
  label: string;
  accentColor: string;
  onPress: () => void;
}) {
  const { theme: activeTheme } = useAppTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.entryButton,
        styles.focusReset,
        {
          shadowColor: accentColor,
        },
        pressed ? styles.pressed : null,
      ]}
    >
      <View
        style={[
          styles.entrySurface,
          {
            backgroundColor: hexToRgba(
              activeTheme.colors.backgroundSecondary,
              Platform.OS === 'android' ? 0.94 : 0.28,
            ),
            borderColor: hexToRgba(accentColor, 0.92),
          },
        ]}
      >
        <View style={styles.entryRow}>
          <AppText variant="overline" style={[styles.entryTitle, { color: accentColor }]}>
            {label}
          </AppText>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    gap: theme.spacing.xxl,
    paddingVertical: theme.spacing.xl,
  },
  section: {
    gap: theme.spacing.sm,
  },
  sectionLabel: {
    paddingHorizontal: theme.spacing.xs,
  },
  entries: {
    gap: theme.spacing.lg,
  },
  entryButton: {
    borderRadius: 18,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 7,
  },
  entrySurface: {
    minHeight: 54,
    paddingHorizontal: theme.spacing.md,
    borderRadius: 18,
    borderWidth: 1,
    justifyContent: 'center',
  },
  focusReset: {
    outlineWidth: 0,
    outlineColor: 'transparent',
  },
  entryRow: {
    justifyContent: 'center',
  },
  entryTitle: {
    fontSize: 11,
    lineHeight: 12,
    letterSpacing: 2.1,
    textAlign: 'center',
    color: theme.colors.accentBlue,
  },
  pressed: {
    opacity: 0.92,
  },
});

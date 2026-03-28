import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '../components/ui/AppText';
import { ScreenBackground } from '../components/ui/ScreenBackground';
import { useAppTheme } from '../theme/AppThemeProvider';
import { hexToRgba, theme } from '../theme/theme';
import { RootStackScreenProps } from '../types/navigation';

export function HomeScreen({ navigation }: RootStackScreenProps<'Home'>) {
  const { theme: activeTheme } = useAppTheme();

  return (
    <ScreenBackground scrollable={false} bottomNavActive="home">
      <Pressable
        onPress={() => navigation.navigate('HiraganaGroups')}
        style={({ pressed }) => [
          styles.entryButton,
          styles.focusReset,
          {
            backgroundColor: hexToRgba(activeTheme.colors.black, 0.28),
            borderColor: hexToRgba(activeTheme.colors.accentBlue, 0.92),
            shadowColor: activeTheme.colors.accentBlue,
          },
          pressed ? styles.pressed : null,
        ]}
      >
        <View style={styles.entryRow}>
          <AppText variant="overline" style={styles.entryTitle}>
            HIRAGANA
          </AppText>
        </View>
      </Pressable>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  entryButton: {
    minHeight: 54,
    marginBottom: theme.spacing.lg,
    paddingHorizontal: theme.spacing.md,
    borderRadius: 18,
    borderWidth: 1,
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 7,
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

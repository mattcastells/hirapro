import { Pressable, StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { useAppTheme } from '../../theme/AppThemeProvider';
import { hexToRgba, theme } from '../../theme/theme';
import { HiraganaGroup } from '../../types/hiragana';
import { AppText } from '../ui/AppText';

type GroupSelectorCardProps = {
  group: HiraganaGroup;
  selected: boolean;
  onPress: () => void;
};

export function GroupSelectorCard({
  group,
  selected,
  onPress,
}: GroupSelectorCardProps) {
  const { theme: activeTheme } = useAppTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.outer,
        styles.focusReset,
        pressed ? styles.pressed : null,
      ]}
    >
      <View style={styles.row}>
        <View
          style={[
            styles.card,
            {
              backgroundColor: hexToRgba(activeTheme.colors.black, 0.24),
              borderColor: selected
                ? hexToRgba(activeTheme.colors.accentBlue, 0.88)
                : hexToRgba(activeTheme.colors.accentBlue, 0.2),
              shadowColor: activeTheme.colors.accentBlue,
              shadowOpacity: selected ? 0.16 : 0.05,
            },
          ]}
        >
          <View style={styles.content}>
            <AppText
              variant="bodySmall"
              color={activeTheme.colors.textSecondary}
              style={styles.romaji}
              numberOfLines={1}
            >
              {group.romajiPreview}
            </AppText>
            <AppText
              variant="bodyStrong"
              color={selected ? activeTheme.colors.textPrimary : activeTheme.colors.textSecondary}
              style={styles.kana}
              numberOfLines={1}
            >
              {group.kanaPreview}
            </AppText>
          </View>
        </View>

        <View
          style={[
            styles.checkbox,
            {
              borderColor: selected
                ? activeTheme.colors.accentBlue
                : hexToRgba(activeTheme.colors.white, 0.18),
              backgroundColor: selected
                ? hexToRgba(activeTheme.colors.accentBlue, 0.14)
                : 'transparent',
            },
          ]}
        >
          <MaterialCommunityIcons
            name={selected ? 'check' : 'checkbox-blank-outline'}
            size={selected ? 16 : 15}
            color={
              selected
                ? activeTheme.colors.accentBlue
                : activeTheme.colors.textMuted
            }
          />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  outer: {
    marginBottom: theme.spacing.sm,
    outlineWidth: 0,
    outlineColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
  },
  focusReset: {
    outlineWidth: 0,
    outlineColor: 'transparent',
  },
  card: {
    flex: 1,
    minWidth: 0,
    paddingVertical: 12,
    paddingHorizontal: theme.spacing.md,
    borderRadius: 22,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 12,
    elevation: 5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  content: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 7,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  romaji: {
    flex: 1.25,
    minWidth: 0,
    fontSize: 12,
    lineHeight: 16,
  },
  kana: {
    flex: 1,
    minWidth: 0,
    fontSize: 15,
    letterSpacing: 0.08,
    lineHeight: 18,
  },
  pressed: {
    opacity: 0.92,
  },
});

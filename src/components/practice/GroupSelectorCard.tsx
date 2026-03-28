import { Pressable, StyleSheet, Text, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { useAppTheme } from '../../theme/AppThemeProvider';
import { hexToRgba, theme } from '../../theme/theme';
import { HiraganaGroup } from '../../types/hiragana';

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
              backgroundColor: selected
                ? hexToRgba(activeTheme.colors.backgroundSecondary, 0.96)
                : hexToRgba(activeTheme.colors.backgroundSecondary, 0.9),
              borderColor: selected
                ? hexToRgba(activeTheme.colors.accentBlue, 0.88)
                : hexToRgba(activeTheme.colors.accentBlue, 0.2),
              shadowColor: activeTheme.colors.accentBlue,
              shadowOpacity: selected ? 0.12 : 0.03,
            },
          ]}
        >
          <View style={styles.content}>
            <Text
              numberOfLines={1}
              style={[
                styles.romaji,
                {
                  color: selected
                    ? activeTheme.colors.textPrimary
                    : activeTheme.colors.textSecondary,
                },
              ]}
            >
              {group.romajiPreview}
            </Text>
            <Text
              numberOfLines={1}
              style={[
                styles.kana,
                {
                  color: selected
                    ? activeTheme.colors.textPrimary
                    : activeTheme.colors.textSecondary,
                },
              ]}
            >
              {group.kanaPreview}
            </Text>
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
            color={selected ? activeTheme.colors.accentBlue : activeTheme.colors.textMuted}
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
    minHeight: 50,
    paddingVertical: 10,
    paddingHorizontal: theme.spacing.md,
    borderRadius: 22,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 10,
    elevation: 2,
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
    justifyContent: 'space-between',
    gap: theme.spacing.sm,
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
    flex: 1.2,
    minWidth: 0,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600',
  },
  kana: {
    flex: 1,
    minWidth: 0,
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.2,
    lineHeight: 22,
    textAlign: 'right',
  },
  pressed: {
    opacity: 0.92,
  },
});

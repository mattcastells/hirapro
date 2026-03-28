import { Platform, Pressable, StyleSheet, View } from 'react-native';

import { useAppTheme } from '../../theme/AppThemeProvider';
import { hexToRgba, theme } from '../../theme/theme';
import { AppText } from '../ui/AppText';

type WordCategoryCardProps = {
  title: string;
  count: number;
  selected: boolean;
  onPress: () => void;
};

export function WordCategoryCard({
  title,
  count,
  selected,
  onPress,
}: WordCategoryCardProps) {
  const { theme: activeTheme } = useAppTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.wrap, pressed ? styles.pressed : null]}
    >
      <View
        style={[
          styles.card,
          {
            borderColor: selected
              ? hexToRgba(activeTheme.colors.accentBlue, 0.88)
              : hexToRgba(activeTheme.colors.accentBlue, 0.2),
            backgroundColor:
              Platform.OS === 'android'
                ? hexToRgba(activeTheme.colors.backgroundSecondary, 0.9)
                : hexToRgba(activeTheme.colors.black, 0.16),
            shadowColor: activeTheme.colors.accentBlue,
            shadowOpacity: selected ? 0.12 : 0.03,
            shadowRadius: selected ? 10 : 0,
          },
        ]}
      >
        <AppText variant="label" color={activeTheme.colors.textPrimary} style={styles.title}>
          {title}
        </AppText>

        <View
          style={[
            styles.countBadge,
            {
              borderColor: selected
                ? activeTheme.colors.accentBlue
                : hexToRgba(activeTheme.colors.white, 0.14),
              backgroundColor: selected
                ? hexToRgba(activeTheme.colors.accentBlue, 0.12)
                : hexToRgba(activeTheme.colors.white, 0.03),
            },
          ]}
        >
          <AppText
            variant="bodySmall"
            color={
              selected
                ? activeTheme.colors.accentBlue
                : activeTheme.colors.textMuted
            }
            style={styles.countText}
          >
            {count}
          </AppText>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: theme.spacing.sm,
    width: '100%',
  },
  card: {
    minHeight: 44,
    borderRadius: 18,
    borderWidth: 1,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing.sm,
    shadowOffset: { width: 0, height: 0 },
    elevation: 2,
  },
  title: {
    flex: 1,
  },
  countBadge: {
    minWidth: 30,
    height: 24,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: theme.spacing.xs,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  countText: {
    fontSize: 12,
    lineHeight: 14,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.92,
  },
});

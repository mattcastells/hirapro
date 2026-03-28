import { Platform, Pressable, StyleSheet, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { useAppTheme } from '../../theme/AppThemeProvider';
import { hexToRgba, theme } from '../../theme/theme';
import { AppText } from '../ui/AppText';

type ModeSelectorCardProps = {
  title: string;
  selected: boolean;
  onPress: () => void;
};

export function ModeSelectorCard({
  title,
  selected,
  onPress,
}: ModeSelectorCardProps) {
  const { theme: activeTheme } = useAppTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.wrap,
        pressed ? styles.pressed : null,
      ]}
    >
      <View
        style={[
          styles.card,
          {
            borderColor: selected
              ? hexToRgba(activeTheme.colors.accentBlue, 0.9)
              : activeTheme.colors.line,
            backgroundColor:
              Platform.OS === 'android'
                ? hexToRgba(activeTheme.colors.backgroundSecondary, 0.9)
                : hexToRgba(activeTheme.colors.black, 0.16),
            shadowColor: activeTheme.colors.accentBlue,
            shadowOpacity: selected ? 0.12 : 0,
            shadowRadius: selected ? 10 : 0,
          },
        ]}
      >
        <AppText variant="label" color={activeTheme.colors.textPrimary}>
          {title}
        </AppText>

        <View
          style={[
            styles.indicator,
            {
              borderColor: selected
                ? activeTheme.colors.accentBlue
                : hexToRgba(activeTheme.colors.white, 0.16),
              backgroundColor: selected
                ? hexToRgba(activeTheme.colors.accentBlue, 0.12)
                : 'transparent',
            },
          ]}
        >
          <MaterialCommunityIcons
            name={selected ? 'radiobox-marked' : 'radiobox-blank'}
            size={16}
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
  wrap: {},
  card: {
    minHeight: 36,
    borderRadius: theme.radii.md,
    borderWidth: 1,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing.sm,
    shadowOffset: { width: 0, height: 0 },
  },
  indicator: {
    width: 22,
    height: 22,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  pressed: {
    opacity: 0.92,
  },
});

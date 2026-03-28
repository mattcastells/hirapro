import { StyleSheet, View } from 'react-native';

import { hexToRgba } from '../../theme/theme';
import { useAppTheme } from '../../theme/AppThemeProvider';
import { AppText } from './AppText';

type StatPillProps = {
  label: string;
  value: string | number;
  accentColor?: string;
};

export function StatPill({
  label,
  value,
  accentColor,
}: StatPillProps) {
  const { theme: activeTheme } = useAppTheme();
  const resolvedAccentColor = accentColor ?? activeTheme.colors.accentBlue;

  return (
    <View
      style={[
        styles.container,
        {
          borderColor: hexToRgba(resolvedAccentColor, 0.78),
          backgroundColor: 'transparent',
          shadowColor: resolvedAccentColor,
          shadowOpacity: 0.18,
          shadowRadius: 12,
        },
      ]}
    >
      <AppText
        variant="bodySmall"
        color={activeTheme.colors.textSecondary}
        style={styles.label}
        numberOfLines={1}
      >
        {label}
      </AppText>
      <AppText variant="title" style={styles.value} numberOfLines={1}>
        {value}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minWidth: 0,
    minHeight: 44,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    shadowOffset: { width: 0, height: 0 },
  },
  label: {
    flex: 1,
    minWidth: 0,
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 0.2,
    textTransform: 'none',
  },
  value: {
    minWidth: 12,
    fontSize: 16,
    lineHeight: 16,
    textAlign: 'right',
  },
});

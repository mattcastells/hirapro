import { ReactNode } from 'react';
import { Platform, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';

import { hexToRgba, theme } from '../../theme/theme';
import { useAppTheme } from '../../theme/AppThemeProvider';

type GlassCardProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  glowColor?: string;
  intensity?: number;
};

export function GlassCard({
  children,
  style,
  contentStyle,
  glowColor,
  intensity,
}: GlassCardProps) {
  const { theme: activeTheme, mode } = useAppTheme();
  const isDark = mode === 'dark';
  const resolvedGlowColor = glowColor ?? activeTheme.colors.accentBlue;
  const resolvedIntensity = intensity ?? 42;
  const useNativeBlur = Platform.OS !== 'android';
  const cardContent = (
    <View
      style={[
        styles.inner,
        {
          borderColor: hexToRgba(resolvedGlowColor, 0.16),
          backgroundColor: useNativeBlur
            ? activeTheme.colors.card
            : hexToRgba(activeTheme.colors.backgroundSecondary, 0.92),
        },
        contentStyle,
      ]}
    >
      {children}
    </View>
  );

  return (
    <View
      style={[
        styles.shadowWrap,
        {
          shadowColor: resolvedGlowColor,
          shadowOpacity: isDark
            ? useNativeBlur ? 0.2 : 0.14
            : useNativeBlur ? 0.16 : 0.10,
          shadowRadius: isDark
            ? useNativeBlur ? 24 : 18
            : useNativeBlur ? 20 : 14,
          elevation: isDark
            ? useNativeBlur ? 10 : 6
            : useNativeBlur ? 8 : 4,
        },
        style,
      ]}
    >
      {useNativeBlur ? (
        <BlurView
          intensity={resolvedIntensity}
          tint={mode === 'dark' ? 'dark' : 'light'}
          experimentalBlurMethod="dimezisBlurView"
          style={styles.blur}
        >
          {cardContent}
        </BlurView>
      ) : (
        <View style={styles.blur}>{cardContent}</View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  shadowWrap: {
    borderRadius: theme.radii.lg,
    shadowOffset: { width: 0, height: 14 },
  },
  blur: {
    borderRadius: theme.radii.lg,
    overflow: 'hidden',
  },
  inner: {
    borderWidth: 1,
    borderRadius: theme.radii.lg,
    padding: theme.spacing.lg,
  },
});

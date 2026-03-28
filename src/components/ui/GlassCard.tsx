import { ReactNode } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
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
  const { theme: activeTheme } = useAppTheme();
  const resolvedGlowColor = glowColor ?? activeTheme.colors.accentBlue;
  const resolvedIntensity = intensity ?? 42;

  return (
    <View
      style={[
        styles.shadowWrap,
        {
          shadowColor: resolvedGlowColor,
          shadowOpacity: 0.2,
          shadowRadius: 24,
          elevation: 10,
        },
        style,
      ]}
    >
      <BlurView
        intensity={resolvedIntensity}
        tint="dark"
        experimentalBlurMethod="dimezisBlurView"
        style={styles.blur}
      >
        <View
          style={[
            styles.inner,
            {
              borderColor: hexToRgba(resolvedGlowColor, 0.16),
              backgroundColor: activeTheme.colors.card,
            },
            contentStyle,
          ]}
        >
          {children}
        </View>
      </BlurView>
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

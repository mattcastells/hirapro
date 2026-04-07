import { Animated, Pressable, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { useAppTheme } from '../../theme/AppThemeProvider';
import { hexToRgba, theme } from '../../theme/theme';
import { AppText } from '../ui/AppText';

export type AnswerOptionVisualState =
  | 'idle'
  | 'correct'
  | 'incorrect'
  | 'muted';

type AnswerOptionButtonProps = {
  label: string;
  visualState: AnswerOptionVisualState;
  disabled?: boolean;
  onPress: () => void;
  labelWrapStyle?: StyleProp<ViewStyle>;
};

export function AnswerOptionButton({
  label,
  visualState,
  disabled = false,
  onPress,
  labelWrapStyle,
}: AnswerOptionButtonProps) {
  const { theme: activeTheme, mode } = useAppTheme();
  const isDark = mode === 'dark';
  const successTone = '#59F271';
  const errorTone = '#FF6B5B';

  const tone =
    visualState === 'correct'
      ? successTone
      : visualState === 'incorrect'
        ? errorTone
        : activeTheme.colors.accentBlue;

  const isMuted = visualState === 'muted';
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [styles.wrap, pressed && !disabled ? styles.pressed : null]}
    >
      <View
        style={[
          styles.container,
          {
            borderColor:
              visualState === 'idle'
                ? isDark
                  ? hexToRgba(activeTheme.colors.white, 0.28)
                  : hexToRgba(activeTheme.colors.black, 0.15)
                : visualState === 'muted'
                  ? isDark
                    ? hexToRgba(activeTheme.colors.white, 0.12)
                    : hexToRgba(activeTheme.colors.black, 0.08)
                  : tone,
            backgroundColor:
              visualState === 'muted'
                ? isDark
                  ? hexToRgba(activeTheme.colors.white, 0.02)
                  : hexToRgba(activeTheme.colors.black, 0.02)
                : isDark
                  ? hexToRgba(activeTheme.colors.white, 0.04)
                  : hexToRgba(activeTheme.colors.white, 0.45),
          },
        ]}
      >
        <Animated.View style={labelWrapStyle}>
          <AppText
            variant="option"
            color={
              isMuted
                ? activeTheme.colors.textMuted
                : activeTheme.colors.textPrimary
            }
            style={styles.label}
            numberOfLines={1}
          >
            {label}
          </AppText>
        </Animated.View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '48%',
    minWidth: 0,
    marginBottom: theme.spacing.sm,
  },
  container: {
    minHeight: 64,
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  label: {
    fontSize: 16,
    lineHeight: 20,
    textAlign: 'center',
  },
  pressed: {
    opacity: 0.9,
  },
});

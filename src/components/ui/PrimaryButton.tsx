import { ReactNode } from 'react';
import {
  Platform,
  Pressable,
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';

import { hexToRgba, theme } from '../../theme/theme';
import { useAppTheme } from '../../theme/AppThemeProvider';
import { AppText } from './AppText';

type ButtonVariant = 'primary' | 'accent' | 'secondary' | 'ghost';

type PrimaryButtonProps = {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: 'default' | 'compact';
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  icon?: ReactNode;
  textStyle?: StyleProp<TextStyle>;
};

export function PrimaryButton({
  title,
  onPress,
  variant = 'primary',
  size = 'default',
  disabled = false,
  style,
  icon,
  textStyle,
}: PrimaryButtonProps) {
  const { theme: activeTheme } = useAppTheme();
  const isPrimary = variant === 'primary';
  const isAccent = variant === 'accent';
  const isSecondary = variant === 'secondary';
  const isCompact = size === 'compact';
  const androidSurfaceOpacity = Platform.OS === 'android' ? 0.92 : 0.34;
  const androidSecondaryOpacity = Platform.OS === 'android' ? 0.88 : 0.28;
  const androidGhostOpacity = Platform.OS === 'android' ? 0.82 : 0.12;

  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.buttonWrap,
        styles.focusReset,
        isPrimary || isAccent
          ? {
              shadowColor: activeTheme.colors.accentBlue,
              shadowOpacity: isAccent ? 0.34 : 0.22,
              shadowRadius: isAccent ? 24 : 18,
              elevation: isAccent ? 14 : 10,
            }
          : styles.flatWrap,
        style,
        pressed && !disabled ? styles.pressed : null,
        disabled ? styles.disabled : null,
      ]}
    >
      {isPrimary || isAccent ? (
        <View
          style={[
            styles.fill,
            isCompact ? styles.compactFill : null,
            isAccent
              ? {
                  backgroundColor: activeTheme.colors.accentBlue,
                  borderColor: hexToRgba(activeTheme.colors.accentCyan, 0.8),
                }
              : {
                  backgroundColor: hexToRgba(
                    activeTheme.colors.backgroundSecondary,
                    androidSurfaceOpacity,
                  ),
                  borderColor: activeTheme.colors.accentBlue,
                },
          ]}
        >
          <View style={styles.row}>
            {icon}
            <AppText
              variant="overline"
              color={
                isAccent ? activeTheme.colors.background : activeTheme.colors.accentBlue
              }
              style={[styles.buttonText, isCompact ? styles.compactText : null, textStyle]}
              numberOfLines={1}
            >
              {title}
            </AppText>
          </View>
        </View>
      ) : (
        <View
          style={[
            styles.fill,
            isCompact ? styles.compactFill : null,
            isSecondary ? styles.secondaryFill : styles.ghostFill,
            isSecondary
              ? {
                  backgroundColor: hexToRgba(
                    activeTheme.colors.backgroundSecondary,
                    androidSecondaryOpacity,
                  ),
                  borderColor: activeTheme.colors.line,
                }
              : {
                  backgroundColor: hexToRgba(
                    activeTheme.colors.backgroundSecondary,
                    androidGhostOpacity,
                  ),
                  borderColor: activeTheme.colors.line,
                },
          ]}
        >
          <View style={styles.row}>
            {icon}
            <AppText
              variant="overline"
              color={
                isSecondary
                  ? activeTheme.colors.textPrimary
                  : activeTheme.colors.textSecondary
              }
              style={[styles.buttonText, isCompact ? styles.compactText : null, textStyle]}
              numberOfLines={1}
            >
              {title}
            </AppText>
          </View>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  buttonWrap: {
    borderRadius: theme.radii.pill,
    overflow: 'visible',
    shadowOffset: { width: 0, height: 10 },
  },
  focusReset: {
    outlineWidth: 0,
    outlineColor: 'transparent',
  },
  flatWrap: {
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  fill: {
    minHeight: 58,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
    borderRadius: theme.radii.pill,
    borderWidth: 1,
    overflow: 'hidden',
  },
  compactFill: {
    minHeight: 46,
    paddingHorizontal: 12,
  },
  secondaryFill: {
  },
  ghostFill: {
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.xs,
    width: '100%',
    minWidth: 0,
  },
  buttonText: {
    flexShrink: 1,
    textAlign: 'center',
    fontSize: 10,
    lineHeight: 12,
    letterSpacing: 1.15,
  },
  compactText: {
    fontSize: 9,
    lineHeight: 10,
    letterSpacing: 1.35,
  },
  pressed: {
    opacity: 0.88,
  },
  disabled: {
    opacity: 0.45,
  },
});

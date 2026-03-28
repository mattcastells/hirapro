import { ReactNode } from 'react';
import { StyleProp, StyleSheet, Text, TextStyle } from 'react-native';

import { theme, TextVariant } from '../../theme/theme';
import { useAppTheme } from '../../theme/AppThemeProvider';

type AppTextProps = {
  children: ReactNode;
  variant?: TextVariant;
  color?: string;
  style?: StyleProp<TextStyle>;
  numberOfLines?: number;
};

const variantStyles = StyleSheet.create(theme.typography);

export function AppText({
  children,
  variant = 'body',
  color,
  style,
  numberOfLines,
}: AppTextProps) {
  const { theme: activeTheme } = useAppTheme();

  return (
    <Text
      numberOfLines={numberOfLines}
      style={[
        variantStyles[variant],
        { color: color ?? activeTheme.colors.textPrimary },
        style,
      ]}
    >
      {children}
    </Text>
  );
}

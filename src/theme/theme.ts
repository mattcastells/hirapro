import { ImageSourcePropType, TextStyle } from 'react-native';

export type ThemeMode = 'dark' | 'light';

const darkColors = {
  background: '#253340',
  backgroundSecondary: '#1A242F',
  backgroundTertiary: '#121A22',
  card: 'rgba(25, 31, 38, 0.76)',
  cardStrong: 'rgba(16, 20, 27, 0.9)',
  textPrimary: '#F5F7FB',
  textSecondary: '#D2D8E1',
  textMuted: '#929DAE',
  line: 'rgba(255, 255, 255, 0.08)',
  lineStrong: 'rgba(24, 186, 255, 0.34)',
  accentBlue: '#14B7FF',
  accentCyan: '#4FD6FF',
  accentGreen: '#47C59C',
  accentPink: '#FF7FC5',
  accentOrange: '#E7B367',
  success: '#37C589',
  error: '#FF7D88',
  warning: '#E8B464',
  black: '#000000',
  white: '#FFFFFF',
};

const lightColors: typeof darkColors = {
  background: '#E6EEF6',
  backgroundSecondary: '#F2F6FA',
  backgroundTertiary: '#DAE4EE',
  card: 'rgba(255, 255, 255, 0.62)',
  cardStrong: 'rgba(255, 255, 255, 0.84)',
  textPrimary: '#0F1D2B',
  textSecondary: '#2E4A5E',
  textMuted: '#3D5A6E',
  line: 'rgba(0, 0, 0, 0.07)',
  lineStrong: 'rgba(219, 112, 170, 0.40)',
  accentBlue: '#1A9AD0',
  accentCyan: '#2DB0D4',
  accentGreen: '#36A87C',
  accentPink: '#D86CA6',
  accentOrange: '#CC8E58',
  success: '#30A872',
  error: '#D45462',
  warning: '#CC8E58',
  black: '#000000',
  white: '#FFFFFF',
};

const colors = darkColors;

const sharedTheme = {
  spacing: {
    xxs: 4,
    xs: 8,
    sm: 12,
    md: 16,
    lg: 20,
    xl: 24,
    xxl: 32,
    xxxl: 40,
  },
  radii: {
    sm: 14,
    md: 20,
    lg: 28,
    xl: 36,
    pill: 999,
  },
  typography: {
    overline: {
      fontFamily: 'Sora_600SemiBold',
      fontSize: 11,
      lineHeight: 14,
      letterSpacing: 1.5,
      textTransform: 'uppercase',
    } satisfies TextStyle,
    label: {
      fontFamily: 'Sora_600SemiBold',
      fontSize: 12,
      lineHeight: 16,
      letterSpacing: 1,
    } satisfies TextStyle,
    bodySmall: {
      fontFamily: 'Manrope_500Medium',
      fontSize: 13,
      lineHeight: 18,
    } satisfies TextStyle,
    body: {
      fontFamily: 'Manrope_500Medium',
      fontSize: 15,
      lineHeight: 22,
    } satisfies TextStyle,
    bodyStrong: {
      fontFamily: 'Manrope_700Bold',
      fontSize: 15,
      lineHeight: 22,
    } satisfies TextStyle,
    title: {
      fontFamily: 'Sora_600SemiBold',
      fontSize: 18,
      lineHeight: 24,
    } satisfies TextStyle,
    headline: {
      fontFamily: 'Sora_600SemiBold',
      fontSize: 24,
      lineHeight: 30,
    } satisfies TextStyle,
    display: {
      fontFamily: 'Sora_700Bold',
      fontSize: 32,
      lineHeight: 38,
    } satisfies TextStyle,
    kana: {
      fontFamily: 'Sora_600SemiBold',
      fontSize: 60,
      lineHeight: 68,
    } satisfies TextStyle,
    option: {
      fontFamily: 'Sora_600SemiBold',
      fontSize: 22,
      lineHeight: 28,
    } satisfies TextStyle,
  },
};

export const theme = {
  ...sharedTheme,
  colors,
};

export type AppTheme = typeof theme & { mode: ThemeMode };
export type TextVariant = keyof typeof theme.typography;

export type BackgroundChoice = {
  id: string;
  label: string;
  source: ImageSourcePropType;
};

const darkBackground: BackgroundChoice = {
  id: 'background-dark',
  label: 'Bosque oscuro',
  source: require('../../assets/background-1.jpg'),
};

const lightBackground: BackgroundChoice = {
  id: 'background-light',
  label: 'Sakura',
  source: require('../../assets/light-theme-bg.jpg'),
};

export function createTheme(mode: ThemeMode = 'dark'): AppTheme {
  return {
    ...sharedTheme,
    colors: mode === 'dark' ? darkColors : lightColors,
    mode,
  };
}

export function getBackgroundForMode(mode: ThemeMode): BackgroundChoice {
  return mode === 'dark' ? darkBackground : lightBackground;
}

export function hexToRgba(hex: string, alpha: number) {
  const normalized = hex.replace('#', '');
  const value =
    normalized.length === 3
      ? normalized
          .split('')
          .map((character) => `${character}${character}`)
          .join('')
      : normalized;

  const red = Number.parseInt(value.slice(0, 2), 16);
  const green = Number.parseInt(value.slice(2, 4), 16);
  const blue = Number.parseInt(value.slice(4, 6), 16);

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

import { StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { useAppTheme } from '../../theme/AppThemeProvider';
import { hexToRgba, theme } from '../../theme/theme';
import { AppText } from '../ui/AppText';

type FeedbackBannerProps = {
  status: 'idle' | 'correct' | 'incorrect';
  promptText?: string;
  correctRomaji: string;
  selectedRomaji?: string | null;
};

export function FeedbackBanner({
  status,
  promptText,
  correctRomaji,
  selectedRomaji,
}: FeedbackBannerProps) {
  const { theme: activeTheme } = useAppTheme();
  const successTone = '#59F271';
  const errorTone = '#FF6B5B';

  const tone =
    status === 'correct'
      ? successTone
      : status === 'incorrect'
        ? errorTone
        : activeTheme.colors.lineStrong;

  const promptWithRomaji = promptText
    ? `${promptText} - ${correctRomaji}`
    : correctRomaji;

  const message =
    status === 'correct'
      ? `Correcto: ${promptWithRomaji}`
      : `"${selectedRomaji ?? 'Esa silaba'}" no era correcta. Respuesta: "${promptWithRomaji}"`;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: 'transparent',
          borderColor:
            status === 'idle'
              ? activeTheme.colors.line
              : hexToRgba(tone, 0.48),
          shadowColor: tone,
          shadowOpacity: status === 'idle' ? 0 : 0.16,
          shadowRadius: status === 'idle' ? 0 : 12,
        },
      ]}
    >
      {status === 'idle' ? null : (
        <>
          <MaterialCommunityIcons
            name={status === 'correct' ? 'check-circle-outline' : 'close-circle-outline'}
            size={16}
            color={tone}
          />
          <AppText variant="bodySmall" color={activeTheme.colors.white} style={styles.text}>
            {message}
          </AppText>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    minHeight: 44,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    shadowOffset: { width: 0, height: 0 },
  },
  text: {
    flex: 1,
    fontSize: 11,
    lineHeight: 14,
  },
});

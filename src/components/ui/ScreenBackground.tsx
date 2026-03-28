import { ReactNode } from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { BottomNavBar } from './BottomNavBar';
import { hexToRgba, theme } from '../../theme/theme';
import { useAppTheme } from '../../theme/AppThemeProvider';

type BottomNavActiveKey = 'home' | 'options' | 'none';

type ScreenBackgroundProps = {
  children: ReactNode;
  scrollable?: boolean;
  contentContainerStyle?: StyleProp<ViewStyle>;
  keyboardShouldPersistTaps?: 'never' | 'always' | 'handled';
  bottomOverlay?: ReactNode;
  showBottomNav?: boolean;
  bottomNavActive?: BottomNavActiveKey;
};

export function ScreenBackground({
  children,
  scrollable = true,
  contentContainerStyle,
  keyboardShouldPersistTaps = 'handled',
  bottomOverlay,
  showBottomNav = true,
  bottomNavActive = 'none',
}: ScreenBackgroundProps) {
  const { theme: activeTheme, backgroundChoice } = useAppTheme();
  const insets = useSafeAreaInsets();
  const backgroundBlurRadius = Platform.OS === 'android' ? 2 : 6;
  const backgroundImageOpacity = Platform.OS === 'android' ? 0.82 : 0.72;
  const backgroundScrimOpacity = Platform.OS === 'android' ? 0.42 : 0.54;
  const gradientColors: [string, string, string] =
    Platform.OS === 'android'
      ? [
          'rgba(18, 31, 44, 0.14)',
          'rgba(16, 27, 36, 0.22)',
          'rgba(12, 19, 26, 0.5)',
        ]
      : [
          'rgba(18, 31, 44, 0.22)',
          'rgba(16, 27, 36, 0.28)',
          'rgba(12, 19, 26, 0.58)',
        ];
  const resolvedBottomOverlay =
    bottomOverlay ??
    (showBottomNav ? (
      <BottomNavBar
        items={[
          {
            id: 'back',
            label: 'Atras',
            icon: 'arrow-left',
          },
          {
            id: 'home',
            label: 'Inicio',
            icon: 'home-variant-outline',
            active: bottomNavActive === 'home',
          },
          {
            id: 'options',
            label: 'Opciones',
            icon: 'tune-variant',
            active: bottomNavActive === 'options',
          },
        ]}
      />
    ) : null);
  const bottomOverlayPadding = resolvedBottomOverlay
    ? 82 + Math.max(insets.bottom, 6)
    : 0;
  const contentStyle = [
    styles.content,
    resolvedBottomOverlay ? { paddingBottom: bottomOverlayPadding } : null,
    contentContainerStyle,
  ];

  return (
    <View style={[styles.root, { backgroundColor: activeTheme.colors.background }]}>
      <>
        <Image
          source={backgroundChoice.source}
          style={[
            StyleSheet.absoluteFill,
            styles.backgroundImage,
            { opacity: backgroundImageOpacity },
          ]}
          resizeMode="cover"
          blurRadius={backgroundBlurRadius}
        />
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: hexToRgba(
                activeTheme.colors.backgroundSecondary,
                backgroundScrimOpacity,
              ),
            },
          ]}
        />
        <LinearGradient
          colors={gradientColors}
          locations={[0, 0.45, 1]}
          style={StyleSheet.absoluteFill}
        />
      </>

      <SafeAreaView
        style={styles.safeArea}
        edges={['top', 'right', 'left', 'bottom']}
      >
        {scrollable ? (
          <ScrollView
            bounces={false}
            alwaysBounceVertical={false}
            alwaysBounceHorizontal={false}
            horizontal={false}
            overScrollMode="never"
            contentOffset={{ x: 0, y: 0 }}
            keyboardShouldPersistTaps={keyboardShouldPersistTaps}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={contentStyle}
          >
            {children}
          </ScrollView>
        ) : (
          <View style={contentStyle}>{children}</View>
        )}

        {resolvedBottomOverlay ? (
          <View pointerEvents="box-none" style={styles.bottomOverlayWrap}>
            {resolvedBottomOverlay}
          </View>
        ) : null}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    overflow: 'hidden',
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    width: '100%',
    maxWidth: '100%',
    minWidth: 0,
    overflow: 'hidden',
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.xl,
  },
  bottomOverlayWrap: {
    ...StyleSheet.absoluteFillObject,
  },
  backgroundImage: {
  },
});

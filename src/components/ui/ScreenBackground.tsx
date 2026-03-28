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
import { BlurView } from 'expo-blur';
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
  bottomOverlay?: ReactNode;
  showBottomNav?: boolean;
  bottomNavActive?: BottomNavActiveKey;
};

export function ScreenBackground({
  children,
  scrollable = true,
  contentContainerStyle,
  bottomOverlay,
  showBottomNav = true,
  bottomNavActive = 'none',
}: ScreenBackgroundProps) {
  const { theme: activeTheme, backgroundChoice } = useAppTheme();
  const insets = useSafeAreaInsets();
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
          style={StyleSheet.absoluteFill}
          resizeMode="cover"
          blurRadius={Platform.OS === 'web' ? 0 : 16}
        />
        <Image
          source={backgroundChoice.source}
          style={[StyleSheet.absoluteFill, styles.containedImage]}
          resizeMode="contain"
        />
        <BlurView
          intensity={Platform.OS === 'web' ? 18 : 24}
          tint="dark"
          style={StyleSheet.absoluteFill}
        />
        <LinearGradient
          colors={[
            'rgba(22, 32, 44, 0.44)',
            'rgba(18, 25, 31, 0.52)',
            'rgba(14, 18, 24, 0.74)',
          ]}
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
  containedImage: {
    opacity: 0.16,
  },
});

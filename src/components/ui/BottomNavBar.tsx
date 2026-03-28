import { Pressable, StyleSheet, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import { useAppTheme } from '../../theme/AppThemeProvider';
import { hexToRgba, theme } from '../../theme/theme';
import { RootStackParamList } from '../../types/navigation';
import { AppText } from './AppText';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type BottomNavItem = {
  id: string;
  label: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  active?: boolean;
  onPress?: () => void;
};

type BottomNavBarProps = {
  items: BottomNavItem[];
};

export function BottomNavBar({ items }: BottomNavBarProps) {
  const { theme: activeTheme } = useAppTheme();
  const insets = useSafeAreaInsets();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View pointerEvents="box-none" style={styles.wrap}>
      <BlurView
        intensity={72}
        tint="dark"
        style={[
          styles.bar,
          {
            backgroundColor: hexToRgba(activeTheme.colors.black, 0.34),
            borderColor: hexToRgba(activeTheme.colors.white, 0.08),
            shadowColor: activeTheme.colors.black,
            paddingBottom: Math.max(insets.bottom, 6),
          },
        ]}
      >
        {items.map((item) => (
          <Pressable
            key={item.id}
            onPress={
              item.onPress ??
              (() => {
                if (item.id === 'back') {
                  if (navigation.canGoBack()) {
                    navigation.goBack();
                    return;
                  }

                  navigation.navigate('Home');
                  return;
                }

                if (item.id === 'home') {
                  navigation.navigate('Home');
                }
              })
            }
            style={({ pressed }) => [
              styles.item,
              styles.focusReset,
              pressed ? styles.pressed : null,
            ]}
          >
            <MaterialCommunityIcons
              name={item.icon}
              size={20}
              color={
                item.active
                  ? activeTheme.colors.white
                  : activeTheme.colors.textSecondary
              }
            />
            <AppText
              variant="label"
              color={
                item.active
                  ? activeTheme.colors.white
                  : activeTheme.colors.textSecondary
              }
              style={styles.label}
            >
              {item.label}
            </AppText>
          </Pressable>
        ))}
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  bar: {
    minHeight: 62,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    borderWidth: 1,
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.xs,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.14,
    shadowRadius: 16,
    elevation: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    minHeight: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  focusReset: {
    outlineWidth: 0,
    outlineColor: 'transparent',
  },
  label: {
    fontSize: 9,
    lineHeight: 10,
    letterSpacing: 0.2,
  },
  pressed: {
    opacity: 0.86,
  },
});

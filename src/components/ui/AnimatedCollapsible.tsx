import { ReactNode, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  LayoutAnimation,
  Platform,
  StyleProp,
  UIManager,
  View,
  ViewStyle,
} from 'react-native';

type AnimatedCollapsibleProps = {
  expanded: boolean;
  children: ReactNode;
  duration?: number;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
};

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export function AnimatedCollapsible({
  expanded,
  children,
  duration = 220,
  style,
  contentStyle,
}: AnimatedCollapsibleProps) {
  const progress = useRef(new Animated.Value(expanded ? 1 : 0)).current;
  const [isMounted, setIsMounted] = useState(expanded);

  useEffect(() => {
    let isCancelled = false;
    progress.stopAnimation();

    if (expanded) {
      LayoutAnimation.configureNext(
        LayoutAnimation.create(
          duration,
          LayoutAnimation.Types.easeInEaseOut,
          LayoutAnimation.Properties.opacity,
        ),
      );
      setIsMounted(true);
      progress.setValue(0);

      Animated.timing(progress, {
        toValue: 1,
        duration,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();

      return () => {
        isCancelled = true;
        progress.stopAnimation();
      };
    }

    Animated.timing(progress, {
      toValue: 0,
      duration: Math.max(140, duration - 40),
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (!finished || isCancelled) {
        return;
      }

      LayoutAnimation.configureNext(
        LayoutAnimation.create(
          duration,
          LayoutAnimation.Types.easeInEaseOut,
          LayoutAnimation.Properties.opacity,
        ),
      );
      setIsMounted(false);
    });

    return () => {
      isCancelled = true;
      progress.stopAnimation();
    };
  }, [duration, expanded, progress]);

  if (!isMounted) {
    return null;
  }

  return (
    <Animated.View
      pointerEvents={expanded ? 'auto' : 'none'}
      style={[
        style,
        {
          opacity: progress,
          transform: [
            {
              translateY: progress.interpolate({
                inputRange: [0, 1],
                outputRange: [-8, 0],
              }),
            },
          ],
        },
      ]}
    >
      <View style={contentStyle}>
        {children}
      </View>
    </Animated.View>
  );
}

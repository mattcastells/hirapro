import { ReactNode, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  LayoutChangeEvent,
  StyleProp,
  StyleSheet,
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

export function AnimatedCollapsible({
  expanded,
  children,
  duration = 220,
  style,
  contentStyle,
}: AnimatedCollapsibleProps) {
  const progress = useRef(new Animated.Value(expanded ? 1 : 0)).current;
  const [contentHeight, setContentHeight] = useState(0);

  useEffect(() => {
    Animated.timing(progress, {
      toValue: expanded ? 1 : 0,
      duration,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [duration, expanded, progress]);

  const handleLayout = ({ nativeEvent }: LayoutChangeEvent) => {
    const nextHeight = nativeEvent.layout.height;

    if (!nextHeight) {
      return;
    }

    setContentHeight((currentHeight) =>
      Math.abs(currentHeight - nextHeight) > 1 ? nextHeight : currentHeight,
    );
  };

  if (!contentHeight && expanded) {
    return (
      <View style={style}>
        <View onLayout={handleLayout} style={contentStyle}>
          {children}
        </View>
      </View>
    );
  }

  return (
    <Animated.View
      pointerEvents={expanded ? 'auto' : 'none'}
      style={[
        styles.container,
        style,
        {
          height: progress.interpolate({
            inputRange: [0, 1],
            outputRange: [0, Math.max(contentHeight, 1)],
          }),
          opacity: progress.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
          }),
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
      <View onLayout={handleLayout} style={contentStyle}>
        {children}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
});

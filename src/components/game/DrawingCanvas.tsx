import React, { useCallback, useRef } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';
import Svg, { Circle, G, Path, Text as SvgText } from 'react-native-svg';

import { CharacterStroke } from '../../data/hiraganaStrokes';
import { useAppTheme } from '../../theme/AppThemeProvider';
import { hexToRgba, theme } from '../../theme/theme';
import { DrawingPoint } from '../../features/game/drawingGameEngine';

type DrawingCanvasProps = {
  size: number;
  ghostCharacter: string;
  guideStrokes: CharacterStroke[];
  userStrokes: DrawingPoint[][];
  currentStroke: DrawingPoint[];
  disabled: boolean;
  onStrokeStart: (point: DrawingPoint) => void;
  onStrokeUpdate: (point: DrawingPoint) => void;
  onStrokeEnd: () => void;
};

function pointsToSmoothPath(points: DrawingPoint[]): string {
  if (points.length === 0) return '';
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

  let d = `M ${points[0].x} ${points[0].y}`;

  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const midX = (prev.x + curr.x) / 2;
    const midY = (prev.y + curr.y) / 2;
    d += ` Q ${prev.x} ${prev.y} ${midX} ${midY}`;
  }

  const last = points[points.length - 1];
  d += ` L ${last.x} ${last.y}`;

  return d;
}

function guideStrokeToPath(stroke: CharacterStroke, size: number): string {
  const points = stroke.map(([x, y]) => ({
    x: (x / 100) * size,
    y: (y / 100) * size,
  }));

  return pointsToSmoothPath(points);
}

export function DrawingCanvas({
  size,
  ghostCharacter,
  guideStrokes,
  userStrokes,
  currentStroke,
  disabled,
  onStrokeStart,
  onStrokeUpdate,
  onStrokeEnd,
}: DrawingCanvasProps) {
  const { theme: activeTheme, mode } = useAppTheme();
  const isDark = mode === 'dark';

  const callbacksRef = useRef({ onStrokeStart, onStrokeUpdate, onStrokeEnd });
  callbacksRef.current = { onStrokeStart, onStrokeUpdate, onStrokeEnd };

  const dispatchStart = useCallback((x: number, y: number) => {
    const clampedX = Math.max(0, Math.min(size, x));
    const clampedY = Math.max(0, Math.min(size, y));
    callbacksRef.current.onStrokeStart({ x: clampedX, y: clampedY });
  }, [size]);

  const dispatchUpdate = useCallback((x: number, y: number) => {
    const clampedX = Math.max(0, Math.min(size, x));
    const clampedY = Math.max(0, Math.min(size, y));
    callbacksRef.current.onStrokeUpdate({ x: clampedX, y: clampedY });
  }, [size]);

  const dispatchEnd = useCallback(() => {
    callbacksRef.current.onStrokeEnd();
  }, []);

  const pan = Gesture.Pan()
    .minDistance(0)
    .shouldCancelWhenOutside(false)
    .enabled(!disabled)
    .onStart((e) => {
      'worklet';
      runOnJS(dispatchStart)(e.x, e.y);
    })
    .onUpdate((e) => {
      'worklet';
      runOnJS(dispatchUpdate)(e.x, e.y);
    })
    .onEnd(() => {
      'worklet';
      runOnJS(dispatchEnd)();
    });

  const guideStrokeColor = isDark
    ? hexToRgba(activeTheme.colors.white, 0.12)
    : hexToRgba(activeTheme.colors.black, 0.10);
  const guideBubbleColor = hexToRgba(activeTheme.colors.accentBlue, 0.55);
  const userStrokeColor = isDark
    ? hexToRgba(activeTheme.colors.white, 0.88)
    : hexToRgba(activeTheme.colors.black, 0.75);
  const currentStrokeColor = activeTheme.colors.accentCyan;
  const ghostColor = isDark
    ? hexToRgba(activeTheme.colors.white, 0.07)
    : hexToRgba(activeTheme.colors.black, 0.06);

  return (
    <GestureDetector gesture={pan}>
      <View
        collapsable={false}
        style={[
          styles.canvas,
          {
            width: size,
            height: size,
            backgroundColor: hexToRgba(activeTheme.colors.backgroundTertiary, 0.96),
            borderColor: hexToRgba(activeTheme.colors.white, 0.03),
          },
        ]}
      >
        <Text
          style={[
            styles.ghostText,
            {
              fontSize: size * 0.72,
              lineHeight: size * 0.82,
              color: ghostColor,
            },
          ]}
        >
          {ghostCharacter}
        </Text>

        <Svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          style={StyleSheet.absoluteFill}
        >
          {guideStrokes.map((stroke, index) => (
            <G key={`guide-${index}`}>
              <Path
                d={guideStrokeToPath(stroke, size)}
                stroke={guideStrokeColor}
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
              <Circle
                cx={(stroke[0][0] / 100) * size}
                cy={(stroke[0][1] / 100) * size}
                r={9}
                fill={guideBubbleColor}
              />
              <SvgText
                x={(stroke[0][0] / 100) * size}
                y={(stroke[0][1] / 100) * size + 4}
                textAnchor="middle"
                fill="white"
                fontSize={10}
                fontWeight="bold"
              >
                {String(index + 1)}
              </SvgText>
            </G>
          ))}

          {userStrokes.map((stroke, index) => (
            <Path
              key={`user-${index}`}
              d={pointsToSmoothPath(stroke)}
              stroke={userStrokeColor}
              strokeWidth={4}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          ))}

          {currentStroke.length > 0 && (
            <Path
              d={pointsToSmoothPath(currentStroke)}
              stroke={currentStrokeColor}
              strokeWidth={4}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          )}
        </Svg>
      </View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  canvas: {
    borderRadius: theme.radii.md,
    borderWidth: 1,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ghostText: {
    position: 'absolute',
    fontFamily: Platform.OS === 'web' ? 'Sora_700Bold' : undefined,
    fontWeight: '700',
    textAlign: 'center',
    includeFontPadding: false,
  },
});

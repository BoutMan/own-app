import { useRef, useState } from 'react';
import { PanResponder, Pressable, StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { Txt } from '@/components';
import { colors } from '@/theme';

type SignaturePadProps = {
  onChange: (signed: boolean) => void;
  height?: number;
};

/** Finger signature for the contract. Strokes stay on the device; only "signed" leaves this component. */
export function SignaturePad({ onChange, height = 64 }: SignaturePadProps) {
  const [strokes, setStrokes] = useState<string[]>([]);
  const current = useRef('');

  const responder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderTerminationRequest: () => false,
      onPanResponderGrant: (e) => {
        const { locationX: x, locationY: y } = e.nativeEvent;
        current.current = `M${x.toFixed(1)} ${y.toFixed(1)}`;
        setStrokes((s) => [...s, current.current]);
      },
      onPanResponderMove: (e) => {
        const { locationX: x, locationY: y } = e.nativeEvent;
        current.current += ` L${x.toFixed(1)} ${y.toFixed(1)}`;
        const d = current.current;
        setStrokes((s) => [...s.slice(0, -1), d]);
      },
      onPanResponderRelease: () => onChange(true),
    }),
  ).current;

  const clear = () => {
    setStrokes([]);
    onChange(false);
  };

  return (
    <View style={styles.wrap}>
      <View style={[styles.pad, { height }]} {...responder.panHandlers} accessibilityLabel="Signature area">
        <Svg width="100%" height="100%" pointerEvents="none">
          {strokes.map((d, i) => (
            <Path key={i} d={d} stroke={colors.ink} strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          ))}
        </Svg>
      </View>
      <View style={styles.footer}>
        {strokes.length > 0 ? (
          <Pressable accessibilityRole="button" onPress={clear} hitSlop={8}>
            <Txt variant="small" color={colors.grey} style={{ textDecorationLine: 'underline' }}>
              Clear
            </Txt>
          </Pressable>
        ) : (
          <View />
        )}
        <Txt variant="small" color={colors.grey}>
          {strokes.length > 0 ? 'Signed' : 'Sign here with your finger'}
        </Txt>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { borderTopWidth: 1, borderTopColor: colors.line, paddingTop: 8, gap: 4 },
  pad: { width: '100%' },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});

import { useRef, useState } from 'react';
import { PanResponder, Pressable, StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { Txt } from '@/components';
import { colors } from '@/theme';

type SignaturePadProps = {
  /** Called on each finished stroke with every stroke so far (SVG paths). */
  onChange: (signed: boolean, strokes: string[]) => void;
  height?: number;
};

/** Finger signature for the contract. Strokes are kept with the contract, on the device only. */
export function SignaturePad({ onChange, height = 64 }: SignaturePadProps) {
  const [strokes, setStrokes] = useState<string[]>([]);
  const current = useRef('');
  const all = useRef<string[]>([]);

  const responder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderTerminationRequest: () => false,
      onPanResponderGrant: (e) => {
        const { locationX: x, locationY: y } = e.nativeEvent;
        current.current = `M${x.toFixed(1)} ${y.toFixed(1)}`;
        all.current = [...all.current, current.current];
        setStrokes(all.current);
      },
      onPanResponderMove: (e) => {
        const { locationX: x, locationY: y } = e.nativeEvent;
        current.current += ` L${x.toFixed(1)} ${y.toFixed(1)}`;
        all.current = [...all.current.slice(0, -1), current.current];
        setStrokes(all.current);
      },
      onPanResponderRelease: () => onChange(true, all.current),
    }),
  ).current;

  const clear = () => {
    all.current = [];
    setStrokes([]);
    onChange(false, []);
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

import { StyleSheet, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { Txt } from '@/components';
import { colors, tones } from '@/theme';

import { formatClock } from './runner';

const SIZE = 76;
const R = 33;
const C = 2 * Math.PI * R;

/** Circular rest countdown: cocoa arc on a translucent white track. */
export function RestRing({ secondsLeft, total }: { secondsLeft: number; total: number }) {
  const ratio = total > 0 ? secondsLeft / total : 0;
  return (
    <View style={styles.wrap} accessibilityLabel={`Rest, ${secondsLeft} seconds left`}>
      <Svg width={SIZE} height={SIZE}>
        <Circle cx={SIZE / 2} cy={SIZE / 2} r={R} fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth={4} />
        <Circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={R}
          fill="none"
          stroke={colors.cocoa}
          strokeWidth={4}
          strokeLinecap="round"
          strokeDasharray={`${C * ratio} ${C}`}
          transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
        />
      </Svg>
      <View style={StyleSheet.absoluteFill}>
        <View style={styles.center}>
          <Txt variant="h2" size={20} color={tones.mocha.strong} style={{ letterSpacing: 0 }}>
            {formatClock(secondsLeft)}
          </Txt>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: SIZE, height: SIZE },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});

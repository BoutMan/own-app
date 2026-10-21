import { Pressable, StyleSheet, View } from 'react-native';

import { colors, radius } from '@/theme';

import { Txt } from './Txt';

type StepperProps = {
  label: string;
  value: string;
  onMinus: () => void;
  onPlus: () => void;
  /** Accessible name of the value, e.g. "12 reps". */
  accessibilityValue?: string;
};

/** Compact − value + control for reps, seconds and loads during a session. */
export function Stepper({ label, value, onMinus, onPlus, accessibilityValue }: StepperProps) {
  return (
    <View style={styles.wrap} accessibilityLabel={`${label}: ${accessibilityValue ?? value}`}>
      <Txt variant="small" color={colors.grey}>
        {label}
      </Txt>
      <View style={styles.row}>
        <Pressable accessibilityRole="button" accessibilityLabel={`Less ${label.toLowerCase()}`} onPress={onMinus} hitSlop={6} style={styles.btn}>
          <Txt variant="h2" size={20} style={{ letterSpacing: 0, lineHeight: 22 }}>
            −
          </Txt>
        </Pressable>
        <Txt variant="cardTitle" style={styles.value} numberOfLines={1}>
          {value}
        </Txt>
        <Pressable accessibilityRole="button" accessibilityLabel={`More ${label.toLowerCase()}`} onPress={onPlus} hitSlop={6} style={styles.btn}>
          <Txt variant="h2" size={20} style={{ letterSpacing: 0, lineHeight: 22 }}>
            +
          </Txt>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, gap: 6 },
  row: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.mist, borderRadius: radius.pill, padding: 4 },
  btn: { width: 38, height: 38, borderRadius: 19, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center' },
  value: { flex: 1, textAlign: 'center' },
});

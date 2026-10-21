import { StyleSheet, View } from 'react-native';

import { colors } from '@/theme';

type SeasonBarProps = {
  /** Weeks fully done (black segments). */
  weeksDone: number;
  /** Progress inside the current week, 0–1 (cocoa sliver). */
  currentWeekProgress?: number;
  weeks?: number;
};

/** Twelve 8px segments: done weeks in ink, the current one partly cocoa, the rest hairline. */
export function SeasonBar({ weeksDone, currentWeekProgress = 0, weeks = 12 }: SeasonBarProps) {
  return (
    <View
      style={styles.row}
      accessibilityRole="progressbar"
      accessibilityLabel={`Week ${weeksDone + 1} of ${weeks}`}
      accessibilityValue={{ min: 0, max: weeks, now: weeksDone }}
    >
      {Array.from({ length: weeks }, (_, i) => (
        <View key={i} style={[styles.segment, i < weeksDone && { backgroundColor: colors.ink }]}>
          {i === weeksDone && currentWeekProgress > 0 ? (
            <View style={[styles.partial, { width: `${Math.min(1, currentWeekProgress) * 100}%` }]} />
          ) : null}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 4 },
  segment: { flex: 1, height: 8, borderRadius: 4, backgroundColor: colors.line, overflow: 'hidden' },
  partial: { height: 8, backgroundColor: colors.cocoa },
});

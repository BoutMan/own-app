import { StyleSheet, View } from 'react-native';

import { tones, type Tone } from '@/theme';

import { Txt } from './Txt';

export type Stat = { value: string; label: string; tone: Tone };

/** Row of three tone tiles: big number + label. */
export function StatTiles({ stats }: { stats: readonly Stat[] }) {
  return (
    <View style={styles.row}>
      {stats.map((s) => (
        <View key={s.label} style={[styles.tile, { backgroundColor: tones[s.tone].bg }]}>
          <Txt variant="stat" color={tones[s.tone].strong}>
            {s.value}
          </Txt>
          <Txt variant="small" color={tones[s.tone].soft}>
            {s.label}
          </Txt>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 8 },
  tile: { flex: 1, borderRadius: 22, paddingVertical: 16, paddingHorizontal: 14, gap: 4 },
});

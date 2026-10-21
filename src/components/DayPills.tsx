import { Pressable, StyleSheet, View } from 'react-native';

import { colors, radius } from '@/theme';

import { Txt } from './Txt';

export type WeekDay = {
  key: string;
  /** "Mon" */
  weekday: string;
  /** "20" */
  date: string;
  /** Colour of the activity dot, if any (strength, zone 2 walk, check-in…). */
  dot?: string;
};

type WeekStripProps = {
  days: readonly WeekDay[];
  selectedKey: string;
  onSelect?: (key: string) => void;
};

/** Seven 68px day pills (Today). Selected day is black. */
export function WeekStrip({ days, selectedKey, onSelect }: WeekStripProps) {
  return (
    <View style={styles.strip}>
      {days.map((d) => {
        const active = d.key === selectedKey;
        return (
          <Pressable
            key={d.key}
            accessibilityRole="button"
            accessibilityLabel={`${d.weekday} ${d.date}`}
            accessibilityState={{ selected: active }}
            onPress={() => onSelect?.(d.key)}
            style={[styles.day, { backgroundColor: active ? colors.ink : colors.mist }]}
          >
            <Txt variant="tab" weight={active ? 500 : 400} color={active ? colors.white : colors.grey}>
              {d.weekday}
            </Txt>
            <Txt variant="h2" size={20} color={active ? colors.white : colors.ink} style={{ letterSpacing: -0.6, lineHeight: 22 }}>
              {d.date}
            </Txt>
            <View
              style={[
                styles.dot,
                d.dot ? { backgroundColor: active && d.dot === colors.cocoa ? colors.cocoaLight : d.dot } : null,
              ]}
            />
          </Pressable>
        );
      })}
    </View>
  );
}

type DayCirclesProps = {
  /** Seven single-letter labels, Monday first. */
  labels?: readonly string[];
  selected: readonly number[];
  onToggle?: (index: number) => void;
};

/** 32px day circles used to pick training days (Settings, onboarding "Your dates"). */
export function DayCircles({ labels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'], selected, onToggle }: DayCirclesProps) {
  return (
    <View style={styles.circles}>
      {labels.map((l, i) => {
        const on = selected.includes(i);
        return (
          <Pressable
            key={i}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: on }}
            onPress={() => onToggle?.(i)}
            style={[styles.circle, { backgroundColor: on ? colors.ink : colors.white }]}
          >
            <Txt variant="small" weight={on ? 600 : 400} color={on ? colors.white : colors.grey}>
              {l}
            </Txt>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  strip: { flexDirection: 'row', gap: 6 },
  day: { flex: 1, height: 68, borderRadius: radius.dayPill, alignItems: 'center', justifyContent: 'center', gap: 3 },
  dot: { width: 5, height: 5, borderRadius: 2.5 },
  circles: { flexDirection: 'row', gap: 5 },
  circle: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
});

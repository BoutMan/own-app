import { Pressable, StyleSheet, View } from 'react-native';

import { colors, radius, size } from '@/theme';

import { Txt } from './Txt';

type SegmentedControlProps<T extends string> = {
  options: readonly { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  /** Background the control sits on: white track on mist rows, mist track on white screens. */
  surface?: 'white' | 'mist';
  /** Full-width variant with equal 40px segments (guided session). */
  stretch?: boolean;
};

/** Pill track with a black active segment (Home / Gym, lb / kg). */
export function SegmentedControl<T extends string>({ options, value, onChange, surface = 'mist', stretch }: SegmentedControlProps<T>) {
  return (
    <View
      accessibilityRole="tablist"
      style={[styles.track, { backgroundColor: surface === 'mist' ? colors.white : colors.mist }, stretch && { padding: 4 }]}
    >
      {options.map((o) => {
        const active = o.value === value;
        return (
          <Pressable
            key={o.value}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            onPress={() => onChange(o.value)}
            style={[styles.segment, stretch && styles.segmentStretch, active && styles.segmentActive]}
          >
            <Txt variant="meta" size={stretch ? 14 : 13} weight={stretch && active ? 500 : 400} color={active ? colors.white : colors.grey}>
              {o.label}
            </Txt>
          </Pressable>
        );
      })}
    </View>
  );
}

type SwitchProps = { value: boolean; onChange: (value: boolean) => void; accessibilityLabel: string };

/** 46×28 switch: black when on, disabled grey when off. */
export function Switch({ value, onChange, accessibilityLabel }: SwitchProps) {
  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ checked: value }}
      onPress={() => onChange(!value)}
      style={[styles.switch, { backgroundColor: value ? colors.ink : colors.disabled }]}
    >
      <View style={[styles.knob, { alignSelf: value ? 'flex-end' : 'flex-start' }]} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  track: { flexDirection: 'row', borderRadius: radius.pill, padding: 3 },
  segment: { paddingVertical: 5, paddingHorizontal: 12, borderRadius: radius.pill },
  segmentStretch: { flex: 1, height: 40, alignItems: 'center', justifyContent: 'center' },
  segmentActive: { backgroundColor: colors.ink },
  switch: {
    width: size.switchW,
    height: size.switchH,
    borderRadius: size.switchH / 2,
    padding: 3,
    justifyContent: 'center',
  },
  knob: { width: 22, height: 22, borderRadius: 11, backgroundColor: colors.white },
});

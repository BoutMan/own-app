import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, radius } from '@/theme';

import { Txt } from './Txt';

type PillProps = {
  label: string;
  /** Active pills are the only black pills. */
  active?: boolean;
  /** Small coloured dot before the label (cocoa by default). */
  dot?: boolean | string;
  /** `mist` for pills on white backgrounds, `white` on photos or mist surfaces. */
  surface?: 'white' | 'mist';
  size?: 'sm' | 'md';
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

export function Pill({ label, active, dot, surface = 'white', size = 'md', onPress, style }: PillProps) {
  const bg = active ? colors.ink : surface === 'mist' ? colors.mist : colors.white;
  const fg = active ? colors.white : colors.ink;
  const dotColor = typeof dot === 'string' ? dot : colors.cocoa;
  const content = (
    <View style={[styles.pill, size === 'sm' ? styles.sm : styles.md, { backgroundColor: bg }, style]}>
      {dot ? <View style={[styles.dot, { backgroundColor: dotColor }]} /> : null}
      <Txt variant="small" weight={600} size={size === 'sm' ? 12 : 13} color={fg} numberOfLines={1}>
        {label}
      </Txt>
    </View>
  );
  if (!onPress) return content;
  return (
    <Pressable accessibilityRole="button" accessibilityState={{ selected: active }} onPress={onPress}>
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    paddingHorizontal: 12,
    borderRadius: radius.pill,
  },
  sm: { height: 26, paddingHorizontal: 10 },
  md: { height: 28 },
  dot: { width: 6, height: 6, borderRadius: 3 },
});

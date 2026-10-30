import { Pressable, StyleSheet } from 'react-native';

import { colors, size } from '@/theme';

import { Icon, type IconName } from './Icon';

type CircleButtonProps = {
  icon: IconName;
  accessibilityLabel: string;
  onPress?: () => void;
  /** `mist` on white screens, `white` on photos. */
  surface?: 'mist' | 'white';
  /** On state (a saved move): black with a white icon, like an active pill. */
  active?: boolean;
};

/** 44px round button: back, close, settings, share. */
export function CircleButton({ icon, accessibilityLabel, onPress, surface = 'mist', active }: CircleButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      {...(active !== undefined ? { accessibilityState: { selected: active } } : {})}
      hitSlop={6}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: active ? colors.ink : surface === 'mist' ? colors.mist : 'rgba(255,255,255,0.92)' },
        pressed && { opacity: 0.7 },
      ]}
    >
      <Icon name={icon} size={18} strokeWidth={1.8} color={active ? colors.white : colors.ink} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: size.circleButton,
    height: size.circleButton,
    borderRadius: size.circleButton / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

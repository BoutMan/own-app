import { Pressable, StyleSheet } from 'react-native';

import { colors, size } from '@/theme';

import { Icon, type IconName } from './Icon';

type CircleButtonProps = {
  icon: IconName;
  accessibilityLabel: string;
  onPress?: () => void;
  /** `mist` on white screens, `white` on photos. */
  surface?: 'mist' | 'white';
};

/** 44px round button: back, close, settings, share. */
export function CircleButton({ icon, accessibilityLabel, onPress, surface = 'mist' }: CircleButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      hitSlop={6}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: surface === 'mist' ? colors.mist : 'rgba(255,255,255,0.92)' },
        pressed && { opacity: 0.7 },
      ]}
    >
      <Icon name={icon} size={18} strokeWidth={1.8} />
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

import type { StyleProp, TextStyle } from 'react-native';

import { colors } from '@/theme';

import { Txt } from './Txt';

type LogoProps = { color?: string; size?: number; style?: StyleProp<TextStyle> };

/** "own." — lowercase, 700, tight tracking. */
export function Logo({ color = colors.ink, size, style }: LogoProps) {
  return (
    <Txt variant="logo" size={size} color={color} style={style} accessibilityLabel="own">
      own.
    </Txt>
  );
}

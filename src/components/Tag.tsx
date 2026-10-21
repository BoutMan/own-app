import { View } from 'react-native';

import { colors, radius, tones, type Tone } from '@/theme';

import { Txt } from './Txt';

type TagProps = { label: string; tone?: Tone; weight?: 500 | 600 };

/** 26px tone chip for classifying (muscles, weekdays). Mist with ink text when no tone is given. */
export function Tag({ label, tone, weight = 500 }: TagProps) {
  return (
    <View
      style={{
        height: 26,
        paddingHorizontal: 10,
        borderRadius: radius.pill,
        backgroundColor: tone ? tones[tone].bg : colors.mist,
        justifyContent: 'center',
      }}
    >
      <Txt variant="small" weight={weight} color={tone ? tones[tone].soft : colors.ink} numberOfLines={1}>
        {label}
      </Txt>
    </View>
  );
}

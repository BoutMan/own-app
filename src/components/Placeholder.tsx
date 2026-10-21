import { router } from 'expo-router';
import type { ReactNode } from 'react';
import { View } from 'react-native';

import { colors } from '@/theme';

import { CircleButton } from './CircleButton';
import { Screen } from './Screen';
import { Heading, Txt } from './Txt';

type PlaceholderProps = {
  title: string;
  accent: string;
  /** Mockup number, e.g. "17". */
  screen: string;
  /** When it lands, e.g. "milestone 1" or "V1". */
  phase?: string;
  /** Show a back button (pushed screens). */
  back?: boolean;
  children?: ReactNode;
};

/** Temporary body for screens that are not built yet, so every link in the app leads somewhere. */
export function Placeholder({ title, accent, screen, phase = 'milestone 1', back, children }: PlaceholderProps) {
  return (
    <Screen contentStyle={{ paddingHorizontal: 20 }}>
      {back ? <CircleButton icon="chevronLeft" accessibilityLabel="Back" onPress={() => router.back()} /> : null}
      <View style={{ gap: 6 }}>
        <Heading variant="h1" accent={accent}>
          {title}
        </Heading>
        <Txt variant="meta" color={colors.grey}>
          {`Mockup ${screen} — coming in ${phase}.`}
        </Txt>
      </View>
      {children}
    </Screen>
  );
}

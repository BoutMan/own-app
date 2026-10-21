import type { ReactNode } from 'react';
import { View } from 'react-native';

import { colors } from '@/theme';

import { Screen } from './Screen';
import { Heading, Txt } from './Txt';

type PlaceholderProps = { title: string; accent: string; screen: string; children?: ReactNode };

/** Temporary body for tabs whose screen is not built yet. Removed screen by screen in milestone 1. */
export function Placeholder({ title, accent, screen, children }: PlaceholderProps) {
  return (
    <Screen contentStyle={{ paddingHorizontal: 20 }}>
      <View style={{ gap: 6 }}>
        <Heading variant="h1" accent={accent}>
          {title}
        </Heading>
        <Txt variant="meta" color={colors.grey}>
          {`Mockup ${screen} — coming in milestone 1.`}
        </Txt>
      </View>
      {children}
    </Screen>
  );
}

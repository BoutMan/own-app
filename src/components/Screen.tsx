import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, space } from '@/theme';

type ScreenProps = {
  children: ReactNode;
  /** Pad the top with the safe area (off for screens opening on a full-bleed PhotoHeader). */
  padTop?: boolean;
  /** Gap between direct children. */
  gap?: number;
  contentStyle?: StyleProp<ViewStyle>;
};

/** Scrollable white screen with the 20px horizontal gutter of the mockups. */
export function Screen({ children, padTop = true, gap = space.sectionGap, contentStyle }: ScreenProps) {
  const insets = useSafeAreaInsets();
  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={[
        { paddingTop: padTop ? insets.top + 12 : 0, paddingBottom: 28, gap },
        contentStyle,
      ]}
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  );
}

/** Horizontal gutter for content below a PhotoHeader. */
export function Gutter({ children, gap = space.sectionGap }: { children: ReactNode; gap?: number }) {
  return <View style={{ paddingHorizontal: space.screenX, gap }}>{children}</View>;
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.white },
});

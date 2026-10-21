import { Image, type ImageContentPosition, type ImageSource } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, photoHeader, radius } from '@/theme';

type PhotoHeaderProps = {
  source: ImageSource;
  height: number;
  /** Focal point, e.g. `{ top: '35%', left: '50%' }` for CSS "center 35%". */
  focus?: ImageContentPosition;
  /** Top bar content (logo, round buttons). Laid out space-between. */
  top?: ReactNode;
  /** Bottom block: pill, eyebrow, white title, CTA. */
  children?: ReactNode;
  /** Full-bleed variant used by Splash: no rounded bottom corners. */
  fullBleed?: boolean;
};

/**
 * Full-width photo with rounded bottom corners, inner white hairline frame and a dark gradient
 * at the bottom so white titles stay readable. Used on Today, Session complete, Programme, Me…
 */
export function PhotoHeader({ source, height, focus = 'center', top, children, fullBleed }: PhotoHeaderProps) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.wrap, { height }, !fullBleed && styles.rounded]}>
      <Image source={source} style={StyleSheet.absoluteFill} contentFit="cover" contentPosition={focus} />
      <LinearGradient
        colors={photoHeader.gradient}
        locations={photoHeader.gradientStops}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />
      <View pointerEvents="none" style={styles.frame} />
      {top ? <View style={[styles.top, { top: Math.max(insets.top, 20) + 8 }]}>{top}</View> : null}
      {children ? <View style={styles.bottom}>{children}</View> : null}
    </View>
  );
}

const inset = photoHeader.frameInset;

const styles = StyleSheet.create({
  wrap: { width: '100%', overflow: 'hidden', backgroundColor: colors.nightCard },
  rounded: { borderBottomLeftRadius: radius.heroBottom, borderBottomRightRadius: radius.heroBottom },
  frame: {
    position: 'absolute',
    top: inset,
    left: inset,
    right: inset,
    bottom: inset,
    borderWidth: 1,
    borderColor: photoHeader.frameColor,
    borderRadius: radius.heroFrame,
  },
  top: {
    position: 'absolute',
    left: 28,
    right: 28,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },
  bottom: { position: 'absolute', left: 28, right: 28, bottom: 26, gap: 8 },
});

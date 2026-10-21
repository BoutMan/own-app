import type { ReactNode } from 'react';
import { Platform } from 'react-native';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';

/** iPhone 15 safe areas, in points. */
const IPHONE_INSETS = { top: 47, bottom: 34, left: 0, right: 0 };

declare global {
  // Set by scripts/build-preview.mjs when the web preview draws a device frame.
  var __OWN_PREVIEW_FRAME__: boolean | undefined;
}

/**
 * In the framed web preview there is no real notch or home indicator, so screens would hug the
 * edges. This feeds iPhone-like insets to `useSafeAreaInsets` there. No effect on iOS/Android.
 */
export function PreviewInsets({ children }: { children: ReactNode }) {
  if (Platform.OS !== 'web' || !globalThis.__OWN_PREVIEW_FRAME__) return <>{children}</>;
  return <SafeAreaInsetsContext.Provider value={IPHONE_INSETS}>{children}</SafeAreaInsetsContext.Provider>;
}

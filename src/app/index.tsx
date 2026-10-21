import { Image } from 'expo-image';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef } from 'react';
import { Animated, Easing, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Logo, Txt } from '@/components';
import { photos } from '@/content/photos';
import { colors } from '@/theme';

const SPLASH_MS = 1800;

/** 01 · Splash. Full-bleed photo, "own." logo, loading bar. Goes to Welcome (Today once onboarding is persisted). */
export default function Splash() {
  const insets = useSafeAreaInsets();
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const anim = Animated.timing(progress, {
      toValue: 1,
      duration: SPLASH_MS,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    });
    anim.start(({ finished }) => {
      // TODO(milestone 4): route to Today when onboarding is already completed.
      if (finished) router.replace('/welcome');
    });
    return () => anim.stop();
  }, [progress]);

  return (
    <Pressable style={styles.root} onPress={() => router.replace('/welcome')} accessibilityLabel="Skip intro">
      <StatusBar style="light" />
      <Image source={photos.splashGirl} style={StyleSheet.absoluteFill} contentFit="cover" contentPosition={{ top: '40%', left: '50%' }} />
      <View pointerEvents="none" style={styles.frame} />
      <View style={[styles.topRow, { top: Math.max(insets.top, 44) + 14 }]}>
        <Txt variant="eyebrow" color={colors.white} style={styles.wide}>
          Season 01
        </Txt>
        <Txt variant="eyebrow" color={colors.white} style={styles.wide}>
          12 weeks
        </Txt>
      </View>
      <View style={[styles.bottom, { bottom: Math.max(insets.bottom, 20) + 34 }]}>
        <View style={styles.logoRow}>
          <Logo color={colors.white} size={104} style={styles.logo} />
          <Txt variant="meta" color={colors.white} style={styles.tagline}>
            {'your body,\nyour season'}
          </Txt>
        </View>
        <View style={styles.track}>
          <Animated.View
            style={[styles.bar, { width: progress.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }) }]}
          />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#2A2A2A' },
  logo: { letterSpacing: -7.8, lineHeight: 84 },
  frame: {
    position: 'absolute',
    top: 14,
    left: 14,
    right: 14,
    bottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.55)',
    borderRadius: 30,
  },
  topRow: { position: 'absolute', left: 34, right: 34, flexDirection: 'row', justifyContent: 'space-between' },
  wide: { letterSpacing: 2.64 },
  bottom: { position: 'absolute', left: 30, right: 30, gap: 18 },
  logoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  tagline: { textAlign: 'right', paddingBottom: 8, lineHeight: 17.5 },
  track: { height: 2, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.3)', overflow: 'hidden' },
  bar: { height: 2, backgroundColor: colors.white },
});

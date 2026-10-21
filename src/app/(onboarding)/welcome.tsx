import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CTA, Heading, Logo, PhotoTile, Txt } from '@/components';
import { photos } from '@/content/photos';
import { colors, space } from '@/theme';

const pillars = [
  { n: '01', title: 'Move', text: '3 guided strength sessions a week, home or gym' },
  { n: '02', title: 'Rest', text: 'Recovery and rituals that follow your cycle' },
  { n: '03', title: 'Fuel', text: 'Protein made simple, no calorie counting' },
] as const;

/** 02 · Welcome. Three pillars, photo mosaic, "Start my season". */
export default function Welcome() {
  const insets = useSafeAreaInsets();
  // TODO(milestone 1): "Start my season" opens onboarding 1/7 (Feel) once it exists.
  const start = () => router.replace('/(tabs)');
  return (
    <View style={[styles.root, { paddingTop: insets.top + 12, paddingBottom: Math.max(insets.bottom, 16) + 16 }]}>
      <StatusBar style="dark" />
      <View style={styles.topBar}>
        <Logo />
        <Pressable accessibilityRole="link" onPress={() => router.replace('/(tabs)')} hitSlop={10}>
          <Txt variant="body" size={14} color={colors.grey}>
            Log in
          </Txt>
        </Pressable>
      </View>

      <View style={styles.mosaic}>
        <PhotoTile source={photos.morningWalk} label="Move" height={270} rounded={24} focus={{ top: '30%', left: '50%' }} style={{ flex: 1.15 }} />
        <View style={styles.mosaicCol}>
          <PhotoTile source={photos.sheetMask} label="Rest" height={131} rounded={24} focus={{ top: '25%', left: '50%' }} />
          <PhotoTile source={photos.eggsAvocado} label="Fuel" height={131} rounded={24} />
        </View>
      </View>

      <View style={{ gap: 8 }}>
        <Txt variant="eyebrow" size={13} color={colors.cocoa} style={{ letterSpacing: 1.82 }}>
          Welcome to own.
        </Txt>
        <Heading variant="h1" size={38} accent="yours.">
          Get strong, sleep better, feel yours.
        </Heading>
      </View>

      <View>
        {pillars.map((p, i) => (
          <View key={p.n} style={[styles.pillar, i === pillars.length - 1 && styles.pillarLast]}>
            <Txt variant="meta" weight={700} color={colors.cocoa} style={styles.pillarNum}>
              {p.n}
            </Txt>
            <View style={{ gap: 2, flex: 1 }}>
              <Txt variant="bodyStrong">{p.title}</Txt>
              <Txt variant="meta" color={colors.grey}>
                {p.text}
              </Txt>
            </View>
          </View>
        ))}
      </View>

      <CTA label="Start my season" onPress={start} style={{ marginTop: 'auto' }} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.white, paddingHorizontal: space.screenX, gap: 20 },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  mosaic: { flexDirection: 'row', gap: 8, height: 270, flexShrink: 1 },
  mosaicCol: { flex: 1, gap: 8 },
  pillar: { flexDirection: 'row', gap: 14, paddingVertical: 10, borderTopWidth: 1, borderTopColor: colors.line },
  pillarLast: { borderBottomWidth: 1, borderBottomColor: colors.line },
  pillarNum: { width: 20, paddingTop: 1 },
});

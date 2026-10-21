import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CircleButton, CTA, Gauge, Gutter, Heading, Pill, Screen, StatTiles, ToneCard, Txt, type IconName } from '@/components';
import { photos } from '@/content/photos';
import { colors, photoHeader, radius, type Tone } from '@/theme';

// The five baseline tests of the guide (p. 14). Values are mockup examples until tests are logged.
const tests: { label: string; detail: string; delta: string; day0: number; now: number; tone: Tone; icon: IconName }[] = [
  { label: 'Push-ups · knees', detail: '3 → 7 reps', delta: '+4', day0: 30, now: 70, tone: 'vanilla', icon: 'dumbbell' },
  { label: 'Plank', detail: '25 s → 48 s', delta: '+23 s', day0: 42, now: 80, tone: 'mauve', icon: 'plankMark' },
  { label: 'Squats in 60 s', detail: '18 → 26', delta: '+8', day0: 60, now: 87, tone: 'latte', icon: 'stairs' },
  { label: 'Wall sit', detail: '30 s → 55 s', delta: '+25 s', day0: 50, now: 92, tone: 'fog', icon: 'timer' },
  { label: 'Brisk walk', detail: '15 → 25 min', delta: '+10 min', day0: 50, now: 83, tone: 'vanilla', icon: 'walk' },
];

/** 22 · Block review — side-by-side photos (private), tests vs day 0, your words, next block. */
export default function BlockReview() {
  const insets = useSafeAreaInsets();
  return (
    <Screen padTop={false}>
      <StatusBar style="light" />
      <View style={styles.hero}>
        <View style={styles.pair}>
          <Image source={photos.kettlebellPink} style={styles.half} contentFit="cover" />
          <Image source={photos.kettlebellPink2} style={styles.half} contentFit="cover" />
        </View>
        <LinearGradient colors={photoHeader.gradient} locations={photoHeader.gradientStops} style={StyleSheet.absoluteFill} pointerEvents="none" />
        <View pointerEvents="none" style={styles.frame} />
        <View style={[styles.top, { top: Math.max(insets.top, 20) + 8 }]}>
          <CircleButton icon="chevronLeft" surface="white" accessibilityLabel="Back" onPress={() => router.back()} />
          <Pill label="Day 30" dot size="sm" />
        </View>
        <View style={styles.labels}>
          <Pill label="Day 0" />
          <Pill label="Day 30" active />
        </View>
        <View style={styles.bottom}>
          <Heading variant="hero" size={52} on="photo" accent="done." style={{ letterSpacing: -3.12, lineHeight: 48 }}>
            {'Block one,\ndone.'}
          </Heading>
          <Txt variant="body" size={14} color="rgba(255,255,255,0.9)">
            Photos stay private. Only you see this comparison.
          </Txt>
        </View>
      </View>

      <Gutter>
        <Txt variant="body" size={16}>
          11 sessions out of 12.{' '}
          <Txt variant="body" size={16} color={colors.grey}>
            The first month builds the habit; the second builds the body.
          </Txt>
        </Txt>

        <StatTiles
          stats={[
            { value: '11/12', label: 'sessions kept', tone: 'vanilla' },
            { value: '+23 s', label: 'plank hold', tone: 'mauve' },
            { value: '7/10', label: 'sleep, from 5', tone: 'fog' },
          ]}
        />

        <View style={{ gap: 8 }}>
          <View style={styles.rowBetween}>
            <Heading variant="h2" accent="tests">
              Your tests
            </Heading>
            <Txt variant="meta" color={colors.grey}>
              Day 0 → Day 30
            </Txt>
          </View>
          {tests.map((t) => (
            <Gauge key={t.label} label={t.label} detail={t.detail} percent={t.now} baseline={t.day0} tone={t.tone} icon={t.icon} value={t.delta} />
          ))}
        </View>

        <View style={{ gap: 10 }}>
          <Heading variant="h2" accent="words">
            Your words
          </Heading>
          <ToneCard tone="latte" icon="sparkle" eyebrow="What changed most" title="I sleep through the night again" text="Your answer, day 30" />
          <ToneCard tone="fog" icon="repeat" eyebrow="One change for block 2" title="Clothes out the night before, every time" text="We'll remind you at 9 pm" />
        </View>

        <View style={styles.next}>
          <Image source={photos.gymMachineSelfie} style={StyleSheet.absoluteFill} contentFit="cover" />
          <LinearGradient colors={photoHeader.gradient} locations={photoHeader.gradientStops} style={StyleSheet.absoluteFill} />
          <View style={styles.nextBody}>
            <Pill label="Next · weeks 5–8" dot size="sm" />
            <Heading variant="hero" size={32} on="photo" accent="Building" style={{ letterSpacing: -1.92, lineHeight: 30 }}>
              Block 2 · Building
            </Heading>
            <Txt variant="body" size={14} color="rgba(255,255,255,0.9)">
              Lower · Upper · Full body & cardio, 45 min
            </Txt>
          </View>
        </View>

        {/* TODO(milestone 5): unlocking block 2 depends on the real block state. */}
        <CTA label="Start block 2" onPress={() => router.navigate('/programme')} />
      </Gutter>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { height: 480, borderBottomLeftRadius: radius.heroBottom, borderBottomRightRadius: radius.heroBottom, overflow: 'hidden', backgroundColor: colors.white },
  pair: { flex: 1, flexDirection: 'row', gap: 3 },
  half: { flex: 1 },
  frame: { position: 'absolute', top: 12, left: 12, right: 12, bottom: 12, borderRadius: radius.heroFrame, borderWidth: 1, borderColor: photoHeader.frameColor },
  top: { position: 'absolute', left: 28, right: 28, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  labels: { position: 'absolute', top: 250, left: 28, right: 28, flexDirection: 'row', justifyContent: 'space-between' },
  bottom: { position: 'absolute', left: 28, right: 28, bottom: 26, gap: 8 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  next: { height: 220, borderRadius: 26, overflow: 'hidden' },
  nextBody: { position: 'absolute', left: 20, right: 20, bottom: 20, gap: 8 },
});

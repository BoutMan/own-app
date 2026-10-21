import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet, View } from 'react-native';

import { CircleButton, Gutter, Heading, Icon, PhotoHeader, Pill, QuoteCard, Screen, Txt, type IconName } from '@/components';
import { photos } from '@/content/photos';
import { useTodayPlan } from '@/features/season/today';
import type { Variant } from '@/features/session/playable';
import { tones, type Tone } from '@/theme';

type Case = { key: string; variant?: Variant; icon: IconName; tone: Tone; title: string; text: string; wide?: boolean };

// The seven cases of the guide (p. 55), worded as in the mockup.
const cases: Case[] = [
  { key: 'away', variant: 'away', icon: 'send', tone: 'fog', title: "I'm away for a few days", text: 'Session C with a band, plus a walk' },
  { key: 'ill', variant: 'ill', icon: 'ill', tone: 'mauve', title: "I'm ill", text: 'Above the neck: lighter. Below: rest.' },
  { key: 'period', variant: 'period', icon: 'water', tone: 'mocha', title: 'Period pain', text: 'Loads −20 %, core swapped for a walk' },
  { key: 'short', variant: 'short', icon: 'timer', tone: 'latte', title: 'Only 20 minutes', text: 'The first three exercises, in order' },
  { key: 'packed', variant: 'packed', icon: 'bars', tone: 'vanilla', title: 'The gym is packed', text: 'Home version of that line, no queue' },
  { key: 'no-kit', variant: 'noKit', icon: 'home', tone: 'fog', title: 'No equipment', text: 'Bodyweight, 3-1-1 tempo' },
  { key: 'break', icon: 'restart', tone: 'mauve', title: 'I stopped for 2+ weeks', text: 'Restart this block, loads −20 % for a week', wide: true },
];

/** 23 · My week is complicated — plan B in one tap. */
export default function LifeHappens() {
  const plan = useTodayPlan();
  const sessionC = plan.session.block ? `b${plan.session.block}-c` : 'b1-c';
  // Each case adapts today's session (guide p. 55). A 2+ week break is detected from the logs
  // (the block restarts by itself), so that card just explains it on the programme.
  const pick = (c: Case) => {
    if (c.key === 'break') return router.navigate('/programme');
    const id = c.key === 'away' ? sessionC : plan.session.id;
    router.push({ pathname: '/session/[id]', params: { id, variant: c.variant } });
  };
  return (
    <Screen padTop={false}>
      <StatusBar style="light" />
      <PhotoHeader
        source={photos.mealPrep}
        height={380}
        top={
          <>
            <CircleButton icon="close" surface="white" accessibilityLabel="Close" onPress={() => router.back()} />
            <Pill label="Plan B, in one tap" dot size="sm" />
          </>
        }
      >
        <Heading variant="hero" size={46} on="photo" accent="complicated" style={{ letterSpacing: -2.76, lineHeight: 43 }}>
          {'My week is\ncomplicated'}
        </Heading>
        <Txt variant="body" size={14} color="rgba(255,255,255,0.9)">
          {"Pick what's happening. We adapt the plan, you keep the promise."}
        </Txt>
      </PhotoHeader>

      <Gutter>
        <View style={{ gap: 12 }}>
          <Heading variant="h2" accent="happening">
            {"What's happening?"}
          </Heading>
          <View style={styles.grid}>
            {cases.map((c) => {
              const t = tones[c.tone];
              return (
                <Pressable
                  key={c.key}
                  accessibilityRole="button"
                  onPress={() => pick(c)}
                  style={[styles.case, { backgroundColor: t.bg }, c.wide ? styles.wide : styles.half]}
                >
                  <View style={styles.iconBox}>
                    <Icon name={c.icon} size={17} strokeWidth={1.8} color={t.soft} />
                  </View>
                  <View style={{ gap: 3, flex: c.wide ? 1 : undefined }}>
                    <Txt variant="bodyStrong" weight={700} color={t.strong} style={{ letterSpacing: -0.3, lineHeight: 18 }}>
                      {c.title}
                    </Txt>
                    <Txt variant="small" color={t.soft}>
                      {c.text}
                    </Txt>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>
        <QuoteCard quote="Never “I cancel”. Always “I reduce”." caption="A week at 60 % still counts" />
      </Gutter>
    </Screen>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  case: { borderRadius: 22, padding: 14, gap: 14 },
  half: { width: '48.8%' },
  wide: { width: '100%', flexDirection: 'row', alignItems: 'center' },
  iconBox: { width: 38, height: 38, borderRadius: 12, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' },
});

import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { CircleButton, CTA, Gauge, Gutter, Heading, Icon, PhotoHeader, Pill, Screen, Txt, type IconName } from '@/components';
import { photos } from '@/content/photos';
import { DotRating } from '@/features/onboarding/ui';
import { colors, fontFamilyFor, tones, type Tone } from '@/theme';

// Mock week until sessions are stored (milestone 3).
const week: { key: string; big: string; small: string; tone: Tone; done: 'full' | 'half' }[] = [
  { key: 'a', big: 'A', small: 'Anchor', tone: 'vanilla', done: 'full' },
  { key: 'b', big: 'B', small: 'Hinge', tone: 'latte', done: 'full' },
  { key: 'c', big: 'C', small: '10-min', tone: 'mauve', done: 'half' },
  { key: 'walk', big: 'Walk', small: 'Zone 2', tone: 'fog', done: 'full' },
];

const lastWeek = { Energy: 6, Sleep: 5, Mood: 7 } as const;
type Feeling = keyof typeof lastWeek;
const feelingMeta: Record<Feeling, { icon: IconName; tone: Tone }> = {
  Energy: { icon: 'bolt', tone: 'vanilla' },
  Sleep: { icon: 'moon', tone: 'fog' },
  Mood: { icon: 'smile', tone: 'mauve' },
};

const prompts: { key: string; label: string; icon: IconName; tone: Tone; placeholder: string }[] = [
  { key: 'win', label: 'Win of the week', icon: 'sparkle', tone: 'latte', placeholder: 'First goblet squat at 18 lb' },
  { key: 'stuck', label: 'What got stuck', icon: 'note', tone: 'mauve', placeholder: 'Friday: late meeting, only 10 min' },
  { key: 'adjust', label: "What I'm adjusting", icon: 'repeat', tone: 'fog', placeholder: 'Move C to Saturday morning' },
];

/** 21 · Sunday check-in — two minutes: the week, how it felt, three lines. */
export default function CheckIn() {
  const [ratings, setRatings] = useState<Record<Feeling, number | null>>({ Energy: null, Sleep: null, Mood: null });
  const [lines, setLines] = useState<Record<string, string>>({});

  return (
    <Screen padTop={false}>
      <StatusBar style="light" />
      <PhotoHeader
        source={photos.matchaBowl}
        height={420}
        focus={{ top: '40%', left: '50%' }}
        top={
          <>
            <CircleButton icon="close" surface="white" accessibilityLabel="Close" onPress={() => router.back()} />
            <Pill label="Week 3 · 2 minutes" dot size="sm" />
          </>
        }
      >
        <Txt variant="eyebrow" color="rgba(255,255,255,0.88)" style={{ letterSpacing: 1.44 }}>
          This Sunday
        </Txt>
        <Heading variant="hero" size={52} on="photo" accent="check-in" style={{ letterSpacing: -3.12, lineHeight: 48 }}>
          {'Sunday\ncheck-in'}
        </Heading>
        <Txt variant="body" size={14} color="rgba(255,255,255,0.9)">
          Look back for one minute, plan ahead for one.
        </Txt>
      </PhotoHeader>

      <Gutter>
        <View style={{ gap: 12 }}>
          <View style={styles.rowBetween}>
            <Heading variant="h2" accent="week">
              Your week
            </Heading>
            <Txt variant="meta" color={colors.grey}>
              3½ of 4
            </Txt>
          </View>
          <View style={styles.week}>
            {week.map((w) => {
              const t = tones[w.tone];
              return (
                <View key={w.key} style={[styles.weekTile, { backgroundColor: t.bg }]}>
                  <View style={[styles.weekCheck, w.done === 'half' && styles.weekHalf]}>
                    {w.done === 'full' ? <Icon name="check" size={11} strokeWidth={2.8} color={colors.white} /> : <View style={styles.halfFill} />}
                  </View>
                  <Txt variant="h2" size={w.big.length > 1 ? 17 : 26} color={t.strong}>
                    {w.big}
                  </Txt>
                  <Txt variant="small" color={t.soft}>
                    {w.small}
                  </Txt>
                </View>
              );
            })}
          </View>
        </View>

        <View style={{ gap: 10 }}>
          <View style={styles.rowBetween}>
            <Heading variant="h2" accent="it">
              How was it?
            </Heading>
            <Txt variant="meta" color={colors.grey}>
              vs last week
            </Txt>
          </View>
          {(Object.keys(lastWeek) as Feeling[]).map((f) => {
            const v = ratings[f];
            return v == null ? (
              <View key={f} style={styles.rateCard}>
                <DotRating label={f} value={null} onChange={(n) => setRatings((r) => ({ ...r, [f]: n }))} />
              </View>
            ) : (
              <Gauge
                key={f}
                label={f}
                detail={`Last week: ${lastWeek[f]}`}
                percent={v * 10}
                baseline={lastWeek[f] * 10}
                tone={feelingMeta[f].tone}
                icon={feelingMeta[f].icon}
                value={`${v}/10`}
              />
            );
          })}
        </View>

        <View style={{ gap: 10 }}>
          <Heading variant="h2" accent="line">
            In one line
          </Heading>
          {prompts.map((p) => {
            const t = tones[p.tone];
            return (
              <View key={p.key} style={[styles.prompt, { backgroundColor: t.bg }]}>
                <View style={styles.iconBox}>
                  <Icon name={p.icon} size={17} strokeWidth={1.8} color={t.soft} />
                </View>
                <View style={{ flex: 1, gap: 4 }}>
                  <Txt variant="eyebrow" color={t.soft} style={{ letterSpacing: 0.96 }}>
                    {p.label}
                  </Txt>
                  <TextInput
                    value={lines[p.key] ?? ''}
                    onChangeText={(text) => setLines((l) => ({ ...l, [p.key]: text }))}
                    placeholder={p.placeholder}
                    placeholderTextColor={colors.grey}
                    accessibilityLabel={p.label}
                    style={[styles.promptInput, { color: t.strong }]}
                  />
                </View>
              </View>
            );
          })}
        </View>

        <View style={styles.reassure}>
          <View style={styles.reassureIcon}>
            <Icon name="check" size={16} strokeWidth={2} />
          </View>
          <Txt variant="meta" style={{ flex: 1 }}>
            The 10-minute version counts. <Txt variant="meta" weight={600}>{"You haven't missed twice in a row."}</Txt>
          </Txt>
        </View>

        {/* TODO(milestone 5): store the check-in locally and feed the block review. */}
        <CTA label="Save my week" onPress={() => router.back()} />
      </Gutter>
    </Screen>
  );
}

const styles = StyleSheet.create({
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  week: { flexDirection: 'row', gap: 8 },
  weekTile: { flex: 1, borderRadius: 20, paddingTop: 14, paddingHorizontal: 12, paddingBottom: 12, gap: 14 },
  weekCheck: { position: 'absolute', top: 8, right: 8, width: 20, height: 20, borderRadius: 10, backgroundColor: colors.ink, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  weekHalf: { backgroundColor: 'rgba(255,255,255,0.8)', alignItems: 'flex-start' },
  halfFill: { width: 10, height: 20, backgroundColor: colors.ink },
  rateCard: { borderRadius: 20, borderWidth: 1, borderColor: colors.line, paddingHorizontal: 14, paddingVertical: 6 },
  prompt: { borderRadius: 22, paddingVertical: 14, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 14 },
  promptInput: { fontFamily: fontFamilyFor(700), fontSize: 17, letterSpacing: -0.34, padding: 0 },
  iconBox: { width: 38, height: 38, borderRadius: 12, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' },
  reassure: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, paddingHorizontal: 16, borderRadius: 22, backgroundColor: colors.mist },
  reassureIcon: { width: 34, height: 34, borderRadius: 11, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center' },
});

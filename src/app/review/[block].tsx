import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button, CircleButton, CTA, Gauge, Gutter, Heading, Pill, Screen, StatTiles, ToneCard, Txt, type IconName, type Stat } from '@/components';
import { photos } from '@/content/photos';
import { useDb } from '@/db/DbProvider';
import { recordMarkers, saveBlockReview } from '@/db/repositories';
import { baselineTests, blocks, markers as markerList, type BlockNumber, type TestId } from '@/domain/programme';
import { DotRating } from '@/features/onboarding/ui';
import { useProfile } from '@/features/profile/useProfile';
import { useBlockReview } from '@/features/review/blockReview';
import { formatDelta, formatTestValue } from '@/features/review/tests';
import { useSeason } from '@/features/season/currentWeek';
import { colors, fontFamilyFor, photoHeader, radius, tones, type Tone } from '@/theme';

const testStyle: Record<TestId, { label: string; tone: Tone; icon: IconName }> = {
  pushUps: { label: 'Push-ups', tone: 'vanilla', icon: 'dumbbell' },
  plank: { label: 'Plank', tone: 'mauve', icon: 'plankMark' },
  squats60: { label: 'Squats in 60 s', tone: 'latte', icon: 'stairs' },
  wallSit: { label: 'Wall sit', tone: 'fog', icon: 'timer' },
  walk: { label: 'Brisk walk', tone: 'vanilla', icon: 'walk' },
};
const WORD = { 1: 'one', 2: 'two', 3: 'three' } as const;
const DAY = { 1: 'Day 30', 2: 'Day 60', 3: 'Day 90' } as const;
const LINE = {
  1: 'The first month builds the habit; the second builds the body.',
  2: 'The habit is yours now. The last block turns strength into a result.',
  3: 'Twelve weeks. Look at what you built, then choose your next season.',
} as const;

/** 22 · Block review — tests vs day 0, the seven markers, your words, next block. Read from the device. */
export default function BlockReview() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ block: string }>();
  const n = (Number(params.block) >= 1 && Number(params.block) <= 3 ? Number(params.block) : 1) as BlockNumber;
  const season = useSeason();
  const r = useBlockReview(n, season.season);
  const { remindNightBefore } = useProfile();
  const { write } = useDb();
  const [draft, setDraft] = useState<{ changedMost: string; oneChange: string } | null>(null);
  const next = n < 3 ? blocks[n as 1 | 2] : null;

  // Gains since day 0: the biggest relative test gain and the biggest marker gain fill the tiles.
  const gains = baselineTests
    .filter((t) => r.tests.now[t.id] != null && r.tests.day0[t.id] != null)
    .map((t) => ({ t, delta: r.tests.now[t.id]! - r.tests.day0[t.id]!, ratio: (r.tests.now[t.id]! + 1) / (r.tests.day0[t.id]! + 1) }))
    .sort((a, b) => b.ratio - a.ratio);
  const markerGain = markerList
    .filter((m) => r.markers.now[m.id] != null && r.markers.day0[m.id] != null)
    .map((m) => ({ m, from: r.markers.day0[m.id]!, to: r.markers.now[m.id]! }))
    .sort((a, b) => b.to - b.from - (a.to - a.from))[0];
  const stats: Stat[] = [
    { value: `${r.sessionsKept}/12`, label: 'sessions kept', tone: 'vanilla' },
    gains[0]
      ? { value: formatDelta(gains[0].delta, gains[0].t.unit), label: testStyle[gains[0].t.id].label.toLowerCase(), tone: 'mauve' }
      : { value: '–', label: 'tests to take', tone: 'mauve' },
    markerGain
      ? { value: `${markerGain.to}/10`, label: `${markerGain.m.label.toLowerCase()}, from ${markerGain.from}`, tone: 'fog' }
      : { value: '–', label: 'markers to rate', tone: 'fog' },
  ];
  const testsTaken = Object.keys(r.tests.now).length > 0;

  return (
    <Screen padTop={false}>
      <StatusBar style="light" />
      <View style={styles.hero}>
        {/* TODO(milestone 5): the user's own day-0 and checkpoint photos from the vault, behind Face ID. */}
        <View style={styles.pair}>
          <Image source={photos.kettlebellPink} style={styles.half} contentFit="cover" />
          <Image source={photos.kettlebellPink2} style={styles.half} contentFit="cover" />
        </View>
        <LinearGradient colors={photoHeader.gradient} locations={photoHeader.gradientStops} style={StyleSheet.absoluteFill} pointerEvents="none" />
        <View pointerEvents="none" style={styles.frame} />
        <View style={[styles.top, { top: Math.max(insets.top, 20) + 8 }]}>
          <CircleButton icon="chevronLeft" surface="white" accessibilityLabel="Back" onPress={() => router.back()} />
          <Pill label={DAY[n]} dot size="sm" />
        </View>
        <View style={styles.labels}>
          <Pill label="Day 0" />
          <Pill label={DAY[n]} active />
        </View>
        <View style={styles.bottom}>
          <Heading variant="hero" size={52} on="photo" accent="done." style={{ letterSpacing: -3.12, lineHeight: 48 }}>
            {`Block ${WORD[n]},\ndone.`}
          </Heading>
          <Txt variant="body" size={14} color="rgba(255,255,255,0.9)">
            Photos stay private. Only you see this comparison.
          </Txt>
        </View>
      </View>

      <Gutter>
        <Txt variant="body" size={16}>
          {`${r.sessionsKept} ${r.sessionsKept === 1 ? 'session' : 'sessions'} out of 12. `}
          <Txt variant="body" size={16} color={colors.grey}>
            {LINE[n]}
          </Txt>
        </Txt>

        <StatTiles stats={stats} />

        <View style={{ gap: 8 }}>
          <View style={styles.rowBetween}>
            <Heading variant="h2" accent="tests">
              Your tests
            </Heading>
            <Txt variant="meta" color={colors.grey}>
              {`Day 0 → ${DAY[n]}`}
            </Txt>
          </View>
          {baselineTests.map((t) => {
            const now = r.tests.now[t.id];
            const before = r.tests.day0[t.id];
            if (now == null && before == null) return null;
            const scale = Math.max(now ?? 0, before ?? 0, 1) / 0.9;
            return (
              <Gauge
                key={t.id}
                label={testStyle[t.id].label}
                detail={now != null && before != null ? `${formatTestValue(before, t.unit)} → ${formatTestValue(now, t.unit)}` : before != null ? `Day 0: ${formatTestValue(before, t.unit)}` : formatTestValue(now!, t.unit)}
                percent={((now ?? 0) / scale) * 100}
                baseline={before != null ? (before / scale) * 100 : undefined}
                tone={testStyle[t.id].tone}
                icon={testStyle[t.id].icon}
                value={now != null && before != null ? formatDelta(now - before, t.unit) : now != null ? '' : 'to do'}
              />
            );
          })}
          <Button label={testsTaken ? 'Edit my tests' : 'Take the five tests'} variant="outline" onPress={() => router.push(`/tests/${r.checkpoint}`)} />
        </View>

        <View style={{ gap: 8 }}>
          <View style={styles.rowBetween}>
            <Heading variant="h2" accent="markers">
              Seven markers
            </Heading>
            <Txt variant="meta" color={colors.grey}>
              today, 1 to 10
            </Txt>
          </View>
          <View style={styles.markers}>
            {markerList.map((m) => (
              <DotRating
                key={m.id}
                label={r.markers.day0[m.id] != null ? `${m.label} · day 0: ${r.markers.day0[m.id]}` : m.label}
                value={r.markers.now[m.id] ?? null}
                onChange={(v) => r.season !== null && write((db) => recordMarkers(db, r.season!, r.checkpoint, { [m.id]: v }))}
              />
            ))}
          </View>
        </View>

        <View style={{ gap: 10 }}>
          <Heading variant="h2" accent="words">
            Your words
          </Heading>
          {r.words && !draft ? (
            <>
              <ToneCard tone="latte" icon="sparkle" eyebrow="What changed most" title={r.words.changedMost ?? '–'} text={`Your answer, ${DAY[n].toLowerCase()}`} />
              <ToneCard
                tone="fog"
                icon="repeat"
                eyebrow={next ? `One change for block ${n + 1}` : 'One change for next season'}
                title={r.words.oneChange ?? '–'}
                text={remindNightBefore ? 'Your night-before reminder is on' : 'Written down: that is half of it'}
              />
              <Button label="Rewrite" variant="outline" onPress={() => setDraft({ changedMost: r.words?.changedMost ?? '', oneChange: r.words?.oneChange ?? '' })} />
            </>
          ) : (
            <>
              {(
                [
                  { key: 'changedMost', label: 'What changed most', tone: 'latte', placeholder: 'I sleep through the night again' },
                  { key: 'oneChange', label: next ? `One change for block ${n + 1}` : 'One change for next season', tone: 'fog', placeholder: 'Clothes out the night before, every time' },
                ] as const
              ).map((f) => (
                <View key={f.key} style={[styles.prompt, { backgroundColor: tones[f.tone].bg }]}>
                  <Txt variant="eyebrow" color={tones[f.tone].soft} style={{ letterSpacing: 0.96 }}>
                    {f.label}
                  </Txt>
                  <TextInput
                    value={(draft ?? { changedMost: '', oneChange: '' })[f.key]}
                    onChangeText={(t) => setDraft((d) => ({ ...(d ?? { changedMost: '', oneChange: '' }), [f.key]: t }))}
                    placeholder={f.placeholder}
                    placeholderTextColor={colors.grey}
                    accessibilityLabel={f.label}
                    style={[styles.promptInput, { color: tones[f.tone].strong }]}
                  />
                </View>
              ))}
              <Button
                label="Save my words"
                variant="outline"
                disabled={r.season === null}
                onPress={() => {
                  const d = draft ?? { changedMost: '', oneChange: '' };
                  write((db) => saveBlockReview(db, r.season!, r.checkpoint, { changedMost: d.changedMost.trim() || null, oneChange: d.oneChange.trim() || null }));
                  setDraft(null);
                }}
              />
            </>
          )}
        </View>

        {next ? (
          <View style={styles.next}>
            <Image source={photos.gymMachineSelfie} style={StyleSheet.absoluteFill} contentFit="cover" />
            <LinearGradient colors={photoHeader.gradient} locations={photoHeader.gradientStops} style={StyleSheet.absoluteFill} />
            <View style={styles.nextBody}>
              <Pill label={`Next · weeks ${next.weeks[0]}–${next.weeks[3]}`} dot size="sm" />
              <Heading variant="hero" size={32} on="photo" accent={next.name} style={{ letterSpacing: -1.92, lineHeight: 30 }}>
                {`Block ${next.number} · ${next.name}`}
              </Heading>
              <Txt variant="body" size={14} color="rgba(255,255,255,0.9)">
                {next.summary}
              </Txt>
            </View>
          </View>
        ) : null}

        <CTA label={next ? `On to block ${next.number}` : 'Back to my season'} onPress={() => router.navigate(next ? '/programme' : '/(tabs)')} />
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
  markers: { borderRadius: 22, backgroundColor: colors.mist, paddingVertical: 10, paddingHorizontal: 14, gap: 4 },
  prompt: { borderRadius: 22, paddingVertical: 14, paddingHorizontal: 16, gap: 6 },
  promptInput: { fontFamily: fontFamilyFor(700), fontSize: 17, letterSpacing: -0.34, padding: 0 },
});

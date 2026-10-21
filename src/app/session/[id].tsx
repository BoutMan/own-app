import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  Button,
  CircleButton,
  Gutter,
  Heading,
  Icon,
  PhotoHeader,
  Pill,
  Screen,
  SegmentedControl,
  Tag,
  ThumbRow,
  Txt,
} from '@/components';
import { photos } from '@/content/photos';
import { sessionA, sessionsById } from '@/content/sessionA';
import { RestRing } from '@/features/session/RestRing';
import { formatClock, logSet, restLeft, skipRest, startRunner } from '@/features/session/runner';
import { colors, tones, type Tone } from '@/theme';

const muscleTones: Tone[] = ['mauve', 'latte', 'fog', 'vanilla'];

/** 13 · Guided session. Works offline: everything runs on the device. */
export default function GuidedSession() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const session = sessionsById[id ?? ''] ?? sessionA;
  const insets = useSafeAreaInsets();
  const [state, setState] = useState(() => startRunner(Date.now()));
  const [mode, setMode] = useState<'home' | 'gym'>('home');
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (state.finished) {
      const minutes = Math.max(1, Math.round((Date.now() - state.startedAt) / 60000));
      router.replace({ pathname: '/session/done', params: { minutes: String(minutes), exercises: String(session.exercises.length) } });
    }
  }, [state.finished, state.startedAt, session.exercises.length]);

  const ex = session.exercises[state.exerciseIndex] ?? session.exercises[0]!;
  const next = session.exercises[state.exerciseIndex + 1];
  const resting = restLeft(state, now);
  const elapsed = Math.floor((now - state.startedAt) / 1000);
  // The rest just started belongs to the previous exercise when we moved on to a new one.
  const prevEx = state.setIndex === 0 ? session.exercises[state.exerciseIndex - 1] : ex;
  const restTotal = prevEx?.restSeconds ?? ex.restSeconds;
  const restCue = (state.setIndex === 0 ? prevEx?.restCue : ex.restCue) ?? `Next: set ${state.setIndex + 1} of ${ex.name.toLowerCase()}.`;
  const variant = mode === 'home' ? ex.home : ex.gym;

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <StatusBar style="light" />
      <Screen padTop={false} gap={18} contentStyle={{ paddingBottom: 110 }}>
        <PhotoHeader
          source={photos[ex.photo]}
          height={480}
          focus={{ top: '30%', left: '50%' }}
          top={
            <>
              <CircleButton icon="close" surface="white" accessibilityLabel="Close session" onPress={() => router.back()} />
              <View style={styles.clock}>
                <Txt variant="body" size={14} weight={600}>
                  {formatClock(elapsed)}
                </Txt>
              </View>
              {/* TODO: demo video with sound once the exercise videos are shot. */}
              <CircleButton icon="volume" surface="white" accessibilityLabel="Play demo with sound" />
            </>
          }
        >
          <View style={styles.pills}>
            <Pill label={`${state.exerciseIndex + 1} of ${session.exercises.length}`} size="sm" />
            <Pill label={`${ex.sets} × ${ex.reps}`} size="sm" />
          </View>
          <Heading variant="hero" size={40} on="photo" accent={ex.accent} style={{ letterSpacing: -2.4, lineHeight: 37 }}>
            {ex.name}
          </Heading>
          <View style={styles.progress} accessibilityLabel={`Exercise ${state.exerciseIndex + 1} of ${session.exercises.length}`}>
            {session.exercises.map((e, i) => (
              <View key={e.id} style={[styles.progressSeg, { backgroundColor: i <= state.exerciseIndex ? colors.white : 'rgba(255,255,255,0.4)' }]} />
            ))}
          </View>
        </PhotoHeader>

        <Gutter gap={18}>
          <View style={styles.tags}>
            {ex.muscles.map((m, i) => (
              <Tag key={m} label={m} tone={muscleTones[i % muscleTones.length]} />
            ))}
            <Tag label={`RPE ${ex.rpe}`} />
          </View>

          <View style={{ gap: 8 }}>
            <SegmentedControl
              surface="white"
              stretch
              value={mode}
              onChange={setMode}
              options={[
                { value: 'home', label: 'Home version' },
                { value: 'gym', label: 'Gym version' },
              ]}
            />
            <Txt variant="meta" color={colors.grey}>
              {variant}
            </Txt>
          </View>

          <View style={{ gap: 10 }}>
            <View style={styles.sectionHead}>
              <Heading variant="h2" accent="sets">
                Your sets
              </Heading>
              <Txt variant="meta" color={colors.grey}>{`rest ${ex.restSeconds} s`}</Txt>
            </View>
            {Array.from({ length: ex.sets }, (_, i) => {
              const done = i < state.setIndex;
              const current = i === state.setIndex;
              return (
                <View key={i} style={[styles.set, done && styles.setDone, current && styles.setNow]}>
                  <View style={[styles.setNum, { backgroundColor: done ? colors.white : current ? tones.mauve.bg : colors.mist }]}>
                    <Txt variant="body" size={16} weight={700} color={done ? tones.vanilla.soft : current ? tones.mauve.soft : colors.grey}>
                      {String(i + 1)}
                    </Txt>
                  </View>
                  <View style={{ flex: 1, gap: 2 }}>
                    <Txt variant="bodyStrong" color={done ? tones.vanilla.strong : colors.ink}>
                      {/^[\d–-]+$/.test(ex.reps) ? `${ex.reps} reps` : ex.reps}
                    </Txt>
                    <Txt variant="small" color={done ? tones.vanilla.soft : colors.grey}>
                      {done ? 'Logged' : current ? (resting ? 'After the rest' : 'Your turn') : 'Coming up'}
                    </Txt>
                  </View>
                  {done ? (
                    <View style={styles.check}>
                      <Icon name="check" size={12} strokeWidth={2.8} color={colors.white} />
                    </View>
                  ) : current ? (
                    <Pill label="Now" active size="sm" />
                  ) : null}
                </View>
              );
            })}
          </View>

          {resting > 0 ? (
            <Pressable accessibilityRole="button" accessibilityHint="Skips the rest" onPress={() => setState(skipRest)} style={styles.rest}>
              <RestRing secondsLeft={resting} total={restTotal} />
              <View style={{ flex: 1, gap: 4 }}>
                <Txt variant="eyebrow" color={tones.mocha.soft} style={{ letterSpacing: 0.96 }}>
                  Rest · tap to skip
                </Txt>
                <Txt variant="bodyStrong" color={tones.mocha.strong} style={{ lineHeight: 20 }}>
                  {restCue}
                </Txt>
              </View>
            </Pressable>
          ) : null}

          {ex.tip ? (
            <View style={styles.tip}>
              <Txt variant="eyebrow" color={tones.fog.soft} style={{ letterSpacing: 0.96 }}>
                Coach tip
              </Txt>
              <Txt variant="cardTitle" size={16} color={tones.fog.strong}>
                {ex.tip}
              </Txt>
            </View>
          ) : null}

          {next ? (
            <ThumbRow
              source={photos[next.photo]}
              eyebrow={`Next · ${state.exerciseIndex + 2} of ${session.exercises.length}`}
              title={next.name}
              text={`${next.sets} × ${next.reps}`}
              right={<Icon name="chevronRight" size={14} strokeWidth={2} color={colors.grey} />}
            />
          ) : null}
        </Gutter>
      </Screen>

      <View style={[styles.actions, { paddingBottom: Math.max(insets.bottom, 16) + 8 }]}>
        {/* TODO(milestone 2): gentler versions come with the programme seed. */}
        <Button label="Gentler version" variant="outline" style={{ flex: 1 }} />
        {resting > 0 ? (
          <Button label={`Skip rest · ${formatClock(resting)}`} style={{ flex: 1 }} onPress={() => setState(skipRest)} />
        ) : (
          <Button label="Log set" style={{ flex: 1 }} onPress={() => setState((s) => logSet(session, s, Date.now()))} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  clock: { height: 34, paddingHorizontal: 12, borderRadius: 17, backgroundColor: colors.white, justifyContent: 'center' },
  pills: { flexDirection: 'row', gap: 6 },
  progress: { flexDirection: 'row', gap: 4, marginTop: 6 },
  progressSeg: { flex: 1, height: 3, borderRadius: 2 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  sectionHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  set: { height: 64, borderRadius: 20, flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 14, borderWidth: 1, borderColor: colors.line },
  setDone: { backgroundColor: tones.vanilla.bg, borderColor: tones.vanilla.bg },
  setNow: { borderWidth: 1.5, borderColor: colors.ink },
  setNum: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  check: { width: 26, height: 26, borderRadius: 13, backgroundColor: colors.ink, alignItems: 'center', justifyContent: 'center' },
  rest: { flexDirection: 'row', alignItems: 'center', gap: 16, borderRadius: 26, backgroundColor: tones.mocha.bg, paddingVertical: 16, paddingHorizontal: 18 },
  tip: { borderRadius: 24, backgroundColor: tones.fog.bg, padding: 16, gap: 4 },
  actions: {
    position: 'absolute', left: 0, right: 0, bottom: 0, flexDirection: 'row', gap: 10,
    paddingHorizontal: 20, paddingTop: 10, backgroundColor: colors.white,
  },
});

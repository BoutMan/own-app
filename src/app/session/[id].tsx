import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
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
import { getSession, sessionsForWeek } from '@/domain/programme';
import { useCurrentWeek } from '@/features/season/currentWeek';
import { toPlayable } from '@/features/session/playable';
import { RestRing } from '@/features/session/RestRing';
import { formatClock, logSet, restLeft, skipRest, startRunner } from '@/features/session/runner';
import { colors, tones, type Tone } from '@/theme';

const muscleTones: Tone[] = ['mauve', 'latte', 'fog', 'vanilla'];

/** 13 · Guided session. Plays any of the nine sessions of the guide. Works offline. */
export default function GuidedSession() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const week = useCurrentWeek();
  const session = useMemo(() => toPlayable(getSession(id ?? '') ?? sessionsForWeek(week)[0]!, week), [id, week]);
  const insets = useSafeAreaInsets();
  const [state, setState] = useState(() => startRunner(session, Date.now()));
  const [mode, setMode] = useState<'home' | 'gym'>('home');
  const [gentle, setGentle] = useState(false);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (state.finished) {
      const minutes = Math.max(1, Math.round((Date.now() - state.startedAt) / 60000));
      router.replace({ pathname: '/session/done', params: { id: session.id, minutes: String(minutes) } });
    }
  }, [state.finished, state.startedAt, session.id]);

  const circuit = session.order === 'rounds';
  const step = session.steps[state.stepIndex] ?? session.steps[0]!;
  const next = circuit
    ? session.steps[state.stepIndex + 1] ?? (state.setIndex + 1 < step.sets ? session.steps[0] : undefined)
    : session.steps[state.stepIndex + 1];
  const resting = restLeft(state, now);
  const elapsed = Math.floor((now - state.startedAt) / 1000);
  const variant = gentle && step.gentler ? step.gentler : mode === 'home' ? step.home : step.gym;
  const restCue = step.note ?? `Next: ${step.name.toLowerCase()}, set ${state.setIndex + 1}.`;
  const hasVersions = Boolean(step.home || step.gym);

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <StatusBar style="light" />
      <Screen padTop={false} gap={18} contentStyle={{ paddingBottom: 110 }}>
        <PhotoHeader
          source={photos[step.photo]}
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
            <Pill label={circuit ? `Round ${state.setIndex + 1} of ${step.sets}` : `${state.stepIndex + 1} of ${session.steps.length}`} size="sm" />
            <Pill label={circuit ? step.target : `${step.sets} × ${step.target}`} size="sm" />
          </View>
          <Heading variant="hero" size={step.name.length > 28 ? 32 : 40} on="photo" accent={step.accent} style={{ letterSpacing: -2.2, lineHeight: step.name.length > 28 ? 31 : 37 }}>
            {step.name}
          </Heading>
          <View style={styles.progress} accessibilityLabel={`Step ${state.stepIndex + 1} of ${session.steps.length}`}>
            {session.steps.map((st, i) => (
              <View key={st.key} style={[styles.progressSeg, { backgroundColor: i <= state.stepIndex ? colors.white : 'rgba(255,255,255,0.4)' }]} />
            ))}
          </View>
        </PhotoHeader>

        <Gutter gap={18}>
          <View style={styles.tags}>
            {step.muscles.map((m, i) => (
              <Tag key={m} label={m} tone={muscleTones[i % muscleTones.length]} />
            ))}
            {step.rpe ? <Tag label={step.rpe} /> : null}
          </View>

          <View style={{ gap: 8 }}>
            {hasVersions ? (
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
            ) : null}
            {variant || step.note ? (
              <Txt variant="meta" color={colors.grey}>
                {[variant, hasVersions && !gentle ? step.note : undefined].filter(Boolean).join(' · ')}
              </Txt>
            ) : null}
          </View>

          <View style={{ gap: 10 }}>
            <View style={styles.sectionHead}>
              <Heading variant="h2" accent={circuit ? 'rounds' : 'sets'}>
                {circuit ? 'Your rounds' : 'Your sets'}
              </Heading>
              <Txt variant="meta" color={colors.grey}>
                {circuit ? `${step.restSeconds} s between moves` : step.restSeconds ? `rest ${step.restSeconds} s` : 'no rest'}
              </Txt>
            </View>
            {Array.from({ length: step.sets }, (_, i) => {
              const done = i < (circuit ? state.setIndex : state.done[state.stepIndex] ?? 0);
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
                      {step.target}
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
            <View style={styles.rest}>
              <RestRing secondsLeft={resting} total={state.restTotal} />
              <View style={{ flex: 1, gap: 4 }}>
                <Txt variant="eyebrow" color={tones.mocha.soft} style={{ letterSpacing: 0.96 }}>
                  Rest
                </Txt>
                <Txt variant="bodyStrong" color={tones.mocha.strong} style={{ lineHeight: 20 }}>
                  {restCue}
                </Txt>
              </View>
            </View>
          ) : null}

          {step.tip ? (
            <View style={styles.tip}>
              <Txt variant="eyebrow" color={tones.fog.soft} style={{ letterSpacing: 0.96 }}>
                Watch out
              </Txt>
              <Txt variant="cardTitle" size={16} color={tones.fog.strong}>
                {step.tip}
              </Txt>
            </View>
          ) : null}

          {next ? (
            <ThumbRow
              source={photos[next.photo]}
              eyebrow={circuit && state.stepIndex + 1 >= session.steps.length ? `Next round · ${state.setIndex + 2} of ${step.sets}` : 'Next'}
              title={next.name}
              text={circuit ? next.target : `${next.sets} × ${next.target}`}
              right={<Icon name="chevronRight" size={14} strokeWidth={2} color={colors.grey} />}
            />
          ) : (
            <ThumbRow source={photos[step.photo]} eyebrow="To finish" title="Finisher" text={session.finisher} />
          )}
        </Gutter>
      </Screen>

      <View style={[styles.actions, { paddingBottom: Math.max(insets.bottom, 16) + 8 }]}>
        <Button
          label={step.gentler ? (gentle ? 'Full version' : 'Gentler version') : 'Gentler version'}
          variant="outline"
          style={{ flex: 1, opacity: step.gentler ? 1 : 0.35 }}
          onPress={step.gentler ? () => setGentle((g) => !g) : undefined}
        />
        {resting > 0 ? (
          <Button label={`Skip rest · ${formatClock(resting)}`} style={{ flex: 1 }} onPress={() => setState(skipRest)} />
        ) : (
          <Button label={circuit ? 'Done, next' : 'Log set'} style={{ flex: 1 }} onPress={() => setState((s) => logSet(session, s, Date.now()))} />
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

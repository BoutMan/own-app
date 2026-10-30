import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Button, CircleButton, Gutter, Heading, Icon, PhotoHeader, Pill, PlayGlyph, Screen, ToneCard, Txt } from '@/components';
import { exercisePhoto, familyLabels } from '@/content/exerciseMedia';
import { useQuery } from '@/db/DbProvider';
import { exerciseHistory } from '@/db/repositories';
import { DemoVideo, hasDemo } from '@/features/library/DemoVideo';
import { useProfile, useUpdateProfile } from '@/features/profile/useProfile';
import { formatLoad } from '@/domain/units';
import { exercises } from '@/content/exercises';
import { photos } from '@/content/photos';
import { blockForWeek, exerciseAppearances, formatTarget, strengthLineFor } from '@/domain/programme';
import { useCurrentWeek, useUnits } from '@/features/season/currentWeek';
import { colors, radius, tones } from '@/theme';

/** Splits "Single-arm row" into its last word as the accent: one key word per title. */
function accentOf(name: string): string {
  const main = name.split(' · ')[0] ?? name;
  return main.split(' ').pop() ?? main;
}

/** 18 · Exercise detail — the guide's card: start, movement, common mistake, then home/gym versions. */
export default function ExerciseDetail() {
  const { exerciseId } = useLocalSearchParams<{ exerciseId: string }>();
  const ex = exercises.find((e) => e.id === exerciseId) ?? exercises[0]!;
  const fam = familyLabels[ex.family];
  const inSession = strengthLineFor(ex.id, blockForWeek(useCurrentWeek()));
  const title = ex.name.split(' · ')[0] ?? ex.name;
  const units = useUnits();
  const { savedExercises } = useProfile();
  const update = useUpdateProfile();
  const saved = savedExercises.includes(ex.id);
  const [demo, setDemo] = useState(false);
  const [showVariations, setShowVariations] = useState(false);
  const variations = exerciseAppearances(ex.id);
  // Last strength session with this move, and the heaviest load used (reduced-load weeks included).
  const history = useQuery((db) => exerciseHistory(db, ex.id, 12), [ex.id]);
  const last = history[0];
  const best = Math.max(0, ...history.flatMap((h) => h.sets.map((s) => s.loadKg ?? 0)));

  return (
    <Screen padTop={false} gap={22}>
      <StatusBar style="light" />
      <PhotoHeader
        source={photos[exercisePhoto(ex.id, ex.family)]}
        height={470}
        focus={{ top: '30%', left: '50%' }}
        top={
          <>
            <CircleButton icon="chevronLeft" surface="white" accessibilityLabel="Back" onPress={() => router.back()} />
            <CircleButton
              icon="heart"
              surface="white"
              active={saved}
              accessibilityLabel={saved ? 'Remove from saved moves' : 'Save move'}
              onPress={() => update({ savedExercises: saved ? savedExercises.filter((id) => id !== ex.id) : [...savedExercises, ex.id] })}
            />
          </>
        }
      >
        <View style={{ flexDirection: 'row', gap: 6 }}>
          <Pill label={fam.label} size="sm" />
          <Pill label={`Card ${ex.number} of ${exercises.length}`} size="sm" />
        </View>
        <Heading variant="hero" size={46} on="photo" accent={accentOf(title)} style={{ letterSpacing: -2.76, lineHeight: 43 }}>
          {title}
        </Heading>
        <View style={styles.heroRow}>
          <Txt variant="body" size={14} color="rgba(255,255,255,0.9)" style={{ flex: 1 }}>
            {ex.muscles.join(' · ') + (inSession ? ` · ${inSession.sets} × ${formatTarget(inSession.target)}` : '')}
          </Txt>
          {/* The demo plays once this move's video is bundled; until then the pill says so. */}
          {hasDemo(ex.id) ? (
            <Pressable accessibilityRole="button" accessibilityLabel="Watch the demo" onPress={() => setDemo(true)} style={styles.demo}>
              <Txt variant="meta" weight={600}>
                Watch the demo
              </Txt>
              <View style={styles.demoPlay}>
                <PlayGlyph size={12} />
              </View>
            </Pressable>
          ) : (
            <View style={[styles.demo, { paddingRight: 14 }]}>
              <Txt variant="meta" weight={600}>
                Demo soon
              </Txt>
            </View>
          )}
        </View>
      </PhotoHeader>

      <Gutter>
        <View style={{ gap: 10 }}>
          <Heading variant="h2" accent="do it">
            How to do it
          </Heading>
          <ToneCard tone="vanilla" icon="flag" eyebrow="Step 1" title="Start" text={ex.start} />
          <ToneCard tone="fog" icon="repeat" eyebrow="Step 2" title="Move" text={ex.movement} />
          <ToneCard tone="mauve" icon="target" eyebrow="Watch out" title="Common mistake" text={ex.mistake} />
          <Txt variant="small" color={colors.grey}>{`From the guide, p. ${ex.page}`}</Txt>
        </View>

        {inSession ? (
          <View style={{ gap: 12 }}>
            <Heading variant="h2" accent="version">
              Your version
            </Heading>
            <View style={styles.versions}>
              {[
                { icon: 'home' as const, title: 'Home', text: inSession.home ?? inSession.note ?? '' },
                { icon: 'dumbbell' as const, title: 'Gym', text: inSession.gym ?? inSession.note ?? '' },
              ].map((v) => (
                <View key={v.title} style={styles.version}>
                  <View style={styles.versionIcon}>
                    <Icon name={v.icon} size={16} strokeWidth={1.8} />
                  </View>
                  <View style={{ gap: 2 }}>
                    <Txt variant="bodyStrong">{v.title}</Txt>
                    <Txt variant="small" color={colors.grey}>
                      {v.text}
                    </Txt>
                  </View>
                </View>
              ))}
            </View>
          </View>
        ) : null}

        <View style={styles.loads}>
          <Txt variant="eyebrow" color={tones.fog.soft} style={{ letterSpacing: 0.96 }}>
            Your loads
          </Txt>
          {last ? (
            <>
              <Txt variant="cardTitle" color={tones.fog.strong}>
                {`Last time: ${last.sets.map((s) => (s.reps != null ? `${s.reps}` : `${s.seconds ?? 0} s`)).join(', ')}${
                  (last.sets[0]?.loadKg ?? 0) > 0 ? ` at ${formatLoad(Math.max(...last.sets.map((s) => s.loadKg ?? 0)), units)}` : ''
                }`}
              </Txt>
              <Txt variant="meta" color={tones.fog.soft}>
                {best > 0 ? `Heaviest so far: ${formatLoad(best, units)} · ${history.length} ${history.length === 1 ? 'session' : 'sessions'}` : `${history.length} ${history.length === 1 ? 'session' : 'sessions'} logged`}
              </Txt>
            </>
          ) : (
            <Txt variant="cardTitle" color={tones.fog.strong}>
              Your loads appear here after your first session with this move.
            </Txt>
          )}
        </View>

        {variations.length ? (
          <View style={{ gap: 10 }}>
            <Button label={showVariations ? 'Hide variations' : 'See variations'} variant="outline" onPress={() => setShowVariations((v) => !v)} />
            {showVariations
              ? variations.map((v) => (
                  <View key={`${v.block}-${v.session}`} style={styles.variation}>
                    <View style={styles.variationHead}>
                      <Txt variant="bodyStrong">{`Block ${v.block} · ${v.blockName}`}</Txt>
                      <Txt variant="small" color={colors.grey}>{`p. ${v.page}`}</Txt>
                    </View>
                    <Txt variant="meta" color={colors.grey}>{`${v.session} · ${v.prescription}`}</Txt>
                    {[
                      ['Home', v.home],
                      ['Gym', v.gym],
                      ['Gentler', v.gentler],
                      ['Cue', v.note],
                    ]
                      .filter((x): x is [string, string] => Boolean(x[1]))
                      .map(([k, t]) => (
                        <Txt key={k} variant="small">
                          <Txt variant="small" weight={600}>{`${k} · `}</Txt>
                          {t}
                        </Txt>
                      ))}
                  </View>
                ))
              : null}
          </View>
        ) : (
          <Txt variant="small" color={colors.grey}>
            Not in this season's sessions: a move from the guide's library to keep in your pocket.
          </Txt>
        )}
        <DemoVideo exerciseId={ex.id} title={title} poster={exercisePhoto(ex.id, ex.family)} visible={demo} onClose={() => setDemo(false)} />
      </Gutter>
    </Screen>
  );
}

const styles = StyleSheet.create({
  heroRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 4 },
  demo: { height: 40, paddingLeft: 14, paddingRight: 6, borderRadius: radius.pill, backgroundColor: colors.white, flexDirection: 'row', alignItems: 'center', gap: 8 },
  demoPlay: { width: 30, height: 30, borderRadius: 15, backgroundColor: colors.ink, alignItems: 'center', justifyContent: 'center' },
  versions: { flexDirection: 'row', gap: 8 },
  version: { flex: 1, borderRadius: 22, borderWidth: 1, borderColor: colors.line, padding: 14, gap: 12 },
  versionIcon: { width: 34, height: 34, borderRadius: 11, backgroundColor: colors.mist, alignItems: 'center', justifyContent: 'center' },
  variation: { borderRadius: 22, borderWidth: 1, borderColor: colors.line, padding: 14, gap: 6 },
  variationHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  loads: { borderRadius: 24, backgroundColor: tones.fog.bg, paddingVertical: 16, paddingHorizontal: 18, gap: 6 },
});

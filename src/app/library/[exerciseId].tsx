import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';

import { Button, CircleButton, Gutter, Heading, Icon, PhotoHeader, Pill, PlayGlyph, Screen, ToneCard, Txt } from '@/components';
import { exercisePhoto, familyLabels } from '@/content/exerciseMedia';
import { exercises } from '@/content/exercises';
import { photos } from '@/content/photos';
import { sessionA } from '@/content/sessionA';
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
  const inSession = sessionA.exercises.find((e) => e.id === ex.id);
  const title = ex.name.split(' · ')[0] ?? ex.name;

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
            {/* TODO: saved moves. */}
            <CircleButton icon="heart" surface="white" accessibilityLabel="Save move" />
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
            {ex.muscles.join(' · ') + (inSession ? ` · ${inSession.sets} × ${inSession.reps}` : '')}
          </Txt>
          {/* Video placeholder until the demos are shot. */}
          <View style={styles.demo}>
            <Txt variant="meta" weight={600}>
              Demo soon
            </Txt>
            <View style={styles.demoPlay}>
              <PlayGlyph size={12} />
            </View>
          </View>
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
                { icon: 'home' as const, title: 'Home', text: inSession.home },
                { icon: 'dumbbell' as const, title: 'Gym', text: inSession.gym },
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
          {/* Filled from logged sets in milestone 3. */}
          <Txt variant="cardTitle" color={tones.fog.strong}>
            Your loads appear here after your first session with this move.
          </Txt>
        </View>

        {/* TODO(milestone 2): variations come with the programme seed. */}
        <Button label="See variations" variant="outline" />
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
  loads: { borderRadius: 24, backgroundColor: tones.fog.bg, paddingVertical: 16, paddingHorizontal: 18, gap: 6 },
});

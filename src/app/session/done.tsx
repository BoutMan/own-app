import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button, CircleButton, Gutter, Heading, Pill, PhotoHeader, Screen, StatTiles, ToneCard, Txt } from '@/components';
import { photos } from '@/content/photos';
import { useDb, useQuery } from '@/db/DbProvider';
import { setFeel } from '@/db/repositories';
import { progressionRules } from '@/domain/programme';
import { useSeason, useUnits } from '@/features/season/currentWeek';
import { summarizeWorkout } from '@/features/session/summary';
import { colors, radius } from '@/theme';

/** 14 · Session complete — real stats from the logged sets, the next +1, how it felt. */
export default function SessionComplete() {
  const params = useLocalSearchParams<{ workout?: string; minutes?: string }>();
  const insets = useSafeAreaInsets();
  const units = useUnits();
  const { write } = useDb();
  const season = useSeason();
  const summary = useQuery((db) => (params.workout ? summarizeWorkout(db, params.workout, units) : undefined), [params.workout, units]);
  const kept = season.sessionsKept;
  const goHome = () => router.replace('/(tabs)');

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <StatusBar style="light" />
      <Screen padTop={false} gap={20} contentStyle={{ paddingBottom: 100 }}>
        <PhotoHeader
          source={photos.streetAbsMatcha}
          height={470}
          focus={{ top: '25%', left: '50%' }}
          top={
            <>
              <Pill label={`Session ${kept} of ${progressionRules.successfulSeason.of}`} dot size="sm" />
              {/* Glow card sharing (24) is V1. */}
              <CircleButton icon="share" surface="white" accessibilityLabel="Share" />
            </>
          }
        >
          <Txt variant="eyebrow" color="rgba(255,255,255,0.88)" style={{ letterSpacing: 1.44 }}>
            {`${summary?.sessionName ?? 'Session'} · today`}
          </Txt>
          <Heading variant="hero" size={60} on="photo" accent="kept." style={{ letterSpacing: -3.6, lineHeight: 55 }}>
            Promise kept.
          </Heading>
          <Txt variant="body" size={14} color="rgba(255,255,255,0.9)">
            {kept > 1 ? `${kept} sessions in. This is who you are now.` : 'The first one. The hardest one. Done.'}
          </Txt>
        </PhotoHeader>

        <Gutter gap={20}>
          <StatTiles
            stats={[
              { value: params.minutes ?? '–', label: 'minutes', tone: 'vanilla' },
              { value: summary ? `${summary.stepsDone}/${summary.stepsTotal}` : '–', label: 'exercises', tone: 'mauve' },
              { value: String(summary?.plusOnes ?? 0), label: '+1 achieved', tone: 'fog' },
            ]}
          />
          {summary ? <ToneCard tone="latte" icon="sparkle" eyebrow="Your +1" title={summary.next.title} text={summary.next.text} /> : null}

          <View style={{ gap: 10 }}>
            <Heading variant="h2" accent="feel">
              How did it feel?
            </Heading>
            <View style={styles.scale}>
              {Array.from({ length: 10 }, (_, i) => {
                const on = summary?.feel === i + 1;
                return (
                  <Pressable
                    key={i}
                    accessibilityRole="radio"
                    accessibilityState={{ checked: on }}
                    accessibilityLabel={`${i + 1} out of 10`}
                    onPress={() => params.workout && write((db) => setFeel(db, params.workout!, i + 1))}
                    style={[styles.scaleItem, { backgroundColor: on ? colors.ink : colors.mist }]}
                  >
                    <Txt variant="body" size={14} weight={on ? 600 : 400} color={on ? colors.white : colors.ink}>
                      {String(i + 1)}
                    </Txt>
                  </Pressable>
                );
              })}
            </View>
            <View style={styles.scaleLegend}>
              {['Easy', 'Just right', 'All out'].map((l) => (
                <Txt key={l} variant="small" color={colors.grey}>
                  {l}
                </Txt>
              ))}
            </View>
          </View>
        </Gutter>
      </Screen>

      <View style={[styles.actions, { paddingBottom: Math.max(insets.bottom, 16) + 8 }]}>
        <Button label="Share" variant="outline" style={{ flex: 1 }} />
        <Button label="Done" style={{ flex: 1 }} onPress={goHome} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scale: { flexDirection: 'row', gap: 4 },
  scaleItem: { flex: 1, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  scaleLegend: { flexDirection: 'row', justifyContent: 'space-between' },
  actions: {
    position: 'absolute', left: 0, right: 0, bottom: 0, flexDirection: 'row', gap: 10,
    paddingHorizontal: 20, paddingTop: 10, backgroundColor: colors.white, borderRadius: radius.card,
  },
});

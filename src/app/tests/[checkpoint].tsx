import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { CircleButton, CTA, Heading, Pill, Screen, Stepper, Txt } from '@/components';
import { useDb, useQuery } from '@/db/DbProvider';
import { activeSeason, recordTest, startSeason, testsAt } from '@/db/repositories';
import { mondayOf } from '@/domain/engine/season';
import { baselinePages, baselineTests, checkpoints, type Checkpoint, type TestId } from '@/domain/programme';
import { formatTestValue, PUSH_UP_HEIGHTS, stepFor, type PushUpHeight } from '@/features/review/tests';
import { isoDate } from '@/lib/dates';
import { colors } from '@/theme';

const titles: Record<Checkpoint, string> = { day0: 'Day 0', day30: 'Day 30', day60: 'Day 60', day90: 'Day 90' };

/** The five baseline tests (guide p. 14), taken on day 0 and at the end of each block. */
export default function Tests() {
  const params = useLocalSearchParams<{ checkpoint: string }>();
  const checkpoint: Checkpoint = (checkpoints as readonly string[]).includes(params.checkpoint ?? '') ? (params.checkpoint as Checkpoint) : 'day0';
  const { write } = useDb();
  const saved = useQuery((db) => {
    const s = activeSeason(db)?.number;
    return s == null ? { now: {}, day0: {} } : { now: testsAt(db, s, checkpoint), day0: testsAt(db, s, 'day0') };
  }, [checkpoint]);
  const [values, setValues] = useState<Partial<Record<TestId, number>>>(() =>
    Object.fromEntries(Object.entries(saved.now).map(([k, v]) => [k, v!.value])),
  );
  const [height, setHeight] = useState<PushUpHeight>(() => (saved.now.pushUps?.note as PushUpHeight | undefined) ?? (saved.day0.pushUps?.note as PushUpHeight | undefined) ?? 'knees');

  const save = () => {
    write((db) => {
      const season = activeSeason(db)?.number ?? startSeason(db, isoDate(mondayOf(new Date())));
      for (const t of baselineTests) {
        const v = values[t.id];
        if (v != null) recordTest(db, season, checkpoint, t.id, v, t.id === 'pushUps' ? height : undefined);
      }
    });
    router.back();
  };

  return (
    <Screen gap={16} contentStyle={{ paddingHorizontal: 20 }}>
      <View style={styles.rowBetween}>
        <CircleButton icon="chevronLeft" accessibilityLabel="Back" onPress={() => router.back()} />
        <Pill label={`${titles[checkpoint]} · 15 minutes`} dot size="sm" surface="mist" />
      </View>
      <View style={{ gap: 6 }}>
        <Heading variant="h1" accent="tests">
          Your five tests
        </Heading>
        <Txt variant="body" size={14} color={colors.grey}>
          {`Same conditions every time: rested, warmed up, same time of day. Write what you did, not what you hoped. Guide p. ${baselinePages.tests}.`}
        </Txt>
      </View>

      {baselineTests.map((t) => {
        const v = values[t.id];
        const before = checkpoint !== 'day0' ? saved.day0[t.id] : undefined;
        const step = stepFor(t.unit);
        return (
          <View key={t.id} style={styles.card}>
            <View style={styles.rowBetween}>
              <View style={{ flex: 1, gap: 2 }}>
                <Txt variant="cardTitle">{t.label}</Txt>
                <Txt variant="small" color={colors.grey}>
                  {before ? `${t.how} · day 0: ${formatTestValue(before.value, t.unit)}` : t.how}
                </Txt>
              </View>
            </View>
            {t.id === 'pushUps' ? (
              <View style={styles.heights}>
                {PUSH_UP_HEIGHTS.map((h) => (
                  <Pill key={h.id} label={h.label} size="sm" surface="mist" active={height === h.id} onPress={() => setHeight(h.id)} />
                ))}
              </View>
            ) : null}
            <Stepper
              label={t.unit === 'reps' ? 'Reps' : t.unit === 'seconds' ? 'Seconds' : 'Minutes'}
              value={v == null ? 'Not taken' : formatTestValue(v, t.unit)}
              onMinus={() => setValues((x) => ({ ...x, [t.id]: Math.max(0, (v ?? 0) - step) }))}
              onPlus={() => setValues((x) => ({ ...x, [t.id]: (v ?? before?.value ?? 0) + step }))}
            />
          </View>
        );
      })}

      <CTA label="Save my tests" onPress={save} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12 },
  card: { borderRadius: 22, borderWidth: 1, borderColor: colors.line, padding: 14, gap: 10 },
  heights: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
});

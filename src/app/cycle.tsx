import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Button, CircleButton, Gutter, Heading, Icon, ListGroup, ListRow, PhotoHeader, Pill, Screen, Stepper, Switch, ToneCard, Txt } from '@/components';
import { photos } from '@/content/photos';
import { useDb } from '@/db/DbProvider';
import { logPeriodStart, updateProfile } from '@/db/repositories';
import { phaseOf, type CyclePhase } from '@/domain/engine/cycle';
import { useCycle, useUpdateProfile } from '@/features/profile/useProfile';
import { addDays, formatShort, isoDate } from '@/lib/dates';
import { colors, tones, type Tone } from '@/theme';

const phaseTone: Record<CyclePhase, Tone> = { period: 'mauve', follicular: 'vanilla', ovulation: 'latte', luteal: 'mocha' };
const barColor: Record<CyclePhase, string> = { period: tones.mauve.bg, follicular: tones.vanilla.bg, ovulation: tones.latte.bg, luteal: tones.latte.ring };
const phaseDays: Record<CyclePhase, (length: number) => string> = {
  period: () => 'days 1–5',
  follicular: (l) => `days 6–${l - 16}`,
  ovulation: (l) => `around day ${l - 14}`,
  luteal: (l) => `days ${l - 12}–${l}`,
};

/**
 * 20 · Cycle. The guide's compass (p. 19): one tap on the first day of a period, a phase tip on
 * the days that follow. Stored on this phone only. Daily feelings and the personal pattern come
 * with the V1 cycle work.
 */
export default function Cycle() {
  const { write } = useDb();
  const update = useUpdateProfile();
  const cycle = useCycle();
  const [daysAgo, setDaysAgo] = useState(0);
  const pos = cycle.position;
  const advice = cycle.advice;
  const startedToday = cycle.starts.some((d) => isoDate(d) === isoDate(new Date()));

  const logStart = (ago: number) =>
    write((db) => {
      logPeriodStart(db, isoDate(addDays(new Date(), -ago)));
      updateProfile(db, { cycleTracking: true });
    });

  return (
    <Screen padTop={false}>
      <StatusBar style="light" />
      <PhotoHeader
        source={photos.iceSkincare}
        height={400}
        top={
          <>
            <CircleButton icon="chevronLeft" surface="white" accessibilityLabel="Back" onPress={() => router.back()} />
            {pos ? <Pill label={`Day ${pos.day} of ~${pos.length}`} dot size="sm" /> : null}
          </>
        }
      >
        <Txt variant="eyebrow" color="rgba(255,255,255,0.88)" style={{ letterSpacing: 1.44 }}>
          {advice ? `${advice.label} phase` : cycle.contraception ? 'Hormonal contraception' : 'A lens, not a rule'}
        </Txt>
        <Heading variant="hero" size={52} on="photo" accent="cycle" style={{ letterSpacing: -3.12, lineHeight: 50 }}>
          Your cycle
        </Heading>
        <Txt variant="body" size={14} color="rgba(255,255,255,0.9)">
          {advice
            ? advice.pill
            : cycle.contraception
              ? 'We follow your energy of the day, not phases.'
              : 'Log the first day of your period: your days get a phase tip.'}
        </Txt>
      </PhotoHeader>

      <Gutter>
        {pos && advice ? (
          <>
            <View style={styles.card}>
              <View style={styles.bars}>
                {Array.from({ length: pos.length }, (_, i) => {
                  const day = i + 1;
                  const current = day === pos.day;
                  return (
                    <View key={day} style={styles.barCol}>
                      {current ? (
                        <Txt variant="small" weight={700} style={styles.barLabel}>
                          {String(day)}
                        </Txt>
                      ) : null}
                      <View style={[styles.bar, { backgroundColor: current ? colors.ink : barColor[phaseOf(day, pos.length)] }]} />
                    </View>
                  );
                })}
              </View>
              <View style={styles.legend}>
                <Txt variant="small" color={colors.grey}>
                  Period
                </Txt>
                <Txt variant="small" color={colors.grey}>
                  Follicular
                </Txt>
                <Txt variant="small" color={colors.grey}>
                  Luteal
                </Txt>
              </View>
              <View style={styles.divider} />
              <View style={styles.row}>
                <Txt variant="meta" color={colors.grey}>
                  {`Next period expected around ${formatShort(pos.nextPeriod)}`}
                </Txt>
              </View>
            </View>
            <ToneCard
              tone={phaseTone[pos.phase]}
              icon="bolt"
              eyebrow={`${advice.label} · ${phaseDays[pos.phase](pos.length)}`}
              title={pos.phase === 'follicular' ? 'Your window' : advice.label}
              text={advice.advice}
            />
          </>
        ) : null}

        {cycle.contraception ? null : (
          <View style={{ gap: 10 }}>
            <Heading variant="h2" accent="started">
              {startedToday ? 'Logged for today' : 'It started?'}
            </Heading>
            <Button label={startedToday ? 'Logged: day 1 is today' : 'My period started today'} variant="outline" size="lg" disabled={startedToday} onPress={() => logStart(0)} />
            <View style={styles.earlier}>
              <View style={{ flex: 1 }}>
                <Stepper
                  label="Or it started"
                  value={daysAgo === 0 ? 'Pick a day' : daysAgo === 1 ? 'Yesterday' : `${daysAgo} days ago`}
                  onMinus={() => setDaysAgo((d) => Math.max(0, d - 1))}
                  onPlus={() => setDaysAgo((d) => Math.min(40, d + 1))}
                />
              </View>
              <Button label="Log" variant="solid" disabled={daysAgo === 0} onPress={() => { logStart(daysAgo); setDaysAgo(0); }} />
            </View>
            <Txt variant="small" color={colors.grey}>
              {cycle.starts.length >= 2
                ? `Based on your last ${Math.min(cycle.starts.length - 1, 6)} cycles. A tip, never a rule: the programme stays on its weeks.`
                : 'Uses 28 days until you have logged two periods. A tip, never a rule: the programme stays on its weeks.'}
            </Txt>
          </View>
        )}

        <ListGroup>
          <ListRow
            icon="halfCircle"
            tone="mauve"
            tileOnWhite
            label="Hormonal contraception"
            detail="We then follow your energy, not phases"
            right={<Switch value={cycle.contraception} onChange={(v) => update({ hormonalContraception: v })} accessibilityLabel="Hormonal contraception" />}
          />
        </ListGroup>

        <View style={styles.footer}>
          <Icon name="lock" size={13} color={colors.grey} />
          <Txt variant="small" color={colors.grey}>
            Stays on this phone. Never shared.
          </Txt>
        </View>
      </Gutter>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 24, borderWidth: 1, borderColor: colors.line, padding: 16, gap: 10 },
  bars: { flexDirection: 'row', gap: 2, alignItems: 'flex-end', height: 62 },
  barCol: { flex: 1, alignItems: 'center', gap: 4 },
  barLabel: { position: 'absolute', top: -18, width: 30, textAlign: 'center' },
  bar: { width: '100%', height: 44, borderRadius: 5 },
  legend: { flexDirection: 'row', justifyContent: 'space-between' },
  divider: { height: 1, backgroundColor: colors.line },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  earlier: { flexDirection: 'row', alignItems: 'flex-end', gap: 10 },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
});

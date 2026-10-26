import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { Button, Icon, PhotoTile, Switch, Txt } from '@/components';
import { photos } from '@/content/photos';
import { formatLong } from '@/lib/dates';
import { formatTime, shiftSessionTime } from '@/lib/time';
import { useOnboarding } from '@/features/onboarding/OnboardingContext';
import { countDates, cycleDay, sessionLetters } from '@/features/onboarding/schedule';
import { StepScreen } from '@/features/onboarding/ui';
import { colors, radius, tones } from '@/theme';

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;

/** 08 · Onboarding 6/7 — training days, time, calendar and night-before reminder. */
export default function Dates() {
  const { answers, update } = useOnboarding();
  const letters = sessionLetters(answers.week);
  return (
    <StepScreen
      step={6}
      title={'Four dates\nwith yourself'}
      accent="yourself"
      subtitle="A session that isn't in the calendar is a session that won't happen."
      gap={18}
      footer={<Button label="Continue" size="lg" disabled={countDates(answers.week) === 0} onPress={() => router.push('/contract')} />}
    >
      <View>
        <PhotoTile source={photos.morningWalk} height={120} focus={{ top: '30%', left: '50%' }} />
        <View style={styles.startPill}>
          <Icon name="calendar" size={15} strokeWidth={1.8} />
          <Txt variant="body" size={14} weight={500}>{`Starts ${formatLong(answers.startDate)}`}</Txt>
        </View>
      </View>

      <View style={{ gap: 8 }}>
        <View style={styles.days}>
          {answers.week.map((plan, i) => {
            const letter = letters[i];
            const bg = plan === 'session' ? colors.ink : plan === 'walk' ? tones.vanilla.bg : colors.mist;
            const fg = plan === 'session' ? colors.white : plan === 'walk' ? tones.vanilla.strong : colors.grey;
            return (
              <Pressable
                key={WEEKDAYS[i]}
                accessibilityRole="button"
                accessibilityLabel={`${WEEKDAYS[i]}: ${plan === 'session' ? `session ${letter}` : plan}`}
                onPress={() => update('week', cycleDay(answers.week, i))}
                style={[styles.day, { backgroundColor: bg }]}
              >
                <Txt variant="small" color={fg}>
                  {WEEKDAYS[i]}
                </Txt>
                {plan === 'session' ? (
                  <Txt variant="h2" size={18} weight={600} color={fg} style={{ letterSpacing: 0 }}>
                    {letter ?? ''}
                  </Txt>
                ) : (
                  <Txt variant="small" weight={plan === 'walk' ? 600 : 400} color={fg}>
                    {plan}
                  </Txt>
                )}
              </Pressable>
            );
          })}
        </View>
        <Txt variant="small" color={colors.grey}>
          Tap a day to switch between rest, session and walk.
        </Txt>
      </View>

      <View style={styles.group}>
        <View style={[styles.row, styles.divider]}>
          <Txt variant="body">Time</Txt>
          <View style={styles.timeRow}>
            <Pressable accessibilityRole="button" accessibilityLabel="Earlier" hitSlop={6} onPress={() => update('sessionTime', shiftSessionTime(answers.sessionTime, -15))} style={styles.timeBtn}>
              <Txt variant="body" weight={600}>−</Txt>
            </Pressable>
            <View style={styles.time}>
              <Txt variant="body" weight={600}>
                {formatTime(answers.sessionTime)}
              </Txt>
            </View>
            <Pressable accessibilityRole="button" accessibilityLabel="Later" hitSlop={6} onPress={() => update('sessionTime', shiftSessionTime(answers.sessionTime, 15))} style={styles.timeBtn}>
              <Txt variant="body" weight={600}>+</Txt>
            </Pressable>
          </View>
        </View>
        <View style={[styles.row, styles.divider]}>
          <Txt variant="body">Add to my calendar</Txt>
          <Switch value={answers.addToCalendar} onChange={(v) => update('addToCalendar', v)} accessibilityLabel="Add to my calendar" />
        </View>
        <View style={styles.row}>
          <Txt variant="body" style={{ flex: 1 }}>
            Night before: lay out my clothes
          </Txt>
          <Switch value={answers.nightBeforeReminder} onChange={(v) => update('nightBeforeReminder', v)} accessibilityLabel="Night-before reminder" />
        </View>
      </View>
    </StepScreen>
  );
}

const styles = StyleSheet.create({
  timeRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  timeBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center' },
  startPill: {
    position: 'absolute', left: 12, bottom: 12, height: 32, paddingHorizontal: 14, borderRadius: radius.pill,
    backgroundColor: colors.white, flexDirection: 'row', alignItems: 'center', gap: 8,
  },
  days: { flexDirection: 'row', gap: 6 },
  day: { flex: 1, height: 76, borderRadius: 16, alignItems: 'center', justifyContent: 'center', gap: 6 },
  group: { borderRadius: 22, backgroundColor: colors.mist, paddingHorizontal: 16, paddingVertical: 4 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, gap: 12 },
  divider: { borderBottomWidth: 1, borderBottomColor: colors.lineOnMist },
  time: { height: 34, paddingHorizontal: 14, borderRadius: radius.pill, backgroundColor: colors.white, justifyContent: 'center' },
});

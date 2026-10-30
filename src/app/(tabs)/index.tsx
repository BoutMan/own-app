import { Image } from 'expo-image';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import {
  Button,
  CTA,
  Gauge,
  Gutter,
  Heading,
  Logo,
  PhotoHeader,
  PhotoTile,
  Pill,
  Screen,
  ToneCard,
  Txt,
  WeekStrip,
} from '@/components';
import { activityDot } from '@/content/mock';
import { photos } from '@/content/photos';
import { useDb, useQuery } from '@/db/DbProvider';
import { blockReviewFor, ritualsOn, setRitual, testsAt } from '@/db/repositories';
import { blockForWeek, weekRule } from '@/domain/programme';
import { mondayOf } from '@/domain/engine/season';
import { formatLong, isoDate } from '@/lib/dates';
import type { DayPlan } from '@/features/onboarding/schedule';
import { useCycle, useProfile } from '@/features/profile/useProfile';
import { WhyCard } from '@/features/profile/WhyCard';
import { nextRitualValue, RITUALS, ritualsPercent } from '@/features/rituals/rituals';
import { useDeloadOffer } from '@/features/season/fatigue';
import { useTodayPlan } from '@/features/season/today';
import { colors } from '@/theme';

const legend = [
  { label: 'Strength', color: activityDot.strength },
  { label: 'Zone 2 walk', color: activityDot.zone2 },
  { label: 'Check-in', color: activityDot.checkIn },
] as const;

/** 12 · Today. Everything here comes from the device: programme position, logged sets, rituals, cycle, profile. */
export default function Today() {
  const plan = useTodayPlan();
  const profile = useProfile();
  const cycle = useCycle();
  const { write } = useDb();
  const todayKey = isoDate(new Date());
  const rituals = useQuery((db) => ritualsOn(db, todayKey), [todayKey]);
  const { session, week } = plan;
  const today = new Date();
  const hour = today.getHours();
  const moment = hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'evening';
  const weekDays = thisWeek(today, profile.weekPlan);
  const [day, setDay] = useState(weekDays.find((d) => d.isToday)?.key ?? weekDays[0]!.key);
  const adjustment = plan.adjustments[0];
  const deload = useDeloadOffer(plan);
  // Day-0 tests (guide p. 14) until taken; the block review from its week on (weeks 4, 8, 12).
  const todo = useQuery(
    (db) => {
      if (plan.season === null) return { day0: true, review: false };
      const review = weekRule(week).review;
      return {
        day0: Object.keys(testsAt(db, plan.season, 'day0')).length === 0,
        review: review !== undefined && !blockReviewFor(db, plan.season, review),
      };
    },
    [plan.season, week],
  );
  return (
    <Screen padTop={false}>
      <StatusBar style="light" />
      <PhotoHeader
        source={photos.greySetStretch}
        height={560}
        focus={{ top: '35%', left: '50%' }}
        top={
          <>
            <Logo color={colors.white} />
            <Pressable accessibilityRole="button" accessibilityLabel="Profile" onPress={() => router.navigate('/me')}>
              <Image source={photos.morningWalk} style={styles.avatar} contentPosition={{ top: '20%', left: '50%' }} />
            </Pressable>
          </>
        }
      >
        {cycle.advice ? <Pill label={cycle.advice.pill} dot size="sm" /> : null}
        <Txt variant="eyebrow" color="rgba(255,255,255,0.88)" style={{ letterSpacing: 1.44, marginTop: 4 }}>
          {`Today · Session ${session.letter}`}
        </Txt>
        <Heading variant="heroXL" on="photo" style={{ letterSpacing: -3.84, lineHeight: 59 }}>
          {session.name}
        </Heading>
        <Txt variant="body" size={14} color="rgba(255,255,255,0.9)">
          {`${session.minutes} min · ${session.focus} · ${profile.place}`}
        </Txt>
        <View style={styles.heroActions}>
          <CTA label="Start session" tone="light" glyph="play" style={{ flex: 1 }} onPress={() => router.push(`/session/${session.id}`)} />
          {/* The bare minimum (guide p. 53): counts as today's session. */}
          <Button label="10-min version" variant="ghost" onPress={() => router.push({ pathname: '/session/[id]', params: { id: session.id, variant: 'tenMin' } })} />
        </View>
      </PhotoHeader>

      <Gutter>
        <View style={{ gap: 4 }}>
          <Txt variant="meta" color={colors.grey}>
            {`${formatLong(today)} · week ${week} of 12`}
          </Txt>
          <Heading variant="h1" size={34} accent={moment}>
            {profile.firstName ? `Good ${moment}, ${profile.firstName}` : `Good ${moment}`}
          </Heading>
        </View>

        <View style={{ gap: 10 }}>
          <WeekStrip days={weekDays} selectedKey={day} onSelect={setDay} />
          <View style={styles.legend}>
            {legend.map((l) => (
              <View key={l.label} style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: l.color }]} />
                <Txt variant="small" color={colors.grey}>
                  {l.label}
                </Txt>
              </View>
            ))}
          </View>
        </View>

        {deload.offer ? (
          <View style={{ gap: 8 }}>
            <ToneCard tone="mauve" icon="leaf" eyebrow={deload.offer.reason === 'fatigue' ? 'Two signs of fatigue' : 'Stall'} title={deload.offer.title} text={deload.offer.text} />
            <Button label="Take my deload week now" variant="outline" onPress={deload.take} />
          </View>
        ) : null}
        {adjustment ? <ToneCard tone="vanilla" icon="leaf" eyebrow={`Week ${week}`} title={adjustment.title} text={adjustment.message} /> : null}
        {plan.plusOne ? (
          <ToneCard
            tone="latte"
            icon="sparkle"
            eyebrow="Your +1 today"
            title={plan.plusOne.title}
            text={adjustment && plan.plusOneLoad ? `${plan.plusOne.detail} ${adjustment.title}: ${plan.plusOneLoad} today.` : plan.plusOne.detail}
          />
        ) : (
          <ToneCard
            tone="latte"
            icon="sparkle"
            eyebrow="Your +1 today"
            title={plan.sessionsKept > 0 ? `New moves in ${session.name}` : 'Your first session sets the bar'}
            text={
              plan.sessionsKept > 0
                ? 'First time on these: find your loads today. From next time, we tell you exactly what to beat.'
                : 'Log your loads and reps: from the next session on, we tell you exactly what to beat.'
            }
          />
        )}

        {todo.review ? (
          <Pressable accessibilityRole="button" onPress={() => router.push(`/review/${blockForWeek(week).number}`)}>
            <ToneCard tone="fog" icon="flag" eyebrow={`End of block ${blockForWeek(week).number}`} title="Your block review" text="Five tests, seven markers, two lines. Then you see how far you came." />
          </Pressable>
        ) : todo.day0 && week <= 2 ? (
          <Pressable accessibilityRole="button" onPress={() => router.push('/tests/day0')}>
            <ToneCard tone="fog" icon="flag" eyebrow="Day 0" title="Take your five tests" text="Fifteen minutes, once. They are what you will beat on day 30." />
          </Pressable>
        ) : null}

        <View style={{ gap: 10 }}>
          <View style={styles.sectionHead}>
            <Heading variant="h2" accent="rituals">
              {"Today's rituals"}
            </Heading>
            <Txt variant="meta" color={colors.grey}>
              {`${ritualsPercent(rituals)}% of today`}
            </Txt>
          </View>
          {RITUALS.map((r) => {
            const v = rituals[r.kind] ?? 0;
            return (
              <Pressable
                key={r.kind}
                accessibilityRole="button"
                accessibilityLabel={`${r.label}, ${r.detail(v)}`}
                accessibilityHint={r.hint}
                onPress={() => write((db) => setRitual(db, todayKey, r.kind, nextRitualValue(r, v)))}
              >
                <Gauge label={r.label} detail={r.detail(v)} percent={(v / r.goal) * 100} tone={r.tone} icon={r.icon} done={v >= r.goal} />
              </Pressable>
            );
          })}
          <Txt variant="small" color={colors.grey}>
            Tap a ritual to add to it. Steps arrive with Apple Health.
          </Txt>
        </View>

        <View style={{ gap: 12 }}>
          <Heading variant="h2" accent="up">
            Coming up
          </Heading>
          <View style={styles.tiles}>
            <PhotoTile source={photos.matchaBowl} label="Sunday check-in" height={150} focus={{ top: '40%', left: '50%' }} style={{ flex: 1 }} onPress={() => router.push('/check-in')} />
            <PhotoTile
              source={photos.iceSkincare}
              label={cycle.position ? `Cycle · day ${cycle.position.day}` : 'Cycle'}
              height={150}
              style={{ flex: 1 }}
              onPress={() => router.push('/cycle')}
            />
          </View>
        </View>

        <WhyCard />
      </Gutter>
    </Screen>
  );
}

const WEEKDAY = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;

/** Dot of each weekday from the user's week (onboarding 6/7): strength, walk, and the Sunday check-in. */
function dotFor(plan: DayPlan | undefined, i: number): string | undefined {
  if (plan === 'session') return activityDot.strength;
  if (plan === 'walk') return activityDot.zone2;
  return i === 6 ? activityDot.checkIn : undefined;
}

function thisWeek(today: Date, plan: readonly DayPlan[]) {
  const monday = mondayOf(today);
  return WEEKDAY.map((weekday, i) => {
    const d = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + i);
    return { key: weekday.toLowerCase(), weekday, date: String(d.getDate()), dot: dotFor(plan[i], i), isToday: d.toDateString() === today.toDateString() };
  });
}

const styles = StyleSheet.create({
  avatar: { width: 44, height: 44, borderRadius: 22, borderWidth: 2, borderColor: colors.white },
  heroActions: { flexDirection: 'row', gap: 8, marginTop: 8 },
  legend: { flexDirection: 'row', gap: 14 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  legendDot: { width: 6, height: 6, borderRadius: 3 },
  sectionHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 },
  tiles: { flexDirection: 'row', gap: 8 },
});

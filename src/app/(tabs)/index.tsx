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
  QuoteCard,
  Screen,
  ToneCard,
  Txt,
  WeekStrip,
} from '@/components';
import { activityDot, mockToday, mockUser } from '@/content/mock';
import { photos } from '@/content/photos';
import { mondayOf } from '@/domain/engine/season';
import { formatLong } from '@/lib/dates';
import { useTodayPlan } from '@/features/season/today';
import { colors } from '@/theme';

const legend = [
  { label: 'Strength', color: activityDot.strength },
  { label: 'Zone 2 walk', color: activityDot.zone2 },
  { label: 'Check-in', color: activityDot.checkIn },
] as const;

/** 12 · Today. The session and the +1 come from the programme and the logged sets; rituals, cycle and why are still mock. */
export default function Today() {
  const t = mockToday;
  const plan = useTodayPlan();
  const { session, week } = plan;
  const today = new Date();
  const hour = today.getHours();
  const moment = hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'evening';
  const weekDays = thisWeek(today);
  const [day, setDay] = useState(weekDays.find((d) => d.isToday)?.key ?? weekDays[0]!.key);
  const adjustment = plan.adjustments[0];
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
        <Pill label={t.cyclePill} dot size="sm" />
        <Txt variant="eyebrow" color="rgba(255,255,255,0.88)" style={{ letterSpacing: 1.44, marginTop: 4 }}>
          {`Today · Session ${session.letter}`}
        </Txt>
        <Heading variant="heroXL" on="photo" style={{ letterSpacing: -3.84, lineHeight: 59 }}>
          {session.name}
        </Heading>
        <Txt variant="body" size={14} color="rgba(255,255,255,0.9)">
          {`${session.minutes} min · ${session.focus} · home`}
        </Txt>
        <View style={styles.heroActions}>
          <CTA label="Start session" tone="light" glyph="play" style={{ flex: 1 }} onPress={() => router.push(`/session/${session.id}`)} />
          {/* TODO(milestone 3): real 10-minute version from the "My week is complicated" rules. */}
          <Button label="10-min version" variant="ghost" onPress={() => router.push(`/session/${session.id}`)} />
        </View>
      </PhotoHeader>

      <Gutter>
        <View style={{ gap: 4 }}>
          <Txt variant="meta" color={colors.grey}>
            {`${formatLong(today)} · week ${week} of 12`}
          </Txt>
          <Heading variant="h1" size={34} accent={moment}>
            {`Good ${moment}, ${mockUser.firstName}`}
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

        <View style={{ gap: 10 }}>
          <View style={styles.sectionHead}>
            <Heading variant="h2" accent="rituals">
              {"Today's rituals"}
            </Heading>
            <Txt variant="meta" color={colors.grey}>
              {t.ritualsSummary}
            </Txt>
          </View>
          {t.rituals.map((r) => (
            <Gauge
              key={r.key}
              label={r.label}
              detail={r.detail}
              percent={r.percent}
              tone={r.tone}
              icon={r.icon}
              done={'done' in r && r.done}
            />
          ))}
        </View>

        <View style={{ gap: 12 }}>
          <Heading variant="h2" accent="up">
            Coming up
          </Heading>
          <View style={styles.tiles}>
            <PhotoTile source={photos.matchaBowl} label="Sunday check-in" height={150} focus={{ top: '40%', left: '50%' }} style={{ flex: 1 }} onPress={() => router.push('/check-in')} />
            <PhotoTile source={photos.iceSkincare} label={`Cycle · day ${t.cycleDay}`} height={150} style={{ flex: 1 }} onPress={() => router.push('/cycle')} />
          </View>
        </View>

        <QuoteCard quote={t.myWhy} caption="My why" actionLabel="Rewrite" />
      </Gutter>
    </Screen>
  );
}

// Activity of each weekday until the user's schedule is persisted (milestone 4): Mon/Wed/Fri strength, Sat walk, Sun check-in.
const PLAN_DOTS = [activityDot.strength, undefined, activityDot.strength, undefined, activityDot.strength, activityDot.zone2, activityDot.checkIn];
const WEEKDAY = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;

function thisWeek(today: Date) {
  const monday = mondayOf(today);
  return WEEKDAY.map((weekday, i) => {
    const d = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + i);
    return { key: weekday.toLowerCase(), weekday, date: String(d.getDate()), dot: PLAN_DOTS[i], isToday: d.toDateString() === today.toDateString() };
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

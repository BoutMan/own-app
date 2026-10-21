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
import { activityDot, mockToday, mockUser, mockWeek } from '@/content/mock';
import { photos } from '@/content/photos';
import { sessionsForWeek } from '@/domain/programme';
import { useCurrentWeek } from '@/features/season/currentWeek';
import { colors } from '@/theme';

const legend = [
  { label: 'Strength', color: activityDot.strength },
  { label: 'Zone 2 walk', color: activityDot.zone2 },
  { label: 'Check-in', color: activityDot.checkIn },
] as const;

/** 12 · Today. Static for now: data comes from content/mock until the session engine lands. */
export default function Today() {
  const [day, setDay] = useState('mon');
  const t = mockToday;
  const week = useCurrentWeek();
  // Monday's session until the schedule is persisted (milestone 4).
  const session = sessionsForWeek(week)[0]!;
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
            {t.dateLine}
          </Txt>
          <Heading variant="h1" size={34} accent="morning">
            {`Good morning, ${mockUser.firstName}`}
          </Heading>
        </View>

        <View style={{ gap: 10 }}>
          <WeekStrip days={mockWeek} selectedKey={day} onSelect={setDay} />
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

        <ToneCard tone="latte" icon="sparkle" eyebrow="Your +1 today" title={t.plusOne.title} text={t.plusOne.text} />

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

const styles = StyleSheet.create({
  avatar: { width: 44, height: 44, borderRadius: 22, borderWidth: 2, borderColor: colors.white },
  heroActions: { flexDirection: 'row', gap: 8, marginTop: 8 },
  legend: { flexDirection: 'row', gap: 14 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  legendDot: { width: 6, height: 6, borderRadius: 3 },
  sectionHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 },
  tiles: { flexDirection: 'row', gap: 8 },
});

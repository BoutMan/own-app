import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet, View } from 'react-native';

import {
  Gutter,
  Heading,
  Icon,
  LinkRow,
  Logo,
  PhotoHeader,
  PhotoTile,
  Pill,
  PlayGlyph,
  Screen,
  SeasonBar,
  Tag,
  ThumbRow,
  Txt,
} from '@/components';
import { mockSeason, mockWeekSessions } from '@/content/mock';
import { photos } from '@/content/photos';
import { sessionA } from '@/content/sessionA';
import { colors, radius } from '@/theme';

/** 16 · Programme — the 12-week season, this week's sessions, blocks to come. */
export default function Programme() {
  const s = mockSeason;
  return (
    <Screen padTop={false}>
      <StatusBar style="light" />
      <PhotoHeader
        source={photos.gymMirror}
        height={420}
        focus={{ top: '30%', left: '50%' }}
        top={
          <>
            <Logo color={colors.white} />
            <Pressable accessibilityRole="button" onPress={() => router.push('/library')} style={styles.libraryBtn}>
              <Icon name="grid" size={15} strokeWidth={1.8} />
              <Txt variant="meta" weight={600}>
                Library
              </Txt>
            </Pressable>
          </>
        }
      >
        <Pill label={s.range} dot size="sm" />
        <Heading variant="hero" size={60} on="photo" accent="one" style={{ letterSpacing: -3.6, lineHeight: 55 }}>
          Season one
        </Heading>
        <Txt variant="body" size={14} color="rgba(255,255,255,0.9)">{`12 weeks · 3 blocks · ${s.sessionsTotal} sessions`}</Txt>
      </PhotoHeader>

      <Gutter>
        <View style={styles.blockCard}>
          <View style={styles.rowBetween}>
            <Heading variant="h2" size={20} accent="1">
              Block 1 · Foundations
            </Heading>
            <Txt variant="meta" color={colors.grey}>{`Week ${s.week}`}</Txt>
          </View>
          <SeasonBar weeksDone={s.week - 1} currentWeekProgress={s.weekProgress} />
          <View style={styles.rowBetween}>
            {['Foundations', 'Building', 'Glow'].map((b) => (
              <Txt key={b} variant="small" color={colors.grey}>
                {b}
              </Txt>
            ))}
          </View>
        </View>

        <View style={{ gap: 10 }}>
          <View style={styles.rowBetween}>
            <Heading variant="h2" accent="week">
              This week
            </Heading>
            <Txt variant="meta" color={colors.grey}>
              3 sets · RPE 7
            </Txt>
          </View>

          <Pressable accessibilityRole="button" accessibilityLabel={`Start ${sessionA.name}`} onPress={() => router.push('/session/a')}>
            <PhotoTile source={photos.greySetStretch} height={210} rounded={24} focus={{ top: '35%', left: '50%' }} />
            <View style={styles.todayPill}>
              <Pill label="Today" active size="sm" />
            </View>
            <View style={styles.todayCard}>
              <View style={{ flex: 1, gap: 2 }}>
                <Txt variant="small" color={colors.grey}>{`${sessionA.letter} · Mon`}</Txt>
                <Txt variant="h2" size={22} style={{ letterSpacing: -0.88 }}>
                  {sessionA.name}
                </Txt>
                <Txt variant="small" color={colors.grey}>{`${sessionA.minutes} min · ${sessionA.summary}`}</Txt>
              </View>
              <View style={styles.play}>
                <PlayGlyph />
              </View>
            </View>
          </Pressable>

          {mockWeekSessions.map((w) => (
            <ThumbRow key={w.key} source={photos[w.photo]} title={w.name} text={w.text} right={<Tag label={w.day} tone={w.tone} weight={600} />} />
          ))}

          <LinkRow icon="timer" title="My week is complicated" text="Travel, period pain, 20 minutes: we adapt" onPress={() => router.push('/life-happens')} />
        </View>

        <View style={{ gap: 10 }}>
          <Heading variant="h2" accent="up">
            Coming up
          </Heading>
          <LinkRow tone="vanilla" icon="leaf" title="Week 4 · Deload" text="2 sets, loads −30 %. Then your block review." onPress={() => router.push('/review/1')} />
          <LinkRow tone="latte" icon="dumbbell" title="Block 2 · Building" text="Lower · Upper · Full body & cardio, 45 min" trailing="lock" />
          <LinkRow tone="mauve" icon="crown" title="Block 3 · Glow" text="Heaviest loads, finishers, tests in week 12" trailing="lock" />
        </View>
      </Gutter>
    </Screen>
  );
}

const styles = StyleSheet.create({
  libraryBtn: {
    height: 36, paddingHorizontal: 14, borderRadius: radius.pill, backgroundColor: colors.white,
    flexDirection: 'row', alignItems: 'center', gap: 6,
  },
  blockCard: { borderRadius: 24, borderWidth: 1, borderColor: colors.line, paddingVertical: 16, paddingHorizontal: 18, gap: 12 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  todayPill: { position: 'absolute', top: 12, left: 12 },
  todayCard: {
    position: 'absolute', left: 10, right: 10, bottom: 10, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.95)',
    paddingVertical: 12, paddingLeft: 16, paddingRight: 12, flexDirection: 'row', alignItems: 'center', gap: 12,
  },
  play: { width: 46, height: 46, borderRadius: 23, backgroundColor: colors.ink, alignItems: 'center', justifyContent: 'center' },
});

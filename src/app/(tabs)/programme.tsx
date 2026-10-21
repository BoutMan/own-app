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
import { photos, type PhotoKey } from '@/content/photos';
import { blockForWeek, blocks, formatRpe, sessionsForWeek, weekRule, type WeekNumber } from '@/domain/programme';
import { useSeasonSummary } from '@/features/season/today';
import { colors, radius, type Tone } from '@/theme';

// Weekday of each session until the user's own schedule is persisted (milestone 4).
const DAY_OF = { A: 'Mon', B: 'Wed', C: 'Fri' } as const;
const ROW_STYLE: { tone: Tone; photo: PhotoKey }[] = [
  { tone: 'latte', photo: 'backFlexRed' },
  { tone: 'mauve', photo: 'reverseLunge' },
];

/** 16 · Programme — the 12-week season, this week's sessions, blocks to come. */
export default function Programme() {
  const s = useSeasonSummary();
  const week = s.week;
  const block = blockForWeek(week);
  const today = s.plan.session;
  const rest = sessionsForWeek(week).filter((x) => x.id !== today.id);
  const done = s.plan.doneThisWeek;
  const rule = weekRule(week);
  const deloadWeek = block.weeks.find((w) => weekRule(w).phase === 'deload' || weekRule(w).phase === 'test');
  const deload = deloadWeek && deloadWeek > week ? weekRule(deloadWeek as WeekNumber) : undefined;
  const nextBlocks = blocks.filter((b) => b.number > block.number);
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
            <Heading variant="h2" size={20} accent={String(block.number)}>
              {`Block ${block.number} · ${block.name}`}
            </Heading>
            <Txt variant="meta" color={colors.grey}>{`Week ${week}`}</Txt>
          </View>
          <SeasonBar weeksDone={week - 1} currentWeekProgress={s.weekProgress} />
          <View style={styles.rowBetween}>
            {blocks.map((b) => (
              <Txt key={b.number} variant="small" color={b.number === block.number ? colors.ink : colors.grey}>
                {b.name}
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
              {`${rule.maxSets ? `${rule.maxSets} sets` : 'Full sets'} · ${formatRpe(rule.rpe ?? block.rpe)}`}
            </Txt>
          </View>

          <Pressable accessibilityRole="button" accessibilityLabel={`Start ${today.name}`} onPress={() => router.push(`/session/${today.id}`)}>
            <PhotoTile source={photos.greySetStretch} height={210} rounded={24} focus={{ top: '35%', left: '50%' }} />
            <View style={styles.todayPill}>
              <Pill label={s.plan.weekComplete ? 'Week done' : 'Today'} active size="sm" />
            </View>
            <View style={styles.todayCard}>
              <View style={{ flex: 1, gap: 2 }}>
                <Txt variant="small" color={colors.grey}>{`${today.letter} · ${s.plan.weekComplete ? 'week complete' : 'next up'}`}</Txt>
                <Txt variant="h2" size={22} style={{ letterSpacing: -0.88 }}>
                  {today.name}
                </Txt>
                <Txt variant="small" color={colors.grey}>{`${today.minutes} min · ${today.focus}`}</Txt>
              </View>
              <View style={styles.play}>
                <PlayGlyph />
              </View>
            </View>
          </Pressable>

          {rest.map((session, i) => (
            <ThumbRow
              key={session.id}
              source={photos[ROW_STYLE[i]!.photo]}
              title={session.name}
              text={`${session.minutes} min · ${session.focus}`}
              right={<Tag label={done.includes(session.id) ? 'Done' : DAY_OF[session.letter]} tone={ROW_STYLE[i]!.tone} weight={600} />}
              onPress={() => router.push(`/session/${session.id}`)}
            />
          ))}
          <ThumbRow
            source={photos.trackStretch}
            title="Zone 2 walk"
            text={`30–45 min · ${block.cardioPerWeek > 1 ? `${block.cardioPerWeek} a week` : 'the sentence test'}`}
            right={<Tag label="Sat" tone="fog" weight={600} />}
          />

          <LinkRow icon="timer" title="My week is complicated" text="Travel, period pain, 20 minutes: we adapt" onPress={() => router.push('/life-happens')} />
        </View>

        <View style={{ gap: 10 }}>
          <Heading variant="h2" accent="up">
            Coming up
          </Heading>
          {deload ? (
            <LinkRow
              tone="vanilla"
              icon="leaf"
              title={`Week ${deload.week} · ${deload.phase === 'test' ? 'Tests' : 'Deload'}`}
              text={deload.phase === 'test' ? 'Loads −20 %, then the five tests.' : `${deload.maxSets} sets, loads −${Math.round((1 - (deload.loadFactor ?? 1)) * 100)} %. Then your block review.`}
              onPress={() => router.push(`/review/${block.number}`)}
            />
          ) : null}
          {nextBlocks.map((b) => (
            <LinkRow
              key={b.number}
              tone={b.number === 2 ? 'latte' : 'mauve'}
              icon={b.number === 2 ? 'dumbbell' : 'crown'}
              title={`Block ${b.number} · ${b.name}`}
              text={`${b.sessions.map((x) => x.name).join(' · ')}, ${b.sessions[0].minutes} min`}
              trailing="lock"
            />
          ))}
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

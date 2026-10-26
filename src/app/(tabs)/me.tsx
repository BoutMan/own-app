import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet, View } from 'react-native';

import {
  Button,
  CircleButton,
  Gauge,
  Gutter,
  Heading,
  Icon,
  Logo,
  PhotoHeader,
  PhotoTile,
  Pill,
  Screen,
  SeasonBar,
  StatTiles,
  Txt,
  type IconName,
} from '@/components';
import { useQuery } from '@/db/DbProvider';
import { activeDays, badgeStats, minutesTrained, seasonGoals } from '@/db/repositories';
import { badges as computeBadges, badgeShelf, type BadgeId } from '@/domain/badges';
import { blockForWeek } from '@/domain/programme';
import { useCycle, useProfile } from '@/features/profile/useProfile';
import { WhyCard } from '@/features/profile/WhyCard';
import { useSeasonSummary } from '@/features/season/today';
import { photos, type PhotoKey } from '@/content/photos';
import { colors, tones, type Tone } from '@/theme';

const badgeLook: Record<BadgeId, { tone: Tone; icon: IconName }> = {
  firstWeek: { tone: 'vanilla', icon: 'star' },
  sessions10: { tone: 'latte', icon: 'dumbbell' },
  firstDeload: { tone: 'fog', icon: 'leaf' },
  firstReview: { tone: 'mauve', icon: 'flag' },
  floorPushUp: { tone: 'vanilla', icon: 'bolt' },
  sessions30: { tone: 'latte', icon: 'dumbbell' },
  fullSeason: { tone: 'mauve', icon: 'crown' },
  sessions100: { tone: 'fog', icon: 'star' },
};

type SpaceTile = { label: string; photo: PhotoKey; href: '/circle' | '/cycle' | '/review/1' | '/my-contract'; lock?: boolean };

const goalStyle: Record<string, { tone: Tone; icon: IconName }> = {
  performance: { tone: 'vanilla', icon: 'dumbbell' },
  sensation: { tone: 'fog', icon: 'heart' },
  free: { tone: 'mauve', icon: 'star' },
};

function formatMinutes(min: number): string {
  const h = Math.floor(min / 60);
  const m = Math.round(min % 60);
  return h > 0 ? `${h}h${String(m).padStart(2, '0')}` : `${m} min`;
}

/** 25 · Me — profile, season, my why, goals, badges, shortcuts, plan. */
export default function Me() {
  const s = useSeasonSummary();
  const profile = useProfile();
  const cycle = useCycle();
  const season = s.plan.season;
  const data = useQuery(
    (db) =>
      season === null
        ? { goals: [], minutes: 0, active: 0 }
        : { goals: seasonGoals(db, season), minutes: minutesTrained(db, season), active: activeDays(db, s.plan.startDate.toISOString()) },
    [season, s.plan.startDate],
  );
  const block = blockForWeek(s.week);
  const allBadges = computeBadges(useQuery((db) => badgeStats(db)));
  const shelf = badgeShelf(allBadges);
  const space: SpaceTile[] = [
    { label: 'My contract', photo: 'gymMirror', href: '/my-contract' },
    { label: 'Photo vault', photo: 'kettlebellPink2', href: '/review/1', lock: true },
    { label: cycle.position ? `My cycle · day ${cycle.position.day}` : 'My cycle', photo: 'iceSkincare', href: '/cycle' },
    { label: 'My circle', photo: 'streetAbsMatcha', href: '/circle' },
  ];
  return (
    <Screen padTop={false}>
      <StatusBar style="light" />
      <PhotoHeader
        source={photos.morningWalk}
        height={440}
        focus={{ top: '30%', left: '50%' }}
        top={
          <>
            <Logo color={colors.white} />
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <CircleButton icon="share" surface="white" accessibilityLabel="Share my profile" />
              <CircleButton icon="settings" surface="white" accessibilityLabel="Settings" onPress={() => router.push('/settings')} />
            </View>
          </>
        }
      >
        <Pill label={`Season ${s.number} · week ${s.week} of 12`} dot size="sm" />
        <View style={styles.nameRow}>
          <View style={{ gap: 6, flex: 1 }}>
            <Heading variant="heroXL" on="photo" style={{ letterSpacing: -4.16, lineHeight: 58 }}>
              {profile.firstName ?? 'Me'}
            </Heading>
            {profile.feelings.length ? (
              <Txt variant="body" size={14} color="rgba(255,255,255,0.9)">
                {profile.feelings.join(' · ')}
              </Txt>
            ) : null}
          </View>
          <Button label="Edit profile" variant="ghost" style={{ height: 36, paddingHorizontal: 14 }} onPress={() => router.push('/settings')} />
        </View>
      </PhotoHeader>

      <Gutter>
        <View style={styles.seasonCard}>
          <View style={styles.rowBetween}>
            <Heading variant="h2" size={20} accent={s.number}>
              {`Season ${s.number}`}
            </Heading>
            <Txt variant="meta" color={colors.grey}>{`Day ${s.day} of ${s.days}`}</Txt>
          </View>
          <SeasonBar weeksDone={s.week - 1} currentWeekProgress={s.weekProgress} />
          <View style={styles.rowBetween}>
            {[`Started ${s.started}`, `Block ${block.number} · ${block.name}`, `Ends ${s.ends}`].map((l) => (
              <Txt key={l} variant="small" color={colors.grey}>
                {l}
              </Txt>
            ))}
          </View>
        </View>

        <StatTiles
          stats={[
            { value: String(s.sessionsKept), label: 'sessions kept', tone: 'vanilla' },
            { value: formatMinutes(data.minutes), label: 'just for me', tone: 'mauve' },
            { value: String(data.active), label: 'active days', tone: 'fog' },
          ]}
        />

        <WhyCard caption={`My why · ${s.started}`} />

        <View style={{ gap: 10 }}>
          <View style={styles.rowBetween}>
            <Heading variant="h2" accent="goals">
              My goals
            </Heading>
            <Txt variant="meta" color={colors.grey}>
              {`${data.goals.length} for this season`}
            </Txt>
          </View>
          {data.goals.length === 0 ? (
            <Txt variant="meta" color={colors.grey}>
              Your goals are set when you start a season. They are measured at each block review.
            </Txt>
          ) : (
            data.goals.map((g) => (
              <Gauge
                key={g.id}
                label={g.text}
                detail={g.progress == null ? (g.baseline ? `Today: ${g.baseline} · measured at the block review` : 'Measured at the block review') : `${g.progress}% there`}
                percent={g.progress ?? 0}
                tone={goalStyle[g.slot]!.tone}
                icon={goalStyle[g.slot]!.icon}
                value={g.progress == null ? '–' : undefined}
              />
            ))
          )}
        </View>

        <View style={{ gap: 12 }}>
          <View style={styles.rowBetween}>
            <Heading variant="h2" accent="badges">
              My badges
            </Heading>
            <Txt variant="meta" color={colors.grey}>
              {`${allBadges.filter((b) => b.earned).length} of ${allBadges.length}`}
            </Txt>
          </View>
          <View style={styles.badges}>
            {shelf.map((b) => {
              const look = badgeLook[b.id];
              return (
                <View key={b.id} style={styles.badge} accessibilityLabel={b.earned ? `${b.label}, earned` : `${b.label}, not yet`}>
                  <View style={[styles.badgeCircle, b.earned ? { backgroundColor: tones[look.tone].bg, borderWidth: 1.5, borderColor: tones[look.tone].ring } : styles.badgeLocked]}>
                    {!b.earned && b.toGo !== undefined ? (
                      <Txt variant="h2" size={20} color="#9A948D">
                        {String(b.goal)}
                      </Txt>
                    ) : (
                      <Icon name={b.earned ? look.icon : 'lock'} size={22} strokeWidth={1.7} color={b.earned ? tones[look.tone].strong : '#9A948D'} />
                    )}
                  </View>
                  <Txt variant="small" weight={b.earned ? 600 : 400} color={b.earned ? colors.ink : colors.grey} style={{ textAlign: 'center' }}>
                    {!b.earned && b.toGo !== undefined ? `${b.toGo} to go` : b.label}
                  </Txt>
                </View>
              );
            })}
          </View>
        </View>

        <View style={{ gap: 12 }}>
          <Heading variant="h2" accent="space">
            My space
          </Heading>
          <View style={styles.grid}>
            {space.map((t) => (
              <PhotoTile
                key={t.label}
                source={photos[t.photo]}
                label={t.label}
                height={132}
                style={styles.gridItem}
                onPress={() => router.push(t.href)}
              />
            ))}
          </View>
        </View>

        <Pressable accessibilityRole="button" onPress={() => router.push('/settings/subscription')} style={styles.plan}>
          <View style={styles.planLogo}>
            <Txt variant="logo" size={15} color={colors.white}>
              o.
            </Txt>
          </View>
          <View style={{ flex: 1, gap: 2 }}>
            <Txt variant="bodyStrong">Own Yearly</Txt>
            <Txt variant="small" color={colors.grey}>
              Free trial · ends Nov 2
            </Txt>
          </View>
          <Icon name="chevronRight" size={14} strokeWidth={2} color={colors.grey} />
        </Pressable>

        {__DEV__ ? <Button label="Open kitchen sink (dev)" variant="outline" onPress={() => router.push('/dev/kitchen-sink')} /> : null}
      </Gutter>
    </Screen>
  );
}

const styles = StyleSheet.create({
  nameRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', gap: 12 },
  seasonCard: { borderRadius: 24, borderWidth: 1, borderColor: colors.line, paddingVertical: 16, paddingHorizontal: 18, gap: 12 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  badges: { flexDirection: 'row', gap: 8 },
  badge: { flex: 1, alignItems: 'center', gap: 6 },
  badgeCircle: { width: 68, height: 68, borderRadius: 34, alignItems: 'center', justifyContent: 'center' },
  badgeLocked: { borderWidth: 1.5, borderStyle: 'dashed', borderColor: colors.radioOff },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  gridItem: { width: '48.8%' },
  plan: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 14, paddingHorizontal: 16, borderRadius: 22, backgroundColor: colors.mist },
  planLogo: { width: 40, height: 40, borderRadius: 12, backgroundColor: colors.ink, alignItems: 'center', justifyContent: 'center' },
});

import { router } from 'expo-router';
import { Image } from 'expo-image';
import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Gauge, Gutter, Heading, Icon, Logo, PhotoHeader, Pill, Screen, StatTiles, Txt } from '@/components';
import { blockForWeek, checkpoints } from '@/domain/programme';
import { useUnits } from '@/features/season/currentWeek';
import { useGlowCard, useMarkers } from '@/features/season/glow';
import { useSeasonSummary } from '@/features/season/today';
import { photos } from '@/content/photos';
import { CHECKPOINT_LABEL, CHECKPOINT_WEEK } from '@/features/vault/poses';
import { useVault } from '@/features/vault/useVault';
import { useVaultLock } from '@/features/vault/VaultLock';
import { addDays, formatShort } from '@/lib/dates';
import { colors, radius, tones } from '@/theme';

/** 15 · Progress — glow card, counters, the seven markers against day 0, photo vault. */
export default function Progress() {
  const s = useSeasonSummary();
  const vaultLock = useVaultLock();
  const vault = useVault(s.plan.season);
  const dayZero = vault.at('day0', 'front');
  const nextCheckpoint = checkpoints.find((c) => c !== 'day0' && !vault.at(c, 'front'));
  const nextPhoto = nextCheckpoint ? { checkpoint: nextCheckpoint, date: addDays(s.plan.startDate, (CHECKPOINT_WEEK[nextCheckpoint] - 1) * 7 + 6) } : null;
  const units = useUnits();
  const markers = useMarkers(s.plan.season);
  const w = useGlowCard(s.plan, markers, units);
  const rated = markers.filter((m) => m.now != null || m.day0 != null);
  const insets = useSafeAreaInsets();
  return (
    <Screen padTop={false}>
      <StatusBar style="light" />
      <PhotoHeader
        source={photos.backFlexRed}
        height={520}
        focus={{ top: '30%', left: '50%' }}
        top={
          <>
            <Logo color={colors.white} />
            <Pill label={`Season ${s.number} · week ${s.week}`} dot size="sm" />
          </>
        }
      >
        {/* Glow card sharing (24) is V1: the button is shown but inert. */}
        <Pressable accessibilityRole="button" style={styles.shareBtn}>
          <Icon name="share" size={16} strokeWidth={1.8} />
          <Txt variant="body" weight={600}>
            Share my glow card
          </Txt>
        </Pressable>
      </PhotoHeader>
      <View style={[styles.weekCard, { top: Math.max(insets.top, 20) + 64 }]}>
        <Heading variant="h2" size={24} accent={w.accent} style={{ letterSpacing: -0.96, lineHeight: 24 }}>
          {w.title}
        </Heading>
        <Txt variant="tab" color={colors.grey}>
          {w.range}
        </Txt>
        {w.lines.map((l, i) => (
          <View key={l} style={{ flexDirection: 'row', gap: 8 }}>
            <Txt variant="meta" weight={700} color={colors.cocoa}>
              {String(i + 1)}
            </Txt>
            <Txt variant="meta">{l}</Txt>
          </View>
        ))}
      </View>

      <Gutter>
        <View style={styles.titleRow}>
          <View style={{ gap: 4, flex: 1 }}>
            <Txt variant="meta" color={colors.grey}>{`Season ${s.number} · day ${s.day} of ${s.days}`}</Txt>
            <Heading variant="h1" size={44} accent="glow">
              Your glow
            </Heading>
          </View>
          <Pressable accessibilityRole="button" onPress={() => router.push(`/review/${blockForWeek(s.week).number}`)} style={styles.reviewBtn}>
            <Txt variant="meta" weight={500}>
              Block review
            </Txt>
            <Icon name="chevronRight" size={13} strokeWidth={2} />
          </Pressable>
        </View>

        <StatTiles
          stats={[
            { value: String(s.sessionsKept), label: 'sessions kept', tone: 'vanilla' },
            { value: String(s.sessionsTotal - s.sessionsKept), label: `to go of ${s.sessionsTotal}`, tone: 'latte' },
            { value: String(s.plan.restarts), label: 'missed twice', tone: 'mauve' },
          ]}
        />

        <View style={{ gap: 8 }}>
          <View style={styles.rowBetween}>
            <Heading variant="h2" accent="markers">
              Seven markers
            </Heading>
            <Txt variant="meta" color={colors.grey}>
              out of 10
            </Txt>
          </View>
          <View style={styles.legend}>
            <View style={styles.legendItem}>
              <View style={styles.legendDash} />
              <Txt variant="small" color={colors.grey}>
                Day 0
              </Txt>
            </View>
            <View style={styles.legendItem}>
              <View style={styles.legendFill} />
              <Txt variant="small" color={colors.grey}>
                Now, out of 10
              </Txt>
            </View>
          </View>
          {rated.length === 0 ? (
            <Txt variant="meta" color={colors.grey}>
              Rate them at the start of your season, then at each block review and in the Sunday check-in.
            </Txt>
          ) : (
            rated.map((m) => {
              const now = m.now ?? m.day0!;
              const diff = m.day0 != null && m.now != null ? m.now - m.day0 : null;
              return (
                <Gauge
                  key={m.id}
                  label={m.label}
                  detail={m.day0 != null ? `Day 0: ${m.day0} · now: ${now}` : `Now: ${now}`}
                  percent={now * 10}
                  baseline={m.day0 != null ? m.day0 * 10 : undefined}
                  tone={m.tone}
                  icon={m.icon}
                  value={diff == null ? `${now}/10` : `${diff >= 0 ? '+' : ''}${diff}`}
                  height={58}
                />
              );
            })
          )}
        </View>

        <View style={{ gap: 12 }}>
          <View style={styles.rowBetween}>
            <Heading variant="h2" accent="vault">
              Photo vault
            </Heading>
            <Txt variant="meta" color={colors.grey}>
              Private · only you
            </Txt>
          </View>
          {/* Own photos only once the vault is unlocked (Face ID); otherwise a lock, never a blurred body. */}
          <Pressable style={styles.vault} onPress={() => router.push('/vault')} accessibilityRole="button" accessibilityLabel="Open the photo vault">
            {vaultLock.open && dayZero ? (
              <View style={[styles.locked, { flex: 1 }]}>
                <Image source={{ uri: dayZero.fileUri }} style={StyleSheet.absoluteFill} contentFit="cover" />
                <View style={styles.tilePill}>
                  <Pill label="Day 0" />
                </View>
              </View>
            ) : (
              <View style={[styles.locked, { flex: 1 }]}>
                <View style={styles.lockedCenter}>
                  <View style={styles.lockCircle}>
                    <Icon name={dayZero ? 'lock' : 'plankMark'} size={18} strokeWidth={1.8} />
                  </View>
                  <Pill label={dayZero ? 'Day 0 · locked' : 'Day 0 · take them'} />
                </View>
              </View>
            )}
            <View style={[styles.locked, { flex: 1 }]}>
              <View style={styles.lockedCenter}>
                <View style={styles.lockCircle}>
                  <Icon name="lock" size={18} strokeWidth={1.8} />
                </View>
                <Pill label={nextPhoto ? `${CHECKPOINT_LABEL[nextPhoto.checkpoint]} · ${formatShort(nextPhoto.date)}` : 'Season complete'} />
              </View>
            </View>
          </Pressable>
        </View>
      </Gutter>
    </Screen>
  );
}

const styles = StyleSheet.create({
  shareBtn: {
    height: 52, borderRadius: radius.pill, backgroundColor: colors.white, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'center', gap: 8,
  },
  weekCard: {
    position: 'absolute', left: 28, width: 196, borderRadius: 20, backgroundColor: colors.white, padding: 16, gap: 8,
    shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 14, shadowOffset: { width: 0, height: 8 }, elevation: 4,
  },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', gap: 12 },
  reviewBtn: { height: 36, paddingHorizontal: 14, borderRadius: radius.pill, backgroundColor: colors.mist, flexDirection: 'row', alignItems: 'center', gap: 6 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  legend: { flexDirection: 'row', gap: 14 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDash: { width: 0, height: 12, borderLeftWidth: 1.5, borderStyle: 'dashed', borderColor: '#9A948D' },
  legendFill: { width: 14, height: 8, borderRadius: 3, backgroundColor: tones.latte.bg, borderRightWidth: 2, borderRightColor: colors.cocoa },
  vault: { flexDirection: 'row', gap: 8 },
  locked: { height: 210, borderRadius: 22, overflow: 'hidden', backgroundColor: '#F1EFEB' },
  lockedCenter: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 },
  tilePill: { position: 'absolute', left: 12, bottom: 12 },
  lockCircle: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center' },
});

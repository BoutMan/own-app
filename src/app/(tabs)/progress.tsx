import { router } from 'expo-router';
import { Image } from 'expo-image';
import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Gauge, Gutter, Heading, Icon, Logo, PhotoHeader, PhotoTile, Pill, Screen, StatTiles, Txt } from '@/components';
import { mockMarkers, mockSeason, mockWeekCard } from '@/content/mock';
import { photos } from '@/content/photos';
import { colors, radius, tones } from '@/theme';

/** 15 · Progress — glow card, counters, the seven markers against day 0, photo vault. */
export default function Progress() {
  const s = mockSeason;
  const w = mockWeekCard;
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
          <Pressable accessibilityRole="button" onPress={() => router.push('/review/1')} style={styles.reviewBtn}>
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
            { value: '0', label: 'missed twice', tone: 'mauve' },
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
          {mockMarkers.map((m) => (
            <Gauge
              key={m.label}
              label={m.label}
              detail={`Day 0: ${m.day0} · now: ${m.now}`}
              percent={m.now * 10}
              baseline={m.day0 * 10}
              tone={m.tone}
              icon={m.icon}
              value={`${m.now - m.day0 >= 0 ? '+' : ''}${m.now - m.day0}`}
              height={58}
            />
          ))}
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
          {/* TODO(milestone 5): real on-device vault behind Face ID. Photos never leave the phone. */}
          <View style={styles.vault}>
            <PhotoTile source={photos.kettlebellPink} label="Day 0" height={210} style={{ flex: 1 }} />
            <View style={[styles.locked, { flex: 1 }]}>
              <Image source={photos.kettlebellPink} style={StyleSheet.absoluteFill} blurRadius={24} />
              <View style={styles.lockedCenter}>
                <View style={styles.lockCircle}>
                  <Icon name="lock" size={18} strokeWidth={1.8} />
                </View>
                <Pill label="Day 30 · Nov 4" />
              </View>
            </View>
          </View>
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
  lockCircle: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center' },
});

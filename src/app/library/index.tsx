import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { CircleButton, Heading, Icon, Pill, PlayGlyph, Screen, Tag, Txt } from '@/components';
import { exercisePhoto, familyLabels } from '@/content/exerciseMedia';
import { exercises, type ExerciseFamily } from '@/content/exercises';
import { photos } from '@/content/photos';
import { blockForWeek, exerciseIdsInBlock } from '@/domain/programme';
import { useCurrentWeek } from '@/features/season/currentWeek';
import { colors, fontFamilyFor, photoHeader, radius, tones } from '@/theme';

const FAMILIES = Object.keys(familyLabels) as ExerciseFamily[];
// Move of the week: picked by hand for now (glute bridge · hip thrust, card 3).
const MOVE_OF_THE_WEEK = 'glute-bridge';

/** 17 · Exercise library — the 35 cards of the guide, search and family filters. */
export default function Library() {
  const [query, setQuery] = useState('');
  const [family, setFamily] = useState<ExerciseFamily | 'all'>('all');
  const [showAll, setShowAll] = useState(false);

  const block = blockForWeek(useCurrentWeek());
  const blockIds = useMemo(() => new Set(exerciseIdsInBlock(block)), [block]);
  const filtering = query.trim() !== '' || family !== 'all' || showAll;
  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return exercises.filter(
      (e) =>
        (family === 'all' || e.family === family) &&
        (!q || e.name.toLowerCase().includes(q) || e.muscles.some((m) => m.toLowerCase().includes(q))) &&
        (filtering || blockIds.has(e.id)),
    );
  }, [query, family, filtering, blockIds]);
  const motw = exercises.find((e) => e.id === MOVE_OF_THE_WEEK)!;

  return (
    <Screen gap={18} contentStyle={{ paddingHorizontal: 20 }}>
      <View style={styles.rowBetween}>
        <CircleButton icon="chevronLeft" accessibilityLabel="Back" onPress={() => router.back()} />
        <Pill label={`${exercises.length} moves · ${FAMILIES.length} families`} dot surface="mist" size="sm" />
      </View>
      <View style={{ gap: 6 }}>
        <Heading variant="h1" size={44} accent="library">
          The library
        </Heading>
        <Txt variant="body" size={14} color={colors.grey}>
          Every move, a home and a gym version.
        </Txt>
      </View>

      <View style={styles.search}>
        <Icon name="search" size={18} strokeWidth={1.8} color={colors.grey} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search a move or a muscle"
          placeholderTextColor={colors.grey}
          accessibilityLabel="Search a move"
          style={styles.searchInput}
        />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginRight: -20 }} contentContainerStyle={{ gap: 8, paddingRight: 20 }}>
        {(['all', ...FAMILIES] as const).map((f) => {
          const active = family === f;
          const t = f === 'all' ? null : tones[familyLabels[f].tone];
          return (
            <Pressable
              key={f}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              onPress={() => setFamily(f)}
              style={[styles.chip, { backgroundColor: active ? colors.ink : t ? t.bg : colors.mist }]}
            >
              <Txt variant="meta" weight={active ? 500 : 400} color={active ? colors.white : t ? t.strong : colors.ink}>
                {f === 'all' ? 'All' : familyLabels[f].label}
              </Txt>
            </Pressable>
          );
        })}
      </ScrollView>

      {!filtering ? (
        <Pressable accessibilityRole="button" accessibilityLabel={`Open ${motw.name}`} onPress={() => router.push(`/library/${motw.id}`)} style={styles.motw}>
          <Image source={photos[exercisePhoto(motw.id, motw.family)]} style={StyleSheet.absoluteFill} contentFit="cover" />
          <LinearGradient colors={photoHeader.gradient} locations={photoHeader.gradientStops} style={StyleSheet.absoluteFill} />
          <View pointerEvents="none" style={styles.motwFrame} />
          <View style={styles.motwTop}>
            <Pill label="Move of the week" dot size="sm" />
          </View>
          <View style={styles.motwBottom}>
            <Heading variant="hero" size={46} on="photo" accent="thrust" style={{ letterSpacing: -2.76, lineHeight: 43 }}>
              Hip thrust
            </Heading>
            <View style={styles.rowBetween}>
              <Txt variant="body" size={14} color="rgba(255,255,255,0.9)">
                {motw.muscles.join(' · ')}
              </Txt>
              <View style={styles.playBig}>
                <PlayGlyph color={colors.ink} />
              </View>
            </View>
          </View>
        </Pressable>
      ) : null}

      <View style={{ gap: 12 }}>
        <View style={[styles.rowBetween, { alignItems: 'baseline' }]}>
          <Heading variant="h2" accent={filtering ? 'moves' : 'block'}>
            {filtering ? 'All moves' : 'Your block'}
          </Heading>
          <Txt variant="meta" color={colors.grey}>
            {filtering ? `${list.length} found` : `${block.name} · ${list.length} moves`}
          </Txt>
        </View>
        <View style={styles.grid}>
          {list.map((e) => (
            <Pressable key={e.id} accessibilityRole="button" accessibilityLabel={e.name} onPress={() => router.push(`/library/${e.id}`)} style={styles.card}>
              <View style={styles.cardPhoto}>
                <Image source={photos[exercisePhoto(e.id, e.family)]} style={StyleSheet.absoluteFill} contentFit="cover" />
                <View style={styles.cardTag}>
                  <Tag label={familyLabels[e.family].short} tone={familyLabels[e.family].tone} />
                </View>
                <View style={styles.playSmall}>
                  <PlayGlyph size={12} color={colors.ink} />
                </View>
              </View>
              <View style={{ gap: 2, paddingHorizontal: 2 }}>
                <Txt variant="bodyStrong" numberOfLines={1}>
                  {e.name}
                </Txt>
                <Txt variant="small" color={colors.grey} numberOfLines={1}>
                  {e.muscles.join(' · ')}
                </Txt>
              </View>
            </Pressable>
          ))}
        </View>
        {list.length === 0 ? (
          <Txt variant="body" color={colors.grey}>
            No move matches. Try a muscle, like “glutes”.
          </Txt>
        ) : null}
      </View>

      {!filtering ? (
        <Pressable accessibilityRole="button" onPress={() => setShowAll(true)} style={styles.seeAll}>
          <Txt variant="body" weight={500}>{`See all ${exercises.length} moves`}</Txt>
        </Pressable>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 10 },
  search: { height: 50, borderRadius: radius.pill, backgroundColor: colors.mist, flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 18 },
  searchInput: { flex: 1, fontFamily: fontFamilyFor(400), fontSize: 15, color: colors.ink, padding: 0 },
  chip: { height: 36, paddingHorizontal: 14, borderRadius: radius.pill, justifyContent: 'center' },
  motw: { height: 300, borderRadius: 28, overflow: 'hidden' },
  motwFrame: { position: 'absolute', top: 12, left: 12, right: 12, bottom: 12, borderRadius: 22, borderWidth: 1, borderColor: photoHeader.frameColor },
  motwTop: { position: 'absolute', top: 26, left: 28 },
  motwBottom: { position: 'absolute', left: 28, right: 28, bottom: 26, gap: 8 },
  playBig: { width: 46, height: 46, borderRadius: 23, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', columnGap: 10, rowGap: 16 },
  card: { width: '48.5%', gap: 8 },
  cardPhoto: { height: 176, borderRadius: 22, overflow: 'hidden', backgroundColor: colors.mist },
  cardTag: { position: 'absolute', top: 10, left: 10 },
  playSmall: { position: 'absolute', right: 10, bottom: 10, width: 32, height: 32, borderRadius: 16, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center' },
  seeAll: { height: 52, borderRadius: radius.pill, backgroundColor: colors.mist, alignItems: 'center', justifyContent: 'center' },
});

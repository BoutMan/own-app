import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { CircleButton, Heading, Icon, ListGroup, ListRow, Pill, Screen, Switch, Txt, type IconName } from '@/components';
import { photos } from '@/content/photos';
import { colors, photoHeader, radius, tones, type Tone } from '@/theme';

type Place = { icon: IconName; tone: Tone | null; title: string; text: string; items: string[]; never?: boolean };

// Every promise on this screen must hold in the implementation (CLAUDE.md, rules 1 and 2).
const places: Place[] = [
  { icon: 'phone', tone: 'vanilla', title: 'Only on your phone', text: "We can't see it, even if we wanted to", items: ['Progress photos', 'Photo vault', 'Measurements'] },
  { icon: 'cloud', tone: 'fog', title: 'In your account, encrypted', text: 'So you never lose a season', items: ['Workouts & loads', 'Cycle', 'Health answers'] },
  { icon: 'ban', tone: null, title: 'Never shared with', text: 'Not now, not later, not for a discount', items: ['Advertisers', 'Data brokers', 'Insurers', 'Employers'], never: true },
];

/** 28 · Data & privacy. */
export default function Privacy() {
  const [health, setHealth] = useState(true);
  const [stats, setStats] = useState(true);
  const [offers, setOffers] = useState(false);
  return (
    <Screen gap={22} contentStyle={{ paddingHorizontal: 20 }}>
      <View style={styles.header}>
        <CircleButton icon="chevronLeft" accessibilityLabel="Back" onPress={() => router.back()} />
        <Txt variant="meta" color={colors.grey}>
          Data & privacy
        </Txt>
        <View style={{ width: 44 }} />
      </View>

      <View style={styles.hero}>
        <Image source={photos.sheetMask} style={StyleSheet.absoluteFill} contentFit="cover" contentPosition={{ top: '25%', left: '50%' }} />
        <LinearGradient colors={photoHeader.gradient} locations={photoHeader.gradientStops} style={StyleSheet.absoluteFill} />
        <View style={styles.heroPill}>
          <View style={styles.lockPill}>
            <Icon name="lock" size={13} strokeWidth={2} />
            <Txt variant="small" weight={600}>
              Encrypted · never sold
            </Txt>
          </View>
        </View>
        <View style={styles.heroBottom}>
          <Heading variant="hero" size={46} on="photo" accent="yours." style={{ letterSpacing: -2.76, lineHeight: 43 }}>
            {'Your data,\nyours.'}
          </Heading>
          <Txt variant="body" size={14} color="rgba(255,255,255,0.9)">
            {"Your body is nobody's business model."}
          </Txt>
        </View>
      </View>

      <View style={{ gap: 10 }}>
        <Heading variant="h2" accent="lives">
          Where it lives
        </Heading>
        {places.map((p) => {
          const t = p.tone ? tones[p.tone] : null;
          return (
            <View key={p.title} style={[styles.place, t ? { backgroundColor: t.bg } : styles.placeOutline]}>
              <View style={styles.placeHead}>
                <View style={[styles.placeIcon, p.never && { backgroundColor: colors.ink }]}>
                  <Icon name={p.icon} size={16} strokeWidth={1.8} color={p.never ? colors.white : t ? t.soft : colors.ink} />
                </View>
                <View style={{ flex: 1, gap: 1 }}>
                  <Txt variant="bodyStrong" weight={700} color={t ? t.strong : colors.ink}>
                    {p.title}
                  </Txt>
                  <Txt variant="small" color={t ? t.soft : colors.grey}>
                    {p.text}
                  </Txt>
                </View>
              </View>
              <View style={styles.items}>
                {p.items.map((i) => (
                  <View key={i} style={[styles.item, p.never && { backgroundColor: colors.mist }]}>
                    <Txt variant="meta" color={p.never ? colors.grey : colors.ink} style={p.never ? { textDecorationLine: 'line-through' } : undefined}>
                      {i}
                    </Txt>
                  </View>
                ))}
              </View>
            </View>
          );
        })}
      </View>

      <View style={{ gap: 10 }}>
        <Heading variant="h2" accent="decide">
          You decide
        </Heading>
        <ListGroup>
          <ListRow tileOnWhite icon="heart" tone="vanilla" label="Apple Health" detail="Read steps, sleep, cycle" right={<Switch value={health} onChange={setHealth} accessibilityLabel="Apple Health" />} />
          <ListRow tileOnWhite icon="trend" tone="vanilla" label="Anonymous usage stats" detail="Helps us fix what's clunky" right={<Switch value={stats} onChange={setStats} accessibilityLabel="Anonymous usage stats" />} />
          <ListRow tileOnWhite icon="card" tone="vanilla" label="Personalised offers" detail="Off by default" right={<Switch value={offers} onChange={setOffers} accessibilityLabel="Personalised offers" />} />
        </ListGroup>
        {/* TODO(milestone 5): export, erase and delete are real, irreversible actions behind a confirmation. */}
        <View style={styles.actions}>
          {[
            { icon: 'download' as const, title: 'Export my data', text: 'One file, in minutes' },
            { icon: 'trash' as const, title: 'Erase my cycle', text: 'History wiped, tracking off' },
          ].map((a) => (
            <Pressable key={a.title} accessibilityRole="button" style={styles.action}>
              <View style={styles.actionIcon}>
                <Icon name={a.icon} size={16} strokeWidth={1.8} />
              </View>
              <View style={{ gap: 2 }}>
                <Txt variant="bodyStrong" weight={700}>
                  {a.title}
                </Txt>
                <Txt variant="small" color={colors.grey}>
                  {a.text}
                </Txt>
              </View>
            </Pressable>
          ))}
        </View>
        <Pressable accessibilityRole="button" style={styles.delete}>
          <Txt variant="body" weight={500} color="#A23B2A">
            Delete my account
          </Txt>
        </Pressable>
        <Pressable accessibilityRole="link" style={{ alignSelf: 'center' }}>
          <Txt variant="meta" color={colors.grey} style={{ textDecorationLine: 'underline' }}>
            Read the full privacy policy
          </Txt>
        </Pressable>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  hero: { height: 300, borderRadius: 28, overflow: 'hidden' },
  heroPill: { position: 'absolute', top: 14, left: 14 },
  lockPill: { height: 28, paddingHorizontal: 12, borderRadius: radius.pill, backgroundColor: colors.white, flexDirection: 'row', alignItems: 'center', gap: 6 },
  heroBottom: { position: 'absolute', left: 20, right: 20, bottom: 22, gap: 8 },
  place: { borderRadius: 24, padding: 16, gap: 12 },
  placeOutline: { borderWidth: 1, borderColor: colors.line },
  placeHead: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  placeIcon: { width: 38, height: 38, borderRadius: 12, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center' },
  items: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  item: { height: 30, paddingHorizontal: 12, borderRadius: radius.pill, backgroundColor: colors.white, justifyContent: 'center' },
  actions: { flexDirection: 'row', gap: 8, marginTop: 4 },
  action: { flex: 1, borderRadius: 22, borderWidth: 1, borderColor: colors.line, padding: 14, gap: 14 },
  actionIcon: { width: 34, height: 34, borderRadius: 11, backgroundColor: colors.mist, alignItems: 'center', justifyContent: 'center' },
  delete: { height: 52, borderRadius: radius.pill, borderWidth: 1, borderColor: '#E3C8C2', alignItems: 'center', justifyContent: 'center', marginTop: 8 },
});

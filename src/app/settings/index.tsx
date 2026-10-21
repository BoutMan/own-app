import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import {
  Button,
  CircleButton,
  DayCircles,
  Heading,
  Icon,
  ListGroup,
  ListRow,
  Logo,
  Screen,
  SectionLabel,
  SegmentedControl,
  Switch,
  Txt,
} from '@/components';
import { photos } from '@/content/photos';
import { useDb } from '@/db/DbProvider';
import { eraseAll } from '@/db/repositories';
import type { WeekNumber } from '@/domain/programme';
import { previewToolsEnabled, setPreviewWeek, usePreviewWeek } from '@/features/season/previewWeek';
import { useSeason } from '@/features/season/currentWeek';
import { colors, radius, tones } from '@/theme';

/** 26 · Settings. Values are local to the screen until preferences are persisted (milestone 4). */
export default function Settings() {
  const [place, setPlace] = useState<'home' | 'gym'>('home');
  const [units, setUnits] = useState<'lb' | 'kg'>('lb');
  const [days, setDays] = useState<number[]>([0, 2, 4]);
  const [toggles, setToggles] = useState({
    cycle: true,
    grounded: true,
    sessionReminder: true,
    nightBefore: true,
    sunday: true,
    evening: false,
  });
  const flip = (k: keyof typeof toggles) => (v: boolean) => setToggles((t) => ({ ...t, [k]: v }));

  return (
    <Screen gap={14} contentStyle={{ paddingHorizontal: 20 }}>
      <View style={styles.rowBetween}>
        <CircleButton icon="chevronLeft" accessibilityLabel="Back" onPress={() => router.back()} />
        <CircleButton icon="search" accessibilityLabel="Search settings" />
      </View>
      <Heading variant="h1" accent="settings">
        Your settings
      </Heading>

      <View style={styles.profile}>
        <Image source={photos.morningWalk} style={styles.avatar} contentPosition={{ top: '20%', left: '50%' }} />
        <View style={{ flex: 1, gap: 2 }}>
          <Txt variant="cardTitle" weight={600}>
            Mia Carter
          </Txt>
          <Txt variant="meta" color={colors.grey}>
            Stored on this phone only
          </Txt>
        </View>
        <Button label="Edit" variant="outline" style={{ height: 34, paddingHorizontal: 14 }} />
      </View>

      <Pressable accessibilityRole="button" onPress={() => router.push('/settings/subscription')} style={styles.plan}>
        <Image source={photos.trackStretch} style={StyleSheet.absoluteFill} contentFit="cover" contentPosition={{ top: '45%', left: '50%' }} />
        <LinearGradient colors={['rgba(17,17,17,0.66)', 'rgba(17,17,17,0.15)']} start={{ x: 0, y: 0.5 }} end={{ x: 0.75, y: 0.5 }} style={StyleSheet.absoluteFill} />
        <View style={{ gap: 3 }}>
          <Txt variant="h2" size={20} color={colors.white}>
            Own Yearly
          </Txt>
          <Txt variant="meta" color="rgba(255,255,255,0.88)">
            Free trial · ends Nov 2
          </Txt>
        </View>
        <View style={styles.planArrow}>
          <Icon name="chevronRight" size={14} strokeWidth={2.2} />
        </View>
      </Pressable>

      <SectionLabel>Training</SectionLabel>
      <ListGroup>
        <ListRow icon="home" tone="vanilla" label="Where I train" right={
          <SegmentedControl value={place} onChange={setPlace} options={[{ value: 'home', label: 'Home' }, { value: 'gym', label: 'Gym' }]} />
        } />
        <ListRow icon="dumbbell" tone="latte" label="My equipment" value="3 items">
          <View style={styles.chips}>
            {['Band', 'Backpack', 'Chair'].map((e) => (
              <View key={e} style={styles.chip}>
                <Txt variant="meta">{e}</Txt>
              </View>
            ))}
            <View style={[styles.chip, styles.chipAdd]}>
              <Txt variant="meta" color={colors.grey}>
                + Add
              </Txt>
            </View>
          </View>
        </ListRow>
        <ListRow icon="calendar" tone="fog" label="Days & time" value="6:30 pm">
          <DayCircles selected={days} onToggle={(i) => setDays((d) => (d.includes(i) ? d.filter((x) => x !== i) : [...d, i]))} />
        </ListRow>
        <ListRow icon="bars" tone="mauve" label="Units" right={
          <SegmentedControl value={units} onChange={setUnits} options={[{ value: 'lb', label: 'lb' }, { value: 'kg', label: 'kg' }]} />
        } />
      </ListGroup>

      <SectionLabel>Body</SectionLabel>
      <ListGroup>
        <ListRow icon="halfCircle" tone="mauve" label="Cycle tracking" detail="Sessions adapt to your phase" right={<Switch value={toggles.cycle} onChange={flip('cycle')} accessibilityLabel="Cycle tracking" />} />
        <ListRow icon="home" tone="vanilla" label="Grounded versions" detail="No jumps, joint-friendly" right={<Switch value={toggles.grounded} onChange={flip('grounded')} accessibilityLabel="Grounded versions" />} />
        <ListRow icon="heart" tone="fog" label="Redo my health check" chevron onPress={() => router.push('/health-check')} />
      </ListGroup>

      <SectionLabel>Reminders</SectionLabel>
      <ListGroup>
        <ListRow tileOnWhite icon="timer" tone="vanilla" label="Session, 30 min before" right={<Switch value={toggles.sessionReminder} onChange={flip('sessionReminder')} accessibilityLabel="Session reminder" />} />
        <ListRow tileOnWhite icon="shirt" tone="vanilla" label="Night before: lay out clothes" right={<Switch value={toggles.nightBefore} onChange={flip('nightBefore')} accessibilityLabel="Night-before reminder" />} />
        <ListRow tileOnWhite icon="check" tone="vanilla" label="Sunday check-in" right={<Switch value={toggles.sunday} onChange={flip('sunday')} accessibilityLabel="Sunday check-in" />} />
        <ListRow tileOnWhite icon="moon" tone="vanilla" label="Evening wind-down" right={<Switch value={toggles.evening} onChange={flip('evening')} accessibilityLabel="Evening wind-down reminder" />} />
      </ListGroup>

      <SectionLabel>Connected</SectionLabel>
      <View style={styles.connected}>
        <View style={[styles.connectCard, { backgroundColor: tones.vanilla.bg }]}>
          <View style={styles.rowBetween}>
            <View style={styles.connectIcon}>
              <Icon name="heart" size={16} strokeWidth={1.8} />
            </View>
            <View style={styles.badgeOn}>
              <Txt variant="small" weight={600} color={colors.white}>
                On
              </Txt>
            </View>
          </View>
          <View style={{ gap: 2 }}>
            <Txt variant="bodyStrong" weight={700} color={tones.vanilla.strong}>
              Apple Health
            </Txt>
            <Txt variant="small" color={tones.vanilla.soft}>
              Steps, sleep, cycle
            </Txt>
          </View>
        </View>
        <View style={[styles.connectCard, styles.connectOff]}>
          <View style={styles.rowBetween}>
            <View style={[styles.connectIcon, { backgroundColor: colors.mist }]}>
              <Icon name="music" size={16} strokeWidth={1.8} />
            </View>
            <View style={styles.badgeConnect}>
              <Txt variant="small" weight={600}>
                Connect
              </Txt>
            </View>
          </View>
          <View style={{ gap: 2 }}>
            <Txt variant="bodyStrong" weight={700}>
              Session playlist
            </Txt>
            <Txt variant="small" color={colors.grey}>
              Your music, in sync
            </Txt>
          </View>
        </View>
      </View>

      <SectionLabel>Privacy & help</SectionLabel>
      <ListGroup>
        <ListRow tileOnWhite icon="lock" tone="vanilla" label="Data & privacy" chevron onPress={() => router.push('/settings/privacy')} />
        <ListRow tileOnWhite icon="chat" tone="vanilla" label="Help & contact" chevron />
        <ListRow tileOnWhite icon="star" tone="vanilla" label="Rate Own" chevron />
      </ListGroup>

      {previewToolsEnabled ? <PreviewTools /> : null}

      <View style={styles.footer}>
        <Logo />
        <Txt variant="small" color={colors.grey}>
          version 0.1 · your body, your season
        </Txt>
      </View>
    </Screen>
  );
}

/** Web preview only: jump to any week and reset the test data. Not shipped in the iOS/Android app. */
function PreviewTools() {
  const override = usePreviewWeek();
  const season = useSeason();
  const { write } = useDb();
  const [confirm, setConfirm] = useState(false);
  return (
    <View style={{ gap: 10 }}>
      <SectionLabel>Preview tools</SectionLabel>
      <Txt variant="meta" color={colors.grey}>
        {`Simulate a week to see deloads, block 2 and the test week. Now: week ${season.week}${override ? ' (simulated)' : ', from your logged sessions'}.`}
      </Txt>
      <View style={styles.weeks}>
        {Array.from({ length: 12 }, (_, i) => (i + 1) as WeekNumber).map((w) => {
          const on = override === w;
          return (
            <Pressable
              key={w}
              accessibilityRole="button"
              accessibilityLabel={`Simulate week ${w}`}
              onPress={() => setPreviewWeek(on ? null : w)}
              style={[styles.weekChip, on && styles.weekChipOn]}
            >
              <Txt variant="meta" weight={on ? 600 : 400} color={on ? colors.white : colors.ink}>
                {String(w)}
              </Txt>
            </Pressable>
          );
        })}
      </View>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <Button label="Use real week" variant="outline" style={{ flex: 1, height: 44 }} onPress={() => setPreviewWeek(null)} />
        <Button
          label={confirm ? 'Tap again to erase' : 'Erase test data'}
          variant="outline"
          style={{ flex: 1, height: 44 }}
          onPress={() => {
            if (!confirm) return setConfirm(true);
            write((db) => eraseAll(db));
            setConfirm(false);
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  profile: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 12, paddingRight: 14, borderRadius: 24, borderWidth: 1, borderColor: colors.line, marginTop: 4 },
  avatar: { width: 58, height: 58, borderRadius: 18 },
  plan: { height: 92, borderRadius: 24, overflow: 'hidden', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingLeft: 18, paddingRight: 16 },
  planArrow: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip: { height: 28, paddingHorizontal: 12, borderRadius: radius.pill, backgroundColor: colors.white, justifyContent: 'center' },
  chipAdd: { backgroundColor: 'transparent', borderWidth: 1, borderStyle: 'dashed', borderColor: '#BDB7AF' },
  connected: { flexDirection: 'row', gap: 8 },
  connectCard: { flex: 1, borderRadius: 22, padding: 14, gap: 18 },
  connectOff: { borderWidth: 1, borderColor: colors.line },
  connectIcon: { width: 34, height: 34, borderRadius: 11, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center' },
  badgeOn: { height: 24, paddingHorizontal: 10, borderRadius: radius.pill, backgroundColor: colors.ink, justifyContent: 'center' },
  badgeConnect: { height: 24, paddingHorizontal: 10, borderRadius: radius.pill, borderWidth: 1.5, borderColor: colors.ink, justifyContent: 'center' },
  footer: { alignItems: 'center', gap: 4, paddingVertical: 20 },
  weeks: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  weekChip: { width: 44, height: 36, borderRadius: radius.pill, backgroundColor: colors.mist, alignItems: 'center', justifyContent: 'center' },
  weekChipOn: { backgroundColor: colors.ink },
});

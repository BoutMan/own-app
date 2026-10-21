import { router } from 'expo-router';
import { useState, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import {
  Button,
  CircleButton,
  CTA,
  DayCircles,
  Gauge,
  Heading,
  Icon,
  ListGroup,
  ListRow,
  Logo,
  PhotoHeader,
  PhotoTile,
  Pill,
  QuoteCard,
  Screen,
  SectionLabel,
  SegmentedControl,
  StatTiles,
  Switch,
  ToneCard,
  Txt,
  WeekStrip,
  type IconName,
} from '@/components';
import { mockWeek } from '@/content/mock';
import { photos } from '@/content/photos';
import { colors, tones, type Tone } from '@/theme';

const icons: IconName[] = [
  'arrowRight', 'chevronLeft', 'chevronRight', 'close', 'check', 'search', 'share', 'sparkle', 'sun',
  'steps', 'water', 'protein', 'moon', 'home', 'calendar', 'trend', 'person', 'dumbbell',
];

/** Dev-only gallery of every design-system component, to compare against design/screens-png. */
export default function KitchenSink() {
  const [place, setPlace] = useState<'home' | 'gym'>('home');
  const [units, setUnits] = useState<'lb' | 'kg'>('lb');
  const [reminder, setReminder] = useState(true);
  const [days, setDays] = useState<number[]>([0, 2, 4]);
  const [day, setDay] = useState('mon');

  return (
    <Screen padTop={false} gap={28}>
      <PhotoHeader
        source={photos.streetAbsMatcha}
        height={420}
        focus={{ top: '25%', left: '50%' }}
        top={
          <>
            <CircleButton icon="chevronLeft" surface="white" accessibilityLabel="Back" onPress={() => router.back()} />
            <CircleButton icon="share" surface="white" accessibilityLabel="Share" />
          </>
        }
      >
        <Pill label="Session 7 of 36" dot size="sm" />
        <Heading variant="hero" size={60} on="photo" accent="kept.">
          Promise kept.
        </Heading>
        <Txt variant="body" size={14} color="rgba(255,255,255,0.9)">
          PhotoHeader · inset frame · gradient
        </Txt>
      </PhotoHeader>

      <View style={styles.body}>
        <Section title="Typography">
          <Logo />
          <Heading variant="h1" accent="rituals">{"Today's rituals"}</Heading>
          <Heading variant="h2" accent="feel">How did it feel?</Heading>
          <Txt variant="cardTitle">Card title 17 / 700</Txt>
          <Txt variant="body">Two sets of eight per leg, rest sixty seconds.</Txt>
          <Txt variant="meta" color={colors.grey}>Meta 13 · secondary text</Txt>
          <Txt variant="eyebrow" color={colors.grey}>Eyebrow label</Txt>
        </Section>

        <Section title="Palette & tones">
          <View style={styles.swatches}>
            {[colors.white, colors.mist, colors.cocoa, colors.ink].map((c) => (
              <View key={c} style={[styles.swatch, { backgroundColor: c }]} />
            ))}
          </View>
          <View style={styles.swatches}>
            {(Object.keys(tones) as Tone[]).map((t) => (
              <View key={t} style={[styles.swatch, { backgroundColor: tones[t].bg }]}>
                <Txt variant="small" weight={600} color={tones[t].strong}>{t}</Txt>
              </View>
            ))}
          </View>
        </Section>

        <Section title="Icons">
          <View style={styles.icons}>
            {icons.map((n) => <Icon key={n} name={n} />)}
          </View>
        </Section>

        <Section title="Buttons">
          <CTA label="Start my season" />
          <View style={[styles.photoBg]}>
            <CTA label="Start session" tone="light" glyph="play" style={{ flex: 1 }} />
            <Button label="10-min version" variant="ghost" />
          </View>
          <View style={styles.row}>
            <Button label="Share" variant="outline" style={{ flex: 1 }} />
            <Button label="Done" style={{ flex: 1 }} />
          </View>
          <View style={styles.row}>
            <CircleButton icon="chevronLeft" accessibilityLabel="Back" />
            <CircleButton icon="search" accessibilityLabel="Search" />
            <CircleButton icon="close" accessibilityLabel="Close" />
          </View>
        </Section>

        <Section title="Pills">
          <View style={styles.wrap}>
            <Pill label="Strength" active />
            <Pill label="Quads" surface="mist" />
            <Pill label="Follicular · good day for heavy" dot surface="mist" />
          </View>
        </Section>

        <Section title="ToneCard">
          <ToneCard tone="latte" icon="sparkle" eyebrow="Your +1 today" title="One more rep on the goblet squat" text="Last time: 3 × 11 at 18 lb. Today, 12." />
          <ToneCard tone="fog" icon="moon" eyebrow="Deload week" title="Lighter on purpose" text="Same moves, fewer sets. Your body builds now." />
        </Section>

        <Section title="Gauges">
          <Gauge label="Morning flow" detail="7 / 7 min · done at 7:42" percent={100} tone="vanilla" icon="sun" done />
          <Gauge label="Steps" detail="4,210 / 7,000" percent={60} tone="latte" icon="steps" />
          <Gauge label="Sleep" detail="Day 0: 4 → today 7" percent={70} baseline={40} tone="mauve" value="7/10" />
        </Section>

        <Section title="StatTiles">
          <StatTiles stats={[
            { value: '34', label: 'minutes', tone: 'vanilla' },
            { value: '6/6', label: 'exercises', tone: 'mauve' },
            { value: '2', label: '+1 achieved', tone: 'fog' },
          ]} />
        </Section>

        <Section title="QuoteCard">
          <QuoteCard quote="Getting up without that heavy tiredness, and feeling strong again." caption="My why" actionLabel="Rewrite" />
        </Section>

        <Section title="PhotoTile">
          <View style={styles.row}>
            <PhotoTile source={photos.matchaBowl} label="Sunday check-in" height={150} style={{ flex: 1 }} />
            <PhotoTile source={photos.iceSkincare} label="Cycle · day 9" height={150} style={{ flex: 1 }} />
          </View>
        </Section>

        <Section title="Week & days">
          <WeekStrip days={mockWeek} selectedKey={day} onSelect={setDay} />
          <DayCircles selected={days} onToggle={(i) => setDays((d) => (d.includes(i) ? d.filter((x) => x !== i) : [...d, i]))} />
        </Section>

        <Section title="Grouped list & controls">
          <SectionLabel>Training</SectionLabel>
          <ListGroup>
            <ListRow icon="home" tone="vanilla" label="Where I train" right={
              <SegmentedControl value={place} onChange={setPlace} options={[{ value: 'home', label: 'Home' }, { value: 'gym', label: 'Gym' }]} />
            } />
            <ListRow icon="calendar" tone="fog" label="Days & time" value="6:30 pm">
              <DayCircles selected={days} />
            </ListRow>
            <ListRow icon="dumbbell" tone="latte" label="Units" right={
              <SegmentedControl value={units} onChange={setUnits} options={[{ value: 'lb', label: 'lb' }, { value: 'kg', label: 'kg' }]} />
            } />
            <ListRow icon="moon" tone="mauve" label="Night-before reminder" right={
              <Switch value={reminder} onChange={setReminder} accessibilityLabel="Night-before reminder" />
            } />
            <ListRow icon="person" tone="mocha" label="Data & privacy" chevron onPress={() => {}} />
          </ListGroup>
        </Section>
      </View>
    </Screen>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={{ gap: 10 }}>
      <Txt variant="eyebrow" color={colors.cocoa}>{title}</Txt>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  body: { paddingHorizontal: 20, gap: 28 },
  row: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  swatches: { flexDirection: 'row', gap: 8 },
  swatch: {
    flex: 1, height: 52, borderRadius: 16, borderWidth: 1, borderColor: colors.line,
    alignItems: 'center', justifyContent: 'center',
  },
  icons: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
  photoBg: { flexDirection: 'row', gap: 8, padding: 12, borderRadius: 24, backgroundColor: '#6E6A66' },
});

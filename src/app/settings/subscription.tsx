import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { Button, CircleButton, Gutter, Heading, Icon, PhotoHeader, Pill, Screen, Txt, type IconName } from '@/components';
import { photos } from '@/content/photos';
import { colors, fontFamilyFor, radius, tones, type Tone } from '@/theme';

const timeline: { title: string; text: string; state: 'done' | 'next' | 'later' }[] = [
  { title: 'Oct 26 · Trial started', text: 'Everything unlocked: sessions, rituals, your circle.', state: 'done' },
  { title: 'Oct 31 · We remind you', text: 'Two days before, no surprise charge.', state: 'next' },
  { title: 'Nov 2 · Your year begins', text: '$59.99 billed by the App Store. Cancel anytime before.', state: 'later' },
];

const included: { icon: IconName; tone: Tone; text: string }[] = [
  { icon: 'dumbbell', tone: 'vanilla', text: '3 guided strength sessions a week' },
  { icon: 'halfCircle', tone: 'mauve', text: 'A plan that follows your cycle' },
  { icon: 'moon', tone: 'fog', text: 'Rituals and evening wind-downs' },
  { icon: 'people', tone: 'latte', text: 'Your circle of eight women' },
];

/** 27 · Subscription. Mock plan state until RevenueCat lands (milestone 4). */
export default function Subscription() {
  const [plan, setPlan] = useState<'yearly' | 'monthly'>('yearly');
  const [code, setCode] = useState('');
  return (
    <Screen padTop={false}>
      <StatusBar style="light" />
      <PhotoHeader
        source={photos.trackStretch}
        height={380}
        focus={{ top: '45%', left: '50%' }}
        top={
          <>
            <CircleButton icon="chevronLeft" surface="white" accessibilityLabel="Back" onPress={() => router.back()} />
            <Pill label="Active" dot size="sm" />
          </>
        }
      >
        <Txt variant="eyebrow" size={13} color="rgba(255,255,255,0.88)" style={{ letterSpacing: 1.56 }}>
          Your plan
        </Txt>
        <Heading variant="hero" size={52} on="photo" style={{ letterSpacing: -3.12, lineHeight: 48 }}>
          Own Yearly
        </Heading>
        <Txt variant="body" size={14} color="rgba(255,255,255,0.9)">
          Free trial ends Nov 2 · then $59.99 / year
        </Txt>
      </PhotoHeader>

      <Gutter>
        <View style={{ gap: 14 }}>
          <Heading variant="h2" accent="trial">
            How your trial works
          </Heading>
          <View>
            {timeline.map((t, i) => (
              <View key={t.title} style={styles.step}>
                <View style={styles.rail}>
                  <View style={[styles.dot, t.state === 'done' ? styles.dotDone : t.state === 'next' ? styles.dotNext : styles.dotLater]}>
                    {t.state === 'done' ? (
                      <Icon name="check" size={12} strokeWidth={2.6} color={colors.white} />
                    ) : t.state === 'next' ? (
                      <Icon name="bell" size={12} strokeWidth={1.8} color={tones.vanilla.strong} />
                    ) : (
                      <Txt variant="tab" weight={700} color={colors.grey}>
                        $
                      </Txt>
                    )}
                  </View>
                  {i < timeline.length - 1 ? <View style={[styles.line, i === 0 && { backgroundColor: colors.cocoaLight }]} /> : null}
                </View>
                <View style={{ flex: 1, gap: 2, paddingTop: 2, paddingBottom: i < timeline.length - 1 ? 18 : 0 }}>
                  <Txt variant="bodyStrong">{t.title}</Txt>
                  <Txt variant="meta" color={colors.grey}>
                    {t.text}
                  </Txt>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={{ gap: 12 }}>
          <Heading variant="h2" accent="included">
            {"What's included"}
          </Heading>
          <View style={styles.grid}>
            {included.map((c) => (
              <View key={c.text} style={[styles.inc, { backgroundColor: tones[c.tone].bg }]}>
                <View style={styles.incIcon}>
                  <Icon name={c.icon} size={16} strokeWidth={1.8} color={tones[c.tone].soft} />
                </View>
                <Txt variant="body" size={14} weight={600} color={tones[c.tone].strong} style={{ lineHeight: 18 }}>
                  {c.text}
                </Txt>
              </View>
            ))}
          </View>
        </View>

        <View style={{ gap: 12 }}>
          <Heading variant="h2" accent="rhythm">
            Your rhythm
          </Heading>
          <View style={styles.grid}>
            {([
              { key: 'yearly', name: 'Yearly', price: '$59.99', per: '$5 a month', tag: 'Save 67%' },
              { key: 'monthly', name: 'Monthly', price: '$14.99', per: 'per month', tag: 'Flexible' },
            ] as const).map((p) => {
              const on = plan === p.key;
              return (
                <Pressable
                  key={p.key}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: on }}
                  onPress={() => setPlan(p.key)}
                  style={[styles.planCard, on ? styles.planOn : styles.planOff]}
                >
                  <View style={[styles.radio, on ? styles.radioOn : styles.radioOff]}>
                    {on ? <Icon name="check" size={11} strokeWidth={2.8} color={colors.white} /> : null}
                  </View>
                  <Txt variant="meta" color={colors.grey}>
                    {p.name}
                  </Txt>
                  <Txt variant="h2">{p.price}</Txt>
                  <Txt variant="small" color={colors.grey}>
                    {p.per}
                  </Txt>
                  <View style={[styles.planTag, { backgroundColor: on ? tones.vanilla.bg : colors.mist }]}>
                    <Txt variant="tab" weight={on ? 600 : 500} color={on ? tones.vanilla.strong : colors.grey}>
                      {p.tag}
                    </Txt>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.guide}>
          <View style={{ gap: 2 }}>
            <Txt variant="bodyStrong" size={16} weight={700} color={tones.mocha.strong}>
              Bought the Own guide?
            </Txt>
            <Txt variant="meta" color={tones.mocha.soft}>
              Your code unlocks the founding member price.
            </Txt>
          </View>
          <View style={styles.codeRow}>
            <TextInput
              value={code}
              onChangeText={(t) => setCode(t.toUpperCase())}
              placeholder="GUIDE-XXXX"
              placeholderTextColor={colors.grey}
              autoCapitalize="characters"
              accessibilityLabel="Guide code"
              style={styles.codeInput}
            />
            {/* TODO(milestone 4): validate guide buyer codes server-side. */}
            <Button label="Apply" style={{ height: 38, paddingHorizontal: 16 }} />
          </View>
        </View>

        <Button label="Manage in App Store" variant="outline" />
        <View style={styles.links}>
          <Pressable accessibilityRole="link" onPress={() => router.push('/paywall')}>
            <Txt variant="meta" color={colors.grey} style={{ textDecorationLine: 'underline' }}>
              Restore purchases
            </Txt>
          </Pressable>
          <Pressable accessibilityRole="link" onPress={() => router.push('/settings/privacy')}>
            <Txt variant="meta" color={colors.grey} style={{ textDecorationLine: 'underline' }}>
              Terms
            </Txt>
          </Pressable>
        </View>
      </Gutter>
    </Screen>
  );
}

const styles = StyleSheet.create({
  step: { flexDirection: 'row', gap: 14 },
  rail: { width: 26, alignItems: 'center' },
  dot: { width: 26, height: 26, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  dotDone: { backgroundColor: colors.ink },
  dotNext: { backgroundColor: tones.vanilla.bg, borderWidth: 1.5, borderColor: colors.cocoaLight },
  dotLater: { borderWidth: 1.5, borderColor: colors.radioOff },
  line: { flex: 1, width: 2, minHeight: 22, backgroundColor: colors.line },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  inc: { width: '48.8%', borderRadius: 22, padding: 14, gap: 18 },
  incIcon: { width: 34, height: 34, borderRadius: 11, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center' },
  planCard: { width: '48.8%', borderRadius: 22, padding: 14, gap: 4, backgroundColor: colors.white },
  planOn: { borderWidth: 2, borderColor: colors.ink },
  planOff: { borderWidth: 1, borderColor: colors.line, padding: 15 },
  radio: { position: 'absolute', top: 12, right: 12, width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  radioOn: { backgroundColor: colors.ink },
  radioOff: { borderWidth: 1.5, borderColor: colors.radioOff },
  planTag: { alignSelf: 'flex-start', marginTop: 6, height: 22, paddingHorizontal: 8, borderRadius: radius.pill, justifyContent: 'center' },
  guide: { borderRadius: 24, backgroundColor: tones.mocha.bg, padding: 16, gap: 12 },
  codeRow: { height: 48, borderRadius: radius.pill, backgroundColor: colors.white, flexDirection: 'row', alignItems: 'center', paddingLeft: 16, paddingRight: 5, gap: 8 },
  codeInput: { flex: 1, fontFamily: fontFamilyFor(400), fontSize: 14, letterSpacing: 0.84, color: colors.ink, padding: 0 },
  links: { flexDirection: 'row', justifyContent: 'center', gap: 18 },
});

import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';

import { Button, CircleButton, Gutter, Heading, Icon, PhotoHeader, Pill, Screen, Txt, type IconName } from '@/components';
import { photos } from '@/content/photos';
import { planSummary, type PlanId } from '@/features/subscription/model';
import { useSubscription } from '@/features/subscription/SubscriptionProvider';
import { colors, radius, tones, type Tone } from '@/theme';

type Step = { title: string; text: string; state: 'done' | 'next' | 'later' };

const short = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

const included: { icon: IconName; tone: Tone; text: string }[] = [
  { icon: 'dumbbell', tone: 'vanilla', text: '3 guided strength sessions a week' },
  { icon: 'halfCircle', tone: 'mauve', text: 'A plan that follows your cycle' },
  { icon: 'moon', tone: 'fog', text: 'Rituals and evening wind-downs' },
  { icon: 'trend', tone: 'latte', text: 'Progress past the scale' },
];

/** 27 · Subscription. Plan, trial dates and prices from the store; changes happen in the App Store. */
export default function Subscription() {
  const sub = useSubscription();
  const { state, plans } = sub;
  const current = state.status === 'trial' || state.status === 'active' ? (state.plan ?? 'yearly') : null;
  const [plan, setPlan] = useState<PlanId>(current ?? 'yearly');
  const [message, setMessage] = useState<string | null>(null);
  const summary = planSummary(state, plans);
  const pill = state.status === 'trial' ? 'Free trial' : state.status === 'active' ? 'Active' : state.status === 'none' ? 'Not active' : 'Own';
  const timeline: Step[] =
    state.status === 'trial' && state.renewsAt
      ? [
          { title: `${short(state.startedAt)} · Trial started`, text: 'Everything unlocked: sessions, rituals, progress.', state: 'done' },
          {
            title: `${short(new Date(state.renewsAt.getTime() - 2 * 86_400_000))} · We remind you`,
            text: state.willRenew ? 'Two days before, no surprise charge.' : 'Your trial will not renew: nothing will be charged.',
            state: 'next',
          },
          {
            title: `${short(state.renewsAt)} · ${state.willRenew ? 'Your year begins' : 'Trial ends'}`,
            text: state.willRenew ? `${plans.yearly.price} billed by the App Store. Cancel anytime before.` : 'Your data stays on your phone either way.',
            state: 'later',
          },
        ]
      : [];
  const restore = async () => {
    try {
      const r = await sub.restore();
      setMessage(r.status === 'trial' || r.status === 'active' ? 'Your plan is restored.' : 'No plan found for this Apple ID.');
    } catch {
      setMessage('Could not reach the App Store. Try again in a moment.');
    }
  };
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
            <Pill label={pill} dot size="sm" />
          </>
        }
      >
        <Txt variant="eyebrow" size={13} color="rgba(255,255,255,0.88)" style={{ letterSpacing: 1.56 }}>
          Your plan
        </Txt>
        <Heading variant="hero" size={52} on="photo" style={{ letterSpacing: -3.12, lineHeight: 48 }}>
          {summary.title}
        </Heading>
        <Txt variant="body" size={14} color="rgba(255,255,255,0.9)">
          {summary.line}
        </Txt>
      </PhotoHeader>

      <Gutter>
        {timeline.length ? (
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
        ) : null}

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
              { key: 'yearly', name: 'Yearly', price: plans.yearly.price, per: plans.yearly.perWeek ? `${plans.yearly.perWeek} a week` : 'per year', tag: current === 'yearly' ? 'Your plan' : 'Best value' },
              { key: 'monthly', name: 'Monthly', price: plans.monthly.price, per: 'per month', tag: current === 'monthly' ? 'Your plan' : 'Flexible' },
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
          {/* Guide codes are App Store offer codes, redeemed on Apple's sheet: no server, nothing stored by us. */}
          <View style={styles.codeRow}>
            <Txt variant="meta" color={colors.grey} style={{ flex: 1 }}>
              {Platform.OS === 'ios' ? 'Enter it on the App Store sheet' : 'Codes are redeemed on iPhone'}
            </Txt>
            <Button label="Redeem" style={{ height: 38, paddingHorizontal: 16 }} onPress={() => void sub.redeemCode()} />
          </View>
        </View>

        {plan !== current && current ? (
          <Txt variant="small" color={colors.grey} style={{ textAlign: 'center' }}>
            {`Switching to ${plan} happens in the App Store, from the button below.`}
          </Txt>
        ) : null}
        {state.status === 'none' ? (
          <Button label="See plans" onPress={() => router.push('/paywall')} />
        ) : (
          <Button label="Manage in App Store" variant="outline" onPress={() => void sub.manage()} />
        )}
        {message ? (
          <Txt variant="small" style={{ textAlign: 'center' }}>
            {message}
          </Txt>
        ) : null}
        <View style={styles.links}>
          <Pressable accessibilityRole="link" onPress={restore}>
            <Txt variant="meta" color={colors.grey} style={{ textDecorationLine: 'underline' }}>
              Restore purchases
            </Txt>
          </Pressable>
          <Pressable accessibilityRole="link" onPress={() => router.push('/legal/terms')}>
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
  links: { flexDirection: 'row', justifyContent: 'center', gap: 18 },
});

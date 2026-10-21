import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button, Heading, Icon, Txt } from '@/components';
import { photos } from '@/content/photos';
import { colors, radius, space, tones } from '@/theme';

type Plan = 'yearly' | 'monthly';

// Prices from the spec. Real prices and the trial come from RevenueCat in milestone 4.
const plans: Record<Plan, { title: string; price: string; badge?: string }> = {
  yearly: { title: 'Yearly', price: '$59.99 / year · $1.15 a week', badge: '7 days free' },
  monthly: { title: 'Monthly', price: '$14.99 / month' },
};

const perks = ['Guided sessions', 'Your +1, every time', 'Cycle-aware', 'Progress past the scale'] as const;

/** 11 · Paywall — yearly with a 7-day trial (highlighted) or monthly. */
export default function Paywall() {
  const insets = useSafeAreaInsets();
  const [plan, setPlan] = useState<Plan>('yearly');
  // TODO(milestone 4): purchase through RevenueCat, then persist onboarding before entering the app.
  const enter = () => router.replace('/(tabs)');

  return (
    <ScrollView style={styles.root} contentContainerStyle={{ flexGrow: 1 }} bounces={false}>
      <View style={styles.photo}>
        <Image source={photos.gymMirror} style={StyleSheet.absoluteFill} contentFit="cover" contentPosition={{ top: '20%', left: '50%' }} />
        <Pressable accessibilityRole="button" accessibilityLabel="Close" onPress={enter} style={[styles.close, { top: Math.max(insets.top, 20) + 8 }]}>
          <Icon name="close" size={16} strokeWidth={2} />
        </Pressable>
      </View>

      <View style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 16) + 10 }]}>
        <Heading variant="h1" size={36} accent="next">
          Own your next 12 weeks
        </Heading>

        <View style={styles.perks}>
          {perks.map((p) => (
            <View key={p} style={styles.perk}>
              <Icon name="check" size={15} strokeWidth={2} color={colors.cocoa} />
              <Txt variant="meta">{p}</Txt>
            </View>
          ))}
        </View>

        <View style={{ gap: 10, paddingTop: 6 }}>
          {(Object.keys(plans) as Plan[]).map((key) => {
            const p = plans[key];
            const selected = plan === key;
            return (
              <Pressable
                key={key}
                accessibilityRole="radio"
                accessibilityState={{ checked: selected }}
                onPress={() => setPlan(key)}
                style={[styles.plan, selected ? styles.planOn : styles.planOff]}
              >
                {p.badge ? (
                  <View style={styles.badge}>
                    <Txt variant="small" weight={600} color={tones.mauve.strong}>
                      {p.badge}
                    </Txt>
                  </View>
                ) : null}
                <View style={{ gap: 2 }}>
                  <Txt variant="body" size={16} weight={600}>
                    {p.title}
                  </Txt>
                  <Txt variant="meta" color={colors.grey}>
                    {p.price}
                  </Txt>
                </View>
                {selected ? (
                  <View style={styles.radioOn}>
                    <Icon name="check" size={13} strokeWidth={2.6} color={colors.white} />
                  </View>
                ) : (
                  <View style={styles.radioOff} />
                )}
              </Pressable>
            );
          })}
        </View>

        <View style={{ marginTop: 'auto', gap: 12, paddingTop: 10 }}>
          <Button label={plan === 'yearly' ? 'Start my 7-day free trial' : 'Subscribe monthly'} size="lg" onPress={enter} />
          <Txt variant="small" color={colors.grey} style={{ textAlign: 'center', lineHeight: 17 }}>
            {plan === 'yearly'
              ? 'Then $59.99 a year. We remind you 2 days before it ends. Cancel anytime.'
              : '$14.99 a month. Cancel anytime.'}
          </Txt>
          <View style={styles.links}>
            {['Restore', 'Privacy', 'Terms'].map((l) => (
              // TODO(milestone 4): "Restore" calls RevenueCat; Terms gets its own page.
              <Pressable key={l} accessibilityRole="link" hitSlop={8} onPress={l === 'Restore' ? undefined : () => router.push('/settings/privacy')}>
                <Txt variant="small" color={colors.grey} style={{ textDecorationLine: 'underline' }}>
                  {l}
                </Txt>
              </Pressable>
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.white },
  photo: { height: 290, backgroundColor: colors.disabled },
  close: {
    position: 'absolute', right: 20, width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.9)', alignItems: 'center', justifyContent: 'center',
  },
  sheet: {
    flexGrow: 1, marginTop: -26, borderTopLeftRadius: 26, borderTopRightRadius: 26, backgroundColor: colors.white,
    paddingTop: 22, paddingHorizontal: space.screenX, gap: 14,
  },
  perks: { flexDirection: 'row', flexWrap: 'wrap', rowGap: 8 },
  perk: { width: '50%', flexDirection: 'row', gap: 8, alignItems: 'center' },
  plan: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 18, borderRadius: 20, backgroundColor: colors.white },
  planOn: { borderWidth: 2, borderColor: colors.ink },
  planOff: { borderWidth: 1.5, borderColor: colors.line },
  badge: { position: 'absolute', top: -12, left: 16, height: 24, paddingHorizontal: 10, borderRadius: radius.pill, backgroundColor: tones.mauve.bg, justifyContent: 'center' },
  radioOn: { width: 24, height: 24, borderRadius: 12, backgroundColor: colors.ink, alignItems: 'center', justifyContent: 'center' },
  radioOff: { width: 24, height: 24, borderRadius: 12, borderWidth: 1.5, borderColor: colors.radioOff },
  links: { flexDirection: 'row', justifyContent: 'center', gap: 18 },
});

import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { Button, CTA, Gauge, Icon, Txt, type IconName } from '@/components';
import { MARKERS, useOnboarding, type Marker } from '@/features/onboarding/OnboardingContext';
import { DotRating, StepScreen } from '@/features/onboarding/ui';
import { colors, radius, type Tone } from '@/theme';

const markerLook: Record<Marker, { icon: IconName; tone: Tone }> = {
  'Morning energy': { icon: 'bolt', tone: 'vanilla' },
  Sleep: { icon: 'moon', tone: 'fog' },
  Strength: { icon: 'dumbbell', tone: 'latte' },
  Breath: { icon: 'breath', tone: 'fog' },
  'Posture & back': { icon: 'posture', tone: 'mauve' },
  Mood: { icon: 'smile', tone: 'vanilla' },
  Confidence: { icon: 'crown', tone: 'mauve' },
};

/** 07 · Onboarding 5/7 — the seven markers rated 1–10, day-0 photos. */
export default function StartingPoint() {
  const { answers, update } = useOnboarding();
  return (
    <StepScreen
      step={5}
      title={'Your starting\npoint'}
      accent="starting"
      subtitle="Rate today, 1 to 10. Be honest: you'll redo it every four weeks."
      gap={18}
      footer={<CTA label="Continue" onPress={() => router.push('/dates')} />}
    >
      {/* Rated markers become gauges, as on the Sunday check-in (21); a tap rates again. */}
      <View style={{ gap: 8 }}>
        {MARKERS.map((m) => {
          const v = answers.markers[m];
          const set = (n: number | null) => update('markers', { ...answers.markers, [m]: n });
          return v == null ? (
            <View key={m} style={styles.rate}>
              <DotRating label={m} value={null} onChange={set} />
            </View>
          ) : (
            <Pressable key={m} accessibilityRole="button" accessibilityLabel={`${m}, ${v} out of 10. Rate again`} onPress={() => set(null)}>
              <Gauge label={m} percent={v * 10} tone={markerLook[m].tone} icon={markerLook[m].icon} value={`${v}/10`} height={58} />
            </Pressable>
          );
        })}
      </View>

      <View style={styles.photos}>
        <View style={styles.slots}>
          {(['front', 'side', 'back'] as const).map((pose) => (
            <View key={pose} style={[styles.slot, answers.photos[pose] ? styles.slotDone : null]}>
              {answers.photos[pose] ? <Icon name="check" size={14} strokeWidth={2.4} color={colors.white} /> : null}
            </View>
          ))}
        </View>
        <View style={{ flex: 1, gap: 2 }}>
          <Txt variant="body" size={14} weight={500}>
            Day 0 photos
          </Txt>
          <Txt variant="small" color={colors.grey}>
            Front, side, back. In a locked vault, on this phone only.
          </Txt>
        </View>
        <Button label={Object.keys(answers.photos).length === 3 ? 'Retake' : 'Take'} variant="outline" style={styles.take} onPress={() => router.push('/photos')} />
      </View>
    </StepScreen>
  );
}

const styles = StyleSheet.create({
  rate: { borderRadius: 20, borderWidth: 1, borderColor: colors.line, paddingHorizontal: 14, paddingVertical: 6 },
  photos: { flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 22, borderWidth: 1, borderColor: colors.line, paddingVertical: 10, paddingLeft: 10, paddingRight: 14 },
  slots: { flexDirection: 'row', gap: 4 },
  slot: { width: 34, height: 46, borderRadius: 10, backgroundColor: colors.mist, borderWidth: 1.5, borderStyle: 'dashed', borderColor: colors.radioOff },
  slotDone: { backgroundColor: colors.ink, borderStyle: 'solid', borderColor: colors.ink, alignItems: 'center', justifyContent: 'center' },
  take: { height: 36, paddingHorizontal: 14, borderRadius: radius.pill },
});

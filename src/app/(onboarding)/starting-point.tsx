import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Button, Txt } from '@/components';
import { MARKERS, useOnboarding } from '@/features/onboarding/OnboardingContext';
import { DotRating, StepScreen } from '@/features/onboarding/ui';
import { colors, radius } from '@/theme';

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
      footer={<Button label="Continue" size="lg" onPress={() => router.push('/dates')} />}
    >
      <View style={styles.markers}>
        {MARKERS.map((m) => (
          <DotRating key={m} label={m} value={answers.markers[m]} onChange={(v) => update('markers', { ...answers.markers, [m]: v })} />
        ))}
      </View>

      <View style={styles.photos}>
        <View style={styles.slots}>
          {[0, 1, 2].map((i) => (
            <View key={i} style={styles.slot} />
          ))}
        </View>
        <View style={{ flex: 1, gap: 2 }}>
          <Txt variant="body" size={14} weight={500}>
            Day 0 photos
          </Txt>
          <Txt variant="small" color={colors.grey}>
            Front, side, back. Locked until day 30.
          </Txt>
        </View>
        {/* TODO(milestone 5): open the camera and store photos in the on-device vault (Face ID). */}
        <Button label="Take" variant="outline" style={styles.take} />
      </View>
    </StepScreen>
  );
}

const styles = StyleSheet.create({
  markers: { borderRadius: 22, backgroundColor: colors.mist, paddingVertical: 10, paddingHorizontal: 14, gap: 4 },
  photos: { flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 22, borderWidth: 1, borderColor: colors.line, paddingVertical: 10, paddingLeft: 10, paddingRight: 14 },
  slots: { flexDirection: 'row', gap: 4 },
  slot: { width: 34, height: 46, borderRadius: 10, backgroundColor: colors.mist, borderWidth: 1.5, borderStyle: 'dashed', borderColor: colors.radioOff },
  take: { height: 36, paddingHorizontal: 14, borderRadius: radius.pill },
});

import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Button, Pill } from '@/components';
import { photos, type PhotoKey } from '@/content/photos';
import { FEELINGS, MAX_FEELINGS, toggleIn, useOnboarding, type Feeling } from '@/features/onboarding/OnboardingContext';
import { SelectPhotoCard, StepScreen } from '@/features/onboarding/ui';

const feelingPhotos: Record<Feeling, { photo: PhotoKey; top: string }> = {
  Strong: { photo: 'backFlexRed', top: '30%' },
  Light: { photo: 'morningWalk', top: '35%' },
  Rested: { photo: 'sheetMask', top: '25%' },
  Grounded: { photo: 'seatedStretch', top: '50%' },
  Confident: { photo: 'streetAbsMatcha', top: '30%' },
  Energised: { photo: 'kettlebellPink', top: '25%' },
};

/** 03 · Onboarding 1/7 — pick up to three feelings. */
export default function Feel() {
  const { answers, update } = useOnboarding();
  const rows = [FEELINGS.slice(0, 2), FEELINGS.slice(2, 4), FEELINGS.slice(4, 6)];
  return (
    <StepScreen
      step={1}
      title={'How do you want\nto feel in 12 weeks?'}
      accent="feel"
      subtitle="Pick up to three. Feelings, not numbers."
      gap={22}
      footer={
        <Button label="Continue" size="lg" disabled={answers.feelings.length === 0} onPress={() => router.push('/goals')} />
      }
    >
      <View style={styles.grid}>
        {rows.map((row) => (
          <View key={row.join()} style={styles.row}>
            {row.map((f) => (
              <SelectPhotoCard
                key={f}
                source={photos[feelingPhotos[f].photo]}
                focus={{ top: feelingPhotos[f].top, left: '50%' }}
                height={150}
                accessibilityLabel={f}
                selected={answers.feelings.includes(f)}
                onPress={() => update('feelings', toggleIn(answers.feelings, f, MAX_FEELINGS))}
              >
                <View style={styles.label}>
                  <Pill label={f} />
                </View>
              </SelectPhotoCard>
            ))}
          </View>
        ))}
      </View>
    </StepScreen>
  );
}

const styles = StyleSheet.create({
  grid: { gap: 10 },
  row: { flexDirection: 'row', gap: 10 },
  label: { position: 'absolute', left: 10, bottom: 10 },
});

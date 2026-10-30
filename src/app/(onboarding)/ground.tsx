import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { CTA, Txt } from '@/components';
import { photos } from '@/content/photos';
import { toggleIn, useOnboarding, type Equipment } from '@/features/onboarding/OnboardingContext';
import { Chip, Note, SelectPhotoCard, StepScreen } from '@/features/onboarding/ui';
import { colors } from '@/theme';

// Imperial by default (CLAUDE.md rule 5): the guide's 4–6 kg dumbbells read as 9–13 lb.
const equipment: { key: Equipment; label: string }[] = [
  { key: 'chair', label: 'A sturdy chair' },
  { key: 'band', label: 'Resistance band' },
  { key: 'dumbbells', label: 'Dumbbells 9–13 lb' },
  { key: 'kettlebell', label: 'Kettlebell' },
  { key: 'backpack', label: 'A backpack' },
  { key: 'none', label: 'Nothing yet' },
];

/** 06 · Onboarding 4/7 — home or gym, equipment at home. */
export default function Ground() {
  const { answers, update } = useOnboarding();

  const toggleEquipment = (key: Equipment) => {
    if (key === 'none') return update('equipment', answers.equipment.includes('none') ? [] : ['none']);
    update('equipment', toggleIn(answers.equipment.filter((e) => e !== 'none'), key));
  };

  const places = [
    { key: 'home', title: 'At home', text: 'A mat and a chair', photo: photos.kettlebellPink },
    { key: 'gym', title: 'At the gym', text: 'Bars, cables, machines', photo: photos.backFlexRed },
  ] as const;

  return (
    <StepScreen
      step={4}
      title={'Where will\nyou train?'}
      accent="train?"
      subtitle="Every session comes in both versions. Switch any week."
      footer={<CTA label="Continue" onPress={() => router.push('/starting-point')} />}
    >
      <View style={styles.row}>
        {places.map((p) => (
          <SelectPhotoCard
            key={p.key}
            source={p.photo}
            focus={{ top: '25%', left: '50%' }}
            height={240}
            accessibilityLabel={p.title}
            selected={answers.place === p.key}
            onPress={() => update('place', p.key)}
          >
            <View style={styles.caption}>
              <Txt variant="h2" size={20} style={{ letterSpacing: -0.4 }}>
                {p.title}
              </Txt>
              <Txt variant="small" color={colors.grey}>
                {p.text}
              </Txt>
            </View>
          </SelectPhotoCard>
        ))}
      </View>

      {answers.place === 'home' ? (
        <View style={{ gap: 10 }}>
          <Txt variant="body" weight={500}>
            What do you have at home?
          </Txt>
          <View style={styles.chips}>
            {equipment.map((e) => (
              <Chip key={e.key} label={e.label} selected={answers.equipment.includes(e.key)} onPress={() => toggleEquipment(e.key)} />
            ))}
          </View>
        </View>
      ) : null}

      <Note tone="vanilla">A band and a backpack unlock half the programme. A loaded backpack is your first dumbbell.</Note>
    </StepScreen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 10 },
  caption: { position: 'absolute', left: 10, right: 10, bottom: 10, borderRadius: 16, backgroundColor: colors.white, paddingVertical: 10, paddingHorizontal: 12, gap: 2 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
});

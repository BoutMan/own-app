import { router } from 'expo-router';
import { StyleSheet, TextInput, View } from 'react-native';

import { Button, Txt } from '@/components';
import { useOnboarding, type Goal } from '@/features/onboarding/OnboardingContext';
import { Note, NumberTile, StepScreen } from '@/features/onboarding/ui';
import { colors, fontFamilyFor, tones, type Tone } from '@/theme';

type GoalSlot = {
  kind: string;
  tone: Tone;
  prompt?: string;
  placeholder: string;
  todayPlaceholder?: string;
};

// Examples come from the mockup and the guide: placeholders, never pre-filled answers.
const slots: [GoalSlot, GoalSlot, GoalSlot] = [
  { kind: 'Performance', tone: 'vanilla', placeholder: '10 push-ups from my knees, in a row', todayPlaceholder: 'Today: 3' },
  { kind: 'Sensation', tone: 'fog', placeholder: 'Climb my four flights without stopping', todayPlaceholder: 'Today: out of breath at the 3rd' },
  { kind: 'Yours alone', tone: 'mauve', prompt: 'What would make you proud?', placeholder: 'My black jeans fit comfortably again' },
];

/** 04 · Onboarding 2/7 — three goals (performance, sensation, free). */
export default function Goals() {
  const { answers, update } = useOnboarding();
  const setGoal = (i: 0 | 1 | 2, patch: Partial<Goal>) => {
    const next = [...answers.goals] as typeof answers.goals;
    next[i] = { ...next[i], ...patch };
    update('goals', next);
  };
  return (
    <StepScreen
      step={2}
      title={'Three goals\nyou can keep'}
      accent="keep"
      subtitle="Write them as if week 12 already happened. Something you can answer yes or no to."
      footer={<Button label="Continue" size="lg" onPress={() => router.push('/health-check')} />}
    >
      <View style={{ gap: 10 }}>
        {slots.map((slot, i) => {
          const idx = i as 0 | 1 | 2;
          const goal = answers.goals[idx];
          const free = idx === 2;
          return (
            <View key={slot.kind} style={[styles.card, free ? styles.cardFree : styles.cardFilled]}>
              <NumberTile n={idx + 1} tone={slot.tone} />
              <View style={styles.body}>
                <Txt variant="eyebrow" color={tones[slot.tone].soft} style={{ letterSpacing: 0.96 }}>
                  {slot.kind}
                </Txt>
                {slot.prompt ? (
                  <Txt variant="meta" color={colors.grey}>
                    {slot.prompt}
                  </Txt>
                ) : null}
                <TextInput
                  value={goal.text}
                  onChangeText={(text) => setGoal(idx, { text })}
                  placeholder={slot.placeholder}
                  placeholderTextColor={colors.grey}
                  accessibilityLabel={`${slot.kind} goal`}
                  multiline={!free}
                  style={[styles.input, free && styles.inputLine]}
                />
                {slot.todayPlaceholder ? (
                  <TextInput
                    value={goal.today}
                    onChangeText={(today) => setGoal(idx, { today })}
                    placeholder={slot.todayPlaceholder}
                    placeholderTextColor={colors.grey}
                    accessibilityLabel={`${slot.kind}: where you are today`}
                    style={styles.today}
                  />
                ) : null}
              </View>
            </View>
          );
        })}
      </View>
      <Note tone="latte">{"Two of your three goals have nothing to do with the scale. That's what keeps you going in week 7."}</Note>
    </StepScreen>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 22, paddingVertical: 14, paddingHorizontal: 16, flexDirection: 'row', gap: 14, alignItems: 'flex-start' },
  cardFilled: { backgroundColor: colors.mist },
  cardFree: { borderWidth: 1.5, borderStyle: 'dashed', borderColor: colors.radioOff },
  body: { flex: 1, gap: 4 },
  input: { fontFamily: fontFamilyFor(500), fontSize: 16, lineHeight: 21, color: colors.ink, padding: 0 },
  inputLine: { height: 40, borderBottomWidth: 1, borderBottomColor: colors.radioOff, fontFamily: fontFamilyFor(400) },
  today: { fontFamily: fontFamilyFor(400), fontSize: 13, color: colors.ink, padding: 0 },
});

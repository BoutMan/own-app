import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Button, Heading, Switch, Txt } from '@/components';
import { useOnboarding, type HealthFlag, type PelvicSymptom } from '@/features/onboarding/OnboardingContext';
import { CheckRow, Note, StepScreen } from '@/features/onboarding/ui';
import { colors } from '@/theme';

const flags: { key: HealthFlag; label: string }[] = [
  { key: 'pregnancy', label: 'Pregnant, or gave birth this year' },
  { key: 'condition', label: 'Heart, joint or chronic condition' },
  { key: 'injury', label: 'Coming back from injury or surgery' },
  { key: 'longBreak', label: 'No training for 2+ years' },
];

const symptoms: { key: PelvicSymptom; label: string }[] = [
  { key: 'leaking', label: 'Leaking when I cough, sneeze, laugh or jump' },
  { key: 'heaviness', label: 'A feeling of heaviness low in the belly' },
  { key: 'urgency', label: 'Very urgent needs to pee' },
];

/**
 * 05 · Onboarding 3/7 — safety questions and pelvic floor check.
 * Answers only adapt the programme and suggest seeing a professional: never a diagnosis.
 * They are health data: they stay on the device (CLAUDE.md, non-negotiable rule 1).
 */
export default function HealthCheck() {
  const { answers, update } = useOnboarding();
  const anySymptom = Object.values(answers.pelvic).some(Boolean);
  return (
    <StepScreen
      step={3}
      title={'A quick\ncheck-in'}
      accent="check-in"
      subtitle="Your answers adapt the programme. They never leave your phone."
      gap={18}
      footer={<Button label="Continue" size="lg" onPress={() => router.push('/ground')} />}
    >
      <View style={styles.group}>
        {flags.map((f, i) => (
          <View key={f.key} style={[styles.row, i < flags.length - 1 && styles.divider]}>
            <Txt variant="body" style={{ flex: 1 }}>
              {f.label}
            </Txt>
            <Switch
              value={answers.health[f.key]}
              onChange={(v) => update('health', { ...answers.health, [f.key]: v })}
              accessibilityLabel={f.label}
            />
          </View>
        ))}
      </View>

      <View style={{ gap: 10 }}>
        <View style={styles.sectionHead}>
          <Heading variant="h2" size={22} accent="pelvic floor">
            The pelvic floor check
          </Heading>
          <Txt variant="small" color={colors.grey}>
            30 seconds
          </Txt>
        </View>
        {symptoms.map((s) => (
          <CheckRow
            key={s.key}
            label={s.label}
            checked={answers.pelvic[s.key]}
            onChange={(v) => update('pelvic', { ...answers.pelvic, [s.key]: v })}
          />
        ))}
      </View>

      {anySymptom ? (
        <Note tone="mauve">
          Very common, and it responds well. We swap jumps for grounded moves and keep you at RPE 7. Worth a visit to a pelvic health physio.
        </Note>
      ) : null}
    </StepScreen>
  );
}

const styles = StyleSheet.create({
  group: { borderRadius: 22, backgroundColor: colors.mist, paddingHorizontal: 16, paddingVertical: 4 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, gap: 12 },
  divider: { borderBottomWidth: 1, borderBottomColor: colors.lineOnMist },
  sectionHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
});

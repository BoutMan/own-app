import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { CTA, Heading, ListGroup, ListRow, Switch, Txt, type IconName } from '@/components';
import { useOnboarding, type HealthFlag, type PelvicSymptom } from '@/features/onboarding/OnboardingContext';
import { Note, StepScreen } from '@/features/onboarding/ui';
import { colors, type Tone } from '@/theme';

const flags: { key: HealthFlag; label: string; icon: IconName; tone: Tone }[] = [
  { key: 'pregnancy', label: 'Pregnant, or gave birth this year', icon: 'person', tone: 'mauve' },
  { key: 'condition', label: 'Heart, joint or chronic condition', icon: 'heart', tone: 'vanilla' },
  { key: 'injury', label: 'Coming back from injury or surgery', icon: 'restart', tone: 'fog' },
  { key: 'longBreak', label: 'No training for 2+ years', icon: 'timer', tone: 'latte' },
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
      footer={<CTA label="Continue" onPress={() => router.push('/ground')} />}
    >
      <ListGroup>
        {flags.map((f) => (
          <ListRow
            key={f.key}
            icon={f.icon}
            tone={f.tone}
            label={f.label}
            right={<Switch value={answers.health[f.key]} onChange={(v) => update('health', { ...answers.health, [f.key]: v })} accessibilityLabel={f.label} />}
          />
        ))}
      </ListGroup>

      <View style={{ gap: 10 }}>
        <View style={styles.sectionHead}>
          <Heading variant="h2" size={22} accent="pelvic floor">
            The pelvic floor check
          </Heading>
          <Txt variant="small" color={colors.grey}>
            30 seconds
          </Txt>
        </View>
        <ListGroup>
          {symptoms.map((s) => (
            <ListRow
              key={s.key}
              icon="halfCircle"
              tone="mauve"
              tileOnWhite
              label={s.label}
              right={<Switch value={answers.pelvic[s.key]} onChange={(v) => update('pelvic', { ...answers.pelvic, [s.key]: v })} accessibilityLabel={s.label} />}
            />
          ))}
        </ListGroup>
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
  sectionHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
});

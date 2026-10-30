import { router } from 'expo-router';
import { Pressable, TextInput } from 'react-native';

import { CTA, Txt } from '@/components';
import { useDb } from '@/db/DbProvider';
import { saveOnboarding } from '@/db/repositories';
import { formatShort, seasonEnd } from '@/lib/dates';
import { useOnboarding } from '@/features/onboarding/OnboardingContext';
import { ContractPaper, contractStyles } from '@/features/onboarding/ContractPaper';
import { shareStartDate } from '@/features/onboarding/shareStartDate';
import { SignaturePad } from '@/features/onboarding/SignaturePad';
import { StepScreen } from '@/features/onboarding/ui';
import { toOnboardingRecord } from '@/features/onboarding/record';
import { askForNotifications } from '@/features/reminders/notifications';
import { colors } from '@/theme';

/** 09 · Onboarding 7/7 — the contract, signed with a finger. Signing stores the onboarding on the device. */
export default function Contract() {
  const { answers, update } = useOnboarding();
  const { write } = useDb();
  const sign = () => {
    write((db) => saveOnboarding(db, toOnboardingRecord(answers, new Date())));
    // The contract promises reminders: ask for notifications here, in context.
    void askForNotifications();
    router.push('/ready');
  };
  const range = `${formatShort(answers.startDate)} → ${formatShort(seasonEnd(answers.startDate))}`.toLowerCase();
  return (
    <StepScreen
      step={7}
      title="Make it yours"
      accent="yours"
      gap={18}
      footer={
        <>
          <CTA label="Sign & start my season" disabled={!answers.signed} onPress={sign} />
          <Pressable accessibilityRole="button" style={{ alignSelf: 'center' }} hitSlop={8} onPress={() => void shareStartDate(answers.startDate)}>
            <Txt variant="body" size={14} color={colors.grey}>
              Send my start date to a friend
            </Txt>
          </Pressable>
        </>
      }
    >
      <ContractPaper
        range={range}
        name={
          <TextInput
            value={answers.firstName}
            onChangeText={(t) => update('firstName', t)}
            placeholder="I am… (your first name)"
            placeholderTextColor={colors.grey}
            accessibilityLabel="Your first name"
            autoCapitalize="words"
            autoComplete="given-name"
            textContentType="givenName"
            maxLength={40}
            style={contractStyles.name}
          />
        }
        signature={
          <SignaturePad
            onChange={(signed, strokes) => {
              update('signed', signed);
              update('signature', strokes);
            }}
          />
        }
      />
    </StepScreen>
  );
}

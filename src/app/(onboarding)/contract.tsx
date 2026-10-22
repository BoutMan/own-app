import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { Button, Txt } from '@/components';
import { photos } from '@/content/photos';
import { useDb } from '@/db/DbProvider';
import { saveOnboarding } from '@/db/repositories';
import { formatShort, seasonEnd } from '@/lib/dates';
import { useOnboarding } from '@/features/onboarding/OnboardingContext';
import { SignaturePad } from '@/features/onboarding/SignaturePad';
import { StepScreen } from '@/features/onboarding/ui';
import { toOnboardingRecord } from '@/features/onboarding/record';
import { colors, fontFamilyFor } from '@/theme';

// The six commitments of the guide's contract, as worded in the mockup.
const commitments = [
  '12 weeks, not a result',
  'Four dates a week with myself',
  'Never miss twice in a row',
  'Measure more than the scale',
  'Talk to myself like my best friend',
  'Start again, as often as it takes',
] as const;

/** 09 · Onboarding 7/7 — the contract, signed with a finger. Signing stores the onboarding on the device. */
export default function Contract() {
  const { answers, update } = useOnboarding();
  const { write } = useDb();
  const sign = () => {
    write((db) => saveOnboarding(db, toOnboardingRecord(answers, new Date())));
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
          <Button label="Sign & start my season" size="lg" disabled={!answers.signed} onPress={sign} />
          {/* TODO(milestone 5): share sheet with the start date. */}
          <Pressable accessibilityRole="button" style={{ alignSelf: 'center' }} hitSlop={8}>
            <Txt variant="body" size={14} color={colors.grey}>
              Send my start date to a friend
            </Txt>
          </Pressable>
        </>
      }
    >
      <View style={styles.stage}>
        <Image source={photos.streetAbsMatcha} style={StyleSheet.absoluteFill} contentFit="cover" contentPosition={{ top: '30%', left: '50%' }} />
        <View style={styles.paper}>
          <View style={styles.paperHead}>
            <Txt variant="h1" size={28} weight={600} style={{ letterSpacing: 0, lineHeight: 30 }}>
              my contract
            </Txt>
            <Txt variant="small" color={colors.grey}>
              {range}
            </Txt>
          </View>
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
            style={styles.name}
          />
          <View style={{ gap: 7 }}>
            {commitments.map((c, i) => (
              <View key={c} style={styles.item}>
                <Txt variant="body" size={14} weight={700} style={{ width: 10 }}>
                  {String(i + 1)}
                </Txt>
                <Txt variant="body" size={14} style={{ flex: 1, lineHeight: 18 }}>
                  {c}
                </Txt>
              </View>
            ))}
          </View>
          <SignaturePad onChange={(signed) => update('signed', signed)} />
        </View>
      </View>
    </StepScreen>
  );
}

const styles = StyleSheet.create({
  stage: { flexGrow: 1, minHeight: 440, borderRadius: 26, overflow: 'hidden', backgroundColor: '#E9E7E4' },
  paper: {
    position: 'absolute', left: 14, right: 14, top: 14, borderRadius: 22, backgroundColor: colors.white,
    paddingTop: 18, paddingHorizontal: 18, paddingBottom: 12, gap: 10,
    shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 14, shadowOffset: { width: 0, height: 8 }, elevation: 4,
  },
  paperHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  item: { flexDirection: 'row', gap: 10 },
  name: {
    fontFamily: fontFamilyFor(600), fontSize: 17, letterSpacing: -0.34, color: colors.ink,
    paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: colors.line,
  },
});

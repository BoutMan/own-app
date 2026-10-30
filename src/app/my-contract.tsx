import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Button, CircleButton, Heading, Pill, Screen, Txt } from '@/components';
import { ContractPaper, contractStyles, SignedStrokes } from '@/features/onboarding/ContractPaper';
import { shareStartDate } from '@/features/onboarding/shareStartDate';
import { useProfile } from '@/features/profile/useProfile';
import { useSeason } from '@/features/season/currentWeek';
import { formatShort, seasonEnd } from '@/lib/dates';
import { colors } from '@/theme';

/** 09 · The signed contract, read back from Me (the guide: reread it when week 7 gets heavy, p. 53). */
export default function MyContract() {
  const profile = useProfile();
  const { startDate, week } = useSeason();
  const range = `${formatShort(startDate)} → ${formatShort(seasonEnd(startDate))}`.toLowerCase();
  const signedAt = profile.contractSignedAt ? new Date(profile.contractSignedAt) : null;

  return (
    <Screen gap={16} contentStyle={{ paddingHorizontal: 20 }}>
      <View style={styles.top}>
        <CircleButton icon="chevronLeft" accessibilityLabel="Back" onPress={() => router.back()} />
        <Pill label={`Week ${week} of 12`} dot size="sm" surface="mist" />
      </View>
      <View style={{ gap: 6 }}>
        <Heading variant="h1" accent="contract">
          My contract
        </Heading>
        <Txt variant="body" size={14} color={colors.grey}>
          {signedAt ? 'What you promised yourself. Reread it on the weeks that feel heavy.' : 'Your contract is signed at the end of onboarding.'}
        </Txt>
      </View>
      <ContractPaper
        range={range}
        name={
          <Txt variant="body" style={[contractStyles.name, !profile.firstName && { color: colors.grey }]}>
            {profile.firstName ? `I am ${profile.firstName}` : 'I am…'}
          </Txt>
        }
        signature={
          <SignedStrokes
            strokes={profile.contractSignature ?? []}
            caption={signedAt ? `Signed ${formatShort(signedAt)}` : 'Not signed yet'}
          />
        }
      />
      <Button label="Send my start date to a friend" variant="outline" onPress={() => void shareStartDate(startDate)} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});

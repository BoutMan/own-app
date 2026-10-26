import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { CircleButton, Heading, Screen, Txt } from '@/components';
import { legalDocs } from '@/content/legal';
import { colors } from '@/theme';

/** Terms of Use and Privacy Policy, readable offline (same text as the hosted pages). */
export default function Legal() {
  const { doc: id } = useLocalSearchParams<{ doc: string }>();
  const doc = id === 'privacy' ? legalDocs.privacy : legalDocs.terms;
  return (
    <Screen gap={18} contentStyle={{ paddingHorizontal: 20 }}>
      <View style={styles.top}>
        <CircleButton icon="chevronLeft" accessibilityLabel="Back" onPress={() => router.back()} />
      </View>
      <Heading variant="h1" accent={doc.accent}>
        {doc.title}
      </Heading>
      <Txt variant="body" size={15}>
        {doc.intro}
      </Txt>
      {doc.sections.map((s) => (
        <View key={s.heading} style={{ gap: 8 }}>
          <Heading variant="h2" size={20}>
            {s.heading}
          </Heading>
          {s.paragraphs.map((p) => (
            <Txt key={p.slice(0, 40)} variant="body" size={14} color={colors.grey} style={{ lineHeight: 21 }}>
              {p}
            </Txt>
          ))}
        </View>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  top: { flexDirection: 'row' },
});

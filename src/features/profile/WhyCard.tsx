import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { Button, QuoteCard } from '@/components';
import { fontFamilyFor, tones } from '@/theme';

import { useProfile, useUpdateProfile } from './useProfile';

/** "My why" (Today, Me): the user's own line, written and rewritten in place. */
export function WhyCard({ caption = 'My why' }: { caption?: string }) {
  const { myWhy } = useProfile();
  const update = useUpdateProfile();
  const [draft, setDraft] = useState<string | null>(null);

  if (draft === null) {
    return (
      <QuoteCard
        quote={myWhy ?? 'Why are you doing this? One line for the days it feels hard.'}
        caption={caption}
        actionLabel={myWhy ? 'Rewrite' : 'Write it'}
        onAction={() => setDraft(myWhy ?? '')}
      />
    );
  }
  return (
    <View style={styles.card}>
      <TextInput
        value={draft}
        onChangeText={setDraft}
        placeholder="Why are you doing this? One line, in your words."
        placeholderTextColor={tones.mocha.soft}
        accessibilityLabel="My why"
        multiline
        maxLength={160}
        autoFocus
        style={styles.input}
      />
      <Button
        label="Keep it"
        onPress={() => {
          update({ myWhy: draft.trim() || null });
          setDraft(null);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 26, backgroundColor: tones.mocha.bg, padding: 20, gap: 12 },
  input: { fontFamily: fontFamilyFor(700), fontSize: 20, letterSpacing: -0.6, color: tones.mocha.strong, minHeight: 60, padding: 0 },
});

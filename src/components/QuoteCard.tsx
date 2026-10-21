import { Pressable, StyleSheet, View } from 'react-native';

import { tones } from '@/theme';

import { QuoteGlyph } from './Icon';
import { Txt } from './Txt';

type QuoteCardProps = {
  quote: string;
  caption: string;
  actionLabel?: string;
  onAction?: () => void;
};

/** Mocha card with large cocoa quote marks and a 700 quote ("My why", coach cues). */
export function QuoteCard({ quote, caption, actionLabel, onAction }: QuoteCardProps) {
  const t = tones.mocha;
  return (
    <View style={styles.card}>
      <QuoteGlyph />
      <Txt variant="quote" size={20} color={t.strong}>
        {quote}
      </Txt>
      <View style={styles.footer}>
        <Txt variant="eyebrow" color={t.soft} style={{ letterSpacing: 0.96 }}>
          {caption}
        </Txt>
        {actionLabel ? (
          <Pressable accessibilityRole="button" onPress={onAction} hitSlop={8}>
            <Txt variant="meta" weight={500} color={t.strong} style={{ textDecorationLine: 'underline' }}>
              {actionLabel}
            </Txt>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 26,
    backgroundColor: tones.mocha.bg,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 18,
    gap: 12,
  },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});


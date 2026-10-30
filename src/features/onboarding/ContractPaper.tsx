import { Image } from 'expo-image';
import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { Txt } from '@/components';
import { photos } from '@/content/photos';
import { colors, fontFamilyFor } from '@/theme';

// The six commitments of the guide's contract, as worded in the mockup.
export const COMMITMENTS = [
  '12 weeks, not a result',
  'Four dates a week with myself',
  'Never miss twice in a row',
  'Measure more than the scale',
  'Talk to myself like my best friend',
  'Start again, as often as it takes',
] as const;

type ContractPaperProps = {
  /** "oct 26 → jan 17" */
  range: string;
  /** First-name field (onboarding) or the signed name (My contract). */
  name: ReactNode;
  /** Signature pad (onboarding) or the stored strokes (My contract). */
  signature: ReactNode;
};

/** 09 · The contract on its photo stage: shared by the onboarding step and "My contract". */
export function ContractPaper({ range, name, signature }: ContractPaperProps) {
  return (
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
        {name}
        <View style={{ gap: 7 }}>
          {COMMITMENTS.map((c, i) => (
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
        {signature}
      </View>
    </View>
  );
}

/** The stored signature, drawn back as it was signed. */
export function SignedStrokes({ strokes, caption, height = 64 }: { strokes: readonly string[]; caption: string; height?: number }) {
  return (
    <View style={styles.signed}>
      <Svg width="100%" height={height}>
        {strokes.map((d, i) => (
          <Path key={i} d={d} stroke={colors.ink} strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        ))}
      </Svg>
      <Txt variant="small" color={colors.grey} style={{ textAlign: 'right' }}>
        {caption}
      </Txt>
    </View>
  );
}

export const contractStyles = StyleSheet.create({
  name: {
    fontFamily: fontFamilyFor(600), fontSize: 17, letterSpacing: -0.34, color: colors.ink,
    paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: colors.line,
  },
});

const styles = StyleSheet.create({
  stage: { flexGrow: 1, minHeight: 440, borderRadius: 26, overflow: 'hidden', backgroundColor: '#E9E7E4' },
  paper: {
    position: 'absolute', left: 14, right: 14, top: 14, borderRadius: 22, backgroundColor: colors.white,
    paddingTop: 18, paddingHorizontal: 18, paddingBottom: 12, gap: 10,
    shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 14, shadowOffset: { width: 0, height: 8 }, elevation: 4,
  },
  paperHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  item: { flexDirection: 'row', gap: 10 },
  signed: { borderTopWidth: 1, borderTopColor: colors.line, paddingTop: 8, gap: 4 },
});

import { Image, type ImageContentPosition, type ImageSource } from 'expo-image';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { colors, tones, type Tone } from '@/theme';

import { Icon, type IconName } from './Icon';
import { Txt } from './Txt';

type ThumbRowProps = {
  source: ImageSource;
  focus?: ImageContentPosition;
  eyebrow?: string;
  title: string;
  text: string;
  right?: ReactNode;
  onPress?: () => void;
};

/** Hairline card with a rounded photo thumbnail (sessions of the week, next exercise). */
export function ThumbRow({ source, focus, eyebrow, title, text, right, onPress }: ThumbRowProps) {
  return (
    <Pressable disabled={!onPress} onPress={onPress} accessibilityRole={onPress ? 'button' : undefined} style={styles.thumbRow}>
      <Image source={source} style={styles.thumb} contentFit="cover" contentPosition={focus} />
      <View style={styles.body}>
        {eyebrow ? (
          <Txt variant="small" color={colors.grey}>
            {eyebrow}
          </Txt>
        ) : null}
        <Txt variant="cardTitle" size={eyebrow ? 15 : 18} weight={eyebrow ? 600 : 700} style={eyebrow ? { letterSpacing: 0 } : { letterSpacing: -0.54 }}>
          {title}
        </Txt>
        <Txt variant="small" color={colors.grey}>
          {text}
        </Txt>
      </View>
      {right}
    </Pressable>
  );
}

type LinkRowProps = {
  icon: IconName;
  title: string;
  text: string;
  /** Tone background; mist when omitted. */
  tone?: Tone;
  trailing?: 'chevron' | 'lock' | 'none';
  onPress?: () => void;
};

/** Filled row with a white 38px icon square, title, text and chevron or lock. */
export function LinkRow({ icon, title, text, tone, trailing = 'chevron', onPress }: LinkRowProps) {
  const t = tone ? tones[tone] : null;
  return (
    <Pressable
      disabled={!onPress}
      onPress={onPress}
      accessibilityRole={onPress ? 'button' : undefined}
      style={[styles.linkRow, { backgroundColor: t ? t.bg : colors.mist }]}
    >
      <View style={styles.iconBox}>
        <Icon name={icon} size={17} strokeWidth={1.8} color={t ? t.soft : colors.ink} />
      </View>
      <View style={styles.body}>
        <Txt variant="bodyStrong" weight={t ? 700 : 600} color={t ? t.strong : colors.ink} style={t ? { letterSpacing: -0.3 } : undefined}>
          {title}
        </Txt>
        <Txt variant="small" color={t ? t.soft : colors.grey}>
          {text}
        </Txt>
      </View>
      {trailing === 'none' ? null : (
        <Icon name={trailing === 'lock' ? 'lock' : 'chevronRight'} size={15} strokeWidth={1.8} color={t ? t.soft : colors.grey} />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  thumbRow: {
    flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 10, paddingLeft: 10, paddingRight: 14,
    borderRadius: 22, borderWidth: 1, borderColor: colors.line,
  },
  thumb: { width: 68, height: 68, borderRadius: 16 },
  body: { flex: 1, gap: 2, minWidth: 0 },
  linkRow: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 14, paddingHorizontal: 16, borderRadius: 22 },
  iconBox: { width: 38, height: 38, borderRadius: 12, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center' },
});

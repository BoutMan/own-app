import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { radius, tones, type Tone } from '@/theme';

import { Icon, type IconName } from './Icon';
import { Txt } from './Txt';

type ToneCardProps = {
  tone: Tone;
  icon: IconName;
  eyebrow?: string;
  title: string;
  text?: string;
  style?: StyleProp<ViewStyle>;
};

/** Tone background, white 38px icon square, eyebrow + title + text in the tone's dark inks. */
export function ToneCard({ tone, icon, eyebrow, title, text, style }: ToneCardProps) {
  const t = tones[tone];
  return (
    <View style={[styles.card, { backgroundColor: t.bg }, style]}>
      <View style={styles.iconBox}>
        <Icon name={icon} size={17} strokeWidth={1.8} color={t.soft} />
      </View>
      <View style={styles.body}>
        {eyebrow ? (
          <Txt variant="eyebrow" color={t.soft} style={{ letterSpacing: 0.96 }}>
            {eyebrow}
          </Txt>
        ) : null}
        <Txt variant="cardTitle" color={t.strong}>
          {title}
        </Txt>
        {text ? (
          <Txt variant="meta" color={t.soft}>
            {text}
          </Txt>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: radius.card, padding: 16, flexDirection: 'row', gap: 14, alignItems: 'flex-start' },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: { flex: 1, gap: 3, minWidth: 0 },
});

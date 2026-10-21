import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, radius, size } from '@/theme';

import { Icon, PlayGlyph } from './Icon';
import { Txt } from './Txt';

type CTAProps = {
  label: string;
  onPress?: () => void;
  /** `dark`: black pill (default). `light`: white pill laid over a photo, black play button. */
  tone?: 'dark' | 'light';
  glyph?: 'arrow' | 'play';
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

/** Primary action: 56px pill, label left, round button with arrow right. */
export function CTA({ label, onPress, tone = 'dark', glyph = 'arrow', disabled, style }: CTAProps) {
  const dark = tone === 'dark';
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        dark ? styles.dark : styles.light,
        (pressed || disabled) && { opacity: disabled ? 0.4 : 0.85 },
        style,
      ]}
    >
      <Txt variant="body" size={dark ? 16 : 15} weight={dark ? 500 : 600} color={dark ? colors.white : colors.ink}>
        {label}
      </Txt>
      <View style={[styles.circle, { backgroundColor: dark ? colors.white : colors.ink }]}>
        {glyph === 'play' ? (
          <PlayGlyph color={dark ? colors.ink : colors.white} />
        ) : (
          <Icon name="arrowRight" size={16} strokeWidth={2} color={dark ? colors.ink : colors.white} />
        )}
      </View>
    </Pressable>
  );
}

type ButtonProps = {
  label: string;
  onPress?: () => void;
  /** `solid`: black. `outline`: white with 1.5px ink border. `ghost`: outlined white on a photo. */
  variant?: 'solid' | 'outline' | 'ghost';
  /** `lg`: 56px full-width primary ("Continue"). */
  size?: 'md' | 'lg';
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

/** Secondary centred pill button ("Share" / "Done", "10-min version"). */
export function Button({ label, onPress, variant = 'solid', size = 'md', disabled, style }: ButtonProps) {
  const v = buttonVariants[variant];
  const lg = size === 'lg';
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        v.box,
        lg && { height: 56 },
        (pressed || disabled) && { opacity: disabled ? 0.35 : 0.85 },
        style,
      ]}
    >
      <Txt variant="body" size={variant === 'ghost' ? 13 : lg ? 16 : 15} weight={500} color={v.text}>
        {label}
      </Txt>
    </Pressable>
  );
}

const buttonVariants = {
  solid: { box: { backgroundColor: colors.ink }, text: colors.white },
  outline: { box: { backgroundColor: colors.white, borderWidth: 1.5, borderColor: colors.ink }, text: colors.ink },
  ghost: {
    box: { backgroundColor: 'rgba(17,17,17,0.2)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.7)', paddingHorizontal: 16 },
    text: colors.white,
  },
} as const;

const styles = StyleSheet.create({
  base: {
    height: size.cta,
    borderRadius: radius.pill,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dark: { backgroundColor: colors.ink, paddingLeft: 24, paddingRight: 7 },
  light: { backgroundColor: colors.white, paddingLeft: 20, paddingRight: 6, height: 54 },
  circle: {
    width: size.ctaInnerCircle,
    height: size.ctaInnerCircle,
    borderRadius: size.ctaInnerCircle / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    height: 54,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
});

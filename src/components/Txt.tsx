import { Text, type StyleProp, type TextProps, type TextStyle } from 'react-native';

import { colors, textStyle, type FontWeight, type TypeVariant } from '@/theme';

type TxtProps = TextProps & {
  variant?: TypeVariant;
  /** Override the variant size (titles range 34–64px in the mockups). */
  size?: number;
  weight?: FontWeight;
  color?: string;
  style?: StyleProp<TextStyle>;
};

/** The only text primitive of the app: Instrument Sans, tokenized sizes, never italic. */
export function Txt({ variant = 'body', size, weight, color = colors.ink, style, ...rest }: TxtProps) {
  return <Text {...rest} style={[textStyle(variant, { size, weight }), { color }, style]} />;
}

export type AccentSurface = 'white' | 'photo' | 'dark';

const accentBySurface: Record<AccentSurface, string> = {
  white: colors.cocoa,
  photo: colors.keyOnPhoto,
  dark: colors.cocoaLight,
};

type HeadingProps = Omit<TxtProps, 'children'> & {
  children: string;
  /** The single key word of the title, rendered in the accent colour. Must appear in `children`. */
  accent?: string;
  /** Background the title sits on; picks the accent tone. */
  on?: AccentSurface;
};

/** Title with exactly one accented key word: "Today's **rituals**". */
export function Heading({ children, accent, on = 'white', variant = 'h1', color, ...rest }: HeadingProps) {
  const base = color ?? (on === 'white' ? colors.ink : colors.white);
  const at = accent ? children.indexOf(accent) : -1;
  if (!accent || at < 0) {
    return (
      <Txt accessibilityRole="header" variant={variant} color={base} {...rest}>
        {children}
      </Txt>
    );
  }
  return (
    <Txt accessibilityRole="header" variant={variant} color={base} {...rest}>
      {children.slice(0, at)}
      <Text style={{ color: accentBySurface[on] }}>{accent}</Text>
      {children.slice(at + accent.length)}
    </Txt>
  );
}

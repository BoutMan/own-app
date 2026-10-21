import type { TextStyle } from 'react-native';

import { font, type } from './tokens';

export type TypeVariant = keyof typeof type;
export type FontWeight = 400 | 500 | 600 | 700;

const familyByWeight: Record<FontWeight, string> = {
  400: font.regular,
  500: font.medium,
  600: font.semibold,
  700: font.bold,
};

/** Custom fonts ship one file per weight, so weight is selected through fontFamily, not fontWeight. */
export function fontFamilyFor(weight: FontWeight): string {
  return familyByWeight[weight];
}

/** Mockups express tracking in em; React Native wants absolute px. */
export function tracking(em: number, size: number): number {
  return Math.round(em * size * 100) / 100;
}

/** Resolves a type token into a concrete TextStyle. Optional overrides cover the 34–64px title range of the mockups. */
export function textStyle(variant: TypeVariant, overrides?: { size?: number; weight?: FontWeight }): TextStyle {
  const t = type[variant];
  const size = overrides?.size ?? t.size;
  const weight = overrides?.weight ?? t.weight;
  return {
    fontFamily: fontFamilyFor(weight),
    fontSize: size,
    lineHeight: Math.round(size * t.lineHeight),
    letterSpacing: tracking(t.trackingEm, size),
    ...('uppercase' in t && t.uppercase ? { textTransform: 'uppercase' as const } : null),
  };
}

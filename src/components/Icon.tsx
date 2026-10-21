import type { ReactNode } from 'react';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

import { colors } from '@/theme';

/** Line icons lifted from the mockups (24×24 viewBox, stroke 1.6–1.8). */
const glyphs = {
  arrowRight: <Path d="M5 12h14M13 6l6 6-6 6" />,
  chevronLeft: <Path d="M15 5l-7 7 7 7" />,
  chevronRight: <Path d="M9 5l7 7-7 7" />,
  close: <Path d="M6 6l12 12M18 6L6 18" />,
  check: <Path d="M5 12l5 5 9-10" />,
  search: (
    <>
      <Circle cx={11} cy={11} r={6.5} />
      <Path d="M16 16l4.5 4.5" />
    </>
  ),
  share: <Path d="M12 3v12M7 8l5-5 5 5M5 14v6h14v-6" />,
  sparkle: <Path d="M12 3l2 7 7 2-7 2-2 7-2-7-7-2 7-2z" />,
  sun: (
    <>
      <Circle cx={12} cy={12} r={4} />
      <Path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </>
  ),
  steps: <Path d="M8 4c2 0 3 2 3 4s-1 4-3 4-3-2-3-4 1-4 3-4zM16 10c2 0 3 2 3 4s-1 4-3 4-3-2-3-4 1-4 3-4zM6 15h4M14 21h4" />,
  water: <Path d="M12 3c3 4 6 7 6 11a6 6 0 01-12 0c0-4 3-7 6-11z" />,
  protein: <Path d="M12 3c3.5 0 6 5 6 9.5A6 6 0 016 12.5C6 8 8.5 3 12 3z" />,
  moon: <Path d="M20 14.5A8 8 0 019.5 4a8 8 0 1010.5 10.5z" />,
  home: <Path d="M4 11l8-7 8 7v9H4z" />,
  calendar: (
    <>
      <Rect x={4} y={5} width={16} height={15} rx={2} />
      <Path d="M4 10h16M9 3v4M15 3v4" />
    </>
  ),
  trend: <Path d="M4 19l5-6 4 3 7-9" />,
  person: (
    <>
      <Circle cx={12} cy={8} r={4} />
      <Path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" />
    </>
  ),
  dumbbell: <Path d="M3 9v6M6 7v10M18 7v10M21 9v6M6 12h12" />,
} satisfies Record<string, ReactNode>;

export type IconName = keyof typeof glyphs;

type IconProps = {
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
};

export function Icon({ name, size = 20, color = colors.ink, strokeWidth = 1.7 }: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {glyphs[name]}
    </Svg>
  );
}

/** Filled play triangle used on "Start session". */
export function PlayGlyph({ size = 15, color = colors.white }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <Path d="M8 5l12 7-12 7z" />
    </Svg>
  );
}

/** Large opening quote mark of QuoteCard. */
export function QuoteGlyph({ color = colors.cocoa }: { color?: string }) {
  return (
    <Svg width={40} height={31} viewBox="0 0 44 34" fill={color}>
      <Path d="M0 34V20C0 9 6 2 17 0l2 5c-6 2-9 6-9 11h8v18zM25 34V20c0-11 6-18 17-20l2 5c-6 2-9 6-9 11h8v18z" />
    </Svg>
  );
}

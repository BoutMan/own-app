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
  grid: (
    <>
      <Rect x={4} y={4} width={7} height={7} rx={1.5} />
      <Rect x={13} y={4} width={7} height={7} rx={1.5} />
      <Rect x={4} y={13} width={7} height={7} rx={1.5} />
      <Rect x={13} y={13} width={7} height={7} rx={1.5} />
    </>
  ),
  timer: (
    <>
      <Circle cx={12} cy={13} r={8} />
      <Path d="M12 9v4l2 2M10 2h4" />
    </>
  ),
  leaf: <Path d="M5 19c0-8 5-13 14-14-1 9-6 14-14 14zM5 19l7-7" />,
  crown: <Path d="M4 18h16M5 18l-1-10 5 4 3-6 3 6 5-4-1 10" />,
  lock: (
    <>
      <Rect x={5} y={11} width={14} height={10} rx={2} />
      <Path d="M8 11V8a4 4 0 018 0v3" />
    </>
  ),
  bolt: <Path d="M13 3L5 13h6l-1 8 8-10h-6z" />,
  breath: <Path d="M3 9h11a3 3 0 10-3-3M3 15h15a3 3 0 11-3 3M3 12h7" />,
  posture: <Path d="M12 3v18M9 6h6M9 10h6M9 14h6M9 18h6" />,
  smile: (
    <>
      <Circle cx={12} cy={12} r={8.5} />
      <Path d="M8.5 14a4 4 0 007 0M9 9.5h.01M15 9.5h.01" />
    </>
  ),
  stairs: <Path d="M3 20h5v-5h5v-5h5V5h3" />,
  jeans: <Path d="M7 3h10l1 18h-5l-1-10-1 10H6z" />,
  star: <Path d="M12 2l2.2 7.8L22 12l-7.8 2.2L12 22l-2.2-7.8L2 12l7.8-2.2z" />,
  repeat: <Path d="M17 3l3 3-3 3M20 6H9a5 5 0 00-5 5M7 21l-3-3 3-3M4 18h11a5 5 0 005-5" />,
  volume: <Path d="M4 9v6h4l5 4V5L8 9zM17 9a4 4 0 010 6" />,
  settings: (
    <>
      <Circle cx={12} cy={12} r={3} />
      <Path d="M19.4 15a1.6 1.6 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.6 1.6 0 00-2.7 1.1V21a2 2 0 11-4 0v-.1a1.6 1.6 0 00-2.7-1.1l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.6 1.6 0 00-1.1-2.7H3a2 2 0 110-4h.1a1.6 1.6 0 001.1-2.7l-.1-.1a2 2 0 112.8-2.8l.1.1a1.6 1.6 0 002.7-1.1V3a2 2 0 114 0v.1a1.6 1.6 0 002.7 1.1l.1-.1a2 2 0 112.8 2.8l-.1.1a1.6 1.6 0 001.1 2.7H21a2 2 0 110 4h-.1a1.6 1.6 0 00-1.5 1.3z" />
    </>
  ),
  heart: <Path d="M12 20s-7-4.5-7-10a4 4 0 017-2.6A4 4 0 0119 10c0 5.5-7 10-7 10z" />,
  flag: <Path d="M5 21V4M5 4h11l-2 4 2 4H5" />,
  target: (
    <>
      <Circle cx={12} cy={12} r={8} />
      <Circle cx={12} cy={12} r={4} />
      <Circle cx={12} cy={12} r={0.8} />
    </>
  ),
  send: <Path d="M3 12l18-7-7 18-2-8z" />,
  ill: <Path d="M12 3v6M9 6h6M5 13a7 7 0 0014 0" />,
  bars: <Path d="M4 21v-7M8 21V10M12 21V3M16 21v-9M20 21v-5" />,
  restart: <Path d="M4 12a8 8 0 108-8M4 4v4h4" />,
  note: <Path d="M5 4h14v16H5zM9 9h6M9 13h6M9 17h3" />,
  bell: <Path d="M6 16V11a6 6 0 0112 0v5l2 2H4zM10 21h4" />,
  halfCircle: (
    <>
      <Circle cx={12} cy={12} r={8} />
      <Path d="M12 4a8 8 0 010 16" />
    </>
  ),
  people: (
    <>
      <Circle cx={9} cy={9} r={3.5} />
      <Circle cx={16.5} cy={10} r={2.5} />
      <Path d="M3 20c.8-3.5 3.2-5.5 6-5.5s5.2 2 6 5.5M15 15c2.5 0 4.5 1.6 5.5 5" />
    </>
  ),
  walk: (
    <>
      <Circle cx={13} cy={4.5} r={1.8} />
      <Path d="M10 21l2-6-3-3 1-4 4 2 3 1M12 15l3 6" />
    </>
  ),
  plankMark: (
    <>
      <Circle cx={12} cy={12} r={9} />
      <Path d="M7 12h10" />
    </>
  ),
  phone: (
    <>
      <Rect x={7} y={3} width={10} height={18} rx={2} />
      <Path d="M11 18h2" />
    </>
  ),
  cloud: <Path d="M7 18a4 4 0 01-.5-8 5.5 5.5 0 0110.7-1.5A4 4 0 0117 18zM12 11v4M10 13l2-2 2 2" />,
  ban: (
    <>
      <Circle cx={12} cy={12} r={8} />
      <Path d="M6.5 6.5l11 11" />
    </>
  ),
  card: (
    <>
      <Rect x={3} y={6} width={18} height={12} rx={2} />
      <Path d="M3 10h18" />
    </>
  ),
  download: <Path d="M12 4v11M7 10l5 5 5-5M5 20h14" />,
  trash: <Path d="M5 7h14M9 7V4h6v3M7 7l1 13h8l1-13" />,
  music: (
    <>
      <Circle cx={7} cy={17} r={2.5} />
      <Circle cx={17} cy={15} r={2.5} />
      <Path d="M9.5 17V6l10-2v11" />
    </>
  ),
  chat: <Path d="M5 5h14v10H9l-4 4z" />,
  shirt: <Path d="M8 4l4 2 4-2 4 4-3 3v9H7v-9L4 8z" />,
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

/**
 * Own — design tokens (DA v2 "clean girl, photo-first")
 * Extracted from the validated Claude Design mockups (design/screens-html).
 * Source of truth: design/tokens.ts. Keep both files in sync.
 */

export const colors = {
  // Base
  white: '#FFFFFF',
  mist: '#F5F4F1',      // soft surface: grouped lists, inactive day pills, secondary buttons
  line: '#ECE9E4',      // 1px borders on white cards
  lineOnMist: '#E7E4DF',// dividers inside mist cards
  ink: '#111111',       // text, primary CTA, active states — black is reserved for ACTION
  grey: '#6B6B6B',      // secondary text
  greySoft: '#5F5A55',  // value line inside gauges
  disabled: '#DAD6D0',  // switch off track
  radioOff: '#CFCAC2',

  // Accent — exactly ONE key word per heading, never on buttons
  cocoa: '#8A6E5A',
  cocoaLight: '#C9A98F',   // accent on dark backgrounds (Evening screen, rings)
  keyOnPhoto: '#E6D9CB',   // key word inside a white title laid over a photo

  // Dark mode screen (Evening wind-down only)
  night: '#141312',
  nightCard: '#2A2826',
  nightText: '#F5F4F1',
  nightMuted: '#B5B0A9',
  nightFaint: '#8C8781',
} as const;

/** Café-crème tones: used to number, classify and fill gauges. Never on a CTA. */
export const tones = {
  vanilla: { bg: '#EFE7DD', strong: '#3A2A1F', soft: '#4E3B2E', ring: '#C9A98F' },
  latte:   { bg: '#E6D9CB', strong: '#3E2C20', soft: '#5A4130', ring: '#C9A98F' },
  mauve:   { bg: '#E8DCE1', strong: '#45293A', soft: '#5E3F4C', ring: '#C4A2AD' },
  fog:     { bg: '#DDE3E9', strong: '#22313F', soft: '#33475A', ring: '#A9B6C2' },
  mocha:   { bg: '#D9C7B6', strong: '#2B1E15', soft: '#4A3426', ring: '#B89A82' },
} as const;
export type Tone = keyof typeof tones;

/** Instrument Sans only (Google Fonts, OFL). Weights 400/500/600/700. No italics anywhere. */
export const font = {
  family: 'InstrumentSans',
  regular: 'InstrumentSans_400Regular',
  medium: 'InstrumentSans_500Medium',
  semibold: 'InstrumentSans_600SemiBold',
  bold: 'InstrumentSans_700Bold',
} as const;

/** letterSpacing is given in em in the mockups; RN needs px → em * fontSize. */
export const type = {
  heroXL:  { size: 64, weight: 700, lineHeight: 0.92, trackingEm: -0.065 }, // "Mia", "Anchor" on photo
  hero:    { size: 52, weight: 700, lineHeight: 0.92, trackingEm: -0.06 },  // titles laid on photos (46–60)
  h1:      { size: 40, weight: 700, lineHeight: 1.0,  trackingEm: -0.055 }, // page titles on white (34–44)
  h2:      { size: 26, weight: 700, lineHeight: 1.1,  trackingEm: -0.04 },  // section titles
  cardTitle: { size: 17, weight: 700, lineHeight: 1.2, trackingEm: -0.025 },
  stat:    { size: 32, weight: 700, lineHeight: 1.0,  trackingEm: -0.05 },
  quote:   { size: 22, weight: 700, lineHeight: 1.14, trackingEm: -0.04 },
  body:    { size: 15, weight: 400, lineHeight: 1.45, trackingEm: 0 },
  bodyStrong: { size: 15, weight: 600, lineHeight: 1.3, trackingEm: 0 },
  meta:    { size: 13, weight: 400, lineHeight: 1.4,  trackingEm: 0 },
  small:   { size: 12, weight: 400, lineHeight: 1.35, trackingEm: 0 },
  eyebrow: { size: 12, weight: 600, lineHeight: 1.2,  trackingEm: 0.1, uppercase: true },
  tab:     { size: 11, weight: 500, lineHeight: 1.2,  trackingEm: 0 },
  logo:    { size: 24, weight: 700, lineHeight: 1.0,  trackingEm: -0.06, text: 'own.' },
} as const;

export const radius = {
  heroBottom: 34,   // full-bleed photo header: rounded bottom corners only
  heroFrame: 28,    // inner white hairline frame inset 12px inside photo headers
  card: 24,         // tone cards, white cards (20–26)
  gauge: 20,
  tile: 22,         // photo tiles
  iconTile: 11,     // 34px icon squares (12 for 38px)
  dayPill: 18,
  pill: 999,
} as const;

export const space = {
  screenX: 20,        // horizontal padding of every screen
  screenTop: 56,      // status bar safe area in mockups (use SafeAreaView in the app)
  sectionGap: 22,     // between sections
  stackGap: 10,       // between cards of the same list
  gridGap: 8,         // 2-col / 3-col grids
  cardPad: 16,
} as const;

export const size = {
  circleButton: 44,   // back / close / settings round buttons
  cta: 56,            // primary black pill (54–56)
  ctaInnerCircle: 42, // white circle with arrow inside the CTA
  gauge: 64,          // daily rituals gauge card (58–60 for compact lists)
  iconTile: 34,
  iconTileLg: 38,
  tabBar: 84,
  switchW: 46, switchH: 28,
  avatar: 44,
} as const;

/** Hairline frame + gradient used on every full-bleed photo header */
export const photoHeader = {
  frameInset: 12,
  frameColor: 'rgba(255,255,255,0.5)',
  gradient: ['rgba(17,17,17,0.20)', 'rgba(17,17,17,0)', 'rgba(17,17,17,0)', 'rgba(17,17,17,0.62)'],
  gradientStops: [0, 0.26, 0.46, 1],
} as const;

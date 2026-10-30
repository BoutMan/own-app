import { router } from 'expo-router';
import { Image, type ImageContentPosition, type ImageSource } from 'expo-image';
import type { ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CircleButton, Heading, Icon, Txt, type IconName } from '@/components';
import { colors, radius, space, tones, type Tone } from '@/theme';

export const TOTAL_STEPS = 7;

type StepScreenProps = {
  step: number;
  title: string;
  accent: string;
  subtitle?: string;
  /** Pinned under the content: the primary button (and an optional link). */
  footer: ReactNode;
  children: ReactNode;
  gap?: number;
};

/** Onboarding step: back button + progress bar + "n/7", title with key word, scrolling body, bottom action. */
export function StepScreen({ step, title, accent, subtitle, footer, children, gap = 20 }: StepScreenProps) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.root, { paddingTop: insets.top + 12 }]}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[styles.content, { gap }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <CircleButton icon="chevronLeft" accessibilityLabel="Back" onPress={() => router.back()} />
          <View
            style={styles.track}
            accessibilityRole="progressbar"
            accessibilityLabel={`Step ${step} of ${TOTAL_STEPS}`}
            accessibilityValue={{ min: 0, max: TOTAL_STEPS, now: step }}
          >
            <View style={[styles.bar, { width: `${(step / TOTAL_STEPS) * 100}%` }]} />
          </View>
          <Txt variant="meta" color={colors.grey}>{`${step}/${TOTAL_STEPS}`}</Txt>
        </View>
        <View style={{ gap: 10 }}>
          <Heading variant="h1" accent={accent}>
            {title}
          </Heading>
          {subtitle ? (
            <Txt variant="body" color={colors.grey}>
              {subtitle}
            </Txt>
          ) : null}
        </View>
        {children}
      </ScrollView>
      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) + 12 }]}>{footer}</View>
    </View>
  );
}

type NoteProps = { tone: Tone; icon?: IconName; children: string };

/** Small tone card that explains what an answer changes. */
export function Note({ tone, icon = 'sparkle', children }: NoteProps) {
  return (
    <View style={[styles.note, { backgroundColor: tones[tone].bg }]}>
      <Icon name={icon} size={16} strokeWidth={1.8} color={tones[tone].soft} />
      <Txt variant="meta" color={tones[tone].strong} style={{ flex: 1 }}>
        {children}
      </Txt>
    </View>
  );
}

/** 26px corner badge: black with a check when selected, white ring otherwise. */
export function SelectMark({ selected }: { selected: boolean }) {
  return selected ? (
    <View style={[styles.mark, styles.markOn]}>
      <Icon name="check" size={13} strokeWidth={2.6} color={colors.white} />
    </View>
  ) : (
    <View style={[styles.mark, styles.markOff]} />
  );
}

type SelectPhotoCardProps = {
  source: ImageSource;
  focus?: ImageContentPosition;
  selected: boolean;
  onPress: () => void;
  height: number;
  accessibilityLabel: string;
  /** Overlay laid at the bottom of the photo (pill or white caption card). */
  children: ReactNode;
};

/** Photo button with a 2px ink border and a corner check when selected (Feel, Your ground). */
export function SelectPhotoCard({ source, focus, selected, onPress, height, accessibilityLabel, children }: SelectPhotoCardProps) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ checked: selected }}
      onPress={onPress}
      style={[styles.photoCard, { height, borderColor: selected ? colors.ink : 'transparent' }]}
    >
      <Image source={source} style={StyleSheet.absoluteFill} contentFit="cover" contentPosition={focus} />
      <View style={styles.photoMark}>
        <SelectMark selected={selected} />
      </View>
      {children}
    </Pressable>
  );
}

type ChipProps = { label: string; selected: boolean; onPress: () => void };

/** 40px choice chip: black when selected, hairline border otherwise. */
export function Chip({ label, selected, onPress }: ChipProps) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked: selected }}
      onPress={onPress}
      style={[styles.chip, selected ? styles.chipOn : styles.chipOff]}
    >
      <Txt variant="body" size={14} color={selected ? colors.white : colors.ink}>
        {label}
      </Txt>
    </Pressable>
  );
}

type DotRatingProps = { label: string; value: number | null; onChange: (value: number) => void };

/** One marker rated 1–10 with ten 18px dots. */
export function DotRating({ label, value, onChange }: DotRatingProps) {
  return (
    <View style={styles.ratingRow}>
      <Txt variant="body" size={14} numberOfLines={1} style={{ flex: 1 }}>
        {label}
      </Txt>
      <View style={styles.dots} accessibilityRole="adjustable" accessibilityLabel={label} accessibilityValue={{ min: 1, max: 10, now: value ?? undefined }}>
        {Array.from({ length: 10 }, (_, i) => (
          <Pressable
            key={i}
            hitSlop={{ top: 10, bottom: 10, left: 1, right: 1 }}
            accessibilityLabel={`${label} ${i + 1}`}
            onPress={() => onChange(i + 1)}
            style={[styles.dot, { backgroundColor: value != null && i < value ? colors.ink : colors.disabled }]}
          />
        ))}
      </View>
    </View>
  );
}

/** `onTone`: white square on a tone card (the ToneCard look of the final art direction). */
type NumberTileProps = { n: number; tone: Tone; size?: number; onTone?: boolean };

/** Tone square holding a step number (goals, blocks). */
export function NumberTile({ n, tone, size = 40, onTone }: NumberTileProps) {
  return (
    <View style={[styles.numberTile, { width: size, height: size, backgroundColor: onTone ? colors.white : tones[tone].bg }]}>
      <Txt variant="h2" size={19} weight={600} color={tones[tone].soft} style={{ letterSpacing: 0 }}>
        {String(n)}
      </Txt>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.white },
  content: { paddingHorizontal: space.screenX, paddingBottom: 20, flexGrow: 1 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  track: { flex: 1, height: 4, borderRadius: 2, backgroundColor: colors.line, overflow: 'hidden' },
  bar: { height: 4, borderRadius: 2, backgroundColor: colors.ink },
  footer: { paddingHorizontal: space.screenX, paddingTop: 8, gap: 12, backgroundColor: colors.white },
  note: { flexDirection: 'row', gap: 10, alignItems: 'center', paddingVertical: 12, paddingHorizontal: 14, borderRadius: 18 },
  mark: { width: 26, height: 26, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  markOn: { backgroundColor: colors.ink },
  markOff: { borderWidth: 1.5, borderColor: colors.white },
  photoCard: { flex: 1, borderWidth: 2, borderRadius: 20, overflow: 'hidden', backgroundColor: colors.mist },
  photoMark: { position: 'absolute', top: 10, right: 10 },
  chip: { height: 40, paddingHorizontal: 16, borderRadius: radius.pill, borderWidth: 1.5, justifyContent: 'center' },
  chipOn: { backgroundColor: colors.ink, borderColor: colors.ink },
  chipOff: { backgroundColor: colors.white, borderColor: colors.line },
  ratingRow: { flexDirection: 'row', alignItems: 'center', height: 38, gap: 4 },
  dots: { flexDirection: 'row', gap: 4 },
  dot: { width: 18, height: 18, borderRadius: 9 },
  numberTile: { borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
});

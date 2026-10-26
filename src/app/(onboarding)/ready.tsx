import { Image } from 'expo-image';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button, Heading, Icon, Screen, Txt } from '@/components';
import { photos } from '@/content/photos';
import { blocks as programmeBlocks } from '@/domain/programme';
import { formatShort, seasonEnd } from '@/lib/dates';
import { formatTime } from '@/lib/time';
import { useOnboarding, type Equipment, type OnboardingAnswers } from '@/features/onboarding/OnboardingContext';
import { NumberTile } from '@/features/onboarding/ui';
import { colors, space, type Tone } from '@/theme';

const blockTones: Tone[] = ['vanilla', 'latte', 'mauve'];
const blockList = programmeBlocks.map((b, i) => ({
  n: b.number,
  tone: blockTones[i]!,
  title: `${b.name} · weeks ${b.weeks[0]}–${b.weeks[3]}`,
  text: b.summary,
}));

const equipmentWords: Record<Exclude<Equipment, 'none'>, string> = {
  chair: 'a chair',
  band: 'band',
  dumbbells: 'dumbbells',
  kettlebell: 'kettlebell',
  backpack: 'backpack',
};
const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;
const DAY_FULL = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const;

function joinWords(words: string[]): string {
  if (words.length <= 1) return words.join('');
  return `${words.slice(0, -1).join(', ')} and ${words[words.length - 1]}`;
}

/** "Made for you" lines, written from the answers. */
function madeForYou(a: OnboardingAnswers): string[] {
  const lines: string[] = [];
  const kit = a.equipment.filter((e): e is Exclude<Equipment, 'none'> => e !== 'none').map((e) => equipmentWords[e]);
  lines.push(a.place === 'gym' ? 'Gym · bars, cables and machines' : kit.length ? `Home · ${joinWords(kit)}` : 'Home · bodyweight to start');
  if (Object.values(a.pelvic).some(Boolean)) lines.push('Grounded versions on, RPE capped at 7');
  const sessions = a.week.flatMap((d, i) => (d === 'session' ? [DAY_NAMES[i]] : []));
  const walk = a.week.findIndex((d) => d === 'walk');
  if (sessions.length) lines.push(`${sessions.join(' · ')} at ${formatTime(a.sessionTime)}${walk >= 0 ? `, walk on ${DAY_FULL[walk]}` : ''}`);
  const goals = a.goals.map((g) => g.text.trim()).filter(Boolean);
  if (goals.length) lines.push(`Goals: ${goals.join(', ')}`);
  return lines;
}

/** 10 · Your season is ready — recap before the paywall. */
export default function Ready() {
  const { answers } = useOnboarding();
  const insets = useSafeAreaInsets();
  const range = `${formatShort(answers.startDate)} → ${formatShort(seasonEnd(answers.startDate))}`;
  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <Screen gap={20} contentStyle={{ paddingHorizontal: space.screenX, paddingTop: insets.top + 20 }}>
        <View style={styles.hero}>
          <View style={styles.avatars}>
            {[photos.greySetStretch, photos.eggsAvocado, photos.sheetMask].map((src, i) => (
              <Image key={i} source={src} style={[styles.avatar, i > 0 && { marginLeft: -10 }]} />
            ))}
          </View>
          <Heading variant="h1" size={44} accent="ready" style={{ textAlign: 'center', letterSpacing: -2.64, lineHeight: 43 }}>
            {'Your season\nis ready'}
          </Heading>
          <Txt variant="body" color={colors.grey}>{`12 weeks · ${range} · built around you`}</Txt>
        </View>

        <View style={{ gap: 8 }}>
          {blockList.map((b) => (
            <View key={b.n} style={styles.block}>
              <NumberTile n={b.n} tone={b.tone} size={42} />
              <View style={{ flex: 1, gap: 2 }}>
                <Txt variant="body" weight={500}>
                  {b.title}
                </Txt>
                <Txt variant="small" color={colors.grey}>
                  {b.text}
                </Txt>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.made}>
          <Txt variant="eyebrow" color={colors.grey} style={{ letterSpacing: 0.96 }}>
            Made for you
          </Txt>
          {madeForYou(answers).map((line) => (
            <View key={line} style={styles.line}>
              <Icon name="check" size={16} strokeWidth={2} color={colors.cocoa} />
              <Txt variant="body" size={14} style={{ flex: 1 }}>
                {line}
              </Txt>
            </View>
          ))}
        </View>
      </Screen>
      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) + 12 }]}>
        <Button label="Unlock my season" size="lg" onPress={() => router.push('/paywall')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { alignItems: 'center', gap: 14 },
  avatars: { flexDirection: 'row' },
  avatar: { width: 52, height: 52, borderRadius: 26, borderWidth: 3, borderColor: colors.white },
  block: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 12, paddingHorizontal: 14, borderRadius: 20, backgroundColor: colors.mist },
  made: { borderRadius: 22, borderWidth: 1, borderColor: colors.line, paddingVertical: 14, paddingHorizontal: 16, gap: 10 },
  line: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  footer: { paddingHorizontal: space.screenX, paddingTop: 8 },
});

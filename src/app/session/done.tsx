import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button, CircleButton, Gutter, Heading, Pill, PhotoHeader, Screen, StatTiles, ToneCard, Txt } from '@/components';
import { photos } from '@/content/photos';
import { sessionA } from '@/content/sessionA';
import { colors, radius } from '@/theme';

/** 14 · Session complete — stats, the +1 earned, how it felt. */
export default function SessionComplete() {
  const params = useLocalSearchParams<{ minutes?: string; exercises?: string }>();
  const insets = useSafeAreaInsets();
  const [feel, setFeel] = useState<number | null>(null);
  const minutes = params.minutes ?? '34';
  const exercises = params.exercises ?? String(sessionA.exercises.length);
  const goHome = () => router.replace('/(tabs)');

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <StatusBar style="light" />
      <Screen padTop={false} gap={20} contentStyle={{ paddingBottom: 100 }}>
        <PhotoHeader
          source={photos.streetAbsMatcha}
          height={470}
          focus={{ top: '25%', left: '50%' }}
          top={
            <>
              {/* Mock count until sessions are stored (milestone 3). */}
              <Pill label="Session 7 of 36" dot size="sm" />
              {/* Glow card sharing (24) is V1. */}
              <CircleButton icon="share" surface="white" accessibilityLabel="Share" />
            </>
          }
        >
          <Txt variant="eyebrow" color="rgba(255,255,255,0.88)" style={{ letterSpacing: 1.44 }}>
            {`${sessionA.name} · today`}
          </Txt>
          <Heading variant="hero" size={60} on="photo" accent="kept." style={{ letterSpacing: -3.6, lineHeight: 55 }}>
            Promise kept.
          </Heading>
          <Txt variant="body" size={14} color="rgba(255,255,255,0.9)">
            Seven sessions in. This is who you are now.
          </Txt>
        </PhotoHeader>

        <Gutter gap={20}>
          <StatTiles
            stats={[
              { value: minutes, label: 'minutes', tone: 'vanilla' },
              { value: `${exercises}/${exercises}`, label: 'exercises', tone: 'mauve' },
              { value: '2', label: '+1 achieved', tone: 'fog' },
            ]}
          />
          <ToneCard
            tone="latte"
            icon="sparkle"
            eyebrow="Your +1"
            title="12 reps on every goblet squat set"
            text="Next time we move you to 22 lb. You earned it."
          />

          <View style={{ gap: 10 }}>
            <Heading variant="h2" accent="feel">
              How did it feel?
            </Heading>
            <View style={styles.scale}>
              {Array.from({ length: 10 }, (_, i) => {
                const on = feel === i + 1;
                return (
                  <Pressable
                    key={i}
                    accessibilityRole="radio"
                    accessibilityState={{ checked: on }}
                    accessibilityLabel={`${i + 1} out of 10`}
                    onPress={() => setFeel(i + 1)}
                    style={[styles.scaleItem, { backgroundColor: on ? colors.ink : colors.mist }]}
                  >
                    <Txt variant="body" size={14} weight={on ? 600 : 400} color={on ? colors.white : colors.ink}>
                      {String(i + 1)}
                    </Txt>
                  </Pressable>
                );
              })}
            </View>
            <View style={styles.scaleLegend}>
              {['Easy', 'Just right', 'All out'].map((l) => (
                <Txt key={l} variant="small" color={colors.grey}>
                  {l}
                </Txt>
              ))}
            </View>
          </View>
        </Gutter>
      </Screen>

      <View style={[styles.actions, { paddingBottom: Math.max(insets.bottom, 16) + 8 }]}>
        <Button label="Share" variant="outline" style={{ flex: 1 }} />
        <Button label="Done" style={{ flex: 1 }} onPress={goHome} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scale: { flexDirection: 'row', gap: 4 },
  scaleItem: { flex: 1, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  scaleLegend: { flexDirection: 'row', justifyContent: 'space-between' },
  actions: {
    position: 'absolute', left: 0, right: 0, bottom: 0, flexDirection: 'row', gap: 10,
    paddingHorizontal: 20, paddingTop: 10, backgroundColor: colors.white, borderRadius: radius.card,
  },
});

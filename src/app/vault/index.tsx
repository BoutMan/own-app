import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';

import { Button, CircleButton, CTA, Heading, Icon, Pill, Screen, Txt } from '@/components';
import { checkpoints, type Checkpoint } from '@/domain/programme';
import { useSeason } from '@/features/season/currentWeek';
import { CHECKPOINT_LABEL, CHECKPOINT_WEEK, POSES } from '@/features/vault/poses';
import { useVault, type VaultPhoto } from '@/features/vault/useVault';
import { useVaultLock } from '@/features/vault/VaultLock';
import { addDays, formatShort } from '@/lib/dates';
import { colors, radius } from '@/theme';

/**
 * Photo vault (spec, "Coffre photos"): front, side and back at day 0 and at each block review,
 * behind Face ID, stored in the app on this phone only. Never in the camera roll, never uploaded.
 */
export default function Vault() {
  const season = useSeason();
  const vault = useVault(season.season);
  const lock = useVaultLock();
  const [selected, setSelected] = useState<VaultPhoto | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const open = checkpoints.filter((c) => CHECKPOINT_WEEK[c] <= season.week || vault.photos.some((p) => p.checkpoint === c));
  const next = checkpoints.find((c) => !open.includes(c));
  const nextDate = next ? addDays(season.startDate, (CHECKPOINT_WEEK[next] - 1) * 7 + 6) : null;
  const latest = [...open].reverse().find((c) => c !== 'day0' && vault.at(c, 'front'));
  const compare = latest ? { before: vault.at('day0', 'front'), after: vault.at(latest, 'front'), label: CHECKPOINT_LABEL[latest] } : null;

  const shoot = (c: Checkpoint, pose: string) => router.push({ pathname: '/vault/capture', params: { checkpoint: c, pose } });

  if (selected && lock.open) {
    return (
      <View style={styles.viewer}>
        <Image source={{ uri: selected.fileUri }} style={StyleSheet.absoluteFill} contentFit="contain" />
        <View style={styles.viewerTop}>
          <CircleButton icon="close" surface="white" accessibilityLabel="Close" onPress={() => { setSelected(null); setConfirmDelete(false); }} />
          <Pill label={`${CHECKPOINT_LABEL[selected.checkpoint]} · ${POSES.find((p) => p.id === selected.pose)?.label ?? ''}`} dot size="sm" />
        </View>
        <View style={styles.viewerBottom}>
          <Button label="Retake" variant="ghost" style={{ flex: 1 }} onPress={() => { const s = selected; setSelected(null); shoot(s.checkpoint, s.pose); }} />
          <Button
            label={confirmDelete ? 'Tap again to delete' : 'Delete'}
            variant="ghost"
            style={{ flex: 1 }}
            onPress={async () => {
              if (!confirmDelete) return setConfirmDelete(true);
              await vault.remove(selected.id);
              setSelected(null);
              setConfirmDelete(false);
            }}
          />
        </View>
      </View>
    );
  }

  return (
    <Screen gap={16} contentStyle={{ paddingHorizontal: 20 }}>
      <View style={styles.rowBetween}>
        <CircleButton icon="chevronLeft" accessibilityLabel="Back" onPress={() => router.back()} />
        <Pill label="Private · only you" dot size="sm" surface="mist" />
      </View>
      <View style={{ gap: 6 }}>
        <Heading variant="h1" accent="vault">
          Photo vault
        </Heading>
        <Txt variant="body" size={14} color={colors.grey}>
          Front, side, back. Same spot, same light, at day 0 and at each block review. They stay in Own on this phone, behind Face ID.
        </Txt>
      </View>

      {!lock.open ? (
        <View style={styles.locked}>
          <View style={styles.lockCircle}>
            <Icon name="lock" size={20} strokeWidth={1.8} />
          </View>
          <Txt variant="cardTitle">{`${vault.photos.length} ${vault.photos.length === 1 ? 'photo' : 'photos'} inside`}</Txt>
          <CTA label="Unlock with Face ID" onPress={() => void lock.unlock()} style={{ alignSelf: 'stretch' }} />
        </View>
      ) : (
        <>
          {lock.unprotected ? (
            <Txt variant="small" color={colors.grey}>
              {Platform.OS === 'web'
                ? 'The preview has no Face ID: the vault opens directly. On the phone, it asks for Face ID or the passcode.'
                : 'This phone has no passcode or Face ID, so the vault opens for anyone holding it. Set a passcode in your iPhone settings to lock it.'}
            </Txt>
          ) : null}

          {compare?.before && compare.after ? (
            <View style={{ gap: 10 }}>
              <Heading variant="h2" accent="far">
                How far you came
              </Heading>
              <View style={styles.compare}>
                {[compare.before, compare.after].map((p, i) => (
                  <Pressable key={p.id} style={styles.compareHalf} onPress={() => setSelected(p)} accessibilityLabel={i === 0 ? 'Day 0 photo' : `${compare.label} photo`}>
                    <Image source={{ uri: p.fileUri }} style={StyleSheet.absoluteFill} contentFit="cover" />
                    <View style={styles.compareLabel}>
                      <Pill label={i === 0 ? 'Day 0' : compare.label} active={i === 1} size="sm" />
                    </View>
                  </Pressable>
                ))}
              </View>
            </View>
          ) : null}

          {open.map((c) => (
            <View key={c} style={{ gap: 10 }}>
              <View style={styles.rowBetween}>
                <Heading variant="h2">{CHECKPOINT_LABEL[c]}</Heading>
                <Txt variant="meta" color={colors.grey}>
                  {`${POSES.filter((p) => vault.at(c, p.id)).length} of 3`}
                </Txt>
              </View>
              <View style={styles.poses}>
                {POSES.map((pose) => {
                  const photo = vault.at(c, pose.id);
                  return photo ? (
                    <Pressable key={pose.id} style={styles.tile} onPress={() => setSelected(photo)} accessibilityLabel={`${CHECKPOINT_LABEL[c]} ${pose.label} photo`}>
                      <Image source={{ uri: photo.fileUri }} style={StyleSheet.absoluteFill} contentFit="cover" />
                      <View style={styles.tileLabel}>
                        <Pill label={pose.label} size="sm" />
                      </View>
                    </Pressable>
                  ) : (
                    <Pressable key={pose.id} style={[styles.tile, styles.empty]} onPress={() => shoot(c, pose.id)} accessibilityRole="button" accessibilityLabel={`Take ${CHECKPOINT_LABEL[c]} ${pose.label} photo`}>
                      <Txt variant="body" weight={600} color={colors.grey}>{`+ ${pose.label}`}</Txt>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          ))}

          {next && nextDate ? (
            <Txt variant="meta" color={colors.grey}>
              {`${CHECKPOINT_LABEL[next]} opens with your block review, around ${formatShort(nextDate)}.`}
            </Txt>
          ) : null}
        </>
      )}

      <View style={styles.footer}>
        <Icon name="lock" size={13} color={colors.grey} />
        <Txt variant="small" color={colors.grey}>
          Never in your camera roll. Never uploaded.
        </Txt>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12 },
  locked: { borderRadius: 24, backgroundColor: colors.mist, padding: 20, gap: 14, alignItems: 'center' },
  lockCircle: { width: 52, height: 52, borderRadius: 26, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center' },
  compare: { flexDirection: 'row', gap: 3, height: 300, borderRadius: radius.tile, overflow: 'hidden' },
  compareHalf: { flex: 1, backgroundColor: colors.mist },
  compareLabel: { position: 'absolute', left: 10, bottom: 10 },
  poses: { flexDirection: 'row', gap: 8 },
  tile: { flex: 1, height: 150, borderRadius: radius.tile, overflow: 'hidden', backgroundColor: colors.mist },
  tileLabel: { position: 'absolute', left: 8, bottom: 8 },
  empty: { alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderStyle: 'dashed', borderColor: colors.radioOff },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  viewer: { flex: 1, backgroundColor: '#111111' },
  viewerTop: { position: 'absolute', top: 56, left: 20, right: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  viewerBottom: { position: 'absolute', bottom: 40, left: 20, right: 20, flexDirection: 'row', gap: 10 },
});

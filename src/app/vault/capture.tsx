import { router, useLocalSearchParams } from 'expo-router';

import type { Pose } from '@/db/repositories';
import { checkpoints, type Checkpoint } from '@/domain/programme';
import { useSeason } from '@/features/season/currentWeek';
import { CaptureView } from '@/features/vault/CaptureView';
import { CHECKPOINT_LABEL, POSES, previousCheckpoint } from '@/features/vault/poses';
import { useVault } from '@/features/vault/useVault';
import { useVaultLock } from '@/features/vault/VaultLock';

/** Takes one vault photo for a checkpoint and pose, then goes back to the vault. */
export default function VaultCapture() {
  const params = useLocalSearchParams<{ checkpoint?: string; pose?: string }>();
  const checkpoint = ((checkpoints as readonly string[]).includes(params.checkpoint ?? '') ? params.checkpoint : 'day0') as Checkpoint;
  const pose = POSES.find((p) => p.id === params.pose) ?? POSES[0]!;
  const { season } = useSeason();
  const vault = useVault(season);
  const { open } = useVaultLock();
  const prev = previousCheckpoint(checkpoint);
  // The ghost is a vault photo: only shown once the vault is unlocked.
  const ghost = !open ? null : (prev && vault.at(prev, pose.id as Pose)?.fileUri) || (checkpoint !== 'day0' ? (vault.at('day0', pose.id)?.fileUri ?? null) : null);

  return (
    <CaptureView
      title={`${CHECKPOINT_LABEL[checkpoint]} · ${pose.label}`}
      cue={pose.cue}
      ghost={ghost}
      onClose={() => router.back()}
      onKeep={async (uri) => {
        await vault.keep(checkpoint, pose.id, uri);
        router.back();
      }}
    />
  );
}

import { useDb, useQuery } from '@/db/DbProvider';
import { activeSeason, removePhoto, savePhoto, seasonPhotos, startSeason, type Pose } from '@/db/repositories';
import { mondayOf } from '@/domain/engine/season';
import { isoDate } from '@/lib/dates';
import type { Checkpoint } from '@/domain/programme';

import { deletePhotoFile, keepCapture } from './files';

export type VaultPhoto = ReturnType<typeof seasonPhotos>[number];

/** The season's vault photos by checkpoint and pose, with keep and delete. */
export function useVault(season: number | null) {
  const { write } = useDb();
  const photos = useQuery((db) => (season === null ? [] : seasonPhotos(db, season)), [season]);
  const at = (c: Checkpoint, p: Pose) => photos.find((x) => x.checkpoint === c && x.pose === p) ?? null;

  const keep = async (c: Checkpoint, p: Pose, tempUri: string) => {
    const uri = await keepCapture(tempUri, `s${season ?? 1}-${c}-${p}-${Date.now()}`);
    const replaced = write((db) => savePhoto(db, season ?? activeSeason(db)?.number ?? startSeason(db, isoDate(mondayOf(new Date()))), c, p, uri));
    if (replaced) await deletePhotoFile(replaced);
  };
  const remove = async (id: number) => {
    const file = write((db) => removePhoto(db, id));
    if (file) await deletePhotoFile(file);
  };
  return { photos, at, keep, remove };
}

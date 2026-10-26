import { useQuery } from '@/db/DbProvider';
import { blockReviewFor, finishedWorkouts, markersAt, testsAt, type ReviewCheckpoint } from '@/db/repositories';
import { blocks, type Block, type BlockNumber, type MarkerId, type TestId } from '@/domain/programme';

export const reviewCheckpoint: Record<BlockNumber, ReviewCheckpoint> = { 1: 'day30', 2: 'day60', 3: 'day90' };

export type BlockReviewData = {
  season: number | null;
  block: Block;
  checkpoint: ReviewCheckpoint;
  /** Strength and circuit sessions done in the block's four weeks (12 planned). */
  sessionsKept: number;
  tests: { day0: Partial<Record<TestId, number>>; now: Partial<Record<TestId, number>> };
  markers: { day0: Partial<Record<MarkerId, number>>; now: Partial<Record<MarkerId, number>> };
  words: { changedMost: string | null; oneChange: string | null } | null;
  /** Tests, markers or words recorded for this checkpoint. */
  started: boolean;
};

const values = (r: Partial<Record<TestId, { value: number }>>) =>
  Object.fromEntries(Object.entries(r).map(([k, v]) => [k, v!.value])) as Partial<Record<TestId, number>>;

/** Everything the block review (screen 22) shows, read from the device. */
export function useBlockReview(blockNumber: BlockNumber, season: number | null): BlockReviewData {
  const block = blocks[blockNumber - 1]!;
  const checkpoint = reviewCheckpoint[blockNumber];
  return useQuery(
    (db) => {
      if (season === null) {
        return { season, block, checkpoint, sessionsKept: 0, tests: { day0: {}, now: {} }, markers: { day0: {}, now: {} }, words: null, started: false };
      }
      const weeks = block.weeks as readonly number[];
      const sessionsKept = finishedWorkouts(db, season).filter((w) => weeks.includes(w.week)).length;
      const tests = { day0: values(testsAt(db, season, 'day0')), now: values(testsAt(db, season, checkpoint)) };
      const markers = { day0: markersAt(db, season, 'day0'), now: markersAt(db, season, checkpoint) };
      const r = blockReviewFor(db, season, checkpoint);
      const words = r ? { changedMost: r.changedMost, oneChange: r.oneChange } : null;
      const started = Object.keys(tests.now).length > 0 || Object.keys(markers.now).length > 0 || words !== null;
      return { season, block, checkpoint, sessionsKept, tests, markers, words, started };
    },
    [blockNumber, season],
  );
}

import type { Pose } from '@/db/repositories';
import type { Checkpoint } from '@/domain/programme';

/** Spec: three guided photos, front, side, back, same framing every time. */
export const POSES: readonly { id: Pose; label: string; cue: string }[] = [
  { id: 'front', label: 'Front', cue: 'Arms relaxed, feet hip-width, same spot as last time.' },
  { id: 'side', label: 'Side', cue: 'Turn left, arms by your sides, look straight ahead.' },
  { id: 'back', label: 'Back', cue: 'Back to the camera, arms relaxed, same distance.' },
];

export const CHECKPOINT_LABEL: Record<Checkpoint, string> = { day0: 'Day 0', day30: 'Day 30', day60: 'Day 60', day90: 'Day 90' };

/** Week in which each checkpoint opens (block reviews, weeks 4, 8, 12). */
export const CHECKPOINT_WEEK: Record<Checkpoint, number> = { day0: 1, day30: 4, day60: 8, day90: 12 };

/** The checkpoint taken just before, whose photo becomes the ghost to match. */
export function previousCheckpoint(c: Checkpoint): Checkpoint | null {
  return c === 'day30' ? 'day0' : c === 'day60' ? 'day30' : c === 'day90' ? 'day60' : null;
}

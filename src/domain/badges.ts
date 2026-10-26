/**
 * Badges of promises kept (spec, "Au-delà du PDF"): 10, 30 and 100 sessions, first push-up from the
 * floor, first deload respected, plus the first week, first block review and a full season. Soft
 * gamification: every badge is earned for good, there is no streak to break.
 */
export type BadgeId = 'firstWeek' | 'sessions10' | 'firstDeload' | 'firstReview' | 'floorPushUp' | 'sessions30' | 'fullSeason' | 'sessions100';

export type BadgeStats = {
  /** Finished sessions, all seasons. */
  sessions: number;
  /** A session finished in a deload week, at reduced load. */
  deloadKept: boolean;
  /** A push-up test from the floor with at least one rep. */
  floorPushUp: boolean;
  /** Block reviews filled in, all seasons. */
  reviews: number;
  /** Day-90 review filled in, or all 12 weeks done. */
  seasonDone: boolean;
};

export type Badge = {
  id: BadgeId;
  label: string;
  earned: boolean;
  /** Session badges not earned yet: the target and what is left. */
  goal?: number;
  toGo?: number;
};

const SESSION_BADGES = { firstWeek: 3, sessions10: 10, sessions30: 30, sessions100: 100 } as const;

const labels: Record<BadgeId, string> = {
  firstWeek: 'First week',
  sessions10: '10 sessions',
  firstDeload: 'Deload kept',
  firstReview: 'Block one, done',
  floorPushUp: 'Floor push-up',
  sessions30: '30 sessions',
  fullSeason: 'Full season',
  sessions100: '100 sessions',
};

export function badges(s: BadgeStats): Badge[] {
  const earned: Record<BadgeId, boolean> = {
    firstWeek: s.sessions >= SESSION_BADGES.firstWeek,
    sessions10: s.sessions >= SESSION_BADGES.sessions10,
    firstDeload: s.deloadKept,
    firstReview: s.reviews >= 1,
    floorPushUp: s.floorPushUp,
    sessions30: s.sessions >= SESSION_BADGES.sessions30,
    fullSeason: s.seasonDone,
    sessions100: s.sessions >= SESSION_BADGES.sessions100,
  };
  return (Object.keys(labels) as BadgeId[]).map((id) => {
    const goal = SESSION_BADGES[id as keyof typeof SESSION_BADGES] as number | undefined;
    return { id, label: labels[id], earned: earned[id], ...(goal !== undefined && !earned[id] ? { goal, toGo: goal - s.sessions } : {}) };
  });
}

/** The four shown on Me: the last two earned, the next session badge, then the next one to earn. */
export function badgeShelf(all: readonly Badge[]): Badge[] {
  const earned = all.filter((b) => b.earned);
  const nextSessions = all.find((b) => !b.earned && b.toGo !== undefined);
  const others = all.filter((b) => !b.earned && b.toGo === undefined);
  const shelf = [...earned.slice(-2), ...(nextSessions ? [nextSessions] : []), ...others];
  return [...shelf, ...earned.slice(0, -2).reverse()].slice(0, 4);
}

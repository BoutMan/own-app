import { describe, expect, it } from '@jest/globals';

import { badgeShelf, badges } from './badges';

const none = { sessions: 0, deloadKept: false, floorPushUp: false, reviews: 0, seasonDone: false };

describe('badges', () => {
  it('earns session badges for good and counts what is left', () => {
    const b = badges({ ...none, sessions: 11 });
    expect(b.filter((x) => x.earned).map((x) => x.id)).toEqual(['firstWeek', 'sessions10']);
    expect(b.find((x) => x.id === 'sessions30')).toMatchObject({ earned: false, toGo: 19 });
  });

  it('shows the last two earned, the next session badge, then the next one', () => {
    const shelf = badgeShelf(badges({ ...none, sessions: 12, deloadKept: true }));
    expect(shelf.map((x) => x.id)).toEqual(['sessions10', 'firstDeload', 'sessions30', 'firstReview']);
  });

  it('starts with what is ahead', () => {
    expect(badgeShelf(badges(none)).map((x) => x.id)).toEqual(['firstWeek', 'firstDeload', 'firstReview', 'floorPushUp']);
  });
});

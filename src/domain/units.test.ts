import { describe, expect, it } from '@jest/globals';

import { displayLoad, formatGirth, formatLength, formatLoad, inputLoadToKg, kgToLb, lbToKg, roundLoad, scaleLoadKg } from './units';

describe('units', () => {
  it('converts kg and lb both ways', () => {
    expect(kgToLb(1)).toBeCloseTo(2.20462, 4);
    expect(lbToKg(kgToLb(37.5))).toBeCloseTo(37.5, 10);
  });

  it('rounds imperial loads to 1 lb up to 20 lb, then to 2.5 lb', () => {
    expect(roundLoad(17.6, 'imperial')).toBe(18);
    expect(roundLoad(20.4, 'imperial')).toBe(20);
    expect(roundLoad(21.4, 'imperial')).toBe(22.5);
  });

  it('rounds metric loads to 0.5 kg', () => {
    expect(roundLoad(8.2, 'metric')).toBe(8);
    expect(roundLoad(8.3, 'metric')).toBe(8.5);
  });

  it('formats the guide dumbbells (4–6 kg) the way the app shows them', () => {
    expect(formatLoad(4, 'imperial')).toBe('9 lb');
    expect(formatLoad(6, 'imperial')).toBe('13 lb');
    expect(formatLoad(8, 'imperial')).toBe('18 lb');
    expect(formatLoad(8.5, 'metric')).toBe('8.5 kg');
    expect(formatLoad(20, 'imperial')).toBe('45 lb');
  });

  it('stores user input in kg', () => {
    expect(inputLoadToKg(18, 'imperial')).toBeCloseTo(8.165, 3);
    expect(inputLoadToKg(8, 'metric')).toBe(8);
  });

  it('keeps a load stable through a display round trip', () => {
    const kg = inputLoadToKg(22.5, 'imperial');
    expect(displayLoad(kg, 'imperial')).toBe(22.5);
  });

  it('scales a load for a deload and lands on a pickable weight', () => {
    // 18 lb at −30 % = 12.6 lb → 13 lb
    const kg = scaleLoadKg(inputLoadToKg(18, 'imperial'), 0.7, 'imperial');
    expect(displayLoad(kg, 'imperial')).toBe(13);
    expect(scaleLoadKg(10, 0.7, 'metric')).toBe(7);
  });

  it('formats lengths', () => {
    expect(formatLength(168, 'imperial')).toBe('5 ft 6 in');
    expect(formatLength(168, 'metric')).toBe('168 cm');
    expect(formatGirth(76.2, 'imperial')).toBe('30.0 in');
    expect(formatGirth(76.2, 'metric')).toBe('76 cm');
  });
});

import { describe, expect, it } from '@jest/globals';
import { getTodayStartIso } from './getTodayStartIso';

describe('getTodayStartIso', () => {
  it('returns local midnight of the given day', () => {
    const now = new Date(2026, 9, 29, 15, 30, 12);
    const start = new Date(getTodayStartIso(now));
    expect(start.getFullYear()).toBe(2026);
    expect(start.getMonth()).toBe(9);
    expect(start.getDate()).toBe(29);
    expect(start.getHours()).toBe(0);
    expect(start.getMinutes()).toBe(0);
  });

  it('uses the same ISO format as my_records.created_at', () => {
    expect(getTodayStartIso(new Date(2026, 9, 29, 1))).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
  });
});

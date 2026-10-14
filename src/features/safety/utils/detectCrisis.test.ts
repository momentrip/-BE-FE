import { describe, expect, it } from '@jest/globals';
import { detectCrisis } from './detectCrisis';

describe('detectCrisis', () => {
  it('returns a boolean', () => {
    expect(typeof detectCrisis('요즘 회사 일이 많아서 불안해요')).toBe('boolean');
  });

  it('returns false for an empty text', () => {
    expect(detectCrisis('')).toBe(false);
  });
});

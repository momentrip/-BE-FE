import { describe, expect, it } from '@jest/globals';
import { detectCrisis } from './detectCrisis';

describe('detectCrisis', () => {
  it('returns false for an empty text', () => {
    expect(detectCrisis('')).toBe(false);
  });

  it.each([
    '요즘 너무 힘들어서 죽고 싶어요',
    '그냥 다 사라지고 싶다',
    '더 이상 살기 싫어',
    '자살하고 싶다는 생각이 들어요',
    '살 이유가 없는 것 같아요',
    '차라리 죽는 게 나을 것 같아',
  ])('detects crisis: %s', (text) => {
    expect(detectCrisis(text)).toBe(true);
  });

  it('ignores spacing differences', () => {
    expect(detectCrisis('죽고싶다')).toBe(true);
    expect(detectCrisis('죽 고 싶 다')).toBe(true);
  });

  it.each([
    '요즘 회사 일이 많아서 불안해요',
    '배고파 죽겠다',
    '유서 깊은 절에 다녀왔어요',
    '이 프로젝트 빨리 끝내고 싶어요',
    '친구한테 화가 나서 연락하기 싫어',
    '진로를 어떻게 정해야 할지 모르겠어요',
  ])('does not flag everyday worries: %s', (text) => {
    expect(detectCrisis(text)).toBe(false);
  });
});

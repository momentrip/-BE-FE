import { describe, expect, it } from '@jest/globals';
import { matchWorryKind } from './matchWorryKind';

describe('matchWorryKind', () => {
  it('빈 텍스트는 unsure를 돌려준다', () => {
    expect(matchWorryKind('')).toBe('unsure');
  });

  it('같은 입력이면 같은 결과를 돌려준다', () => {
    const text = '내일 발표가 너무 걱정돼';
    expect(matchWorryKind(text)).toBe(matchWorryKind(text));
  });
});

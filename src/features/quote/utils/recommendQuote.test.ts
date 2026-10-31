import { describe, expect, it } from '@jest/globals';
import { WORRY_KINDS } from '@/shared/constants';
import { recommendQuote } from './recommendQuote';
import type { RecommendInput } from '../types';

const baseInput: RecommendInput = {
  worryKind: 'anxiety_worry',
  isCrisis: false,
  recentQuoteIds: [],
  seed: 1,
};

describe('recommendQuote', () => {
  it('항상 명언 하나를 돌려준다', () => {
    const quote = recommendQuote(baseInput);
    expect(quote.id).toBeTruthy();
  });

  it('같은 입력이면 같은 명언을 돌려준다', () => {
    expect(recommendQuote(baseInput).id).toBe(recommendQuote({ ...baseInput }).id);
  });

  it.each(WORRY_KINDS)('번뇌 종류에 맞는 명언을 고른다: %s', (worryKind) => {
    expect(recommendQuote({ ...baseInput, worryKind }).themes).toContain(worryKind);
  });

  it('위기 입력이면 무거운 명언을 고르지 않는다', () => {
    for (const worryKind of WORRY_KINDS) {
      for (let seed = 0; seed < 10; seed++) {
        expect(recommendQuote({ ...baseInput, worryKind, isCrisis: true, seed }).tone).not.toBe('heavy');
      }
    }
  });

  it('최근에 받은 명언만 남았으면 그 명언이라도 돌려준다', () => {
    const first = recommendQuote(baseInput);
    const again = recommendQuote({ ...baseInput, recentQuoteIds: [first.id] });
    expect(again.themes).toContain(baseInput.worryKind);
  });

  it('seed가 음수나 소수여도 명언을 돌려준다', () => {
    expect(recommendQuote({ ...baseInput, seed: -3.7 }).id).toBeTruthy();
  });
});

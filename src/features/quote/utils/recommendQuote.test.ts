import { describe, expect, it } from '@jest/globals';
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

  it('맞는 명언이 없는 입력에도 명언을 돌려준다', () => {
    const quote = recommendQuote({ ...baseInput, worryKind: 'unsure' });
    expect(quote.id).toBeTruthy();
  });
});

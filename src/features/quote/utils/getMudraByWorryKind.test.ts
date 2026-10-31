import { describe, expect, it } from '@jest/globals';
import { WORRY_KINDS } from '@/shared/constants';
import { QUOTES } from '../data/quotes';
import { getMudraByWorryKind } from './getMudraByWorryKind';

describe('getMudraByWorryKind', () => {
  it('피그마 고민별 수인 매칭 표대로 돌려준다', () => {
    expect(getMudraByWorryKind('anxiety_worry')).toBe('시무외인');
    expect(getMudraByWorryKind('unsure')).toBe('찻잔 감싸기');
  });

  it('번뇌 종류 8개가 서로 다른 수인 8개에 연결된다', () => {
    const mudras = WORRY_KINDS.map(getMudraByWorryKind);
    expect(new Set(mudras).size).toBe(WORRY_KINDS.length);
  });

  it('명언의 수인은 첫 번째 번뇌 종류의 수인과 같다', () => {
    for (const quote of QUOTES) {
      expect(quote.mudra).toBe(getMudraByWorryKind(quote.themes[0]));
    }
  });

  it('명언 데이터에 수인 8개가 모두 하나 이상 있다', () => {
    const mudras = new Set(QUOTES.map((quote) => quote.mudra));
    expect(mudras.size).toBe(WORRY_KINDS.length);
  });
});

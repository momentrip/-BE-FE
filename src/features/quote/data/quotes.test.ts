import { describe, expect, it } from '@jest/globals';
import { WORRY_KINDS, type WorryKind } from '@/shared/constants';
import { QUOTES } from './quotes';

describe('QUOTES', () => {
  it('피그마 선어 표대로 번뇌별 개수가 맞다 (총 50개)', () => {
    const expected: Record<WorryKind, number> = {
      anxiety_worry: 6,
      overthinking: 7,
      greed_impatience: 6,
      wavering_temptation: 6,
      relationship_anger: 7,
      selfblame_lethargy: 6,
      career_direction: 8,
      unsure: 4,
    };
    for (const kind of WORRY_KINDS) {
      expect(QUOTES.filter((quote) => quote.themes[0] === kind)).toHaveLength(expected[kind]);
    }
    expect(QUOTES).toHaveLength(50);
  });

  it('id가 겹치지 않는다', () => {
    expect(new Set(QUOTES.map((quote) => quote.id)).size).toBe(QUOTES.length);
  });

  it('필수 필드가 비어 있지 않다', () => {
    for (const quote of QUOTES) {
      expect(quote.hanja && quote.reading && quote.meaning && quote.text && quote.author).toBeTruthy();
      expect(quote.commentary.length).toBeGreaterThan(0);
    }
  });

  it('번뇌 종류마다 위기 입력에도 고를 수 있는(heavy가 아닌) 명언이 있다', () => {
    for (const kind of WORRY_KINDS) {
      expect(QUOTES.some((quote) => quote.themes.includes(kind) && quote.tone !== 'heavy')).toBe(true);
    }
  });
});

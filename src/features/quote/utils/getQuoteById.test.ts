import { describe, expect, it } from '@jest/globals';
import { DEFAULT_QUOTE, QUOTES } from '../data/quotes';
import { getQuoteById } from './getQuoteById';

describe('getQuoteById', () => {
  it('있는 id면 그 명언을 돌려준다', () => {
    for (const quote of QUOTES) {
      expect(getQuoteById(quote.id)).toBe(quote);
    }
  });

  it('없는 id면 기본 명언을 돌려준다', () => {
    expect(getQuoteById('없는-id')).toBe(DEFAULT_QUOTE);
    expect(getQuoteById('')).toBe(DEFAULT_QUOTE);
  });
});

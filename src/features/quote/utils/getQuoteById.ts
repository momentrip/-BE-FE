import { DEFAULT_QUOTE, QUOTES } from '../data/quotes';
import type { Quote } from '../types';

/**
 * 저장된 명언 id로 명언을 찾는다. 기록에는 quote_id만 저장되므로 화면에 다시 보여줄 때 쓴다.
 * @param id 명언 id (MyRecord.quoteId에 저장된 값)
 * @returns 찾은 명언. 없는 id면 기본 명언(DEFAULT_QUOTE)을 돌려준다 (빈 결과 없음).
 * 사용처: collection(찻잔 도감 세부 화면)
 */
export function getQuoteById(id: string): Quote {
  return QUOTES.find((quote) => quote.id === id) ?? DEFAULT_QUOTE;
}

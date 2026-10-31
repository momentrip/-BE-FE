import { DEFAULT_QUOTE, QUOTES } from '../data/quotes';
import type { Quote, RecommendInput } from '../types';

/**
 * 사용자 상황에 맞는 명언 하나를 고른다. 순수 함수이며 항상 명언을 돌려준다.
 * 1. 번뇌 종류가 themes에 들어 있는 명언을 후보로 한다. 위기 입력이면 무거운(heavy) 명언은 뺀다.
 * 2. 최근에 받은 명언은 후보가 남아 있으면 뺀다.
 * 3. 후보 중 seed로 하나를 고른다 (같은 seed면 같은 결과).
 * 후보가 없으면 '잘 모르겠어요'(unsure) 명언에서, 그것도 없으면 기본 명언을 돌려준다.
 * @param input worryKind(번뇌 종류), isCrisis(위기 감지 여부), recentQuoteIds(최근 받은 명언 id), seed(동점 처리용)
 * @returns 추천 명언
 * 사용처: zen(선어 화면), session(회차 기록 시 quote_id 저장)
 */
export function recommendQuote({ worryKind, isCrisis, recentQuoteIds, seed }: RecommendInput): Quote {
  const usable = QUOTES.filter((quote) => !(isCrisis && quote.tone === 'heavy'));
  const matched = usable.filter((quote) => quote.themes.includes(worryKind));
  const candidates = matched.length > 0 ? matched : usable.filter((quote) => quote.themes.includes('unsure'));
  if (candidates.length === 0) return DEFAULT_QUOTE;

  const fresh = candidates.filter((quote) => !recentQuoteIds.includes(quote.id));
  const pool = fresh.length > 0 ? fresh : candidates;
  return pool[Math.abs(Math.trunc(seed)) % pool.length];
}

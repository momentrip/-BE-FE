import { DEFAULT_QUOTE } from '../data/quotes';
import type { Quote, RecommendInput } from '../types';

/**
 * 사용자 상황에 맞는 명언 하나를 고른다. 순수 함수이며 항상 명언을 돌려준다.
 * 현재는 임시 구현(stub)으로 입력과 관계없이 기본 명언을 돌려준다.
 * @param input worryKind(번뇌 종류 id), tea(차 id), isCrisis(위기 감지 여부), recentQuoteIds(최근 받은 명언 id), seed(동점 처리용)
 * @returns 추천 명언
 * 사용처: zen(선어 화면), session(회차 기록 시 quote_id 저장)
 */
export function recommendQuote(_input: RecommendInput): Quote {
  return DEFAULT_QUOTE;
}

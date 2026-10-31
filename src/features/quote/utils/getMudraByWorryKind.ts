import type { WorryKind } from '@/shared/constants';
import { MUDRA_BY_WORRY_KIND } from '../data/mudras';
import type { Mudra } from '../types';

/**
 * 번뇌 종류에 맞는 수인을 돌려준다. 피그마 '고민별 수인 매칭' 표 기준이며, 명언의 mudra도 같은 표에서 채운다.
 * @param worryKind 사용자가 고른(또는 분류된) 번뇌 종류
 * @returns 수인 이름. 예: 'anxiety_worry' → '시무외인'
 * 사용처: teaFlow(s4 차 우리기 수인 표시), zen, collection
 */
export function getMudraByWorryKind(worryKind: WorryKind): Mudra {
  return MUDRA_BY_WORRY_KIND[worryKind];
}

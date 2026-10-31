import type { WorryKind } from '@/shared/constants';
import {
  NIGHT_END_HOUR,
  NIGHT_START_HOUR,
  TEA_INFO,
  TEAS_BY_WORRY_KIND,
  type TeaName,
  type TeaSeason,
} from '../data/teas';

export type TeaItem = {
  name: TeaName;
  caffeine: boolean;
  season: TeaSeason;
};

/**
 * 번뇌 종류에 어울리는 차 목록을 돌려준다. 피그마 '오늘의 차 준비' 화면 기준이며 순서도 피그마 순서다.
 * 밤(21시~다음 날 5시 전)에는 카페인 없는 차만 돌려준다. 순수 함수라 현재 시각은 입력으로 받는다.
 * 차 이름은 zen의 TEA_COLOR 키, teaFlow의 getTeaLabel 결과와 같은 글자다.
 * @param input worryKind(번뇌 종류), hour(현재 시각 0~23, 예: new Date().getHours())
 * @returns 차 목록 (이름, 카페인 여부, 계절 태그). 'unsure'면 모든 차. 빈 목록은 돌려주지 않는다.
 * 사용처: teaFlow(s3 차 고르기 목록)
 */
export function getTeasByWorryKind({ worryKind, hour }: { worryKind: WorryKind; hour: number }): TeaItem[] {
  const teas = TEAS_BY_WORRY_KIND[worryKind].map((name) => ({ name, ...TEA_INFO[name] }));
  const isNight = hour >= NIGHT_START_HOUR || hour < NIGHT_END_HOUR;
  if (!isNight) return teas;

  const decaf = teas.filter((tea) => !tea.caffeine);
  return decaf.length > 0 ? decaf : teas;
}

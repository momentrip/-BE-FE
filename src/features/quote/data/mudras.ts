import type { WorryKind } from '@/shared/constants';
import type { Mudra } from '../types';

// 번뇌 종류별 수인. 피그마 디자인 레퍼런스 '고민별 수인 매칭' 표 기준이다.
// 진로·방향은 표에 "사유 자세 (또는 전법륜인)"로 되어 있어 우선 전법륜인으로 둔다.
export const MUDRA_BY_WORRY_KIND: Record<WorryKind, Mudra> = {
  greed_impatience: '여원인',
  wavering_temptation: '항마촉지인',
  relationship_anger: '합장',
  selfblame_lethargy: '지권인',
  anxiety_worry: '시무외인',
  overthinking: '선정인',
  career_direction: '전법륜인',
  unsure: '찻잔 감싸기',
};

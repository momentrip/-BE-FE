import type { WorryKind } from '@/shared/constants';

// 번뇌 종류별 어울리는 차. 피그마 '오늘의 차 준비' 화면의 "○○에 어울리는 차" 기준이며, 순서도 피그마 화면 순서다.
// 차 이름은 zen의 TEA_COLOR 키, teaFlow의 getTeaLabel 결과와 글자까지 같아야 색과 라벨이 맞게 나온다 (#64).
// '잘 모르겠어요'는 피그마에 전용 차가 없어서 모든 차를 보여준다.

/** 차 이름 19개. TEA_COLOR 키와 같다. */
export const TEA_NAMES = [
  '국화차',
  '둥글레차',
  '우전 녹차',
  '백차',
  '옥수수차',
  '세작 녹차',
  '중작 녹차',
  '감잎차',
  '오미자차',
  '구기자차',
  '대추차',
  '쌍화차',
  '연꽃차',
  '매화차',
  '황차',
  '잭살차',
  '우엉차',
  '쑥차',
  '뽕잎차',
] as const;

export type TeaName = (typeof TEA_NAMES)[number];

/** 차 태그에 보여줄 계절. 피그마 태그 문구(가을 제철, 사계절, 봄 한정 등)를 그대로 쓴다. */
export type TeaSeason = '봄 제철' | '봄 한정' | '여름 제철' | '가을 제철' | '겨울 제철' | '사계절';

export type TeaInfo = {
  /** 카페인이 있으면 true. 밤에는 카페인 없는 차만 보여준다. */
  caffeine: boolean;
  season: TeaSeason;
};

// 국화·둥글레·오미자·구기자·연꽃·매화는 피그마 태그 그대로다.
// 나머지 13개는 피그마 태그가 아직 임시값이라 일반적인 차 지식으로 채운 초안이다. 디자인 확정 후 맞춘다.
export const TEA_INFO: Record<TeaName, TeaInfo> = {
  국화차: { caffeine: false, season: '가을 제철' },
  둥글레차: { caffeine: false, season: '사계절' },
  '우전 녹차': { caffeine: true, season: '봄 한정' },
  백차: { caffeine: true, season: '사계절' },
  옥수수차: { caffeine: false, season: '사계절' },
  '세작 녹차': { caffeine: true, season: '봄 제철' },
  '중작 녹차': { caffeine: true, season: '봄 제철' },
  감잎차: { caffeine: false, season: '여름 제철' },
  오미자차: { caffeine: false, season: '사계절' },
  구기자차: { caffeine: false, season: '가을 제철' },
  대추차: { caffeine: false, season: '가을 제철' },
  쌍화차: { caffeine: false, season: '겨울 제철' },
  연꽃차: { caffeine: false, season: '여름 제철' },
  매화차: { caffeine: false, season: '봄 한정' },
  황차: { caffeine: true, season: '사계절' },
  잭살차: { caffeine: true, season: '사계절' },
  우엉차: { caffeine: false, season: '가을 제철' },
  쑥차: { caffeine: false, season: '봄 제철' },
  뽕잎차: { caffeine: false, season: '봄 제철' },
};

export const TEAS_BY_WORRY_KIND: Record<WorryKind, readonly TeaName[]> = {
  anxiety_worry: ['국화차', '둥글레차', '우전 녹차', '백차', '옥수수차'],
  overthinking: ['세작 녹차', '중작 녹차', '감잎차'],
  career_direction: ['오미자차', '구기자차'],
  relationship_anger: ['대추차', '쌍화차'],
  selfblame_lethargy: ['연꽃차', '매화차'],
  greed_impatience: ['황차', '잭살차', '우엉차'],
  wavering_temptation: ['쑥차', '뽕잎차'],
  unsure: TEA_NAMES,
};

/** 이 시각(0~23시)부터 다음 날 NIGHT_END_HOUR 전까지는 카페인 없는 차만 보여준다. 피그마 "밤 9시가 넘어서 카페인 없는 차만 보여드려요" 기준. */
export const NIGHT_START_HOUR = 21;
/** 밤이 끝나는 시각. 새벽에도 카페인 차를 빼려고 둔다. */
export const NIGHT_END_HOUR = 5;

import type { Quote } from '../types';

// 명언 목록. 시안 9-3 기준 50개(번뇌별 6/7/6/6/7/6/8/기본 4)를 채울 예정이며 지금은 시안 예시 1개뿐이다.
// 출처와 말한 사람을 반드시 적고, 저작권 문제가 없는 경전·고전 구절만 넣는다.
export const QUOTES: Quote[] = [
  {
    id: 'q001',
    hanja: '莫妄想',
    reading: '막망상',
    meaning: '망상하지 말라',
    text: '아직 오지 않은 일은\n아직 오지 않았어요.',
    commentary: [
      '당나라의 무업 선사는 누가 무엇을 물어도 "막망상", 한마디로 답했다고 해요.',
      '걱정은 대부분 아직 일어나지 않은 일을 미리 겪는 마음이에요. 오늘의 걱정이 실제로 일어난 일인지, 마음이 그려낸 장면인지 한 번만 나눠 보세요.',
    ],
    author: '무업 선사',
    // TODO: 출처 문헌 확인 후 정확히 기록 (경덕전등록 등)
    source: '',
    themes: ['anxiety_worry'],
    tone: 'comfort',
    mudra: '시무외인',
  },
];

/** 어떤 명언도 고를 수 없을 때 돌려주는 기본 명언 */
export const DEFAULT_QUOTE: Quote = QUOTES[0];

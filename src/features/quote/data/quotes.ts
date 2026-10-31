import type { Quote } from '../types';
import { MUDRA_BY_WORRY_KIND } from './mudras';

// 명언 목록. 시안 9-3 기준 50개(번뇌별 6/7/6/6/7/6/8/기본 4)를 채울 예정이며 지금은 번뇌별 대표 8개다.
// 출처와 말한 사람을 반드시 적고, 저작권 문제가 없는 경전·고전 구절만 넣는다.
// 기록에는 id만 저장되므로 한 번 정한 id는 바꾸지 않는다.
// 수인(mudra)은 손으로 적지 않고 첫 번째 번뇌 종류(themes[0])로 MUDRA_BY_WORRY_KIND에서 채운다.
const QUOTE_ENTRIES: Omit<Quote, 'mudra'>[] = [
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
  },
  {
    id: 'q002',
    hanja: '放下着',
    reading: '방하착',
    meaning: '내려놓아라',
    text: '내려놓으세요.\n내려놓으라는 말조차.',
    commentary: [
      '한 스님이 조주 선사에게 "아무것도 가진 게 없을 때는 어떻게 합니까?" 하고 묻자, 선사는 "내려놓아라"라고 답했다고 해요. "가진 게 없는데 무엇을 내려놓습니까?" 하고 다시 묻자 "그럼 짊어지고 가거라" 했지요.',
      '머릿속을 맴도는 생각도 꼭 붙잡고 있어서 무거운 거예요. 지금 떠오른 생각 하나를 찻잔 옆에 잠시 내려놓는다고 상상해 보세요.',
    ],
    author: '조주 선사',
    source: '조주록',
    themes: ['overthinking'],
    tone: 'reflect',
  },
  {
    id: 'q003',
    hanja: '少欲知足',
    reading: '소욕지족',
    meaning: '적게 바라고 만족할 줄 안다',
    text: '조금 바라고,\n넉넉함을 알면 충분해요.',
    commentary: [
      '부처님이 마지막으로 남긴 가르침을 담은 유교경에 나오는 말이에요. 바라는 것을 줄이고, 이미 가진 것이 넉넉하다는 걸 알아차리라는 뜻이에요.',
      '더 갖고 싶은 마음은 끝이 없어서, 채울수록 비어 있는 것처럼 느껴지기도 해요. 오늘 이미 가진 것 세 가지를 떠올려 보세요.',
    ],
    author: '석가모니',
    source: '유교경(불유교경)',
    themes: ['greed_impatience'],
    tone: 'reflect',
  },
  {
    id: 'q004',
    hanja: '隨處作主',
    reading: '수처작주',
    meaning: '머무는 곳마다 주인이 되라',
    text: '어디에 있든\n그곳의 주인이 되세요.',
    commentary: [
      '임제 선사의 말을 모은 임제록에 나오는 구절로, "서 있는 곳이 모두 참되다(입처개진)"는 말이 뒤따라요.',
      '유혹에 흔들리는 건 마음의 주인 자리를 잠시 내어 준 거예요. 지금 이 자리에서 무엇을 할지 내가 고른다고 한 번만 마음먹어 보세요.',
    ],
    author: '임제 선사',
    source: '임제록',
    themes: ['wavering_temptation'],
    tone: 'cheer',
  },
  {
    id: 'q005',
    hanja: '同體大悲',
    reading: '동체대비',
    meaning: '한 몸처럼 여기는 큰 자비',
    text: '남의 아픔을\n내 아픔처럼.',
    commentary: [
      '대승불교에서는 나와 남이 한 몸처럼 이어져 있어서, 남의 아픔을 내 아픔처럼 느끼는 마음을 가장 큰 자비라고 해요.',
      '미운 마음이 들 때 그 사람도 나처럼 서툴고 아픈 사람일지 모른다고 생각해 보세요. 그 마음은 나 자신에게도 똑같이 건넬 수 있어요.',
    ],
    author: '대승불교 가르침',
    source: '대승불교',
    themes: ['relationship_anger'],
    tone: 'comfort',
  },
  {
    id: 'q006',
    hanja: '天上天下唯我獨尊',
    reading: '천상천하유아독존',
    meaning: '하늘 위 하늘 아래 오직 나 홀로 존귀하다',
    text: '세상 모든 존재가 그렇듯,\n당신도 그 자체로 귀해요.',
    commentary: [
      '부처님이 태어나 일곱 걸음을 걷고 했다는 탄생게의 한 구절이에요. 잘난 척하는 말로 오해받기도 하지만, 모든 존재가 그 자체로 존귀하다는 뜻이에요.',
      '무언가를 잘해야만 귀한 사람이 되는 게 아니에요. 오늘 아무것도 못 했다고 느껴져도, 당신은 이미 충분히 귀한 사람이에요.',
    ],
    author: '석가모니',
    source: '탄생게',
    themes: ['selfblame_lethargy'],
    tone: 'cheer',
  },
  {
    id: 'q007',
    hanja: '步步是道場',
    reading: '보보시도량',
    meaning: '걸음걸음이 곧 도량이다',
    text: '걷는 걸음 하나하나가\n이미 길이에요.',
    commentary: [
      '유마경의 "곧은 마음이 곧 도량(직심시도량)"이라는 말에서 나온 표현이에요. 도를 닦는 곳은 따로 있는 게 아니라 지금 걷는 이 걸음이라는 뜻이에요.',
      '정답 같은 길을 찾을 때까지 멈춰 있을 필요는 없어요. 지금 내딛는 한 걸음도 이미 길의 일부예요.',
    ],
    author: '유마경',
    source: "유마경 '직심시도량'에서 파생",
    themes: ['career_direction'],
    tone: 'cheer',
  },
  {
    id: 'q008',
    hanja: '喫茶去',
    reading: '끽다거',
    meaning: '차나 마시고 가게',
    text: '차나\n한 잔 하게.',
    commentary: [
      '조주 선사는 처음 온 사람에게도, 전에 왔던 사람에게도 똑같이 "차나 마시고 가게"라고 했다고 해요.',
      '마음이 왜 이런지 다 알지 못해도 괜찮아요. 지금은 따뜻한 차 한 잔에 잠시 머물러 보세요.',
    ],
    author: '조주 선사',
    source: '조주록',
    themes: ['unsure'],
    tone: 'comfort',
  },
];

export const QUOTES: Quote[] = QUOTE_ENTRIES.map((entry) => ({
  ...entry,
  mudra: MUDRA_BY_WORRY_KIND[entry.themes[0]],
}));

/** 어떤 명언도 고를 수 없을 때 돌려주는 기본 명언 */
export const DEFAULT_QUOTE: Quote = QUOTES[0];

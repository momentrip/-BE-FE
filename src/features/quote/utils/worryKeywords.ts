import type { WorryKind } from '@/shared/constants';

/** 키워드로 고를 수 있는 번뇌 종류. 'unsure'는 아무것도 안 걸렸을 때의 결과라 키워드가 없다. */
export type MatchableWorryKind = Exclude<WorryKind, 'unsure'>;

// 번뇌 종류별 키워드. 고민 텍스트에 이 문자열이 들어 있으면 1점이다 (부분 문자열 일치).
// 한국어는 활용형이 많아 어간 위주로 적는다. 예: '두려' → 두려워, 두려운
// 짧은 키워드는 다른 단어에 섞여 잘못 걸리기 쉬우니 추가할 때 주의한다. 예: '술' → 기술, 수술
export const WORRY_KEYWORDS: Record<MatchableWorryKind, string[]> = {
  anxiety_worry: [
    '불안', '걱정', '두려', '무서', '겁나', '겁이', '떨려', '떨리', '긴장', '초조',
    '시험', '발표', '면접', '결과', '건강', '아플',
  ],
  overthinking: [
    '생각이 많', '생각이 너무', '잡념', '잡생각', '머릿속', '머리가 복잡', '복잡해',
    '잠이 안', '잠을 못', '못 자', '계속 생각', '신경 쓰', '신경쓰', '집중이 안', '집중 안',
  ],
  career_direction: [
    '진로', '취업', '취준', '이직', '퇴사', '전공', '대학', '입시', '진학', '적성',
    '꿈', '미래', '방향', '회사', '직장', '커리어', '뭘 해야', '뭐 해야',
  ],
  relationship_anger: [
    '화가', '화나', '짜증', '분노', '싸웠', '싸움', '다퉜', '서운', '미워', '배신',
    '친구', '엄마', '아빠', '부모', '가족', '남친', '여친', '남자친구', '여자친구',
    '애인', '연인', '동료', '상사', '팀장', '관계', '헤어', '이별',
  ],
  selfblame_lethargy: [
    '자책', '내 탓', '내탓', '한심', '무기력', '의욕', '귀찮', '하기 싫', '못났',
    '실망', '후회', '자존감', '게으', '지쳤', '지쳐', '번아웃',
  ],
  greed_impatience: [
    '욕심', '조급', '빨리', '서둘', '급해', '급하', '돈', '승진', '비교', '남들보다', '뒤처',
  ],
  wavering_temptation: [
    '유혹', '흔들', '못 참', '참아야', '끊어야', '끊고', '다이어트', '술 마', '술을', '음주',
    '게임', '유튜브', '핸드폰', '미루', '작심삼일', '의지',
  ],
};

// 점수가 같을 때 앞에 있는 종류를 고른다. 같은 입력이면 항상 같은 결과가 나오도록 순서를 고정한다.
export const WORRY_KIND_PRIORITY: MatchableWorryKind[] = [
  'anxiety_worry',
  'overthinking',
  'career_direction',
  'relationship_anger',
  'selfblame_lethargy',
  'greed_impatience',
  'wavering_temptation',
];

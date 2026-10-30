import type { WorryKind } from '@/shared/constants';

// 명언(선어) 데이터 구조. 필드는 디자인 시안 8-2(선어 낙관), 8-3(해설 펼침) 기준이다.

/** 명언의 분위기. 위기 입력일 때 'heavy'는 추천하지 않는다 (AGENTS.md 10장). */
export type QuoteTone = 'comfort' | 'cheer' | 'reflect' | 'heavy';

/**
 * 수인(불상의 손 모양). 피그마 디자인 레퍼런스 '고민별 수인 매칭' 기준.
 * 자책·무기력은 지권인, 기본(잘 모르겠어요)은 찻잔 감싸기다.
 */
export type Mudra =
  | '시무외인'
  | '여원인'
  | '선정인'
  | '항마촉지인'
  | '전법륜인'
  | '합장'
  | '지권인'
  | '찻잔 감싸기';

export type Quote = {
  id: string;
  /** 한자 구절. 예: 莫妄想 */
  hanja: string;
  /** 한글 읽기. 화면의 큰 제목. 예: 막망상 */
  reading: string;
  /** 한 줄 뜻 (8-3). 예: 망상하지 말라 */
  meaning: string;
  /** 화면에 크게 보이는 문장 (8-2). 줄바꿈은 \n */
  text: string;
  /** 해설 문단들 (8-3) */
  commentary: string[];
  /** 말한 사람. 예: 무업 선사 */
  author: string;
  /** 출처 (문헌명 등). 화면에는 보이지 않지만 저작권 확인용으로 반드시 기록한다. */
  source: string;
  /** 어울리는 번뇌 종류 */
  themes: WorryKind[];
  tone: QuoteTone;
  /** 8-2 세 번째 칩에 보여줄 수인. 예: 시무외인 */
  mudra: Mudra;
};

export type RecommendInput = {
  /** 사용자가 고른(또는 분류된) 번뇌 종류 */
  worryKind: WorryKind;
  /** safety가 위기 표현을 감지했는지 */
  isCrisis: boolean;
  /** 최근에 받은 명언 id들. 같은 명언 반복을 피하는 데 쓴다. */
  recentQuoteIds: string[];
  /** 동점일 때 고르는 데 쓰는 seed. 같은 seed면 같은 결과가 나온다. */
  seed: number;
};

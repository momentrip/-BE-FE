// 명언(선어) 데이터 구조. 필드는 디자인 시안 8-2(선어 낙관), 8-3(해설 펼침) 기준 초안이며 PM 합의 후 확정한다.

/** 명언의 분위기. 위기 입력일 때 'heavy'는 추천하지 않는다 (AGENTS.md 10장). */
export type QuoteTone = 'comfort' | 'cheer' | 'reflect' | 'heavy';

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
  // TODO(협의): worry_kind id 타입이 공개되면 string 대신 그 타입을 쓴다.
  /** 어울리는 번뇌 종류. worry_kind id를 그대로 쓴다. */
  themes: string[];
  tone: QuoteTone;
  // TODO(협의): tea 도메인의 차 id 목록이 정해지면 그 타입을 쓴다.
  /** 어울리는 차. tea 도메인의 차 id를 그대로 쓴다. */
  teas: string[];
};

export type RecommendInput = {
  /** 사용자가 고른(또는 분류된) 번뇌 종류 worry_kind id */
  worryKind: string;
  /** 사용자가 고른 차 id */
  tea: string;
  /** safety가 위기 표현을 감지했는지 */
  isCrisis: boolean;
  /** 최근에 받은 명언 id들. 같은 명언 반복을 피하는 데 쓴다. */
  recentQuoteIds: string[];
  /** 동점일 때 고르는 데 쓰는 seed. 같은 seed면 같은 결과가 나온다. */
  seed: number;
};

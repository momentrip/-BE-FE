/**
 * 번뇌 종류 id 8개. Supabase lanterns.worry_kind, 로컬 my_records.worry_kind, 명언 themes 태그에 그대로 쓴다.
 * 사용처: worry, home, quote, session, collection
 */
export const WORRY_KINDS = [
  'greed_impatience',
  'wavering_temptation',
  'relationship_anger',
  'selfblame_lethargy',
  'anxiety_worry',
  'overthinking',
  'career_direction',
  'unsure',
] as const;

/**
 * 번뇌 종류 id. WORRY_KINDS 8개 중 하나.
 * 사용처: worry, home, quote, session, collection
 */
export type WorryKind = (typeof WORRY_KINDS)[number];

/**
 * 탐·진·치 묶음 id.
 * 사용처: worry, home, quote
 */
export type WorryGroup = 'tam' | 'jin' | 'chi';

/**
 * 번뇌 종류 → 탐·진·치 묶음. 'unsure'는 묶음이 없어 null.
 * 사용처: worry, home, quote
 */
export const WORRY_KIND_GROUP: Record<WorryKind, WorryGroup | null> = {
  greed_impatience: 'tam',
  wavering_temptation: 'tam',
  relationship_anger: 'jin',
  selfblame_lethargy: 'jin',
  anxiety_worry: 'chi',
  overthinking: 'chi',
  career_direction: 'chi',
  unsure: null,
};

/**
 * 번뇌 종류의 화면 표시 이름 (디자인 시안 문구).
 * 사용처: worry (분류 칩), home (풍등 피드), collection (기록 보기)
 */
export const WORRY_KIND_LABEL: Record<WorryKind, string> = {
  greed_impatience: '욕심·조급',
  wavering_temptation: '흔들림·유혹',
  relationship_anger: '관계·분노',
  selfblame_lethargy: '자책·무기력',
  anxiety_worry: '불안·걱정',
  overthinking: '잡념·생각과다',
  career_direction: '진로·방향',
  unsure: '잘 모르겠어요',
};

/**
 * 탐·진·치 묶음의 화면 표시 이름.
 * 사용처: worry, home
 */
export const WORRY_GROUP_LABEL: Record<WorryGroup, string> = {
  tam: '탐',
  jin: '진',
  chi: '치',
};

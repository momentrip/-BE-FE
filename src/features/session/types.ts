import type { WorryKind } from '@/shared/constants';

/** 이번 회차에 지금까지 저장된 값. 아직 저장 안 된 값은 null. */
export type CurrentSession = {
  worryText: string | null;
  worryKind: WorryKind | null;
  /** saveWorry 때 safety.detectCrisis로 판정한 값 */
  isCrisis: boolean;
  /** teaFlow 차 id (차 id 확정 전까지 string) */
  tea: string | null;
  /** quote 데이터의 명언 id */
  quoteId: string | null;
};

/** 로컬에 저장된 내 기록 한 회차. */
export type MyRecord = {
  id: number;
  /** ISO 8601 (UTC) */
  createdAt: string;
  worryKind: WorryKind;
  worryText: string;
  tea: string;
  quoteId: string;
  isCrisis: boolean;
};

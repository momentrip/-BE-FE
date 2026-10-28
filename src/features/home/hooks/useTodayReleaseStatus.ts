import { useEffect, useState } from "react";

import type { WorryKind } from "@/shared/constants";

type TodayReleaseStatus = {
  /** 오늘 고민을 1건 이상 날렸는지 (개인 티컵 영역: false면 1잔, true면 2잔) */
  hasReleasedToday: boolean;
};

// session 도메인 이슈 #25에서 확정된 타입·시그니처 (아직 stub이 merge되지 않아 여기 임시로 맞춰둔다).
type MyRecord = {
  id: number;
  createdAt: string;
  worryKind: WorryKind;
  worryText: string;
  tea: string;
  quoteId: string;
  isCrisis: boolean;
};

// TEST: 4가지 케이스(남 O/X × 나 O/X) 확인용 임시 스위치. 테스트 끝나면 false로 되돌린다.
const TEST_HAS_RELEASED_TODAY = false;

// TODO: session의 PR #25 stub이 merge되면 아래 getTodayRecord를
// `import { getTodayRecord } from '@/features/session';`로 교체하고 이 임시 함수는 지운다.
async function getTodayRecord(): Promise<MyRecord | null> {
  return TEST_HAS_RELEASED_TODAY ? ({} as MyRecord) : null;
}

/**
 * 오늘 차를 마셨는지(=고민을 1건 이상 날렸는지) 가져온다.
 * session의 getTodayRecord가 아직 merge되지 않아 임시로 항상 null을 반환하는 구현을 쓴다.
 * @returns 오늘 방출 여부
 * 사용처: home
 */
export function useTodayReleaseStatus(): TodayReleaseStatus {
  const [hasReleasedToday, setHasReleasedToday] = useState(false);

  useEffect(() => {
    getTodayRecord().then((record) => setHasReleasedToday(record !== null));
  }, []);

  return { hasReleasedToday };
}

import { useEffect, useState } from "react";

import { getTodayRecord } from "@/features/session";

type TodayReleaseStatus = {
  /** 오늘 고민을 1건 이상 날렸는지 (개인 티컵 영역: false면 1잔, true면 2잔) */
  hasReleasedToday: boolean;
};

/**
 * 오늘 차를 마셨는지(=고민을 1건 이상 날렸는지) 가져온다.
 * 위기 표현이 감지된 기록(isCrisis)은 메인 화면에 반영하지 않는다 (이슈 #25).
 * @returns 오늘 방출 여부
 * 사용처: home
 */
export function useTodayReleaseStatus(): TodayReleaseStatus {
  const [hasReleasedToday, setHasReleasedToday] = useState(false);

  useEffect(() => {
    getTodayRecord().then((record) => setHasReleasedToday(record !== null && !record.isCrisis));
  }, []);

  return { hasReleasedToday };
}

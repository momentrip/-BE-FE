import { useEffect, useRef, useState } from "react";

import { getTodayLanterns, subscribeNewLanterns } from "../api/lanternsApi";
import type { LanternFeedItem } from "../types";

type TodayLanternFeed = {
  /** 오늘 날린 풍등 수 */
  count: number;
  /** 오늘 날린 풍등 목록 (최신순, 풍등 상세 보기에 사용) */
  items: LanternFeedItem[];
};

function getMsUntilNextMidnight(): number {
  const now = new Date();
  const nextMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  return nextMidnight.getTime() - now.getTime();
}

/**
 * 오늘 날린 풍등 수와 목록을 실시간으로 관리한다. 화면 진입 시 한 번 조회하고,
 * 새 풍등이 올라올 때마다 +1 하며, 자정이 지나면 다시 조회한다.
 * @returns 오늘 풍등 수와 목록
 * 사용처: home
 */
export function useTodayLanternFeed(): TodayLanternFeed {
  const [items, setItems] = useState<LanternFeedItem[]>([]);
  const midnightTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    let cancelled = false;

    async function load() {
      const todayLanterns = await getTodayLanterns();
      if (cancelled) return;
      setItems(todayLanterns);

      unsubscribe = subscribeNewLanterns((item) => {
        setItems((current) => [item, ...current]);
      });
    }

    function scheduleMidnightRefetch() {
      midnightTimer.current = setTimeout(() => {
        unsubscribe?.();
        load();
        scheduleMidnightRefetch();
      }, getMsUntilNextMidnight());
    }

    load();
    scheduleMidnightRefetch();

    return () => {
      cancelled = true;
      unsubscribe?.();
      if (midnightTimer.current) clearTimeout(midnightTimer.current);
    };
  }, []);

  return { count: items.length, items };
}

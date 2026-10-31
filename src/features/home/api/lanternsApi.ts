import { supabase } from "@/shared/lib";
import type { WorryKind } from "@/shared/constants";

import type { LanternFeedItem } from "../types";

type LanternRow = {
  id: number;
  created_at: string;
  worry_kind: WorryKind;
  tea: string;
};

function toFeedItem(row: LanternRow): LanternFeedItem {
  return {
    id: row.id,
    createdAt: row.created_at,
    worryKind: row.worry_kind,
    tea: row.tea,
  };
}

/** 기기 시간대 자정(오늘 0시) 시각을 ISO 문자열로 돌려준다. */
function getTodayStartIso(): string {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
}

/**
 * 오늘(기기 시간대 자정 이후) 날린 풍등을 최신순으로 가져온다.
 * @returns 오늘 날린 풍등 목록
 * 사용처: home
 */
export async function getTodayLanterns(): Promise<LanternFeedItem[]> {
  const { data, error } = await supabase
    .from("lanterns")
    .select("id, created_at, worry_kind, tea")
    .gte("created_at", getTodayStartIso())
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []).map(toFeedItem);
}

/**
 * 새 풍등이 올라올 때마다 호출된다. 언마운트 시 반환된 함수로 구독을 해제한다.
 * @param onInsert 새 풍등 1건이 들어올 때 호출할 콜백
 * @returns 구독 해제 함수
 * 사용처: home
 */
export function subscribeNewLanterns(onInsert: (item: LanternFeedItem) => void): () => void {
  // Fast Refresh 등으로 이전 채널이 정리되지 않고 남아있으면 같은 토픽으로 다시 구독할 때
  // "cannot add 'postgres_changes' callbacks ... after subscribe()" 에러가 난다. 먼저 정리한다.
  const stale = supabase.getChannels().find((existing) => existing.topic === "realtime:lanterns-insert");
  if (stale) {
    supabase.removeChannel(stale);
  }

  const channel = supabase
    .channel("lanterns-insert")
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "lanterns" },
      (payload) => onInsert(toFeedItem(payload.new as LanternRow)),
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

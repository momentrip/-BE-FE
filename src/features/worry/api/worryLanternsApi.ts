import { supabase } from "@/shared/lib";
import type { WorryKind } from "@/shared/constants";

/** 기기 시간대 자정(오늘 0시) 시각을 ISO 문자열로 돌려준다. */
function getTodayStartIso(): string {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
}

/**
 * 오늘(기기 시간대 자정 이후) 같은 번뇌 종류로 날아간 풍등 수를 센다.
 * @param worryKind 방금 분류된 번뇌 종류
 * @returns 오늘 같은 번뇌 종류 풍등 수 (나를 포함하지 않음, 아직 내 풍등은 저장 전이라서)
 * 사용처: worry
 */
export async function getSameWorryKindCountToday(worryKind: WorryKind): Promise<number> {
  const { count, error } = await supabase
    .from("lanterns")
    .select("id", { count: "exact", head: true })
    .eq("worry_kind", worryKind)
    .gte("created_at", getTodayStartIso());

  if (error) {
    throw error;
  }

  return count ?? 0;
}

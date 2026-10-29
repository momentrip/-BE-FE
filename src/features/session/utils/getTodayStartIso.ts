/** 기기 시간대 자정(오늘 0시) 시각을 ISO 8601(UTC) 문자열로 돌려준다. my_records.created_at과 같은 형식이다. */
export function getTodayStartIso(now: Date = new Date()): string {
  return new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
}

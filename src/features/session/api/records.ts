import type { MyRecord } from '../types';

/**
 * 회차를 끝내고 저장한다. 로컬 my_records에 기록 전체, Supabase lanterns에 created_at·worry_kind·tea만 저장한다.
 * 고민·명언은 Supabase로 보내지 않는다 (AGENTS.md 9장). 값이 빠져 있거나 저장에 실패하면 throw한다.
 * 지금은 stub이라 아무것도 하지 않는다.
 * 사용처: 회차 마지막 화면 (#25에서 확인 중)
 */
export async function saveSession(): Promise<void> {}

/**
 * 최근 받은 명언 id를 최대 5개, 최신순으로 돌려준다.
 * 지금은 stub이라 빈 배열을 돌려준다.
 * @returns quote id 배열
 * 사용처: zen (recommendQuote의 recentQuoteIds)
 */
export async function getRecentQuoteIds(): Promise<string[]> {
  return [];
}

/**
 * 로컬에 저장된 내 기록 전체를 최신순으로 돌려준다.
 * 지금은 stub이라 빈 배열을 돌려준다.
 * @returns MyRecord 배열
 * 사용처: collection
 */
export async function getMyRecords(): Promise<MyRecord[]> {
  return [];
}

/**
 * 오늘(기기 시간대 자정 이후) 저장된 기록 하나를 돌려준다. 없으면 null ("오늘 아직 안 마심").
 * 지금은 stub이라 항상 null을 돌려준다.
 * @returns MyRecord 또는 null
 * 사용처: home
 */
export async function getTodayRecord(): Promise<MyRecord | null> {
  return null;
}

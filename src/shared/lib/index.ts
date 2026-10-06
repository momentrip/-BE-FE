// 이 도메인의 공개 API

/**
 * 앱 전체에서 쓰는 유일한 Supabase 클라이언트.
 * 호출은 각 도메인의 api/ 폴더에서만 한다 (AGENTS.md 9장).
 * 사용처: lantern (풍등 수·실시간 피드), session (회차 종료 시 lanterns 저장)
 */
export { supabase } from './supabase';

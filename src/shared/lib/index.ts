// 이 도메인의 공개 API

/**
 * 앱 전체에서 쓰는 유일한 Supabase 클라이언트.
 * 호출은 각 도메인의 api/ 폴더에서만 한다 (AGENTS.md 9장).
 * 사용처: lantern (풍등 수·실시간 피드), session (회차 종료 시 lanterns 저장)
 */
export { supabase } from './supabase';

/**
 * 기기 로컬 DB(expo-sqlite)를 연다. 처음 호출할 때 파일을 만들고 my_records 테이블을 생성한다.
 * 여러 번 호출해도 같은 연결을 돌려준다.
 * @returns SQLiteDatabase (runAsync·getAllAsync 등으로 my_records 테이블 사용)
 * 호출은 각 도메인의 api/ 폴더에서만 한다 (AGENTS.md 9장).
 * 사용처: session (회차 종료 시 내 기록 저장), history (내 기록 조회)
 */
export { getLocalDb } from './localDb';

/**
 * 로컬 my_records 테이블의 한 행 타입 (고민 내용·차·quote_id·위기 감지 여부 등).
 * 사용처: session, history
 */
export type { LocalRecordRow } from './localDb';

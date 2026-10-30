import { getLocalDb, supabase, type LocalRecordRow } from '@/shared/lib';
import type { WorryKind } from '@/shared/constants';
import type { MyRecord } from '../types';
import { getTodayStartIso } from '../utils/getTodayStartIso';
import { getCurrentSession, resetCurrentSession } from './currentSession';

const RECENT_QUOTE_LIMIT = 5;

function toMyRecord(row: LocalRecordRow): MyRecord {
  return {
    id: row.id,
    createdAt: row.created_at,
    worryKind: row.worry_kind as WorryKind,
    worryText: row.worry_text,
    tea: row.tea,
    quoteId: row.quote_id,
    isCrisis: row.is_flagged === 1,
  };
}

/**
 * 회차를 끝내고 저장한다. 로컬 my_records에 기록 전체, Supabase lanterns에 created_at·worry_kind·tea만 저장한다.
 * 고민·명언은 Supabase로 보내지 않는다 (AGENTS.md 9장). 저장이 끝나면 이번 회차 값을 비운다.
 * 고민·차·명언 중 빠진 값이 있거나 저장에 실패하면 throw한다.
 * 로컬 저장 후 lanterns 저장이 실패하면 로컬 기록은 남는다 (내 기록이 우선).
 * 사용처: zen ("찻잔 보관하기" 버튼)
 */
export async function saveSession(): Promise<void> {
  const { worryText, worryKind, isCrisis, tea, quoteId } = getCurrentSession();
  if (worryText === null || worryKind === null || tea === null || quoteId === null) {
    throw new Error('saveSession: 고민·차·명언이 모두 저장된 뒤에 호출하세요.');
  }

  const db = await getLocalDb();
  await db.runAsync(
    'INSERT INTO my_records (created_at, worry_kind, worry_text, tea, quote_id, is_flagged) VALUES (?, ?, ?, ?, ?, ?)',
    new Date().toISOString(),
    worryKind,
    worryText,
    tea,
    quoteId,
    isCrisis ? 1 : 0,
  );

  // created_at은 서버 기본값(now())을 쓴다.
  const { error } = await supabase.from('lanterns').insert({ worry_kind: worryKind, tea });
  if (error) {
    throw error;
  }

  resetCurrentSession();
}

/**
 * 최근 받은 명언 id를 최대 5개, 최신순으로 돌려준다.
 * @returns quote id 배열 (기록이 없으면 빈 배열)
 * 사용처: zen (recommendQuote의 recentQuoteIds)
 */
export async function getRecentQuoteIds(): Promise<string[]> {
  const db = await getLocalDb();
  const rows = await db.getAllAsync<Pick<LocalRecordRow, 'quote_id'>>(
    'SELECT quote_id FROM my_records ORDER BY created_at DESC, id DESC LIMIT ?',
    RECENT_QUOTE_LIMIT,
  );
  return rows.map((row) => row.quote_id);
}

/**
 * 로컬에 저장된 내 기록 전체를 최신순으로 돌려준다.
 * @returns MyRecord 배열 (기록이 없으면 빈 배열)
 * 사용처: collection
 */
export async function getMyRecords(): Promise<MyRecord[]> {
  const db = await getLocalDb();
  const rows = await db.getAllAsync<LocalRecordRow>(
    'SELECT * FROM my_records ORDER BY created_at DESC, id DESC',
  );
  return rows.map(toMyRecord);
}

/**
 * 오늘(기기 시간대 자정 이후) 저장된 기록 중 가장 최근 것 하나를 돌려준다. 없으면 null ("오늘 아직 안 마심").
 * @returns MyRecord 또는 null
 * 사용처: home
 */
export async function getTodayRecord(): Promise<MyRecord | null> {
  const db = await getLocalDb();
  const row = await db.getFirstAsync<LocalRecordRow>(
    'SELECT * FROM my_records WHERE created_at >= ? ORDER BY created_at DESC, id DESC LIMIT 1',
    getTodayStartIso(),
  );
  return row ? toMyRecord(row) : null;
}

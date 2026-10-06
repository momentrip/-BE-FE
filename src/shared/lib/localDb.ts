import { openDatabaseAsync, type SQLiteDatabase } from 'expo-sqlite';

const DATABASE_NAME = 'yeso.db';
const DATABASE_VERSION = 1;

/** 로컬 my_records 테이블의 한 행. 한 회차(고민 → 차 → 명언) = 한 행. */
export type LocalRecordRow = {
  id: number;
  /** ISO 8601 (UTC) */
  created_at: string;
  worry_kind: string;
  worry_text: string;
  tea: string;
  /** quote/data의 명언 id. 명언 본문은 저장하지 않는다. */
  quote_id: string;
  /** 위기 표현 감지 여부. SQLite에 boolean이 없어 0(아니오) / 1(예)로 저장한다. */
  is_flagged: 0 | 1;
};

let dbPromise: Promise<SQLiteDatabase> | null = null;

// PRAGMA user_version으로 스키마 버전을 관리한다. 스키마를 바꾸면 버전을 올리고 단계를 추가한다.
async function migrate(db: SQLiteDatabase): Promise<void> {
  const result = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
  let currentVersion = result?.user_version ?? 0;
  if (currentVersion >= DATABASE_VERSION) {
    return;
  }
  if (currentVersion === 0) {
    await db.execAsync(`
      PRAGMA journal_mode = 'wal';
      CREATE TABLE IF NOT EXISTS my_records (
        id          INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
        created_at  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
        worry_kind  TEXT NOT NULL,
        worry_text  TEXT NOT NULL,
        tea         TEXT NOT NULL,
        quote_id    TEXT NOT NULL,
        is_flagged  INTEGER NOT NULL DEFAULT 0
      );
    `);
    currentVersion = 1;
  }
  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}

async function openAndMigrate(): Promise<SQLiteDatabase> {
  const db = await openDatabaseAsync(DATABASE_NAME);
  await migrate(db);
  return db;
}

export function getLocalDb(): Promise<SQLiteDatabase> {
  if (!dbPromise) {
    dbPromise = openAndMigrate().catch((error: unknown) => {
      // 실패하면 다음 호출에서 다시 시도할 수 있게 비운다.
      dbPromise = null;
      throw error;
    });
  }
  return dbPromise;
}

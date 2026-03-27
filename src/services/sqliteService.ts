import * as SQLite from 'expo-sqlite';

import { MovementSample, SleepLog } from '@/src/types';

let db: SQLite.SQLiteDatabase | null = null;

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (!db) {
    db = await SQLite.openDatabaseAsync('medi_sleep_tracker.db');
    await initSchema(db);
  }
  return db;
}

async function initSchema(database: SQLite.SQLiteDatabase) {
  await database.execAsync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS sleep_logs (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id     TEXT    NOT NULL,
      started_at  INTEGER NOT NULL,
      ended_at    INTEGER NOT NULL,
      quality     REAL    NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS movement_samples (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      sleep_log_id INTEGER NOT NULL REFERENCES sleep_logs(id) ON DELETE CASCADE,
      timestamp    INTEGER NOT NULL,
      x            REAL    NOT NULL,
      y            REAL    NOT NULL,
      z            REAL    NOT NULL
    );
  `);
}

// ── Sleep Logs ────────────────────────────────────────────────────────────────

export async function saveSleepLog(log: Omit<SleepLog, 'id'>): Promise<number> {
  const database = await getDatabase();

  const result = await database.runAsync(
    `INSERT INTO sleep_logs (user_id, started_at, ended_at, quality)
     VALUES (?, ?, ?, ?)`,
    log.userId,
    log.startedAt.getTime(),
    log.endedAt.getTime(),
    log.qualityScore
  );

  const sleepLogId = result.lastInsertRowId;

  if (log.movementData.length > 0) {
    await saveBatchMovementSamples(sleepLogId, log.movementData);
  }

  return sleepLogId;
}

async function saveBatchMovementSamples(sleepLogId: number, samples: MovementSample[]) {
  const database = await getDatabase();
  await database.withTransactionAsync(async () => {
    for (const sample of samples) {
      await database.runAsync(
        `INSERT INTO movement_samples (sleep_log_id, timestamp, x, y, z)
         VALUES (?, ?, ?, ?, ?)`,
        sleepLogId,
        sample.timestamp,
        sample.x,
        sample.y,
        sample.z
      );
    }
  });
}

export async function getSleepLogs(userId: string): Promise<SleepLog[]> {
  const database = await getDatabase();

  const rows = await database.getAllAsync<{
    id: number;
    user_id: string;
    started_at: number;
    ended_at: number;
    quality: number;
  }>(`SELECT * FROM sleep_logs WHERE user_id = ? ORDER BY started_at DESC`, userId);

  return Promise.all(
    rows.map(async (row) => {
      const samples = await database.getAllAsync<MovementSample>(
        `SELECT timestamp, x, y, z FROM movement_samples WHERE sleep_log_id = ? ORDER BY timestamp ASC`,
        row.id
      );
      return {
        id: String(row.id),
        userId: row.user_id,
        startedAt: new Date(row.started_at),
        endedAt: new Date(row.ended_at),
        qualityScore: row.quality,
        movementData: samples,
      } satisfies SleepLog;
    })
  );
}

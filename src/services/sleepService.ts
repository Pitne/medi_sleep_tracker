import { Accelerometer } from 'expo-sensors';

import { MovementSample, SleepLog } from '@/src/types';
import { saveSleepLog } from '@/src/services/sqliteService';

const SAMPLE_INTERVAL_MS = 500;

let subscription: ReturnType<typeof Accelerometer.addListener> | null = null;
let samples: MovementSample[] = [];
let sessionStart: Date | null = null;

export function startSleepTracking() {
  samples = [];
  sessionStart = new Date();

  Accelerometer.setUpdateInterval(SAMPLE_INTERVAL_MS);

  subscription = Accelerometer.addListener(({ x, y, z }) => {
    samples.push({ timestamp: Date.now(), x, y, z });
  });
}

export async function stopSleepTracking(userId: string): Promise<number> {
  subscription?.remove();
  subscription = null;

  const endedAt = new Date();
  const startedAt = sessionStart ?? endedAt;
  sessionStart = null;

  const qualityScore = computeQualityScore(samples);

  const log: Omit<SleepLog, 'id'> = {
    userId,
    startedAt,
    endedAt,
    movementData: samples,
    qualityScore,
  };

  return saveSleepLog(log);
}

/**
 * Simple heuristic: fewer large movements → higher quality (0–100).
 */
function computeQualityScore(data: MovementSample[]): number {
  if (data.length === 0) return 0;

  const THRESHOLD = 0.3;
  const disturbances = data.filter(
    ({ x, y, z }) => Math.sqrt(x * x + y * y + z * z) > 1 + THRESHOLD
  ).length;

  const ratio = disturbances / data.length;
  return Math.max(0, Math.round((1 - ratio) * 100));
}

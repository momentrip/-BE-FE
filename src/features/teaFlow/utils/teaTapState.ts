import { S3_TAP_SETTINGS } from "../constants/s3Preparation";

export type TeaTapCount = 0 | 1 | 2 | 3;

export function advanceTeaTapCount(previous: TeaTapCount): TeaTapCount {
  if (previous >= S3_TAP_SETTINGS.targetCount) {
    return previous;
  }
  return Math.min(S3_TAP_SETTINGS.targetCount, previous + 1) as TeaTapCount;
}

export function getTeaTapVisualStage(count: TeaTapCount): 1 | 2 | 3 {
  return Math.min(3, count + 1) as 1 | 2 | 3;
}

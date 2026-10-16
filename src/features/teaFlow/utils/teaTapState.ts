import { S3_TAP_SETTINGS } from "../constants/s3Preparation";

export type TeaTapCount = 0 | 1 | 2 | 3;

export type TeaTapState = {
  armed: boolean;
  count: TeaTapCount;
  lastTapAtMs: number | null;
};

type AdvanceTeaTapStateOptions = {
  impactMagnitude: number;
  nowMs: number;
  previous: TeaTapState;
};

export const INITIAL_TEA_TAP_STATE: TeaTapState = {
  armed: true,
  count: 0,
  lastTapAtMs: null,
};

export function advanceTeaTapState({
  impactMagnitude,
  nowMs,
  previous,
}: AdvanceTeaTapStateOptions): TeaTapState {
  if (previous.count >= S3_TAP_SETTINGS.targetCount) {
    return previous;
  }

  const cooldownComplete = previous.lastTapAtMs === null ||
    nowMs - previous.lastTapAtMs >= S3_TAP_SETTINGS.cooldownMs;

  if (!previous.armed) {
    return impactMagnitude <= S3_TAP_SETTINGS.releaseThresholdG && cooldownComplete
      ? { ...previous, armed: true }
      : previous;
  }

  if (impactMagnitude < S3_TAP_SETTINGS.impactThresholdG || !cooldownComplete) {
    return previous;
  }

  return {
    armed: false,
    count: Math.min(S3_TAP_SETTINGS.targetCount, previous.count + 1) as TeaTapCount,
    lastTapAtMs: nowMs,
  };
}

export function getTeaTapVisualStage(count: TeaTapCount): 1 | 2 | 3 {
  return Math.min(3, count + 1) as 1 | 2 | 3;
}

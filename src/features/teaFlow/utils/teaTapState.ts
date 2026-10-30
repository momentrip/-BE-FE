import { S3_TAP_SETTINGS } from "../constants/s3Preparation";

export type TeaTapCount = 0 | 1 | 2 | 3;

export type TeaTapTransitionState = {
  count: TeaTapCount;
  transitioning: boolean;
};

export const INITIAL_TEA_TAP_TRANSITION_STATE: TeaTapTransitionState = {
  count: 0,
  transitioning: false,
};

export function advanceTeaTapCount(previous: TeaTapCount): TeaTapCount {
  if (previous >= S3_TAP_SETTINGS.targetCount) {
    return previous;
  }
  return Math.min(S3_TAP_SETTINGS.targetCount, previous + 1) as TeaTapCount;
}

export function getTeaTapVisualStage(count: TeaTapCount): 1 | 2 | 3 {
  return Math.min(3, count + 1) as 1 | 2 | 3;
}

export function registerTeaTap(
  previous: TeaTapTransitionState,
): TeaTapTransitionState {
  if (previous.transitioning) {
    return previous;
  }

  const count = advanceTeaTapCount(previous.count);
  return {
    count,
    transitioning:
      getTeaTapVisualStage(count) !== getTeaTapVisualStage(previous.count),
  };
}

export function finishTeaTapTransition(
  previous: TeaTapTransitionState,
): TeaTapTransitionState {
  return { ...previous, transitioning: false };
}

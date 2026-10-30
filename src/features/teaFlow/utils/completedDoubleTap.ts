export type CompletedDoubleTapState = {
  handled: boolean;
  lastTapAtMs: number | null;
};

type RegisterCompletedTapOptions = {
  completed: boolean;
  maxIntervalMs: number;
  nowMs: number;
  previous: CompletedDoubleTapState;
};

export const INITIAL_COMPLETED_DOUBLE_TAP_STATE: CompletedDoubleTapState = {
  handled: false,
  lastTapAtMs: null,
};

export function registerCompletedTap({
  completed,
  maxIntervalMs,
  nowMs,
  previous,
}: RegisterCompletedTapOptions): {
  next: CompletedDoubleTapState;
  shouldComplete: boolean;
} {
  if (!completed || previous.handled) {
    return { next: previous, shouldComplete: false };
  }

  const intervalMs = previous.lastTapAtMs === null
    ? null
    : nowMs - previous.lastTapAtMs;
  if (intervalMs !== null && intervalMs >= 0 && intervalMs <= maxIntervalMs) {
    return {
      next: { handled: true, lastTapAtMs: previous.lastTapAtMs },
      shouldComplete: true,
    };
  }

  return {
    next: { handled: false, lastTapAtMs: nowMs },
    shouldComplete: false,
  };
}

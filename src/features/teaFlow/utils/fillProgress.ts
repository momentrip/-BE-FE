import type { PouringDirectionCandidate } from "./pouringDirection";
import type { TeaPouringStatus } from "./zTwistState";

export type TeaFillState = {
  fillProgress: number;
  status: TeaPouringStatus;
  direction: PouringDirectionCandidate;
};

type AdvanceFillProgressParams = {
  currentProgress: number;
  elapsedMs: number;
  isPouring: boolean;
  fillDurationMs: number;
};

type AdvanceTeaFillStateParams = {
  previous: TeaFillState;
  status: Exclude<TeaPouringStatus, "full">;
  direction: PouringDirectionCandidate;
  elapsedMs: number;
  fillDurationMs: number;
};

/** elapsed time 기반으로 찻잔 차오름 진행도를 계산하고 0~1 범위로 제한한다. */
export function advanceFillProgress({
  currentProgress,
  elapsedMs,
  isPouring,
  fillDurationMs,
}: AdvanceFillProgressParams): number {
  const progress = Number.isFinite(currentProgress)
    ? Math.min(1, Math.max(0, currentProgress))
    : 0;

  if (!isPouring || !Number.isFinite(elapsedMs) || elapsedMs <= 0) {
    return progress;
  }

  if (!Number.isFinite(fillDurationMs) || fillDurationMs <= 0) {
    return 1;
  }

  return Math.min(1, progress + elapsedMs / fillDurationMs);
}

/** elapsed time 동안의 따르기 판정으로 진행도를 갱신하고 가득 차면 full로 전환한다. */
export function advanceTeaFillState({
  previous,
  status,
  direction,
  elapsedMs,
  fillDurationMs,
}: AdvanceTeaFillStateParams): TeaFillState {
  if (previous.status === "full") {
    return { ...previous, direction };
  }

  const fillProgress = advanceFillProgress({
    currentProgress: previous.fillProgress,
    elapsedMs,
    isPouring: status === "pouring",
    fillDurationMs,
  });

  return {
    fillProgress,
    status: fillProgress >= 1 ? "full" : status,
    direction,
  };
}

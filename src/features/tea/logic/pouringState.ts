import { POURING_THRESHOLDS } from "./pouringThresholds";
import { isPitchWithinValidRange } from "./pouringCalibration";

export type PouringStatus = "idle" | "pouring" | "tooFast";
export type PouringDirection = "left" | "right" | "neutral";

export type PouringState = {
  status: PouringStatus;
  direction: PouringDirection;
};

/**
 * baseline 대비 roll 변화량과 pitch 유효성을 차 따르기 상태로 분류한다.
 * @param deltaRoll baseline 대비 roll 변화량(도). 계산할 수 없으면 null
 * @param pitch 현재 pitch 각도(도)
 * @returns 차 따르기 상태와 방향. 사용처: tea 화면
 */
export function getPouringState(
  deltaRoll: number | null,
  pitch: number | null,
): PouringState {
  if (!isPitchWithinValidRange(pitch) || deltaRoll === null || !Number.isFinite(deltaRoll)) {
    return { status: "idle", direction: "neutral" };
  }

  const absDeltaRoll = Math.abs(deltaRoll);

  if (absDeltaRoll < POURING_THRESHOLDS.idleMaxAbsDeltaRoll) {
    return { status: "idle", direction: "neutral" };
  }

  const direction: PouringDirection = deltaRoll > 0 ? "right" : "left";

  if (absDeltaRoll < POURING_THRESHOLDS.pouringMaxAbsDeltaRoll) {
    return { status: "pouring", direction };
  }

  return { status: "tooFast", direction };
}
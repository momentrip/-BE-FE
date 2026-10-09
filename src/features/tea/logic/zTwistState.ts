import { getPouringDirectionCandidate } from "./pouringDirection";
import type { PouringDirectionCandidate } from "./pouringDirection";
import { Z_TWIST_THRESHOLDS } from "./pouringThresholds";

export type TeaPouringStatus = "idle" | "pouring" | "tooFast" | "full";

export type ZTwistPouringState = {
  status: Exclude<TeaPouringStatus, "full">;
  direction: PouringDirectionCandidate;
};

/**
 * Z twist 크기와 부호로 PoC 차 따르기 상태와 방향을 분류한다.
 * @param zTwistDegrees baseline-local Z twist 각도(도)
 * @returns idle/pouring/tooFast와 방향. null/비유한 입력은 idle/neutral
 */
export function getZTwistPouringState(zTwistDegrees: number | null): ZTwistPouringState {
  if (zTwistDegrees === null || !Number.isFinite(zTwistDegrees)) {
    return { status: "idle", direction: "neutral" };
  }

  const absZTwist = Math.abs(zTwistDegrees);
  const direction = getPouringDirectionCandidate(zTwistDegrees);

  if (absZTwist < Z_TWIST_THRESHOLDS.neutralDeadZoneDegrees) {
    return { status: "idle", direction };
  }

  if (absZTwist >= Z_TWIST_THRESHOLDS.tooFastMinAbsDegrees) {
    return { status: "tooFast", direction };
  }

  return { status: "pouring", direction };
}

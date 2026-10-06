import { getPouringDirectionCandidate } from "./pouringDirection";
import type { PouringDirectionCandidate } from "./pouringDirection";
import { Z_TWIST_THRESHOLDS } from "./pouringThresholds";
import type { PouringStatus } from "./pouringState";

export type ZTwistPouringState = {
  status: PouringStatus;
  direction: PouringDirectionCandidate;
};

/**
 * Z twist 각도에서 PoC 상태와 방향을 분류한다.
 * @param zTwistDegrees baseline-local Z twist(도)
 * @returns idle/pouring/tooFast 상태와 부호 기반 방향
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
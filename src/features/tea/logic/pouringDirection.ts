import { Z_TWIST_THRESHOLDS } from "./pouringThresholds";

export type PouringDirectionCandidate = "right" | "left" | "neutral";

/**
 * Z twist 부호로 따르기 방향 후보만 계산한다. pouring/tooFast 상태는 판단하지 않는다.
 * @param zTwistDegrees baseline-local Z twist 각도(도)
 * @returns 작은 변화량이면 neutral, 음수면 right, 양수면 left
 */
export function getPouringDirectionCandidate(
  zTwistDegrees: number | null,
): PouringDirectionCandidate {
  if (
    zTwistDegrees === null ||
    !Number.isFinite(zTwistDegrees) ||
    Math.abs(zTwistDegrees) < Z_TWIST_THRESHOLDS.neutralDeadZoneDegrees
  ) {
    return "neutral";
  }

  return zTwistDegrees < 0 ? "right" : "left";
}
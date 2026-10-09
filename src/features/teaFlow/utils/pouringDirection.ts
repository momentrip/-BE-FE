import { Z_TWIST_THRESHOLDS } from "./pouringThresholds";

export type PouringDirectionCandidate = "right" | "left" | "neutral";

/**
 * Z twist 부호로 차 따르기 방향 후보를 반환한다.
 * @param zTwistDegrees baseline-local Z twist 각도(도)
 * @returns 음수는 right, 양수는 left, dead zone 안은 neutral
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

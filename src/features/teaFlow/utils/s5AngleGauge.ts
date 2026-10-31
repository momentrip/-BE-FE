import { Z_TWIST_THRESHOLDS } from "./pouringThresholds";
import type { TeaPouringStatus } from "./zTwistState";

type GetS5GaugeIndicatorLeftParams = {
  displayAngleDegrees: number;
  maxLeft: number;
  minLeft: number;
  status: TeaPouringStatus;
};

/** S5 센서 판정값을 Figma 게이지의 0°~90° 표시 각도로 변환한다. */
export function getS5GaugeVisualAngleDegrees(
  status: TeaPouringStatus,
  displayAngleDegrees: number,
): number {
  const absoluteTwist = Math.abs(displayAngleDegrees);
  const idleLimit = Z_TWIST_THRESHOLDS.neutralDeadZoneDegrees;
  const tooFastLimit = Z_TWIST_THRESHOLDS.tooFastMinAbsDegrees;

  if (status === "idle") {
    return Math.min(20, (absoluteTwist / idleLimit) * 20);
  }

  if (status === "pouring") {
    const pouringRatio = (absoluteTwist - idleLimit) / (tooFastLimit - idleLimit);
    return 20 + Math.min(1, Math.max(0, pouringRatio)) * 30;
  }

  const tooFastRatio = (absoluteTwist - tooFastLimit) / (90 - tooFastLimit);
  return 50 + Math.min(1, Math.max(0, tooFastRatio)) * 40;
}

/** S5 표시 각도를 하단 게이지 위 찻잔 인디케이터의 left 좌표로 변환한다. */
export function getS5GaugeIndicatorLeft({
  displayAngleDegrees,
  maxLeft,
  minLeft,
  status,
}: GetS5GaugeIndicatorLeftParams): number {
  const visualAngle = getS5GaugeVisualAngleDegrees(status, displayAngleDegrees);
  return minLeft + (visualAngle / 90) * (maxLeft - minLeft);
}

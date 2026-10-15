import type { PouringDirectionCandidate } from "./pouringDirection";
import type { TeaPouringStatus } from "./zTwistState";

export const S5_ALLOWED_POURING_DIRECTION: PouringDirectionCandidate = "left";

export type S5EffectivePouringState = {
  status: TeaPouringStatus;
  direction: PouringDirectionCandidate;
};

type GetS5EffectivePouringStateParams = {
  status: TeaPouringStatus;
  direction: PouringDirectionCandidate;
};

type GetS5DisplayAngleDegreesParams = {
  direction: PouringDirectionCandidate;
  zTwistDegrees: number | null;
};

/** S5 배치와 반대 방향의 기울임을 idle/neutral로 제한한다. */
export function getS5EffectivePouringState({
  status,
  direction,
}: GetS5EffectivePouringStateParams): S5EffectivePouringState {
  if (direction !== S5_ALLOWED_POURING_DIRECTION) {
    return { status: "idle", direction: "neutral" };
  }

  return { status, direction };
}

/** S5에서 허용된 방향의 게이지 표시 각도만 반환한다. */
export function getS5DisplayAngleDegrees({
  direction,
  zTwistDegrees,
}: GetS5DisplayAngleDegreesParams): number {
  if (
    direction !== S5_ALLOWED_POURING_DIRECTION ||
    zTwistDegrees === null ||
    !Number.isFinite(zTwistDegrees)
  ) {
    return 0;
  }

  return Math.max(0, zTwistDegrees);
}

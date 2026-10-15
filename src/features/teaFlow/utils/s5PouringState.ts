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

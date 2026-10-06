import { PITCH_VALID_RANGE } from "./pouringThresholds";

/** 유한한 roll 샘플의 중앙값을 계산한다. 샘플이 없으면 null을 반환한다. */
export function calculateBaselineRoll(samples: readonly number[]): number | null {
  const finiteSamples = samples.filter(Number.isFinite).sort((left, right) => left - right);
  if (finiteSamples.length === 0) {
    return null;
  }

  const middleIndex = Math.floor(finiteSamples.length / 2);
  if (finiteSamples.length % 2 === 1) {
    return finiteSamples[middleIndex];
  }

  return (finiteSamples[middleIndex - 1] + finiteSamples[middleIndex]) / 2;
}

/** 두 roll 각도의 최단 부호 있는 차이를 [-180, 180) 범위로 정규화한다. */
export function calculateDeltaRoll(currentRoll: number | null, baselineRoll: number | null): number | null {
  if (
    currentRoll === null ||
    baselineRoll === null ||
    !Number.isFinite(currentRoll) ||
    !Number.isFinite(baselineRoll)
  ) {
    return null;
  }

  return ((currentRoll - baselineRoll + 180) % 360 + 360) % 360 - 180;
}

/** pitch가 설정한 자세 범위 안에 있고 유한한 값인지 확인한다. */
export function isPitchWithinValidRange(pitch: number | null): boolean {
  return (
    pitch !== null &&
    Number.isFinite(pitch) &&
    pitch >= PITCH_VALID_RANGE.min &&
    pitch <= PITCH_VALID_RANGE.max
  );
}
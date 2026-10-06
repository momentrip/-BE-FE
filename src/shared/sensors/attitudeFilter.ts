export type AttitudeValues = {
  alpha: number;
  beta: number;
  gamma: number;
  timestamp: number;
};

export const ATTITUDE_LOW_PASS_FACTOR = 0.2;

function normalizeRadians(angle: number): number {
  return ((angle + Math.PI) % (2 * Math.PI) + (2 * Math.PI)) % (2 * Math.PI) - Math.PI;
}

function filterAngle(previous: number, current: number): number {
  const shortestDelta = normalizeRadians(current - previous);
  return normalizeRadians(previous + ATTITUDE_LOW_PASS_FACTOR * shortestDelta);
}

/** DeviceMotion attitude를 low-pass filter하고 timestamp는 최신 샘플 값을 유지한다. */
export function filterAttitude(
  previous: AttitudeValues | null,
  current: AttitudeValues,
): AttitudeValues | null {
  if (!Object.values(current).every(Number.isFinite)) {
    return previous;
  }

  if (previous === null) {
    return current;
  }

  return {
    alpha: filterAngle(previous.alpha, current.alpha),
    beta: filterAngle(previous.beta, current.beta),
    gamma: filterAngle(previous.gamma, current.gamma),
    timestamp: current.timestamp,
  };
}
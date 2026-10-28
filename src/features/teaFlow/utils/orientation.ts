export type EulerAttitude = {
  alpha: number;
  beta: number;
  gamma: number;
};

export type Quaternion = {
  x: number;
  y: number;
  z: number;
  w: number;
};

export type RotationAxis = {
  x: number;
  y: number;
  z: number;
};

export type RelativeOrientation = {
  quaternion: Quaternion;
  angleDegrees: number;
  axis: RotationAxis | null;
  twistDegrees: RotationAxis;
};

const AXIS_EPSILON = 1e-8;
const RADIANS_TO_DEGREES = 180 / Math.PI;

function multiplyQuaternions(left: Quaternion, right: Quaternion): Quaternion {
  return {
    x: left.w * right.x + left.x * right.w + left.y * right.z - left.z * right.y,
    y: left.w * right.y - left.x * right.z + left.y * right.w + left.z * right.x,
    z: left.w * right.z + left.x * right.y - left.y * right.x + left.z * right.w,
    w: left.w * right.w - left.x * right.x - left.y * right.y - left.z * right.z,
  };
}

/** 유한하고 길이가 0이 아닌 quaternion을 단위 quaternion으로 정규화한다. */
export function normalizeQuaternion(quaternion: Quaternion): Quaternion | null {
  const { x, y, z, w } = quaternion;
  if (![x, y, z, w].every(Number.isFinite)) {
    return null;
  }

  const magnitude = Math.hypot(x, y, z, w);
  if (magnitude <= AXIS_EPSILON) {
    return null;
  }

  return {
    x: x / magnitude,
    y: y / magnitude,
    z: z / magnitude,
    w: w / magnitude,
  };
}

/**
 * Expo iOS는 alpha/beta/gamma에 Core Motion yaw/pitch/roll을 매핑한다.
 * Expo 타입의 축 설명(Z/X/Y)에 따른 intrinsic Z-X'-Y'' 순서를 PoC에서 사용한다.
 * Expo API가 복합 Euler 순서를 명시하지 않으므로, 이 convention은 실기기 검증 기준이다.
 * @param attitude DeviceMotion의 alpha/beta/gamma 라디안
 * @returns attitude quaternion 또는 입력이 유한하지 않으면 null
 */
export function eulerAttitudeToQuaternion(attitude: EulerAttitude): Quaternion | null {
  if (![attitude.alpha, attitude.beta, attitude.gamma].every(Number.isFinite)) {
    return null;
  }

  const halfAlpha = attitude.alpha / 2;
  const halfBeta = attitude.beta / 2;
  const halfGamma = attitude.gamma / 2;
  const qAlpha: Quaternion = {
    x: 0,
    y: 0,
    z: Math.sin(halfAlpha),
    w: Math.cos(halfAlpha),
  };
  const qBeta: Quaternion = {
    x: Math.sin(halfBeta),
    y: 0,
    z: 0,
    w: Math.cos(halfBeta),
  };
  const qGamma: Quaternion = {
    x: 0,
    y: Math.sin(halfGamma),
    z: 0,
    w: Math.cos(halfGamma),
  };

  return normalizeQuaternion(multiplyQuaternions(multiplyQuaternions(qAlpha, qBeta), qGamma));
}

/** q와 -q의 hemisphere를 맞춘 뒤 orientation 샘플 평균을 계산한다. */
export function averageQuaternions(samples: readonly Quaternion[]): Quaternion | null {
  const normalizedSamples = samples
    .map(normalizeQuaternion)
    .filter((sample): sample is Quaternion => sample !== null);
  const reference = normalizedSamples[0];
  if (reference === undefined) {
    return null;
  }

  const sum = normalizedSamples.reduce(
    (total, sample) => {
      const dot =
        reference.x * sample.x +
        reference.y * sample.y +
        reference.z * sample.z +
        reference.w * sample.w;
      const sign = dot < 0 ? -1 : 1;
      return {
        x: total.x + sample.x * sign,
        y: total.y + sample.y * sign,
        z: total.z + sample.z * sign,
        w: total.w + sample.w * sign,
      };
    },
    { x: 0, y: 0, z: 0, w: 0 },
  );

  return normalizeQuaternion(sum);
}

/**
 * baseline-local 상대 quaternion, 최단 회전 각도/축과 X/Y/Z signed twist를 계산한다.
 * @param baseline 기준 orientation quaternion
 * @param current 현재 orientation quaternion
 * @returns 상대 회전량 또는 입력 quaternion이 유효하지 않으면 null
 */
export function calculateRelativeOrientation(
  baseline: Quaternion,
  current: Quaternion,
): RelativeOrientation | null {
  const normalizedBaseline = normalizeQuaternion(baseline);
  const normalizedCurrent = normalizeQuaternion(current);
  if (normalizedBaseline === null || normalizedCurrent === null) {
    return null;
  }

  const inverseBaseline: Quaternion = {
    x: -normalizedBaseline.x,
    y: -normalizedBaseline.y,
    z: -normalizedBaseline.z,
    w: normalizedBaseline.w,
  };
  const relative = normalizeQuaternion(multiplyQuaternions(inverseBaseline, normalizedCurrent));
  if (relative === null) {
    return null;
  }

  // q와 -q는 같은 orientation이므로 w >= 0인 최단 회전을 사용한다.
  const shortest = relative.w < 0
    ? { x: -relative.x, y: -relative.y, z: -relative.z, w: -relative.w }
    : relative;
  const vectorMagnitude = Math.hypot(shortest.x, shortest.y, shortest.z);
  const axis = vectorMagnitude <= AXIS_EPSILON
    ? null
    : {
        x: shortest.x / vectorMagnitude,
        y: shortest.y / vectorMagnitude,
        z: shortest.z / vectorMagnitude,
      };
  const angleDegrees = 2 * Math.atan2(vectorMagnitude, shortest.w) * RADIANS_TO_DEGREES;

  const getAxisTwistDegrees = (component: number): number => {
    const twistMagnitude = Math.hypot(component, shortest.w);
    return twistMagnitude <= AXIS_EPSILON
      ? 0
      : 2 * Math.atan2(component / twistMagnitude, shortest.w / twistMagnitude) * RADIANS_TO_DEGREES;
  };

  return {
    quaternion: shortest,
    angleDegrees,
    axis,
    twistDegrees: {
      x: getAxisTwistDegrees(shortest.x),
      y: getAxisTwistDegrees(shortest.y),
      z: getAxisTwistDegrees(shortest.z),
    },
  };
}

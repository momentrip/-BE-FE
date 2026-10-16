export type AccelerationSample = {
  x: number;
  y: number;
  z: number;
};

/** 중력을 포함한 가속도 벡터에서 정지 상태 1g를 제외한 충격 크기를 계산한다. */
export function calculateImpactMagnitude(sample: AccelerationSample): number {
  const magnitude = Math.sqrt(sample.x ** 2 + sample.y ** 2 + sample.z ** 2);
  return Math.abs(magnitude - 1);
}

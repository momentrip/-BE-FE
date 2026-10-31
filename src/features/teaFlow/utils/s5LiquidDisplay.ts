import { S5_LIQUID_MAX_OPACITY } from "../constants/s5Pouring";

/** S5 진행도에 따라 액체에만 적용할 opacity를 계산한다. */
export function getS5LiquidOpacity(progress: number): number {
  const normalizedProgress = Number.isFinite(progress)
    ? Math.min(1, Math.max(0, progress))
    : 0;

  return normalizedProgress * S5_LIQUID_MAX_OPACITY;
}

/**
 * 진행도(따른 양 / 채워야 하는 전체 양)에 비례해 액체 표면 높이를 계산한다.
 * @param progress 0~1 진행도
 * @param maxHeight 다 찼을 때(progress=1)의 액체 높이
 */
export function getS5LiquidFillHeight(progress: number, maxHeight: number): number {
  const normalizedProgress = Number.isFinite(progress)
    ? Math.min(1, Math.max(0, progress))
    : 0;

  return normalizedProgress * maxHeight;
}

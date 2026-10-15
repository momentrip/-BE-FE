import { S5_LIQUID_MAX_OPACITY } from "../constants/s5Pouring";

/** S5 진행도에 따라 액체에만 적용할 opacity를 계산한다. */
export function getS5LiquidOpacity(progress: number): number {
  const normalizedProgress = Number.isFinite(progress)
    ? Math.min(1, Math.max(0, progress))
    : 0;

  return normalizedProgress * S5_LIQUID_MAX_OPACITY;
}

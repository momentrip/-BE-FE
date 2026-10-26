import { describe, expect, it } from "@jest/globals";

import { calculateImpactMagnitude } from "./impactMagnitude";

describe("calculateImpactMagnitude", () => {
  it("정지 상태의 1g는 충격 0으로 계산한다", () => {
    expect(calculateImpactMagnitude({ x: 0, y: 0, z: 1 })).toBeCloseTo(0);
  });

  it("기기 방향과 관계없이 1g를 제외한 충격 크기를 계산한다", () => {
    expect(calculateImpactMagnitude({ x: 0, y: 0, z: 1.8 })).toBeCloseTo(0.8);
    expect(calculateImpactMagnitude({ x: 1.8, y: 0, z: 0 })).toBeCloseTo(0.8);
  });
});

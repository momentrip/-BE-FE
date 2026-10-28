import { describe, expect, it } from "@jest/globals";

import { S3_TEA_BAG_LAYOUT } from "./s3TeaBagLayout";

describe("S3_TEA_BAG_LAYOUT", () => {
  it.each([1, 2, 3] as const)("%s단계에서 원본 비율과 동일한 회전을 유지한다", (stage) => {
    const layout = S3_TEA_BAG_LAYOUT[stage];

    expect(layout.width / layout.height).toBeCloseTo(183 / 299, 3);
    expect(layout.rotationDegrees).toBeCloseTo(-27.917, 3);
  });

  it("Figma instance의 단계별 중심 회전 배치값을 사용한다", () => {
    expect(S3_TEA_BAG_LAYOUT).toEqual({
      1: {
        left: 111.918,
        top: 141.685,
        width: 141.591,
        height: 231.343,
        rotationDegrees: -27.917,
      },
      2: {
        left: 141.42,
        top: 193.613,
        width: 112.302,
        height: 183.488,
        rotationDegrees: -27.917,
      },
      3: {
        left: 151.538,
        top: 358.962,
        width: 86.686,
        height: 141.634,
        rotationDegrees: -27.917,
      },
    });
  });

  it("단계가 진행될수록 티백이 다관 쪽으로 작아지며 이동한다", () => {
    expect(S3_TEA_BAG_LAYOUT[2].width).toBeLessThan(S3_TEA_BAG_LAYOUT[1].width);
    expect(S3_TEA_BAG_LAYOUT[3].width).toBeLessThan(S3_TEA_BAG_LAYOUT[2].width);
    expect(S3_TEA_BAG_LAYOUT[2].top).toBeGreaterThan(S3_TEA_BAG_LAYOUT[1].top);
    expect(S3_TEA_BAG_LAYOUT[3].top).toBeGreaterThan(S3_TEA_BAG_LAYOUT[2].top);
  });
});

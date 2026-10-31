import { describe, expect, it } from "@jest/globals";

import { getS5PouringLiquidColor } from "./getS5PouringLiquidColor";
import { getTeaLiquidDisplayColor } from "./getTeaLiquidDisplayColor";

// zen TEA_COLOR와 같은 값. zen index는 앱 화면 전체를 불러오므로 값만 옮겨 확인한다.
const SOURCE_TEA_COLORS = [
  "#C8A040",
  "#E2C27A",
  "#8EA048",
  "#7E9440",
  "#A6A04A",
  "#9A2C2C",
  "#B0482E",
  "#A86A28",
  "#8E5A26",
  "#7A5430",
  "#5A6430",
  "#66703A",
  "#6E2C16",
  "#5A2614",
  "#C8A090",
  "#D8B8A8",
  "#C4CC90",
  "#CFC690",
  "#C8B868",
];

function toChannels(hex: string): number[] {
  return [1, 3, 5].map((start) => Number.parseInt(hex.slice(start, start + 2), 16));
}

describe("getS5PouringLiquidColor", () => {
  it("어두운 갈색을 18% 섞는다", () => {
    expect(getS5PouringLiquidColor("#844333")).toBe("#753D2E");
  });

  it("모든 차를 원래 찻물 색보다 어둡게 만들되 회색으로 만들지 않는다", () => {
    SOURCE_TEA_COLORS.map(getTeaLiquidDisplayColor).forEach((color) => {
      const channels = toChannels(getS5PouringLiquidColor(color));
      const sourceChannels = toChannels(color);

      expect(Math.max(...channels)).toBeLessThan(Math.max(...sourceChannels));
      expect(Math.max(...channels) - Math.min(...channels)).toBeGreaterThan(20);
    });
  });

  it("차 종류별 색이 서로 달라 구분된다", () => {
    const colors = SOURCE_TEA_COLORS.map(getTeaLiquidDisplayColor).map(getS5PouringLiquidColor);

    expect(new Set(colors).size).toBe(SOURCE_TEA_COLORS.length);
  });

  it("#RRGGBB가 아닌 값은 그대로 돌려준다", () => {
    expect(getS5PouringLiquidColor("rgba(255,233,90,1)")).toBe("rgba(255,233,90,1)");
  });
});

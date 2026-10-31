import { describe, expect, it } from "@jest/globals";

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

function getChannelRange(hex: string): number {
  const channels = toChannels(hex);
  return Math.max(...channels) - Math.min(...channels);
}

describe("getTeaLiquidDisplayColor", () => {
  it("오미자차의 빨강을 줄이고 초록 성분을 올려 핏빛에서 벗어나게 한다", () => {
    const [sourceRed, sourceGreen] = toChannels("#9A2C2C");
    const [red, green] = toChannels(getTeaLiquidDisplayColor("#9A2C2C"));

    expect(red).toBeLessThan(sourceRed);
    expect(green).toBeGreaterThan(sourceGreen);
  });

  it("모든 차의 색 대비를 키우지 않고 회색으로 만들지도 않는다", () => {
    SOURCE_TEA_COLORS.forEach((color) => {
      const displayRange = getChannelRange(getTeaLiquidDisplayColor(color));

      expect(displayRange).toBeLessThanOrEqual(getChannelRange(color));
      expect(displayRange).toBeGreaterThan(20);
    });
  });

  it("차 종류별 색이 서로 달라 구분된다", () => {
    const displayColors = SOURCE_TEA_COLORS.map(getTeaLiquidDisplayColor);

    expect(new Set(displayColors).size).toBe(SOURCE_TEA_COLORS.length);
  });

  it("같은 입력이면 같은 #RRGGBB 색을 돌려준다", () => {
    expect(getTeaLiquidDisplayColor("#9A2C2C")).toBe(getTeaLiquidDisplayColor("#9a2c2c"));
    expect(getTeaLiquidDisplayColor("#C8A040")).toMatch(/^#[0-9A-F]{6}$/);
  });

  it("#RRGGBB가 아닌 값은 그대로 돌려준다", () => {
    expect(getTeaLiquidDisplayColor("rgba(255,233,90,1)")).toBe("rgba(255,233,90,1)");
    expect(getTeaLiquidDisplayColor("#FFF")).toBe("#FFF");
  });
});

import { describe, expect, it } from "@jest/globals";

import {
  advanceTeaTapCount,
  getTeaTapVisualStage,
} from "./teaTapState";

describe("advanceTeaTapCount", () => {
  it("화면을 누를 때마다 한 단계씩 최대 3회 센다", () => {
    const firstTap = advanceTeaTapCount(0);
    const secondTap = advanceTeaTapCount(firstTap);
    const thirdTap = advanceTeaTapCount(secondTap);

    expect(firstTap).toBe(1);
    expect(secondTap).toBe(2);
    expect(thirdTap).toBe(3);
  });

  it("3회 이후 추가 화면 tap을 무시한다", () => {
    expect(advanceTeaTapCount(3)).toBe(3);
  });
});

describe("getTeaTapVisualStage", () => {
  it("진입 시 1/3부터 tap마다 2/3, 3/3을 표시한다", () => {
    expect(getTeaTapVisualStage(0)).toBe(1);
    expect(getTeaTapVisualStage(1)).toBe(2);
    expect(getTeaTapVisualStage(2)).toBe(3);
    expect(getTeaTapVisualStage(3)).toBe(3);
  });
});

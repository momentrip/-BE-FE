import { describe, expect, it } from "@jest/globals";

import { getTeaDrinkingPresentation } from "./teaDrinkingPresentation";

describe("tea drinking presentation", () => {
  it.each([
    [0, 362, "첫 모금"],
    [1, 260, "두 번째 모금"],
    [2, 177, "마지막 모금"],
    [3, 80, "모두 마셨어요"],
  ] as const)("maps sip count %i to its Figma state", (sipCount, lanternTop, copy) => {
    const presentation = getTeaDrinkingPresentation({
      calibrationStatus: "ready",
      sipCount,
      status: sipCount === 3 ? "completed" : "ready",
    });

    expect(presentation.lanternTop).toBe(lanternTop);
    expect(presentation.instruction).toContain(copy);
  });

  it("shows calibration and sensor failure safely", () => {
    expect(getTeaDrinkingPresentation({
      calibrationStatus: "calibrating",
      sipCount: 0,
      status: "ready",
    }).instruction).toBe("센서를 준비하고 있어요");
    expect(getTeaDrinkingPresentation({
      calibrationStatus: "error",
      sipCount: 0,
      status: "ready",
    }).instruction).toBe("동작 센서를 사용할 수 없어요");
  });

  it("reflects the active drinking cycle without changing sip progress", () => {
    const returning = getTeaDrinkingPresentation({
      calibrationStatus: "ready",
      sipCount: 1,
      status: "returning",
    });

    expect(returning).toEqual({
      instruction: "천천히 원래 자세로 돌아오세요",
      lanternTop: 260,
    });
  });
});

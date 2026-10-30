import { describe, expect, it } from "@jest/globals";

import {
  advanceTeaTapCount,
  finishTeaTapTransition,
  getTeaTapVisualStage,
  INITIAL_TEA_TAP_TRANSITION_STATE,
  registerTeaTap,
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

describe("tea tap transition", () => {
  it("전환 중 추가 tap을 무시해 stage를 건너뛰지 않는다", () => {
    const transitioning = registerTeaTap(INITIAL_TEA_TAP_TRANSITION_STATE);
    const repeatedTap = registerTeaTap(transitioning);

    expect(transitioning).toEqual({ count: 1, transitioning: true });
    expect(repeatedTap).toBe(transitioning);
  });

  it("전환 완료 후 다음 tap을 한 단계만 반영한다", () => {
    const secondStage = finishTeaTapTransition(
      registerTeaTap(INITIAL_TEA_TAP_TRANSITION_STATE),
    );
    const thirdStage = registerTeaTap(secondStage);

    expect(thirdStage).toEqual({ count: 2, transitioning: true });
  });

  it("3/3에서 완료 tap은 시각 전환 잠금을 만들지 않는다", () => {
    const thirdStage = finishTeaTapTransition({ count: 2, transitioning: true });

    expect(registerTeaTap(thirdStage)).toEqual({ count: 3, transitioning: false });
  });
});

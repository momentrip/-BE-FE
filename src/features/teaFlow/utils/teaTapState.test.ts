import { describe, expect, it } from "@jest/globals";

import {
  completeTeaTapAnimation,
  INITIAL_TEA_TAP_ANIMATION_STATE,
  startTeaTapAnimation,
} from "./teaTapState";

describe("tea tap animation", () => {
  it("초기 상태는 stage 1이며 최초 tap으로 애니메이션을 시작한다", () => {
    expect(INITIAL_TEA_TAP_ANIMATION_STATE).toEqual({ phase: "idle" });

    expect(startTeaTapAnimation(INITIAL_TEA_TAP_ANIMATION_STATE)).toEqual({
      phase: "animating",
    });
  });

  it("애니메이션 중 추가 tap을 무시해 sequence를 중복 실행하지 않는다", () => {
    const animating = startTeaTapAnimation(INITIAL_TEA_TAP_ANIMATION_STATE);

    expect(startTeaTapAnimation(animating)).toBe(animating);
  });

  it("연속 애니메이션 완료 후 completed 상태를 유지한다", () => {
    const completed = completeTeaTapAnimation(
      startTeaTapAnimation(INITIAL_TEA_TAP_ANIMATION_STATE),
    );

    expect(completed).toEqual({ phase: "completed" });
    expect(startTeaTapAnimation(completed)).toBe(completed);
    expect(completeTeaTapAnimation(completed)).toBe(completed);
  });
});

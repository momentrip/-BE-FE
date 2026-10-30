import { describe, expect, it } from "@jest/globals";

import {
  completeTeaTapAnimation,
  INITIAL_TEA_TAP_ANIMATION_STATE,
  reachTeaTapVisualStage,
  startTeaTapAnimation,
} from "./teaTapState";

describe("tea tap animation", () => {
  it("초기 상태는 stage 1이며 최초 tap으로 애니메이션을 시작한다", () => {
    expect(INITIAL_TEA_TAP_ANIMATION_STATE).toEqual({
      phase: "idle",
      visualStage: 1,
    });

    expect(startTeaTapAnimation(INITIAL_TEA_TAP_ANIMATION_STATE)).toEqual({
      phase: "animating",
      visualStage: 1,
    });
  });

  it("애니메이션 중 추가 tap을 무시해 sequence를 중복 실행하지 않는다", () => {
    const animating = startTeaTapAnimation(INITIAL_TEA_TAP_ANIMATION_STATE);

    expect(startTeaTapAnimation(animating)).toBe(animating);
  });

  it("추가 tap 없이 stage 2와 stage 3을 순서대로 반영한다", () => {
    const animating = startTeaTapAnimation(INITIAL_TEA_TAP_ANIMATION_STATE);
    const stage2 = reachTeaTapVisualStage(animating, 2);
    const stage3 = reachTeaTapVisualStage(stage2, 3);

    expect(stage2.visualStage).toBe(2);
    expect(stage3.visualStage).toBe(3);
  });

  it("sequence 완료 후 stage 3 completed 상태를 유지한다", () => {
    const completed = completeTeaTapAnimation(
      startTeaTapAnimation(INITIAL_TEA_TAP_ANIMATION_STATE),
    );

    expect(completed).toEqual({ phase: "completed", visualStage: 3 });
    expect(startTeaTapAnimation(completed)).toBe(completed);
    expect(completeTeaTapAnimation(completed)).toBe(completed);
  });
});

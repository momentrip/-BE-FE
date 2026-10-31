import { describe, expect, it } from "@jest/globals";

import {
  INITIAL_S4_STEEPING_STATE,
  updateS4SteepingState,
} from "./s4SteepingState";

describe("updateS4SteepingState", () => {
  it("intro1 -> intro2 -> breathing -> done 순서로 진행한다", () => {
    const intro2 = updateS4SteepingState(INITIAL_S4_STEEPING_STATE, {
      type: "advanceIntro",
    });
    expect(intro2.step).toBe("intro2");

    const breathing = updateS4SteepingState(intro2, { type: "startBreathing" });
    expect(breathing.step).toBe("breathing");

    const done = updateS4SteepingState(breathing, { type: "finishBreathing" });
    expect(done.step).toBe("done");
  });

  it("현재 step과 맞지 않는 event는 무시한다", () => {
    expect(
      updateS4SteepingState(INITIAL_S4_STEEPING_STATE, { type: "startBreathing" }).step,
    ).toBe("intro1");
    expect(
      updateS4SteepingState(INITIAL_S4_STEEPING_STATE, { type: "finishBreathing" }).step,
    ).toBe("intro1");
    expect(
      updateS4SteepingState(INITIAL_S4_STEEPING_STATE, { type: "resetToIntro1" }).step,
    ).toBe("intro1");
  });

  it("breathing/done에서 resetToIntro1을 보내면 intro1로 돌아간다 (intro1/intro2는 router.back()으로 처리)", () => {
    const intro2 = updateS4SteepingState(INITIAL_S4_STEEPING_STATE, {
      type: "advanceIntro",
    });
    const breathing = updateS4SteepingState(intro2, { type: "startBreathing" });
    expect(updateS4SteepingState(breathing, { type: "resetToIntro1" }).step).toBe("intro1");

    const done = updateS4SteepingState(breathing, { type: "finishBreathing" });
    expect(updateS4SteepingState(done, { type: "resetToIntro1" }).step).toBe("intro1");
  });
});

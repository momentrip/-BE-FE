import { describe, expect, it } from "@jest/globals";

import {
  getS5EffectivePouringState,
  S5_ALLOWED_POURING_DIRECTION,
} from "./s5PouringState";

describe("getS5EffectivePouringState", () => {
  it("uses the physical left tilt direction for S5", () => {
    expect(S5_ALLOWED_POURING_DIRECTION).toBe("left");
  });

  it.each(["idle", "pouring", "tooFast"] as const)(
    "keeps %s in the allowed direction",
    (status) => {
      expect(getS5EffectivePouringState({ status, direction: "left" })).toEqual({
        status,
        direction: "left",
      });
    },
  );

  it.each(["pouring", "tooFast"] as const)(
    "blocks opposite-direction %s as idle",
    (status) => {
      expect(getS5EffectivePouringState({ status, direction: "right" })).toEqual({
        status: "idle",
        direction: "neutral",
      });
    },
  );

  it("keeps the neutral direction idle", () => {
    expect(getS5EffectivePouringState({ status: "idle", direction: "neutral" })).toEqual({
      status: "idle",
      direction: "neutral",
    });
  });
});

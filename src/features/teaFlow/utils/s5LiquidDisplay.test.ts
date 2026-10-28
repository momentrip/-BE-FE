import { describe, expect, it } from "@jest/globals";

import { S5_LIQUID_MAX_OPACITY } from "../constants/s5Pouring";
import { getS5LiquidOpacity } from "./s5LiquidDisplay";

describe("getS5LiquidOpacity", () => {
  it("keeps liquid nearly invisible at zero progress", () => {
    expect(getS5LiquidOpacity(0)).toBe(0);
  });

  it("uses half of the final concentration at half progress", () => {
    expect(getS5LiquidOpacity(0.5)).toBe(S5_LIQUID_MAX_OPACITY * 0.5);
  });

  it("uses the final concentration at full progress and clamps invalid ranges", () => {
    expect(getS5LiquidOpacity(1)).toBe(S5_LIQUID_MAX_OPACITY);
    expect(getS5LiquidOpacity(2)).toBe(S5_LIQUID_MAX_OPACITY);
    expect(getS5LiquidOpacity(-1)).toBe(0);
    expect(getS5LiquidOpacity(Number.NaN)).toBe(0);
  });
});

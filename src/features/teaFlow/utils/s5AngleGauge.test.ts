import { describe, expect, it } from "@jest/globals";

import {
  getS5GaugeIndicatorLeft,
  getS5GaugeVisualAngleDegrees,
} from "./s5AngleGauge";

const GAUGE_BOUNDS = { minLeft: 57, maxLeft: 312 } as const;

describe("S5 angle gauge", () => {
  it("keeps a neutral display angle at the starting position", () => {
    expect(getS5GaugeIndicatorLeft({
      displayAngleDegrees: 0,
      status: "idle",
      ...GAUGE_BOUNDS,
    })).toBe(57);
  });

  it("moves through the pouring range with the existing 8° and 40° thresholds", () => {
    expect(getS5GaugeVisualAngleDegrees("idle", 8)).toBe(20);
    expect(getS5GaugeVisualAngleDegrees("pouring", 40)).toBe(50);
  });

  it("clamps an excessive angle to the gauge end", () => {
    expect(getS5GaugeIndicatorLeft({
      displayAngleDegrees: 120,
      status: "tooFast",
      ...GAUGE_BOUNDS,
    })).toBe(312);
  });
});

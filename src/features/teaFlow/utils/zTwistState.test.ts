import { describe, expect, it } from "@jest/globals";
import { getZTwistPouringState } from "./zTwistState";
import { Z_TWIST_THRESHOLDS } from "./pouringThresholds";

describe("getZTwistPouringState", () => {
  it("classifies values inside the dead zone as idle/neutral", () => {
    expect(getZTwistPouringState(0)).toEqual({ status: "idle", direction: "neutral" });
    expect(getZTwistPouringState(7.99)).toEqual({ status: "idle", direction: "neutral" });
    expect(getZTwistPouringState(-7.99)).toEqual({ status: "idle", direction: "neutral" });
  });

  it("classifies the exact 8-degree boundary as pouring with signed direction", () => {
    expect(getZTwistPouringState(-8)).toEqual({ status: "pouring", direction: "right" });
    expect(getZTwistPouringState(8)).toEqual({ status: "pouring", direction: "left" });
    expect(getZTwistPouringState(-39.99)).toEqual({ status: "pouring", direction: "right" });
  });

  it("classifies the exact 40-degree boundary and above as tooFast", () => {
    expect(getZTwistPouringState(-40)).toEqual({ status: "tooFast", direction: "right" });
    expect(getZTwistPouringState(40)).toEqual({ status: "tooFast", direction: "left" });
  });

  it("keeps initial device-tested threshold values in one tea constant", () => {
    expect(Z_TWIST_THRESHOLDS).toEqual({ neutralDeadZoneDegrees: 8, tooFastMinAbsDegrees: 40 });
  });

  it("handles null, NaN and infinities as idle/neutral", () => {
    for (const value of [null, Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY]) {
      expect(getZTwistPouringState(value)).toEqual({ status: "idle", direction: "neutral" });
    }
  });
});

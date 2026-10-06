import { describe, expect, it } from "@jest/globals";
import { getZTwistPouringState } from "./zTwistState";
import { Z_TWIST_THRESHOLDS } from "./pouringThresholds";

describe("getZTwistPouringState", () => {
  it("classifies rest and values inside the dead zone as idle and neutral", () => {
    expect(getZTwistPouringState(0)).toEqual({ status: "idle", direction: "neutral" });
    expect(getZTwistPouringState(7.99)).toEqual({ status: "idle", direction: "neutral" });
    expect(getZTwistPouringState(-7.99)).toEqual({ status: "idle", direction: "neutral" });
  });

  it("starts pouring at the exact 8-degree threshold with sign-based direction", () => {
    expect(getZTwistPouringState(-8)).toEqual({ status: "pouring", direction: "right" });
    expect(getZTwistPouringState(8)).toEqual({ status: "pouring", direction: "left" });
    expect(getZTwistPouringState(-10.85)).toEqual({ status: "pouring", direction: "right" });
    expect(getZTwistPouringState(-31.69)).toEqual({ status: "pouring", direction: "right" });
  });

  it("transitions to tooFast at the exact 40-degree threshold", () => {
    expect(getZTwistPouringState(-39.99)).toEqual({ status: "pouring", direction: "right" });
    expect(getZTwistPouringState(-40)).toEqual({ status: "tooFast", direction: "right" });
    expect(getZTwistPouringState(40)).toEqual({ status: "tooFast", direction: "left" });
    expect(getZTwistPouringState(-47.22)).toEqual({ status: "tooFast", direction: "right" });
  });

  it("keeps classifications aligned with the configurable thresholds", () => {
    expect(Z_TWIST_THRESHOLDS.neutralDeadZoneDegrees).toBe(8);
    expect(Z_TWIST_THRESHOLDS.tooFastMinAbsDegrees).toBe(40);
  });

  it("returns idle and neutral for null and non-finite input", () => {
    expect(getZTwistPouringState(null)).toEqual({ status: "idle", direction: "neutral" });
    expect(getZTwistPouringState(Number.NaN)).toEqual({ status: "idle", direction: "neutral" });
    expect(getZTwistPouringState(Number.POSITIVE_INFINITY)).toEqual({
      status: "idle",
      direction: "neutral",
    });
    expect(getZTwistPouringState(Number.NEGATIVE_INFINITY)).toEqual({
      status: "idle",
      direction: "neutral",
    });
  });
});
import { describe, expect, it } from "@jest/globals";
import {
  calculateBaselineRoll,
  calculateDeltaRoll,
  isPitchWithinValidRange,
} from "./pouringCalibration";
import { getPouringState } from "./pouringState";

describe("pouring calibration", () => {
  it("has no baseline before valid samples are collected", () => {
    expect(calculateBaselineRoll([])).toBeNull();
    expect(calculateDeltaRoll(20, null)).toBeNull();
  });

  it("uses the median of collected roll samples as the baseline", () => {
    expect(calculateBaselineRoll([32, 34, 33, 35, 31])).toBe(33);
    expect(calculateBaselineRoll([32, 34, 33, 35])).toBe(33.5);
  });

  it("calculates positive and negative roll changes relative to baseline", () => {
    expect(calculateDeltaRoll(43, 33)).toBe(10);
    expect(calculateDeltaRoll(-10, 33)).toBe(-43);
  });

  it("normalizes angle wrap to the shortest signed difference", () => {
    expect(calculateDeltaRoll(-179, 179)).toBe(2);
    expect(calculateDeltaRoll(179, -179)).toBe(-2);
  });

  it("rejects null and non-finite roll inputs", () => {
    expect(calculateBaselineRoll([Number.NaN, Number.POSITIVE_INFINITY])).toBeNull();
    expect(calculateDeltaRoll(null, 10)).toBeNull();
    expect(calculateDeltaRoll(Number.NaN, 10)).toBeNull();
    expect(calculateDeltaRoll(10, Number.NEGATIVE_INFINITY)).toBeNull();
  });
});

describe("pitch validation", () => {
  it("accepts pitch at the configured range boundaries", () => {
    expect(isPitchWithinValidRange(-60)).toBe(true);
    expect(isPitchWithinValidRange(60)).toBe(true);
  });

  it("rejects pitch outside the configured range and invalid values", () => {
    expect(isPitchWithinValidRange(83.49)).toBe(false);
    expect(isPitchWithinValidRange(-60.01)).toBe(false);
    expect(isPitchWithinValidRange(null)).toBe(false);
    expect(isPitchWithinValidRange(Number.NaN)).toBe(false);
    expect(isPitchWithinValidRange(Number.POSITIVE_INFINITY)).toBe(false);
  });
});

describe("getPouringState", () => {
  it("classifies idle below an absolute deltaRoll of 10 degrees", () => {
    expect(getPouringState(0, 33)).toEqual({ status: "idle", direction: "neutral" });
    expect(getPouringState(9.99, 33)).toEqual({ status: "idle", direction: "neutral" });
    expect(getPouringState(-9.99, 33)).toEqual({ status: "idle", direction: "neutral" });
  });

  it("classifies the 10-degree boundary through 35 degrees as pouring", () => {
    expect(getPouringState(10, 33)).toEqual({ status: "pouring", direction: "right" });
    expect(getPouringState(-10, 33)).toEqual({ status: "pouring", direction: "left" });
    expect(getPouringState(34.99, 33)).toEqual({ status: "pouring", direction: "right" });
    expect(getPouringState(-34.99, 33)).toEqual({ status: "pouring", direction: "left" });
  });

  it("classifies an absolute deltaRoll of 35 degrees or more as tooFast", () => {
    expect(getPouringState(35, 33)).toEqual({ status: "tooFast", direction: "right" });
    expect(getPouringState(-35, 33)).toEqual({ status: "tooFast", direction: "left" });
  });

  it("forces idle and neutral when pitch is outside the valid range", () => {
    expect(getPouringState(20, 83.49)).toEqual({ status: "idle", direction: "neutral" });
    expect(getPouringState(-20, -60.01)).toEqual({ status: "idle", direction: "neutral" });
  });

  it("returns idle and neutral for missing or non-finite values", () => {
    expect(getPouringState(null, 33)).toEqual({ status: "idle", direction: "neutral" });
    expect(getPouringState(Number.NaN, 33)).toEqual({ status: "idle", direction: "neutral" });
    expect(getPouringState(Number.POSITIVE_INFINITY, 33)).toEqual({
      status: "idle",
      direction: "neutral",
    });
    expect(getPouringState(20, null)).toEqual({ status: "idle", direction: "neutral" });
    expect(getPouringState(20, Number.NaN)).toEqual({ status: "idle", direction: "neutral" });
  });
});
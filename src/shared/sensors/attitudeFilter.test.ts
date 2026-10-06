import { describe, expect, it } from "@jest/globals";
import { filterAttitude } from "./attitudeFilter";
import type { AttitudeValues } from "./attitudeFilter";

const initialAttitude: AttitudeValues = {
  alpha: 0,
  beta: 0,
  gamma: 0,
  timestamp: 100,
};

describe("filterAttitude", () => {
  it("uses the first valid reading as its initial filtered value", () => {
    const current = { alpha: 1, beta: 2, gamma: 3, timestamp: 42 };
    expect(filterAttitude(null, current)).toBe(current);
  });

  it("low-pass filters all three orientation angles and keeps the latest timestamp", () => {
    const filtered = filterAttitude(initialAttitude, {
      alpha: 1,
      beta: -1,
      gamma: 0.5,
      timestamp: 116,
    });

    expect(filtered?.alpha).toBeCloseTo(0.2);
    expect(filtered?.beta).toBeCloseTo(-0.2);
    expect(filtered?.gamma).toBeCloseTo(0.1);
    expect(filtered?.timestamp).toBe(116);
  });

  it("filters across the plus/minus pi wrap using the shortest angular delta", () => {
    const previous = { ...initialAttitude, alpha: (179 * Math.PI) / 180 };
    const current = { ...initialAttitude, alpha: (-179 * Math.PI) / 180, timestamp: 116 };
    const filtered = filterAttitude(previous, current);

    expect(filtered?.alpha).toBeCloseTo((179.4 * Math.PI) / 180);
    expect(filtered?.timestamp).toBe(116);
  });

  it("ignores non-finite measurements", () => {
    expect(filterAttitude(initialAttitude, {
      alpha: Number.NaN,
      beta: 1,
      gamma: 2,
      timestamp: 116,
    })).toBe(initialAttitude);
  });
});
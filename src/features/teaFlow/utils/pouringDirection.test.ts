import { describe, expect, it } from "@jest/globals";
import { getPouringDirectionCandidate } from "./pouringDirection";
import { Z_TWIST_THRESHOLDS } from "./pouringThresholds";

describe("getPouringDirectionCandidate", () => {
  it("uses negative Z twist for right and positive Z twist for left", () => {
    expect(getPouringDirectionCandidate(-30.11)).toBe("right");
    expect(getPouringDirectionCandidate(30.11)).toBe("left");
  });

  it("uses a neutral direction only inside the 8-degree dead zone", () => {
    expect(getPouringDirectionCandidate(7.99)).toBe("neutral");
    expect(getPouringDirectionCandidate(-7.99)).toBe("neutral");
    expect(getPouringDirectionCandidate(Z_TWIST_THRESHOLDS.neutralDeadZoneDegrees)).toBe("left");
    expect(getPouringDirectionCandidate(-Z_TWIST_THRESHOLDS.neutralDeadZoneDegrees)).toBe("right");
  });

  it("returns neutral for missing or non-finite values", () => {
    expect(getPouringDirectionCandidate(null)).toBe("neutral");
    expect(getPouringDirectionCandidate(Number.NaN)).toBe("neutral");
    expect(getPouringDirectionCandidate(Number.POSITIVE_INFINITY)).toBe("neutral");
    expect(getPouringDirectionCandidate(Number.NEGATIVE_INFINITY)).toBe("neutral");
  });
});

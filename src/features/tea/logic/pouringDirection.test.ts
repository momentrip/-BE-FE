import { describe, expect, it } from "@jest/globals";
import { getPouringDirectionCandidate } from "./pouringDirection";
import { Z_TWIST_THRESHOLDS } from "./pouringThresholds";

describe("getPouringDirectionCandidate", () => {
  it("maps negative Z twist to right and positive Z twist to left", () => {
    expect(getPouringDirectionCandidate(-30.11)).toBe("right");
    expect(getPouringDirectionCandidate(-29.08)).toBe("right");
    expect(getPouringDirectionCandidate(-38.63)).toBe("right");
    expect(getPouringDirectionCandidate(30)).toBe("left");
  });

  it("returns neutral inside the dead zone and applies direction at its boundaries", () => {
    expect(getPouringDirectionCandidate(0)).toBe("neutral");
    expect(getPouringDirectionCandidate(6.39)).toBe("neutral");
    expect(getPouringDirectionCandidate(-6.39)).toBe("neutral");
    expect(getPouringDirectionCandidate(Z_TWIST_THRESHOLDS.neutralDeadZoneDegrees)).toBe("left");
    expect(getPouringDirectionCandidate(-Z_TWIST_THRESHOLDS.neutralDeadZoneDegrees)).toBe("right");
    expect(getPouringDirectionCandidate(Z_TWIST_THRESHOLDS.neutralDeadZoneDegrees - 0.01)).toBe(
      "neutral",
    );
  });

  it("returns neutral for null and non-finite inputs", () => {
    expect(getPouringDirectionCandidate(null)).toBe("neutral");
    expect(getPouringDirectionCandidate(Number.NaN)).toBe("neutral");
    expect(getPouringDirectionCandidate(Number.POSITIVE_INFINITY)).toBe("neutral");
    expect(getPouringDirectionCandidate(Number.NEGATIVE_INFINITY)).toBe("neutral");
  });
});
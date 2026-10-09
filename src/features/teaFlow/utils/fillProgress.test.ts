import { describe, expect, it } from "@jest/globals";
import { advanceFillProgress, advanceTeaFillState } from "./fillProgress";

const initialState = { status: "idle" as const, direction: "neutral" as const, fillProgress: 0.25 };

describe("advanceFillProgress", () => {
  const durationMs = 10_000;

  it("does not advance while idle or tooFast", () => {
    for (const status of ["idle", "tooFast"] as const) {
      expect(advanceFillProgress({
        currentProgress: 0.25,
        elapsedMs: 1_000,
        isPouring: false,
        fillDurationMs: durationMs,
      })).toBe(0.25);
      expect(advanceTeaFillState({
        previous: initialState,
        status,
        direction: "neutral",
        elapsedMs: 1_000,
        fillDurationMs: durationMs,
      })).toEqual({ status, direction: "neutral", fillProgress: 0.25 });
    }
  });

  it("advances by elapsed time while pouring", () => {
    expect(advanceFillProgress({
      currentProgress: 0,
      elapsedMs: 1_000,
      isPouring: true,
      fillDurationMs: durationMs,
    })).toBeCloseTo(0.1);
    expect(advanceFillProgress({
      currentProgress: 0.1,
      elapsedMs: 500,
      isPouring: true,
      fillDurationMs: durationMs,
    })).toBeCloseTo(0.15);
  });

  it("keeps direction separate from whether fill advances", () => {
    expect(advanceTeaFillState({
      previous: initialState,
      status: "pouring",
      direction: "left",
      elapsedMs: 1_000,
      fillDurationMs: durationMs,
    })).toEqual({ status: "pouring", direction: "left", fillProgress: 0.35 });
  });

  it("clamps progress at one and reports full when elapsed duration completes", () => {
    expect(advanceFillProgress({
      currentProgress: 0.9,
      elapsedMs: 2_000,
      isPouring: true,
      fillDurationMs: durationMs,
    })).toBe(1);
    expect(advanceFillProgress({
      currentProgress: 1,
      elapsedMs: 1_000,
      isPouring: true,
      fillDurationMs: durationMs,
    })).toBe(1);
    expect(advanceTeaFillState({
      previous: { status: "pouring", direction: "right", fillProgress: 0.9 },
      status: "pouring",
      direction: "right",
      elapsedMs: 2_000,
      fillDurationMs: durationMs,
    })).toEqual({ status: "full", direction: "right", fillProgress: 1 });
  });

  it("keeps the completed full state after pouring stops", () => {
    expect(advanceTeaFillState({
      previous: { status: "full", direction: "right", fillProgress: 1 },
      status: "idle",
      direction: "neutral",
      elapsedMs: 1_000,
      fillDurationMs: durationMs,
    })).toEqual({ status: "full", direction: "neutral", fillProgress: 1 });
  });

  it("clamps input progress and ignores invalid elapsed time", () => {
    expect(advanceFillProgress({
      currentProgress: 2,
      elapsedMs: 100,
      isPouring: false,
      fillDurationMs: durationMs,
    })).toBe(1);
    expect(advanceFillProgress({
      currentProgress: -1,
      elapsedMs: 100,
      isPouring: false,
      fillDurationMs: durationMs,
    })).toBe(0);
    expect(advanceFillProgress({
      currentProgress: 0.2,
      elapsedMs: Number.NaN,
      isPouring: true,
      fillDurationMs: durationMs,
    })).toBe(0.2);
  });
});

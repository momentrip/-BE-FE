import { describe, expect, it } from "@jest/globals";

import {
  INITIAL_TEA_DRINKING_STATE,
  updateTeaDrinkingState,
} from "./teaDrinkingState";
import type { TeaDrinkingMachineState } from "./teaDrinkingState";
import { TEA_DRINKING_THRESHOLDS } from "./teaDrinkingThresholds";

function update(
  previous: TeaDrinkingMachineState,
  xTwistDegrees: number,
  nowMs: number,
): TeaDrinkingMachineState {
  return updateTeaDrinkingState({ previous, xTwistDegrees, nowMs });
}

function completeSip(
  previous: TeaDrinkingMachineState,
  startedAtMs: number,
): TeaDrinkingMachineState {
  let state = update(previous, 30, startedAtMs);
  state = update(state, 30, startedAtMs + 150);
  state = update(state, 20, startedAtMs + 200);
  state = update(state, 10, startedAtMs + 250);
  return update(state, 10, startedAtMs + 400);
}

function finishCooldown(
  previous: TeaDrinkingMachineState,
  nowMs: number,
): TeaDrinkingMachineState {
  return update(previous, 5, nowMs);
}

describe("tea drinking state machine", () => {
  it("counts one complete sip only after entering and returning", () => {
    const state = completeSip(INITIAL_TEA_DRINKING_STATE, 0);

    expect(state.sipCount).toBe(1);
    expect(state.status).toBe("cooldown");
  });

  it("does not count repeatedly while held above the enter threshold", () => {
    let state = update(INITIAL_TEA_DRINKING_STATE, 35, 0);
    state = update(state, 35, 150);
    state = update(state, 45, 1_000);
    state = update(state, 40, 2_000);

    expect(state).toMatchObject({ status: "drinking", sipCount: 0 });

    state = update(state, 5, 2_100);
    state = update(state, 5, 2_250);
    state = update(state, 5, 3_000);
    expect(state.sipCount).toBe(1);
  });

  it("does not count while movement jitters around the enter threshold", () => {
    let state = update(INITIAL_TEA_DRINKING_STATE, 26, 0);
    state = update(state, 24, 80);
    state = update(state, 27, 120);
    state = update(state, 23, 240);
    state = update(state, 26, 300);

    expect(state).toMatchObject({ status: "ready", sipCount: 0 });
  });

  it("does not count again when the device re-enters without returning", () => {
    let state = update(INITIAL_TEA_DRINKING_STATE, 30, 0);
    state = update(state, 30, 150);
    state = update(state, 20, 200);
    state = update(state, 35, 250);
    state = update(state, 20, 350);
    state = update(state, 35, 450);

    expect(state).toMatchObject({ status: "returning", sipCount: 0 });
  });

  it("counts a new sip after a complete return and cooldown", () => {
    let state = completeSip(INITIAL_TEA_DRINKING_STATE, 0);
    state = finishCooldown(state, 800);
    expect(state.status).toBe("ready");

    state = completeSip(state, 900);
    expect(state.sipCount).toBe(2);
  });

  it("reports completed after three full sip cycles", () => {
    let state = completeSip(INITIAL_TEA_DRINKING_STATE, 0);
    state = finishCooldown(state, 800);
    state = completeSip(state, 900);
    state = finishCooldown(state, 1_700);
    state = completeSip(state, 1_800);

    expect(state).toMatchObject({ status: "completed", sipCount: 3 });
  });

  it("keeps the completed state and sip count after additional movement", () => {
    let state = completeSip(INITIAL_TEA_DRINKING_STATE, 0);
    state = finishCooldown(state, 800);
    state = completeSip(state, 900);
    state = finishCooldown(state, 1_700);
    state = completeSip(state, 1_800);

    state = update(state, 50, 3_000);
    state = update(state, 0, 4_000);

    expect(state).toMatchObject({ status: "completed", sipCount: 3 });
  });

  it("ignores an enter movement shorter than the enter hold", () => {
    let state = update(INITIAL_TEA_DRINKING_STATE, 30, 0);
    state = update(state, 30, 100);
    state = update(state, 0, 120);

    expect(state).toMatchObject({ status: "ready", sipCount: 0 });
  });

  it("ignores a return shorter than the return hold", () => {
    let state = update(INITIAL_TEA_DRINKING_STATE, 30, 0);
    state = update(state, 30, 150);
    state = update(state, 20, 200);
    state = update(state, 5, 250);
    state = update(state, 15, 350);

    expect(state).toMatchObject({ status: "returning", sipCount: 0 });
    expect(state.returnStartedAtMs).toBeNull();
  });

  it("keeps measured thresholds and timing values in one constant", () => {
    expect(TEA_DRINKING_THRESHOLDS).toEqual({
      enterXTwistDegrees: 25,
      returnXTwistDegrees: 10,
      enterHoldMs: 150,
      returnHoldMs: 150,
      cooldownMs: 400,
    });
  });
});

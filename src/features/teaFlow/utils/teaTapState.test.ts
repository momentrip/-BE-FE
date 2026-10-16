import { describe, expect, it } from "@jest/globals";

import { S3_TAP_SETTINGS } from "../constants/s3Preparation";
import {
  advanceTeaTapState,
  getTeaTapVisualStage,
  INITIAL_TEA_TAP_STATE,
} from "./teaTapState";

const hit = S3_TAP_SETTINGS.impactThresholdG;
const release = S3_TAP_SETTINGS.releaseThresholdG;

describe("advanceTeaTapState", () => {
  it("충격과 복귀 사이클마다 한 번씩 최대 3회 센다", () => {
    let state = INITIAL_TEA_TAP_STATE;

    state = advanceTeaTapState({ previous: state, impactMagnitude: hit, nowMs: 0 });
    expect(state.count).toBe(1);
    state = advanceTeaTapState({ previous: state, impactMagnitude: release, nowMs: 350 });
    state = advanceTeaTapState({ previous: state, impactMagnitude: hit, nowMs: 351 });
    expect(state.count).toBe(2);
    state = advanceTeaTapState({ previous: state, impactMagnitude: release, nowMs: 701 });
    state = advanceTeaTapState({ previous: state, impactMagnitude: hit, nowMs: 702 });
    expect(state.count).toBe(3);
  });

  it("한 번의 충격이 계속되어도 중복으로 세지 않는다", () => {
    const once = advanceTeaTapState({
      previous: INITIAL_TEA_TAP_STATE,
      impactMagnitude: hit,
      nowMs: 0,
    });
    const duplicate = advanceTeaTapState({
      previous: once,
      impactMagnitude: hit + 1,
      nowMs: 500,
    });

    expect(duplicate.count).toBe(1);
  });

  it("cooldown 이전에는 다시 armed 상태가 되지 않는다", () => {
    const once = advanceTeaTapState({
      previous: INITIAL_TEA_TAP_STATE,
      impactMagnitude: hit,
      nowMs: 0,
    });
    const earlyRelease = advanceTeaTapState({
      previous: once,
      impactMagnitude: release,
      nowMs: S3_TAP_SETTINGS.cooldownMs - 1,
    });

    expect(earlyRelease.armed).toBe(false);
  });

  it("3회 이후 추가 충격을 무시한다", () => {
    const completed = { armed: true, count: 3 as const, lastTapAtMs: 1000 };
    expect(advanceTeaTapState({
      previous: completed,
      impactMagnitude: hit + 1,
      nowMs: 2000,
    })).toEqual(completed);
  });
});

describe("getTeaTapVisualStage", () => {
  it("대기 중 1/3부터 마지막 3/3까지 표시한다", () => {
    expect(getTeaTapVisualStage(0)).toBe(1);
    expect(getTeaTapVisualStage(1)).toBe(2);
    expect(getTeaTapVisualStage(2)).toBe(3);
    expect(getTeaTapVisualStage(3)).toBe(3);
  });
});

import { describe, expect, it } from "@jest/globals";

import {
  INITIAL_COMPLETED_DOUBLE_TAP_STATE,
  registerCompletedTap,
} from "./completedDoubleTap";

const MAX_INTERVAL_MS = 300;

describe("registerCompletedTap", () => {
  it("완료 전 tap과 완료 화면의 첫 tap은 callback 조건을 만들지 않는다", () => {
    const beforeCompleted = registerCompletedTap({
      completed: false,
      maxIntervalMs: MAX_INTERVAL_MS,
      nowMs: 100,
      previous: INITIAL_COMPLETED_DOUBLE_TAP_STATE,
    });
    const firstCompletedTap = registerCompletedTap({
      completed: true,
      maxIntervalMs: MAX_INTERVAL_MS,
      nowMs: 200,
      previous: beforeCompleted.next,
    });

    expect(beforeCompleted.shouldComplete).toBe(false);
    expect(firstCompletedTap.shouldComplete).toBe(false);
  });

  it("완료 화면에서 제한 시간 안의 두 번째 tap만 완료로 판정한다", () => {
    const firstTap = registerCompletedTap({
      completed: true,
      maxIntervalMs: MAX_INTERVAL_MS,
      nowMs: 1_000,
      previous: INITIAL_COMPLETED_DOUBLE_TAP_STATE,
    });
    const secondTap = registerCompletedTap({
      completed: true,
      maxIntervalMs: MAX_INTERVAL_MS,
      nowMs: 1_250,
      previous: firstTap.next,
    });

    expect(secondTap.shouldComplete).toBe(true);
    expect(secondTap.next.handled).toBe(true);
  });

  it("완료 처리 후 추가 tap의 중복 callback을 막는다", () => {
    const handled = { handled: true, lastTapAtMs: 1_000 };

    expect(registerCompletedTap({
      completed: true,
      maxIntervalMs: MAX_INTERVAL_MS,
      nowMs: 1_300,
      previous: handled,
    })).toEqual({ next: handled, shouldComplete: false });
  });
});

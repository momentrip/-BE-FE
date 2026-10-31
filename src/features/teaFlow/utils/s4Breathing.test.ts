import { describe, expect, it } from "@jest/globals";

import {
  formatS4RemainingTime,
  getS4BreathPhase,
  getS4RemainingMs,
  getS4SteepingProgress,
  S4_PHASE_COUNT,
} from "./s4Breathing";

const BASE_DURATIONS = Array.from({ length: S4_PHASE_COUNT }, () => 3000);

describe("getS4BreathPhase", () => {
  it("첫 phase는 1cycle 들숨이다", () => {
    expect(getS4BreathPhase(0, BASE_DURATIONS)).toEqual({
      cycleNumber: 1,
      phaseType: "inhale",
      phaseIndex: 0,
    });
  });

  it("9 phase를 들숨/날숨/멈춤 순서, 1~3cycle로 순회한다", () => {
    expect(getS4BreathPhase(3000, BASE_DURATIONS).phaseType).toBe("exhale");
    expect(getS4BreathPhase(6000, BASE_DURATIONS).phaseType).toBe("pause");
    expect(getS4BreathPhase(9000, BASE_DURATIONS).cycleNumber).toBe(2);
    expect(getS4BreathPhase(9000, BASE_DURATIONS).phaseType).toBe("inhale");
  });

  it("특정 phase(예: index 2 = 1cycle 멈춤)만 길어지면 그 phase에 머무는 시간만 늘어나고 나머지는 그대로다", () => {
    const durations = [...BASE_DURATIONS];
    durations[2] = 5000; // 1cycle 멈춤만 2초 연장

    // 0~3000: 들숨1, 3000~6000: 날숨1
    expect(getS4BreathPhase(3000, durations).phaseType).toBe("exhale");
    // 6000~11000(연장된 5000짜리): 멈춤1 -- 원래였다면 9000에 들숨2였을 시점에도 아직 멈춤1
    expect(getS4BreathPhase(9000, durations)).toEqual({
      cycleNumber: 1,
      phaseType: "pause",
      phaseIndex: 2,
    });
    // 11000부터는 다시 원래 길이(3000)인 들숨2
    expect(getS4BreathPhase(11000, durations)).toEqual({
      cycleNumber: 2,
      phaseType: "inhale",
      phaseIndex: 3,
    });
  });

  it("마지막 phase(멈춤3)를 넘는 경과 시간은 마지막 인덱스로 고정된다", () => {
    expect(getS4BreathPhase(999999, BASE_DURATIONS)).toEqual({
      cycleNumber: 3,
      phaseType: "pause",
      phaseIndex: S4_PHASE_COUNT - 1,
    });
  });
});

describe("getS4SteepingProgress", () => {
  it("0~1 사이로 clamp하고 phase 길이 합을 분모로 쓴다", () => {
    expect(getS4SteepingProgress(-10, BASE_DURATIONS)).toBe(0);
    expect(getS4SteepingProgress(13500, BASE_DURATIONS)).toBe(0.5);
    expect(getS4SteepingProgress(99999, BASE_DURATIONS)).toBe(1);
  });

  it("특정 phase가 늘어나면 분모(총합)도 늘어나 진행률이 그만큼 천천히 찬다", () => {
    const durations = [...BASE_DURATIONS];
    durations[0] = 5000; // 총합 27000 -> 29000
    expect(getS4SteepingProgress(27000, durations)).toBeCloseTo(27000 / 29000);
  });

  it("phase 길이 합이 0 이하면 1을 돌려준다", () => {
    expect(getS4SteepingProgress(100, [])).toBe(1);
  });
});

describe("getS4RemainingMs", () => {
  it("phase 길이 합에서 경과 시간을 뺀 값을 돌려주고, 음수는 0으로 clamp한다", () => {
    expect(getS4RemainingMs(0, BASE_DURATIONS)).toBe(27000);
    expect(getS4RemainingMs(13500, BASE_DURATIONS)).toBe(13500);
    expect(getS4RemainingMs(99999, BASE_DURATIONS)).toBe(0);
  });

  it("흔들림으로 phase가 늘어나면 남은 시간도 그만큼 늘어난다", () => {
    const durations = [...BASE_DURATIONS];
    durations[0] = 5000; // 총합 27000 -> 29000
    expect(getS4RemainingMs(0, durations)).toBe(29000);
  });
});

describe("formatS4RemainingTime", () => {
  it("ms를 mm:ss로 포맷한다", () => {
    expect(formatS4RemainingTime(27000)).toBe("00:27");
    expect(formatS4RemainingTime(90000)).toBe("01:30");
    expect(formatS4RemainingTime(0)).toBe("00:00");
  });

  it("음수는 00:00으로 clamp한다", () => {
    expect(formatS4RemainingTime(-500)).toBe("00:00");
  });
});

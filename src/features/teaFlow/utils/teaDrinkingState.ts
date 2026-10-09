import {
  TEA_DRINKING_TARGET_SIP_COUNT,
  TEA_DRINKING_THRESHOLDS,
} from "./teaDrinkingThresholds";

export type TeaDrinkingStatus =
  | "ready"
  | "drinking"
  | "returning"
  | "cooldown"
  | "completed";

export type TeaSipCount = 0 | 1 | 2 | 3;

export type TeaDrinkingMachineState = {
  sipCount: TeaSipCount;
  status: TeaDrinkingStatus;
  enterStartedAtMs: number | null;
  returnStartedAtMs: number | null;
  cooldownStartedAtMs: number | null;
};

type UpdateTeaDrinkingStateParams = {
  previous: TeaDrinkingMachineState;
  xTwistDegrees: number;
  nowMs: number;
};

export const INITIAL_TEA_DRINKING_STATE: TeaDrinkingMachineState = {
  sipCount: 0,
  status: "ready",
  enterStartedAtMs: null,
  returnStartedAtMs: null,
  cooldownStartedAtMs: null,
};

function increaseSipCount(sipCount: TeaSipCount): TeaSipCount {
  return Math.min(TEA_DRINKING_TARGET_SIP_COUNT, sipCount + 1) as TeaSipCount;
}

/** X twist와 경과 시간으로 완전한 sip 사이클의 상태를 한 단계 진행한다. */
export function updateTeaDrinkingState({
  previous,
  xTwistDegrees,
  nowMs,
}: UpdateTeaDrinkingStateParams): TeaDrinkingMachineState {
  if (!Number.isFinite(xTwistDegrees) || !Number.isFinite(nowMs)) {
    return previous;
  }

  if (previous.status === "completed") {
    return previous;
  }

  if (previous.status === "ready") {
    if (xTwistDegrees < TEA_DRINKING_THRESHOLDS.enterXTwistDegrees) {
      return previous.enterStartedAtMs === null
        ? previous
        : { ...previous, enterStartedAtMs: null };
    }

    const enterStartedAtMs = previous.enterStartedAtMs ?? nowMs;
    if (nowMs - enterStartedAtMs < TEA_DRINKING_THRESHOLDS.enterHoldMs) {
      return { ...previous, enterStartedAtMs };
    }

    return {
      ...previous,
      status: "drinking",
      enterStartedAtMs: null,
    };
  }

  if (previous.status === "drinking") {
    return xTwistDegrees < TEA_DRINKING_THRESHOLDS.enterXTwistDegrees
      ? {
          ...previous,
          status: "returning",
          returnStartedAtMs:
            xTwistDegrees <= TEA_DRINKING_THRESHOLDS.returnXTwistDegrees ? nowMs : null,
        }
      : previous;
  }

  if (previous.status === "returning") {
    if (xTwistDegrees > TEA_DRINKING_THRESHOLDS.returnXTwistDegrees) {
      return previous.returnStartedAtMs === null
        ? previous
        : { ...previous, returnStartedAtMs: null };
    }

    const returnStartedAtMs = previous.returnStartedAtMs ?? nowMs;
    if (nowMs - returnStartedAtMs < TEA_DRINKING_THRESHOLDS.returnHoldMs) {
      return { ...previous, returnStartedAtMs };
    }

    const sipCount = increaseSipCount(previous.sipCount);
    if (sipCount >= TEA_DRINKING_TARGET_SIP_COUNT) {
      return {
        sipCount,
        status: "completed",
        enterStartedAtMs: null,
        returnStartedAtMs: null,
        cooldownStartedAtMs: null,
      };
    }

    return {
      sipCount,
      status: "cooldown",
      enterStartedAtMs: null,
      returnStartedAtMs: null,
      cooldownStartedAtMs: nowMs,
    };
  }

  if (xTwistDegrees > TEA_DRINKING_THRESHOLDS.returnXTwistDegrees) {
    return previous.cooldownStartedAtMs === null
      ? previous
      : { ...previous, cooldownStartedAtMs: null };
  }

  const cooldownStartedAtMs = previous.cooldownStartedAtMs ?? nowMs;
  if (nowMs - cooldownStartedAtMs < TEA_DRINKING_THRESHOLDS.cooldownMs) {
    return { ...previous, cooldownStartedAtMs };
  }

  return {
    ...previous,
    status: "ready",
    cooldownStartedAtMs: null,
  };
}

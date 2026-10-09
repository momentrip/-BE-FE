/** 실제 아이폰 측정 기반 S6 차 마시기 동작 감지 초기값. */
export const TEA_DRINKING_THRESHOLDS = {
  enterXTwistDegrees: 25,
  returnXTwistDegrees: 10,
  enterHoldMs: 150,
  returnHoldMs: 150,
  cooldownMs: 400,
} as const;

export const TEA_DRINKING_TARGET_SIP_COUNT = 3;
export const TEA_DRINKING_BASELINE_DURATION_MS = 750;
export const TEA_DRINKING_MIN_BASELINE_SAMPLES = 3;
export const TEA_DRINKING_POLL_INTERVAL_MS = 100;

export const POURING_THRESHOLDS = {
  idleMaxAbsDeltaRoll: 10,
  pouringMaxAbsDeltaRoll: 35,
} as const;

/** 초기값은 이번 실기기 테스트 결과를 기준으로 한 PoC threshold이며, 추가 검증 후 조정한다. */
export const Z_TWIST_THRESHOLDS = {
  neutralDeadZoneDegrees: 8,
  tooFastMinAbsDegrees: 40,
} as const;

export const PITCH_VALID_RANGE = {
  min: -60,
  max: 60,
} as const;

export const CALIBRATION_DURATION_MS = 750;
export const MIN_CALIBRATION_SAMPLES = 3;
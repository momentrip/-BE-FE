/** 실기기 검증 기반 초기값이다. 추가 사용성 테스트 후 조정한다. */
export const Z_TWIST_THRESHOLDS = {
  neutralDeadZoneDegrees: 8,
  tooFastMinAbsDegrees: 40,
} as const;

export const BASELINE_CALIBRATION_DURATION_MS = 750;
export const MIN_BASELINE_SAMPLES = 3;
export const POURING_FILL_DURATION_MS = 12_000;
export const POURING_STATE_POLL_INTERVAL_MS = 100;

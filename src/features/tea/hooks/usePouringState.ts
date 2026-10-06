import { useEffect, useRef, useState } from "react";
import type { TiltStatus } from "@/shared/sensors";
import {
  calculateBaselineRoll,
  calculateDeltaRoll,
  isPitchWithinValidRange,
} from "../logic/pouringCalibration";
import { getPouringState } from "../logic/pouringState";
import { CALIBRATION_DURATION_MS, MIN_CALIBRATION_SAMPLES } from "../logic/pouringThresholds";
import type { PouringDirection, PouringStatus } from "../logic/pouringState";

export type PouringCalibrationStatus = "calibrating" | "ready" | "unavailable" | "error";

export type PouringStateReading = {
  baselineRoll: number | null;
  deltaRoll: number | null;
  status: PouringStatus;
  direction: PouringDirection;
  calibrationStatus: PouringCalibrationStatus;
};

export type PouringTiltInput = {
  pitch: number | null;
  roll: number | null;
  status: TiltStatus;
};

/**
 * 센서 입력으로 S5 진입 시 roll baseline을 한 번 측정하고 차 따르기 상태를 계산한다.
 * @param tilt shared 센서에서 읽은 pitch, roll, 센서 상태
 * @returns baseline, baseline 대비 roll 변화량, 상태, 방향 및 보정 상태. 사용처: tea 화면
 */
export function usePouringState(tilt: PouringTiltInput): PouringStateReading {
  const [baselineRoll, setBaselineRoll] = useState<number | null>(null);
  const calibrationStartedAt = useRef<number | null>(null);
  const rollSamples = useRef<number[]>([]);

  useEffect(() => {
    if (baselineRoll !== null) {
      return;
    }

    const canSample =
      tilt.status === "ready" &&
      tilt.roll !== null &&
      Number.isFinite(tilt.roll) &&
      isPitchWithinValidRange(tilt.pitch);

    if (!canSample || tilt.roll === null) {
      calibrationStartedAt.current = null;
      rollSamples.current = [];
      return;
    }

    const now = Date.now();
    if (calibrationStartedAt.current === null) {
      calibrationStartedAt.current = now;
    }
    rollSamples.current.push(tilt.roll);

    const calibrationElapsed = now - calibrationStartedAt.current;
    if (
      calibrationElapsed >= CALIBRATION_DURATION_MS &&
      rollSamples.current.length >= MIN_CALIBRATION_SAMPLES
    ) {
      setBaselineRoll(calculateBaselineRoll(rollSamples.current));
    }
  }, [baselineRoll, tilt.pitch, tilt.roll, tilt.status]);

  const deltaRoll = calculateDeltaRoll(tilt.roll, baselineRoll);
  const pouringState = getPouringState(deltaRoll, tilt.pitch);
  const calibrationStatus: PouringCalibrationStatus =
    tilt.status === "unavailable" || tilt.status === "error"
      ? tilt.status
      : baselineRoll === null
        ? "calibrating"
        : "ready";

  return {
    baselineRoll,
    deltaRoll,
    ...pouringState,
    calibrationStatus,
  };
}
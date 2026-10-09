import { useEffect, useState } from "react";
import { useTiltShared } from "@/shared/sensors";
import {
  averageQuaternions,
  calculateRelativeOrientation,
  eulerAttitudeToQuaternion,
} from "../utils/orientation";
import type { Quaternion } from "../utils/orientation";
import { advanceTeaFillState } from "../utils/fillProgress";
import { getZTwistPouringState } from "../utils/zTwistState";
import type { PouringDirectionCandidate } from "../utils/pouringDirection";
import type { TeaPouringStatus } from "../utils/zTwistState";
import {
  BASELINE_CALIBRATION_DURATION_MS,
  MIN_BASELINE_SAMPLES,
  POURING_FILL_DURATION_MS,
  POURING_STATE_POLL_INTERVAL_MS,
} from "../utils/pouringThresholds";

export type TeaPouringCalibrationStatus = "calibrating" | "ready" | "unavailable" | "error";

export type TeaPouringState = {
  calibrationStatus: TeaPouringCalibrationStatus;
  zTwistDegrees: number | null;
  direction: PouringDirectionCandidate;
  status: TeaPouringStatus;
  fillProgress: number;
};

const INITIAL_STATE: TeaPouringState = {
  calibrationStatus: "calibrating",
  zTwistDegrees: null,
  direction: "neutral",
  status: "idle",
  fillProgress: 0,
};

/**
 * S5 진입 자세를 baseline으로 보정하고 Z twist 기반 차 따르기 상태를 계산한다.
 * 입력: 없음. shared/sensors의 자세 값을 사용한다.
 * @returns 보정 상태, Z twist, 방향, 따르기 상태, 0~1 범위의 채움 진행도
 * 사용처: tea S5 차 따르기 화면
 */
export function useTeaPouring(): TeaPouringState {
  const { attitude, status: sensorStatus } = useTiltShared();
  const [baseline, setBaseline] = useState<Quaternion | null>(null);
  const [pouringState, setPouringState] = useState<TeaPouringState>(INITIAL_STATE);

  useEffect(() => {
    if (sensorStatus !== "ready" || baseline !== null) {
      return;
    }

    const samples: Quaternion[] = [];
    let lastSampleTimestamp: number | null = null;
    const startedAt = Date.now();
    const calibrationTimer = setInterval(() => {
      const sample = attitude.value;
      if (sample !== null && sample.timestamp !== lastSampleTimestamp) {
        lastSampleTimestamp = sample.timestamp;
        const quaternion = eulerAttitudeToQuaternion(sample);
        if (quaternion !== null) {
          samples.push(quaternion);
        }
      }

      if (
        Date.now() - startedAt >= BASELINE_CALIBRATION_DURATION_MS &&
        samples.length >= MIN_BASELINE_SAMPLES
      ) {
        const measuredBaseline = averageQuaternions(samples);
        if (measuredBaseline !== null) {
          clearInterval(calibrationTimer);
          setBaseline(measuredBaseline);
        }
      }
    }, POURING_STATE_POLL_INTERVAL_MS);

    return () => clearInterval(calibrationTimer);
  }, [attitude, baseline, sensorStatus]);

  useEffect(() => {
    if (baseline === null) {
      return;
    }

    let lastTickAt = Date.now();
    const stateTimer = setInterval(() => {
      const now = Date.now();
      const elapsedMs = now - lastTickAt;
      lastTickAt = now;

      const sample = attitude.value;
      const current = sample === null ? null : eulerAttitudeToQuaternion(sample);
      const relative = current === null
        ? null
        : calculateRelativeOrientation(baseline, current);
      const zTwistDegrees = relative?.twistDegrees.z ?? null;
      const detectedState = getZTwistPouringState(zTwistDegrees);

      setPouringState((previous) => {
        const nextFillState = advanceTeaFillState({
          previous,
          status: detectedState.status,
          direction: detectedState.direction,
          elapsedMs,
          fillDurationMs: POURING_FILL_DURATION_MS,
        });

        return {
          calibrationStatus: "ready",
          zTwistDegrees,
          ...nextFillState,
        };
      });
    }, POURING_STATE_POLL_INTERVAL_MS);

    return () => clearInterval(stateTimer);
  }, [attitude, baseline]);

  const calibrationStatus: TeaPouringCalibrationStatus = baseline !== null
    ? "ready"
    : sensorStatus === "unavailable" || sensorStatus === "error"
      ? sensorStatus
      : "calibrating";

  return { ...pouringState, calibrationStatus };
}

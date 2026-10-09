import { useEffect, useState } from "react";

import { useTiltShared } from "@/shared/sensors";

import {
  averageQuaternions,
  calculateRelativeOrientation,
  eulerAttitudeToQuaternion,
} from "../utils/orientation";
import type { Quaternion } from "../utils/orientation";
import {
  INITIAL_TEA_DRINKING_STATE,
  updateTeaDrinkingState,
} from "../utils/teaDrinkingState";
import type {
  TeaDrinkingMachineState,
  TeaDrinkingStatus,
  TeaSipCount,
} from "../utils/teaDrinkingState";
import {
  TEA_DRINKING_BASELINE_DURATION_MS,
  TEA_DRINKING_MIN_BASELINE_SAMPLES,
  TEA_DRINKING_POLL_INTERVAL_MS,
} from "../utils/teaDrinkingThresholds";

export type TeaDrinkingCalibrationStatus = "calibrating" | "ready" | "unavailable" | "error";

export type TeaDrinkingState = {
  sipCount: TeaSipCount;
  status: TeaDrinkingStatus;
  completed: boolean;
  currentXTwistDegrees: number | null;
  calibrationStatus: TeaDrinkingCalibrationStatus;
};

type InternalTeaDrinkingState = {
  machine: TeaDrinkingMachineState;
  currentXTwistDegrees: number | null;
};

const INITIAL_STATE: InternalTeaDrinkingState = {
  machine: INITIAL_TEA_DRINKING_STATE,
  currentXTwistDegrees: null,
};

/**
 * S6 진입 자세를 baseline으로 보정하고 완전한 차 마시기 동작을 최대 세 번 감지한다.
 * 입력: 없음. shared/sensors의 자세 값을 사용한다.
 * @returns sip 횟수, 동작 상태, 완료 여부, 현재 baseline-local X twist와 보정 상태
 * 사용처: teaFlow S6/S7 통합 화면
 */
export function useTeaDrinking(): TeaDrinkingState {
  const { attitude, status: sensorStatus } = useTiltShared();
  const [baseline, setBaseline] = useState<Quaternion | null>(null);
  const [drinkingState, setDrinkingState] = useState<InternalTeaDrinkingState>(INITIAL_STATE);

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
        Date.now() - startedAt >= TEA_DRINKING_BASELINE_DURATION_MS &&
        samples.length >= TEA_DRINKING_MIN_BASELINE_SAMPLES
      ) {
        const measuredBaseline = averageQuaternions(samples);
        if (measuredBaseline !== null) {
          clearInterval(calibrationTimer);
          setBaseline(measuredBaseline);
        }
      }
    }, TEA_DRINKING_POLL_INTERVAL_MS);

    return () => clearInterval(calibrationTimer);
  }, [attitude, baseline, sensorStatus]);

  useEffect(() => {
    if (baseline === null) {
      return;
    }

    const stateTimer = setInterval(() => {
      const sample = attitude.value;
      const current = sample === null ? null : eulerAttitudeToQuaternion(sample);
      const relative = current === null
        ? null
        : calculateRelativeOrientation(baseline, current);
      const currentXTwistDegrees = relative?.twistDegrees.x ?? null;

      setDrinkingState((previous) => ({
        currentXTwistDegrees,
        machine: currentXTwistDegrees === null
          ? previous.machine
          : updateTeaDrinkingState({
              previous: previous.machine,
              xTwistDegrees: currentXTwistDegrees,
              nowMs: Date.now(),
            }),
      }));
    }, TEA_DRINKING_POLL_INTERVAL_MS);

    return () => clearInterval(stateTimer);
  }, [attitude, baseline]);

  const calibrationStatus: TeaDrinkingCalibrationStatus = baseline !== null
    ? "ready"
    : sensorStatus === "unavailable" || sensorStatus === "error"
      ? sensorStatus
      : "calibrating";

  return {
    sipCount: drinkingState.machine.sipCount,
    status: drinkingState.machine.status,
    completed: drinkingState.machine.status === "completed",
    currentXTwistDegrees: drinkingState.currentXTwistDegrees,
    calibrationStatus,
  };
}

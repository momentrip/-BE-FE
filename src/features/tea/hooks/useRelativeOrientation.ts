import { useEffect, useRef, useState } from "react";
import type { DeviceAttitudeReading } from "@/shared/sensors";
import {
  averageQuaternions,
  calculateRelativeOrientation,
  eulerAttitudeToQuaternion,
} from "../logic/orientation";
import type { Quaternion, RelativeOrientation } from "../logic/orientation";
import { CALIBRATION_DURATION_MS, MIN_CALIBRATION_SAMPLES } from "../logic/pouringThresholds";

export type OrientationCalibrationStatus = "calibrating" | "ready" | "unavailable" | "error";

export type RelativeOrientationReading = {
  baselineQuaternion: Quaternion | null;
  currentQuaternion: Quaternion | null;
  relative: RelativeOrientation | null;
  calibrationStatus: OrientationCalibrationStatus;
};

/**
 * S5에 진입할 때 attitude quaternion baseline을 측정하고 baseline-local 상대 회전을 계산한다.
 * @param attitude shared 센서에서 제공하는 raw alpha/beta/gamma 라디안 및 timestamp
 * @returns 기준/현재 quaternion, 상대 회전 정보와 보정 상태. 사용처: tea 화면
 */
export function useRelativeOrientation(
  attitude: DeviceAttitudeReading,
): RelativeOrientationReading {
  const [baselineQuaternion, setBaselineQuaternion] = useState<Quaternion | null>(null);
  const calibrationStartedAt = useRef<number | null>(null);
  const calibrationSamples = useRef<Quaternion[]>([]);
  const lastSampleTimestamp = useRef<number | null>(null);

  const currentQuaternion =
    attitude.alpha !== null &&
    attitude.beta !== null &&
    attitude.gamma !== null &&
    Number.isFinite(attitude.alpha) &&
    Number.isFinite(attitude.beta) &&
    Number.isFinite(attitude.gamma)
    ? eulerAttitudeToQuaternion({
        alpha: attitude.alpha,
        beta: attitude.beta,
        gamma: attitude.gamma,
      })
    : null;

  useEffect(() => {
    if (baselineQuaternion !== null) {
      return;
    }

    if (
      attitude.status !== "ready" ||
      attitude.timestamp === null ||
      !Number.isFinite(attitude.timestamp) ||
      currentQuaternion === null
    ) {
      calibrationStartedAt.current = null;
      calibrationSamples.current = [];
      lastSampleTimestamp.current = null;
      return;
    }

    if (lastSampleTimestamp.current === attitude.timestamp) {
      return;
    }
    lastSampleTimestamp.current = attitude.timestamp;

    const now = Date.now();
    if (calibrationStartedAt.current === null) {
      calibrationStartedAt.current = now;
    }
    calibrationSamples.current.push(currentQuaternion);

    if (
      now - calibrationStartedAt.current >= CALIBRATION_DURATION_MS &&
      calibrationSamples.current.length >= MIN_CALIBRATION_SAMPLES
    ) {
      setBaselineQuaternion(averageQuaternions(calibrationSamples.current));
    }
  }, [attitude.status, attitude.timestamp, baselineQuaternion, currentQuaternion]);

  const relative = baselineQuaternion !== null && currentQuaternion !== null
    ? calculateRelativeOrientation(baselineQuaternion, currentQuaternion)
    : null;
  const calibrationStatus: OrientationCalibrationStatus =
    attitude.status === "unavailable" || attitude.status === "error"
      ? attitude.status
      : baselineQuaternion === null
        ? "calibrating"
        : "ready";

  return {
    baselineQuaternion,
    currentQuaternion,
    relative,
    calibrationStatus,
  };
}
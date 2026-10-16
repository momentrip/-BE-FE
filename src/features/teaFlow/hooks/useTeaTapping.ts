import { useCallback, useEffect, useRef, useState } from "react";

import { useImpactShared } from "@/shared/sensors";
import type { ImpactSensorStatus } from "@/shared/sensors";

import { S3_TAP_SETTINGS } from "../constants/s3Preparation";
import {
  advanceTeaTapState,
  getTeaTapVisualStage,
  INITIAL_TEA_TAP_STATE,
} from "../utils/teaTapState";
import type { TeaTapCount, TeaTapState } from "../utils/teaTapState";

type UseTeaTappingOptions = {
  enabled: boolean;
  onCompleted: () => void;
  sensorEnabled: boolean;
};

export type TeaTappingState = {
  count: TeaTapCount;
  registerFallbackTap: () => void;
  requestPermission: () => Promise<boolean>;
  sensorStatus: ImpactSensorStatus;
  visualStage: 1 | 2 | 3;
};

export function useTeaTapping({
  enabled,
  onCompleted,
  sensorEnabled,
}: UseTeaTappingOptions): TeaTappingState {
  const { impactMagnitude, requestPermission, status: sensorStatus } = useImpactShared({
    enabled: enabled && sensorEnabled,
  });
  const machineRef = useRef<TeaTapState>(INITIAL_TEA_TAP_STATE);
  const completedCallbackRef = useRef(onCompleted);
  const completionScheduledRef = useRef(false);
  const [count, setCount] = useState<TeaTapCount>(0);

  useEffect(() => {
    completedCallbackRef.current = onCompleted;
  }, [onCompleted]);

  useEffect(() => {
    if (!enabled) {
      machineRef.current = INITIAL_TEA_TAP_STATE;
      completionScheduledRef.current = false;
      return;
    }

    if (!sensorEnabled) {
      return;
    }

    const timer = setInterval(() => {
      const previous = machineRef.current;
      const next = advanceTeaTapState({
        previous,
        impactMagnitude: impactMagnitude.value,
        nowMs: Date.now(),
      });
      machineRef.current = next;

      if (next.count !== previous.count) {
        setCount(next.count);
      }
    }, S3_TAP_SETTINGS.pollIntervalMs);

    return () => clearInterval(timer);
  }, [enabled, impactMagnitude, sensorEnabled]);

  const registerFallbackTap = useCallback(() => {
    if (!enabled || sensorEnabled) {
      return;
    }

    const nowMs = Date.now();
    const released = advanceTeaTapState({
      previous: machineRef.current,
      impactMagnitude: S3_TAP_SETTINGS.releaseThresholdG,
      nowMs,
    });
    const next = advanceTeaTapState({
      previous: released,
      impactMagnitude: S3_TAP_SETTINGS.impactThresholdG,
      nowMs,
    });
    machineRef.current = next;
    setCount(next.count);
  }, [enabled, sensorEnabled]);

  useEffect(() => {
    if (count < S3_TAP_SETTINGS.targetCount || completionScheduledRef.current) {
      return;
    }

    completionScheduledRef.current = true;
    const timer = setTimeout(() => {
      completedCallbackRef.current();
    }, S3_TAP_SETTINGS.completedStageDurationMs);

    return () => clearTimeout(timer);
  }, [count]);

  return {
    count,
    registerFallbackTap,
    requestPermission,
    sensorStatus,
    visualStage: getTeaTapVisualStage(count),
  };
}

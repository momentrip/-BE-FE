import { useCallback, useEffect, useRef, useState } from "react";
import { runOnJS, useAnimatedReaction } from "react-native-reanimated";

import { useImpactShared } from "@/shared/sensors";

import { S4_STEEPING_SETTINGS } from "../constants/s4Steeping";
import {
  getS4BreathPhase,
  getS4RemainingMs,
  getS4SteepingProgress,
  S4_PHASE_COUNT,
} from "../utils/s4Breathing";
import type { S4BreathPhase } from "../utils/s4Breathing";

type UseS4BreathingOptions = {
  enabled: boolean;
  onDone: () => void;
};

export type S4BreathingReading = S4BreathPhase & {
  /** phase 길이 합 대비 진행률 (0~1). 하단 진행바 폭으로 그대로 쓴다. */
  progress: number;
  /** 남은 시간(ms). 흔들림으로 phase가 늘어나면 같이 늘어난다. */
  remainingMs: number;
};

const TICK_MS = 150;

function createInitialPhaseDurations(): number[] {
  return Array.from({ length: S4_PHASE_COUNT }, () => S4_STEEPING_SETTINGS.basePhaseDurationMs);
}

/**
 * breathing 단계의 경과 시간을 재고 들숨/날숨/멈춤 phase, cycle, 진행률을 계산한다.
 * 흔들림(Accelerometer impact)이 감지되면 "그 순간 진행 중이던 phase"의 길이만 늘린다.
 * 다른 phase의 길이·순서는 영향받지 않는다.
 */
export function useS4Breathing({ enabled, onDone }: UseS4BreathingOptions): S4BreathingReading {
  const [elapsedMs, setElapsedMs] = useState(0);
  const [phaseDurations, setPhaseDurations] = useState<number[]>(createInitialPhaseDurations);
  const doneRef = useRef(false);
  const lastTiltTriggerRef = useRef(0);
  const phaseIndexRef = useRef(0);

  const { impactMagnitude, requestPermission } = useImpactShared({ enabled });

  useEffect(() => {
    if (!enabled) {
      return;
    }
    void requestPermission();
  }, [enabled, requestPermission]);

  useEffect(() => {
    if (!enabled) {
      doneRef.current = false;
      lastTiltTriggerRef.current = 0;
      phaseIndexRef.current = 0;
      return;
    }

    const startedAt = Date.now();
    const timer = setInterval(() => {
      setElapsedMs(Date.now() - startedAt);
    }, TICK_MS);

    return () => clearInterval(timer);
  }, [enabled]);

  const addTiltExtensionToCurrentPhase = useCallback(() => {
    const now = Date.now();
    if (now - lastTiltTriggerRef.current < S4_STEEPING_SETTINGS.tiltCooldownMs) {
      return;
    }
    lastTiltTriggerRef.current = now;

    const targetIndex = phaseIndexRef.current;
    setPhaseDurations((previous) => {
      const extendedSoFar = previous[targetIndex] - S4_STEEPING_SETTINGS.basePhaseDurationMs;
      if (extendedSoFar >= S4_STEEPING_SETTINGS.maxPhaseExtensionMs) {
        return previous;
      }
      const next = [...previous];
      next[targetIndex] = Math.min(
        next[targetIndex] + S4_STEEPING_SETTINGS.tiltPenaltyMs,
        S4_STEEPING_SETTINGS.basePhaseDurationMs + S4_STEEPING_SETTINGS.maxPhaseExtensionMs,
      );
      return next;
    });
  }, []);

  useAnimatedReaction(
    () => impactMagnitude.value,
    (current) => {
      if (current > S4_STEEPING_SETTINGS.tiltThreshold) {
        runOnJS(addTiltExtensionToCurrentPhase)();
      }
    },
    [addTiltExtensionToCurrentPhase],
  );

  const progress = getS4SteepingProgress(elapsedMs, phaseDurations);
  const remainingMs = getS4RemainingMs(elapsedMs, phaseDurations);
  const phase = getS4BreathPhase(elapsedMs, phaseDurations);

  useEffect(() => {
    phaseIndexRef.current = phase.phaseIndex;
  }, [phase.phaseIndex]);

  useEffect(() => {
    if (enabled && progress >= 1 && !doneRef.current) {
      doneRef.current = true;
      onDone();
    }
  }, [enabled, progress, onDone]);

  return { ...phase, progress, remainingMs };
}

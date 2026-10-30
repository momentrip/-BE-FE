import { useCallback, useEffect, useRef, useState } from "react";

import { S3_TAP_SETTINGS } from "../constants/s3Preparation";
import {
  finishTeaTapTransition,
  getTeaTapVisualStage,
  INITIAL_TEA_TAP_TRANSITION_STATE,
  registerTeaTap,
} from "../utils/teaTapState";
import type { TeaTapCount, TeaTapTransitionState } from "../utils/teaTapState";

type UseTeaTappingOptions = {
  enabled: boolean;
  onCompleted: () => void;
};

export type TeaTappingState = {
  count: TeaTapCount;
  finishTransition: () => void;
  registerTap: () => void;
  visualStage: 1 | 2 | 3;
};

export function useTeaTapping({
  enabled,
  onCompleted,
}: UseTeaTappingOptions): TeaTappingState {
  const completedCallbackRef = useRef(onCompleted);
  const completionScheduledRef = useRef(false);
  const transitionRef = useRef<TeaTapTransitionState>(
    INITIAL_TEA_TAP_TRANSITION_STATE,
  );
  const [count, setCount] = useState<TeaTapCount>(0);

  useEffect(() => {
    completedCallbackRef.current = onCompleted;
  }, [onCompleted]);

  const registerTap = useCallback(() => {
    if (!enabled) {
      return;
    }

    const next = registerTeaTap(transitionRef.current);
    if (next === transitionRef.current) {
      return;
    }

    transitionRef.current = next;
    setCount(next.count);
  }, [enabled]);

  const finishTransition = useCallback(() => {
    transitionRef.current = finishTeaTapTransition(transitionRef.current);
  }, []);

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
    finishTransition,
    registerTap,
    visualStage: getTeaTapVisualStage(count),
  };
}

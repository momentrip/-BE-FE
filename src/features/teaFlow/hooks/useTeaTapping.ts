import { useCallback, useEffect, useRef, useState } from "react";

import { S3_TAP_SETTINGS } from "../constants/s3Preparation";
import {
  completeTeaTapAnimation,
  INITIAL_TEA_TAP_ANIMATION_STATE,
  reachTeaTapVisualStage,
  startTeaTapAnimation,
} from "../utils/teaTapState";
import type { TeaTapAnimationState } from "../utils/teaTapState";

type UseTeaTappingOptions = {
  enabled: boolean;
  onCompleted: () => void;
};

export type TeaTappingState = {
  animationStarted: boolean;
  completeAnimation: () => void;
  reachVisualStage: (stage: 2 | 3) => void;
  registerTap: () => void;
  visualStage: 1 | 2 | 3;
};

export function useTeaTapping({
  enabled,
  onCompleted,
}: UseTeaTappingOptions): TeaTappingState {
  const completedCallbackRef = useRef(onCompleted);
  const completionScheduledRef = useRef(false);
  const animationRef = useRef<TeaTapAnimationState>(
    INITIAL_TEA_TAP_ANIMATION_STATE,
  );
  const [animationStarted, setAnimationStarted] = useState(false);
  const [animationCompleted, setAnimationCompleted] = useState(false);
  const [visualStage, setVisualStage] = useState<1 | 2 | 3>(1);

  useEffect(() => {
    completedCallbackRef.current = onCompleted;
  }, [onCompleted]);

  const registerTap = useCallback(() => {
    if (!enabled) {
      return;
    }

    const next = startTeaTapAnimation(animationRef.current);
    if (next === animationRef.current) {
      return;
    }

    animationRef.current = next;
    setAnimationStarted(true);
  }, [enabled]);

  const reachVisualStage = useCallback((stage: 2 | 3) => {
    const next = reachTeaTapVisualStage(animationRef.current, stage);
    animationRef.current = next;
    setVisualStage(next.visualStage);
  }, []);

  const completeAnimation = useCallback(() => {
    const next = completeTeaTapAnimation(animationRef.current);
    if (next === animationRef.current) {
      return;
    }

    animationRef.current = next;
    setVisualStage(next.visualStage);
    setAnimationCompleted(true);
  }, []);

  useEffect(() => {
    if (!animationCompleted || completionScheduledRef.current) {
      return;
    }

    completionScheduledRef.current = true;
    const timer = setTimeout(() => {
      completedCallbackRef.current();
    }, S3_TAP_SETTINGS.completedStageDurationMs);

    return () => clearTimeout(timer);
  }, [animationCompleted]);

  return {
    animationStarted,
    completeAnimation,
    reachVisualStage,
    registerTap,
    visualStage,
  };
}

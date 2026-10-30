import { useCallback, useEffect, useRef, useState } from "react";

import { S3_TAP_SETTINGS } from "../constants/s3Preparation";
import {
  completeTeaTapAnimation,
  INITIAL_TEA_TAP_ANIMATION_STATE,
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
  registerTap: () => void;
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

  const completeAnimation = useCallback(() => {
    const next = completeTeaTapAnimation(animationRef.current);
    if (next === animationRef.current) {
      return;
    }

    animationRef.current = next;
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
    registerTap,
  };
}

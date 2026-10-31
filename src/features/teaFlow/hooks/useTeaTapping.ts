import { useCallback, useEffect, useRef, useState } from "react";

import {
  completeTeaTapAnimation,
  confirmTeaTapCompletion,
  INITIAL_TEA_TAP_ANIMATION_STATE,
  startTeaTapAnimation,
} from "../utils/teaTapState";
import type { TeaTapAnimationState } from "../utils/teaTapState";

type UseTeaTappingOptions = {
  enabled: boolean;
  onCompleted: () => void;
};

export type TeaTappingState = {
  animationCompleted: boolean;
  animationStarted: boolean;
  completeAnimation: () => void;
  registerTap: () => void;
};

export function useTeaTapping({
  enabled,
  onCompleted,
}: UseTeaTappingOptions): TeaTappingState {
  const completedCallbackRef = useRef(onCompleted);
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

    if (animationRef.current.phase === "completed") {
      const next = confirmTeaTapCompletion(animationRef.current);
      if (next === animationRef.current) {
        return;
      }

      animationRef.current = next;
      completedCallbackRef.current();
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

  return {
    animationCompleted,
    animationStarted,
    completeAnimation,
    registerTap,
  };
}

import { useCallback, useEffect, useRef, useState } from "react";

import { S3_TAP_SETTINGS } from "../constants/s3Preparation";
import {
  advanceTeaTapCount,
  getTeaTapVisualStage,
} from "../utils/teaTapState";
import type { TeaTapCount } from "../utils/teaTapState";

type UseTeaTappingOptions = {
  enabled: boolean;
  onCompleted: () => void;
};

export type TeaTappingState = {
  count: TeaTapCount;
  registerTap: () => void;
  visualStage: 1 | 2 | 3;
};

export function useTeaTapping({
  enabled,
  onCompleted,
}: UseTeaTappingOptions): TeaTappingState {
  const completedCallbackRef = useRef(onCompleted);
  const completionScheduledRef = useRef(false);
  const [count, setCount] = useState<TeaTapCount>(0);

  useEffect(() => {
    completedCallbackRef.current = onCompleted;
  }, [onCompleted]);

  const registerTap = useCallback(() => {
    if (!enabled) {
      return;
    }
    setCount((previous) => advanceTeaTapCount(previous));
  }, [enabled]);

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
    registerTap,
    visualStage: getTeaTapVisualStage(count),
  };
}

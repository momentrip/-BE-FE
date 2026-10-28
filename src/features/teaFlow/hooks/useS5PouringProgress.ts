import { useEffect, useRef, useState } from "react";

import { S5_PROGRESS_UPDATE_INTERVAL_MS, S5_TEMPORARY_FILL_DURATION_MS } from "../constants/s5Pouring";
import { advanceTeaFillState } from "../utils/fillProgress";
import type { TeaFillState } from "../utils/fillProgress";
import type { PouringDirectionCandidate } from "../utils/pouringDirection";
import type { TeaPouringStatus } from "../utils/zTwistState";

type UseS5PouringProgressParams = {
  status: TeaPouringStatus;
  direction: PouringDirectionCandidate;
  enabled: boolean;
};

type S5PouringProgress = {
  progress: number;
  completed: boolean;
};

const INITIAL_FILL_STATE: TeaFillState = {
  fillProgress: 0,
  status: "idle",
  direction: "neutral",
};

export function useS5PouringProgress({
  status,
  direction,
  enabled,
}: UseS5PouringProgressParams): S5PouringProgress {
  const [fillState, setFillState] = useState<TeaFillState>(INITIAL_FILL_STATE);
  const lastUpdatedAtRef = useRef<number | null>(null);

  useEffect(() => {
    lastUpdatedAtRef.current = Date.now();

    if (!enabled || fillState.status === "full") {
      return;
    }

    const timer = setInterval(() => {
      const now = Date.now();
      const elapsedMs = lastUpdatedAtRef.current === null ? 0 : now - lastUpdatedAtRef.current;
      lastUpdatedAtRef.current = now;

      setFillState((previous) => advanceTeaFillState({
        previous,
        status,
        direction,
        elapsedMs,
        fillDurationMs: S5_TEMPORARY_FILL_DURATION_MS,
      }));
    }, S5_PROGRESS_UPDATE_INTERVAL_MS);

    return () => clearInterval(timer);
  }, [direction, enabled, fillState.status, status]);

  return {
    progress: fillState.fillProgress,
    completed: fillState.status === "full",
  };
}

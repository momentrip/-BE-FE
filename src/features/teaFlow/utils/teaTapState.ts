export type TeaTapAnimationState = {
  phase: "idle" | "animating" | "completed";
  visualStage: 1 | 2 | 3;
};

export const INITIAL_TEA_TAP_ANIMATION_STATE: TeaTapAnimationState = {
  phase: "idle",
  visualStage: 1,
};

export function startTeaTapAnimation(
  previous: TeaTapAnimationState,
): TeaTapAnimationState {
  if (previous.phase !== "idle") {
    return previous;
  }
  return { ...previous, phase: "animating" };
}

export function reachTeaTapVisualStage(
  previous: TeaTapAnimationState,
  visualStage: 2 | 3,
): TeaTapAnimationState {
  if (previous.phase !== "animating" || visualStage <= previous.visualStage) {
    return previous;
  }
  return { ...previous, visualStage };
}

export function completeTeaTapAnimation(
  previous: TeaTapAnimationState,
): TeaTapAnimationState {
  if (previous.phase !== "animating") {
    return previous;
  }
  return { phase: "completed", visualStage: 3 };
}

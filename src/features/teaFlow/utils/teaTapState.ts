export type TeaTapAnimationState = {
  phase: "idle" | "animating" | "completed";
};

export const INITIAL_TEA_TAP_ANIMATION_STATE: TeaTapAnimationState = {
  phase: "idle",
};

export function startTeaTapAnimation(
  previous: TeaTapAnimationState,
): TeaTapAnimationState {
  if (previous.phase !== "idle") {
    return previous;
  }
  return { ...previous, phase: "animating" };
}

export function completeTeaTapAnimation(
  previous: TeaTapAnimationState,
): TeaTapAnimationState {
  if (previous.phase !== "animating") {
    return previous;
  }
  return { phase: "completed" };
}

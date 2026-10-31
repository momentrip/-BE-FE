export type TeaTapAnimationState = {
  phase: "idle" | "animating" | "completed" | "confirmed";
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

export function confirmTeaTapCompletion(
  previous: TeaTapAnimationState,
): TeaTapAnimationState {
  if (previous.phase !== "completed") {
    return previous;
  }
  return { phase: "confirmed" };
}

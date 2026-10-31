export type TeaDrinkingFlowStep =
  | "drinking"
  | "reflectionOne"
  | "reflectionTwo"
  | "reflectionThree"
  | "lightsOut";

const NEXT_STEP_BY_CURRENT: Record<
  Exclude<TeaDrinkingFlowStep, "lightsOut">,
  TeaDrinkingFlowStep
> = {
  drinking: "reflectionOne",
  reflectionOne: "reflectionTwo",
  reflectionTwo: "reflectionThree",
  reflectionThree: "lightsOut",
};

/** S6 세 모금 완료 이후 Figma 5~7페이지의 다음 순서를 반환한다. */
export function getNextTeaDrinkingFlowStep(
  current: TeaDrinkingFlowStep,
): TeaDrinkingFlowStep | null {
  return current === "lightsOut" ? null : NEXT_STEP_BY_CURRENT[current];
}

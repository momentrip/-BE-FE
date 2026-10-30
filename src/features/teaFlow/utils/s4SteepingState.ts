export type S4Step = "intro1" | "intro2" | "breathing" | "done";

export type S4SteepingState = {
  step: S4Step;
};

export type S4SteepingEvent =
  | { type: "advanceIntro" }
  | { type: "startBreathing" }
  | { type: "finishBreathing" }
  | { type: "resetToIntro1" };

export const INITIAL_S4_STEEPING_STATE: S4SteepingState = { step: "intro1" };

/**
 * saveSession 전까지는 로컬 메모리에만 있는 값이라 뒤로가도 안전하다.
 * intro1/intro2는 뒤로가기를 app 라우트(router.back())로 처리해 s3로 나가고,
 * breathing/done은 resetToIntro1로 intro1까지 돌아간다 (breathing의 진행 상태는
 * 컴포넌트 언마운트로 자동 초기화된다).
 */
export function updateS4SteepingState(
  previous: S4SteepingState,
  event: S4SteepingEvent,
): S4SteepingState {
  switch (event.type) {
    case "advanceIntro":
      return previous.step === "intro1" ? { step: "intro2" } : previous;
    case "startBreathing":
      return previous.step === "intro2" ? { step: "breathing" } : previous;
    case "finishBreathing":
      return previous.step === "breathing" ? { step: "done" } : previous;
    case "resetToIntro1":
      return previous.step === "breathing" || previous.step === "done"
        ? { step: "intro1" }
        : previous;
    default:
      return previous;
  }
}

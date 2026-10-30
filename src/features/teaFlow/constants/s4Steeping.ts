export const S4_STEEPING_SETTINGS = {
  /** phase 하나의 기본 길이 (들숨/날숨/멈춤 각각) */
  basePhaseDurationMs: 3000,
  /** 들숨/날숨/멈춤 x 3 cycle */
  totalPhaseCount: 9,
  doubleTapWindowMs: 300,
  /** useImpactShared impactMagnitude 임계값. 실기기 테스트로 0.2~0.3 선에서 반영되는 걸 확인하고 중간값으로 잡음 */
  tiltThreshold: 0.2,
  /** 흔들림 감지 시, 흔들린 그 순간의 phase에만 더해지는 시간 (다른 phase는 영향 없음) */
  tiltPenaltyMs: 2000,
  /** 같은 phase 안에서 연속 트리거되는 것을 막는 쿨다운 */
  tiltCooldownMs: 1500,
  /** phase 하나가 흔들림으로 늘어날 수 있는 최대 연장치 (base 대비 추가분) */
  maxPhaseExtensionMs: 4000,
} as const;

export type S4BreathPhaseType = "inhale" | "exhale" | "pause";

export const S4_BREATH_PHASE_LABEL: Record<S4BreathPhaseType, string> = {
  inhale: "들숨",
  exhale: "날숨",
  pause: "멈춤",
};

/**
 * 수인명 -> 멘트 매핑. quote 쪽 Quote.mudra 필드가 머지되면 그 값으로 조회한다.
 * 지금은 더미값(S4_DEFAULT_MUDRA)으로 고정해 두고, 머지 후 recommendQuote 결과의
 * mudra를 TeaSteepingScreen의 mudraName prop으로 넘기면 된다.
 */
export const S4_MUDRA_MANTRA: Record<string, string> = {
  시무외인: "두려워하지 말라",
  여원인: "그대의 바람이 이루어지기를",
  선정인: "고요히 마음에 머물라",
  항마촉지인: "흔들림 속에서도 중심을 지키라",
  전법륜인: "깨달음의 빛을 나누라",
  합장: "그대 자신에게도 자비를 베풀라",
  지권인: "번뇌 속의 그대도 온전함을 잊지 말라",
  "찻잔 감싸기": "잠시 걱정을 내려놓고 온기에 머물라",
};

export const S4_DEFAULT_MUDRA = "시무외인";

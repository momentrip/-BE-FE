import type { S4BreathPhaseType } from "../constants/s4Steeping";

export type S4BreathPhase = {
  cycleNumber: 1 | 2 | 3;
  phaseType: S4BreathPhaseType;
  phaseIndex: number;
};

const PHASE_SEQUENCE: readonly S4BreathPhaseType[] = ["inhale", "exhale", "pause"];

/** 들숨/날숨/멈춤 x 3 cycle = 9 phase */
export const S4_PHASE_COUNT = PHASE_SEQUENCE.length * 3;

export function getS4PhaseTypeAt(phaseIndex: number): S4BreathPhaseType {
  return PHASE_SEQUENCE[phaseIndex % PHASE_SEQUENCE.length];
}

export function getS4CycleNumberAt(phaseIndex: number): 1 | 2 | 3 {
  return (Math.floor(phaseIndex / PHASE_SEQUENCE.length) + 1) as 1 | 2 | 3;
}

/**
 * 경과 시간과 phase별 길이 배열로 현재 phase를 찾는다.
 * 흔들림으로 특정 phase의 길이만 늘어나도(phaseDurations[i]만 증가) 그 phase에 머무는
 * 시간만 길어지고, 다른 phase 길이·순서는 그대로다.
 * @param elapsedMs breathing 단계 진입 후 경과 시간
 * @param phaseDurations phase 9개 각각의 길이 (ms)
 */
export function getS4BreathPhase(
  elapsedMs: number,
  phaseDurations: readonly number[],
): S4BreathPhase {
  let cumulative = 0;
  for (let index = 0; index < phaseDurations.length; index++) {
    cumulative += phaseDurations[index];
    if (elapsedMs < cumulative || index === phaseDurations.length - 1) {
      return {
        cycleNumber: getS4CycleNumberAt(index),
        phaseType: getS4PhaseTypeAt(index),
        phaseIndex: index,
      };
    }
  }

  const lastIndex = phaseDurations.length - 1;
  return {
    cycleNumber: getS4CycleNumberAt(lastIndex),
    phaseType: getS4PhaseTypeAt(lastIndex),
    phaseIndex: lastIndex,
  };
}

/** phase별 길이 합 대비 경과 비율 (0~1). phase가 늘어나면 분모도 같이 늘어난다. */
export function getS4SteepingProgress(
  elapsedMs: number,
  phaseDurations: readonly number[],
): number {
  const total = phaseDurations.reduce((sum, duration) => sum + duration, 0);
  if (total <= 0) {
    return 1;
  }
  return Math.min(Math.max(elapsedMs / total, 0), 1);
}

/** 남은 시간(ms). phase 길이 합 - 경과 시간, 음수는 0으로 clamp. */
export function getS4RemainingMs(elapsedMs: number, phaseDurations: readonly number[]): number {
  const total = phaseDurations.reduce((sum, duration) => sum + duration, 0);
  return Math.max(total - elapsedMs, 0);
}

/** 남은 시간을 mm:ss 문자열로 포맷한다. */
export function formatS4RemainingTime(remainingMs: number): string {
  const totalSeconds = Math.max(Math.ceil(remainingMs / 1000), 0);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

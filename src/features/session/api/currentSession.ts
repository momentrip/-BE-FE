import type { WorryKind } from '@/shared/constants';
import { detectCrisis } from '@/features/safety';
import type { CurrentSession } from '../types';

// 이번 회차 값은 saveSession 전까지 메모리에만 둔다.
let current: CurrentSession = {
  worryText: null,
  worryKind: null,
  isCrisis: false,
  tea: null,
  quoteId: null,
};

/**
 * 이번 회차에 적은 고민을 저장한다. 새 회차의 시작이라 이전에 저장된 차·명언은 비운다.
 * 위기 표현 감지(safety.detectCrisis)도 여기서 같이 한다.
 * @param text 사용자가 적은 고민 원문
 * @param kind 최종 번뇌 종류 (사용자가 칩을 바꿨으면 바꾼 값)
 * 사용처: worry
 */
export function saveWorry(text: string, kind: WorryKind): void {
  current = {
    worryText: text,
    worryKind: kind,
    isCrisis: detectCrisis(text),
    tea: null,
    quoteId: null,
  };
}

/**
 * 이번 회차에 고른 차를 저장한다.
 * @param tea teaFlow 차 id
 * 사용처: teaFlow
 */
export function saveTea(tea: string): void {
  current = { ...current, tea };
}

/**
 * 이번 회차에 받은 명언을 저장한다.
 * @param quoteId recommendQuote 결과의 quote.id
 * 사용처: zen
 */
export function saveQuote(quoteId: string): void {
  current = { ...current, quoteId };
}

/**
 * 이번 회차에 지금까지 저장된 값을 돌려준다.
 * @returns CurrentSession (저장 안 된 값은 null)
 * 사용처: zen (recommendQuote 입력 만들 때)
 */
export function getCurrentSession(): CurrentSession {
  return { ...current };
}

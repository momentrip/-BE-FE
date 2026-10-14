// TODO(협의): shared에 WorryKind 타입이 생기면 반환 타입을 그 타입으로 바꾼다.

/**
 * 고민 텍스트로 번뇌 종류(worry_kind id)를 고른다. 기기 안에서만 계산하는 순수 함수다.
 * 현재는 임시 구현(stub)으로 항상 'unsure'를 돌려준다.
 * @param text 사용자가 적은 고민
 * @returns worry_kind id. 맞는 종류가 없으면 'unsure'
 * 사용처: worry(고민 적기 화면의 분류 결과)
 */
export function matchWorryKind(_text: string): string {
  return 'unsure';
}

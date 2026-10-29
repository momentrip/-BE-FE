/**
 * 고민 텍스트에 위기 표현이 있는지 판단한다. 기기 안에서만 판단하고 텍스트를 밖으로 보내지 않는다 (AGENTS.md 11장).
 * 지금은 stub이라 항상 false를 돌려준다. 키워드 매칭은 이어서 구현한다.
 * @param text 사용자가 적은 고민 원문
 * @returns 위기 표현이 있으면 true
 * 사용처: worry (109 안내 표시), session (saveWorry에서 isCrisis 저장)
 */
export function detectCrisis(text: string): boolean {
  return false;
}

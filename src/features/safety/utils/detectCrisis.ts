import { CRISIS_KEYWORDS } from './crisisKeywords';

/**
 * 고민 텍스트에 위기 표현이 있는지 판단한다. 기기 안에서만 판단하고 텍스트를 밖으로 보내지 않는다 (AGENTS.md 11장).
 * 띄어쓰기를 지운 텍스트에 CRISIS_KEYWORDS 중 하나라도 들어 있으면 위기로 본다.
 * @param text 사용자가 적은 고민 원문
 * @returns 위기 표현이 있으면 true
 * 사용처: worry (109 안내 표시), session (saveWorry에서 isCrisis 저장)
 */
export function detectCrisis(text: string): boolean {
  const compact = text.replace(/\s+/g, '');
  return CRISIS_KEYWORDS.some((keyword) => compact.includes(keyword));
}

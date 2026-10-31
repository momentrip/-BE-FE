import type { WorryKind } from '@/shared/constants';
import worryModelData from '../data/worryModel.json';
import { WORRY_KEYWORDS, WORRY_KIND_PRIORITY } from './worryKeywords';
import { scoreWorryModel, type WorryModel } from './worryModel';

const worryModel: WorryModel = worryModelData;

/** 띄어쓰기를 무시하고 비교하려고 공백을 모두 지운다. 예: '잠이 안 와' → '잠이안와' */
export function removeSpaces(text: string): string {
  return text.replace(/\s+/g, '');
}

/**
 * 고민 텍스트로 번뇌 종류(worry_kind id)를 고른다. 기기 안에서만 계산하는 순수 함수다.
 * 종류마다 텍스트에 들어 있는 키워드 수를 세어 가장 많은 종류를 고르고, 동점이면 WORRY_KIND_PRIORITY 순서를 따른다.
 * 텍스트와 키워드 모두 띄어쓰기를 무시하고 비교한다.
 * 키워드가 하나도 안 걸리면 예문으로 학습한 점수표(나이브 베이즈)로 고르고, 점수표도 확신이 없으면 'unsure'다.
 * @param text 사용자가 적은 고민
 * @returns worry_kind id. 키워드도 점수표도 고르지 못하면 'unsure'
 * 사용처: worry(고민 적기 화면의 분류 결과)
 */
export function matchWorryKind(text: string): WorryKind {
  const keywordKind = matchByKeywords(text);
  return keywordKind !== 'unsure' ? keywordKind : matchByModel(text);
}

/** 점수표로 고른다. 1등과 2등의 점수 차이가 minMargin보다 작으면 'unsure'. */
function matchByModel(text: string): WorryKind {
  const result = scoreWorryModel(worryModel, text);
  if (!result || result.margin < worryModel.minMargin) return 'unsure';
  return WORRY_KIND_PRIORITY.find((kind) => kind === result.kind) ?? 'unsure';
}

function matchByKeywords(text: string): WorryKind {
  let bestKind: WorryKind = 'unsure';
  let bestScore = 0;
  const compactText = removeSpaces(text);

  for (const kind of WORRY_KIND_PRIORITY) {
    const score = WORRY_KEYWORDS[kind].filter((keyword) =>
      compactText.includes(removeSpaces(keyword)),
    ).length;
    // 같은 점수면 먼저 본(우선순위가 높은) 종류를 유지한다.
    if (score > bestScore) {
      bestKind = kind;
      bestScore = score;
    }
  }

  return bestKind;
}

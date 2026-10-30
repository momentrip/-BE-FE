// 번뇌 분류용 나이브 베이즈 모델의 계산 부분. 앱(matchWorryKind)과 학습 스크립트(scripts/trainWorryModel.mjs)가 같이 쓴다.
// 학습 스크립트가 node로 바로 읽을 수 있도록 이 파일은 다른 파일을 import하지 않는다.

/** 조각 길이. 1~3글자 조각을 쓴다. 여러 조합을 비교해 가장 좋았던 값이다. */
export const NGRAM_SIZES = [1, 2, 3];

/**
 * 학습 결과 점수표 (data/worryModel.json).
 * grams의 값은 종류별 log P(조각 | 종류)에 SCALE을 곱해 반올림한 정수다. 점수표에 없는 조각은 unknown 값을 쓴다.
 */
export type WorryModel = {
  kinds: string[];
  scale: number;
  unknown: number[];
  grams: Record<string, number[]>;
  /** margin이 이 값보다 작으면 확신이 없다고 보고 'unsure'로 둔다. 학습 스크립트가 정한다. */
  minMargin: number;
};

export type WorryModelResult = {
  kind: string;
  /** 1등과 2등의 점수 차이 (log 확률 차이). 클수록 확신이 높다. */
  margin: number;
};

/** 띄어쓰기·문장부호·자음모음(ㅋㅋ, ㅠㅠ)을 지우고 한글·영문·숫자만 남긴다. 예: '잠이 안 와ㅠㅠ' → '잠이안와' */
export function normalizeWorryText(text: string): string {
  return text.toLowerCase().replace(/[^가-힣a-z0-9]/g, '');
}

/** 텍스트를 겹치는 글자 조각으로 자른다. 예: '잠이안와' → ['잠이', '이안', '안와', '잠이안', '이안와'] */
export function toNgrams(text: string): string[] {
  const chars = Array.from(normalizeWorryText(text));
  const grams: string[] = [];
  for (const size of NGRAM_SIZES) {
    for (let i = 0; i + size <= chars.length; i++) {
      grams.push(chars.slice(i, i + size).join(''));
    }
  }
  return grams;
}

/**
 * 점수표로 가장 그럴듯한 종류를 고른다. 종류마다 조각 점수를 더하고, 동점이면 kinds 순서가 앞선 쪽을 고른다.
 * 점수표에 있는 조각이 하나도 없으면 null.
 */
export function scoreWorryModel(model: WorryModel, text: string): WorryModelResult | null {
  const grams = toNgrams(text);
  const totals = model.kinds.map(() => 0);
  let known = 0;

  for (const gram of grams) {
    const scores = model.grams[gram];
    if (scores) known++;
    for (let k = 0; k < totals.length; k++) {
      totals[k] += scores ? scores[k] : model.unknown[k];
    }
  }
  if (known === 0) return null;

  let best = 0;
  let second = -1;
  for (let k = 1; k < totals.length; k++) {
    if (totals[k] > totals[best]) {
      second = best;
      best = k;
    } else if (second === -1 || totals[k] > totals[second]) {
      second = k;
    }
  }

  return {
    kind: model.kinds[best],
    margin: (totals[best] - totals[second]) / model.scale,
  };
}

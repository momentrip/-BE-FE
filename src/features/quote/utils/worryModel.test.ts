import { describe, expect, it } from '@jest/globals';
import worryModelData from '../data/worryModel.json';
import { matchWorryKind } from './matchWorryKind';
import { WORRY_KIND_PRIORITY } from './worryKeywords';
import { normalizeWorryText, scoreWorryModel, toNgrams, type WorryModel } from './worryModel';

const model: WorryModel = worryModelData;

describe('toNgrams', () => {
  it('공백·문장부호·자음모음을 지우고 1~3글자 조각으로 자른다', () => {
    expect(normalizeWorryText('잠이 안 와ㅠㅠ!')).toBe('잠이안와');
    expect(toNgrams('잠이 안')).toEqual(['잠', '이', '안', '잠이', '이안', '잠이안']);
  });
});

describe('scoreWorryModel', () => {
  it('점수표의 종류는 번뇌 종류 7개와 unsure다', () => {
    expect(model.kinds).toEqual([...WORRY_KIND_PRIORITY, 'unsure']);
    expect(model.unknown).toHaveLength(model.kinds.length);
  });

  it('점수표에 있는 조각이 없으면 null을 돌려준다', () => {
    expect(scoreWorryModel(model, '')).toBeNull();
    expect(scoreWorryModel(model, '!!!')).toBeNull();
  });

  it('같은 입력이면 같은 결과를 돌려준다', () => {
    const text = '요즘 너무 우울하고 기운이 없어';
    expect(scoreWorryModel(model, text)).toEqual(scoreWorryModel(model, text));
  });
});

describe('matchWorryKind 점수표 보조', () => {
  it.each([
    ['요즘 너무 우울하고 기운이 없어', 'selfblame_lethargy'],
    ['과자를 한 봉지 다 먹어버렸어', 'wavering_temptation'],
  ])('키워드가 안 걸려도 점수표로 고른다: "%s" → %s', (text, expected) => {
    expect(matchWorryKind(text)).toBe(expected);
  });

  it('키워드가 걸리면 키워드 결과를 쓴다', () => {
    expect(matchWorryKind('친구랑 싸웠는데 아직도 화가 나')).toBe('relationship_anger');
  });
});

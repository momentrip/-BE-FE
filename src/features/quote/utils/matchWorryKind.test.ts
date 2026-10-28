import { describe, expect, it } from '@jest/globals';
import { matchWorryKind } from './matchWorryKind';
import { WORRY_KEYWORDS, WORRY_KIND_PRIORITY } from './worryKeywords';

describe('matchWorryKind', () => {
  it.each([
    ['내일 발표가 너무 걱정돼', 'anxiety_worry'],
    ['머릿속이 복잡하고 잡생각 때문에 잠이 안 와', 'overthinking'],
    ['졸업하면 뭘 해야 할지 진로가 고민이야', 'career_direction'],
    ['친구랑 싸웠는데 아직도 화가 나', 'relationship_anger'],
    ['아무것도 하기 싫고 내가 한심해', 'selfblame_lethargy'],
    ['남들보다 뒤처질까 봐 조급해', 'greed_impatience'],
    ['다이어트 중인데 야식 유혹에 자꾸 흔들려', 'wavering_temptation'],
  ])('"%s" → %s', (text, expected) => {
    expect(matchWorryKind(text)).toBe(expected);
  });

  it('빈 텍스트는 unsure를 돌려준다', () => {
    expect(matchWorryKind('')).toBe('unsure');
  });

  it('맞는 키워드가 없으면 unsure를 돌려준다', () => {
    expect(matchWorryKind('그냥 좀 그래')).toBe('unsure');
  });

  it('키워드가 더 많이 들어 있는 종류를 고른다', () => {
    // anxiety_worry 1개(걱정) vs relationship_anger 2개(친구, 서운)
    expect(matchWorryKind('친구한테 서운한데 말해도 될지 걱정')).toBe('relationship_anger');
  });

  it('점수가 같으면 우선순위가 높은 종류를 고른다', () => {
    // anxiety_worry 1개(걱정) vs career_direction 1개(진로)
    expect(matchWorryKind('진로가 걱정')).toBe('anxiety_worry');
  });

  it('같은 입력이면 같은 결과를 돌려준다', () => {
    const text = '회사 상사 때문에 화나고 이직할까 고민';
    expect(matchWorryKind(text)).toBe(matchWorryKind(text));
  });

  it('키워드 표의 모든 종류가 우선순위 목록에 있다', () => {
    expect([...WORRY_KIND_PRIORITY].sort()).toEqual(Object.keys(WORRY_KEYWORDS).sort());
  });
});

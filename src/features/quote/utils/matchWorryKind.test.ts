import { describe, expect, it } from '@jest/globals';
import { matchWorryKind, removeSpaces } from './matchWorryKind';
import { WORRY_CASES } from './worryCases';
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

  it('한 종류 안에 띄어쓰기만 다른 키워드가 없다 (한 표현이 2점이 되지 않도록)', () => {
    for (const keywords of Object.values(WORRY_KEYWORDS)) {
      const compact = keywords.map(removeSpaces);
      expect(new Set(compact).size).toBe(compact.length);
    }
  });

  it('띄어쓰기를 무시하고 비교한다', () => {
    expect(matchWorryKind('잡생각때문에잠이안와')).toBe('overthinking');
    expect(matchWorryKind('하 기 싫 어')).toBe('selfblame_lethargy');
  });

  it.each([
    ['기술을 배워야 할지 모르겠어'], // '술을'
    ['수술을 앞두고 있어'], // '술을'
    ['영화가 재밌었어'], // '화가'
    ['나만의 시간이 필요해'], // '나만'
  ])('짧은 키워드가 다른 단어에 잘못 걸리지 않는다: "%s" → unsure', (text) => {
    expect(matchWorryKind(text)).toBe('unsure');
  });
});

describe('matchWorryKind 고민 문장 모음', () => {
  it.each(WORRY_CASES)('"%s" → %s', (text, expected) => {
    expect(matchWorryKind(text)).toBe(expected);
  });

  it('붙여 써도 같은 결과가 나온다', () => {
    for (const [text, expected] of WORRY_CASES) {
      expect(matchWorryKind(removeSpaces(text))).toBe(expected);
    }
  });
});

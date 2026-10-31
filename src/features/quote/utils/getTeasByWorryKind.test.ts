import { describe, expect, it } from '@jest/globals';
import { WORRY_KINDS } from '@/shared/constants';
import { TEA_INFO, TEA_NAMES } from '../data/teas';
import { getTeasByWorryKind } from './getTeasByWorryKind';

const names = (worryKind: (typeof WORRY_KINDS)[number], hour: number) =>
  getTeasByWorryKind({ worryKind, hour }).map((tea) => tea.name);

describe('getTeasByWorryKind', () => {
  it('낮에는 피그마 화면대로 번뇌 종류별 차를 모두 돌려준다', () => {
    expect(names('anxiety_worry', 14)).toEqual(['국화차', '둥글레차', '우전 녹차', '백차', '옥수수차']);
    expect(names('career_direction', 14)).toEqual(['오미자차', '구기자차']);
  });

  it('차마다 카페인 여부와 계절 태그를 같이 돌려준다', () => {
    expect(getTeasByWorryKind({ worryKind: 'career_direction', hour: 14 })[0]).toEqual({
      name: '오미자차',
      caffeine: false,
      season: '사계절',
    });
  });

  it.each([21, 23, 0, 4])('밤(%i시)에는 카페인 없는 차만 돌려준다', (hour) => {
    expect(names('anxiety_worry', hour)).toEqual(['국화차', '둥글레차', '옥수수차']);
    expect(names('overthinking', hour)).toEqual(['감잎차']);
  });

  it.each([5, 20])('밤이 아닌 %i시에는 카페인 차도 돌려준다', (hour) => {
    expect(names('overthinking', hour)).toEqual(['세작 녹차', '중작 녹차', '감잎차']);
  });

  it('밤에도 모든 번뇌 종류에 고를 차가 남는다', () => {
    for (const worryKind of WORRY_KINDS) {
      expect(getTeasByWorryKind({ worryKind, hour: 22 }).length).toBeGreaterThan(0);
    }
  });

  it('잘 모르겠어요면 모든 차를 돌려준다', () => {
    expect(names('unsure', 14)).toEqual([...TEA_NAMES]);
  });

  it('잘 모르겠어요를 뺀 7종류에 모든 차가 한 번씩만 들어 있다', () => {
    const assigned = WORRY_KINDS.filter((kind) => kind !== 'unsure').flatMap((kind) => names(kind, 14));
    expect([...assigned].sort()).toEqual([...TEA_NAMES].sort());
  });

  it('모든 차에 카페인·계절 정보가 있다', () => {
    expect(Object.keys(TEA_INFO).sort()).toEqual([...TEA_NAMES].sort());
  });
});

import { describe, expect, it, jest } from "@jest/globals";

import { getTeasByWorryKind } from "@/features/quote";
import type { TeaName } from "@/features/quote";
import { WORRY_KINDS } from "@/shared/constants";

import { getS5TeaColor } from "../utils/getS5TeaColor";
import { getS3TeaOptions } from "./s3TeaOptions";
import {
  getTeaId,
  TEA_ID_TO_NAME,
  TEA_NAME_TO_ID,
} from "./teaIds";

// zen index는 앱 화면 전체를 불러오므로, TeaId -> TeaName -> TEA_COLOR 조회 경로만 확인한다.
jest.mock("@/features/zen", () => ({
  TEA_COLOR: new Proxy({}, {
    get: (_target, name) => `color:${String(name)}`,
  }),
}));

describe("teaFlow tea id mapping", () => {
  it("TeaName 19개를 고유한 TeaId로 변환하고 다시 복원한다", () => {
    const entries = Object.entries(TEA_NAME_TO_ID) as [TeaName, string][];
    const ids = entries.map(([, id]) => id);

    expect(entries).toHaveLength(19);
    expect(new Set(ids).size).toBe(19);
    entries.forEach(([name, id]) => {
      expect(getTeaId(name)).toBe(id);
      expect(TEA_ID_TO_NAME[id as keyof typeof TEA_ID_TO_NAME]).toBe(name);
    });
  });

  it("기존 국화차와 오미자차 id를 유지한다", () => {
    expect(TEA_NAME_TO_ID.국화차).toBe("chrysanthemum");
    expect(TEA_NAME_TO_ID.오미자차).toBe("omija");
  });

  it("TeaId 19개가 차 이름으로 TEA_COLOR를 조회한다", () => {
    Object.entries(TEA_NAME_TO_ID).forEach(([name, id]) => {
      expect(getS5TeaColor(id)).toBe(`color:${name}`);
    });
  });

  it.each([12, 22])("모든 번뇌의 %i시 추천 결과를 S3 option으로 변환한다", (hour) => {
    WORRY_KINDS.forEach((worryKind) => {
      const teas = getTeasByWorryKind({ worryKind, hour });
      const options = getS3TeaOptions(teas);

      expect(options).toHaveLength(teas.length);
      expect(options[0]?.name).toBe(teas[0]?.name);
      teas.forEach((tea, index) => {
        expect(options[index]?.key).toBe(TEA_NAME_TO_ID[tea.name]);
        expect(TEA_ID_TO_NAME[options[index].key]).toBe(tea.name);
        expect(options[index]?.tags).toEqual([
          tea.caffeine ? "카페인" : "무카페인",
          tea.season,
        ]);
      });
    });
  });
});

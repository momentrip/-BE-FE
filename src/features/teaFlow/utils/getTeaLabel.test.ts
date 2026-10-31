import { describe, expect, it } from "@jest/globals";

import { TEA_ID_TO_NAME } from "../data/teaIds";
import { getTeaLabel } from "./getTeaLabel";

describe("getTeaLabel", () => {
  it.each([
    ["omija", "오미자차"],
    ["chrysanthemum", "국화차"],
    ["solomons-seal", "둥굴레차"],
    ["corn-tea", "옥수수수염차"],
  ])("%s id의 화면 표시 이름을 반환한다", (teaId, expected) => {
    expect(getTeaLabel(teaId)).toBe(expected);
  });

  it("등록되지 않은 id는 입력값을 그대로 반환한다", () => {
    expect(getTeaLabel("unknown")).toBe("unknown");
    expect(getTeaLabel("constructor")).toBe("constructor");
  });

  it("TeaId 19개를 모두 표시 이름으로 복원한다", () => {
    expect(Object.entries(TEA_ID_TO_NAME)).toHaveLength(19);
    Object.entries(TEA_ID_TO_NAME).forEach(([teaId, name]) => {
      expect(getTeaLabel(teaId)).toBe(name);
    });
  });
});

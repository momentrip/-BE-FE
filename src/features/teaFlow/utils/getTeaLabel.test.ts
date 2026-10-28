import { describe, expect, it } from "@jest/globals";

import { getTeaLabel } from "./getTeaLabel";

describe("getTeaLabel", () => {
  it.each([
    ["omija", "오미자차"],
    ["chrysanthemum", "국화차"],
  ])("%s id의 화면 표시 이름을 반환한다", (teaId, expected) => {
    expect(getTeaLabel(teaId)).toBe(expected);
  });

  it("등록되지 않은 id는 입력값을 그대로 반환한다", () => {
    expect(getTeaLabel("unknown")).toBe("unknown");
  });
});

import { describe, expect, it, jest } from "@jest/globals";

import { S6_DEFAULT_TEA_COLOR } from "../constants/s6Drinking";
import { getS6TeaColor } from "./getS6TeaColor";

// zen index는 앱 화면 전체를 불러오므로, TeaId -> TeaName -> TEA_COLOR 조회 경로만 확인한다.
jest.mock("@/features/zen", () => ({
  TEA_COLOR: { 대추차: "#6E2C16" },
}));

describe("getS6TeaColor", () => {
  it("TeaId를 차 이름으로 바꿔 TEA_COLOR 색을 찾는다", () => {
    expect(getS6TeaColor("jujube-tea")).toBe("#6E2C16");
  });

  it("차가 없거나 색을 찾지 못하면 S6 기본색을 돌려준다", () => {
    expect(getS6TeaColor(null)).toBe(S6_DEFAULT_TEA_COLOR);
    expect(getS6TeaColor("unknown")).toBe(S6_DEFAULT_TEA_COLOR);
    expect(getS6TeaColor("omija")).toBe(S6_DEFAULT_TEA_COLOR);
  });
});

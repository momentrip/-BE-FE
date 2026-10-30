import { beforeEach, describe, expect, it, jest } from "@jest/globals";

import { saveTea } from "@/features/session";

import {
  INITIAL_TEA_PREPARATION_STATE,
  updateTeaPreparationState,
} from "./teaPreparationState";
import { saveSelectedTea } from "./saveSelectedTea";

jest.mock("@/features/session", () => ({
  saveTea: jest.fn(),
}));

const mockedSaveTea = jest.mocked(saveTea);

describe("saveSelectedTea", () => {
  beforeEach(() => {
    mockedSaveTea.mockClear();
  });

  it.each([
    ["chrysanthemum", "chrysanthemum"],
    ["omija", "omija"],
  ] as const)("%s 최종 확정 시 session에 %s를 저장한다", (teaKey, expected) => {
    saveSelectedTea(teaKey);

    expect(mockedSaveTea).toHaveBeenCalledTimes(1);
    expect(mockedSaveTea).toHaveBeenCalledWith(expected);
  });

  it("bottom sheet에서 선택만 바꾸면 session에는 저장하지 않는다", () => {
    updateTeaPreparationState(INITIAL_TEA_PREPARATION_STATE, {
      type: "selectTea",
      teaKey: "omija",
    });

    expect(mockedSaveTea).not.toHaveBeenCalled();
  });
});

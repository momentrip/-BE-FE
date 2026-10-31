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

  it.each(["chrysanthemum", "omija"] as const)(
    "%s 최종 확정 시 선택한 tea id를 session에 저장한다",
    (teaKey) => {
      saveSelectedTea(teaKey);

      expect(mockedSaveTea).toHaveBeenCalledTimes(1);
      expect(mockedSaveTea).toHaveBeenCalledWith(teaKey);
    },
  );

  it("bottom sheet에서 선택만 바꾸면 저장하지 않는다", () => {
    updateTeaPreparationState(INITIAL_TEA_PREPARATION_STATE, {
      type: "selectTea",
      teaKey: "omija",
    });

    expect(mockedSaveTea).not.toHaveBeenCalled();
  });
});

import { describe, expect, it } from "@jest/globals";

import { getTeasByWorryKind } from "@/features/quote";

import { getS3TeaOptions } from "../data/s3TeaOptions";
import {
  INITIAL_TEA_PREPARATION_STATE,
  updateTeaPreparationState,
} from "./teaPreparationState";

describe("updateTeaPreparationState", () => {
  it("차 선택 sheet를 열고 닫는다", () => {
    const opened = updateTeaPreparationState(INITIAL_TEA_PREPARATION_STATE, {
      type: "openOptions",
    });
    expect(opened.optionsOpen).toBe(true);
    expect(updateTeaPreparationState(opened, { type: "closeOptions" }).optionsOpen).toBe(false);
  });

  it("차를 바꾸면 선택 key가 변경되고 안내 popup으로 진행한다", () => {
    const selected = updateTeaPreparationState(INITIAL_TEA_PREPARATION_STATE, {
      type: "selectTea",
      teaKey: "omija",
    });
    const confirmed = updateTeaPreparationState(selected, { type: "confirmTea" });

    expect(selected.selectedTeaKey).toBe("omija");
    expect(confirmed.phase).toBe("sensorGuide");
  });

  it("permission 결과와 무관한 화면 tapping 단계로 진행한다", () => {
    const tapping = updateTeaPreparationState(INITIAL_TEA_PREPARATION_STATE, {
      type: "startTapping",
    });

    expect(tapping.phase).toBe("tapping");
  });

  it("3회 완료 후 completed로 전환한다", () => {
    expect(updateTeaPreparationState(INITIAL_TEA_PREPARATION_STATE, {
      type: "complete",
    }).phase).toBe("completed");
  });
});

describe("getS3TeaOptions", () => {
  const allTeaOptions = getS3TeaOptions(
    getTeasByWorryKind({ worryKind: "unsure", hour: 12 }),
  );

  it("차 종류별 display data와 내부 content image를 각각 제공한다", () => {
    const chrysanthemum = allTeaOptions.find((tea) => tea.key === "chrysanthemum");
    const omija = allTeaOptions.find((tea) => tea.key === "omija");

    expect(chrysanthemum).toBeDefined();
    expect(omija).toBeDefined();

    if (!chrysanthemum || !omija) {
      return;
    }

    expect(chrysanthemum.name).not.toBe(omija.name);
    expect(chrysanthemum.description).not.toBe(omija.description);
    expect(chrysanthemum.teaContentImage).not.toBe(omija.teaContentImage);
    expect(chrysanthemum.glowColor).not.toEqual(omija.glowColor);
    expect(chrysanthemum.glowColor).toEqual({
      primary: "#FFE75E",
      secondary: "#ECC218",
      edge: "#745508",
    });
    expect(omija.glowColor).toEqual({
      primary: "#EF5D62",
      secondary: "#D9353F",
      edge: "#6F1820",
    });
  });

  it("19개 차를 제공하고 asset 없는 차는 공통 shell만 사용할 수 있다", () => {
    expect(allTeaOptions).toHaveLength(19);
    expect(allTeaOptions.find((tea) => tea.key === "solomons-seal")?.teaContentImage)
      .toBeUndefined();
  });
});

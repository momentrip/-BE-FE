import { describe, expect, it } from "@jest/globals";

import { S3_TEA_OPTIONS } from "../data/s3TeaOptions";
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

  it.each(["sensor", "fallback"] as const)("%s 방식으로 tapping을 시작한다", (mode) => {
    const tapping = updateTeaPreparationState(INITIAL_TEA_PREPARATION_STATE, {
      type: "startTapping",
      mode,
    });

    expect(tapping.phase).toBe("tapping");
    expect(tapping.interactionMode).toBe(mode);
  });

  it("3회 완료 후 completed로 전환한다", () => {
    expect(updateTeaPreparationState(INITIAL_TEA_PREPARATION_STATE, {
      type: "complete",
    }).phase).toBe("completed");
  });
});

describe("S3_TEA_OPTIONS", () => {
  it("차 종류별 display data와 내부 content image를 각각 제공한다", () => {
    const [chrysanthemum, omija] = S3_TEA_OPTIONS;

    expect(chrysanthemum.name).not.toBe(omija.name);
    expect(chrysanthemum.description).not.toBe(omija.description);
    expect(chrysanthemum.teaContentImage).not.toBe(omija.teaContentImage);
  });
});

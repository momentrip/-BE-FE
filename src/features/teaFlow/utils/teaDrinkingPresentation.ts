import type {
  TeaDrinkingCalibrationStatus,
  TeaDrinkingState,
} from "../hooks/useTeaDrinking";
import { S6_LANTERN_TOP_BY_SIP_COUNT } from "../constants/s6Drinking";

type TeaDrinkingPresentationParams = Pick<
  TeaDrinkingState,
  "sipCount" | "status"
> & {
  calibrationStatus: TeaDrinkingCalibrationStatus;
};

export type TeaDrinkingPresentation = {
  instruction: string;
  lanternTop: number;
};

/** S6 센서 상태를 Figma 열반 1~4 화면의 문구와 등불 위치로 변환한다. */
export function getTeaDrinkingPresentation({
  calibrationStatus,
  sipCount,
  status,
}: TeaDrinkingPresentationParams): TeaDrinkingPresentation {
  if (calibrationStatus === "calibrating") {
    return {
      instruction: "센서를 준비하고 있어요",
      lanternTop: S6_LANTERN_TOP_BY_SIP_COUNT[sipCount],
    };
  }

  if (calibrationStatus === "unavailable" || calibrationStatus === "error") {
    return {
      instruction: "동작 센서를 사용할 수 없어요",
      lanternTop: S6_LANTERN_TOP_BY_SIP_COUNT[sipCount],
    };
  }

  if (status === "drinking" || status === "returning") {
    return {
      instruction: "천천히 원래 자세로 돌아오세요",
      lanternTop: S6_LANTERN_TOP_BY_SIP_COUNT[sipCount],
    };
  }

  if (status === "cooldown") {
    return {
      instruction: "잠시 그대로 머물러 주세요",
      lanternTop: S6_LANTERN_TOP_BY_SIP_COUNT[sipCount],
    };
  }

  const instructionBySipCount = {
    0: "폰을 입가로 천천히 기울여 첫 모금",
    1: "폰을 입가로 천천히 기울여 두 번째 모금",
    2: "폰을 입가로 천천히 기울여 마지막 모금",
    3: "세 모금을 모두 마셨어요",
  } as const;

  return {
    instruction: instructionBySipCount[sipCount],
    lanternTop: S6_LANTERN_TOP_BY_SIP_COUNT[sipCount],
  };
}

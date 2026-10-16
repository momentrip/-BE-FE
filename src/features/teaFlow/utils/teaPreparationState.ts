import type { S3TeaDisplayData } from "../data/s3TeaOptions";

export type TeaPreparationPhase =
  | "teaSelected"
  | "sensorGuide"
  | "tapping"
  | "completed";

export type TeaPreparationState = {
  optionsOpen: boolean;
  phase: TeaPreparationPhase;
  selectedTeaKey: S3TeaDisplayData["key"];
};

export type TeaPreparationEvent =
  | { type: "openOptions" }
  | { type: "closeOptions" }
  | { type: "selectTea"; teaKey: S3TeaDisplayData["key"] }
  | { type: "confirmTea" }
  | { type: "startTapping" }
  | { type: "complete" };

export const INITIAL_TEA_PREPARATION_STATE: TeaPreparationState = {
  optionsOpen: false,
  phase: "teaSelected",
  selectedTeaKey: "chrysanthemum",
};

export function updateTeaPreparationState(
  previous: TeaPreparationState,
  event: TeaPreparationEvent,
): TeaPreparationState {
  switch (event.type) {
    case "openOptions":
      return { ...previous, optionsOpen: true };
    case "closeOptions":
      return { ...previous, optionsOpen: false };
    case "selectTea":
      return { ...previous, selectedTeaKey: event.teaKey };
    case "confirmTea":
      return { ...previous, optionsOpen: false, phase: "sensorGuide" };
    case "startTapping":
      return { ...previous, phase: "tapping" };
    case "complete":
      return { ...previous, phase: "completed" };
  }
}

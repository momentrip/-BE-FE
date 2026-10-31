/**
 * S5 화면 검증용 임시 채우기 시간.
 * 최종 기획값이 확정되면 이 값만 교체한다.
 */
export const S5_TEMPORARY_FILL_DURATION_MS = 12_000;

export const S5_PROGRESS_UPDATE_INTERVAL_MS = 100;

/** S5 완료 화면을 확인한 뒤 다음 차 마시기 화면으로 넘어가기 전 유지 시간. */
export const S5_COMPLETED_DISPLAY_DURATION_MS = 3000;

/** 추천 차 데이터가 연결되기 전 사용하는 Figma 기준 액체 색상. */
export const S5_DEFAULT_TEA_COLOR = "#8b8c5b";

/** 차 종류와 무관하게 유지되는 Figma 기준 찻잔 색상. */
export const S5_CUP_COLORS = {
  body: "#3e4a50",
  rim: "#69777e",
  completedUpperBody: "#6c7b83",
} as const;

/** progress 1 및 completed 상태에서 사용하는 액체의 최종 농도. */
export const S5_LIQUID_MAX_OPACITY = 0.65;

import type { WorryKind } from "@/shared/constants";

/**
 * 번뇌 종류별 카테고리 점 그라데이션 (안쪽 → 바깥쪽).
 * 사용처: home (풍등 상세 모달), zen (선어 확인 태그 점)
 */
export const WORRY_KIND_DOT_COLOR: Record<WorryKind, { inner: string; outer: string }> = {
  greed_impatience: { inner: "#FFE2B0", outer: "#E0A050" },
  wavering_temptation: { inner: "#EEF0C8", outer: "#4E5A2E" },
  relationship_anger: { inner: "#FFD288", outer: "#D0704A" },
  selfblame_lethargy: { inner: "#FFEDE8", outer: "#EDB8B0" },
  anxiety_worry: { inner: "#FFF4C8", outer: "#EFCB66" },
  overthinking: { inner: "#F2F6D0", outer: "#C4D278" },
  career_direction: { inner: "#FFD6D2", outer: "#E0605C" },
  unsure: { inner: "#FFFFF0", outer: "#E6EAC4" },
};

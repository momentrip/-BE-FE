import type { WorryKind } from "@/shared/constants";

/**
 * 번뇌 8유형 → 우림(찻잔 선반) 배경색. Figma s8 "오늘의 찻잔3" 선반 칸 색 기준.
 * 사용처: zen, collection
 */
export const WORRY_KIND_BREW_COLOR: Record<WorryKind, string> = {
  greed_impatience: "#C98A3A",
  wavering_temptation: "#6E7A3E",
  relationship_anger: "#8A3E22",
  selfblame_lethargy: "#E3C3A8",
  anxiety_worry: "#E3C56A",
  overthinking: "#B9C96A",
  career_direction: "#C2413F",
  unsure: "#E2E6B8",
};

/** 차 이름(getTeaLabel 결과) → 태그 점 색. 매핑에 없는 차는 TEA_COLOR_FALLBACK을 쓴다. 사용처: zen, collection */
export const TEA_COLOR: Record<string, string> = {
  국화차: "#C8A040",
  둥굴레차: "#E2C27A",
  "세작 녹차": "#8EA048",
  "중작 녹차": "#7E9440",
  감잎차: "#A6A04A",
  오미자차: "#9A2C2C",
  구기자차: "#B0482E",
  황차: "#A86A28",
  잭살차: "#8E5A26",
  우엉차: "#7A5430",
  쑥차: "#5A6430",
  뽕잎차: "#66703A",
  대추차: "#6E2C16",
  쌍화차: "#5A2614",
  연꽃차: "#C8A090",
  매화차: "#D8B8A8",
  "우전 녹차": "#C4CC90",
  백차: "#CFC690",
  옥수수수염차: "#C8B868",
};

export const TEA_COLOR_FALLBACK = "#C9BC9F";

/** "마신 잔"/"모은 구절" 표시 분모. 디자인 시안 값 그대로 고정. 사용처: zen, collection */
export const ZEN_STAT_DENOMINATOR = 16;

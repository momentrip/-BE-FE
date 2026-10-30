import type { WorryKind } from "@/shared/constants";

/** 오늘 날린 풍등 한 건 (내 것 포함, 다른 사용자 것 포함). */
export type LanternFeedItem = {
  id: number;
  /** ISO 8601 (UTC) */
  createdAt: string;
  worryKind: WorryKind;
  /** teaFlow 도메인이 정한 차 id */
  tea: string;
};

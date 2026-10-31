import { saveTea } from "@/features/session";

import type { S3TeaDisplayData } from "../data/s3TeaOptions";

/** S3에서 사용자가 최종 확정한 차 id를 현재 session에 저장한다. */
export function saveSelectedTea(teaKey: S3TeaDisplayData["key"]): void {
  saveTea(teaKey);
}

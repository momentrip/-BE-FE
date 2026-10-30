import { saveTea } from "@/features/session";

import type { S3TeaDisplayData } from "../data/s3TeaOptions";

export function saveSelectedTea(teaKey: S3TeaDisplayData["key"]): void {
  saveTea(teaKey);
}

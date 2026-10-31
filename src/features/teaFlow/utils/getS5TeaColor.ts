import { TEA_COLOR } from "@/features/zen";

import { S5_DEFAULT_TEA_COLOR } from "../constants/s5Pouring";
import { getTeaLabel } from "./getTeaLabel";

/**
 * 차 id로 s5(차 따르기) 액체·물줄기 색을 찾는다. zen이 공개한 TEA_COLOR(차 이름 -> 색)
 * 매핑을 그대로 재사용한다.
 * @param teaId teaFlow에서 사용하는 차 id. null이거나 매핑에 없으면 Figma 기준 기본색을 돌려준다.
 * @returns 액체 색상 hex
 */
export function getS5TeaColor(teaId: string | null): string {
  if (teaId === null) {
    return S5_DEFAULT_TEA_COLOR;
  }
  return TEA_COLOR[getTeaLabel(teaId)] ?? S5_DEFAULT_TEA_COLOR;
}

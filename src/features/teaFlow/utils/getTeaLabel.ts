import { TEA_ID_TO_NAME } from "../data/teaIds";
import type { TeaId } from "../data/teaIds";

/**
 * 차 id를 화면에 표시할 차 이름으로 변환한다.
 * @param teaId teaFlow에서 사용하는 차 id
 * @returns 등록된 차 이름. 등록되지 않은 id는 입력값을 그대로 반환한다.
 * 사용처: home 풍등 상세 모달
 */
export function getTeaLabel(teaId: string): string {
  // "constructor" 같은 Object prototype 키가 차 이름으로 잡히지 않도록 자체 키만 찾는다.
  return Object.prototype.hasOwnProperty.call(TEA_ID_TO_NAME, teaId)
    ? TEA_ID_TO_NAME[teaId as TeaId]
    : teaId;
}

import { S3_TEA_OPTIONS } from "../data/s3TeaOptions";

/**
 * 차 id를 화면에 표시할 차 이름으로 변환한다.
 * @param teaId teaFlow에서 사용하는 차 id
 * @returns 등록된 차 이름. 등록되지 않은 id는 입력값을 그대로 반환한다.
 * 사용처: home 풍등 상세 모달
 */
export function getTeaLabel(teaId: string): string {
  return S3_TEA_OPTIONS.find((tea) => tea.key === teaId)?.name ?? teaId;
}

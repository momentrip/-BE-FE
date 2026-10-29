export type LanternPosition = {
  top: number;
  left: number;
  width: number;
  height: number;
};

// Figma s1("번뇌 날리기(처음)", node 384:2005)의 풍등 16개 좌표·크기를 그대로 옮김.
// 화면마다 달라지면 안 되므로(시연 재현성) 랜덤이 아니라 고정 좌표를 쓴다.
// 풍등이 적을 때도 크고 작은 게 고루 보이도록 큰 것부터(가까운 순) 정렬해둔다.
const LANTERN_SLOTS: readonly LanternPosition[] = [
  { top: 339, left: 222, width: 53.03, height: 72 },
  { top: 441, left: 80, width: 53.03, height: 72 },
  { top: 426, left: 262, width: 43.46, height: 59 },
  { top: 313, left: 287, width: 36.09, height: 49 },
  { top: 326, left: 54, width: 36.09, height: 49 },
  { top: 126, left: 182, width: 32.41, height: 44 },
  { top: 170, left: 90, width: 32.41, height: 44 },
  { top: 204, left: 297, width: 32.41, height: 44 },
  { top: 260, left: 166, width: 25, height: 33.94 },
  { top: 351, left: 114, width: 20, height: 27.15 },
  { top: 104, left: 297, width: 16.2, height: 22 },
  { top: 126, left: 72, width: 16.2, height: 22 },
  { top: 304, left: 206, width: 16.2, height: 22 },
  { top: 375, left: 321, width: 16.2, height: 22 },
  { top: 411, left: 136, width: 16.2, height: 22 },
  { top: 170, left: 254, width: 9.58, height: 13 },
];

export const MAX_VISIBLE_LANTERNS = LANTERN_SLOTS.length;

/**
 * 풍등 n번째(0부터 시작)가 풍등 밭 안에서 보일 고정 위치·크기를 돌려준다.
 * 자리 수(16개)를 넘으면 마지막 자리를 돌려준다 — 밭이 넘치는 건 숫자 텍스트로만 표시한다.
 */
export function getLanternSlotPosition(index: number): LanternPosition {
  return LANTERN_SLOTS[Math.min(index, LANTERN_SLOTS.length - 1)];
}

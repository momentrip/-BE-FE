/** Figma s9 "찻잔 도감" 선반 칸 좌표 (4행 × 4열, 위에서부터 채워진다). s8보다 찻잔이 크다(61×61). */
export type CollectionShelfSlot = { top: number; left: number; boardTop: number };

/** 각 행 바로 아래에 깔린 선반 널빤지(Gradient bar)의 y좌표. */
const SHELF_BOARD_TOPS = [243, 354, 466, 578] as const;

const ROW_TOPS = [174, 283, 395, 509] as const;
const COLUMN_LEFTS = [40, 121, 202, 283] as const;

export const COLLECTION_SHELF_SLOTS: readonly CollectionShelfSlot[] = ROW_TOPS.flatMap((top, rowIndex) =>
  COLUMN_LEFTS.map((left) => ({ top, left, boardTop: SHELF_BOARD_TOPS[rowIndex] })),
);

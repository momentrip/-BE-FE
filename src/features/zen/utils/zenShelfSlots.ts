/** Figma s8 "오늘의 찻잔3" 선반 칸 좌표 (4행 × 4열, 위에서부터 채워진다). */
export type ZenShelfSlot = { top: number; left: number; boardTop: number };

/** 각 행 바로 아래에 깔린 선반 널빤지(Gradient bar)의 y좌표. */
const SHELF_BOARD_TOPS = [208, 295, 383, 470] as const;

const ROW_TOPS = [154, 239, 327, 416] as const;
const COLUMN_LEFTS = [74, 137, 201, 264] as const;

export const ZEN_SHELF_SLOTS: readonly ZenShelfSlot[] = ROW_TOPS.flatMap((top, rowIndex) =>
  COLUMN_LEFTS.map((left) => ({ top, left, boardTop: SHELF_BOARD_TOPS[rowIndex] })),
);

/** 찻물에 섞을 어두운 갈색. 검정보다 따뜻해서 녹차·붉은 차 모두 탁해지지 않는다. */
const POURING_SHADE_CHANNELS = [46, 35, 24] as const;
const POURING_SHADE_RATIO = 0.18;

const HEX_COLOR_PATTERN = /^#[0-9a-f]{6}$/i;

/**
 * S5 물줄기와 따르는 중 찻잔 액체에 쓸 색을 만든다. 모든 차에 같은 어두운 갈색을 같은 비율로
 * 섞으므로 차 사이의 색 관계는 유지된다.
 * @param baseColor `#RRGGBB` 형식의 찻물 색. 형식이 다르면 그대로 돌려준다.
 * @returns 따르는 동안 그릴 `#RRGGBB` 색
 */
export function getS5PouringLiquidColor(baseColor: string): string {
  if (!HEX_COLOR_PATTERN.test(baseColor)) {
    return baseColor;
  }

  const channels = POURING_SHADE_CHANNELS.map((shade, index) => {
    const start = 1 + index * 2;
    const channel = Number.parseInt(baseColor.slice(start, start + 2), 16);
    const mixed = channel * (1 - POURING_SHADE_RATIO) + shade * POURING_SHADE_RATIO;
    return Math.round(mixed).toString(16).padStart(2, "0");
  });

  return `#${channels.join("")}`.toUpperCase();
}

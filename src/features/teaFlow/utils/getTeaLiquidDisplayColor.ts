const SATURATION_SCALE = 0.8;
/** 원래 채도가 낮은 차(연꽃차, 매화차 등)가 회색으로 죽지 않도록 이 값까지는 낮추지 않는다. */
const MIN_SCALED_SATURATION = 0.28;
const LIGHTNESS_SCALE = 0.92;
/** 어두운 차(대추차, 쌍화차)가 검게 뭉치지 않도록 이 값까지는 낮추지 않는다. */
const MIN_SCALED_LIGHTNESS = 0.24;
/** 순수한 빨강에 가까울수록 호박색 쪽으로 더 많이 옮긴다. 범위 밖의 색상(hue)은 그대로 둔다. */
const RED_HUE_RANGE_DEGREES = 30;
const RED_HUE_SHIFT_DEGREES = 12;

const HEX_COLOR_PATTERN = /^#[0-9a-f]{6}$/i;

type Hsl = {
  hue: number;
  lightness: number;
  saturation: number;
};

function hexToHsl(hex: string): Hsl {
  const red = Number.parseInt(hex.slice(1, 3), 16) / 255;
  const green = Number.parseInt(hex.slice(3, 5), 16) / 255;
  const blue = Number.parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const delta = max - min;
  const lightness = (max + min) / 2;

  if (delta === 0) {
    return { hue: 0, lightness, saturation: 0 };
  }

  const saturation = delta / (1 - Math.abs(2 * lightness - 1));
  let hue: number;
  if (max === red) {
    hue = ((green - blue) / delta + 6) % 6;
  } else if (max === green) {
    hue = (blue - red) / delta + 2;
  } else {
    hue = (red - green) / delta + 4;
  }

  return { hue: hue * 60, lightness, saturation };
}

function hslToHex({ hue, lightness, saturation }: Hsl): string {
  const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation;
  const channel = (offset: number) => {
    const position = (offset + hue / 30) % 12;
    const value = lightness - (chroma / 2) * Math.max(-1, Math.min(position - 3, 9 - position, 1));
    return Math.round(value * 255).toString(16).padStart(2, "0");
  };

  return `#${channel(0)}${channel(8)}${channel(4)}`.toUpperCase();
}

function shiftRedHueTowardAmber(hue: number): number {
  const signedHue = hue > 180 ? hue - 360 : hue;
  const redDistance = Math.abs(signedHue);
  if (redDistance >= RED_HUE_RANGE_DEGREES) {
    return hue;
  }

  const shift = RED_HUE_SHIFT_DEGREES * (1 - redDistance / RED_HUE_RANGE_DEGREES);
  return (signedHue + shift + 360) % 360;
}

/**
 * TEA_COLOR 같은 원본 색을 찻잔·물줄기에 그릴 "우러난 찻물" 색으로 바꾼다.
 * 채도와 밝기를 낮추고 빨강을 호박색 쪽으로 옮기되, 차 종류별 색 차이는 유지한다.
 * @param color `#RRGGBB` 형식의 원본 색. 형식이 다르면 그대로 돌려준다.
 * @returns 액체 렌더링용 `#RRGGBB` 색
 */
export function getTeaLiquidDisplayColor(color: string): string {
  if (!HEX_COLOR_PATTERN.test(color)) {
    return color;
  }

  const { hue, lightness, saturation } = hexToHsl(color);

  return hslToHex({
    hue: shiftRedHueTowardAmber(hue),
    lightness: Math.max(lightness * LIGHTNESS_SCALE, Math.min(lightness, MIN_SCALED_LIGHTNESS)),
    saturation: Math.max(saturation * SATURATION_SCALE, Math.min(saturation, MIN_SCALED_SATURATION)),
  });
}

import { Canvas, Circle, Group, Path } from "@shopify/react-native-skia";
import { useEffect } from "react";
import { StyleSheet } from "react-native";
import type { SharedValue } from "react-native-reanimated";
import {
  Easing,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

import type { TeaPouringStatus } from "../utils/zTwistState";

const CANVAS_LEFT = 90;
const CANVAS_TOP = 280;
const CANVAS_WIDTH = 90;
const CANVAS_HEIGHT = 200;

/** 다관 주둥이 끝 좌표(화면 기준, status별로 다름. s5-teapot.png 알파 분석 + rotation 계산값). */
const SPOUT_TIP: Record<"pouring" | "tooFast", { x: number; y: number }> = {
  pouring: { x: 142, y: 310 },
  tooFast: { x: 147, y: 332 },
};

/** 작은 찻잔 입구 중심(화면 기준). smallCupLiquidClip 위치와 같다. */
const CUP_OPENING = { x: 113, y: 469 };

type DropletProps = {
  progress: SharedValue<number>;
  from: { x: number; y: number };
  to: { x: number; y: number };
  color: string;
};

function Droplet({ progress, from, to, color }: DropletProps) {
  const cx = useDerivedValue(() => from.x + (to.x - from.x) * progress.value);
  const cy = useDerivedValue(() => from.y + (to.y - from.y) * progress.value);
  const r = useDerivedValue(() => 3.5 - Math.abs(progress.value - 0.5) * 2);
  const opacity = useDerivedValue(() => 1 - progress.value * 0.3);

  return <Circle cx={cx} cy={cy} r={r} color={color} opacity={opacity} />;
}

export type S5WaterStreamProps = {
  status: TeaPouringStatus;
  teaColor: string;
};

/**
 * 다관 주둥이에서 찻잔으로 떨어지는 물줄기 애니메이션. 시안에는 없는 연출이라
 * PM 승인 하에 추가했다(AGENTS.md 7장). status가 idle이면 아무것도 그리지 않는다.
 * 로직(기울기 판정, progress 계산)은 건드리지 않고 시각 효과만 얹는다.
 */
export function S5WaterStream({ status, teaColor }: S5WaterStreamProps) {
  const droplet1 = useSharedValue(0);
  const droplet2 = useSharedValue(0.33);
  const droplet3 = useSharedValue(0.66);

  const visible = status === "pouring" || status === "tooFast";
  const speedMs = status === "tooFast" ? 260 : 420;

  useEffect(() => {
    if (!visible) {
      return;
    }
    droplet1.value = withRepeat(withTiming(1, { duration: speedMs, easing: Easing.linear }), -1, false);
    droplet2.value = withRepeat(withTiming(1, { duration: speedMs, easing: Easing.linear }), -1, false);
    droplet3.value = withRepeat(withTiming(1, { duration: speedMs, easing: Easing.linear }), -1, false);
  }, [visible, speedMs, droplet1, droplet2, droplet3]);

  if (!visible) {
    return null;
  }

  const spout = SPOUT_TIP[status];
  const streamPath = `M${spout.x - CANVAS_LEFT} ${spout.y - CANVAS_TOP} L${CUP_OPENING.x - CANVAS_LEFT} ${CUP_OPENING.y - CANVAS_TOP}`;

  return (
    <Canvas style={styles.canvas}>
      <Group>
        <Path path={streamPath} color={teaColor} style="stroke" strokeWidth={2.6} opacity={0.4} />
        <Droplet
          progress={droplet1}
          from={{ x: spout.x - CANVAS_LEFT, y: spout.y - CANVAS_TOP }}
          to={{ x: CUP_OPENING.x - CANVAS_LEFT, y: CUP_OPENING.y - CANVAS_TOP }}
          color={teaColor}
        />
        <Droplet
          progress={droplet2}
          from={{ x: spout.x - CANVAS_LEFT, y: spout.y - CANVAS_TOP }}
          to={{ x: CUP_OPENING.x - CANVAS_LEFT, y: CUP_OPENING.y - CANVAS_TOP }}
          color={teaColor}
        />
        <Droplet
          progress={droplet3}
          from={{ x: spout.x - CANVAS_LEFT, y: spout.y - CANVAS_TOP }}
          to={{ x: CUP_OPENING.x - CANVAS_LEFT, y: CUP_OPENING.y - CANVAS_TOP }}
          color={teaColor}
        />
      </Group>
    </Canvas>
  );
}

const styles = StyleSheet.create({
  canvas: {
    position: "absolute",
    left: CANVAS_LEFT,
    top: CANVAS_TOP,
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT,
  },
});

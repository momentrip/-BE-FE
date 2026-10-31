import type { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { Canvas, Circle, Oval, RadialGradient, vec } from "@shopify/react-native-skia";

import { RING_LEFT, RING_SIZE, RING_TOP } from "./s4Layout";

/** 수인을 감싸는 원형 테두리 + 은은한 글로우. 비어있으면 intro 화면, children이 있으면 수인 이미지를 담는다. */
export function S4MudraRing({ children }: { children?: ReactNode }) {
  const center = RING_SIZE / 2;
  const glowSize = 255;
  const glowOffset = (RING_SIZE - glowSize) / 2;

  return (
    <View style={styles.ringBox}>
      <Canvas style={styles.ringCanvas}>
        <Circle
          color="rgba(239,203,102,0.08)"
          cx={center}
          cy={center}
          r={center - 1}
          style="stroke"
          strokeWidth={1.15}
        />
        <Oval height={glowSize} width={glowSize} x={glowOffset} y={glowOffset}>
          <RadialGradient
            c={vec(glowSize / 2, glowSize / 2)}
            colors={["rgba(239,203,102,0.12)", "rgba(239,203,102,0)"]}
            r={glowSize / 2}
          />
        </Oval>
        <Circle
          color="rgba(239,203,102,0.25)"
          cx={center}
          cy={center}
          r={glowSize / 2}
          style="stroke"
          strokeWidth={1.15}
        />
      </Canvas>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  ringBox: {
    position: "absolute",
    left: RING_LEFT,
    top: RING_TOP,
    width: RING_SIZE,
    height: RING_SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
  ringCanvas: {
    position: "absolute",
    width: RING_SIZE,
    height: RING_SIZE,
  },
});

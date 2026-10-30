import { StyleSheet, Text, View } from "react-native";
import { Canvas, LinearGradient, RoundedRect, vec } from "@shopify/react-native-skia";

import { fontFamily } from "@/shared/theme";

import { formatS4RemainingTime } from "../utils/s4Breathing";
import { DESIGN_WIDTH } from "./s4Layout";

const BAR_WIDTH = 300;

type S4ProgressBarProps = {
  progress: number;
  /** 남은 시간(ms). 흔들림 센서가 실제로 시간을 늘리고 있는지 눈으로 확인하는 용도. 없으면 안 보여준다. */
  remainingMs?: number;
  teaLabel: string;
};

/** "{차}가 우러나는 중 · mm:ss" 라벨 + 진행바 + 흔들림 안내 캡션. progress는 phase 길이 합 대비 비율(0~1). */
export function S4ProgressBar({ progress, remainingMs, teaLabel }: S4ProgressBarProps) {
  const filledWidth = Math.max(BAR_WIDTH * progress, 0);

  return (
    <>
      <Text style={styles.progressLabel}>
        {teaLabel}가 우러나는 중
        {remainingMs !== undefined ? ` · ${formatS4RemainingTime(remainingMs)}` : ""}
      </Text>
      <View style={styles.progressTrack}>
        <Canvas style={styles.progressCanvas}>
          <RoundedRect height={8} r={4} width={filledWidth} x={0} y={0}>
            <LinearGradient
              colors={["#405a20", "#afc840", "#c6c6c6"]}
              end={vec(BAR_WIDTH, 4)}
              start={vec(0, 4)}
            />
          </RoundedRect>
        </Canvas>
      </View>
      <Text style={styles.progressCaption}>움직이면 찻물이 흔들려 시간이 늘어나요</Text>
    </>
  );
}

const styles = StyleSheet.create({
  progressLabel: {
    position: "absolute",
    top: 709,
    left: 45,
    color: "#d9c9a0",
    fontFamily: fontFamily.pretendardSemiBold,
    fontSize: 12,
  },
  progressTrack: {
    position: "absolute",
    top: 735,
    left: 45,
    width: BAR_WIDTH,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#2a2518",
    overflow: "hidden",
  },
  progressCanvas: {
    width: BAR_WIDTH,
    height: 8,
  },
  progressCaption: {
    position: "absolute",
    top: 758,
    left: 0,
    width: DESIGN_WIDTH,
    textAlign: "center",
    color: "#adadad",
    fontFamily: fontFamily.pretendardMedium,
    fontSize: 11,
  },
});

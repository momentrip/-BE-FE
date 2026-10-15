import { Image, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { StatusBar } from "expo-status-bar";

import { fontFamily } from "@/shared/theme";

import { S5_DEFAULT_TEA_COLOR } from "../constants/s5Pouring";
import { useS5PouringProgress } from "../hooks/useS5PouringProgress";
import { useTeaPouring } from "../hooks/useTeaPouring";
import { Z_TWIST_THRESHOLDS } from "../utils/pouringThresholds";
import { getS5EffectivePouringState } from "../utils/s5PouringState";
import type { TeaPouringStatus } from "../utils/zTwistState";

const DESIGN_WIDTH = 393;
const DESIGN_HEIGHT = 852;
const ANGLE_BAR_LEFT = 65;
const ANGLE_BAR_WIDTH = 260;
const POINTER_WIDTH = 26;
const POINTER_MIN_LEFT = 57;
const POINTER_MAX_LEFT = ANGLE_BAR_LEFT + ANGLE_BAR_WIDTH - POINTER_WIDTH / 2;

const screenAssets = {
  backgroundLayer1: require("@/assets/images/teaFlow/s5-background-layer-1.png"),
  backgroundLayer2: require("@/assets/images/teaFlow/s5-background-layer-2.png"),
  backgroundLayer3: require("@/assets/images/teaFlow/s5-background-layer-3.png"),
  teapot: require("@/assets/images/teaFlow/s5-teapot.png"),
  teacup: require("@/assets/images/teaFlow/s5-teacup.png"),
  fullTeacup: require("@/assets/images/teaFlow/s5-teacup-full.png"),
  fullTeacupGlow: require("@/assets/images/teaFlow/s5-teacup-full-glow.png"),
  pointer: require("@/assets/images/teaFlow/s5-angle-pointer.png"),
  idleGlow: require("@/assets/images/teaFlow/s5-teapot-glow-idle.png"),
  pouringGlow: require("@/assets/images/teaFlow/s5-teapot-glow-pouring.png"),
  tooFastGlow: require("@/assets/images/teaFlow/s5-teapot-glow-too-fast.png"),
  calibrationIcon: require("@/assets/images/teaFlow/s5-calibration-icon.png"),
} as const;

const messageByStatus: Record<TeaPouringStatus, string> = {
  idle: "다관을 기울여 찻잔에 따르세요",
  pouring: "좋아요, 그대로",
  tooFast: "너무 급해요 · 조금 세워주세요",
};

function getVisualAngle(status: TeaPouringStatus, zTwistDegrees: number | null): number {
  const absoluteTwist = Math.abs(zTwistDegrees ?? 0);
  const idleLimit = Z_TWIST_THRESHOLDS.neutralDeadZoneDegrees;
  const tooFastLimit = Z_TWIST_THRESHOLDS.tooFastMinAbsDegrees;

  if (status === "idle") {
    return Math.min(20, (absoluteTwist / idleLimit) * 20);
  }

  if (status === "pouring") {
    const pouringRatio = (absoluteTwist - idleLimit) / (tooFastLimit - idleLimit);
    return 20 + Math.min(1, Math.max(0, pouringRatio)) * 30;
  }

  const tooFastRatio = (absoluteTwist - tooFastLimit) / (90 - tooFastLimit);
  return 50 + Math.min(1, Math.max(0, tooFastRatio)) * 40;
}

function getPointerLeft(status: TeaPouringStatus, zTwistDegrees: number | null): number {
  const visualAngle = getVisualAngle(status, zTwistDegrees);
  return POINTER_MIN_LEFT + (visualAngle / 90) * (POINTER_MAX_LEFT - POINTER_MIN_LEFT);
}

function StepIndicator() {
  return (
    <View style={styles.steps}>
      <Text style={styles.inactiveStep}>적기</Text>
      <Text style={styles.inactiveStep}>준비</Text>
      <Text style={styles.inactiveStep}>우리기</Text>
      <Text style={styles.activeStep}>
        <Text style={styles.activeStepDot}>●</Text>따르기
      </Text>
      <Text style={styles.inactiveStep}>마시기</Text>
    </View>
  );
}

type AngleBarProps = {
  status: TeaPouringStatus;
  zTwistDegrees: number | null;
};

function AngleBar({ status, zTwistDegrees }: AngleBarProps) {
  return (
    <View style={styles.angleArea}>
      <Image
        source={screenAssets.pointer}
        style={[styles.anglePointer, { left: getPointerLeft(status, zTwistDegrees) }]}
      />
      <View style={styles.angleBar}>
        <View style={styles.idleRange} />
        <View style={styles.pouringRange} />
        <View style={styles.tooFastRange} />
      </View>
      <Text style={[styles.angleLabel, styles.angle0]}>0°</Text>
      <Text style={[styles.angleLabel, styles.angle20]}>20°</Text>
      <Text style={[styles.angleLabel, styles.angle50]}>50°</Text>
      <Text style={[styles.angleLabel, styles.angle90]}>90°</Text>
    </View>
  );
}

type PouringVisualProps = {
  status: TeaPouringStatus;
  progress: number;
  teaColor: string;
};

function PouringVisual({ status, progress, teaColor }: PouringVisualProps) {
  const rotation = status === "pouring" ? "-15deg" : status === "tooFast" ? "-30deg" : "0deg";
  const glow = status === "pouring"
    ? screenAssets.pouringGlow
    : status === "tooFast"
      ? screenAssets.tooFastGlow
      : screenAssets.idleGlow;

  return (
    <>
      <Image source={glow} style={styles.teapotGlow} />
      <View style={styles.teapotFrame}>
        <Image source={screenAssets.teapot} style={[styles.teapot, { transform: [{ rotate: rotation }] }]} />
      </View>
      <Image source={screenAssets.teacup} style={styles.teacup} />
      <View
        style={[
          styles.teacupTeaSurface,
          { backgroundColor: teaColor, opacity: progress * 0.65 },
        ]}
      />
    </>
  );
}

type CompletedVisualProps = {
  teaColor: string;
};

function CompletedVisual({ teaColor }: CompletedVisualProps) {
  return (
    <>
      <Image source={screenAssets.fullTeacupGlow} style={styles.fullTeacupGlow} />
      <Image source={screenAssets.fullTeacup} style={styles.fullTeacup} />
      <View style={[styles.fullTeaSurface, { backgroundColor: teaColor }]} />
      <View style={styles.completedMessage}>
        <Text style={styles.completedTitle}>찻잔이 가득 찼어요</Text>
        <Text style={styles.completedSubtitle}>이제 고민과 함께 마셔요</Text>
      </View>
    </>
  );
}

export type TeaPouringScreenProps = {
  /** 추천된 차의 액체 표시 색상. Tea 데이터가 연결되면 해당 색상만 전달한다. */
  teaColor?: string;
};

/**
 * Figma S5 차 따르기 화면을 센서 상태 및 화면 전용 진행도와 연결한다.
 * @param teaColor 찻잔의 액체 표면 색상. 생략하면 Figma 기준 기본색을 사용한다.
 * @returns S5 idle/pouring/tooFast/completed 화면
 * 사용처: src/app/tea-pouring.tsx
 */
export function TeaPouringScreen({ teaColor = S5_DEFAULT_TEA_COLOR }: TeaPouringScreenProps) {
  const { width, height } = useWindowDimensions();
  const pouring = useTeaPouring();
  const sensorReady = pouring.calibrationStatus === "ready";
  const effectivePouring = getS5EffectivePouringState({
    status: pouring.status,
    direction: pouring.direction,
  });
  const visibleStatus = sensorReady ? effectivePouring.status : "idle";
  const visibleDirection = sensorReady ? effectivePouring.direction : "neutral";
  const { progress, completed } = useS5PouringProgress({
    status: visibleStatus,
    direction: visibleDirection,
    enabled: sensorReady,
  });
  const scale = Math.min(width / DESIGN_WIDTH, height / DESIGN_HEIGHT);

  return (
    <View style={styles.screen}>
      <StatusBar hidden />
      <View style={[styles.canvas, { transform: [{ scale }] }]}>
        <Image source={screenAssets.backgroundLayer1} style={styles.background} />
        <Image source={screenAssets.backgroundLayer2} style={styles.background} />
        <Image source={screenAssets.backgroundLayer3} style={styles.background} />
        <StepIndicator />

        {completed ? (
          <CompletedVisual teaColor={teaColor} />
        ) : (
          <>
            <PouringVisual status={visibleStatus} progress={progress} teaColor={teaColor} />
            <Text
              style={visibleStatus === "tooFast" ? styles.warningMessage : styles.instructionMessage}
            >
              {messageByStatus[visibleStatus]}
            </Text>
            {!sensorReady && (
              <Image source={screenAssets.calibrationIcon} style={styles.calibrationIcon} />
            )}
            <AngleBar status={visibleStatus} zTwistDegrees={pouring.zTwistDegrees} />
          </>
        )}

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#3b3b3b",
    overflow: "hidden",
  },
  canvas: {
    width: DESIGN_WIDTH,
    height: DESIGN_HEIGHT,
    backgroundColor: "#3b3b3b",
  },
  background: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    width: DESIGN_WIDTH,
    height: DESIGN_HEIGHT,
  },
  steps: {
    position: "absolute",
    top: 58,
    left: 0,
    width: 390,
    height: 13,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-start",
    gap: 14,
  },
  inactiveStep: {
    color: "#a9a9a9",
    fontFamily: fontFamily.pretendardMedium,
    fontSize: 11,
    lineHeight: 13,
  },
  activeStep: {
    color: "#ffffff",
    fontFamily: fontFamily.pretendardMedium,
    fontSize: 11,
    lineHeight: 13,
  },
  activeStepDot: {
    color: "#bee29d",
  },
  teapotGlow: {
    position: "absolute",
    top: 196,
    left: 121,
    width: 224,
    height: 230,
  },
  teapotFrame: {
    position: "absolute",
    top: 210,
    left: 100,
    width: 260,
    height: 260,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  teapot: {
    width: 190,
    height: 190,
  },
  teacup: {
    position: "absolute",
    top: 448,
    left: 65,
    width: 96,
    height: 82,
  },
  teacupTeaSurface: {
    position: "absolute",
    top: 456,
    left: 75,
    width: 76,
    height: 27,
    borderRadius: 38,
  },
  instructionMessage: {
    position: "absolute",
    top: 600,
    left: 24,
    width: 342,
    color: "#ffffff",
    fontFamily: fontFamily.pretendardRegular,
    fontSize: 16,
    lineHeight: 22.4,
    textAlign: "center",
  },
  warningMessage: {
    position: "absolute",
    top: 600,
    left: 24,
    width: 342,
    color: "#e89a84",
    fontFamily: fontFamily.pretendardSemiBold,
    fontSize: 14,
    lineHeight: 22.4,
    textAlign: "center",
  },
  calibrationIcon: {
    position: "absolute",
    top: 636,
    left: 185,
    width: 20,
    height: 20,
  },
  angleArea: {
    position: "absolute",
    top: 696,
    left: 0,
    width: DESIGN_WIDTH,
    height: 48,
  },
  anglePointer: {
    position: "absolute",
    top: 0,
    width: 26,
    height: 18,
  },
  angleBar: {
    position: "absolute",
    top: 24,
    left: ANGLE_BAR_LEFT,
    width: ANGLE_BAR_WIDTH,
    height: 6,
    flexDirection: "row",
    overflow: "hidden",
    borderRadius: 3,
  },
  idleRange: {
    width: 57.77,
    backgroundColor: "#2e2a24",
  },
  pouringRange: {
    width: 86.66,
    backgroundColor: "#8b8c5b",
  },
  tooFastRange: {
    flex: 1,
    backgroundColor: "#886259",
  },
  angleLabel: {
    position: "absolute",
    top: 36,
    color: "#d9d9d9",
    fontFamily: fontFamily.pretendardRegular,
    fontSize: 10,
    lineHeight: 12,
  },
  angle0: { left: 65 },
  angle20: { left: 116 },
  angle50: { left: 203 },
  angle90: { left: 313 },
  fullTeacup: {
    position: "absolute",
    top: 341,
    left: 112,
    width: 169,
    height: 169,
  },
  fullTeacupGlow: {
    position: "absolute",
    top: 311,
    left: 86,
    width: 224,
    height: 230,
  },
  fullTeaSurface: {
    position: "absolute",
    top: 377.2,
    left: 138.15,
    width: 114.68,
    height: 66.4,
    borderRadius: 57.34,
    opacity: 0.52,
  },
  completedMessage: {
    position: "absolute",
    top: 600,
    left: 24,
    width: 342,
    alignItems: "center",
  },
  completedTitle: {
    color: "rgba(237, 227, 204, 0.95)",
    fontFamily: fontFamily.pretendardRegular,
    fontSize: 20,
    lineHeight: 32,
    textAlign: "center",
  },
  completedSubtitle: {
    marginTop: 3,
    color: "#a0a0a0",
    fontFamily: fontFamily.pretendardSemiBold,
    fontSize: 13,
    lineHeight: 20.8,
    textAlign: "center",
  },
});

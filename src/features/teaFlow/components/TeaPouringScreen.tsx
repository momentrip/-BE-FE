import { Image, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import type { StyleProp, ViewStyle } from "react-native";
import { StatusBar } from "expo-status-bar";
import {
  Canvas,
  Group,
  LinearGradient,
  Oval,
  Path,
  RadialGradient,
  vec,
} from "@shopify/react-native-skia";

import { fontFamily } from "@/shared/theme";

import { S5_CUP_COLORS, S5_DEFAULT_TEA_COLOR } from "../constants/s5Pouring";
import { useS5PouringProgress } from "../hooks/useS5PouringProgress";
import { useTeaPouring } from "../hooks/useTeaPouring";
import { Z_TWIST_THRESHOLDS } from "../utils/pouringThresholds";
import {
  getS5DisplayAngleDegrees,
  getS5EffectivePouringState,
} from "../utils/s5PouringState";
import { getS5LiquidOpacity } from "../utils/s5LiquidDisplay";
import type { TeaPouringStatus } from "../utils/zTwistState";

const DESIGN_WIDTH = 393;
const DESIGN_HEIGHT = 852;
const ANGLE_BAR_LEFT = 65;
const ANGLE_BAR_WIDTH = 260;
const POINTER_WIDTH = 26;
const POINTER_EDGE_PADDING = 1;
const POINTER_MIN_LEFT = 57;
const POINTER_MAX_LEFT = ANGLE_BAR_LEFT + ANGLE_BAR_WIDTH - POINTER_WIDTH / 2;

const screenAssets = {
  backgroundLayer1: require("@/assets/images/teaFlow/s5-background-layer-1.png"),
  backgroundLayer2: require("@/assets/images/teaFlow/s5-background-layer-2.png"),
  backgroundLayer3: require("@/assets/images/teaFlow/s5-background-layer-3.png"),
  teapot: require("@/assets/images/teaFlow/s5-teapot.png"),
  teacup: require("@/assets/images/teaFlow/s5-teacup.png"),
  fullTeacup: require("@/assets/images/teaFlow/s5-teacup-full.png"),
  calibrationIcon: require("@/assets/images/teaFlow/s5-calibration-icon.png"),
} as const;

const SMALL_CUP_BODY_PATH =
  "M1 10.5L0 2.5L3 4L5 5.5L8 7L10.5 8L14.5 9L20 10.5L26 11.5L34 12.5H42L50.5 12L59.5 10.5L66.5 9L71.5 7.5L79 3.5L84 0V3L83 8.5L81 15L79 21L76.5 28L73.5 33.5L70.5 38L66.5 43.5L61 48L57.5 49.5L53 51L48 52H34.5L31.5 51.5L27.5 51L25 49.5L22.5 49L20 47L18 44.5L14 39.5L10.5 34L8 29.5L5.5 24L3 18L1 10.5Z";
const SMALL_CUP_RIM_PATH =
  "M4 0L0 1.5L0.5 3L3 4.5L5.5 6L8 7L11.5 8.5L14.5 9.5L19 10.5L23 11L28 12L32 12.5H45L50.5 12L59 11L65 9.5L70 8L74.5 5.5L77.5 3.5L75 0L71.5 2.5L63 5.5L57.5 7L48.5 8H28.5L24.5 7L20 6.5L15.5 5L11 3.5L7.5 2L4 0Z";
const ANGLE_POINTER_BODY_PATH =
  "M0 4C0 2.89543 0.895431 2 2 2H24C25.1046 2 26 2.89543 26 4V6C26 12.6274 20.6274 18 14 18H12C5.37258 18 0 12.6274 0 6V4Z";
const ANGLE_POINTER_RIM_PATH =
  "M0 3.5C0 1.567 1.567 0 3.5 0H22.5C24.433 0 26 1.567 26 3.5C26 5.433 24.433 7 22.5 7H3.5C1.567 7 0 5.433 0 3.5Z";

const messageByStatus: Record<TeaPouringStatus, string> = {
  idle: "다관을 기울여 찻잔에 따르세요",
  pouring: "좋아요, 그대로",
  tooFast: "너무 급해요 · 조금 세워주세요",
};

function getVisualAngle(status: TeaPouringStatus, displayAngleDegrees: number): number {
  const absoluteTwist = Math.abs(displayAngleDegrees);
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

function getPointerLeft(status: TeaPouringStatus, displayAngleDegrees: number): number {
  const visualAngle = getVisualAngle(status, displayAngleDegrees);
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
  displayAngleDegrees: number;
  status: TeaPouringStatus;
};

function AngleBar({ displayAngleDegrees, status }: AngleBarProps) {
  const pointerLeft = getPointerLeft(status, displayAngleDegrees);

  return (
    <View style={styles.angleArea}>
      <Canvas
        style={[styles.anglePointer, { left: pointerLeft - POINTER_EDGE_PADDING }]}
      >
        <Group
          transform={[
            { translateX: POINTER_EDGE_PADDING },
            { translateY: POINTER_EDGE_PADDING },
          ]}
        >
          <Path path={ANGLE_POINTER_BODY_PATH}>
            <LinearGradient
              start={vec(13, 2)}
              end={vec(13, 18)}
              colors={["#eae5da", "#a9a296"]}
            />
          </Path>
          <Path path={ANGLE_POINTER_RIM_PATH} color="#d8d1c3" />
        </Group>
      </Canvas>
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

type RadialGlowProps = {
  color: string;
  style: StyleProp<ViewStyle>;
};

function RadialGlow({ color, style }: RadialGlowProps) {
  return (
    <Canvas style={style}>
      <Oval x={0} y={0} width={224} height={230}>
        <RadialGradient c={vec(112, 115)} r={120.699} colors={[color, "rgba(115,115,115,0)"]} />
      </Oval>
    </Canvas>
  );
}

function SmallTeacup({ progress, teaColor }: Pick<PouringVisualProps, "progress" | "teaColor">) {
  return (
    <View style={styles.smallCupClip}>
      <View style={styles.smallCupLiquidClip}>
        <View
          style={[
            styles.teacupTeaSurface,
            { backgroundColor: teaColor, opacity: getS5LiquidOpacity(progress) },
          ]}
        />
      </View>
      <Canvas style={styles.smallCupBody}>
        <Path path={SMALL_CUP_BODY_PATH} color={S5_CUP_COLORS.body} />
      </Canvas>
      <Canvas style={styles.smallCupRim}>
        <Path path={SMALL_CUP_RIM_PATH} color={S5_CUP_COLORS.rim} />
      </Canvas>
      <Image source={screenAssets.teacup} style={styles.teacupTexture} />
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
  const glowColor = status === "pouring"
    ? "rgba(255,233,90,0.29)"
    : status === "tooFast"
      ? "rgba(255,90,90,0.36)"
      : "rgba(255,233,90,0.13)";

  return (
    <>
      <RadialGlow color={glowColor} style={styles.teapotGlow} />
      <View style={styles.teapotFrame}>
        <Image source={screenAssets.teapot} style={[styles.teapot, { transform: [{ rotate: rotation }] }]} />
      </View>
      <SmallTeacup progress={progress} teaColor={teaColor} />
    </>
  );
}

type CompletedVisualProps = {
  teaColor: string;
};

function CompletedVisual({ teaColor }: CompletedVisualProps) {
  return (
    <>
      <RadialGlow color="rgba(255,233,90,1)" style={styles.fullTeacupGlow} />
      <View style={styles.fullCupBodyLower} />
      <View style={styles.fullCupBodyUpper} />
      <View
        style={[
          styles.fullTeaSurface,
          { backgroundColor: teaColor, opacity: getS5LiquidOpacity(1) },
        ]}
      />
      <Image source={screenAssets.fullTeacup} style={styles.fullTeacup} />
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
  const displayAngleDegrees = getS5DisplayAngleDegrees({
    direction: visibleDirection,
    zTwistDegrees: pouring.zTwistDegrees,
  });
  const { progress, completed } = useS5PouringProgress({
    status: visibleStatus,
    direction: visibleDirection,
    enabled: sensorReady,
  });
  const showCompleted = completed || progress >= 1;
  const scale = Math.min(width / DESIGN_WIDTH, height / DESIGN_HEIGHT);

  return (
    <View style={styles.screen}>
      <StatusBar hidden />
      <View style={[styles.canvas, { transform: [{ scale }] }]}>
        <Image source={screenAssets.backgroundLayer1} style={styles.background} />
        <Image source={screenAssets.backgroundLayer2} style={styles.background} />
        <Image source={screenAssets.backgroundLayer3} style={styles.background} />
        <StepIndicator />

        <View
          pointerEvents="none"
          style={[styles.stateLayer, showCompleted && styles.hiddenStateLayer]}
        >
          <PouringVisual status={visibleStatus} progress={progress} teaColor={teaColor} />
          <Text
            style={visibleStatus === "tooFast" ? styles.warningMessage : styles.instructionMessage}
          >
            {messageByStatus[visibleStatus]}
          </Text>
          {!sensorReady && (
            <Image source={screenAssets.calibrationIcon} style={styles.calibrationIcon} />
          )}
          <AngleBar displayAngleDegrees={displayAngleDegrees} status={visibleStatus} />
        </View>
        <View
          pointerEvents="none"
          style={[styles.stateLayer, !showCompleted && styles.hiddenStateLayer]}
        >
          <CompletedVisual teaColor={teaColor} />
        </View>

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
  stateLayer: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  hiddenStateLayer: {
    opacity: 0,
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
  teacupTexture: {
    position: "absolute",
    top: -6.5,
    left: -1.5,
    width: 112,
    height: 95.67,
  },
  smallCupClip: {
    position: "absolute",
    top: 448,
    left: 65,
    width: 96,
    height: 82,
    overflow: "hidden",
  },
  smallCupLiquidClip: {
    position: "absolute",
    top: 8,
    left: 10,
    width: 76,
    height: 27,
    borderRadius: 38,
    overflow: "hidden",
  },
  smallCupBody: {
    position: "absolute",
    top: 27.5,
    left: 7,
    width: 84,
    height: 52,
  },
  smallCupRim: {
    position: "absolute",
    top: 27,
    left: 8,
    width: 77.5,
    height: 12.5,
  },
  teacupTeaSurface: {
    position: "absolute",
    top: 0,
    left: 0,
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
    top: -POINTER_EDGE_PADDING,
    width: POINTER_WIDTH + POINTER_EDGE_PADDING * 2,
    height: 18 + POINTER_EDGE_PADDING * 2,
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
  fullCupBodyLower: {
    position: "absolute",
    top: 382,
    left: 142.5,
    width: 110,
    height: 115,
    borderRadius: 57.5,
    backgroundColor: S5_CUP_COLORS.body,
  },
  fullCupBodyUpper: {
    position: "absolute",
    top: 358,
    left: 126.5,
    width: 141,
    height: 94,
    borderRadius: 47,
    backgroundColor: S5_CUP_COLORS.completedUpperBody,
  },
  fullTeaSurface: {
    position: "absolute",
    top: 377.2,
    left: 138.15,
    width: 114.68,
    height: 66.4,
    borderRadius: 57.34,
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

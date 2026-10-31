import { Image, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import type { StyleProp, ViewStyle } from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Image as ExpoImage } from "expo-image";
import {
  Canvas,
  Oval,
  Path,
  RadialGradient,
  vec,
} from "@shopify/react-native-skia";
import { useEffect, useRef } from "react";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from "react-native-reanimated";

import { getCurrentSession } from "@/features/session";
import { fontFamily } from "@/shared/theme";

import {
  S5_COMPLETED_DISPLAY_DURATION_MS,
  S5_CUP_COLORS,
  S5_LIQUID_MAX_OPACITY,
} from "../constants/s5Pouring";
import { useS5PouringProgress } from "../hooks/useS5PouringProgress";
import { useTeaPouring } from "../hooks/useTeaPouring";
import { S4BackButton } from "./S4BackButton";
import { S5WaterStream } from "./S5WaterStream";
import { getS5GaugeIndicatorLeft } from "../utils/s5AngleGauge";
import {
  getS5DisplayAngleDegrees,
  getS5EffectivePouringState,
} from "../utils/s5PouringState";
import { getS5LiquidFillHeight, getS5LiquidOpacity } from "../utils/s5LiquidDisplay";
import { getS5PouringLiquidColor } from "../utils/getS5PouringLiquidColor";
import { getS5TeaColor } from "../utils/getS5TeaColor";
import { getTeaLiquidDisplayColor } from "../utils/getTeaLiquidDisplayColor";
import type { TeaPouringStatus } from "../utils/zTwistState";

const DESIGN_WIDTH = 393;
const DESIGN_HEIGHT = 852;
const ANGLE_BAR_LEFT = 65;
const ANGLE_BAR_WIDTH = 260;
const POINTER_WIDTH = 26;
const POINTER_MIN_LEFT = 57;
const POINTER_MAX_LEFT = ANGLE_BAR_LEFT + ANGLE_BAR_WIDTH - POINTER_WIDTH / 2;
const SMALL_CUP_LIQUID_MAX_HEIGHT = 27;
const LIQUID_WOBBLE_AMPLITUDE = 1.5;
const LIQUID_WOBBLE_DURATION_MS = 700;

const screenAssets = {
  backgroundLayer1: require("@/assets/images/teaFlow/s5-background-layer-1.png"),
  backgroundLayer2: require("@/assets/images/teaFlow/s5-background-layer-2.png"),
  backgroundLayer3: require("@/assets/images/teaFlow/s5-background-layer-3.png"),
  teapot: require("@/assets/images/teaFlow/s5-teapot.png"),
  teacup: require("@/assets/images/teaFlow/s5-teacup.png"),
  fullTeacup: require("@/assets/images/teaFlow/s5-teacup-full.png"),
  anglePointer: require("@/assets/images/teaFlow/s5-angle-pointer.svg"),
  calibrationIcon: require("@/assets/images/teaFlow/s6-phone-tilt.svg"),
} as const;

const SMALL_CUP_BODY_PATH =
  "M1 10.5L0 2.5L3 4L5 5.5L8 7L10.5 8L14.5 9L20 10.5L26 11.5L34 12.5H42L50.5 12L59.5 10.5L66.5 9L71.5 7.5L79 3.5L84 0V3L83 8.5L81 15L79 21L76.5 28L73.5 33.5L70.5 38L66.5 43.5L61 48L57.5 49.5L53 51L48 52H34.5L31.5 51.5L27.5 51L25 49.5L22.5 49L20 47L18 44.5L14 39.5L10.5 34L8 29.5L5.5 24L3 18L1 10.5Z";
const SMALL_CUP_RIM_PATH =
  "M4 0L0 1.5L0.5 3L3 4.5L5.5 6L8 7L11.5 8.5L14.5 9.5L19 10.5L23 11L28 12L32 12.5H45L50.5 12L59 11L65 9.5L70 8L74.5 5.5L77.5 3.5L75 0L71.5 2.5L63 5.5L57.5 7L48.5 8H28.5L24.5 7L20 6.5L15.5 5L11 3.5L7.5 2L4 0Z";
const messageByStatus: Record<TeaPouringStatus, string> = {
  idle: "다관을 기울여 찻잔에 따르세요",
  pouring: "좋아요, 그대로",
  tooFast: "너무 급해요 · 조금 세워주세요",
};

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
  const pointerLeft = getS5GaugeIndicatorLeft({
    displayAngleDegrees,
    maxLeft: POINTER_MAX_LEFT,
    minLeft: POINTER_MIN_LEFT,
    status,
  });

  return (
    <View style={styles.angleArea}>
      <ExpoImage
        contentFit="fill"
        source={screenAssets.anglePointer}
        style={[styles.anglePointer, { left: pointerLeft }]}
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
  const fillHeight = getS5LiquidFillHeight(progress, SMALL_CUP_LIQUID_MAX_HEIGHT);
  const baseTop = SMALL_CUP_LIQUID_MAX_HEIGHT - fillHeight;

  const wobble = useSharedValue(0);
  useEffect(() => {
    wobble.value = withRepeat(
      withTiming(1, { duration: LIQUID_WOBBLE_DURATION_MS, easing: Easing.inOut(Easing.sin) }),
      -1,
      true,
    );
  }, [wobble]);

  const wobbleStyle = useAnimatedStyle(() => ({
    top: baseTop + (wobble.value - 0.5) * 2 * LIQUID_WOBBLE_AMPLITUDE,
  }));

  return (
    <View style={styles.smallCupClip}>
      <View style={styles.smallCupLiquidClip}>
        <Animated.View
          style={[
            styles.teacupTeaSurface,
            {
              backgroundColor: teaColor,
              opacity: S5_LIQUID_MAX_OPACITY,
              height: fillHeight,
            },
            wobbleStyle,
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
  const pouringLiquidColor = getS5PouringLiquidColor(teaColor);

  return (
    <>
      <RadialGlow color={glowColor} style={styles.teapotGlow} />
      <View style={styles.teapotFrame}>
        <Image source={screenAssets.teapot} style={[styles.teapot, { transform: [{ rotate: rotation }] }]} />
      </View>
      <S5WaterStream status={status} teaColor={pouringLiquidColor} />
      <SmallTeacup progress={progress} teaColor={pouringLiquidColor} />
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
  /**
   * 액체 표시 색상을 직접 지정하고 싶을 때만 넘긴다. 생략하면 session에 저장된
   * 차 id(getCurrentSession().tea)로 zen이 공개한 TEA_COLOR에서 자동으로 찾는다.
   */
  teaColor?: string;
  /** 완료 화면을 잠시 표시한 뒤 다음 차 마시기 화면으로 이동할 때 호출한다. */
  onCompleted?: () => void;
};

/**
 * Figma S5 차 따르기 화면을 센서 상태 및 화면 전용 진행도와 연결한다.
 * @param props.teaColor 찻잔의 액체 표면 색상. 생략하면 session에 저장된 차로 자동 결정한다.
 * @param props.onCompleted 완료 화면을 잠시 표시한 뒤 호출할 다음 화면 callback
 * @returns S5 idle/pouring/tooFast/completed 화면
 * 사용처: src/app/tea-pouring.tsx
 */
export function TeaPouringScreen({ onCompleted, teaColor }: TeaPouringScreenProps) {
  const router = useRouter();
  const completionCalledRef = useRef(false);
  const resolvedTeaColor = teaColor ?? getTeaLiquidDisplayColor(getS5TeaColor(getCurrentSession().tea));
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

  useEffect(() => {
    if (!showCompleted || onCompleted === undefined || completionCalledRef.current) {
      return;
    }

    const timer = setTimeout(() => {
      if (completionCalledRef.current) {
        return;
      }
      completionCalledRef.current = true;
      onCompleted();
    }, S5_COMPLETED_DISPLAY_DURATION_MS);

    return () => clearTimeout(timer);
  }, [onCompleted, showCompleted]);

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
          <PouringVisual status={visibleStatus} progress={progress} teaColor={resolvedTeaColor} />
          <Text
            style={visibleStatus === "tooFast" ? styles.warningMessage : styles.instructionMessage}
          >
            {messageByStatus[visibleStatus]}
          </Text>
          {!sensorReady && (
            <ExpoImage contentFit="fill" source={screenAssets.calibrationIcon} style={styles.calibrationIcon} />
          )}
          <AngleBar displayAngleDegrees={displayAngleDegrees} status={visibleStatus} />
        </View>
        <View
          pointerEvents="none"
          style={[styles.stateLayer, !showCompleted && styles.hiddenStateLayer]}
        >
          <CompletedVisual teaColor={resolvedTeaColor} />
        </View>

        <S4BackButton onBack={() => router.back()} />
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
    left: 0,
    width: 76,
    borderRadius: 38,
  },
  instructionMessage: {
    position: "absolute",
    top: 600,
    left: 24,
    width: 342,
    color: "#ffffff",
    fontFamily: fontFamily.sub3,
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
    width: POINTER_WIDTH,
    height: 18,
    zIndex: 1,
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
    fontFamily: fontFamily.sub3,
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

import { useEffect, useRef } from "react";
import { Image, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Image as ExpoImage } from "expo-image";
import {
  BlurMask,
  Canvas,
  Group,
  Oval,
  RadialGradient,
  vec,
} from "@shopify/react-native-skia";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { fontFamily } from "@/shared/theme";

import {
  S6_DRINKING_COMPLETED_DISPLAY_DURATION_MS,
  S6_LANTERN_TRANSITION_DURATION_MS,
} from "../constants/s6Drinking";
import { useTeaDrinking } from "../hooks/useTeaDrinking";
import { getTeaDrinkingPresentation } from "../utils/teaDrinkingPresentation";

const DESIGN_WIDTH = 393;
const DESIGN_HEIGHT = 852;

const assets = {
  background: require("@/assets/images/teaFlow/s6-background.png"),
  milestones: require("@/assets/images/teaFlow/s6-milestones.svg"),
  phoneTilt: require("@/assets/images/teaFlow/s6-phone-tilt.svg"),
  teacup: require("@/assets/images/teaFlow/s6-teacup.png"),
} as const;

export type TeaDrinkingScreenProps = {
  /** 세 모금을 모두 마시고 완료 화면을 확인한 뒤 호출한다. */
  onCompleted?: () => void;
};

function LightSource() {
  return (
    <Canvas pointerEvents="none" style={styles.lightSource}>
      <Oval x={-58} y={-210} width={510} height={420}>
        <RadialGradient
          c={vec(197, 8)}
          colors={["rgba(255,250,236,1)", "rgba(255,236,200,0.55)", "rgba(255,236,200,0)"]}
          positions={[0, 0.35, 0.7]}
          r={240}
        />
        <BlurMask blur={3} style="normal" />
      </Oval>
    </Canvas>
  );
}

type LanternProps = {
  top: number;
};

function Lantern({ top }: LanternProps) {
  const animatedTop = useSharedValue(top);

  useEffect(() => {
    animatedTop.value = withTiming(top, {
      duration: S6_LANTERN_TRANSITION_DURATION_MS,
      easing: Easing.inOut(Easing.cubic),
    });
  }, [animatedTop, top]);

  const animatedStyle = useAnimatedStyle(() => ({ top: animatedTop.value }));

  return (
    <Animated.View pointerEvents="none" style={[styles.lantern, animatedStyle]}>
      <Canvas style={styles.lanternGlow}>
        <Group opacity={1}>
          <Oval x={0} y={0} width={120} height={120}>
            <RadialGradient
              c={vec(60, 60)}
              colors={["rgba(138,112,38,0.53)", "rgba(138,112,38,0.15)", "rgba(138,112,38,0)"]}
              positions={[0, 0.4, 0.7]}
              r={60}
            />
          </Oval>
        </Group>
      </Canvas>
      <View style={styles.lanternFlame} />
    </Animated.View>
  );
}

function Teacup() {
  return (
    <View style={styles.teacupGroup}>
      <View style={styles.cupBodyLower} />
      <View style={styles.cupBodyUpper} />
      <View style={styles.teaSurface} />
      <Image source={assets.teacup} style={styles.teacup} />
    </View>
  );
}

/**
 * S6 차 마시기 센서 상태를 Figma 열반 1~4 화면과 연결한다.
 * @param props.onCompleted 세 모금 완료 상태를 잠시 표시한 뒤 다음 화면으로 이동할 callback
 * @returns 차 마시기 화면
 * 사용처: src/app/tea-drinking.tsx
 */
export function TeaDrinkingScreen({ onCompleted }: TeaDrinkingScreenProps) {
  const { width, height } = useWindowDimensions();
  const drinking = useTeaDrinking();
  const completionCalledRef = useRef(false);
  const presentation = getTeaDrinkingPresentation(drinking);
  const scale = Math.min(width / DESIGN_WIDTH, height / DESIGN_HEIGHT);

  useEffect(() => {
    if (!drinking.completed || onCompleted === undefined || completionCalledRef.current) {
      return;
    }

    const timer = setTimeout(() => {
      if (completionCalledRef.current) {
        return;
      }
      completionCalledRef.current = true;
      onCompleted();
    }, S6_DRINKING_COMPLETED_DISPLAY_DURATION_MS);

    return () => clearTimeout(timer);
  }, [drinking.completed, onCompleted]);

  return (
    <View style={styles.screen}>
      <StatusBar hidden />
      <View style={[styles.canvas, { transform: [{ scale }] }]}>
        <Image source={assets.background} style={styles.background} />
        <LightSource />
        <ExpoImage contentFit="fill" source={assets.milestones} style={styles.milestones} />
        <Text style={[styles.milestoneLabel, styles.nirvanaLabel]}>열반</Text>
        <Text style={[styles.milestoneLabel, styles.twoSipsLabel]}>두 모금</Text>
        <Text style={[styles.milestoneLabel, styles.oneSipLabel]}>한 모금</Text>
        <Lantern top={presentation.lanternTop} />
        <Teacup />

        <View style={styles.sipDots}>
          {[0, 1, 2].map((dot) => (
            <View
              key={dot}
              style={[
                styles.sipDot,
                dot >= drinking.sipCount && !drinking.completed && styles.sipDotPending,
              ]}
            />
          ))}
        </View>
        <Text style={styles.sipGuide}>세 모금에 나눠 마셔요</Text>
        <View style={styles.instructionRow}>
          <ExpoImage contentFit="fill" source={assets.phoneTilt} style={styles.phoneTilt} />
          <Text style={styles.instruction}>{presentation.instruction}</Text>
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
    overflow: "hidden",
  },
  background: {
    position: "absolute",
    top: -7,
    left: -69,
    width: 551.123,
    height: 858,
  },
  lightSource: {
    position: "absolute",
    top: 0,
    left: 0,
    width: DESIGN_WIDTH,
    height: 220,
  },
  milestones: {
    position: "absolute",
    top: 0,
    left: 2,
    width: 390,
    height: 400,
  },
  milestoneLabel: {
    position: "absolute",
    left: 217,
    width: 48,
    color: "#d9d9d9",
    fontFamily: fontFamily.pretendardSemiBold,
    fontSize: 11,
    lineHeight: 13,
  },
  nirvanaLabel: { top: 133 },
  twoSipsLabel: { top: 228 },
  oneSipLabel: { top: 313 },
  lantern: {
    position: "absolute",
    left: 137,
    width: 120,
    height: 120,
    alignItems: "center",
    justifyContent: "center",
  },
  lanternGlow: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 120,
    height: 120,
  },
  lanternFlame: {
    width: 20,
    height: 26,
    borderTopLeftRadius: 7,
    borderTopRightRadius: 7,
    borderBottomLeftRadius: 9,
    borderBottomRightRadius: 9,
    backgroundColor: "#efcb66",
    shadowColor: "#efcb66",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  teacupGroup: {
    position: "absolute",
    top: 499,
    left: 112.5,
    width: 169,
    height: 169,
  },
  cupBodyLower: {
    position: "absolute",
    top: 41,
    left: 30.5,
    width: 110,
    height: 115,
    borderRadius: 57.5,
    backgroundColor: "#3e4a50",
  },
  cupBodyUpper: {
    position: "absolute",
    top: 17,
    left: 14.5,
    width: 141,
    height: 94,
    borderRadius: 47,
    backgroundColor: "#6c7b83",
  },
  teaSurface: {
    position: "absolute",
    top: 36.215,
    left: 26.154,
    width: 114.679,
    height: 66.393,
    borderRadius: 57.34,
    backgroundColor: "#9fad5d",
  },
  teacup: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 169,
    height: 169,
  },
  sipDots: {
    position: "absolute",
    top: 705,
    left: 0,
    width: 390,
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
  },
  sipDot: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: "#e3c56a",
  },
  sipDotPending: {
    opacity: 0.35,
  },
  sipGuide: {
    position: "absolute",
    top: 726,
    left: 0,
    width: 390,
    color: "#e8e8e8",
    fontFamily: fontFamily.pretendardSemiBold,
    fontSize: 12,
    lineHeight: 14,
    textAlign: "center",
  },
  instructionRow: {
    position: "absolute",
    top: 765,
    left: 72,
    width: 249,
    height: 22,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  phoneTilt: {
    width: 22,
    height: 22,
  },
  instruction: {
    minWidth: 187,
    color: "#a8a8a8",
    fontFamily: fontFamily.pretendardMedium,
    fontSize: 14,
    lineHeight: 17,
    textAlign: "center",
  },
});

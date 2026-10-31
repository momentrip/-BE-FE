import {
  BlurMask,
  Canvas,
  Group,
  LinearGradient,
  Oval,
  RadialGradient,
  Rect,
  RoundedRect,
  vec,
} from "@shopify/react-native-skia";
import { Image as ExpoImage } from "expo-image";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import { Image, Pressable, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import Animated, {
  Easing,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { getCurrentSession } from "@/features/session";
import { fontFamily } from "@/shared/theme";

import {
  S6_DRINKING_COMPLETED_DISPLAY_DURATION_MS,
  S6_LANTERN_TRANSITION_DURATION_MS,
  S6_REFLECTION_DISPLAY_DURATION_MS,
  S6_REFLECTION_TRANSITION_DURATION_MS,
} from "../constants/s6Drinking";
import { useTeaDrinking } from "../hooks/useTeaDrinking";
import { getS6TeaColor } from "../utils/getS6TeaColor";
import type { TeaDrinkingFlowStep } from "../utils/teaDrinkingFlow";
import { getNextTeaDrinkingFlowStep } from "../utils/teaDrinkingFlow";
import { getTeaDrinkingPresentation } from "../utils/teaDrinkingPresentation";
import { S4BlinkingText } from "./S4BlinkingText";
import { TeaDrinkingReflection } from "./TeaDrinkingReflection";

const DESIGN_WIDTH = 393;
const DESIGN_HEIGHT = 852;

const assets = {
  background: require("@/assets/images/teaFlow/s6-background.png"),
  milestones: require("@/assets/images/teaFlow/s6-milestones.svg"),
  phoneTilt: require("@/assets/images/teaFlow/s6-phone-tilt.svg"),
  teacup: require("@/assets/images/teaFlow/s6-teacup.png"),
} as const;

export type TeaDrinkingScreenProps = {
  /** 세 모금과 Figma 후속 회고 화면을 모두 확인한 뒤 호출한다. */
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
      <Group origin={vec(197, 233)} transform={[{ rotate: -7 * Math.PI / 180 }]}>
        <Rect x={167} y={-47} width={60} height={560}>
          <LinearGradient
            colors={["rgba(255,240,210,0.2)", "rgba(255,240,210,0.05)", "rgba(255,240,210,0)"]}
            end={vec(197, 513)}
            positions={[0, 0.6, 1]}
            start={vec(197, -47)}
          />
          <BlurMask blur={4} style="normal" />
        </Rect>
      </Group>
      <Group origin={vec(196, 235)} transform={[{ rotate: 9 * Math.PI / 180 }]}>
        <Rect x={181} y={-45} width={30} height={560}>
          <LinearGradient
            colors={["rgba(255,240,210,0.2)", "rgba(255,240,210,0.05)", "rgba(255,240,210,0)"]}
            end={vec(196, 515)}
            positions={[0, 0.6, 1]}
            start={vec(196, -45)}
          />
          <BlurMask blur={4} style="normal" />
        </Rect>
      </Group>
      <Group origin={vec(195, 235)} opacity={0.84} transform={[{ rotate: 2 * Math.PI / 180 }]}>
        <Rect x={150} y={-45} width={90} height={560}>
          <LinearGradient
            colors={["rgba(255,240,210,0.2)", "rgba(255,240,210,0.05)", "rgba(255,240,210,0)"]}
            end={vec(195, 515)}
            positions={[0, 0.6, 1]}
            start={vec(195, -45)}
          />
          <BlurMask blur={4} style="normal" />
        </Rect>
      </Group>
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
        <Oval x={0} y={0} width={120} height={120}>
          <RadialGradient
            c={vec(60, 60)}
            colors={["rgba(138,112,38,0.53)", "rgba(138,112,38,0.15)", "rgba(138,112,38,0)"]}
            positions={[0, 0.4, 0.7]}
            r={60}
          />
        </Oval>
        <RoundedRect x={50} y={47} width={20} height={26} r={8} opacity={0.33} color="#efcb66">
          <BlurMask blur={10} style="normal" />
        </RoundedRect>
        <RoundedRect x={50} y={47} width={20} height={26} r={8}>
          <RadialGradient
            c={vec(60, 64.68)}
            colors={["#fff4c8", "#f7e097", "#efcb66", "#bd9e46", "#8a7026"]}
            positions={[0, 0.275, 0.55, 0.775, 1]}
            r={20.312}
          />
        </RoundedRect>
      </Canvas>
    </Animated.View>
  );
}

type TeacupProps = {
  teaColor: string;
};

function Teacup({ teaColor }: TeacupProps) {
  return (
    <View style={styles.teacupGroup}>
      <View style={styles.cupBodyLower} />
      <View style={styles.cupBodyUpper} />
      <View style={[styles.teaSurface, { backgroundColor: teaColor }]} />
      <Image source={assets.teacup} style={styles.teacup} />
    </View>
  );
}

/**
 * S6 차 마시기 센서 상태와 완료 후 Figma 5~7페이지를 연결한다.
 * @param props.onCompleted 마지막 회고 화면을 확인한 뒤 다음 화면으로 이동할 callback
 * @returns 차 마시기 및 완료 후 회고 화면
 * 사용처: src/app/tea-drinking.tsx
 */
export function TeaDrinkingScreen({ onCompleted }: TeaDrinkingScreenProps) {
  const { width, height } = useWindowDimensions();
  const drinking = useTeaDrinking();
  const completionCalledRef = useRef(false);
  const [flowStep, setFlowStep] = useState<TeaDrinkingFlowStep>("drinking");
  const presentation = getTeaDrinkingPresentation(drinking);
  const teaColor = getS6TeaColor(getCurrentSession().tea);
  const scale = Math.min(width / DESIGN_WIDTH, height / DESIGN_HEIGHT);

  useEffect(() => {
    if (!drinking.completed || completionCalledRef.current || flowStep === "lightsOut") {
      return;
    }

    const delay = flowStep === "drinking"
      ? S6_DRINKING_COMPLETED_DISPLAY_DURATION_MS
      : S6_REFLECTION_DISPLAY_DURATION_MS;
    const timer = setTimeout(() => {
      const nextStep = getNextTeaDrinkingFlowStep(flowStep);
      if (nextStep !== null) {
        setFlowStep(nextStep);
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [drinking.completed, flowStep]);

  const handleLightsOutTap = () => {
    if (completionCalledRef.current) {
      return;
    }
    completionCalledRef.current = true;
    onCompleted?.();
  };

  return (
    <View style={styles.screen}>
      <StatusBar hidden />
      <View style={[styles.canvas, { transform: [{ scale }] }]}>
        {flowStep === "drinking" ? (
          <Animated.View
            exiting={FadeOut.duration(S6_REFLECTION_TRANSITION_DURATION_MS)}
            style={StyleSheet.absoluteFill}
          >
            <Image source={assets.background} style={styles.background} />
            <LightSource />
            <ExpoImage contentFit="fill" source={assets.milestones} style={styles.milestones} />
            <Text style={[styles.milestoneLabel, styles.nirvanaLabel]}>열반</Text>
            <Text style={[styles.milestoneLabel, styles.twoSipsLabel]}>두 모금</Text>
            <Text style={[styles.milestoneLabel, styles.oneSipLabel]}>한 모금</Text>
            <Lantern top={presentation.lanternTop} />
            <Teacup teaColor={teaColor} />

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
          </Animated.View>
        ) : (
          <Pressable
            onPress={handleLightsOutTap}
            pointerEvents={flowStep === "lightsOut" ? "auto" : "none"}
            style={StyleSheet.absoluteFill}
          >
            <TeaDrinkingReflection step={flowStep} />
            {flowStep === "lightsOut" && (
              <S4BlinkingText style={styles.tapHint} text="화면을 클릭하세요" />
            )}
          </Pressable>
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
    height: 525,
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
  tapHint: {
    position: "absolute",
    top: 716,
    left: 24,
    width: DESIGN_WIDTH - 48,
    color: "#ffffff",
    fontFamily: fontFamily.pretendardMedium,
    fontSize: 12,
    textAlign: "center",
  },
});

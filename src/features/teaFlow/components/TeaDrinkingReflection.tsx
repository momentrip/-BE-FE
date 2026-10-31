import { useEffect } from "react";
import { Image, StyleSheet } from "react-native";
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
import Animated, {
  Easing,
  Extrapolation,
  FadeIn,
  FadeOut,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { fontFamily } from "@/shared/theme";

import { S6_REFLECTION_TRANSITION_DURATION_MS } from "../constants/s6Drinking";
import type { TeaDrinkingFlowStep } from "../utils/teaDrinkingFlow";

type TeaDrinkingReflectionStep = Exclude<TeaDrinkingFlowStep, "drinking">;

type TeaDrinkingReflectionProps = {
  step: TeaDrinkingReflectionStep;
};

const assets = {
  initialBackground: require("@/assets/images/teaFlow/s6-background.png"),
  reflectionBackground: require("@/assets/images/teaFlow/s6-reflection-background.png"),
} as const;

const STEP_INDEX: Record<TeaDrinkingReflectionStep, number> = {
  reflectionOne: 0,
  reflectionTwo: 1,
  reflectionThree: 2,
};

const REFLECTION_COPY = {
  reflectionOne: {
    fontSize: 32,
    lineHeight: 45,
    text: "과거와 미래의 후회에서\n벗어나,\n번뇌에 붙잡혀있던 마음을\n비우게 되셨나요?",
    top: 563,
  },
  reflectionTwo: {
    fontSize: 26,
    lineHeight: 37,
    text: "차가 모두 비워졌습니다.\n마음까지 비워야 하는 것은 아닙니다.\n그저, 붙잡고 있던 것을 놓아봅니다.",
    top: 595,
  },
  reflectionThree: {
    fontSize: 27,
    lineHeight: 38,
    text: "비워진 자리에는\n다시 무엇이든 담길 수 있습니다",
    top: 609,
  },
} as const;

function ReflectionLight() {
  return (
    <>
      <Canvas pointerEvents="none" style={styles.reflectionLightCanvas}>
        <Oval x={0} y={0} width={510} height={420}>
          <RadialGradient
            c={vec(255, 210)}
            colors={[
              "rgba(255,250,236,1)",
              "rgba(255,236,200,0.55)",
              "rgba(255,236,200,0)",
            ]}
            positions={[0, 0.35, 0.7]}
            r={361}
          />
          <BlurMask blur={3} style="normal" />
        </Oval>
        <Group origin={vec(290, 436)} transform={[{ rotate: -7 * Math.PI / 180 }]}>
          <Rect x={260} y={156} width={60} height={560}>
            <LinearGradient
              start={vec(290, 156)}
              end={vec(290, 716)}
              colors={[
                "rgba(255,240,210,0.2)",
                "rgba(255,240,210,0.05)",
                "rgba(255,240,210,0)",
              ]}
              positions={[0, 0.6, 1]}
            />
            <BlurMask blur={4} style="normal" />
          </Rect>
        </Group>
        <Group origin={vec(221, 435)} transform={[{ rotate: 9 * Math.PI / 180 }]}>
          <Rect x={206} y={155} width={30} height={560}>
            <LinearGradient
              start={vec(221, 155)}
              end={vec(221, 715)}
              colors={[
                "rgba(255,240,210,0.2)",
                "rgba(255,240,210,0.05)",
                "rgba(255,240,210,0)",
              ]}
              positions={[0, 0.6, 1]}
            />
            <BlurMask blur={4} style="normal" />
          </Rect>
        </Group>
        <Group opacity={0.84} origin={vec(245, 436)} transform={[{ rotate: 2 * Math.PI / 180 }]}>
          <Rect x={200} y={156} width={90} height={560}>
            <LinearGradient
              start={vec(245, 156)}
              end={vec(245, 716)}
              colors={[
                "rgba(255,240,210,0.2)",
                "rgba(255,240,210,0.05)",
                "rgba(255,240,210,0)",
              ]}
              positions={[0, 0.6, 1]}
            />
            <BlurMask blur={4} style="normal" />
          </Rect>
        </Group>
        <Oval x={178} y={233} width={154} height={154}>
          <RadialGradient
            c={vec(255, 310)}
            colors={[
              "rgba(138,112,38,0.53)",
              "rgba(138,112,38,0.15)",
              "rgba(138,112,38,0)",
            ]}
            positions={[0, 0.4, 0.7]}
            r={77}
          />
        </Oval>
        <RoundedRect x={244} y={295.69} width={22} height={28.59} r={8}>
          <RadialGradient
            c={vec(255, 315.13)}
            colors={["#fff4c8", "#f7e097", "#efcb66", "#bd9e46", "#8a7026"]}
            positions={[0, 0.275, 0.55, 0.775, 1]}
            r={22.34}
          />
          <BlurMask blur={2} style="solid" />
        </RoundedRect>
      </Canvas>
    </>
  );
}

function BottomGlow() {
  return (
    <Canvas pointerEvents="none" style={styles.bottomGlow}>
      <Oval x={0} y={0} width={332} height={332}>
        <RadialGradient
          c={vec(166, 166)}
          colors={[
            "rgba(150,141,95,0.53)",
            "rgba(211,255,129,0.15)",
            "rgba(189,205,160,0)",
          ]}
          positions={[0, 0.4, 0.7]}
          r={235}
        />
      </Oval>
    </Canvas>
  );
}

/** Figma S6 5~7페이지의 등불 소멸과 회고 문구를 순서대로 표시한다. */
export function TeaDrinkingReflection({ step }: TeaDrinkingReflectionProps) {
  const phaseProgress = useSharedValue(STEP_INDEX[step]);
  const copy = REFLECTION_COPY[step];

  useEffect(() => {
    phaseProgress.value = withTiming(STEP_INDEX[step], {
      duration: S6_REFLECTION_TRANSITION_DURATION_MS,
      easing: Easing.inOut(Easing.cubic),
    });
  }, [phaseProgress, step]);

  const lightStyle = useAnimatedStyle(() => ({
    top: interpolate(phaseProgress.value, [0, 1, 2], [-203, -321, -479]),
  }));
  const initialBackgroundStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      phaseProgress.value,
      [0, 0.8, 1],
      [1, 0, 0],
      Extrapolation.CLAMP,
    ),
  }));

  return (
    <Animated.View
      entering={FadeIn.duration(S6_REFLECTION_TRANSITION_DURATION_MS)}
      style={StyleSheet.absoluteFill}
    >
      <Image source={assets.reflectionBackground} style={styles.background} />
      <Animated.Image
        source={assets.initialBackground}
        style={[styles.background, initialBackgroundStyle]}
      />
      <Animated.View pointerEvents="none" style={[styles.reflectionLight, lightStyle]}>
        <ReflectionLight />
      </Animated.View>
      <BottomGlow />
      <Animated.Text
        key={step}
        entering={FadeIn.duration(S6_REFLECTION_TRANSITION_DURATION_MS)}
        exiting={FadeOut.duration(S6_REFLECTION_TRANSITION_DURATION_MS / 2)}
        style={[
          styles.copy,
          {
            top: copy.top,
            fontSize: copy.fontSize,
            lineHeight: copy.lineHeight,
          },
        ]}
      >
        {copy.text}
      </Animated.Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  background: {
    position: "absolute",
    top: -7,
    left: -69,
    width: 551.123,
    height: 858,
  },
  reflectionLight: {
    position: "absolute",
    left: -60,
    width: 510,
    height: 721.23,
  },
  reflectionLightCanvas: {
    width: 510,
    height: 721.23,
  },
  bottomGlow: {
    position: "absolute",
    top: 478,
    left: 31,
    width: 332,
    height: 332,
  },
  copy: {
    position: "absolute",
    left: 31,
    width: 332,
    color: "#ffffff",
    fontFamily: fontFamily.main,
    textAlign: "center",
  },
});

import { useCallback, useEffect, useMemo, useReducer } from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Image as ExpoImage } from "expo-image";
import Animated, {
  Easing,
  interpolate,
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import {
  BlurMask,
  Canvas,
  Group,
  Oval,
  RadialGradient,
  vec,
} from "@shopify/react-native-skia";

import { fontFamily } from "@/shared/theme";
import { useImpactShared } from "@/shared/sensors";

import { S3_TEA_BAG_LAYOUT } from "../data/s3TeaBagLayout";
import { S3_TAP_SETTINGS } from "../constants/s3Preparation";
import { S3_TEA_OPTIONS } from "../data/s3TeaOptions";
import type { S3TeaDisplayData, S3TeaGlowColor } from "../data/s3TeaOptions";
import { useTeaTapping } from "../hooks/useTeaTapping";
import {
  INITIAL_TEA_PREPARATION_STATE,
  updateTeaPreparationState,
} from "../utils/teaPreparationState";

const DESIGN_WIDTH = 393;
const DESIGN_HEIGHT = 852;

const assets = {
  backgroundLayer1: require("@/assets/images/teaFlow/s5-background-layer-1.png"),
  backgroundLayer2: require("@/assets/images/teaFlow/s5-background-layer-2.png"),
  backgroundLayer3: require("@/assets/images/teaFlow/s5-background-layer-3.png"),
  sensorIcon: require("@/assets/images/teaFlow/s3-sensor-icon.png"),
  teaBag: require("@/assets/images/teaFlow/s3-tea-bag.svg"),
  teapot: require("@/assets/images/teaFlow/s3-teapot.png"),
} as const;

export type TeaPreparationScreenProps = {
  onCompleted?: () => void;
};

function StepIndicator() {
  return (
    <View style={styles.steps}>
      <Text style={styles.inactiveStep}>적기</Text>
      <Text style={styles.activeStep}>
        <Text style={styles.activeStepDot}>●</Text>준비
      </Text>
      <Text style={styles.inactiveStep}>우리기</Text>
      <Text style={styles.inactiveStep}>따르기</Text>
      <Text style={styles.inactiveStep}>마시기</Text>
    </View>
  );
}

type TeaBagProps = {
  animationStarted?: boolean;
  onAnimationCompleted?: () => void;
  onStageReached?: (stage: 2 | 3) => void;
  stage: 1 | 2 | 3;
  tea: S3TeaDisplayData;
};

const AnimatedExpoImage = Animated.createAnimatedComponent(ExpoImage);

function TeaBag({
  animationStarted = false,
  onAnimationCompleted,
  onStageReached,
  stage,
  tea,
}: TeaBagProps) {
  const initialProgress = stage === 1
    ? 0
    : stage === 2
      ? S3_TAP_SETTINGS.stage2Progress
      : 1;
  const animationProgress = useSharedValue(initialProgress);
  const progressInputRange = [0, S3_TAP_SETTINGS.stage2Progress, 1];
  const shellStyle = useAnimatedStyle(() => ({
    height: interpolate(animationProgress.value, progressInputRange, [
      S3_TEA_BAG_LAYOUT[1].height,
      S3_TEA_BAG_LAYOUT[2].height,
      S3_TEA_BAG_LAYOUT[3].height,
    ]),
    left: interpolate(animationProgress.value, progressInputRange, [
      S3_TEA_BAG_LAYOUT[1].left,
      S3_TEA_BAG_LAYOUT[2].left,
      S3_TEA_BAG_LAYOUT[3].left,
    ]),
    top: interpolate(animationProgress.value, progressInputRange, [
      S3_TEA_BAG_LAYOUT[1].top,
      S3_TEA_BAG_LAYOUT[2].top,
      S3_TEA_BAG_LAYOUT[3].top,
    ]),
    transform: [{
      rotate: `${interpolate(animationProgress.value, progressInputRange, [
        S3_TEA_BAG_LAYOUT[1].rotationDegrees,
        S3_TEA_BAG_LAYOUT[2].rotationDegrees,
        S3_TEA_BAG_LAYOUT[3].rotationDegrees,
      ])}deg`,
    }],
    width: interpolate(animationProgress.value, progressInputRange, [
      S3_TEA_BAG_LAYOUT[1].width,
      S3_TEA_BAG_LAYOUT[2].width,
      S3_TEA_BAG_LAYOUT[3].width,
    ]),
  }));
  const contentStyle = useAnimatedStyle(() => ({
    height: interpolate(animationProgress.value, progressInputRange, [
      tea.teaContentLayout[1].height,
      tea.teaContentLayout[2].height,
      tea.teaContentLayout[3].height,
    ]),
    left: interpolate(animationProgress.value, progressInputRange, [
      tea.teaContentLayout[1].left,
      tea.teaContentLayout[2].left,
      tea.teaContentLayout[3].left,
    ]),
    top: interpolate(animationProgress.value, progressInputRange, [
      tea.teaContentLayout[1].top,
      tea.teaContentLayout[2].top,
      tea.teaContentLayout[3].top,
    ]),
    width: interpolate(animationProgress.value, progressInputRange, [
      tea.teaContentLayout[1].width,
      tea.teaContentLayout[2].width,
      tea.teaContentLayout[3].width,
    ]),
  }));

  useAnimatedReaction(
    () => animationProgress.value >= S3_TAP_SETTINGS.stage2Progress,
    (reachedStage2, previouslyReachedStage2) => {
      if (reachedStage2 && !previouslyReachedStage2 && onStageReached) {
        runOnJS(onStageReached)(2);
      }
    },
    [onStageReached],
  );

  useEffect(() => {
    if (!animationStarted) {
      return;
    }

    animationProgress.set(
      withTiming(1, {
        duration: S3_TAP_SETTINGS.animationDurationMs,
        easing: Easing.inOut(Easing.cubic),
      }, (finished) => {
        if (finished && onAnimationCompleted) {
          runOnJS(onAnimationCompleted)();
        }
      }),
    );
  }, [animationProgress, animationStarted, onAnimationCompleted]);

  return (
    <>
      <Animated.Image
        resizeMode="contain"
        source={tea.teaContentImage}
        style={[styles.teaContentImage, contentStyle]}
      />
      <AnimatedExpoImage
        contentFit="fill"
        source={assets.teaBag}
        style={[styles.teaBagAsset, shellStyle]}
      />
    </>
  );
}

type TapGlowProps = {
  color: S3TeaGlowColor;
  stage: 2 | 3;
};

function TapGlow({ color, stage }: TapGlowProps) {
  const isSecondStage = stage === 2;
  const width = isSecondStage ? 254 : 353;
  const height = isSecondStage ? 251 : 348;
  const center = vec(width / 2, height / 2);

  return (
    <Canvas style={isSecondStage ? styles.glowStage2 : styles.glowStage3}>
      <Group opacity={isSecondStage ? 0.13 : 0.22}>
        <Oval
          color={isSecondStage ? color.primary : undefined}
          height={isSecondStage ? 151 : 248}
          width={isSecondStage ? 154 : 253}
          x={50}
          y={50}
        >
          {!isSecondStage && (
            <RadialGradient
              c={center}
              colors={[color.secondary, color.edge]}
              r={126.5}
            />
          )}
          <BlurMask blur={25} style="normal" />
        </Oval>
      </Group>
    </Canvas>
  );
}

type TeaSummaryProps = {
  onChoose: () => void;
  onOpenOptions: () => void;
  tea: S3TeaDisplayData;
};

function TeaSummary({ onChoose, onOpenOptions, tea }: TeaSummaryProps) {
  return (
    <>
      <TeaBag stage={1} tea={tea} />
      <Text style={styles.teaName}>{tea.name}</Text>
      <Text style={styles.teaDescription}>{tea.description}</Text>
      <View style={styles.tags}>
        {tea.tags.map((tag) => (
          <View key={tag} style={styles.tag}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        ))}
      </View>
      <Pressable accessibilityRole="button" onPress={onChoose} style={styles.primaryButton}>
        <Text style={styles.primaryButtonText}>이 차로 할게요</Text>
      </Pressable>
      <Pressable accessibilityRole="button" onPress={onOpenOptions} style={styles.otherTeaButton}>
        <Text style={styles.otherTeaText}>다른 차 고르기</Text>
      </Pressable>
    </>
  );
}

type TeaOptionsSheetProps = {
  onClose: () => void;
  onConfirm: () => void;
  onSelect: (tea: S3TeaDisplayData) => void;
  selectedTea: S3TeaDisplayData;
};

function TeaOptionsSheet({
  onClose,
  onConfirm,
  onSelect,
  selectedTea,
}: TeaOptionsSheetProps) {
  return (
    <View style={StyleSheet.absoluteFill}>
      <Pressable accessibilityLabel="차 선택 닫기" onPress={onClose} style={styles.dim} />
      <View style={styles.bottomSheet}>
        <View style={styles.sheetHandle} />
        <Text style={styles.sheetTitle}>불안·걱정에 어울리는 차</Text>
        <View style={styles.teaOptions}>
          {S3_TEA_OPTIONS.map((tea) => {
            const selected = tea.key === selectedTea.key;
            return (
              <Pressable
                accessibilityRole="radio"
                accessibilityState={{ checked: selected }}
                key={tea.key}
                onPress={() => onSelect(tea)}
                style={[styles.teaOption, selected && styles.selectedTeaOption]}
              >
                <View>
                  <Text style={[styles.optionName, selected && styles.selectedOptionName]}>
                    {tea.name}
                  </Text>
                  <Text style={styles.optionTags}>{tea.tags.join(" · ")}</Text>
                </View>
                {selected && <Text style={styles.check}>✓</Text>}
              </Pressable>
            );
          })}
        </View>
        <Text style={styles.sheetNote}>밤 9시가 넘어서 카페인 없는 차만 보여드려요</Text>
        <Pressable accessibilityRole="button" onPress={onConfirm} style={styles.sheetConfirmButton}>
          <Text style={styles.primaryButtonText}>이 차로 할게요</Text>
        </Pressable>
      </View>
    </View>
  );
}

type SensorGuideProps = {
  requesting: boolean;
  onAllow: () => void;
  onFallback: () => void;
};

function SensorGuide({ onAllow, onFallback, requesting }: SensorGuideProps) {
  return (
    <View style={StyleSheet.absoluteFill}>
      <View style={styles.guideDim} />
      <View style={styles.guideCard}>
        <Image source={assets.sensorIcon} style={styles.sensorIcon} />
        <Text style={styles.guideTitle}>폰을 기울여{"\n"}물을 붓고, 따르고, 마셔요</Text>
        <Text style={styles.guideDescription}>
          다음 창에서 동작 센서 사용을{"\n"}허용해 주세요
        </Text>
        <Pressable
          accessibilityRole="button"
          disabled={requesting}
          onPress={onAllow}
          style={styles.allowButton}
        >
          <Text style={styles.allowButtonText}>{requesting ? "확인 중" : "허용하기"}</Text>
        </Pressable>
        <Pressable accessibilityRole="button" onPress={onFallback} style={styles.fallbackButton}>
          <Text style={styles.fallbackText}>버튼으로 진행하기</Text>
        </Pressable>
      </View>
    </View>
  );
}

type TappingVisualProps = {
  animationStarted: boolean;
  enabled: boolean;
  onAnimationCompleted: () => void;
  onStageReached: (stage: 2 | 3) => void;
  onTap: () => void;
  stage: 1 | 2 | 3;
  tea: S3TeaDisplayData;
};

function TappingVisual({
  animationStarted,
  enabled,
  onAnimationCompleted,
  onStageReached,
  onTap,
  stage,
  tea,
}: TappingVisualProps) {
  const teapotLayout = stage === 1
    ? styles.teapotStage1
    : stage === 2
      ? styles.teapotStage2
      : styles.teapotStage3;

  return (
    <Pressable
      accessibilityHint="화면을 한 번 두드리면 찻잎 넣기가 시작됩니다"
      accessibilityLabel="찻잎 두드리기"
      disabled={!enabled || animationStarted}
      onPress={onTap}
      style={StyleSheet.absoluteFill}
    >
      {stage >= 2 && (
        <>
          <Image source={assets.backgroundLayer1} style={styles.backgroundLayer1} />
          <Image source={assets.backgroundLayer2} style={styles.backgroundLayer2} />
        </>
      )}
      <Image source={assets.backgroundLayer3} style={styles.backgroundLayer3} />
      <StepIndicator />
      {(stage === 2 || stage === 3) && <TapGlow color={tea.glowColor} stage={stage} />}
      <TeaBag
        animationStarted={animationStarted}
        onAnimationCompleted={onAnimationCompleted}
        onStageReached={onStageReached}
        stage={1}
        tea={tea}
      />
      <Image source={assets.teapot} style={[styles.absoluteAsset, teapotLayout]} />
      <Text style={styles.tapInstruction}>찻잎을 두드려 다관에 넣으세요</Text>
    </Pressable>
  );
}

/**
 * S3 추천 차 선택, 센서 안내, 한 번의 탭으로 찻잎을 넣는 흐름을 표시한다.
 * @param props.onCompleted 3/3 비주얼 표시 후 차 우리기 route에서 연결할 완료 callback
 * @returns 오늘의 차 준비 화면
 * 사용처: src/app/tea-preparation
 */
export function TeaPreparationScreen({ onCompleted }: TeaPreparationScreenProps) {
  const { width, height } = useWindowDimensions();
  const [preparation, dispatch] = useReducer(
    updateTeaPreparationState,
    INITIAL_TEA_PREPARATION_STATE,
  );
  const {
    requestPermission,
    status: permissionStatus,
  } = useImpactShared({ enabled: false });
  const selectedTea = useMemo(
    () => S3_TEA_OPTIONS.find((tea) => tea.key === preparation.selectedTeaKey) ??
      S3_TEA_OPTIONS[0],
    [preparation.selectedTeaKey],
  );
  const handleCompleted = useCallback(() => {
    dispatch({ type: "complete" });
    onCompleted?.();
  }, [onCompleted]);
  const tapping = useTeaTapping({
    enabled: preparation.phase === "tapping",
    onCompleted: handleCompleted,
  });
  const scale = Math.min(width / DESIGN_WIDTH, height / DESIGN_HEIGHT);

  const startTappingWithPermission = useCallback(async () => {
    await requestPermission();
    dispatch({ type: "startTapping" });
  }, [requestPermission]);

  const startTappingWithoutPermission = useCallback(() => {
    dispatch({ type: "startTapping" });
  }, []);

  const tappingVisible = preparation.phase === "tapping" || preparation.phase === "completed";

  return (
    <View style={styles.screen}>
      <StatusBar hidden />
      <View style={[styles.canvas, { transform: [{ scale }] }]}>
        {tappingVisible ? (
          <TappingVisual
            animationStarted={tapping.animationStarted}
            enabled={preparation.phase === "tapping"}
            onAnimationCompleted={tapping.completeAnimation}
            onStageReached={tapping.reachVisualStage}
            onTap={tapping.registerTap}
            stage={tapping.visualStage}
            tea={selectedTea}
          />
        ) : (
          <>
            <Image source={assets.backgroundLayer3} style={styles.backgroundLayer3} />
            <StepIndicator />
            <TeaSummary
              onChoose={() => dispatch({ type: "confirmTea" })}
              onOpenOptions={() => dispatch({ type: "openOptions" })}
              tea={selectedTea}
            />
            {preparation.optionsOpen && (
              <TeaOptionsSheet
                onClose={() => dispatch({ type: "closeOptions" })}
                onConfirm={() => dispatch({ type: "confirmTea" })}
                onSelect={(tea) => dispatch({ type: "selectTea", teaKey: tea.key })}
                selectedTea={selectedTea}
              />
            )}
            {preparation.phase === "sensorGuide" && (
              <SensorGuide
                onAllow={() => void startTappingWithPermission()}
                onFallback={startTappingWithoutPermission}
                requesting={permissionStatus === "requesting"}
              />
            )}
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
    overflow: "hidden",
  },
  absoluteAsset: { position: "absolute", resizeMode: "stretch" },
  teaBagAsset: { position: "absolute" },
  teaContentImage: {
    position: "absolute",
  },
  backgroundLayer1: {
    position: "absolute",
    top: 0,
    left: 0,
    width: DESIGN_WIDTH,
    height: DESIGN_HEIGHT,
  },
  backgroundLayer2: {
    position: "absolute",
    top: 0,
    left: 0,
    width: DESIGN_WIDTH,
    height: DESIGN_HEIGHT,
  },
  backgroundLayer3: {
    position: "absolute",
    top: 0,
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
  activeStepDot: { color: "#bee29d" },
  teaName: {
    position: "absolute",
    top: 434,
    left: 24,
    width: 342,
    color: "rgba(237,227,204,0.95)",
    fontFamily: fontFamily.pretendardRegular,
    fontSize: 37,
    lineHeight: 45,
    textAlign: "center",
  },
  teaDescription: {
    position: "absolute",
    top: 481,
    left: 24,
    width: 342,
    color: "#c4b79e",
    fontFamily: fontFamily.pretendardRegular,
    fontSize: 13,
    lineHeight: 21,
    textAlign: "center",
  },
  tags: {
    position: "absolute",
    top: 525,
    left: 0,
    width: DESIGN_WIDTH,
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  tag: {
    height: 28,
    justifyContent: "center",
    paddingHorizontal: 13,
    borderWidth: 1,
    borderColor: "rgba(201,180,140,0.3)",
    borderRadius: 12,
  },
  tagText: {
    color: "#cfc2a6",
    fontFamily: fontFamily.pretendardMedium,
    fontSize: 12,
  },
  primaryButton: {
    position: "absolute",
    top: 720,
    left: 45,
    width: 300,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 26,
    backgroundColor: "#e9e1cf",
  },
  primaryButtonText: {
    color: "#1a1712",
    fontFamily: fontFamily.pretendardRegular,
    fontSize: 20,
    lineHeight: 29,
    textAlign: "center",
  },
  otherTeaButton: {
    position: "absolute",
    top: 784,
    left: 24,
    width: 342,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  otherTeaText: {
    color: "rgba(200,186,150,0.45)",
    fontFamily: fontFamily.pretendardBold,
    fontSize: 12,
    lineHeight: 20,
  },
  dim: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: "rgba(26,26,26,0.7)",
  },
  bottomSheet: {
    position: "absolute",
    top: 448,
    left: 0,
    width: DESIGN_WIDTH,
    height: 404,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: "rgba(67,70,62,0.96)",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.5,
    shadowRadius: 40,
  },
  sheetHandle: {
    position: "absolute",
    top: 10,
    left: 176.5,
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#4a443a",
  },
  sheetTitle: {
    position: "absolute",
    top: 32,
    left: 24,
    width: 345,
    color: "rgba(255,255,255,0.95)",
    fontFamily: fontFamily.pretendardRegular,
    fontSize: 16,
    lineHeight: 27,
    textAlign: "center",
  },
  teaOptions: {
    position: "absolute",
    top: 76,
    left: 24,
    width: 345,
    gap: 10,
  },
  teaOption: {
    height: 65,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    borderRadius: 14,
  },
  selectedTeaOption: {
    paddingLeft: 16,
    paddingRight: 20,
    borderColor: "#ffffff",
    backgroundColor: "rgba(155,224,58,0.08)",
  },
  optionName: {
    color: "#d9cdb2",
    fontFamily: fontFamily.pretendardRegular,
    fontSize: 15,
    lineHeight: 22,
  },
  selectedOptionName: { color: "#f2e2b0" },
  optionTags: {
    color: "#bababa",
    fontFamily: fontFamily.pretendardRegular,
    fontSize: 11,
    lineHeight: 13,
  },
  check: {
    color: "#fffcfc",
    fontFamily: fontFamily.pretendardRegular,
    fontSize: 16,
    lineHeight: 23,
  },
  sheetNote: {
    position: "absolute",
    top: 226,
    left: 24,
    width: 345,
    color: "#d9d9d9",
    fontFamily: fontFamily.pretendardRegular,
    fontSize: 11,
    lineHeight: 19,
    textAlign: "center",
  },
  sheetConfirmButton: {
    position: "absolute",
    top: 292,
    left: 44,
    width: 300,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 26,
    backgroundColor: "#e9e1cf",
  },
  guideDim: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: "rgba(59,59,59,0.7)",
  },
  guideCard: {
    position: "absolute",
    top: 250,
    left: 30,
    width: 330,
    height: 311,
    borderRadius: 22,
    backgroundColor: "rgba(44,43,32,0.98)",
  },
  sensorIcon: {
    position: "absolute",
    top: 28,
    left: 145,
    width: 40,
    height: 40,
  },
  guideTitle: {
    position: "absolute",
    top: 82,
    left: 22,
    width: 286,
    color: "#ede3cc",
    fontFamily: fontFamily.pretendardRegular,
    fontSize: 18,
    lineHeight: 26,
    textAlign: "center",
  },
  guideDescription: {
    position: "absolute",
    top: 146,
    left: 22,
    width: 286,
    color: "#a0a0a0",
    fontFamily: fontFamily.pretendardRegular,
    fontSize: 12,
    lineHeight: 20,
    textAlign: "center",
  },
  allowButton: {
    position: "absolute",
    top: 207,
    left: 22,
    width: 286,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 24,
    backgroundColor: "#e9e1cf",
  },
  allowButtonText: {
    color: "#1a1712",
    fontFamily: fontFamily.pretendardBold,
    fontSize: 14,
    lineHeight: 17,
  },
  fallbackButton: {
    position: "absolute",
    top: 263,
    left: 22,
    width: 286,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  fallbackText: {
    color: "#a0a0a0",
    fontFamily: fontFamily.pretendardRegular,
    fontSize: 12,
    lineHeight: 16,
  },
  glowStage2: {
    position: "absolute",
    top: 343,
    left: 86,
    width: 254,
    height: 251,
  },
  glowStage3: {
    position: "absolute",
    top: 259,
    left: 20,
    width: 353,
    height: 348,
  },
  teapotStage1: { left: 79, top: 375, width: 235, height: 235 },
  teapotStage2: { left: 62, top: 300, width: 287, height: 287 },
  teapotStage3: { left: 15, top: 223, width: 364, height: 364 },
  tapInstruction: {
    position: "absolute",
    top: 620,
    left: 24,
    width: 342,
    color: "#dcdcdc",
    fontFamily: fontFamily.pretendardBold,
    fontSize: 14,
    lineHeight: 23,
    textAlign: "center",
  },
});

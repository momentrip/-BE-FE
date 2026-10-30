import { Canvas, LinearGradient, Oval, Path, RadialGradient, vec } from "@shopify/react-native-skia";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Image, Pressable, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import { fontFamily } from "@/shared/theme";

import { useTodayLanternFeed } from "../hooks/useTodayLanternFeed";
import { useTodayReleaseStatus } from "../hooks/useTodayReleaseStatus";
import type { LanternFeedItem } from "../types";
import type { LanternPosition } from "../utils/lanternLayout";
import { getLanternSlotPosition, MAX_VISIBLE_LANTERNS } from "../utils/lanternLayout";
import { LanternDetailModal } from "./LanternDetailModal";

type SelectedLantern = {
  item: LanternFeedItem;
  slot: LanternPosition;
};

const DESIGN_WIDTH = 393;
const DESIGN_HEIGHT = 852;

const screenAssets = {
  background: require("@/assets/images/mainpage/bg_main.png"),
  lantern: require("@/assets/images/mainpage/lantern.png"),
  table: require("@/assets/images/mainpage/table.png"),
  teacupEmpty: require("@/assets/images/mainpage/teacup_empty.png"),
  teacupFull: require("@/assets/images/mainpage/teacup_full.png"),
  teacupThin: require("@/assets/images/mainpage/teacup_thin.png"),
} as const;

const LIGHT_BEAM_BOX = { top: -139, left: 42, width: 308, height: 421.5 };

function LightBeam() {
  const { width, height } = LIGHT_BEAM_BOX;
  const topWidth = 60;
  const beamPath = `M${(width - topWidth) / 2},0 L${(width + topWidth) / 2},0 L${width},${height} L0,${height} Z`;

  return (
    <Canvas
      style={[
        styles.lightBeam,
        { top: LIGHT_BEAM_BOX.top, left: LIGHT_BEAM_BOX.left, width, height },
      ]}
    >
      <Path path={beamPath}>
        <LinearGradient
          start={vec(width / 2, 0)}
          end={vec(width / 2, height)}
          colors={["rgba(248, 133, 67, 0.55)", "rgba(237,122,56,0)"]}
        />
      </Path>
      <Oval x={width / 2 - 90} y={-40} width={180} height={180}>
        <RadialGradient
          c={vec(90, 50)}
          r={90}
          colors={["rgba(117, 51, 0, 0.8)", "rgba(255,150,70,0)"]}
        />
      </Oval>
    </Canvas>
  );
}

export function LanternGlow({ size, style }: { size: number; style: { top: number; left: number } }) {
  return (
    <Canvas style={[styles.lanternGlowCanvas, style, { width: size, height: size }]}>
      <Oval x={0} y={0} width={size} height={size}>
        <RadialGradient
          c={vec(size / 2, size / 2)}
          r={size / 2}
          colors={["rgba(255,190,120,0.85)", "rgba(255,150,70,0)"]}
        />
      </Oval>
    </Canvas>
  );
}

// 풍등마다 <Canvas>를 따로 만들면(최대 16개) 기기 GPU 리소스 한계에 걸려 일부만 그려진다.
// 그래서 글로우는 풍등 하나당 Canvas 하나가 아니라, 밭 전체를 Canvas 하나로 묶어서 그린다.
function LanternGlowField({ items }: { items: LanternFeedItem[] }) {
  return (
    <Canvas style={styles.lanternGlowField}>
      {items.slice(0, MAX_VISIBLE_LANTERNS).map((item, index) => {
        const slot = getLanternSlotPosition(index);
        const glowSize = Math.max(slot.width, slot.height) * 1.8;
        const cx = slot.left + slot.width / 2;
        const cy = slot.top + slot.height / 2;
        return (
          <Oval key={item.id} x={cx - glowSize / 2} y={cy - glowSize / 2} width={glowSize} height={glowSize}>
            <RadialGradient
              c={vec(cx, cy)}
              r={glowSize / 2}
              colors={["rgba(255,190,120,0.85)", "rgba(255,150,70,0)"]}
            />
          </Oval>
        );
      })}
    </Canvas>
  );
}

function getTodayLabel(): string {
  const today = new Date();
  return `${today.getMonth() + 1}월 ${today.getDate()}일 오늘의 하늘`;
}

function SwayingLantern({
  item,
  slot,
  onSelect,
}: {
  item: LanternFeedItem;
  slot: LanternPosition;
  onSelect: (lantern: LanternFeedItem, slot: LanternPosition) => void;
}) {
  const rotation = useSharedValue(0);
  const bobY = useSharedValue(0);

  useEffect(() => {
    // 풍등마다 흔들리는 각도·오르내리는 폭·박자·시작 타이밍을 조금씩 다르게 줘서 제각각 움직이게 한다.
    const rotateAmplitude = 6 + (item.id % 5);
    const rotateDuration = 1600 + (item.id % 5) * 150;
    const bobAmplitude = 6 + (item.id % 4) * 2;
    const bobDuration = 1400 + (item.id % 4) * 180;
    const startDelay = (item.id % 7) * 120;

    rotation.value = withDelay(
      startDelay,
      withRepeat(
        withSequence(
          withTiming(-rotateAmplitude, { duration: rotateDuration }),
          withTiming(rotateAmplitude, { duration: rotateDuration }),
        ),
        -1,
        true,
      ),
    );
    bobY.value = withDelay(
      startDelay,
      withRepeat(
        withSequence(
          withTiming(-bobAmplitude, { duration: bobDuration }),
          withTiming(bobAmplitude, { duration: bobDuration }),
        ),
        -1,
        true,
      ),
    );
  }, [item.id, rotation, bobY]);

  const swayStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: bobY.value }, { rotate: `${rotation.value}deg` }],
  }));

  return (
    <Pressable
      style={[
        styles.lanternSlot,
        { top: slot.top, left: slot.left, width: slot.width, height: slot.height },
      ]}
      onPress={() => onSelect(item, slot)}
    >
      <Animated.View style={[styles.lanternSwayInner, swayStyle]}>
        <Image
          source={screenAssets.lantern}
          style={{ width: slot.width, height: slot.height }}
          resizeMode="contain"
        />
      </Animated.View>
    </Pressable>
  );
}

function LanternField({
  items,
  onSelect,
}: {
  items: LanternFeedItem[];
  onSelect: (lantern: LanternFeedItem, slot: LanternPosition) => void;
}) {
  return (
    <>
      {items.slice(0, MAX_VISIBLE_LANTERNS).map((item, index) => (
        <SwayingLantern
          key={item.id}
          item={item}
          slot={getLanternSlotPosition(index)}
          onSelect={onSelect}
        />
      ))}
    </>
  );
}

const TEACUP_TAP_LIFT = 16;

function TeacupArea({ hasReleasedToday }: { hasReleasedToday: boolean }) {
  const [isTapped, setIsTapped] = useState(false);

  return (
    <View style={styles.teacupArea}>
      <Image source={screenAssets.table} style={styles.table} />
      <Pressable onPress={() => setIsTapped((current) => !current)}>
        <Image
          source={isTapped ? screenAssets.teacupFull : screenAssets.teacupEmpty}
          style={[styles.teacup, isTapped && { top: -TEACUP_TAP_LIFT }]}
        />
        {hasReleasedToday && (
          <Image
            source={screenAssets.teacupThin}
            style={[styles.teacupSecond, isTapped && { top: -TEACUP_TAP_LIFT }]}
          />
        )}
      </Pressable>
    </View>
  );
}

/**
 * Figma S1 메인 화면("번뇌 날리기(처음)", node 384:2005). 오늘 날짜, 오늘 날린 풍등 밭(실시간),
 * 개인 찻잔 영역, 고민 적기로 가는 CTA 버튼을 보여준다.
 * @returns S1 화면
 * 사용처: src/app/index.tsx
 */
export function HomeScreen() {
  const { width, height } = useWindowDimensions();
  const { count, items } = useTodayLanternFeed();
  const { hasReleasedToday } = useTodayReleaseStatus();
  const [selected, setSelected] = useState<SelectedLantern | null>(null);
  const scale = Math.min(width / DESIGN_WIDTH, height / DESIGN_HEIGHT);

  return (
    <View style={styles.screen}>
      <StatusBar hidden />
      <View style={[styles.canvas, { transform: [{ scale }] }]}>
        <Image source={screenAssets.background} style={styles.background} resizeMode="cover" />
        <LightBeam />

        <View style={styles.dateRow}>
          <View style={styles.dotCircle} />
          <Text style={styles.dateText}>{getTodayLabel()}</Text>
        </View>

        <LanternGlowField items={items} />
        <LanternField items={items} onSelect={(item, slot) => setSelected({ item, slot })} />

        <Text style={styles.countText}>지금 {count}개의 풍등이 오르고있어요.</Text>

        <TeacupArea hasReleasedToday={hasReleasedToday} />

        <Pressable style={styles.ctaButton} onPress={() => router.push("/worry")}>
          <Text style={styles.ctaButtonText}>오늘의 번뇌 날리기</Text>
        </Pressable>

        <Text style={styles.footerText}>
          {hasReleasedToday ? "내일 밤, 다시 찻잔을 비워둘게요" : "하루에 한 잔, 오늘의 번뇌는 없으신가요?"}
        </Text>
      </View>

      <LanternDetailModal
        lantern={selected?.item ?? null}
        slot={selected?.slot ?? null}
        onClose={() => setSelected(null)}
      />
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
    top: 0,
    left: 0,
    width: DESIGN_WIDTH,
    height: DESIGN_HEIGHT,
  },
  dateRow: {
    position: "absolute",
    top: 84,
    width: DESIGN_WIDTH,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  dotCircle: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#ffffff",
  },
  dateText: {
    color: "#ffffff",
    fontFamily: fontFamily.pretendardMedium,
    fontSize: 13,
  },
  lanternGlowField: {
    position: "absolute",
    top: 0,
    left: 0,
    width: DESIGN_WIDTH,
    height: DESIGN_HEIGHT,
  },
  lanternSlot: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  lanternSwayInner: {
    width: "100%",
    height: "100%",
  },
  lightBeam: {
    position: "absolute",
  },
  lanternGlowCanvas: {
    position: "absolute",
  },
  countText: {
    position: "absolute",
    top: 557,
    width: DESIGN_WIDTH,
    textAlign: "center",
    color: "#ffffff",
    fontFamily: fontFamily.main,
    fontSize: 19,
  },
  teacupArea: {
    position: "absolute",
    top: 629,
    left: 0,
    width: DESIGN_WIDTH,
    height: 39,
  },
  table: {
    position: "absolute",
    top: 13,
    left: 135,
    width: 120,
    height: 26,
  },
  teacup: {
    position: "absolute",
    top: 0,
    left: 182,
    width: 26,
    height: 19,
  },
  teacupSecond: {
    position: "absolute",
    top: 0,
    left: 215,
    width: 14,
    height: 19,
  },
  ctaButton: {
    position: "absolute",
    top: 710,
    left: (DESIGN_WIDTH - 268) / 2,
    width: 268,
    height: 60,
    borderRadius: 50,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
  },
  ctaButtonText: {
    color: "#000000",
    fontFamily: fontFamily.sub3,
    fontSize: 24,
  },
  footerText: {
    position: "absolute",
    top: 780,
    width: DESIGN_WIDTH,
    textAlign: "center",
    color: "#b7b7b7",
    fontFamily: fontFamily.pretendardSemiBold,
    fontSize: 13,
    textShadowColor: "rgba(0,0,0,0.6)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
});

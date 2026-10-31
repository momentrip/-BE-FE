import { useEffect } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming } from "react-native-reanimated";

import { fontFamily } from "@/shared/theme";

import { ZenBackButton } from "./ZenBackButton";
import { DESIGN_WIDTH, zenAssets, zenLayoutStyles } from "./zenLayout";

/** Figma s8 "오늘의 찻잔1". 화면을 탭하면 선어가 드러나는 2단계로 넘어간다. */
export function ZenFlow1Intro({ onReveal, onBack }: { onReveal: () => void; onBack: () => void }) {
  const hintOpacity = useSharedValue(1);

  useEffect(() => {
    hintOpacity.value = withRepeat(withTiming(0.2, { duration: 900 }), -1, true);
  }, [hintOpacity]);

  const hintStyle = useAnimatedStyle(() => ({ opacity: hintOpacity.value }));

  return (
    <Pressable style={StyleSheet.absoluteFill} onPress={onReveal}>
      <Image source={zenAssets.background} style={zenLayoutStyles.background} resizeMode="cover" />
      <ZenBackButton onBack={onBack} />
      <Text style={styles.title}>오늘의 찻잔</Text>

      <View style={styles.cupWrap}>
        <Image source={zenAssets.teaCupDefault} style={styles.cup} resizeMode="contain" />
      </View>

      <Text style={styles.caption}>찻잔 바닥에 무언가 새겨져 있어요</Text>
      <Animated.Text style={[styles.hint, hintStyle]}>화면을 클릭하세요</Animated.Text>
    </Pressable>
  );
}

const CUP_SIZE = 220;

const styles = StyleSheet.create({
  title: {
    position: "absolute",
    top: 90,
    width: DESIGN_WIDTH,
    textAlign: "center",
    color: "#c9bc9f",
    fontFamily: fontFamily.sub3,
    fontSize: 16,
  },
  cupWrap: {
    position: "absolute",
    top: 180,
    left: (DESIGN_WIDTH - CUP_SIZE) / 2 - 10,
    width: CUP_SIZE,
    height: CUP_SIZE + 1,
  },
  cup: {
    width: CUP_SIZE,
    height: CUP_SIZE + 1,
  },
  caption: {
    position: "absolute",
    top: 499,
    width: DESIGN_WIDTH,
    textAlign: "center",
    color: "rgba(220,205,170,0.7)",
    fontFamily: fontFamily.pretendardRegular,
    fontSize: 13,
  },
  hint: {
    position: "absolute",
    top: 760,
    width: DESIGN_WIDTH,
    textAlign: "center",
    color: "#ffffff",
    fontFamily: fontFamily.pretendardMedium,
    fontSize: 12,
  },
});

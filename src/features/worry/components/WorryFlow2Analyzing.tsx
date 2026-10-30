import { Image, Pressable, StyleSheet, Text, View } from "react-native";

import { fontFamily } from "@/shared/theme";

import { BackButton } from "./BackButton";
import { DESIGN_WIDTH, worryLayoutStyles } from "./worryLayout";

const screenAssets = {
  flow2: require("@/assets/images/worry/s2_flow2.png"),
  chip: require("@/assets/images/worry/worry_chip_small.png"),
} as const;

const CHIP_WIDTH = 78;
const CHIP_HEIGHT = 103;

/**
 * Figma s2 Flow2-2(번뇌 분석 중). 3초 동안은 "분석 중"(비활성) 버튼만 뜨고,
 * 지나면 "번뇌 유형 확인하기" 버튼이 활성화된다 — 눌러야 result로 넘어간다 (WorryScreen에서 제어).
 */
export function WorryFlow2Analyzing({
  worryText,
  isDone,
  onConfirm,
  onBack,
}: {
  worryText: string;
  isDone: boolean;
  onConfirm: () => void;
  onBack: () => void;
}) {
  return (
    <View style={StyleSheet.absoluteFill}>
      <Image source={screenAssets.flow2} style={worryLayoutStyles.background} resizeMode="cover" />
      <BackButton onBack={onBack} />
      <Text style={styles.sectionTitle}>오늘의 고민</Text>
      <Text style={styles.analyzingMessage}>작성해주신 번뇌를{"\n"}분석 중이에요</Text>

      <Image source={screenAssets.chip} style={styles.chipImage} resizeMode="cover" />
      <Text style={styles.chipText} numberOfLines={2}>
        {worryText}
      </Text>

      {isDone ? (
        <Pressable style={styles.pillButton} onPress={onConfirm}>
          <Text style={styles.pillButtonText}>번뇌 유형 확인하기</Text>
        </Pressable>
      ) : (
        <View style={[styles.pillButton, styles.pillButtonDisabled]}>
          <Text style={[styles.pillButtonText, styles.pillButtonTextDisabled]}>분석 중</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    position: "absolute",
    top: 100,
    width: DESIGN_WIDTH,
    textAlign: "center",
    color: "#ffffff",
    fontFamily: fontFamily.sub3,
    fontSize: 24,
  },
  analyzingMessage: {
    position: "absolute",
    top: 196,
    width: DESIGN_WIDTH,
    textAlign: "center",
    color: "#ffffff",
    fontFamily: fontFamily.main,
    fontSize: 40,
    lineHeight: 50,
  },
  chipImage: {
    position: "absolute",
    top: 328,
    left: 159,
    width: CHIP_WIDTH,
    height: CHIP_HEIGHT,
  },
  chipText: {
    position: "absolute",
    top: 473,
    width: DESIGN_WIDTH,
    color: "#a9a9a9",
    fontFamily: fontFamily.pretendardExtraBold,
    fontSize: 17,
    lineHeight: 27.2,
    textAlign: "center",
  },
  pillButton: {
    position: "absolute",
    bottom: 110,
    left: (DESIGN_WIDTH - 216) / 2,
    width: 216,
    height: 48,
    borderRadius: 50,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
  },
  pillButtonDisabled: {
    backgroundColor: "rgba(255,255,255,0.5)",
  },
  pillButtonText: {
    color: "#363636",
    fontFamily: fontFamily.sub3,
    fontSize: 18,
  },
  pillButtonTextDisabled: {
    color: "rgba(54,54,54,0.6)",
  },
});

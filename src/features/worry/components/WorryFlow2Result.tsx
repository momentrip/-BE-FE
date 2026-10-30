import { Image, Pressable, StyleSheet, Text, View } from "react-native";

import type { WorryKind } from "@/shared/constants";
import { WORRY_KIND_LABEL } from "@/shared/constants";
import { fontFamily } from "@/shared/theme";

import { BackButton } from "./BackButton";
import { WorryResultCard } from "./WorryCard";
import { DESIGN_WIDTH, worryLayoutStyles } from "./worryLayout";

const screenAssets = {
  flow2: require("@/assets/images/worry/s2_flow2.png"),
} as const;

/** Figma s2 Flow2-3(풍등 띄우기). 입력 화면과 같은 풀사이즈 카드로 번뇌 전문을 다시 보여준다. */
export function WorryFlow2Result({
  worryText,
  worryKind,
  sameCount,
  onSubmit,
  onBack,
}: {
  worryText: string;
  worryKind: WorryKind;
  sameCount: number;
  onSubmit: () => void;
  onBack: () => void;
}) {
  return (
    <View style={StyleSheet.absoluteFill}>
      <Image source={screenAssets.flow2} style={worryLayoutStyles.background} resizeMode="cover" />
      <BackButton onBack={onBack} />
      <Text style={styles.sectionTitle}>오늘의 고민</Text>

      <View style={styles.resultCard}>
        <WorryResultCard worryText={worryText} />
      </View>

      <Text style={styles.resultLabel}>번뇌 유형</Text>
      <Text style={styles.resultValue}>{WORRY_KIND_LABEL[worryKind]}</Text>
      <Text style={styles.sameCount}>오늘 같은 고민을 띄운 사람 {sameCount}명</Text>

      <Pressable style={[styles.pillButton, styles.resultButton]} onPress={onSubmit}>
        <Text style={styles.pillButtonText}>풍등 띄우기</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  resultCard: {
    position: "absolute",
    top: 140,
    left: 0,
  },
  sectionTitle: {
    position: "absolute",
    top: 100,
    width: DESIGN_WIDTH,
    textAlign: "center",
    color: "#ffffff",
    fontFamily: fontFamily.sub3,
    fontSize: 24,
  },
  resultLabel: {
    position: "absolute",
    top: 452,
    width: DESIGN_WIDTH,
    textAlign: "center",
    color: "#ffffff",
    fontFamily: fontFamily.sub3,
    fontSize: 19.6,
  },
  resultValue: {
    position: "absolute",
    top: 486,
    width: DESIGN_WIDTH,
    textAlign: "center",
    color: "#e0e0e0",
    fontFamily: fontFamily.main,
    fontSize: 48,
  },
  sameCount: {
    position: "absolute",
    top: 578,
    width: DESIGN_WIDTH,
    textAlign: "center",
    color: "rgba(220,205,170,0.7)",
    fontFamily: fontFamily.pretendardSemiBold,
    fontSize: 12,
  },
  pillButton: {
    position: "absolute",
    bottom: 56,
    left: (DESIGN_WIDTH - 216) / 2,
    width: 216,
    height: 48,
    borderRadius: 50,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
  },
  resultButton: {
    bottom: 110,
  },
  pillButtonText: {
    color: "#363636",
    fontFamily: fontFamily.sub3,
    fontSize: 18,
  },
});

import { Image, Pressable, StyleSheet, Text, View } from "react-native";

import type { WorryKind } from "@/shared/constants";
import { WORRY_KIND_LABEL } from "@/shared/constants";
import { fontFamily } from "@/shared/theme";

import { BackButton } from "./BackButton";
import { BlinkingHint } from "./BlinkingHint";
import { ReleasedLantern } from "./ReleasedLantern";
import { DESIGN_WIDTH, worryLayoutStyles } from "./worryLayout";

const screenAssets = {
  mainBackground: require("@/assets/images/mainpage/bg_main.png"),
  table: require("@/assets/images/mainpage/table.png"),
  teacupEmpty: require("@/assets/images/mainpage/teacup_empty.png"),
  teacupThin: require("@/assets/images/mainpage/teacup_thin.png"),
} as const;

function getTodayLabel(): string {
  const today = new Date();
  return `${today.getMonth() + 1}월 ${today.getDate()}일 오늘의 하늘`;
}

/** Figma s2 Flow3("풍등이 떠올랐어요"). 탭하면 teaFlow 준비 화면으로 넘어간다. */
export function WorryFlow3Released({
  worryKind,
  onNext,
  onBack,
}: {
  worryKind: WorryKind;
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <Pressable style={StyleSheet.absoluteFill} onPress={onNext}>
      <Image
        source={screenAssets.mainBackground}
        style={worryLayoutStyles.background}
        resizeMode="cover"
      />

      <BackButton onBack={onBack} />

      <View style={styles.dateRow}>
        <View style={styles.dotCircle} />
        <Text style={styles.dateText}>{getTodayLabel()}</Text>
      </View>

      <View style={styles.releasedLanternBox}>
        <ReleasedLantern />
      </View>
      <Text style={styles.releasedTitle}>풍등이 떠올랐어요</Text>
      <Text style={styles.releasedCaption}>이제 차를 준비 할게요</Text>

      <Text style={styles.todayWorryLabel}>오늘 날린 번뇌</Text>
      <Text style={styles.todayWorryValue}>{WORRY_KIND_LABEL[worryKind]}</Text>

      <View style={styles.teacupArea}>
        <Image source={screenAssets.table} style={styles.table} />
        <Image source={screenAssets.teacupEmpty} style={styles.teacup} />
        <Image source={screenAssets.teacupThin} style={styles.teacupSecond} />
      </View>

      <BlinkingHint />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  dateRow: {
    position: "absolute",
    top: 83,
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
  releasedLanternBox: {
    position: "absolute",
    top: 138,
    left: 70,
  },
  releasedTitle: {
    position: "absolute",
    top: 339,
    width: DESIGN_WIDTH,
    textAlign: "center",
    color: "#f2ffff",
    fontFamily: fontFamily.main,
    fontSize: 36,
  },
  releasedCaption: {
    position: "absolute",
    top: 407,
    width: DESIGN_WIDTH,
    textAlign: "center",
    color: "#b7b7b7",
    fontFamily: fontFamily.pretendardSemiBold,
    fontSize: 13,
  },
  todayWorryLabel: {
    position: "absolute",
    top: 632,
    width: DESIGN_WIDTH,
    textAlign: "center",
    color: "#b7b7b7",
    fontFamily: fontFamily.pretendardSemiBold,
    fontSize: 13,
  },
  todayWorryValue: {
    position: "absolute",
    top: 656,
    width: DESIGN_WIDTH,
    textAlign: "center",
    color: "#e9e9e9",
    fontFamily: fontFamily.pretendardExtraBold,
    fontSize: 18,
  },
  teacupArea: {
    position: "absolute",
    top: 700,
    left: 0,
    width: DESIGN_WIDTH,
    height: 39,
  },
  table: {
    position: "absolute",
    top: 11,
    left: 136,
    width: 120,
    height: 26,
  },
  teacup: {
    position: "absolute",
    top: 0,
    left: 180,
    width: 26,
    height: 19,
  },
  teacupSecond: {
    position: "absolute",
    top: 0,
    left: 213,
    width: 14,
    height: 19,
  },
});

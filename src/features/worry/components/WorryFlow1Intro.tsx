import { Image, Pressable, StyleSheet, Text } from "react-native";

import { fontFamily } from "@/shared/theme";

import type { WorryIntroCopy } from "../data/worryIntroCopy";
import { BackButton } from "./BackButton";
import { BlinkingHint } from "./BlinkingHint";
import { DESIGN_WIDTH, worryLayoutStyles } from "./worryLayout";

const screenAssets = {
  flow1: require("@/assets/images/worry/s2_flow1.png"),
} as const;

/** Figma s2 Flow1("다선의 시간" 01/02, 03/04). intro1/intro2 둘 다 copy만 바꿔서 이 컴포넌트를 쓴다. */
export function WorryFlow1Intro({
  copy,
  onNext,
  onBack,
}: {
  copy: WorryIntroCopy;
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <Pressable style={StyleSheet.absoluteFill} onPress={onNext}>
      <Image source={screenAssets.flow1} style={worryLayoutStyles.background} resizeMode="cover" />

      <BackButton onBack={onBack} />

      <Text style={styles.introTitle}>{copy.title}</Text>

      <Text style={[styles.introNumber, { top: 190 }]}>{copy.top.number}</Text>
      <Text style={[styles.introQuote, { top: 225 }]}>{copy.top.quote}</Text>
      <Text style={[styles.introCaption, { top: 287 }]}>{copy.top.caption}</Text>

      <Text style={[styles.introNumber, { top: 481 }]}>{copy.bottom.number}</Text>
      <Text style={[styles.introQuote, { top: 516 }]}>{copy.bottom.quote}</Text>
      <Text style={[styles.introCaption, { top: 569 }]}>{copy.bottom.caption}</Text>

      <BlinkingHint />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  introTitle: {
    position: "absolute",
    top: 100,
    width: DESIGN_WIDTH,
    textAlign: "center",
    color: "#ffffff",
    fontFamily: fontFamily.sub3,
    fontSize: 30,
  },
  introNumber: {
    position: "absolute",
    width: DESIGN_WIDTH,
    textAlign: "center",
    color: "#ffffff",
    fontFamily: fontFamily.pretendardMedium,
    fontSize: 12,
  },
  introQuote: {
    position: "absolute",
    width: DESIGN_WIDTH,
    textAlign: "center",
    color: "#ffffff",
    fontFamily: fontFamily.main,
    fontSize: 20,
    lineHeight: 28,
  },
  introCaption: {
    position: "absolute",
    width: DESIGN_WIDTH,
    textAlign: "center",
    color: "#b2aa95",
    fontFamily: fontFamily.pretendardMedium,
    fontSize: 12,
    lineHeight: 18,
  },
});

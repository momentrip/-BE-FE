import { Image, StyleSheet, Text, View } from "react-native";

import { fontFamily } from "@/shared/theme";

import { WORRY_RESULT_TEXT_WIDTH } from "./worryLayout";

export const CARD_LEFT = 105;
export const CARD_TOP = 158;
export const CARD_WIDTH = 182;
export const CARD_HEIGHT = 242;

export const RESULT_CARD_WIDTH = 393;
export const RESULT_CARD_HEIGHT = 432;

const cardAssets = {
  dark: require("@/assets/images/worry/worry_card_dark.png"),
  lit1: require("@/assets/images/worry/worry_card_lit1.png"),
  lit2: require("@/assets/images/worry/worry_card_lit2.png"),
} as const;

/**
 * 번뇌 입력 카드의 배경(작은 등불 모양, 182x242). input 화면에서 TextInput 아래 깐다.
 * canSubmit에 따라 안 켜진/켜진(lit1) 버전으로 바뀐다.
 */
export function WorryCardBackground({ isLit }: { isLit: boolean }) {
  return (
    <Image
      source={isLit ? cardAssets.lit1 : cardAssets.dark}
      style={styles.cardImage}
      resizeMode="cover"
    />
  );
}

/** 번뇌 전문을 다시 보여주는 결과 카드(lit2, 풀와이드). result 단계에서만 쓴다. */
export function WorryResultCard({ worryText }: { worryText: string }) {
  return (
    <View style={styles.resultCard}>
      <Image source={cardAssets.lit2} style={styles.resultCardImage} resizeMode="cover" />
      <Text style={styles.resultCardText} numberOfLines={6}>
        {worryText}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  cardImage: {
    position: "absolute",
    top: 0,
    left: 0,
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
  },
  resultCard: {
    width: RESULT_CARD_WIDTH,
    height: RESULT_CARD_HEIGHT - 128,
    alignItems: "center",
    justifyContent: "center",
  },
  resultCardImage: {
    position: "absolute",
    top: 0,
    left: 0,
    width: RESULT_CARD_WIDTH,
    height: RESULT_CARD_HEIGHT - 128,
  },
  resultCardText: {
    width: WORRY_RESULT_TEXT_WIDTH,
    color: "#3d3d3d",
    fontFamily: fontFamily.sub3,
    fontSize: 18,
    textAlign: "center",
  },
});

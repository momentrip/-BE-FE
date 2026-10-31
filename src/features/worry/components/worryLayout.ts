import { StyleSheet } from "react-native";

export const DESIGN_WIDTH = 393;
export const DESIGN_HEIGHT = 852;

/**
 * Flow2 Analyzing/Result 화면에서 번뇌 텍스트가 줄바꿈되는 폭.
 * 결과 카드(worry_card_lit2) 안의 등불 패널 실측 폭(~187px)보다 여유 있게 좁혀서,
 * 패널 가장자리에 닿지 않게 하고, 두 화면이 같은 폭을 써서 줄바꿈 지점도 맞춘다.
 */
export const WORRY_RESULT_TEXT_WIDTH = 150;

/** 모든 Flow 화면이 공유하는 배경 이미지 스타일. */
export const worryLayoutStyles = StyleSheet.create({
  background: {
    position: "absolute",
    top: 0,
    left: 0,
    width: DESIGN_WIDTH,
    height: DESIGN_HEIGHT,
  },
});

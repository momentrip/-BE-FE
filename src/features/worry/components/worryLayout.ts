import { StyleSheet } from "react-native";

export const DESIGN_WIDTH = 393;
export const DESIGN_HEIGHT = 852;

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

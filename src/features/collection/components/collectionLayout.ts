import { StyleSheet } from "react-native";

export const DESIGN_WIDTH = 393;
export const DESIGN_HEIGHT = 852;

export const collectionAssets = {
  background: require("@/assets/images/zen/s8_bg.png"),
  teaCupDefault: require("@/assets/images/zen/teaCup_default.png"),
  teaCupMini: require("@/assets/images/zen/teaCup_mini.png"),
  table: require("@/assets/images/mainpage/table.png"),
  teacupEmpty: require("@/assets/images/mainpage/teacup_empty.png"),
  teacupThin: require("@/assets/images/mainpage/teacup_thin.png"),
} as const;

/** 모든 s9 화면이 공유하는 배경 이미지 스타일. */
export const collectionLayoutStyles = StyleSheet.create({
  background: {
    position: "absolute",
    top: 0,
    left: 0,
    width: DESIGN_WIDTH,
    height: DESIGN_HEIGHT,
  },
});

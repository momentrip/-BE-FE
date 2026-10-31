import { StyleSheet } from "react-native";

export const DESIGN_WIDTH = 393;
export const DESIGN_HEIGHT = 852;

export const zenAssets = {
  background: require("@/assets/images/zen/s8_bg.png"),
  teaCupDefault: require("@/assets/images/zen/teaCup_default.png"),
  teaCupZen: require("@/assets/images/zen/teaCup_zen.png"),
  teaCupMini: require("@/assets/images/zen/teaCup_mini.png"),
  /** s9 선반 테이블 장식. main(home) 화면과 동일한 에셋을 재사용한다. */
  table: require("@/assets/images/mainpage/table.png"),
  teacupEmpty: require("@/assets/images/mainpage/teacup_empty.png"),
  teacupThin: require("@/assets/images/mainpage/teacup_thin.png"),
} as const;

/** 모든 Flow 화면이 공유하는 배경 이미지 스타일. */
export const zenLayoutStyles = StyleSheet.create({
  background: {
    position: "absolute",
    top: 0,
    left: 0,
    width: DESIGN_WIDTH,
    height: DESIGN_HEIGHT,
  },
});

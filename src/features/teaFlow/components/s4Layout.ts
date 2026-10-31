import { StyleSheet } from "react-native";

export const DESIGN_WIDTH = 393;
export const DESIGN_HEIGHT = 852;

export const RING_SIZE = 301;
export const RING_LEFT = 46;
export const RING_TOP = 286;

export const s4Assets = {
  flow1Background: require("@/assets/images/teaFlow_teaSteeping/flow1_bg.png"),
  flow2Background: require("@/assets/images/teaFlow_teaSteeping/flow2_bg.png"),
  flow3Background: require("@/assets/images/teaFlow_teaSteeping/flow3_bg.png"),
  lantern: require("@/assets/images/worry/released_lantern.png"),
  teapotDone: require("@/assets/images/teaFlow_teaSteeping/s4-teapot-done.png"),
} as const;

/** 수인명(S4_MUDRA_MANTRA 키) -> 수인 손 모양 이미지. 일치하는 수인이 없으면 default를 쓴다. */
export const s4MudraAssets: Record<string, number> = {
  시무외인: require("@/assets/images/teaFlow_teaSteeping/s4-mudra-simuoein.png"),
  여원인: require("@/assets/images/teaFlow_teaSteeping/s4-mudra-yeowonin.png"),
  선정인: require("@/assets/images/teaFlow_teaSteeping/s4-mudra-seonjeongin.png"),
  항마촉지인: require("@/assets/images/teaFlow_teaSteeping/s4-mudra-hagmachokjiin.png"),
  전법륜인: require("@/assets/images/teaFlow_teaSteeping/s4-mudra-jeonbeomnyunin.png"),
  합장: require("@/assets/images/teaFlow_teaSteeping/s4-mudra-hapjang.png"),
  지권인: require("@/assets/images/teaFlow_teaSteeping/s4-mudra-jigwonin.png"),
  "찻잔 감싸기": require("@/assets/images/teaFlow_teaSteeping/s4-mudra-teacup-wrap.png"),
  default: require("@/assets/images/teaFlow_teaSteeping/s4-mudra-default.png"),
} as const;

export const s4Layout = StyleSheet.create({
  background: {
    position: "absolute",
    top: 0,
    left: 0,
    width: DESIGN_WIDTH,
    height: DESIGN_HEIGHT,
  },
});

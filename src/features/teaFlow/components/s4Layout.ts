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
  mudraHand: require("@/assets/images/teaFlow_teaSteeping/s4-mudra-hand.png"),
  mudraPalm: require("@/assets/images/teaFlow_teaSteeping/s4-mudra-palm.png"),
  teapotDone: require("@/assets/images/teaFlow_teaSteeping/s4-teapot-done.png"),
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

import { Image, StyleSheet } from "react-native";

import { s4Assets } from "./s4Layout";

/** 화면 상단 등불. s2 Flow3(풍등이 떠올랐어요)에서 쓰던 에셋을 축소 재사용한다. */
export function S4Lantern({ top }: { top: number }) {
  return (
    <Image resizeMode="contain" source={s4Assets.lantern} style={[styles.lantern, { top }]} />
  );
}

const styles = StyleSheet.create({
  lantern: {
    position: "absolute",
    left: 116,
    width: 161,
    height: 161,
  },
});

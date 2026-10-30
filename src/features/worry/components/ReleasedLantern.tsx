import { Image, StyleSheet } from "react-native";

const SIZE = 249.84;

const lanternAsset = require("@/assets/images/worry/released_lantern.png");

/**
 * Figma s2 Flow3("풍등이 떠올랐어요")의 큰 풍등(글로우+몸체 합쳐진 이미지).
 * 사용처: worry
 */
export function ReleasedLantern() {
  return <Image source={lanternAsset} style={styles.image} resizeMode="contain" />;
}

const styles = StyleSheet.create({
  image: {
    width: SIZE,
    height: SIZE,
  },
});

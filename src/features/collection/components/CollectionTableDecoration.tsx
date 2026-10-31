import { Image, StyleSheet } from "react-native";

import { collectionAssets } from "./collectionLayout";

/**
 * s9 화면(선반/찻잔 세부/통계) 공통 테이블 장식. main(home) 화면과 동일한 위치 비율로
 * table + teacup_empty + teacup_thin을 같이 쓴다. 세 화면 모두 같은 위치여야 한다.
 */
export function CollectionTableDecoration() {
  return (
    <>
      <Image source={collectionAssets.table} style={styles.table} resizeMode="contain" />
      <Image source={collectionAssets.teacupEmpty} style={styles.teacup} resizeMode="contain" />
      <Image source={collectionAssets.teacupThin} style={styles.teacupSecond} resizeMode="contain" />
    </>
  );
}

const styles = StyleSheet.create({
  table: {
    position: "absolute",
    top: 720,
    left: 136,
    width: 120,
    height: 26,
  },
  teacup: {
    position: "absolute",
    top: 709,
    left: 180,
    width: 26,
    height: 19,
  },
  teacupSecond: {
    position: "absolute",
    top: 707,
    left: 216,
    width: 14,
    height: 19,
  },
});

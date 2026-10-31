import { Image, StyleSheet, Text, View } from "react-native";

import type { MyRecord } from "@/features/session";
import { WORRY_KIND_BREW_COLOR, ZEN_STAT_DENOMINATOR } from "@/features/zen";
import { WORRY_KIND_LABEL, WORRY_KINDS } from "@/shared/constants";
import { fontFamily } from "@/shared/theme";

import { CollectionBackButton } from "./CollectionBackButton";
import { collectionAssets, collectionLayoutStyles, DESIGN_WIDTH } from "./collectionLayout";
import { CollectionTableDecoration } from "./CollectionTableDecoration";

const ROW_TOP_START = 130;
const ROW_GAP = 72;

/** Figma s9 "통계" (node 688:3738). 번뇌 8유형별 모은 찻잔 수를 진행바로 보여준다. */
export function CollectionStats({ records, onBack }: { records: MyRecord[]; onBack: () => void }) {
  return (
    <View style={StyleSheet.absoluteFill}>
      <Image source={collectionAssets.background} style={collectionLayoutStyles.background} resizeMode="cover" />
      <CollectionBackButton onBack={onBack} />
      <Text style={styles.title}>번뇌별 모음</Text>

      {WORRY_KINDS.map((kind, index) => {
        const count = records.filter((record) => record.worryKind === kind).length;
        const ratio = Math.min(count / ZEN_STAT_DENOMINATOR, 1);
        const color = WORRY_KIND_BREW_COLOR[kind];
        return (
          <View key={kind} style={[styles.row, { top: ROW_TOP_START + index * ROW_GAP }]}>
            <View style={[styles.dot, { backgroundColor: color }]} />
            <View style={styles.rowBody}>
              <Text style={styles.rowLabel}>{WORRY_KIND_LABEL[kind]}</Text>
              <View style={styles.barTrack}>
                <View style={[styles.barFill, { width: `${ratio * 100}%`, backgroundColor: color }]} />
              </View>
            </View>
            <Text style={styles.rowCount}>
              {count} / {ZEN_STAT_DENOMINATOR}
            </Text>
          </View>
        );
      })}

      <CollectionTableDecoration />
      <Text style={styles.caption}>
        {ZEN_STAT_DENOMINATOR}개 구절을 모두 모으면, 마지막 한 잔이 열려요
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    position: "absolute",
    top: 90,
    width: DESIGN_WIDTH,
    textAlign: "center",
    color: "#c9bc9f",
    fontFamily: fontFamily.pretendardRegular,
    fontSize: 13,
  },
  row: {
    position: "absolute",
    left: 24,
    right: 27,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  rowBody: {
    flex: 1,
    gap: 8,
  },
  rowLabel: {
    color: "#d9cdb2",
    fontFamily: fontFamily.pretendardRegular,
    fontSize: 14,
  },
  barTrack: {
    height: 4,
    borderRadius: 2,
    backgroundColor: "#2a2620",
    overflow: "hidden",
  },
  barFill: {
    height: 4,
    borderRadius: 2,
  },
  rowCount: {
    width: 40,
    textAlign: "right",
    color: "#8e8273",
    fontFamily: fontFamily.pretendardRegular,
    fontSize: 12,
  },
  caption: {
    position: "absolute",
    top: 779,
    width: DESIGN_WIDTH,
    textAlign: "center",
    color: "rgba(220,205,170,0.7)",
    fontFamily: fontFamily.pretendardRegular,
    fontSize: 12,
    lineHeight: 19.2,
  },
});

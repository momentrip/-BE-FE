import { Image, StyleSheet, Text, View } from "react-native";

import { WORRY_KIND_DOT_COLOR } from "@/features/home";
import type { Quote } from "@/features/quote";
import type { MyRecord } from "@/features/session";
import { getTeaLabel } from "@/features/teaFlow";
import { TEA_COLOR, TEA_COLOR_FALLBACK } from "@/features/zen";
import { WORRY_KIND_LABEL } from "@/shared/constants";
import { fontFamily } from "@/shared/theme";

import { formatTimestamp } from "../utils/formatTimestamp";
import { CollectionBackButton } from "./CollectionBackButton";
import { collectionAssets, collectionLayoutStyles, DESIGN_WIDTH } from "./collectionLayout";
import { CollectionTableDecoration } from "./CollectionTableDecoration";

const CUP_SIZE = 220;

/** Figma s9 "찻잔 세부" (node 688:3579). s8 Flow2를 재사용하되 과거 기록용으로 단순화했다. */
export function CollectionDetail({
  record,
  quote,
  onBack,
}: {
  record: MyRecord;
  quote: Quote;
  onBack: () => void;
}) {
  const teaLabel = getTeaLabel(record.tea);
  const teaColor = TEA_COLOR[teaLabel] ?? TEA_COLOR_FALLBACK;

  return (
    <View style={StyleSheet.absoluteFill}>
      <Image source={collectionAssets.background} style={collectionLayoutStyles.background} resizeMode="cover" />
      <CollectionBackButton onBack={onBack} />
      <Text style={styles.timestamp}>{formatTimestamp(record.createdAt)}</Text>

      <Image source={collectionAssets.teaCupDefault} style={styles.cup} resizeMode="contain" />

      <Text style={styles.reading}>{quote.reading}</Text>
      <Text style={styles.meaning}>{quote.text}</Text>

      <View style={styles.tagRow}>
        <View style={styles.tag}>
          <View style={[styles.tagDot, { backgroundColor: WORRY_KIND_DOT_COLOR[record.worryKind].outer }]} />
          <Text style={styles.tagText}>{WORRY_KIND_LABEL[record.worryKind]}</Text>
        </View>
        <View style={styles.tag}>
          <View style={[styles.tagDot, { backgroundColor: teaColor }]} />
          <Text style={styles.tagText}>{teaLabel}</Text>
        </View>
        <View style={styles.tag}>
          <Text style={styles.tagText}>{quote.mudra}</Text>
        </View>
      </View>

      <CollectionTableDecoration />
      <Text style={styles.caption}>고민 원문은 남기지 않아요</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  timestamp: {
    position: "absolute",
    top: 90,
    width: DESIGN_WIDTH,
    textAlign: "center",
    color: "#c9bc9f",
    fontFamily: fontFamily.pretendardSemiBold,
    fontSize: 13,
  },
  cup: {
    position: "absolute",
    top: 180,
    left: (DESIGN_WIDTH - CUP_SIZE) / 2 - 10,
    width: CUP_SIZE,
    height: CUP_SIZE + 1,
  },
  reading: {
    position: "absolute",
    top: 400,
    width: DESIGN_WIDTH,
    textAlign: "center",
    color: "rgba(237,227,204,0.95)",
    fontFamily: fontFamily.main,
    fontSize: 30,
  },
  meaning: {
    position: "absolute",
    top: 478,
    width: DESIGN_WIDTH,
    textAlign: "center",
    color: "#dddddd",
    fontFamily: fontFamily.pretendardRegular,
    fontSize: 13,
  },
  tagRow: {
    position: "absolute",
    top: 572,
    width: DESIGN_WIDTH,
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(201,180,140,0.3)",
  },
  tagDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  tagText: {
    color: "#cfc2a6",
    fontFamily: fontFamily.pretendardRegular,
    fontSize: 12,
  },
  caption: {
    position: "absolute",
    top: 779,
    width: DESIGN_WIDTH,
    textAlign: "center",
    color: "#b0b0b0",
    fontFamily: fontFamily.pretendardSemiBold,
    fontSize: 11,
    lineHeight: 17.6,
  },
});

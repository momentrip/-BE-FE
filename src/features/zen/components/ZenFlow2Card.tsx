import { Image, Pressable, StyleSheet, Text, View } from "react-native";

import { WORRY_KIND_DOT_COLOR } from "@/features/home";
import type { Quote } from "@/features/quote";
import { getTeaLabel } from "@/features/teaFlow";
import type { WorryKind } from "@/shared/constants";
import { WORRY_KIND_LABEL } from "@/shared/constants";
import { fontFamily } from "@/shared/theme";

import { TEA_COLOR, TEA_COLOR_FALLBACK } from "../constants/zenColors";
import { ZenBackButton } from "./ZenBackButton";
import { DESIGN_WIDTH, zenAssets, zenLayoutStyles } from "./zenLayout";

/** Figma s8 "오늘의 찻잔2". 오늘 받은 선어와 태그, 보관·공유 액션을 보여준다. */
export function ZenFlow2Card({
  quote,
  worryKind,
  tea,
  sameCount,
  dateLabel,
  onOpenDetail,
  onOpenShare,
  onSave,
  onBack,
}: {
  quote: Quote;
  worryKind: WorryKind;
  tea: string;
  sameCount: number;
  dateLabel: string;
  onOpenDetail: () => void;
  onOpenShare: () => void;
  onSave: () => void;
  onBack: () => void;
}) {
  const teaLabel = getTeaLabel(tea);
  const teaColor = TEA_COLOR[teaLabel] ?? TEA_COLOR_FALLBACK;

  return (
    <View style={StyleSheet.absoluteFill}>
      <Image source={zenAssets.background} style={zenLayoutStyles.background} resizeMode="cover" />
      <ZenBackButton onBack={onBack} />
      <Text style={styles.title}>오늘의 찻잔</Text>
      <Text style={styles.date}>{dateLabel}</Text>

      <Pressable style={styles.cupWrap} onPress={onOpenDetail}>
        <Image source={zenAssets.teaCupZen} style={styles.cup} resizeMode="contain" />
      </Pressable>

      <Text style={styles.reading}>{quote.reading}</Text>
      <Text style={styles.meaning}>{quote.text}</Text>

      <View style={styles.tagRow}>
        <View style={styles.tag}>
          <View style={[styles.tagDot, { backgroundColor: WORRY_KIND_DOT_COLOR[worryKind].outer }]} />
          <Text style={styles.tagText}>{WORRY_KIND_LABEL[worryKind]}</Text>
        </View>
        <View style={styles.tag}>
          <View style={[styles.tagDot, { backgroundColor: teaColor }]} />
          <Text style={styles.tagText}>{teaLabel}</Text>
        </View>
        <View style={styles.tag}>
          <Text style={styles.tagText}>{quote.mudra}</Text>
        </View>
      </View>

      <Text style={styles.sameCount}>
        오늘 같은 고민을 내려놓은 사람 <Text style={styles.sameCountValue}>{sameCount}명</Text>
      </Text>

      <Pressable style={styles.saveButton} onPress={onSave}>
        <Text style={styles.saveButtonText}>찻잔 보관하기</Text>
      </Pressable>

      <Pressable style={styles.shareLink} onPress={onOpenShare} hitSlop={8}>
        <Text style={styles.shareLinkText}>구절만 공유하기</Text>
      </Pressable>
    </View>
  );
}

const CUP_SIZE = 220;

const styles = StyleSheet.create({
  title: {
    position: "absolute",
    top: 90,
    width: DESIGN_WIDTH,
    textAlign: "center",
    color: "#c9bc9f",
    fontFamily: fontFamily.sub3,
    fontSize: 16,
  },
  date: {
    position: "absolute",
    top: 116,
    width: DESIGN_WIDTH,
    textAlign: "center",
    color: "rgba(184,170,144,0.5)",
    fontFamily: fontFamily.pretendardRegular,
    fontSize: 11,
  },
  cupWrap: {
    position: "absolute",
    top: 180,
    left: (DESIGN_WIDTH - CUP_SIZE) / 2 - 10,
    width: CUP_SIZE,
    height: CUP_SIZE + 1,
  },
  cup: {
    width: CUP_SIZE,
    height: CUP_SIZE + 1,
  },
  reading: {
    position: "absolute",
    top: 470,
    width: DESIGN_WIDTH,
    textAlign: "center",
    color: "#ede3cc",
    fontFamily: fontFamily.main,
    fontSize: 32,
  },
  meaning: {
    position: "absolute",
    top: 548,
    width: DESIGN_WIDTH,
    textAlign: "center",
    color: "#c4b79e",
    fontFamily: fontFamily.pretendardRegular,
    fontSize: 15,
    lineHeight: 25.5,
  },
  tagRow: {
    position: "absolute",
    top: 642,
    width: DESIGN_WIDTH,
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 11,
    paddingVertical: 4,
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
    fontSize: 11,
  },
  sameCount: {
    position: "absolute",
    top: 684,
    width: DESIGN_WIDTH,
    textAlign: "center",
    color: "rgba(200,186,150,0.6)",
    fontFamily: fontFamily.pretendardRegular,
    fontSize: 12,
  },
  sameCountValue: {
    color: "#5e584a",
    fontFamily: fontFamily.pretendardMedium,
  },
  saveButton: {
    position: "absolute",
    top: 730,
    left: 45,
    width: 300,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#e9e1cf",
    alignItems: "center",
    justifyContent: "center",
  },
  saveButtonText: {
    color: "#1a1712",
    fontFamily: fontFamily.pretendardRegular,
    fontSize: 15,
  },
  shareLink: {
    position: "absolute",
    top: 798,
    width: DESIGN_WIDTH,
    alignItems: "center",
  },
  shareLinkText: {
    color: "rgba(200,186,150,0.55)",
    fontFamily: fontFamily.pretendardRegular,
    fontSize: 12,
  },
});

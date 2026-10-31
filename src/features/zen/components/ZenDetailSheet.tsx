import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import type { Quote } from "@/features/quote";
import type { WorryKind } from "@/shared/constants";
import { WORRY_KIND_LABEL } from "@/shared/constants";
import { fontFamily } from "@/shared/theme";

/** Figma s8 "오늘의 찻잔2" 하단 슬라이딩 상세 설명 시트. */
export function ZenDetailSheet({
  quote,
  worryKind,
  visible,
  onClose,
}: {
  quote: Quote;
  worryKind: WorryKind;
  visible: boolean;
  onClose: () => void;
}) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={(event) => event.stopPropagation()}>
          <View style={styles.handle} />
          <ScrollView contentContainerStyle={styles.content}>
            <View style={styles.titleRow}>
              <Text style={styles.reading}>{quote.reading}</Text>
              <Text style={styles.hanja}>{quote.hanja}</Text>
            </View>
            <Text style={styles.meaning}>{quote.meaning}</Text>
            <View style={styles.divider} />
            <View style={styles.commentary}>
              {quote.commentary.map((paragraph, index) => (
                <Text key={index} style={styles.commentaryText}>
                  {paragraph}
                </Text>
              ))}
            </View>
            <Text style={styles.footer}>
              {WORRY_KIND_LABEL[worryKind]} · {quote.author}
            </Text>
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.55)",
  },
  sheet: {
    backgroundColor: "#1d1a16",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: 514,
    alignItems: "center",
    paddingTop: 10,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#4a443a",
  },
  content: {
    paddingHorizontal: 26,
    paddingTop: 24,
    paddingBottom: 56,
    gap: 6,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
  },
  reading: {
    color: "#ede3cc",
    fontFamily: fontFamily.main,
    fontSize: 24,
  },
  hanja: {
    color: "#8e8273",
    fontFamily: fontFamily.pretendardRegular,
    fontSize: 14,
    letterSpacing: 4,
  },
  meaning: {
    color: "#c4b79e",
    fontFamily: fontFamily.pretendardRegular,
    fontSize: 13,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.08)",
    marginVertical: 14,
  },
  commentary: {
    gap: 16,
  },
  commentaryText: {
    color: "#bfb39c",
    fontFamily: fontFamily.pretendardRegular,
    fontSize: 13.5,
    lineHeight: 25.65,
  },
  footer: {
    marginTop: 16,
    color: "#6e6658",
    fontFamily: fontFamily.pretendardRegular,
    fontSize: 11,
  },
});

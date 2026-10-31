import { Image, Modal, Pressable, StyleSheet, Text, View } from "react-native";

import type { Quote } from "@/features/quote";
import { fontFamily } from "@/shared/theme";

import { zenAssets } from "./zenLayout";

const CARD_WIDTH = 220;
const CARD_HEIGHT = 390;

/** Figma s8 "오늘의 찻잔2" 공유 팝업 (node 799:677) — 카드만 보여준다. */
export function ZenShareCard({ quote, visible, onClose }: { quote: Quote; visible: boolean; onClose: () => void }) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.wrap} onPress={(event) => event.stopPropagation()}>
          <View style={styles.card}>
            <Image source={zenAssets.teaCupZen} style={styles.cup} resizeMode="contain" />
            <Text style={styles.reading}>{quote.reading}</Text>
            <Text style={styles.text}>{quote.text}</Text>
            <Text style={styles.brand}>다선일미</Text>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.55)",
  },
  wrap: {
    alignItems: "center",
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 18,
    backgroundColor: "#1a1510",
    alignItems: "center",
  },
  cup: {
    position: "absolute",
    top: 42,
    left: (CARD_WIDTH - 147) / 2 - 5,
    width: 147,
    height: 148,
  },
  reading: {
    position: "absolute",
    top: 210,
    width: CARD_WIDTH,
    textAlign: "center",
    color: "#ede3cc",
    fontFamily: fontFamily.main,
    fontSize: 24,
  },
  text: {
    position: "absolute",
    top: 256,
    width: CARD_WIDTH,
    textAlign: "center",
    color: "#bfb39c",
    fontFamily: fontFamily.pretendardRegular,
    fontSize: 12,
    lineHeight: 20.4,
  },
  brand: {
    position: "absolute",
    top: 348,
    width: CARD_WIDTH,
    textAlign: "center",
    color: "#7a6f60",
    fontFamily: fontFamily.pretendardRegular,
    fontSize: 11,
    letterSpacing: 3,
  },
});

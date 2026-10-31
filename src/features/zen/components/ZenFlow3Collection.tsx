import { Image, Pressable, StyleSheet, Text, View } from "react-native";

import type { MyRecord } from "@/features/session";
import { fontFamily } from "@/shared/theme";

import { WORRY_KIND_BREW_COLOR, ZEN_STAT_DENOMINATOR } from "../constants/zenColors";
import { ZEN_SHELF_SLOTS } from "../utils/zenShelfSlots";
import { zenAssets, zenLayoutStyles } from "./zenLayout";

const SLOT_SIZE = 47;
const SHELF_LEFT = 61;
const SHELF_RIGHT = 64;
const TICK_WIDTH = 7;
const TICK_HEIGHT = 2;

/** Figma s8 "오늘의 찻잔3". 최근 기록을 선반 모양으로 보여주고 메인/찻잔 도감(s9)으로 이동한다. 저장이 끝난 뒤라 뒤로가기는 없다. */
export function ZenFlow3Collection({
  records,
  onGoHome,
  onGoCollection,
}: {
  records: MyRecord[];
  onGoHome: () => void;
  onGoCollection: () => void;
}) {
  const shownRecords = records.slice(0, ZEN_SHELF_SLOTS.length);
  const shelfBoardTops = [...new Set(ZEN_SHELF_SLOTS.map((slot) => slot.boardTop))];

  return (
    <View style={StyleSheet.absoluteFill}>
      <Image source={zenAssets.background} style={zenLayoutStyles.background} resizeMode="cover" />

      {shelfBoardTops.map((boardTop) => (
        <View key={boardTop} style={[styles.shelfBoard, { top: boardTop }]} />
      ))}

      {ZEN_SHELF_SLOTS.map((slot, index) => {
        const record = shownRecords[index];
        if (!record) {
          return <View key={index} style={[styles.emptySlot, { top: slot.top, left: slot.left }]} />;
        }
        return (
          <View key={index}>
            <Image
              source={zenAssets.teaCupMini}
              style={[styles.cupIcon, { top: slot.top, left: slot.left }]}
              resizeMode="contain"
            />
            <View
              style={[
                styles.tick,
                {
                  top: slot.boardTop - 2,
                  left: slot.left + (SLOT_SIZE - TICK_WIDTH) / 2,
                  backgroundColor: WORRY_KIND_BREW_COLOR[record.worryKind],
                },
              ]}
            />
          </View>
        );
      })}

      <Text style={styles.title}>찻잔을 선반에 올렸어요</Text>
      <Text style={styles.stat}>
        마신 잔 {shownRecords.length} / {ZEN_STAT_DENOMINATOR} · 모은 구절 {shownRecords.length} / {ZEN_STAT_DENOMINATOR}
      </Text>

      <Pressable style={styles.homeButton} onPress={onGoHome}>
        <Text style={styles.homeButtonText}>메인으로</Text>
      </Pressable>
      <Pressable style={styles.collectionButton} onPress={onGoCollection}>
        <Text style={styles.collectionButtonText}>찻잔 도감으로</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  shelfBoard: {
    position: "absolute",
    left: SHELF_LEFT,
    right: SHELF_RIGHT,
    height: 4,
    borderRadius: 3,
    backgroundColor: "#36210f",
  },
  emptySlot: {
    position: "absolute",
    width: SLOT_SIZE,
    height: SLOT_SIZE,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.6)",
    borderStyle: "dashed",
  },
  cupIcon: {
    position: "absolute",
    width: SLOT_SIZE,
    height: SLOT_SIZE,
  },
  tick: {
    position: "absolute",
    width: TICK_WIDTH,
    height: TICK_HEIGHT,
    borderRadius: 2,
  },
  title: {
    position: "absolute",
    top: 520,
    left: 24,
    right: 27,
    textAlign: "center",
    color: "rgba(237,227,204,0.95)",
    fontFamily: fontFamily.sub3,
    fontSize: 19.6,
    lineHeight: 28.8,
  },
  stat: {
    position: "absolute",
    top: 556,
    left: 24,
    right: 27,
    textAlign: "center",
    color: "rgba(220,205,170,0.7)",
    fontFamily: fontFamily.pretendardRegular,
    fontSize: 12,
    lineHeight: 19.2,
  },
  homeButton: {
    position: "absolute",
    top: 710,
    left: 45,
    width: 302,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(201,160,99,0.55)",
    backgroundColor: "rgba(36,28,21,0.9)",
    alignItems: "center",
    justifyContent: "center",
  },
  homeButtonText: {
    color: "#ede0c4",
    fontFamily: fontFamily.pretendardRegular,
    fontSize: 15,
  },
  collectionButton: {
    position: "absolute",
    top: 766,
    left: 45,
    width: 302,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#e9e1cf",
    alignItems: "center",
    justifyContent: "center",
  },
  collectionButtonText: {
    color: "#1a1712",
    fontFamily: fontFamily.pretendardRegular,
    fontSize: 15,
  },
});

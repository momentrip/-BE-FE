import { Image, Modal, Pressable, StyleSheet, Text, useWindowDimensions, View } from "react-native";

import { getTeaLabel } from "@/features/teaFlow";
import type { WorryKind } from "@/shared/constants";
import { WORRY_KIND_LABEL } from "@/shared/constants";
import { fontFamily } from "@/shared/theme";

import type { LanternFeedItem } from "../types";
import type { LanternPosition } from "../utils/lanternLayout";
import { formatRelativeTime } from "../utils/relativeTime";
import { LanternGlow } from "./HomeScreen";

const DESIGN_WIDTH = 393;
const DESIGN_HEIGHT = 852;
const CARD_WIDTH = 150;
const CARD_HEIGHT = 96;
const CARD_EDGE_MARGIN = 12;
const CARD_LANTERN_GAP = 12;

/** 카드가 풍등과 겹치지 않고, 캔버스 밖으로도 안 잘리게 풍등 옆에 놓일 위치를 계산한다. */
function getCardPosition(slot: LanternPosition): { top: number; left: number } {
  const preferredLeft = slot.left + slot.width + CARD_LANTERN_GAP;
  const fitsOnRight = preferredLeft + CARD_WIDTH <= DESIGN_WIDTH - CARD_EDGE_MARGIN;
  const left = fitsOnRight ? preferredLeft : slot.left - CARD_LANTERN_GAP - CARD_WIDTH;

  const clampedLeft = Math.min(
    Math.max(left, CARD_EDGE_MARGIN),
    DESIGN_WIDTH - CARD_WIDTH - CARD_EDGE_MARGIN,
  );
  const centeredTop = slot.top + slot.height / 2 - CARD_HEIGHT / 2;
  const clampedTop = Math.min(
    Math.max(centeredTop, CARD_EDGE_MARGIN),
    DESIGN_HEIGHT - CARD_HEIGHT - CARD_EDGE_MARGIN,
  );

  return { top: clampedTop, left: clampedLeft };
}

/** 번뇌 종류별 카테고리 점 그라데이션 (안쪽 → 바깥쪽). */
const WORRY_KIND_DOT_COLOR: Record<WorryKind, { inner: string; outer: string }> = {
  greed_impatience: { inner: "#FFE2B0", outer: "#E0A050" },
  wavering_temptation: { inner: "#EEF0C8", outer: "#4E5A2E" },
  relationship_anger: { inner: "#FFD288", outer: "#D0704A" },
  selfblame_lethargy: { inner: "#FFEDE8", outer: "#EDB8B0" },
  anxiety_worry: { inner: "#FFF4C8", outer: "#EFCB66" },
  overthinking: { inner: "#F2F6D0", outer: "#C4D278" },
  career_direction: { inner: "#FFD6D2", outer: "#E0605C" },
  unsure: { inner: "#FFFFF0", outer: "#E6EAC4" },
};

const teacupIcon = require("@/assets/images/mainpage/teacup_empty.png");
const lanternImage = require("@/assets/images/mainpage/lantern.png");

function CategoryDot({ worryKind }: { worryKind: WorryKind }) {
  const { inner } = WORRY_KIND_DOT_COLOR[worryKind];
  return <View style={[styles.dot, { backgroundColor: inner }]} />;
}

export type LanternDetailModalProps = {
  lantern: LanternFeedItem | null;
  slot: LanternPosition | null;
  onClose: () => void;
};

/**
 * 풍등을 탭했을 때 그 풍등의 번뇌 종류·차·날린 시각을 보여준다.
 * 고민 원문은 보여주지 않는다 (AGENTS.md 9장: 개인 기록은 로컬에만).
 * 사용처: home
 */
export function LanternDetailModal({ lantern, slot, onClose }: LanternDetailModalProps) {
  const { width, height } = useWindowDimensions();
  const scale = Math.min(width / DESIGN_WIDTH, height / DESIGN_HEIGHT);
  const cardPosition = slot ? getCardPosition(slot) : null;

  return (
    <Modal visible={lantern !== null} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <View style={[styles.canvas, { transform: [{ scale }] }]}>
          {lantern && slot && cardPosition && (
            <>
              <LanternGlow
                size={Math.max(slot.width, slot.height) * 1.8}
                style={{
                  top: slot.top - (Math.max(slot.width, slot.height) * 1.8 - slot.height) / 2,
                  left: slot.left - (Math.max(slot.width, slot.height) * 1.8 - slot.width) / 2,
                }}
              />
              <Image
                source={lanternImage}
                style={{
                  position: "absolute",
                  top: slot.top,
                  left: slot.left,
                  width: slot.width,
                  height: slot.height,
                }}
                resizeMode="contain"
              />

              <View style={[styles.card, { top: cardPosition.top, left: cardPosition.left }]}>
                <CategoryDot worryKind={lantern.worryKind} />
                <Text style={styles.worryKind}>{WORRY_KIND_LABEL[lantern.worryKind]}</Text>
                <Text style={styles.tea}>{getTeaLabel(lantern.tea)}</Text>
                <Image source={teacupIcon} style={styles.teaIcon} />
                <Text style={styles.time}>{formatRelativeTime(lantern.createdAt)}에 띄워졌어요</Text>
              </View>
            </>
          )}
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(50,50,50,0.77)",
  },
  canvas: {
    width: DESIGN_WIDTH,
    height: DESIGN_HEIGHT,
  },
  card: {
    position: "absolute",
    width: 150,
    height: 96,
    borderRadius: 14.67,
    borderWidth: 1.33,
    borderColor: "#6e8060",
    backgroundColor: "#3f4a36",
    paddingTop: 15,
    paddingHorizontal: 18,
  },
  dot: {
    position: "absolute",
    top: 19,
    left: 20.5,
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  worryKind: {
    position: "absolute",
    top: 14.67,
    left: 42,
    color: "#ffffff",
    fontFamily: fontFamily.pretendardMedium,
    fontSize: 17.33,
  },
  tea: {
    position: "absolute",
    top: 38.67,
    left: 42,
    color: "#ffffff",
    fontFamily: fontFamily.pretendardMedium,
    fontSize: 17.33,
  },
  teaIcon: {
    position: "absolute",
    top: 44,
    left: 18,
    width: 16.42,
    height: 12,
  },
  time: {
    position: "absolute",
    top: 68,
    left: 5,
    width: 120,
    textAlign: "center",
    color: "#a1a1a1",
    fontFamily: fontFamily.pretendardMedium,
    fontSize: 11,
  },
});

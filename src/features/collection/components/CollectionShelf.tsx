import { Image, Pressable, StyleSheet, Text, View } from "react-native";

import type { MyRecord } from "@/features/session";
import { WORRY_KIND_BREW_COLOR, ZEN_STAT_DENOMINATOR } from "@/features/zen";
import type { WorryGroup } from "@/shared/constants";
import { WORRY_GROUP_LABEL, WORRY_KIND_GROUP } from "@/shared/constants";
import { fontFamily } from "@/shared/theme";

import { COLLECTION_SHELF_SLOTS } from "../utils/collectionShelfSlots";
import { CollectionBackButton } from "./CollectionBackButton";
import { collectionAssets, collectionLayoutStyles } from "./collectionLayout";
import { CollectionTableDecoration } from "./CollectionTableDecoration";

export type CollectionFilter = "all" | WorryGroup;

const FILTERS: readonly CollectionFilter[] = ["all", "tam", "jin", "chi"];

const SLOT_SIZE = 61;
const SHELF_LEFT = 24;
const SHELF_RIGHT = 27;
const TICK_WIDTH = 10;
const TICK_HEIGHT = 3;

function matchesFilter(record: MyRecord, filter: CollectionFilter): boolean {
  if (filter === "all") {
    return true;
  }
  return WORRY_KIND_GROUP[record.worryKind] === filter;
}

/** Figma s9 "찻잔 도감" 선반 (node 688:3357). s8 Flow3와 같은 구조에 필터·더 큰 찻잔을 쓴다. */
export function CollectionShelf({
  records,
  filter,
  onFilterChange,
  onSelectRecord,
  onOpenStats,
  onBack,
}: {
  records: MyRecord[];
  filter: CollectionFilter;
  onFilterChange: (filter: CollectionFilter) => void;
  onSelectRecord: (record: MyRecord) => void;
  onOpenStats: () => void;
  onBack: () => void;
}) {
  const filtered = records.filter((record) => matchesFilter(record, filter));
  const shown = filtered.slice(0, COLLECTION_SHELF_SLOTS.length);
  const shelfBoardTops = [...new Set(COLLECTION_SHELF_SLOTS.map((slot) => slot.boardTop))];

  return (
    <View style={StyleSheet.absoluteFill}>
      <Image source={collectionAssets.background} style={collectionLayoutStyles.background} resizeMode="cover" />
      <CollectionBackButton onBack={onBack} />

      <Text style={styles.title}>찻잔 도감</Text>
      <Text style={styles.statHeaderText}>
        마신 잔 {records.length} · 구절 {records.length} / {ZEN_STAT_DENOMINATOR}
      </Text>

      {shelfBoardTops.map((boardTop) => (
        <View key={boardTop} style={[styles.shelfBoard, { top: boardTop }]} />
      ))}
      <CollectionTableDecoration />

      {COLLECTION_SHELF_SLOTS.map((slot, index) => {
        const record = shown[index];
        if (!record) {
          return <View key={index} style={[styles.emptySlot, { top: slot.top, left: slot.left }]} />;
        }
        return (
          <View key={index}>
            <Pressable
              style={[styles.cupHitArea, { top: slot.top, left: slot.left }]}
              onPress={() => onSelectRecord(record)}
            >
              <Image source={collectionAssets.teaCupMini} style={styles.cupIcon} resizeMode="contain" />
            </Pressable>
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

      <View style={styles.filterRow}>
        {FILTERS.map((item) => {
          const active = item === filter;
          const label = item === "all" ? "전체" : WORRY_GROUP_LABEL[item];
          return (
            <Pressable
              key={item}
              style={[styles.filterChip, active && styles.filterChipActive]}
              onPress={() => onFilterChange(item)}
            >
              <Text style={[styles.filterChipText, active && styles.filterChipTextActive]}>{label}</Text>
            </Pressable>
          );
        })}
      </View>

      <Pressable style={styles.statsLink} onPress={onOpenStats} hitSlop={8}>
        <Text style={styles.statsLinkText}>어떤 번뇌를 가장 많이 내려놨을까요?</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    position: "absolute",
    top: 95,
    left: 34,
    color: "#ede3cc",
    fontFamily: fontFamily.sub3,
    fontSize: 28,
  },
  statHeaderText: {
    position: "absolute",
    top: 113,
    right: SHELF_RIGHT,
    color: "#9d9d9d",
    fontFamily: fontFamily.pretendardSemiBold,
    fontSize: 12,
  },
  shelfBoard: {
    position: "absolute",
    left: SHELF_LEFT,
    right: SHELF_RIGHT,
    height: 6,
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
  cupHitArea: {
    position: "absolute",
    width: SLOT_SIZE,
    height: SLOT_SIZE,
  },
  cupIcon: {
    width: SLOT_SIZE,
    height: SLOT_SIZE,
  },
  tick: {
    position: "absolute",
    width: TICK_WIDTH,
    height: TICK_HEIGHT,
    borderRadius: 2,
  },
  filterRow: {
    position: "absolute",
    top: 632,
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
  },
  filterChip: {
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(201,180,140,0.3)",
  },
  filterChipActive: {
    backgroundColor: "rgba(239,203,102,0.08)",
    borderColor: "#efcb66",
  },
  filterChipText: {
    color: "#cfc2a6",
    fontFamily: fontFamily.pretendardSemiBold,
    fontSize: 12,
  },
  filterChipTextActive: {
    color: "#f2e2b0",
  },
  statsLink: {
    position: "absolute",
    top: 779,
    left: 24,
    right: 27,
    alignItems: "center",
  },
  statsLinkText: {
    color: "#b0b0b0",
    fontFamily: fontFamily.pretendardSemiBold,
    fontSize: 11,
    lineHeight: 17.6,
  },
});

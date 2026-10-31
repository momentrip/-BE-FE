import { StyleSheet, Text, View } from "react-native";

import { fontFamily } from "@/shared/theme";

import { DESIGN_WIDTH } from "./s4Layout";

/** 호흡1/호흡2/호흡3 중 현재 cycle(1~3)만 밝게 표시하는 인디케이터. */
export function S4BreathIndicator({ cycleNumber }: { cycleNumber: 1 | 2 | 3 }) {
  return (
    <>
      <View style={styles.breathTrack}>
        {[1, 2, 3].map((segment) => (
          <View
            key={segment}
            style={[styles.breathSegment, segment === cycleNumber && styles.breathSegmentActive]}
          />
        ))}
      </View>
      {[1, 2, 3].map((segment) => (
        <Text
          key={segment}
          style={[
            segment === 1
              ? styles.breathLabelLeft
              : segment === 2
                ? styles.breathLabelCenter
                : styles.breathLabelRight,
            segment === cycleNumber && styles.breathLabelActive,
          ]}
        >
          호흡{segment}
        </Text>
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  breathTrack: {
    position: "absolute",
    top: 656,
    left: 75,
    width: 240,
    height: 4,
    flexDirection: "row",
    gap: 6,
  },
  breathSegment: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#4a412c",
  },
  breathSegmentActive: {
    backgroundColor: "#ffffff",
  },
  breathLabelLeft: {
    position: "absolute",
    top: 666,
    left: 75,
    color: "rgba(255,255,255,0.55)",
    fontFamily: fontFamily.sub1,
    fontSize: 11,
  },
  breathLabelCenter: {
    position: "absolute",
    top: 666,
    left: 0,
    width: DESIGN_WIDTH,
    textAlign: "center",
    color: "rgba(255,255,255,0.55)",
    fontFamily: fontFamily.sub1,
    fontSize: 11,
  },
  breathLabelRight: {
    position: "absolute",
    top: 666,
    left: 0,
    width: 315,
    textAlign: "right",
    color: "rgba(255,255,255,0.55)",
    fontFamily: fontFamily.sub1,
    fontSize: 11,
  },
  breathLabelActive: {
    color: "#ffffff",
  },
});

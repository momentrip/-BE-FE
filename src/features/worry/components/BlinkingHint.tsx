import { useEffect, useState } from "react";
import { StyleSheet, Text } from "react-native";

import { fontFamily } from "@/shared/theme";

import { DESIGN_WIDTH } from "./worryLayout";

/** "화면을 클릭하세요" 깜빡이는 안내. 화면 전체가 탭 트리거인 단계에서 쓴다. */
export function BlinkingHint() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const id = setInterval(() => setVisible((v) => !v), 700);
    return () => clearInterval(id);
  }, []);

  return <Text style={[styles.blinkHint, { opacity: visible ? 1 : 0 }]}>화면을 클릭하세요</Text>;
}

const styles = StyleSheet.create({
  blinkHint: {
    position: "absolute",
    bottom: 60,
    width: DESIGN_WIDTH,
    textAlign: "center",
    color: "#ffffff",
    fontFamily: fontFamily.pretendardMedium,
    fontSize: 12,
  },
});

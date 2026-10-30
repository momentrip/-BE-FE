import { Pressable, StyleSheet, Text } from "react-native";

import { fontFamily } from "@/shared/theme";

/** Flow 화면 공통 좌측 상단 뒤로가기 버튼. 탭하면 터치가 상위 Pressable로 번지지 않게 막는다. */
export function BackButton({ onBack }: { onBack: () => void }) {
  return (
    <Pressable
      style={styles.backButton}
      onPress={(event) => {
        event.stopPropagation();
        onBack();
      }}
      hitSlop={12}
    >
      <Text style={styles.backButtonText}>←</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  backButton: {
    position: "absolute",
    top: 24,
    left: 20,
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  backButtonText: {
    color: "#ffffff",
    fontFamily: fontFamily.pretendardSemiBold,
    fontSize: 20,
  },
});

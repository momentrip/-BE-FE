import { Alert, Linking, Modal, Pressable, StyleSheet, Text } from "react-native";

import { fontFamily } from "@/shared/theme";

export type CrisisModalProps = {
  visible: boolean;
  onClose: () => void;
};

/**
 * 고민 텍스트에서 위기 표현이 감지되면 보여주는 109 안내. 흐름을 막지 않고 닫으면 그대로 진행된다.
 * (AGENTS.md 11장)
 * 사용처: worry
 */
export function CrisisModal({ visible, onClose }: CrisisModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.card} onPress={(event) => event.stopPropagation()}>
          <Text style={styles.title}>혼자 견디지 않아도 괜찮아요</Text>
          <Text style={styles.body}>
            이 마음은 차 한 잔으로 내려놓기엔{"\n"}
            무거울 수 있어요.{"\n"}
            지금 이야기를 들어줄 사람이 있어요.
          </Text>
          <Pressable
            style={styles.callButton}
            onPress={() => {
              Alert.alert("109에 전화할까요?", "통화 버튼은 다음 화면에서 직접 눌러주세요.", [
                { text: "취소", style: "cancel" },
                { text: "전화 걸기", onPress: () => Linking.openURL("tel:109") },
              ]);
            }}
          >
            <Text style={styles.callButtonText}>109(자살예방 상담센터)에 전화하기</Text>
          </Pressable>
          <Pressable style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>괜찮아요, 차를 마시며 숨을 고를게요</Text>
          </Pressable>
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
    backgroundColor: "rgba(20,18,15,0.8)",
    paddingHorizontal: 32,
  },
  card: {
    width: "100%",
    borderRadius: 24,
    paddingVertical: 28,
    paddingHorizontal: 24,
    backgroundColor: "#2c2a27",
    alignItems: "center",
    gap: 14,
  },
  title: {
    color: "#ffffff",
    fontFamily: fontFamily.pretendardSemiBold,
    fontSize: 18,
    textAlign: "center",
  },
  body: {
    color: "#cfcac0",
    fontFamily: fontFamily.pretendardRegular,
    fontSize: 14,
    lineHeight: 22,
    textAlign: "center",
  },
  callButton: {
    marginTop: 6,
    width: "100%",
    height: 48,
    borderRadius: 24,
    backgroundColor: "#e0605c",
    alignItems: "center",
    justifyContent: "center",
  },
  callButtonText: {
    color: "#ffffff",
    fontFamily: fontFamily.pretendardSemiBold,
    fontSize: 16,
  },
  closeButton: {
    paddingVertical: 8,
  },
  closeButtonText: {
    color: "#a9a9a9",
    fontFamily: fontFamily.pretendardMedium,
    fontSize: 13,
  },
});

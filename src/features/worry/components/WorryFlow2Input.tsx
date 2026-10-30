import { Image, Keyboard, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { fontFamily } from "@/shared/theme";

import { BackButton } from "./BackButton";
import { CARD_HEIGHT, CARD_LEFT, CARD_WIDTH, WorryCardBackground } from "./WorryCard";
import { DESIGN_WIDTH, worryLayoutStyles } from "./worryLayout";

const MAX_WORRY_LENGTH = 40;

const screenAssets = {
  flow2: require("@/assets/images/worry/s2_flow2.png"),
} as const;

/** Figma s2 Flow2-1(번뇌 입력). 글자 있으면 카드에 불이 켜지고 "다 적었어요" 버튼이 뜬다. */
export function WorryFlow2Input({
  worryText,
  onChangeText,
  onSubmit,
  onBack,
}: {
  worryText: string;
  onChangeText: (text: string) => void;
  onSubmit: () => void;
  onBack: () => void;
}) {
  const canSubmit = worryText.trim().length > 0;

  return (
    <Pressable style={StyleSheet.absoluteFill} onPress={Keyboard.dismiss}>
      <Image source={screenAssets.flow2} style={worryLayoutStyles.background} resizeMode="cover" />
      <BackButton onBack={onBack} />
      <Text style={styles.sectionTitle}>오늘의 번뇌</Text>

      <View style={styles.card}>
        <WorryCardBackground isLit={canSubmit} />
        <TextInput
          style={styles.cardInput}
          value={worryText}
          onChangeText={(text) => onChangeText(text.slice(0, MAX_WORRY_LENGTH))}
          placeholder="오늘의 번뇌 한가지"
          placeholderTextColor="rgba(220,205,170,0.35)"
          multiline
          maxLength={MAX_WORRY_LENGTH}
          textAlign="center"
        />
      </View>

      <Text style={styles.charCount}>
        {worryText.length} / {MAX_WORRY_LENGTH}
      </Text>

      {canSubmit && (
        <Pressable style={styles.pillButton} onPress={onSubmit}>
          <Text style={styles.pillButtonText}>다 적었어요</Text>
        </Pressable>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    position: "absolute",
    top: 100,
    width: DESIGN_WIDTH,
    textAlign: "center",
    color: "#ffffff",
    fontFamily: fontFamily.sub3,
    fontSize: 24,
  },
  card: {
    position: "absolute",
    top: 176,
    left: CARD_LEFT,
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    alignItems: "center",
    justifyContent: "center",
  },
  cardInput: {
    width: CARD_WIDTH,
    height: 40,
    paddingHorizontal: 20,
    color: "#ffffff",
    fontFamily: fontFamily.pretendardMedium,
    fontSize: 17,
    textAlignVertical: "center",
  },
  charCount: {
    position: "absolute",
    top: 432,
    width: DESIGN_WIDTH,
    textAlign: "center",
    color: "#b2aa95",
    fontFamily: fontFamily.pretendardMedium,
    fontSize: 15,
  },
  pillButton: {
    position: "absolute",
    bottom: 336,
    left: (DESIGN_WIDTH - 160) / 2,
    width: 160,
    height: 36,
    borderRadius: 50,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
  },
  pillButtonText: {
    color: "#363636",
    fontFamily: fontFamily.sub3,
    fontSize: 16,
  },
});

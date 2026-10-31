import { Image, Pressable, StyleSheet, Text } from "react-native";

import { fontFamily } from "@/shared/theme";

import { useS4DoubleTap } from "../hooks/useS4DoubleTap";
import { S4BackButton } from "./S4BackButton";
import { S4BlinkingText } from "./S4BlinkingText";
import { S4Lantern } from "./S4Lantern";
import { S4MudraRing } from "./S4MudraRing";
import { DESIGN_WIDTH, s4Assets, s4Layout } from "./s4Layout";

const MESSAGE: Record<"intro1" | "intro2", string> = {
  intro1: "폰을 내려놓고\n바르게 앉으세요",
  intro2: "차를 마시기 전,\n호흡을 시작할게요",
};

type TeaSteepingFlow1IntroProps = {
  onAdvance: () => void;
  onBack: () => void;
  step: "intro1" | "intro2";
};

/**
 * Flow1: 멘트1(폰 내려놓기) → 멘트2(호흡 시작 안내). 등불 아래 깜빡이는 안내를
 * 더블탭하면 다음 단계(멘트2, 혹은 breathing)로 넘어간다.
 */
export function TeaSteepingFlow1Intro({ onAdvance, onBack, step }: TeaSteepingFlow1IntroProps) {
  const handleDoubleTap = useS4DoubleTap(onAdvance);

  return (
    <Pressable onPress={handleDoubleTap} style={StyleSheet.absoluteFill}>
      <Image source={s4Assets.flow1Background} style={s4Layout.background} />
      <S4Lantern top={96} />
      <S4BlinkingText style={styles.hint} text="준비되면 화면을 두번 두드려요" />
      <S4MudraRing />
      <Text style={styles.message}>{MESSAGE[step]}</Text>
      <S4BackButton onBack={onBack} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  hint: {
    position: "absolute",
    top: 220,
    left: 0,
    width: DESIGN_WIDTH,
    textAlign: "center",
    color: "#7e7e7e",
    fontFamily: fontFamily.pretendardSemiBold,
    fontSize: 15,
  },
  message: {
    position: "absolute",
    top: 413,
    left: 0,
    width: DESIGN_WIDTH,
    textAlign: "center",
    color: "#dfdfdf",
    fontFamily: fontFamily.sub3,
    fontSize: 20,
    lineHeight: 28,
  },
});

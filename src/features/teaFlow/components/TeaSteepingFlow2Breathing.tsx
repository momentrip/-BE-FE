import { Image, StyleSheet, Text, View } from "react-native";

import { fontFamily } from "@/shared/theme";

import { S4_BREATH_PHASE_LABEL } from "../constants/s4Steeping";
import { useS4Breathing } from "../hooks/useS4Breathing";
import { S4BackButton } from "./S4BackButton";
import { S4BreathIndicator } from "./S4BreathIndicator";
import { S4Lantern } from "./S4Lantern";
import { S4MudraRing } from "./S4MudraRing";
import { S4ProgressBar } from "./S4ProgressBar";
import { DESIGN_WIDTH, s4Assets, s4Layout } from "./s4Layout";

type TeaSteepingFlow2BreathingProps = {
  mudraMantra: string;
  mudraName: string;
  onBack: () => void;
  onDone: () => void;
  teaLabel: string;
};

/**
 * Flow2: 들숨/날숨/멈춤 x 3 cycle 호흡 안내 + 수인 + 차 우러나는 진행바.
 * 흔들림이 감지된 phase만 길어지는 useS4Breathing으로 진행을 계산한다.
 */
export function TeaSteepingFlow2Breathing({
  mudraMantra,
  mudraName,
  onBack,
  onDone,
  teaLabel,
}: TeaSteepingFlow2BreathingProps) {
  const breathing = useS4Breathing({ enabled: true, onDone });
  const isPause = breathing.phaseType === "pause";

  return (
    <>
      <Image source={s4Assets.flow2Background} style={s4Layout.background} />
      <S4Lantern top={67} />
      <View style={styles.phaseLabelRow}>
        <Text style={styles.phaseLabelText}>{S4_BREATH_PHASE_LABEL[breathing.phaseType]}</Text>
        <Text style={styles.phaseLabelNumber}>{breathing.cycleNumber}</Text>
      </View>
      <S4MudraRing>
        <Image
          resizeMode="contain"
          source={isPause ? s4Assets.mudraPalm : s4Assets.mudraHand}
          style={isPause ? styles.mudraPalm : styles.mudraHand}
        />
      </S4MudraRing>
      <Text style={styles.mudraMantra}>
        {mudraName} · {mudraMantra}
      </Text>
      <S4BreathIndicator cycleNumber={breathing.cycleNumber} />
      <S4ProgressBar
        progress={breathing.progress}
        remainingMs={breathing.remainingMs}
        teaLabel={teaLabel}
      />
      <S4BackButton onBack={onBack} />
    </>
  );
}

const styles = StyleSheet.create({
  mudraHand: { width: 173, height: 173 },
  mudraPalm: { width: 204, height: 204 },
  phaseLabelRow: {
    position: "absolute",
    top: 196,
    left: 0,
    width: DESIGN_WIDTH,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
    gap: 5,
  },
  phaseLabelText: {
    color: "#ffffff",
    fontFamily: fontFamily.sub3,
    fontSize: 42,
  },
  phaseLabelNumber: {
    color: "#b8b872",
    fontFamily: fontFamily.sub3,
    fontSize: 26,
  },
  mudraMantra: {
    position: "absolute",
    top: 606,
    left: 0,
    width: DESIGN_WIDTH,
    textAlign: "center",
    color: "#d9c9a0",
    fontFamily: fontFamily.pretendardRegular,
    fontSize: 13,
  },
});

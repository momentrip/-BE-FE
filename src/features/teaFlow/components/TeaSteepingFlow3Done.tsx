import { Canvas, Oval, RadialGradient, vec } from "@shopify/react-native-skia";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

import { fontFamily } from "@/shared/theme";

import { S4BackButton } from "./S4BackButton";
import { S4BlinkingText } from "./S4BlinkingText";
import { S4Lantern } from "./S4Lantern";
import { S4ProgressBar } from "./S4ProgressBar";
import { DESIGN_WIDTH, s4Assets, s4Layout } from "./s4Layout";

const GLOW_SIZE = 340;

type TeaSteepingFlow3DoneProps = {
  onBack: () => void;
  onTap: () => void;
  teaLabel: string;
};

/**
 * Flow3: "차가 다 우러났어요" 완료 화면. 디자인에는 없지만, 찻주전자와 진행바 사이에
 * 깜빡이는 "화면을 클릭하세요" 안내를 더해 탭하면 차 따르기 화면으로 넘어간다.
 */
export function TeaSteepingFlow3Done({ onBack, onTap, teaLabel }: TeaSteepingFlow3DoneProps) {
  return (
    <Pressable onPress={onTap} style={StyleSheet.absoluteFill}>
      <Image source={s4Assets.flow3Background} style={s4Layout.background} />
      <S4Lantern top={67} />
      <Text style={styles.headline}>차가 다 우러났어요.{"\n"}천천히 눈을 떠요.</Text>
      <View style={styles.glowBox}>
        <Canvas style={styles.glowCanvas}>
          <Oval height={GLOW_SIZE} width={GLOW_SIZE} x={0} y={0}>
            <RadialGradient
              c={vec(GLOW_SIZE / 2, GLOW_SIZE / 2)}
              colors={["rgba(239,203,102,0.18)", "rgba(239,203,102,0)"]}
              r={GLOW_SIZE / 2}
            />
          </Oval>
        </Canvas>
        <Image resizeMode="contain" source={s4Assets.teapotDone} style={styles.teapotImage} />
      </View>
      <S4BlinkingText style={styles.tapHint} text="화면을 클릭하세요" />
      <S4ProgressBar progress={1} teaLabel={teaLabel} />
      <S4BackButton onBack={onBack} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  headline: {
    position: "absolute",
    top: 250,
    left: 0,
    width: DESIGN_WIDTH,
    textAlign: "center",
    color: "#ffffff",
    fontFamily: fontFamily.main,
    fontSize: 32,
    lineHeight: 38,
  },
  glowBox: {
    position: "absolute",
    top: 342,
    left: (DESIGN_WIDTH - GLOW_SIZE) / 2,
    width: GLOW_SIZE,
    height: GLOW_SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
  glowCanvas: {
    position: "absolute",
    width: GLOW_SIZE,
    height: GLOW_SIZE,
  },
  teapotImage: {
    width: 220,
    height: 220,
  },
  tapHint: {
    position: "absolute",
    top: 660,
    left: 0,
    width: DESIGN_WIDTH,
    textAlign: "center",
    color: "#ffffff",
    fontFamily: fontFamily.pretendardMedium,
    fontSize: 12,
  },
});

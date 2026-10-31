import { useCallback, useMemo, useReducer } from "react";
import { StyleSheet, View, useWindowDimensions } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";

import { getMudraByWorryKind } from "@/features/quote";
import { getCurrentSession } from "@/features/session";

import { S4_DEFAULT_MUDRA, S4_MUDRA_MANTRA } from "../constants/s4Steeping";
import { getTeaLabel } from "../utils/getTeaLabel";
import { INITIAL_S4_STEEPING_STATE, updateS4SteepingState } from "../utils/s4SteepingState";
import { TeaSteepingFlow1Intro } from "./TeaSteepingFlow1Intro";
import { TeaSteepingFlow2Breathing } from "./TeaSteepingFlow2Breathing";
import { TeaSteepingFlow3Done } from "./TeaSteepingFlow3Done";
import { DESIGN_HEIGHT, DESIGN_WIDTH } from "./s4Layout";

export type TeaSteepingScreenProps = {
  /** 수인을 직접 지정하고 싶을 때만 넘긴다. 생략하면 session의 worryKind로 자동 결정한다. */
  mudraName?: string;
  /** Flow3 탭 완료 후 호출. 기본은 /tea-pouring으로 이동한다. */
  onCompleted?: () => void;
};

/**
 * S4 차 우리기: Flow1(멘트) → Flow2(호흡+수인+진행바) → Flow3(완료) 순서로 진행한다.
 * 흔들림이 감지된 phase만 길어지는 방식으로 차가 우러나는 시간을 계산한다.
 * @param props.mudraName 수인을 직접 지정하고 싶을 때만 넘긴다. 생략하면 자동 결정
 * @param props.onCompleted Flow3 탭 완료 콜백. 기본은 /tea-pouring 이동
 * @returns 차 우리기 화면
 * 사용처: src/app/tea-steeping
 */
export function TeaSteepingScreen({ mudraName: mudraNameProp, onCompleted }: TeaSteepingScreenProps) {
  const { width, height } = useWindowDimensions();
  const router = useRouter();
  const [state, dispatch] = useReducer(updateS4SteepingState, INITIAL_S4_STEEPING_STATE);
  const scale = Math.min(width / DESIGN_WIDTH, height / DESIGN_HEIGHT);

  const { teaLabel, mudraName } = useMemo(() => {
    const session = getCurrentSession();
    return {
      teaLabel: session.tea ? getTeaLabel(session.tea) : "차",
      mudraName: mudraNameProp ?? (session.worryKind ? getMudraByWorryKind(session.worryKind) : S4_DEFAULT_MUDRA),
    };
  }, [mudraNameProp]);
  const mudraMantra = S4_MUDRA_MANTRA[mudraName] ?? S4_MUDRA_MANTRA[S4_DEFAULT_MUDRA];

  const handleBack = useCallback(() => {
    if (state.step === "intro1" || state.step === "intro2") {
      router.back();
      return;
    }
    dispatch({ type: "resetToIntro1" });
  }, [router, state.step]);

  const handleCompleted = useCallback(() => {
    if (onCompleted) {
      onCompleted();
      return;
    }
    router.push("/tea-pouring");
  }, [onCompleted, router]);

  return (
    <View style={styles.screen}>
      <StatusBar hidden />
      <View style={[styles.canvas, { transform: [{ scale }] }]}>
        {(state.step === "intro1" || state.step === "intro2") && (
          <TeaSteepingFlow1Intro
            onAdvance={() =>
              dispatch({ type: state.step === "intro1" ? "advanceIntro" : "startBreathing" })
            }
            onBack={handleBack}
            step={state.step}
          />
        )}
        {state.step === "breathing" && (
          <TeaSteepingFlow2Breathing
            mudraMantra={mudraMantra}
            mudraName={mudraName}
            onBack={handleBack}
            onDone={() => dispatch({ type: "finishBreathing" })}
            teaLabel={teaLabel}
          />
        )}
        {state.step === "done" && (
          <TeaSteepingFlow3Done onBack={handleBack} onTap={handleCompleted} teaLabel={teaLabel} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#3b3b3b",
    overflow: "hidden",
  },
  canvas: {
    width: DESIGN_WIDTH,
    height: DESIGN_HEIGHT,
    backgroundColor: "#3b3b3b",
    overflow: "hidden",
  },
});

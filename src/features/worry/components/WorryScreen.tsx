import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, useWindowDimensions, View } from "react-native";

import { matchWorryKind } from "@/features/quote";
import { getCurrentSession, saveWorry } from "@/features/session";
import type { WorryKind } from "@/shared/constants";

import { getSameWorryKindCountToday } from "../api/worryLanternsApi";
import { WORRY_INTRO_1, WORRY_INTRO_2 } from "../data/worryIntroCopy";
import { CrisisModal } from "./CrisisModal";
import { WorryFlow1Intro } from "./WorryFlow1Intro";
import { WorryFlow2Analyzing } from "./WorryFlow2Analyzing";
import { WorryFlow2Input } from "./WorryFlow2Input";
import { WorryFlow2Result } from "./WorryFlow2Result";
import { WorryFlow3Released } from "./WorryFlow3Released";
import { DESIGN_HEIGHT, DESIGN_WIDTH } from "./worryLayout";

const ANALYZING_DURATION_MS = 3000;

type Step =
  | { kind: "intro1" }
  | { kind: "intro2" }
  | { kind: "input" }
  | { kind: "analyzing"; worryKind: WorryKind }
  | { kind: "result"; worryKind: WorryKind; sameCount: number }
  | { kind: "released"; worryKind: WorryKind };

/**
 * Figma s2("고민 적기") 전체 플로우. 다선의 시간 안내 → 번뇌 입력 → 분석 → 풍등 띄우기 → 결과.
 * 각 단계의 실제 화면은 WorryFlow1Intro, WorryFlow2Input 등, WorryFlow3Released가 맡고,
 * 여기서는 단계 전환과 session/quote 연동만 담당한다.
 * @returns s2 화면
 * 사용처: src/app/worry.tsx
 */
export function WorryScreen() {
  const { width, height } = useWindowDimensions();
  const scale = Math.min(width / DESIGN_WIDTH, height / DESIGN_HEIGHT);

  const [step, setStep] = useState<Step>({ kind: "intro1" });
  const [worryText, setWorryText] = useState("");
  const [showCrisisModal, setShowCrisisModal] = useState(false);
  const [lastResult, setLastResult] = useState<{ worryKind: WorryKind; sameCount: number } | null>(
    null,
  );
  const [analyzingDone, setAnalyzingDone] = useState(false);
  const pendingSameCountRef = useRef<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  function handleSubmitWorry() {
    const kind = matchWorryKind(worryText);
    saveWorry(worryText, kind);

    if (getCurrentSession().isCrisis) {
      setShowCrisisModal(true);
    }

    setAnalyzingDone(false);
    pendingSameCountRef.current = null;
    setStep({ kind: "analyzing", worryKind: kind });

    getSameWorryKindCountToday(kind).then((count) => {
      pendingSameCountRef.current = count;
    });

    timerRef.current = setTimeout(() => {
      setAnalyzingDone(true);
    }, ANALYZING_DURATION_MS);
  }

  function handleConfirmAnalysis(worryKind: WorryKind) {
    const sameCount = pendingSameCountRef.current ?? 0;
    setLastResult({ worryKind, sameCount });
    setStep({ kind: "result", worryKind, sameCount });
  }

  function handleReleaseLantern(worryKind: WorryKind) {
    setStep({ kind: "released", worryKind });
  }

  function handleBack() {
    switch (step.kind) {
      case "intro1":
        router.back();
        return;
      case "intro2":
        setStep({ kind: "intro1" });
        return;
      case "input":
        setStep({ kind: "intro2" });
        return;
      case "analyzing":
        if (timerRef.current) clearTimeout(timerRef.current);
        setStep({ kind: "input" });
        return;
      case "result":
        setStep({ kind: "input" });
        return;
      case "released":
        if (lastResult) {
          setStep({ kind: "result", worryKind: lastResult.worryKind, sameCount: lastResult.sameCount });
        } else {
          setStep({ kind: "input" });
        }
        return;
    }
  }

  return (
    <View style={styles.screen}>
      <StatusBar hidden />
      <View style={[styles.canvas, { transform: [{ scale }] }]}>
        {step.kind === "intro1" && (
          <WorryFlow1Intro
            copy={WORRY_INTRO_1}
            onNext={() => setStep({ kind: "intro2" })}
            onBack={handleBack}
          />
        )}
        {step.kind === "intro2" && (
          <WorryFlow1Intro
            copy={WORRY_INTRO_2}
            onNext={() => setStep({ kind: "input" })}
            onBack={handleBack}
          />
        )}
        {step.kind === "input" && (
          <WorryFlow2Input
            worryText={worryText}
            onChangeText={setWorryText}
            onSubmit={handleSubmitWorry}
            onBack={handleBack}
          />
        )}
        {step.kind === "analyzing" && (
          <WorryFlow2Analyzing
            worryText={worryText}
            isDone={analyzingDone}
            onConfirm={() => handleConfirmAnalysis(step.worryKind)}
            onBack={handleBack}
          />
        )}
        {step.kind === "result" && (
          <WorryFlow2Result
            worryText={worryText}
            worryKind={step.worryKind}
            sameCount={step.sameCount}
            onSubmit={() => handleReleaseLantern(step.worryKind)}
            onBack={handleBack}
          />
        )}
        {step.kind === "released" && (
          <WorryFlow3Released
            worryKind={step.worryKind}
            onNext={() => router.push("/tea-preparation")}
            onBack={handleBack}
          />
        )}
      </View>

      <CrisisModal visible={showCrisisModal} onClose={() => setShowCrisisModal(false)} />
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

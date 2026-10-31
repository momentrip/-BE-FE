import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

import { recommendQuote } from "@/features/quote";
import type { Quote } from "@/features/quote";
import { getCurrentSession, getMyRecords, saveQuote, saveSession } from "@/features/session";
import type { MyRecord } from "@/features/session";
import { getSameWorryKindCountToday } from "@/features/worry";
import type { WorryKind } from "@/shared/constants";

import { ZenDetailSheet } from "./ZenDetailSheet";
import { ZenFlow1Intro } from "./ZenFlow1Intro";
import { ZenFlow2Card } from "./ZenFlow2Card";
import { ZenFlow3Collection } from "./ZenFlow3Collection";
import { ZenShareCard } from "./ZenShareCard";

type ZenStep = "loading" | "intro" | "card" | "done";

function formatDateLabel(date: Date): string {
  return `${date.getFullYear()}. ${date.getMonth() + 1}. ${date.getDate()}`;
}

/** Figma s8 "선어 확인". teaFlow 차 마시기에서 연결되는 화면. */
export function ZenScreen() {
  const [step, setStep] = useState<ZenStep>("loading");
  const [quote, setQuote] = useState<Quote | null>(null);
  const [worryKind, setWorryKind] = useState<WorryKind | null>(null);
  const [tea, setTea] = useState<string | null>(null);
  const [sameCount, setSameCount] = useState(0);
  const [detailOpen, setDetailOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [records, setRecords] = useState<MyRecord[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const session = getCurrentSession();
      if (session.worryKind === null || session.tea === null) {
        router.back();
        return;
      }

      const [recommended, count] = await Promise.all([
        Promise.resolve(
          recommendQuote({
            worryKind: session.worryKind,
            isCrisis: session.isCrisis,
            recentQuoteIds: [],
            seed: Date.now(),
          }),
        ),
        getSameWorryKindCountToday(session.worryKind),
      ]);

      if (cancelled) {
        return;
      }

      saveQuote(recommended.id);
      setQuote(recommended);
      setWorryKind(session.worryKind);
      setTea(session.tea);
      setSameCount(count);
      setStep("intro");
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSave = useCallback(async () => {
    await saveSession();
    const myRecords = await getMyRecords();
    setRecords(myRecords);
    setStep("done");
  }, []);

  if (step === "loading" || quote === null || worryKind === null || tea === null) {
    return (
      <View style={styles.container}>
        <StatusBar hidden />
      </View>
    );
  }

  if (step === "intro") {
    return (
      <View style={styles.container}>
        <StatusBar hidden />
        <ZenFlow1Intro onReveal={() => setStep("card")} onBack={() => router.back()} />
      </View>
    );
  }

  if (step === "card") {
    return (
      <View style={styles.container}>
        <StatusBar hidden />
        <ZenFlow2Card
          quote={quote}
          worryKind={worryKind}
          tea={tea}
          sameCount={sameCount}
          dateLabel={formatDateLabel(new Date())}
          onOpenDetail={() => setDetailOpen(true)}
          onOpenShare={() => setShareOpen(true)}
          onSave={() => void handleSave()}
          onBack={() => setStep("intro")}
        />
        <ZenDetailSheet
          quote={quote}
          worryKind={worryKind}
          visible={detailOpen}
          onClose={() => setDetailOpen(false)}
        />
        <ZenShareCard quote={quote} visible={shareOpen} onClose={() => setShareOpen(false)} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <ZenFlow3Collection
        records={records}
        onGoHome={() => router.replace("/")}
        onGoCollection={() => router.push("/collection")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#3b3b3b",
  },
});

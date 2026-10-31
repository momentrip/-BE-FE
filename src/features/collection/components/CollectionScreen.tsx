import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

import { getQuoteById } from "@/features/quote";
import type { Quote } from "@/features/quote";
import { getMyRecords } from "@/features/session";
import type { MyRecord } from "@/features/session";

import type { CollectionFilter } from "./CollectionShelf";
import { CollectionShelf } from "./CollectionShelf";
import { CollectionDetail } from "./CollectionDetail";
import { CollectionStats } from "./CollectionStats";

type CollectionStep = "loading" | "shelf" | "detail" | "stats";

/** Figma s9 "찻잔 도감". zen(s8) "찻잔 도감으로" 버튼에서 연결된다. */
export function CollectionScreen() {
  const [step, setStep] = useState<CollectionStep>("loading");
  const [records, setRecords] = useState<MyRecord[]>([]);
  const [filter, setFilter] = useState<CollectionFilter>("all");
  const [selectedRecord, setSelectedRecord] = useState<MyRecord | null>(null);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);

  useEffect(() => {
    let cancelled = false;
    getMyRecords().then((myRecords) => {
      if (!cancelled) {
        setRecords(myRecords);
        setStep("shelf");
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (step === "loading") {
    return (
      <View style={styles.container}>
        <StatusBar hidden />
      </View>
    );
  }

  if (step === "detail" && selectedRecord && selectedQuote) {
    return (
      <View style={styles.container}>
        <StatusBar hidden />
        <CollectionDetail record={selectedRecord} quote={selectedQuote} onBack={() => setStep("shelf")} />
      </View>
    );
  }

  if (step === "stats") {
    return (
      <View style={styles.container}>
        <StatusBar hidden />
        <CollectionStats records={records} onBack={() => setStep("shelf")} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <CollectionShelf
        records={records}
        filter={filter}
        onFilterChange={setFilter}
        onSelectRecord={(record) => {
          setSelectedRecord(record);
          setSelectedQuote(getQuoteById(record.quoteId));
          setStep("detail");
        }}
        onOpenStats={() => setStep("stats")}
        onBack={() => router.back()}
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

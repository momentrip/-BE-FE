import { Stack } from "expo-router";

import { TeaPreparationScreen } from "@/features/teaFlow";

export default function TeaPreparationRoute() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <TeaPreparationScreen />
    </>
  );
}

import { Stack } from "expo-router";

import { WorryScreen } from "@/features/worry";

export default function WorryRoute() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <WorryScreen />
    </>
  );
}

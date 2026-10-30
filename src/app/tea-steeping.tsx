import { Stack } from "expo-router";

import { TeaSteepingScreen } from "@/features/teaFlow";

export default function TeaSteepingRoute() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <TeaSteepingScreen />
    </>
  );
}

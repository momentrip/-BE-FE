import { Stack } from "expo-router";

import { TeaPouringScreen } from "@/features/teaFlow";

export default function TeaPouringRoute() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <TeaPouringScreen />
    </>
  );
}

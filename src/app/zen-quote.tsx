import { Stack } from "expo-router";

import { ZenScreen } from "@/features/zen";

export default function ZenQuoteRoute() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ZenScreen />
    </>
  );
}

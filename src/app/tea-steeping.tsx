import { Stack } from "expo-router";

import { TeaSteepingScreen, useRefocusRemountKey } from "@/features/teaFlow";

export default function TeaSteepingRoute() {
  const remountKey = useRefocusRemountKey();

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <TeaSteepingScreen key={remountKey} />
    </>
  );
}

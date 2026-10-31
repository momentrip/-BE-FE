import { Stack, useRouter } from "expo-router";

import { TeaDrinkingScreen } from "@/features/teaFlow";

export default function TeaDrinkingRoute() {
  const router = useRouter();

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <TeaDrinkingScreen onCompleted={() => router.push("/collection")} />
    </>
  );
}

import { Stack, useRouter } from "expo-router";

import { TeaPouringScreen } from "@/features/teaFlow";

export default function TeaPouringRoute() {
  const router = useRouter();

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <TeaPouringScreen onCompleted={() => router.push("/tea-drinking")} />
    </>
  );
}

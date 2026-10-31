import { Stack, useRouter } from "expo-router";

import { TeaPouringScreen, useRefocusRemountKey } from "@/features/teaFlow";

export default function TeaPouringRoute() {
  const router = useRouter();
  const remountKey = useRefocusRemountKey();

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <TeaPouringScreen key={remountKey} onCompleted={() => router.push("/tea-drinking")} />
    </>
  );
}

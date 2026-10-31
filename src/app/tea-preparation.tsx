import { Stack, useRouter } from "expo-router";

import { TeaPreparationScreen, useRefocusRemountKey } from "@/features/teaFlow";

export default function TeaPreparationRoute() {
  const router = useRouter();
  const remountKey = useRefocusRemountKey();

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <TeaPreparationScreen key={remountKey} onCompleted={() => router.push("/tea-steeping")} />
    </>
  );
}

import { Stack, useRouter } from "expo-router";

import { TeaPreparationScreen } from "@/features/teaFlow";

export default function TeaPreparationRoute() {
  const router = useRouter();

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <TeaPreparationScreen onCompleted={() => router.push("/tea-steeping")} />
    </>
  );
}

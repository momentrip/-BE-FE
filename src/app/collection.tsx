import { Stack } from "expo-router";

import { CollectionScreen } from "@/features/collection";

export default function CollectionRoute() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <CollectionScreen />
    </>
  );
}

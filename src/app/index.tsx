import { Stack } from "expo-router";

import { HomeScreen } from "@/features/home";

export default function HomeRoute() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <HomeScreen />
    </>
  );
}

import { useFonts } from "expo-font";
import { Stack } from "expo-router";

import { fontAssets } from "@/shared/theme";

export default function RootLayout() {
  const [fontsLoaded] = useFonts(fontAssets);

  if (!fontsLoaded) {
    return null;
  }

  return <Stack />;
}

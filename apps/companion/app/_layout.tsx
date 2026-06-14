import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { colors } from "@/theme/colors";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.textMain,
          headerTitleStyle: { fontWeight: "700" },
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ title: "Claim Unit" }} />
        <Stack.Screen name="ble-pairing" options={{ title: "BLE Pairing" }} />
        <Stack.Screen name="face" options={{ title: "Exobod", headerShown: false }} />
      </Stack>
    </>
  );
}

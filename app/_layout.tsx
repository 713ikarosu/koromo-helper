import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <>
      <Stack>
        <Stack.Screen name="index" options={{ title: "Koromo NAVI" }} />
        <Stack.Screen name="login" options={{ title: "ログイン" }} />
        <Stack.Screen name="preferences" options={{ title: "好み設定" }} />
        <Stack.Screen name="home" options={{ title: "Koromo NAVI" }} />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}

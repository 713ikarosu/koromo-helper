import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <>
      <Stack>
        <Stack.Screen name="index" options={{ title: "AI-Coord" }} />
        <Stack.Screen name="login" options={{ title: "ログイン" }} />
        <Stack.Screen name="preferences" options={{ title: "好み設定" }} />
        <Stack.Screen name="home" options={{ title: "ホーム" }} />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}

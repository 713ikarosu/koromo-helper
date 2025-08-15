// 天気サービスのフォールバック動作テスト
import { WeatherService } from "../services/weatherService";

console.log("🌤️ Weather Service フォールバック動作テスト");

// 位置情報が利用できない環境をシミュレート
const originalNavigator = (global as any).navigator;

console.log("📍 位置情報なしの環境をシミュレート:");
// navigator.geolocationを無効化
(global as any).navigator = {
  ...originalNavigator,
  geolocation: undefined
};

console.log("🔄 天気情報取得を試行...");

try {
  const weatherData = await WeatherService.getCurrentWeather();
  console.log("❌ 予期せず成功しました:");
  console.log(`- 温度: ${weatherData.temperature}°C`);
  console.log(`- 天気: ${weatherData.weather}`);
  console.log(`- 場所: ${weatherData.location}`);
  console.log(`- デフォルト値: ${weatherData.isDefault ? 'Yes' : 'No'}`);
  
  if (weatherData.isDefault) {
    console.log("⚠️ 問題: デフォルト値が返されました。ユーザー入力フォーム表示が期待されます。");
  }
  
} catch (error: any) {
  console.log("✅ 期待通りエラーが発生しました:");
  console.log(`- エラーメッセージ: ${error.message}`);
  console.log("✅ この場合、ホーム画面でユーザー入力フォームが表示されるはずです");
}

// 環境を復元
(global as any).navigator = originalNavigator;

console.log("\n🏁 フォールバック動作テスト完了");
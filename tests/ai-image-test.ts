// AIService画像生成テスト
import { AIService } from "../services/aiService";

console.log("🤖 AIService 画像生成テスト");

const testUserProfile = {
  gender: "female" as const,
  age: 25
};

const testWeather = {
  temperature: 22,
  weather: "晴れ",
  location: "東京",
  timestamp: new Date().toISOString()
};

const testStyle = "casual" as const;

console.log("📋 テスト条件:");
console.log(`- ユーザー: ${testUserProfile.gender}, ${testUserProfile.age}歳`);
console.log(`- 天気: ${testWeather.weather}, ${testWeather.temperature}°C`);
console.log(`- スタイル: ${testStyle}`);
console.log(`- 場所: ${testWeather.location}`);

try {
  console.log("\n🔄 フォールバック提案テスト中...");
  
  const fallbackOutfit = AIService.getFallbackSuggestion(
    testUserProfile,
    testWeather,
    testStyle
  );
  
  console.log("✅ フォールバック提案生成成功!");
  console.log(`📷 画像URL: ${fallbackOutfit.imageUrl}`);
  console.log(`📝 説明: ${fallbackOutfit.description}`);
  console.log(`👗 アイテム数: ${fallbackOutfit.items.length}`);
  
  if (!fallbackOutfit.imageUrl) {
    console.log("❌ 画像URLが空です!");
  } else if (!fallbackOutfit.imageUrl.startsWith('https://')) {
    console.log("❌ 無効な画像URLです!");
  } else {
    console.log("✅ 画像URL正常です");
  }

} catch (error: any) {
  console.error("❌ テスト失敗:", error);
}
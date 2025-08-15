// コーディネートのテキストと画像の整合性テスト
import { AIService } from "../services/aiService";

console.log("🎨 コーディネート整合性テスト開始");

const testCases = [
  {
    name: "女性カジュアル・温暖",
    userProfile: { gender: "female" as const, age: 25 },
    weather: { temperature: 25, weather: "晴れ", location: "東京", timestamp: new Date().toISOString() },
    style: "casual" as const
  },
  {
    name: "男性スマート・寒い", 
    userProfile: { gender: "male" as const, age: 30 },
    weather: { temperature: 10, weather: "曇り", location: "東京", timestamp: new Date().toISOString() },
    style: "smart" as const
  },
  {
    name: "女性ストリート・中間",
    userProfile: { gender: "female" as const, age: 22 },
    weather: { temperature: 18, weather: "晴れ", location: "東京", timestamp: new Date().toISOString() },
    style: "street" as const
  }
];

for (const testCase of testCases) {
  console.log(`\n📋 ${testCase.name} テスト:`);
  console.log(`- ユーザー: ${testCase.userProfile.gender}, ${testCase.userProfile.age}歳`);
  console.log(`- 天気: ${testCase.weather.weather}, ${testCase.weather.temperature}°C`);
  console.log(`- スタイル: ${testCase.style}`);
  
  try {
    const outfit = await AIService.generateOutfitSuggestion(
      testCase.userProfile,
      testCase.weather,
      testCase.style,
      []
    );
    
    console.log(`\n✅ 結果:`);
    console.log(`📷 画像URL: ${outfit.imageUrl}`);
    console.log(`📝 説明: ${outfit.description}`);
    console.log(`💡 スタイリングポイント: ${outfit.stylePoint}`);
    console.log(`🌤️ 天気への配慮: ${outfit.weatherNote}`);
    console.log(`👗 アイテム:`);
    outfit.items.forEach((item, index) => {
      console.log(`   ${index + 1}. ${item.category}: ${item.name} (${item.color})`);
    });
    
    // 整合性チェック
    console.log(`\n🔍 整合性チェック:`);
    
    // スタイル整合性
    const styleMatch = outfit.style === testCase.style;
    console.log(`- スタイル整合性: ${styleMatch ? '✅' : '❌'} (期待: ${testCase.style}, 実際: ${outfit.style})`);
    
    // 気温整合性
    const tempMatch = outfit.temperature === testCase.weather.temperature;
    console.log(`- 気温整合性: ${tempMatch ? '✅' : '❌'} (期待: ${testCase.weather.temperature}°C, 実際: ${outfit.temperature}°C)`);
    
    // 天気整合性
    const weatherMatch = outfit.weather === testCase.weather.weather;
    console.log(`- 天気整合性: ${weatherMatch ? '✅' : '❌'} (期待: ${testCase.weather.weather}, 実際: ${outfit.weather})`);
    
    // 画像URL構成確認
    const urlParts = outfit.imageUrl.match(/photo-([^?]+)/);
    console.log(`- 画像ID: ${urlParts ? urlParts[1] : 'N/A'}`);
    
  } catch (error: any) {
    console.error(`❌ ${testCase.name} テスト失敗:`, error.message);
  }
  
  console.log("\n" + "=".repeat(60));
}

console.log("\n🏁 テスト完了");
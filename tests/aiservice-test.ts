// 修正されたAIServiceのテスト
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// 環境変数を読み込み
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, "../.env.local") });

import { AIService } from "../services/aiService";

async function testAIService(): Promise<void> {
  console.log("🧪 修正されたAIService テスト");
  console.log("========================================");
  
  try {
    // 基本的なフォールバック提案テスト
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
    
    const fallbackOutfit = AIService.getFallbackSuggestion(
      testUserProfile,
      testWeather,
      testStyle
    );
    
    console.log("✅ フォールバック提案生成成功!");
    console.log(`📝 説明: ${fallbackOutfit.description}`);
    console.log(`👗 アイテム数: ${fallbackOutfit.items.length}`);
    
  } catch (error) {
    console.error("❌ テスト失敗:", error);
  }
}

testAIService().catch(console.error);
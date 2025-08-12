// 修正されたAIServiceのテスト
const dotenv = require("dotenv");
const path = require("path");

// 環境変数を読み込み
dotenv.config({ path: path.join(__dirname, "../.env.local") });

// ⚠️ aiService.jsがES modulesなので一時的にコメントアウト
// const { AIService } = require("../services/aiService.js");

async function testAIService() {
  console.log("🧪 修正されたAIService テスト");
  console.log("========================================");
  
  console.log("⚠️ aiService.jsがES modulesのため、一時的にスキップします");
  console.log("Expo起動後に再テストしてください");
}

testAIService().catch(console.error);
// 環境変数のデバッグテスト
const dotenv = require("dotenv");
const path = require("path");

// 環境変数を読み込み
dotenv.config({ path: path.join(__dirname, "../.env.local") });

console.log("🔍 環境変数デバッグテスト");
console.log("================================");

// .env.local ファイルの内容確認
const fs = require("fs");
try {
  const envContent = fs.readFileSync(path.join(__dirname, "../.env.local"), "utf8");
  console.log("📄 .env.local ファイル内容:");
  console.log(envContent);
  console.log("--------------------------------");
} catch (error) {
  console.error("❌ .env.local ファイル読み込みエラー:", error.message);
}

// 環境変数の確認
console.log("🌍 環境変数の状況:");
console.log("process.env.EXPO_PUBLIC_GEMINI_API_KEY:", process.env.EXPO_PUBLIC_GEMINI_API_KEY);
console.log("process.env.EXPO_PUBLIC_WEATHER_API_KEY:", process.env.EXPO_PUBLIC_WEATHER_API_KEY);

// すべてのEXPO関連環境変数
const expoVars = Object.keys(process.env).filter(key => key.startsWith('EXPO'));
console.log("📝 EXPO関連環境変数:", expoVars);

// aiService.js をインポートして確認
console.log("\n🔧 AIService の状況:");
try {
  const { AIService } = require("../services/aiService.js");
  console.log("AIService.API_KEY:", AIService.API_KEY);
  console.log("AIService.API_KEY の型:", typeof AIService.API_KEY);
  console.log("AIService.API_KEY が undefined か:", AIService.API_KEY === undefined);
  console.log("AIService.API_KEY が null か:", AIService.API_KEY === null);
  console.log("AIService.API_KEY の文字列長:", AIService.API_KEY ? AIService.API_KEY.length : "undefined");
} catch (error) {
  console.error("❌ AIService インポートエラー:", error.message);
}
// 環境変数のデバッグテスト
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { readFileSync } from "fs";

// 環境変数を読み込み
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, "../.env.local") });

console.log("🔍 環境変数デバッグテスト");
console.log("================================");

// .env.local ファイルの内容確認
try {
  const envContent = readFileSync(join(__dirname, "../.env.local"), "utf8");
  console.log("📄 .env.local ファイル内容:");
  console.log(envContent);
  console.log("--------------------------------");
} catch (error) {
  console.error("❌ .env.local ファイル読み込みエラー:", (error as Error).message);
}

// 環境変数の確認
console.log("🌍 環境変数の状況:");
console.log("process.env.EXPO_PUBLIC_GEMINI_API_KEY:", process.env.EXPO_PUBLIC_GEMINI_API_KEY);
console.log("process.env.EXPO_PUBLIC_WEATHER_API_KEY:", process.env.EXPO_PUBLIC_WEATHER_API_KEY);

// すべてのEXPO関連環境変数
const expoVars = Object.keys(process.env).filter(key => key.startsWith('EXPO'));
console.log("📝 EXPO関連環境変数:", expoVars);

// aiService.ts をインポートして確認
console.log("\n🔧 AIService の状況:");
try {
  const { AIService } = await import("../services/aiService");
  console.log("AIService をインポートしました");
  console.log("AIService のプロパティ:", Object.keys(AIService));
} catch (error) {
  console.error("❌ AIService インポートエラー:", (error as Error).message);
}